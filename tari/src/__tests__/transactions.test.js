import { describe, expect, it } from 'vitest';
import { getNextBillNumber, getTodayDateString, prepareBillDeletion, prepareBillSave, prepareProductSave } from '../billing/transactions';

const now = new Date(2026, 9, 23, 13, 0, 0);
const fixture = () => ({
  products: [
    { code: 'M.82', name: 'T.T.', unit: 'kg', sellingPrice: 380, currentStock: 10 },
    { code: 'M82', name: 'BARLEY', sellingPrice: 50, currentStock: 20 }
  ],
  transactions: [
    { id: 'a', invoiceNo: 8, date: getTodayDateString(now), timestamp: 'original', operator: 'PS',
      grossTotal: 190, netTotal: 190, items: [{ code: 'M.82', qty: 0.5, totalPrice: 190 }] },
    { id: 'b', invoiceNo: 8, date: '22/10/2026', netTotal: 50, items: [{ code: 'M82', qty: 1, totalPrice: 50 }] }
  ],
  settings: { shopName: 'TEST', billCounter: { date: getTodayDateString(now), next: 10 } }
});
const request = db => ({ database: db, now, billItems: [
  { code: 'M.82', qty: 0.05, priceType: 'Quantity', totalPrice: 24.5, overridePrice: '490.00' },
  { code: '', totalPrice: 0 }
], customer: { name: 'CASH', mobile: '', address: '' }, charges: { discount: '', rent: '', coolie: '', advance: '' } });

