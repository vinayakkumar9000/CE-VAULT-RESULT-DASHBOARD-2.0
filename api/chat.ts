import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getModelName } from '../lib/aiClient';

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

    // Check for API key - use GEMINI_API_KEY from centralized config
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required. Please set it in your environment variables.' });
    }

    // Create Google AI provider with explicit API key
    const google = createGoogleGenerativeAI({ apiKey });

    // Get model name from centralized client
    const modelName = getModelName();

    // System instruction for CE VAULT AI ASSIST
    const systemInstruction = `
You are "CE VAULT AI ASSIST", the official AI assistant for the CE Vault Student Result Portal.
You help students and faculty find information about Diploma in Civil Engineering student results.
You have access to student data provided in the context: ${JSON.stringify(studentData || {})}
Be helpful, concise, and accurate. Always search the student database before responding.
`;

    const result = await streamText({
      model: google(modelName),
      system: systemInstruction,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
