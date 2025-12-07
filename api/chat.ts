import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, studentData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    // Check for API key (Vercel AI SDK auto-detects GOOGLE_GENERATIVE_AI_API_KEY)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY missing' });
    }

    // System instruction for CE VAULT AI ASSIST
    const systemInstruction = `
You are "CE VAULT AI ASSIST", the official AI assistant for the CE Vault Student Result Portal.
You help students and faculty find information about Diploma in Civil Engineering student results.
You have access to student data provided in the context: ${JSON.stringify(studentData || {})}
Be helpful, concise, and accurate. Always search the student database before responding.
`;

    const result = streamText({
      model: google('gemma-3-27b-it', { apiKey }),
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
