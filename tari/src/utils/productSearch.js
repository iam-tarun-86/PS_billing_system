/**
 * Product search, shared by the billing overlay and Product Manager.
 *
 * The shopkeeper uses the catalogue two different ways, and searching has to
 * serve both:
 *
 *   By CODE - codes are grouped by family, so M1x, M2x and M3x sit next to each
 *   other and neighbouring codes are related goods. Typing "M2" should put the
 *   cursor on M20 while leaving the rest of the catalogue in place, so he can
 *   arrow up into the M1 range and down into M3. Filtering here would throw away
 *   the very ordering he navigates by.
 *
 *   By NAME - "EGG" has no such neighbourhood. He wants the four egg products
 *   collected together, not highlighted one at a time inside 1,796 rows.
 *
 * So a code query jumps and a name query filters. Which one it is comes from the
 * data rather than from guessing at the shape of the text.
 */

/** Index of the first product whose code begins with the query, or -1. */
export const findCodeMatchIndex = (products, query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return -1;
  return (products || []).findIndex((p) =>
    String((p && p.code) || '').toLowerCase().startsWith(q)
  );
};

/**
 * Returns only the products that match, best first.
 *
 * Ordering is by tier alone. The caller passes a list already sorted by code and
 * Array.prototype.sort is stable, so products keep their code order inside each
 * tier without a secondary comparator.
 *
 * An empty query returns the input untouched.
 */
export const rankProducts = (products, query) => {
  const list = Array.isArray(products) ? products : [];
  const q = String(query || '').trim().toLowerCase();
  if (!q) return list;

  const matches = [];

  for (const p of list) {
    if (!p) continue;

    const code = String(p.code || '').toLowerCase();
    const name = String(p.name || '').toLowerCase();
    const tamilName = String(p.tamilName || '').toLowerCase();
    const group = String(p.group || 'General').toLowerCase();

    let tier;
    if (code === q) tier = 0;
    else if (code.startsWith(q)) tier = 1;
    else if (code.includes(q)) tier = 2;
    else if (name.startsWith(q) || tamilName.startsWith(q)) tier = 3;
    else if (name.includes(q) || tamilName.includes(q)) tier = 4;
    // Group is the weakest signal but both screens have always matched on it;
    // dropping it here would quietly remove a way of finding things.
    else if (group.includes(q)) tier = 5;
    else continue;

    matches.push({ product: p, tier });
  }

  matches.sort((a, b) => a.tier - b.tier);
  return matches.map((m) => m.product);
};

/**
 * Decides how a query should behave and returns everything the caller needs:
 *
 *   { mode: 'browse', list: <everything>,   index: -1 }  nothing typed
 *   { mode: 'jump',   list: <everything>,   index: n  }  a code starts with it
 *   { mode: 'filter', list: <ranked hits>,  index: 0  }  otherwise
 *
 * In jump mode the list is deliberately left whole: the caller moves the
 * highlight to `index` and the neighbouring codes stay visible either side.
 *
 * A code that matches nothing - "M99" - falls through to filter, which finds no
 * name either and yields an empty list, so the caller shows its empty state.
 */
export const searchProducts = (products, query) => {
  const list = Array.isArray(products) ? products : [];
  const q = String(query || '').trim();

  if (!q) return { mode: 'browse', list, index: -1 };

  const jumpIndex = findCodeMatchIndex(list, q);
  if (jumpIndex !== -1) return { mode: 'jump', list, index: jumpIndex };

  return { mode: 'filter', list: rankProducts(list, q), index: 0 };
};
