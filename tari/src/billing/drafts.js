// The editable Code text can change before Enter confirms a new product. Keep
// the loaded identity separately, without adding fields to stored invoice items.
const loadedProductCodes = new WeakMap();

export const markProductLoaded = row => {
  loadedProductCodes.set(row, String(row.code).toLowerCase());
  return row;
};

export const isProductLoaded = (row, code) =>
  !!row && loadedProductCodes.get(row) === String(code).toLowerCase();

/** Canonical editable row shape, separate from persisted invoice normalization. */
export const createEmptyRow = () => ({
  code: '', name: '', tamilName: '', qty: '', unit: '', mrp: 0,
  basePrice: 0, overridePrice: '', totalPrice: 0, priceType: 'Fixed', slabs: []
});

export const draftCursor = draft => ({
  row: Math.min(Math.max(0, draft.activeRowIndex ?? 0), Math.max(0, (draft.billItems?.length || 0) - 1)),
  column: draft.activeColumn || 'code'
});

/** Map normalized saved items into editable copies; never edit a stored invoice in place. */
export const transactionToDraft = tx => ({
  billItems: tx.items.map(item => markProductLoaded({
    code: item.code || '', name: item.name || '', tamilName: item.tamilName || '',
    unit: item.unit || 'kg', qty: item.qty || '', mrp: item.mrp || 0,
    basePrice: item.basePrice || 0, sellingRate: item.sellingRate || item.overridePrice || '0.00',
    overridePrice: item.overridePrice || '0.00', totalPrice: item.totalPrice || 0,
    priceType: item.priceType || 'Quantity', slabs: item.slabs || []
  })),
  customerSlNo: tx.invoiceNo.toString(), customerType: 'CASH', customerName: tx.customerName || 'CASH',
  customerMobile: tx.customerMobile || '', addressLine1: tx.customerAddress || '', addressLine2: '', addressLine3: '',
  discount: tx.discount ? tx.discount.toString() : '', rent: tx.rent ? tx.rent.toString() : '',
  coolie: tx.coolie ? tx.coolie.toString() : '', advance: tx.advance ? tx.advance.toString() : '',
  rwMode: 'R', pricingMode: 'R', activeRowIndex: 0, activeColumn: 'code'
});
