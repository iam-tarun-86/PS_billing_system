/**
 * Moves imported sales history out of the live database and into an archive file.
 *
 *   node scripts/archive_history.mjs --dry-run     # report only
 *   node scripts/archive_history.mjs               # archive everything before today
 *   node scripts/archive_history.mjs --before=01/08/2026
 *   node scripts/archive_history.mjs --restore     # put the archive back
 *
 * The 1,850 bills imported in August 2026 also live in the old FoxPro software, which the
 * shop still uses as the record for that period. Keeping the same bills in both places
 * invites someone to correct one and not the other, so the new app starts clean.
 *
 * Nothing is deleted. Archived bills are written to history_archive_<date>.json beside the
 * database and can be put back with --restore. Products, prices, slabs and settings are
 * untouched; only `transactions` moves.
 *
 * On --restore, item codes are remapped to the current catalogue: a product renamed in
 * Product Manager since the archive was written would otherwise leave its restored bills
 * pointing at a code that no longer exists. See buildCodeResolver below.
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

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const restore = args.includes('--restore');
const dbArg = args.find((a) => a.startsWith('--db='));
const beforeArg = args.find((a) => a.startsWith('--before='));
const dbPath = dbArg ? dbArg.slice('--db='.length) : DEFAULT_DB;

const mb = (b) => (b / 1048576).toFixed(2) + ' MB';

const todayDdMmYyyy = () => {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear()
  ].join('/');
};

/** dd/mm/yyyy -> sortable number, so bills can be compared by date. */
const dateKey = (ddmmyyyy) => {
  const [d, m, y] = String(ddmmyyyy || '').split('/');
  return Number(y || 0) * 10000 + Number(m || 0) * 100 + Number(d || 0);
};

const money = (v) => Number(v) || 0;
const sum = (list) => Math.round(list.reduce((s, t) => s + money(t.netTotal), 0) * 100) / 100;

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
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found: ' + dbPath);
    process.exit(1);
  }

  const dir = path.dirname(dbPath);
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const live = Array.isArray(db.transactions) ? db.transactions : [];

  if (restore) return doRestore(db, live, dir, dbPath);

  const cutoff = beforeArg ? beforeArg.slice('--before='.length) : todayDdMmYyyy();
  const cutoffKey = dateKey(cutoff);
  if (!cutoffKey) {
    console.error('Could not read the --before date. Expected dd/mm/yyyy.');
    process.exit(1);
  }

  const toArchive = live.filter((t) => dateKey(t.date) < cutoffKey);
  const toKeep = live.filter((t) => dateKey(t.date) >= cutoffKey);

  const dates = toArchive.map((t) => t.date).filter(Boolean);
  console.log('Database : ' + dbPath);
  console.log('Size     : ' + mb(fs.statSync(dbPath).size));
  console.log('Mode     : ' + (dryRun ? 'DRY RUN - nothing will be written' : 'ARCHIVE'));
  console.log('');
  console.log('Cutoff        : bills dated before ' + cutoff);
  console.log('To archive    : ' + toArchive.length + ' bills, Rs' + sum(toArchive).toFixed(2));
  if (dates.length) {
    const keys = toArchive.map((t) => dateKey(t.date));
    const oldest = toArchive[keys.indexOf(Math.min(...keys))];
    const newest = toArchive[keys.indexOf(Math.max(...keys))];
    console.log('Covering      : ' + oldest.date + '  to  ' + newest.date);
  }
  console.log('Staying live  : ' + toKeep.length + ' bills, Rs' + sum(toKeep).toFixed(2));
  console.log('Products      : ' + (db.products || []).length + ' (untouched)');

  if (toArchive.length === 0) {
    console.log('');
    console.log('Nothing to archive.');
    return;
  }

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Nothing was written.');
    return;
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const archivePath = path.join(dir, 'history_archive_' + stamp + '.json');

  // Never silently merge into an existing archive; keep each run separate.
  let finalPath = archivePath;
  let n = 2;
  while (fs.existsSync(finalPath)) {
    finalPath = path.join(dir, 'history_archive_' + stamp + '_' + n + '.json');
    n++;
  }

  writeAtomic(
    finalPath,
    JSON.stringify(
      {
        archivedOn: new Date().toISOString(),
        cutoff,
        note: 'Sales history moved out of the live database. These bills also exist in the old FoxPro software. Restore with: node scripts/archive_history.mjs --restore',
        count: toArchive.length,
        netTotal: sum(toArchive),
        transactions: toArchive
      },
      null,
      2
    )
  );

  writeAtomic(dbPath, JSON.stringify({ ...db, transactions: toKeep }));

  console.log('');
  console.log('Archive written : ' + finalPath);
  console.log('Database size   : ' + mb(fs.statSync(dbPath).size));
  console.log('Restore with    : node scripts/archive_history.mjs --restore');
}

