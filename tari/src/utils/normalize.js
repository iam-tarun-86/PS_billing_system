/**
 * Canonical shapes for transactions and their line items.
 *
 * The August 2026 FoxPro import wrote line items as { rate, amount, total }, while the
 * app writes { overridePrice, totalPrice, priceType, ... }. Reading a legacy item with
 * the app's field names yields undefined, which is how reprints came out as "NaN" and
 * how re-saving an old bill zeroed its totals.
 *
 * Everything that leaves readDatabase() passes through here, so the rest of the app only
 * ever sees one shape — including data restored from an old backup.
 */

/** Round money to paise. Keeps 130.00000000000003 out of the database. */
export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/** Build the lookup normalizeTransaction expects. */
export const indexProducts = (products = []) => {
  const map = new Map();
  for (const p of products) {
    if (p && p.code) map.set(String(p.code).toUpperCase(), p);
  }
  return map;
};

/**
 * Accepts either the app's item shape or the imported FoxPro shape and returns the
 * app's shape. Missing pieces are filled from the product master where possible.
 */
export const normalizeLineItem = (item, productsByCode) => {
  if (!item) return null;

  const product = productsByCode
    ? productsByCode.get(String(item.code || '').toUpperCase())
    : undefined;

  const qty = num(item.qty);

  // Unit rate: the app's overridePrice, else the legacy rate, else derive from the total.
  let rate;
  if (item.overridePrice !== undefined && item.overridePrice !== '') {
    rate = num(item.overridePrice);
  } else if (item.rate !== undefined) {
    rate = num(item.rate);
  } else if (item.sellingRate !== undefined) {
    rate = num(item.sellingRate);
  } else {
    const line = num(item.totalPrice ?? item.total ?? item.amount);
    rate = qty ? line / qty : 0;
  }

  // Line total: prefer a stored total over recomputing, so historical bills keep the
  // exact figure the customer was charged even if rate * qty would round differently.
  let total;
  if (item.totalPrice !== undefined && item.totalPrice !== null && item.totalPrice !== '') {
    total = num(item.totalPrice);
  } else if (item.total !== undefined && item.total !== null) {
    total = num(item.total);
  } else if (item.amount !== undefined && item.amount !== null) {
    total = num(item.amount);
  } else {
    total = rate * qty;
  }

  return {
    code: item.code || '',
    name: item.name || product?.name || '',
    tamilName: item.tamilName || product?.tamilName || '',
    qty,
    // unit and priceType describe the product, not this sale, so the master wins. The
    // imported items carry unresolved unit codes and no priceType at all; taking them
    // from the master means repairing a product also repairs how its old bills read.
    unit: product?.unit || item.unit || '',
    mrp: num(item.mrp ?? product?.mrp),
    basePrice: num(item.basePrice ?? rate),
    overridePrice: round2(rate).toFixed(2),
    totalPrice: round2(total),
    priceType: product?.priceType || item.priceType || 'Fixed',
    slabs: item.slabs || product?.slabs || []
  };
};

/**
 * Stable id for a bill that predates id assignment. Derived from its own content rather
 * than a counter, so running this twice produces the same id and never collides with a
 * newly issued one.
 */
export const legacyTransactionId = (tx, index) => {
  const stamp = tx.timestamp || `${tx.date || ''}T${tx.time || ''}`;
  return `legacy_${index}_${String(stamp).replace(/[^0-9]/g, '').slice(0, 14)}`;
};

/** Guarantee an id and canonical items on a single transaction. */
export const normalizeTransaction = (tx, productsByCode, index = 0) => {
  if (!tx) return null;

  const items = Array.isArray(tx.items)
    ? tx.items.map((it) => normalizeLineItem(it, productsByCode)).filter(Boolean)
    : [];

  return {
    ...tx,
    id: tx.id || legacyTransactionId(tx, index),
    items,
    grossTotal: round2(tx.grossTotal),
    discount: round2(tx.discount),
    rent: round2(tx.rent),
    coolie: round2(tx.coolie),
    advance: round2(tx.advance),
    netTotal: round2(tx.netTotal)
  };
};

/** Normalize a whole database in place of the raw parsed file. */
export const normalizeDatabase = (db) => {
  if (!db || typeof db !== 'object') return db;

  const productsByCode = indexProducts(db.products);
  const transactions = Array.isArray(db.transactions)
    ? db.transactions.map((tx, i) => normalizeTransaction(tx, productsByCode, i)).filter(Boolean)
    : [];

  return { ...db, transactions };
};