describe('transaction module', () => {
  it('sums every repeated-code row for new saves, edits and deletions', () => {
    const db = fixture();
    db.transactions[0].items = [
      { code: 'M.82', qty: 2, totalPrice: 20 },
      { code: 'M.82', qty: 3, totalPrice: 30 }
    ];
    const rows = [{ code: 'M.82', qty: 2, totalPrice: 20 }, { code: 'M.82', qty: 4, totalPrice: 40 }];
    const edit = prepareBillSave({ ...request(db), transactionIndex: 0, billItems: rows });
    expect(edit.database.products[0].currentStock).toBe(9); // 10 + (2+3) - (2+4)
    expect(edit.invoice.items).toHaveLength(2);
    const added = prepareBillSave({ ...request(db), billItems: rows });
    expect(added.database.products[0].currentStock).toBe(4);
    expect(prepareBillDeletion(db, 'a').products[0].currentStock).toBe(15);
    const unchanged = prepareBillSave({ ...request(db), transactionIndex: 0, billItems: db.transactions[0].items });
    expect(unchanged.database.products[0].currentStock).toBe(10);
  });
  it('excludes cleared-code amounts from saved totals and stock', () => {
    const db = fixture();
    const change = prepareBillSave({ ...request(db), transactionIndex: 0,
      billItems: [{ code: 'M82', qty: 1, totalPrice: 50 }, { code: '', qty: 10, totalPrice: 999 }] });
    expect(change.invoice.items).toHaveLength(1);
    expect(change.invoice).toMatchObject({ grossTotal: 50, netTotal: 50 });
    expect(change.database.products.map(p => p.currentStock)).toEqual([10.5, 19]);
  });
  it('does not drift fractional stock when an unchanged bill is saved again', () => {
    const db = fixture();
    db.products[0].currentStock = 0.1;
    db.transactions[0].items[0].qty = 0.2;
    const saved = prepareBillSave({ ...request(db), transactionIndex: 0, billItems: db.transactions[0].items });
    expect(saved.database.products[0].currentStock).toBe(0.1);
  });
  it('builds an immutable invoice/stock/counter snapshot without mutating input', () => {
    const db = fixture(), before = structuredClone(db);
    const change = prepareBillSave(request(db));
    expect(db).toEqual(before);
    expect(change.invoice).toMatchObject({ id: `b_${now.getTime()}_10`, invoiceNo: 10, grossTotal: 24.5, netTotal: 25, roundOff: 0.5 });
    expect(change.invoice.items).toHaveLength(1);
    expect(change.database.products.map(p => p.currentStock)).toEqual([9.95, 20]);
    expect(change.database.transactions.slice(0, 2)).toEqual(db.transactions);
    expect(change.database.settings.billCounter.next).toBe(11);
    expect(change.database.settings.shopName).toBe('TEST');
  });
  it('keeps identity/date/operator when editing and reverses the old quantity before deducting the new', () => {
    const db = fixture();
    const change = prepareBillSave({ ...request(db), transactionIndex: 0 });
    expect(change.invoice).toMatchObject({ id: 'a', invoiceNo: 8, timestamp: 'original', operator: 'PS' });
    expect(change.database.products[0].currentStock).toBe(10.45);
    expect(change.database.transactions).toHaveLength(2);
    expect(change.database.transactions[1]).toEqual(db.transactions[1]);
    expect(change.database.settings).toEqual(db.settings);
  });
  it('rejects empty or missing saved bills instead of producing an invalid snapshot', () => {
    expect(() => prepareBillSave({ ...request(fixture()), billItems: [] })).toThrow('empty');
    expect(() => prepareBillSave({ ...request(fixture()), transactionIndex: 99 })).toThrow('no longer exists');
  });
  it('deletes by ID, preserves same-number invoices and never rewinds the counter', () => {
    const db = fixture(), before = structuredClone(db);
    const next = prepareBillDeletion(db, 'a');
    expect(next.transactions.map(tx => tx.id)).toEqual(['b']);
    expect(next.products.map(p => p.currentStock)).toEqual([10.5, 20]);
    expect(next.settings).toEqual(db.settings);
    expect(prepareBillDeletion(db, 'missing')).toBeNull();
    expect(db).toEqual(before);
  });
  it('cascades a code rename only to matching item codes, preserving monetary history and punctuation', () => {
    const db = fixture(), before = structuredClone(db);
    const product = { ...db.products[0], code: 'M.83' };
    const change = prepareProductSave({ database: db, product, originalCode: 'M.82', isAddingNew: false, now });
    expect(change.renamedLines).toBe(1);
    expect(change.database.transactions[0].items[0]).toEqual({ ...db.transactions[0].items[0], code: 'M.83' });
    expect(change.database.transactions[0].netTotal).toBe(190);
    expect(change.database.transactions[1]).toEqual(db.transactions[1]);
    expect(change.database.products[1].code).toBe('M82');
    expect(change.database.settings.codeRenames).toEqual([{ from: 'M.82', to: 'M.83', at: now.toISOString() }]);
    expect(db).toEqual(before);
  });
  it('ordinary product edits leave every historical invoice and counter unchanged', () => {
    const db = fixture();
    const change = prepareProductSave({ database: db, product: { ...db.products[0], sellingPrice: 400 }, originalCode: 'M.82', isAddingNew: false, now });
    expect(change.isRename).toBe(false);
    expect(change.database.transactions).toBe(db.transactions);
    expect(change.database.settings).toBe(db.settings);
    expect(db.products[0].sellingPrice).toBe(380);
  });
  it('appends new products without touching invoice history', () => {
    const db = fixture(), product = { code: 'TEST', sellingPrice: 5, currentStock: 1 };
    const change = prepareProductSave({ database: db, product, isAddingNew: true, now });
    expect(change.database.products).toHaveLength(3);
    expect(change.database.transactions).toBe(db.transactions);
  });
  it('falls back to max printed number, then resets for a new day', () => {
    const db = fixture();
    expect(getNextBillNumber(db, now)).toBe(10);
    delete db.settings.billCounter;
    expect(getNextBillNumber(db, now)).toBe(9);
    expect(getNextBillNumber(db, new Date(2026, 9, 24))).toBe(1);
    expect(getNextBillNumber(null, now)).toBe(1);
  });
});
