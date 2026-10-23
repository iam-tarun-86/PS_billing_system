import { round2 } from '../utils/normalize';
import { calculateBillTotals } from './pricing';

export const getTodayDateString = (now = new Date()) =>
  `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

/** The persisted daily counter wins; old databases fall back to the highest printed number. */
export const getNextBillNumber = (database, now = new Date()) => {
  if (!database) return 1;
  const date = getTodayDateString(now);
  const counter = database.settings?.billCounter;
  if (counter && counter.date === date) return counter.next;
  const today = (database.transactions || []).filter(tx => tx.date === date);
  return today.length ? Math.max(...today.map(tx => Number(tx.invoiceNo) || 0)) + 1 : 1;
};

// Preserve the current first-matching-row stock policy during this structural
// refactor. Aggregating repeated item codes is a separate business-rule change.
const adjustStock = (products, oldItems, newItems) => products.map(product => {
  const oldItem = oldItems.find(item => item.code === product.code);
  const newItem = newItems.find(item => item.code === product.code);
  if (!oldItems.length && !newItem) return product;
  let stock = product.currentStock;
  if (oldItem) stock += parseFloat(oldItem.qty) || 0;
  if (newItem) stock -= parseFloat(newItem.qty) || 0;
  return { ...product, currentStock: stock };
});

/** Build one complete snapshot; persistence and UI effects belong to the caller. */
export const prepareBillSave = ({ database, billItems, customer, charges, transactionIndex = null, now = new Date() }) => {
  const items = billItems.filter(item => item.code !== '');
  if (!items.length) throw new Error('Cannot save an empty bill');
  const totals = calculateBillTotals({ items: billItems, ...charges });
  const fields = {
    customerName: customer.name,
    customerMobile: customer.mobile,
    customerAddress: customer.address,
    items,
    grossTotal: round2(totals.grossTotal),
    discount: round2(charges.discount),
    rent: round2(charges.rent),
    coolie: round2(charges.coolie),
    advance: round2(charges.advance),
    roundOff: totals.roundOff,
    netTotal: round2(totals.netTotal)
  };
  if (transactionIndex !== null) {
    const original = database.transactions[transactionIndex];
    if (!original) throw new Error('Saved bill no longer exists');
    const invoice = { ...original, ...fields };
    const transactions = [...database.transactions];
    transactions[transactionIndex] = invoice;
    return { invoice, isEdit: true, database: {
      ...database,
      products: adjustStock(database.products, original.items, items),
      transactions
    } };
  }
  const invoiceNo = getNextBillNumber(database, now);
  const date = getTodayDateString(now);
  const invoice = {
    id: `b_${now.getTime()}_${invoiceNo}`, invoiceNo, timestamp: now.toISOString(),
    year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), date,
    time: now.toLocaleTimeString('en-US', { hour12: false }),
    ...fields, operator: 'PS'
  };
  return { invoice, isEdit: false, nextBillNumber: invoiceNo + 1, database: {
    ...database,
    products: adjustStock(database.products, [], items),
    transactions: [...database.transactions, invoice],
    settings: { ...database.settings, billCounter: { date, next: invoiceNo + 1 } }
  } };
};

/** Delete by immutable identity; printed numbers repeat between different days. */
export const prepareBillDeletion = (database, id) => {
  const invoice = database.transactions.find(tx => tx.id === id);
  if (!invoice) return null;
  return {
    ...database,
    products: adjustStock(database.products, invoice.items, []),
    transactions: database.transactions.filter(tx => tx.id !== id)
  };
};

/** A rename updates live invoice references and records archive restoration metadata. */
export const prepareProductSave = ({ database, product, originalCode, isAddingNew, now = new Date() }) => {
  const isRename = !isAddingNew && originalCode && originalCode !== product.code;
  let renamedLines = 0;
  let transactions = database.transactions;
  if (isRename) {
    const matchesOld = item => String(item?.code || '').toLowerCase() === String(originalCode).toLowerCase();
    transactions = (database.transactions || []).map(tx => {
      if (!Array.isArray(tx.items) || !tx.items.some(matchesOld)) return tx;
      return { ...tx, items: tx.items.map(item => {
        if (!matchesOld(item)) return item;
        renamedLines++;
        return { ...item, code: product.code };
      }) };
    });
  }
  return { isRename, renamedLines, database: {
    ...database,
    products: isAddingNew ? [...database.products, product]
      : database.products.map(p => p.code === originalCode ? product : p),
    settings: isRename ? { ...database.settings, codeRenames: [
      ...(database.settings?.codeRenames || []),
      { from: originalCode, to: product.code, at: now.toISOString() }
    ] } : database.settings,
    ...(isRename ? { transactions } : {})
  } };
};