/**
 * Where an archived item code should point today.
 *
 * Archived bills store the code a product had when the bill was written. If that
 * product has since been renamed in Product Manager, the archived code no longer
 * matches anything, so a restored bill would lose its unit and price type and
 * deleting it would fail to put the stock back.
 *
 * Two sources, strongest first:
 *
 *   settings.codeRenames  an exact record written at the moment of each rename.
 *                         Chains are followed, so A -> B -> C resolves to C.
 *   the product name      for renames made before that log existed. Only used
 *                         when exactly one product carries the name, because six
 *                         names in this catalogue are shared by two products.
 *
 * Anything neither can place is left untouched and reported, never guessed at.
 */
function buildCodeResolver(db) {
  const products = Array.isArray(db.products) ? db.products : [];
  const currentCodes = new Set(products.map((p) => String(p.code || '').toUpperCase()));

  // rename chains
  const renameMap = new Map();
  for (const entry of db.settings?.codeRenames || []) {
    if (entry && entry.from && entry.to) {
      renameMap.set(String(entry.from).toUpperCase(), String(entry.to));
    }
  }
  const followChain = (code) => {
    let current = code;
    const seen = new Set();
    while (renameMap.has(String(current).toUpperCase())) {
      const key = String(current).toUpperCase();
      if (seen.has(key)) break; // a loop was recorded; stop rather than spin
      seen.add(key);
      current = renameMap.get(key);
    }
    return current;
  };

  // names that identify exactly one product
  const nameCount = new Map();
  for (const p of products) {
    const key = String(p.name || '').trim().toUpperCase();
    if (key) nameCount.set(key, (nameCount.get(key) || 0) + 1);
  }
  const uniqueNameToCode = new Map();
  for (const p of products) {
    const key = String(p.name || '').trim().toUpperCase();
    if (key && nameCount.get(key) === 1) uniqueNameToCode.set(key, p.code);
  }

  return (item) => {
    const code = String((item && item.code) || '');
    if (currentCodes.has(code.toUpperCase())) return { code, via: 'unchanged' };

    const chained = followChain(code);
    if (currentCodes.has(String(chained).toUpperCase())) return { code: chained, via: 'rename log' };

    const byName = uniqueNameToCode.get(String((item && item.name) || '').trim().toUpperCase());
    if (byName) return { code: byName, via: 'product name' };

    return { code, via: 'unresolved' };
  };
}

function doRestore(db, live, dir, target) {
  const archives = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('history_archive_') && f.endsWith('.json'))
    .sort();

  if (archives.length === 0) {
    console.error('No history_archive_*.json found in ' + dir);
    process.exit(1);
  }

  const resolveCode = buildCodeResolver(db);
  const remapped = { 'rename log': 0, 'product name': 0 };
  const unresolved = new Map();

  const remapItems = (tx) => {
    if (!Array.isArray(tx.items)) return tx;
    let touched = false;
    const items = tx.items.map((item) => {
      const result = resolveCode(item);
      if (result.via === 'unchanged') return item;
      if (result.via === 'unresolved') {
        const key = String((item && item.code) || '(blank)');
        unresolved.set(key, (unresolved.get(key) || 0) + 1);
        return item;
      }
      remapped[result.via]++;
      touched = true;
      return { ...item, code: result.code };
    });
    return touched ? { ...tx, items } : tx;
  };

  const liveIds = new Set(live.map((t) => t.id));
  let restored = [];
  for (const file of archives) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const tx of data.transactions || []) {
      if (!liveIds.has(tx.id)) {
        liveIds.add(tx.id);
        restored.push(remapItems(tx));
      }
    }
  }

  const merged = [...restored, ...live].sort(
    (a, b) => dateKey(a.date) - dateKey(b.date) || String(a.timestamp).localeCompare(String(b.timestamp))
  );

  console.log('Archives found  : ' + archives.join(', '));
  console.log('Bills restored  : ' + restored.length + ', Rs' + sum(restored).toFixed(2));
  console.log('Live total      : ' + merged.length + ' bills, Rs' + sum(merged).toFixed(2));
  console.log('');
  console.log('Item codes remapped to the current catalogue:');
  console.log('  from the rename log : ' + remapped['rename log']);
  console.log('  matched by name     : ' + remapped['product name']);
  if (unresolved.size) {
    const total = [...unresolved.values()].reduce((a, b) => a + b, 0);
    console.log('  STILL UNRESOLVED    : ' + total + ' line item(s) across ' + unresolved.size + ' code(s)');
    for (const [code, n] of [...unresolved].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
      console.log('      ' + code + '  x' + n);
    }
    console.log('  These keep their original code. They still print correctly - each');
    console.log('  line carries its own name, rate and unit - but stock will not be');
    console.log('  restored for them if such a bill is deleted.');
  } else {
    console.log('  unresolved          : none');
  }

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Nothing was written.');
    return;
  }

  writeAtomic(target, JSON.stringify({ ...db, transactions: merged }));
  console.log('');
  console.log('Restored. The archive files were left in place.');
}

main();
