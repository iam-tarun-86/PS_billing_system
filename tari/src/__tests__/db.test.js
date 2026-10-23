// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { readDatabase, writeDatabase } from '../utils/db';
import { tauriAPI } from '../utils/tauriBridge';

vi.mock('../utils/tauriBridge', () => ({
  isTauri: () => true,
  tauriAPI: { readDatabase: vi.fn(), writeDatabase: vi.fn() }
}));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());

it('normalizes legacy line prices, fractional quantities and transaction identity on read', async () => {
  tauriAPI.readDatabase.mockResolvedValue({ products: [{ code: 'M47', unit: 'kg', priceType: 'Quantity' }],
    transactions: [{ invoiceNo: 1, date: '01/01/2026', grossTotal: 24.5, netTotal: 25,
      items: [{ code: 'M47', qty: 0.05, rate: 490, amount: 24.5 }] }] });
  const db = await readDatabase();
  expect(db.transactions[0].id).toBeTruthy();
  expect(db.transactions[0].items[0]).toMatchObject({ qty: 0.05, overridePrice: '490.00', totalPrice: 24.5, priceType: 'Quantity' });
  expect(db.transactions[0].netTotal).toBe(25);
});

it.each(['false', 'reject'])('retains an emergency copy without claiming success on native %s', async failure => {
  if (failure === 'false') tauriAPI.writeDatabase.mockResolvedValue({ success: false, error: 'Disk full' });
  else tauriAPI.writeDatabase.mockRejectedValue(new Error('Disk unavailable'));
  const draft = { products: [], transactions: [{ id: 'disposable-test-invoice' }] };
  expect(await writeDatabase(draft)).toBe(false);
  expect(JSON.parse(localStorage.getItem('express_bill_db_emergency'))).toEqual(draft);
});
