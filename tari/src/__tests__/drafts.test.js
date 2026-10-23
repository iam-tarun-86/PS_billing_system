import { expect, it } from 'vitest';
import { createEmptyRow, draftCursor, transactionToDraft } from '../billing/drafts';

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
  draft.billItems[0].qty = '0.100';
  expect(invoice.items[0].qty).toBe(0.05);
  expect(draft).toMatchObject({ customerSlNo: '12', activeRowIndex: 0, activeColumn: 'code', addressLine1: 'Test' });
});
