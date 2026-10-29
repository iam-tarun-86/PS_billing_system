import { expect, it } from 'vitest';
import { createEmptyRow, draftCursor, isProductLoaded, markProductLoaded, transactionToDraft } from '../billing/drafts';

it('tracks the confirmed product independently of edited text without adding persisted fields', () => {
  const row = markProductLoaded({ ...createEmptyRow(), code: 'M47' });
  const keys = Object.keys(row);
  row.code = 'B01';
  expect(isProductLoaded(row, 'M47')).toBe(true);
  expect(isProductLoaded(row, 'B01')).toBe(false);
  expect(Object.keys(row)).toEqual(keys);
  expect(JSON.parse(JSON.stringify(row))).toEqual(row);
});

it('creates independent empty rows and clamps restored cursor positions', () => {
  const a = createEmptyRow(), b = createEmptyRow();
  a.code = 'TEST';
  expect(b.code).toBe('');
  expect(draftCursor({ billItems: [a], activeRowIndex: 10, activeColumn: 'rate' })).toEqual({ row: 0, column: 'rate' });
  expect(draftCursor({ billItems: [], activeRowIndex: -3 })).toEqual({ row: 0, column: 'code' });
});
it('copies saved line values without mutating the stored invoice', () => {
  const invoice = { invoiceNo: 12, customerName: 'CASH', customerAddress: 'Test',
    items: [{ code: 'M.82', qty: 0.05, totalPrice: 24.5, overridePrice: '490.00', priceType: 'Quantity', unit: 'kg' }] };
  const draft = transactionToDraft(invoice);
  expect(isProductLoaded(draft.billItems[0], 'M.82')).toBe(true);
  draft.billItems[0].qty = '0.100';
  expect(invoice.items[0].qty).toBe(0.05);
  expect(draft).toMatchObject({ customerSlNo: '12', activeRowIndex: 0, activeColumn: 'code', addressLine1: 'Test' });
});
