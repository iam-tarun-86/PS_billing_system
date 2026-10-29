import { round2 } from '../utils/normalize';
import { getBillItems } from './drafts';

/** Product editor preview uses the selected slab's explicit offset. */
export const calculateSlabPricePreview = (basePrice, qty, offset) => {
  const parsedQty = qty === '' ? 0 : parseFloat(qty) || 0;
  const parsedOffset = offset === '' ? 0 : parseFloat(offset) || 0;
  return ((basePrice + parsedOffset) * parsedQty).toFixed(2);
};

/** Slab limits are inclusive. Never reorder the product's stored slabs. */
export const getCalculatedPrice = (product, quantity) => {
  if (product.priceType !== 'Quantity' || !product.slabs || product.slabs.length === 0) {
    return product.sellingPrice;
  }
  const slab = [...product.slabs].sort((a, b) => a.qtyLimit - b.qtyLimit)
    .find(s => quantity <= s.qtyLimit);
  return slab ? product.sellingPrice + slab.offset : product.sellingPrice;
};

/** Preserve stored line totals (including overridden rates), then round the bill to rupees. */
export const calculateBillTotals = ({ items, discount, rent, coolie, advance }) => {
  const billItems = getBillItems(items);
  const grossTotal = billItems.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
  const rawNetTotal = Math.max(0, grossTotal - (parseFloat(discount) || 0)
    + (parseFloat(rent) || 0) + (parseFloat(coolie) || 0));
  const netTotal = Math.round(rawNetTotal);
  return {
    grossTotal,
    rawNetTotal,
    netTotal,
    roundOff: round2(netTotal - rawNetTotal),
    creditBalance: Math.max(0, netTotal - (parseFloat(advance) || 0)),
    itemCount: billItems.length,
    totalWeight: billItems.reduce((sum, item) => item.priceType === 'Quantity'
      ? sum + (parseFloat(item.qty) || 0) : sum, 0)
  };
};
