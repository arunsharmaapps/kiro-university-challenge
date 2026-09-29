#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { computeBalances, settle, formatCents } from './splitter.js';

const file = process.argv[2];
if (!file) { console.error('usage: splitsmart <expenses.json>'); process.exit(1); }
const expenses = JSON.parse(readFileSync(file, 'utf8'));
const balances = computeBalances(expenses);

console.log('Balances:');
for (const [n, v] of Object.entries(balances)) console.log(`  ${n.padEnd(8)} ${v >= 0 ? '+' : '-'}${formatCents(Math.abs(v))}`);
console.log('\nSettle up:');
const transfers = settle(balances);
if (!transfers.length) console.log('  All square!');
for (const t of transfers) console.log(`  ${t.from} pays ${t.to} ${formatCents(t.amountCents)}`);
