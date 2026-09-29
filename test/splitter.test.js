import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import { splitEqual, computeBalances, settle } from '../src/splitter.js';

// --- Example-based ---
test('splitEqual gives remainder cents to first people', () => {
  assert.deepEqual(splitEqual(100, 3), [34, 33, 33]);
});
test('settle on a simple case', () => {
  const b = computeBalances([{ paidBy: 'A', amountCents: 300, participants: ['A', 'B', 'C'] }]);
  assert.deepEqual(settle(b), [{ from: 'B', to: 'A', amountCents: 100 }, { from: 'C', to: 'A', amountCents: 100 }]);
});

// --- Property-based (fast-check) ---
const names = fc.constantFrom('Asha', 'Ben', 'Chi', 'Dev', 'Esha');
const expense = fc.record({
  paidBy: names,
  amountCents: fc.integer({ min: 0, max: 1_000_000 }),
  participants: fc.uniqueArray(names, { minLength: 1, maxLength: 5 }),
});
const expenses = fc.array(expense, { minLength: 1, maxLength: 20 });

// Feature: expense-splitting, Property 1: shares sum exactly to the total
test('P1: splitEqual shares sum to total and differ by at most 1 cent', () => {
  fc.assert(fc.property(fc.integer({ min: 0, max: 10_000_000 }), fc.integer({ min: 1, max: 50 }), (total, n) => {
    const s = splitEqual(total, n);
    assert.equal(s.length, n);
    assert.equal(s.reduce((a, b) => a + b, 0), total);
    assert.ok(Math.max(...s) - Math.min(...s) <= 1);
  }));
});

// Property 2: money is conserved — balances always net to zero
test('P2: balances sum to zero', () => {
  fc.assert(fc.property(expenses, (e) => {
    assert.equal(Object.values(computeBalances(e)).reduce((a, b) => a + b, 0), 0);
  }));
});

// Property 3: applying the settlement transfers zeroes every balance
test('P3: settle clears all balances', () => {
  fc.assert(fc.property(expenses, (e) => {
    const b = computeBalances(e);
    const after = { ...b };
    for (const t of settle(b)) { after[t.from] += t.amountCents; after[t.to] -= t.amountCents; }
    for (const v of Object.values(after)) assert.equal(v, 0);
  }));
});

// Property 4: at most (people - 1) transfers, all positive
test('P4: settle is minimal-ish and positive', () => {
  fc.assert(fc.property(expenses, (e) => {
    const b = computeBalances(e);
    const t = settle(b);
    assert.ok(t.length <= Math.max(0, Object.keys(b).length - 1));
    assert.ok(t.every((x) => x.amountCents > 0 && x.from !== x.to));
  }));
});
