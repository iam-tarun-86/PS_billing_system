/**
 * One-time repair of the shop database.
 *
 *   node scripts/migrate_database.mjs --dry-run      # report only, writes nothing
 *   node scripts/migrate_database.mjs                # apply
 *   node scripts/migrate_database.mjs --db=<path>    # target a specific file
 *
 * Five repairs, all idempotent - running it twice changes nothing the second time:
 *
 *  1. Every bill gets an immutable `id`. Delete and edit match on this, because invoiceNo
 *     is not unique: the 1,850 imported bills share only 138 distinct numbers.
 *  2. Line items are rewritten from the FoxPro import shape { rate, amount, total } into
 *     the shape the app reads. Without this, reprints show NaN and re-saving an old bill
 *     rewrites its totals to zero.
 *  3. The `bills` array is dropped. It is a byte-identical copy of `transactions` that
 *     nothing in the app reads, and it doubles the file that is rewritten on every sale.
 *  4. `settings.billCounter` is seeded, so bill numbers come from a stored counter rather
 *     than from a row count.
 *  5. Products the sales history proves were sold in fractions are set to Quantity
 *     pricing, so they can take a decimal quantity again. Where such a product also has
 *     an unresolved unit code, its unit becomes kg.
 *
 *     Only history is used as evidence. The unit column itself cannot be trusted - 64
 *     products are labelled "litre" including rice and flour sold by the bag - so no
 *     product is retyped on the strength of its unit alone.
 *
 * Invoice numbers on existing bills are deliberately left alone: they match paper bills
 * already in customers' hands.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { normalizeTransaction, indexProducts, round2 } from '../src/utils/normalize.js';

const DEFAULT_DB = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  'com.perumalstores.psbilling',
  'database.json'
);

// The four weight tiers the August import gave every other kg product. Offset 0 leaves the
// price unchanged, so these are a template for the shopkeeper to edit, not a price change.
const STANDARD_SLABS = [
  { qtyLimit: 0.05, offset: 0 },
  { qtyLimit: 0.1, offset: 0 },
  { qtyLimit: 0.25, offset: 0 },
  { qtyLimit: 0.5, offset: 0 }
];

const UNRESOLVED_UNIT = /^_/;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dbArg = args.find((a) => a.startsWith('--db='));
const dbPath = dbArg ? dbArg.slice('--db='.length) : DEFAULT_DB;

const todayDdMmYyyy = () => {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear()
  ].join('/');
};

const isLegacyItem = (item) =>
  item &&
  item.totalPrice === undefined &&
  (item.total !== undefined || item.amount !== undefined || item.rate !== undefined);

const mb = (bytes) => (bytes / 1048576).toFixed(2) + ' MB';

function main() {
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found: ' + dbPath);
    process.exit(1);
  }

  const sizeBefore = fs.statSync(dbPath).size;
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const transactions = Array.isArray(db.transactions) ? db.transactions : [];
  const products = Array.isArray(db.products) ? db.products : [];

  console.log('Database : ' + dbPath);
  console.log('Size     : ' + mb(sizeBefore));
  console.log('Contents : ' + products.length + ' products, ' + transactions.length + ' bills');
  console.log('Mode     : ' + (dryRun ? 'DRY RUN - nothing will be written' : 'APPLY'));
  console.log('');

  // ---- 1 + 2. ids and canonical line items --------------------------------------
  let idsAdded = 0;
  let legacyItems = 0;

  for (const tx of transactions) {
    if (!tx.id) idsAdded++;
    for (const item of tx.items || []) {
      if (isLegacyItem(item)) legacyItems++;
    }
  }

  // ---- 5. pricing type, decided only by what the shop actually sold ---------------
  const soldFractionally = new Set();
  for (const tx of transactions) {
    for (const item of tx.items || []) {
      if (Number(item.qty) % 1 !== 0) soldFractionally.add(String(item.code).toUpperCase());
    }
  }

  const retyped = [];
  const repairedProducts = products.map((p) => {
    const weighed = soldFractionally.has(String(p.code).toUpperCase());
    if (!weighed || p.priceType === 'Quantity') return p;

    // Sold in fractions, so it must price by quantity. Its unit is only changed when the
    // import left an unresolved code there; a unit that already reads as a real unit is
    // left alone rather than guessed at.
    const unresolved = UNRESOLVED_UNIT.test(String(p.unit || ''));
    retyped.push(
      p.code.padEnd(7) + p.name.padEnd(26) +
      (unresolved ? 'unit -> kg, Quantity' : 'unit ' + p.unit + ' kept, -> Quantity')
    );
    return {
      ...p,
      unit: unresolved ? 'kg' : p.unit,
      priceType: 'Quantity',
      slabs: p.slabs && p.slabs.length ? p.slabs : STANDARD_SLABS.map((s) => ({ ...s }))
    };
  });

  // Bills are normalised against the REPAIRED product master, so a product corrected in
  // step 5 also fixes how its historical line items read. Doing this before the repair
  // would bake the old, wrong priceType into 14,011 rows.
  const productsByCode = indexProducts(repairedProducts);
  const repairedTransactions = transactions.map((tx, i) =>
    normalizeTransaction(tx, productsByCode, i)
  );

  // ---- 4. seed the bill counter --------------------------------------------------
  const today = todayDdMmYyyy();
  const todayBills = repairedTransactions.filter((t) => t.date === today);
  const nextNumber = todayBills.length
    ? Math.max(...todayBills.map((t) => Number(t.invoiceNo) || 0)) + 1
    : 1;
  const existingCounter = db.settings?.billCounter;
  const counterSeeded = !existingCounter || existingCounter.date !== today;

  // ---- 3. drop the duplicate bills array -----------------------------------------
  const billsDropped = Array.isArray(db.bills) ? db.bills.length : 0;
  const billsBytes = billsDropped ? Buffer.byteLength(JSON.stringify(db.bills)) : 0;

  const repaired = {
    ...db,
    products: repairedProducts,
    transactions: repairedTransactions,
    settings: {
      ...db.settings,
      billCounter: counterSeeded ? { date: today, next: nextNumber } : existingCounter
    }
  };
  delete repaired.bills;

  // ---- report --------------------------------------------------------------------
  console.log('1. bill ids added                      : ' + idsAdded);
  console.log('2. legacy line items converted         : ' + legacyItems);
  console.log('3. duplicate `bills` rows dropped      : ' + billsDropped + '  (' + mb(billsBytes) + ')');
  console.log(
    '4. bill counter                        : ' +
      (counterSeeded ? 'seeded to ' + today + ' #' + nextNumber : 'already set, left alone')
  );
  console.log('5. products set to Quantity pricing    : ' + retyped.length);
  for (const line of retyped) console.log('     ' + line);
  console.log('');

  // ---- integrity checks before anything is written --------------------------------
  const ids = repairedTransactions.map((t) => t.id);
  const allItems = repairedTransactions.flatMap((t) => t.items);
  const problems = [];
  if (repairedTransactions.length !== transactions.length) problems.push('transaction count changed');
  if (ids.some((id) => !id)) problems.push('a bill has no id');
  if (new Set(ids).size !== ids.length) problems.push('duplicate bill ids');
  if (allItems.some((i) => !Number.isFinite(i.totalPrice))) problems.push('a line item has a non-numeric total');
  if (repairedProducts.length !== products.length) problems.push('product count changed');

  // Money must be preserved exactly - the repair may not change a single rupee.
  const sumBefore = round2(transactions.reduce((s, t) => s + (Number(t.netTotal) || 0), 0));
  const sumAfter = round2(repairedTransactions.reduce((s, t) => s + t.netTotal, 0));
  if (sumBefore !== sumAfter) problems.push('net total changed: ' + sumBefore + ' -> ' + sumAfter);

  console.log('Recorded sales before : Rs' + sumBefore.toFixed(2));
  console.log('Recorded sales after  : Rs' + sumAfter.toFixed(2));

  if (problems.length) {
    console.error('');
    console.error('ABORTING - integrity checks failed:');
    for (const p of problems) console.error('  - ' + p);
    process.exit(1);
  }
  console.log('Integrity checks      : all passed');

  if (dryRun) {
    console.log('');
    console.log('Dry run complete. Nothing was written.');
    return;
  }

  // ---- back up, then write atomically ---------------------------------------------
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupPath = dbPath.replace(/\.json$/, '') + '.pre-migration.' + stamp + '.json';
  fs.copyFileSync(dbPath, backupPath);

  const tempPath = dbPath + '.migrating';
  const fd = fs.openSync(tempPath, 'w');
  try {
    fs.writeFileSync(fd, JSON.stringify(repaired));
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tempPath, dbPath);

  const sizeAfter = fs.statSync(dbPath).size;
  console.log('');
  console.log('Backup written : ' + backupPath);
  console.log('Database size  : ' + mb(sizeBefore) + '  ->  ' + mb(sizeAfter));
  console.log('Done.');
}

main();
