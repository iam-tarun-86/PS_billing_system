/**
 * Ranked product search, shared by the billing overlay and Product Manager.
 *
 * The shopkeeper searches by item code first and by name second, so a code hit
 * must always outrank a name hit. Plain substring matching does not give that:
 * typing "M" matches 926 of 1,796 products, and 808 of those match only because
 * a name or group happens to contain the letter - which is how PUTTU MAAVU came
 * to sit above M01.
 */

/**
 * Returns only the products that match, best first.
 *
 * Ordering is by tier alone. The caller passes a list already sorted by code and
 * Array.prototype.sort is stable, so products keep their code order inside each
 * tier without a secondary comparator.
 *
 * An empty query returns the input untouched, so callers can use this
 * unconditionally and still show the full catalogue when nothing is typed.
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
