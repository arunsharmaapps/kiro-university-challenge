// All money is integer cents. Never use floats for currency.

/** Split totalCents across n people; remainder cents go to the first people. Sum is always exact. */
export function splitEqual(totalCents, n) {
  if (!Number.isInteger(totalCents) || totalCents < 0) throw new RangeError('totalCents must be a non-negative integer');
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  const base = Math.floor(totalCents / n);
  const extra = totalCents - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < extra ? 1 : 0));
}

/**
 * expenses: [{ paidBy, amountCents, participants: [name,...] }]
 * Returns { name: netCents } where positive = is owed money, negative = owes money.
 * test hook 
 */
export function computeBalances(expenses) {
  const balances = {};
  for (const { paidBy, amountCents, participants } of expenses) {
    if (!participants?.length) throw new RangeError('expense needs at least one participant');
    const shares = splitEqual(amountCents, participants.length);
    balances[paidBy] = (balances[paidBy] ?? 0) + amountCents;
    participants.forEach((p, i) => { balances[p] = (balances[p] ?? 0) - shares[i]; });
  }
  return balances;
}

/** Greedy settle-up: at most (people - 1) transfers. Returns [{ from, to, amountCents }]. */
export function settle(balances) {
  const debtors = [], creditors = [];
  for (const [name, v] of Object.entries(balances)) {
    if (v < 0) debtors.push({ name, amt: -v });
    else if (v > 0) creditors.push({ name, amt: v });
  }
  debtors.sort((a, b) => b.amt - a.amt || a.name.localeCompare(b.name));
  creditors.sort((a, b) => b.amt - a.amt || a.name.localeCompare(b.name));
  const transfers = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    transfers.push({ from: debtors[i].name, to: creditors[j].name, amountCents: pay });
    debtors[i].amt -= pay; creditors[j].amt -= pay;
    if (debtors[i].amt === 0) i++;
    if (creditors[j].amt === 0) j++;
  }
  return transfers;
}

export const formatCents = (c) => `$${(c / 100).toFixed(2)}`;
