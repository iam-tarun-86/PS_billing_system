/**
 * Units, and how to talk about the ones that were never resolved.
 *
 * 623 of the 1,803 products carry a code like "_1jn0soi55" instead of a unit. Those rows
 * were deleted from the old FoxPro unit master years ago while products kept pointing at
 * them, so there is no table left to recover the real unit from. Where the sales history
 * proved a product was weighed it has been repaired; the rest are shown as "not set" so
 * they can be corrected at the counter rather than silently priced wrong.
 */

export const UNIT_OPTIONS = ['kg', 'litre', 'piece', 'nos', 'packet', 'box', 'bag'];

/** Units sold by weight or volume, which bill in fractions and use slab pricing. */
export const MEASURED_UNITS = ['kg', 'litre'];

export const isUnresolvedUnit = (unit) => !unit || /^_/.test(String(unit));

export const isMeasuredUnit = (unit) => MEASURED_UNITS.includes(String(unit));

/** Full label for the product list and the edit form. */
export const unitLabel = (unit) => (isUnresolvedUnit(unit) ? '— not set —' : String(unit));

/** Compact label for the billing grid, where the column is only a few characters wide. */
export const billingUnitLabel = (unit) => {
  if (isUnresolvedUnit(unit)) return '?';
  if (unit === 'kg') return 'கிலோ';
  if (unit === 'piece') return 'NO';
  return String(unit);
};
