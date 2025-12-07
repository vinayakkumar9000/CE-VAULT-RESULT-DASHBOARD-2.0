import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callModelJSON } from '../lib/aiClient';
import { Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const jsonSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
        prediction: { type: Type.STRING },
        tips: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    };

    const data = await callModelJSON(prompt, jsonSchema);

    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Analysis API error:', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
