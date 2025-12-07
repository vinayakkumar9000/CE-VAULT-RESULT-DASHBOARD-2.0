import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callModel } from '../lib/aiClient.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const text = await callModel(prompt);

    return res.status(200).json({ text });
  } catch (err: any) {
    console.error('Subject API error:', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
