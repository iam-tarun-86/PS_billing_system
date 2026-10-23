import { describe, expect, it } from 'vitest';
import { calculateBillTotals, calculateSlabPricePreview, getCalculatedPrice } from '../billing/pricing';

describe('pricing module', () => {
  it('preserves explicit slab previews and blank-input formatting', () => {
    expect(calculateSlabPricePreview(380, '0.050', '110')).toBe('24.50');
    expect(calculateSlabPricePreview(380, '', '')).toBe('0.00');
    expect(calculateSlabPricePreview(380, '0.250', '-10')).toBe('92.50');
  });
  const product = { sellingPrice: 380, priceType: 'Quantity',
    slabs: [{ qtyLimit: 0.5, offset: 0 }, { qtyLimit: 0.1, offset: 110 }] };

  it.each([[0.05, 490], [0.1, 490], [0.1001, 380], [0.25, 380], [0.5, 380], [1, 380]])(
    'preserves the inclusive %s kg slab', (qty, rate) => expect(getCalculatedPrice(product, qty)).toBe(rate)
  );
  it('does not mutate slab order and ignores slabs for fixed prices', () => {
    const before = structuredClone(product);
    getCalculatedPrice(product, 0.05);
    expect(product).toEqual(before);
    expect(getCalculatedPrice({ ...product, priceType: 'Fixed' }, 0.05)).toBe(380);
    expect(getCalculatedPrice({ ...product, slabs: [] }, 0.05)).toBe(380);
  });
  it('keeps overridden line totals, charges, rounding, advance and item count separate', () => {
    const totals = calculateBillTotals({ items: [
      { code: 'M47', qty: '0.050', priceType: 'Quantity', totalPrice: 24.5 },
      { code: 'B01', qty: '2', priceType: 'Fixed', totalPrice: 79.2 },
      { code: '', qty: '', totalPrice: 0 }
    ], discount: '3.1', rent: '1.2', coolie: '2.4', advance: '50' });
    expect(totals.grossTotal).toBeCloseTo(103.7);
    expect(totals.rawNetTotal).toBeCloseTo(104.2);
    expect(totals).toMatchObject({ netTotal: 104, roundOff: -0.2, creditBalance: 54, itemCount: 2, totalWeight: 0.05 });
  });
  it('keeps negative net/credit balances clamped and ignores blank input', () => {
    expect(calculateBillTotals({ items: [], discount: '50', rent: '', coolie: '', advance: '10' }))
      .toMatchObject({ grossTotal: 0, netTotal: 0, creditBalance: 0 });
  });
});
