#!/usr/bin/env node
// Minimal dependency-free MCP server (JSON-RPC 2.0 over stdio) exposing SplitSmart tools.
import { createInterface } from 'node:readline';
import { computeBalances, settle } from '../src/splitter.js';

const expenseSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      paidBy: { type: 'string' },
      amountCents: { type: 'integer', minimum: 0 },
      participants: { type: 'array', items: { type: 'string' }, minItems: 1 },
    },
    required: ['paidBy', 'amountCents', 'participants'],
  },
};
const tools = [
  { name: 'compute_balances', description: 'Net balance in cents per person (positive = owed).',
    inputSchema: { type: 'object', properties: { expenses: expenseSchema }, required: ['expenses'] },
    run: ({ expenses }) => computeBalances(expenses) },
  { name: 'settle_up', description: 'Smallest set of transfers that settles all debts.',
    inputSchema: { type: 'object', properties: { expenses: expenseSchema }, required: ['expenses'] },
    run: ({ expenses }) => settle(computeBalances(expenses)) },
];

const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');

createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let req; try { req = JSON.parse(line); } catch { return; }
  const { id, method, params } = req;
  if (id === undefined) return; // notifications need no reply
  try {
    if (method === 'initialize') {
      send({ id, result: { protocolVersion: params?.protocolVersion ?? '2024-11-05',
        capabilities: { tools: {} }, serverInfo: { name: 'splitsmart', version: '1.0.0' } } });
    } else if (method === 'tools/list') {
      send({ id, result: { tools: tools.map(({ run, ...t }) => t) } });
    } else if (method === 'tools/call') {
      const tool = tools.find((t) => t.name === params.name);
      if (!tool) return send({ id, error: { code: -32602, message: `Unknown tool ${params.name}` } });
      send({ id, result: { content: [{ type: 'text', text: JSON.stringify(tool.run(params.arguments ?? {}), null, 2) }] } });
    } else if (method === 'ping') {
      send({ id, result: {} });
    } else {
      send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (e) {
    send({ id, result: { isError: true, content: [{ type: 'text', text: String(e.message) }] } });
  }
});
