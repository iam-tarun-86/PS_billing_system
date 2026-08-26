/**
 * Restores the shop's real product groups from the original FoxPro tables.
 *
 *   node scripts/restore_product_groups.mjs --dry-run
 *   node scripts/restore_product_groups.mjs
 *   node scripts/restore_product_groups.mjs --db=<path>
 *
 * The August import lost the grouping: products came across as "General" or as a
 * GST bucket like "05% 15121910", neither of which is how the shop thinks about
 * its stock. The real groups are still in the FoxPro data - IM012026.DBF holds
 * each item's IGROUPCODE, and IG012026.DBF maps that code to a name like
 * M.MALIGAI or W.WASINGSOAP/POWDER - so they can be joined straight back on.
 *
 * Only the `group` field is touched. Codes, names, prices, slabs, units, stock
 * and every transaction are left exactly as they are.
 *
 * Group names are written verbatim from the DBF, including the odd internal
 * double space in "01DALL ITEMS   RST" - that is what the shop's own data says.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const DEFAULT_DB = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  'com.perumalstores.psbilling',
  'database.json'
);

// Both installs carry the same tables and agree item for item; the first that
// exists is used.
const SOURCE_DIRS = ['Old_sms/SMS/data', 'Old_sms/Sms3/Data'];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dbArg = args.find((a) => a.startsWith('--db='));
const dbPath = dbArg ? dbArg.slice('--db='.length) : DEFAULT_DB;

function readDbf(file) {
  const b = fs.readFileSync(file);
  const nRec = b.readUInt32LE(4);
  const hLen = b.readUInt16LE(8);
  const rLen = b.readUInt16LE(10);
  const fields = [];
  let o = 32;
  while (b[o] !== 0x0d && o < hLen) {
    fields.push({ name: b.toString('latin1', o, o + 11).replace(/\0.*/, ''), len: b[o + 16] });
    o += 32;
  }
  const rows = [];
  for (let i = 0; i < nRec; i++) {
    let q = hLen + i * rLen + 1;
    const r = {};
    for (const f of fields) {
      r[f.name] = b.toString('latin1', q, q + f.len).trim();
      q += f.len;
    }
    rows.push(r);
  }
  return rows;
}

const writeAtomic = (target, text) => {
  const temp = target + '.writing';
  const fd = fs.openSync(temp, 'w');
  try {
    fs.writeFileSync(fd, text);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temp, target);
};

function main() {
  const sourceDir = SOURCE_DIRS.find(
    (d) => fs.existsSync(path.join(d, 'IM012026.DBF')) && fs.existsSync(path.join(d, 'IG012026.DBF'))
  );
  if (!sourceDir) {
    console.error('Could not find IM012026.DBF and IG012026.DBF. Run this from the project root.');
    process.exit(1);
  }
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found: ' + dbPath);
    process.exit(1);
  }

  // IGROUPCODE -> group name
  const groupByCode = new Map();
  for (const row of readDbf(path.join(sourceDir, 'IG012026.DBF'))) {
    const code = String(row.IGROUPCODE || '').trim().toUpperCase();
    if (code) groupByCode.set(code, String(row.IGROUP || '').trim());
  }

  // item CODE -> group name
  const groupByItem = new Map();
  let itemsWithoutGroup = 0;
  for (const row of readDbf(path.join(sourceDir, 'IM012026.DBF'))) {
    const itemCode = String(row.CODE || '').trim();
    const name = groupByCode.get(String(row.IGROUPCODE || '').trim().toUpperCase());
    if (!itemCode) continue;
    if (!name) {
      itemsWithoutGroup++;
      continue;
    }
    groupByItem.set(itemCode.toUpperCase(), name);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const products = Array.isArray(db.products) ? db.products : [];

  console.log('Database : ' + dbPath);
  console.log('Source   : ' + sourceDir);
  console.log('Mode     : ' + (dryRun ? 'DRY RUN - nothing will be written' : 'APPLY'));
  console.log('');
  console.log('FoxPro groups         : ' + groupByCode.size);
  console.log('Items mapped to one   : ' + groupByItem.size);
  console.log('Items with no group   : ' + itemsWithoutGroup);
  console.log('');

  let changed = 0;
  let unmatched = 0;
  const unmatchedCodes = [];
  const after = new Map();

  const updated = products.map((p) => {
    const real = groupByItem.get(String(p.code || '').toUpperCase());
    if (!real) {
      unmatched++;
      if (unmatchedCodes.length < 10) unmatchedCodes.push(p.code);
      after.set(p.group || 'General', (after.get(p.group || 'General') || 0) + 1);
      return p; // never blank a group we cannot replace
    }
    after.set(real, (after.get(real) || 0) + 1);
    if (p.group === real) return p;
    changed++;
    return { ...p, group: real };
  });

  console.log('Products              : ' + products.length);
  console.log('Groups rewritten      : ' + changed);
  console.log('Left alone (no match) : ' + unmatched + (unmatchedCodes.length ? '  e.g. ' + unmatchedCodes.join(', ') : ''));
  console.log('');
  console.log('Resulting groups, largest first:');
  for (const [name, n] of [...after].sort((a, b) => b[1] - a[1])) {
    console.log('  ' + String(n).padStart(4) + '  ' + name);
  }

  // ---- nothing but `group` may differ -----------------------------------------
  const problems = [];
  if (updated.length !== products.length) problems.push('product count changed');
  for (let i = 0; i < products.length; i++) {
    const a = { ...products[i], group: null };
    const b = { ...updated[i], group: null };
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      problems.push('product ' + products[i].code + ' changed in a field other than group');
      break;
    }
  }
  if (updated.some((p) => !p.group)) problems.push('a product ended up with no group');

  console.log('');
  if (problems.length) {
    console.error('ABORTING - integrity checks failed:');
    for (const p of problems) console.error('  - ' + p);
    process.exit(1);
  }
  console.log('Integrity checks      : only `group` differs, on every product');

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Nothing was written.');
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(dbPath, dbPath.replace(/\.json$/, '') + '.pre-groups.' + stamp + '.json');
  writeAtomic(dbPath, JSON.stringify({ ...db, products: updated }));

  console.log('');
  console.log('Applied. ' + changed + ' product group(s) restored.');
}

main();
