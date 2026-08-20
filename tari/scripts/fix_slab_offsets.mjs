/**
 * Corrects the sign of slab offsets carried over from the FoxPro import.
 *
 *   node scripts/fix_slab_offsets.mjs --dry-run
 *   node scripts/fix_slab_offsets.mjs
 *
 * THE BUG
 * The old system stores its slab differential in IM012026.DBF as WRATE1..WRATE4
 * and applies it as  effectiveRate = SRATE - WRATE.  JEERA (M47) has base 380 and
 * WRATE1 = -110, so the shop charges 380 - (-110) = 490/kg, and 50g costs Rs24.50.
 *
 * import_old_data.py copied WRATE straight into `offset`, but the app applies
 * sellingPrice + offset, giving 380 + (-110) = 270/kg and Rs13.50 for the same 50g -
 * undercharging by Rs11 on every small sale of an expensive spice.
 *
 * Confirmed against 1,850 real bills: of the slab bands with sales history, 57 match
 * the negated offset and 0 match the current one.
 *
 * WHAT THIS CHANGES
 * Only slabs that still match the FoxPro source exactly (same quantities, same
 * values) are negated - those are provably untouched import artefacts. Any slab a
 * human has since edited in the app no longer matches the DBF and is left alone, so
 * hand-tuned prices are never flipped.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const APPDIR = path.join(os.homedir(), 'AppData', 'Roaming', 'com.perumalstores.psbilling');
const DEFAULT_DB = path.join(APPDIR, 'database.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dbArg = args.find((a) => a.startsWith('--db='));
const dbPath = dbArg ? dbArg.slice('--db='.length) : DEFAULT_DB;

const DBF_CANDIDATES = [
  'Old_sms/Sms3/Data/IM012026.DBF',
  'Old_sms/SMS/data/IM012026.DBF'
];

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

const near = (a, b) => Math.abs(Number(a) - Number(b)) < 0.0005;

/** The slab set exactly as the FoxPro master holds it. */
function dbfSlabs(row) {
  const out = [];
  for (let i = 1; i <= 4; i++) {
    const q = Number(row['WQ' + i]);
    const r = Number(row['WRATE' + i]);
    if (q > 0) out.push({ qtyLimit: q, offset: r });
  }
  return out;
}

/** True when the product's slabs are still byte-for-byte the imported ones. */
function matchesImport(slabs, source) {
  if (!Array.isArray(slabs) || slabs.length !== source.length) return false;
  const a = [...slabs].sort((x, y) => x.qtyLimit - y.qtyLimit);
  const b = [...source].sort((x, y) => x.qtyLimit - y.qtyLimit);
  return a.every((s, i) => near(s.qtyLimit, b[i].qtyLimit) && near(s.offset, b[i].offset));
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
  const dbfPath = DBF_CANDIDATES.find((p) => fs.existsSync(p));
  if (!dbfPath) {
    console.error('Could not find IM012026.DBF. Run this from the project root.');
    process.exit(1);
  }
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found: ' + dbPath);
    process.exit(1);
  }

  const bySourceCode = new Map();
  for (const row of readDbf(dbfPath)) {
    const code = (row.CODE || '').trim();
    if (code) bySourceCode.set(code.toUpperCase(), row);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  console.log('Database   : ' + dbPath);
  console.log('FoxPro src : ' + dbfPath);
  console.log('Mode       : ' + (dryRun ? 'DRY RUN - nothing will be written' : 'APPLY'));
  console.log('');

  const fixed = [];
  const skippedEdited = [];
  let untouchedZero = 0;

  const products = db.products.map((p) => {
    const slabs = p.slabs || [];
    if (!slabs.some((s) => Number(s.offset) !== 0)) {
      untouchedZero++;
      return p;
    }

    const row = bySourceCode.get(String(p.code).toUpperCase());
    const source = row ? dbfSlabs(row) : [];

    if (!source.length || !matchesImport(slabs, source)) {
      skippedEdited.push(p.code + '  ' + p.name);
      return p;
    }

    const corrected = slabs.map((s) => ({ ...s, offset: -Number(s.offset) }));
    const band = corrected.find((s) => Number(s.offset) !== 0);
    fixed.push({
      code: p.code,
      name: p.name,
      base: p.sellingPrice,
      qty: band.qtyLimit,
      was: p.sellingPrice + -Number(band.offset),
      now: p.sellingPrice + Number(band.offset)
    });
    return { ...p, slabs: corrected };
  });

  console.log('products with all-zero offsets, untouched : ' + untouchedZero);
  console.log('products corrected                        : ' + fixed.length);
  console.log('products skipped (edited since import)    : ' + skippedEdited.length);
  for (const s of skippedEdited) console.log('    skipped: ' + s);
  console.log('');
  console.log('code   product                base     was ->  now   (at the first slab)');
  for (const f of fixed) {
    console.log(
      f.code.padEnd(6) +
        f.name.slice(0, 22).padEnd(23) +
        String(f.base).padStart(6) +
        '  Rs' + String(f.was).padStart(6) +
        ' -> Rs' + String(f.now).padStart(6) +
        '   at ' + f.qty * 1000 + 'g'
    );
  }

  // ---- validate against what the shop really charged ----------------------------
  const archive = path.join(APPDIR, 'history_archive_2026-08-20.json');
  if (fs.existsSync(archive)) {
    const hist = JSON.parse(fs.readFileSync(archive, 'utf8'));
    const real = new Map();
    for (const t of hist.transactions) {
      for (const i of t.items) {
        const k = String(i.code).toUpperCase() + '@' + Number(i.qty);
        if (!real.has(k)) real.set(k, []);
        real.get(k).push(Number(i.overridePrice));
      }
    }
    const mode = (arr) => {
      const m = new Map();
      for (const v of arr) m.set(v, (m.get(v) || 0) + 1);
      return [...m].sort((a, b) => b[1] - a[1])[0][0];
    };

    let before = 0;
    let after = 0;
    let checked = 0;
    for (const p of products) {
      const old = db.products.find((x) => x.code === p.code);
      for (const s of p.slabs || []) {
        const obs = real.get(String(p.code).toUpperCase() + '@' + Number(s.qtyLimit));
        if (!obs || !obs.length) continue;
        const common = mode(obs);
        const oldSlab = (old.slabs || []).find((o) => near(o.qtyLimit, s.qtyLimit));
        if (!oldSlab) continue;
        checked++;
        if (near(p.sellingPrice + Number(oldSlab.offset), common)) before++;
        if (near(p.sellingPrice + Number(s.offset), common)) after++;
      }
    }
    console.log('');
    console.log('Validation against ' + hist.count + ' real bills:');
    console.log('  slab bands with sales history      : ' + checked);
    console.log('  matching the charged rate BEFORE   : ' + before);
    console.log('  matching the charged rate AFTER    : ' + after);
    if (after <= before) {
      console.error('');
      console.error('ABORTING - the correction does not improve agreement with real sales.');
      process.exit(1);
    }
  }

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Nothing was written.');
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(dbPath, dbPath.replace(/\.json$/, '') + '.pre-slabfix.' + stamp + '.json');
  writeAtomic(dbPath, JSON.stringify({ ...db, products }));
  console.log('');
  console.log('Applied. ' + fixed.length + ' products corrected.');
}

main();
