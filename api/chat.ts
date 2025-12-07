import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getModelName } from '../lib/aiClient.js';
import connectToDatabase from '../lib/db.js';
import Student from '../models/Student.js';
import { escapeRegex } from '../lib/regexUtils.js';

export const maxDuration = 60;

/**
 * Extract roll number or name from user message
 */
function extractStudentQuery(message: string): { rollNumber?: string; name?: string } {
  // Match roll numbers (typically 12 digits)
  const rollMatch = message.match(/\b\d{10,12}\b/);
  if (rollMatch) {
    return { rollNumber: rollMatch[0] };
  }

  // Match patterns like "roll 211991524001", "roll number 211991524001"
  const rollPatternMatch = message.match(/roll\s*(?:number)?\s*(\d{10,12})/i);
  if (rollPatternMatch) {
    return { rollNumber: rollPatternMatch[1] };
  }

  // Try to extract name after patterns like "of <name>", "for <name>", "SGPA of <name>"
  const namePatterns = [
    /(?:marks|sgpa|cgpa|result|details)\s+(?:of|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /(?:show|get|find|tell)\s+(?:me\s+)?(?:about|details\s+of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  ];

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return { name: match[1].trim() };
    }
  }

  return {};
}

/**
 * Fetch student data from MongoDB
 */
async function fetchStudentData(rollNumber?: string, name?: string) {
  const db = await connectToDatabase();
  if (!db) {
    return null;
  }

  try {
    if (rollNumber) {
      // Escape regex to prevent injection attacks
      const escapedRollNumber = escapeRegex(rollNumber);
      const student = await Student.findOne({
        rollNumber: { $regex: `^${escapedRollNumber}`, $options: 'i' },
      });
      return student ? student.toObject() : null;
    }

    if (name) {
      // Escape regex to prevent injection attacks
      const escapedName = escapeRegex(name);
      const students = await Student.find({
        name: { $regex: escapedName, $options: 'i' },
      }).limit(1);
      return students.length > 0 ? students[0].toObject() : null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching student data:', error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    // Check for API key - use GEMINI_API_KEY from centralized config
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required. Please set it in your environment variables.' });
    }

    // Get the last user message to detect student queries
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || '';

    // Extract student query from last message
    const studentQuery = extractStudentQuery(lastUserMessage);
    let studentData = null;
    let dbAvailable = false;

    // Try to fetch student data from MongoDB
    if (studentQuery.rollNumber || studentQuery.name) {
      const db = await connectToDatabase();
      dbAvailable = db !== null;
      
      if (dbAvailable) {
        studentData = await fetchStudentData(studentQuery.rollNumber, studentQuery.name);
      }
    } else {
      // Check if DB is available even if no specific query
      const db = await connectToDatabase();
      dbAvailable = db !== null;
    }

    // Create Google AI provider with explicit API key
    const google = createGoogleGenerativeAI({ apiKey });

    // Get model name from centralized client
    const modelName = getModelName();

    // Build system instruction based on context
    let systemInstruction = `You are "CE VAULT AI ASSIST", the official AI assistant for the CE Vault Student Result Portal.
You help students and faculty find information about Diploma in Civil Engineering student results.
Be helpful, concise, and accurate.`;

    if (!dbAvailable) {
      systemInstruction += `\n\n⚠️ IMPORTANT: The database is not currently connected (MONGODB_URI is missing).
You can still provide general academic advice about SGPA, CGPA, improvement strategies, and how the grading system works.
If asked about specific students, politely explain that database features are unavailable but you can still help with general questions.`;
    } else if (studentData) {
      // Student found - provide detailed context
      const subjectsList = studentData.subjects
        .map((s: any) => `${s.name} (${s.code}): ${s.marks}/100, Credits: ${s.credits}`)
        .join('\n');

      const weakSubjects = studentData.subjects
        .filter((s: any) => s.marks < 50)
        .map((s: any) => s.name);

      systemInstruction += `\n\n📊 STUDENT DATA FOUND:
- Roll Number: ${studentData.rollNumber}
- Name: ${studentData.name}
- Semester: ${studentData.semester}
- Branch: ${studentData.branch}
- SGPA: ${studentData.sgpa}
${studentData.cgpa ? `- CGPA: ${studentData.cgpa}` : ''}

SUBJECTS AND MARKS:
${subjectsList}

${weakSubjects.length > 0 ? `⚠️ WEAK AREAS (marks < 50): ${weakSubjects.join(', ')}` : '✅ All subjects have passing marks (≥50)'}

INSTRUCTIONS:
1. Present the student's marks, SGPA, and CGPA clearly.
2. List all subjects with their marks and credits.
3. Provide improvement guidance:
   - Focus on subjects with marks below 50
   - Suggest retaking exams for low-scoring subjects
   - Explain how improving weak subjects can boost SGPA
   - Provide study tips for specific subjects if asked
4. Be encouraging and constructive.`;
    } else if (studentQuery.rollNumber || studentQuery.name) {
      // Query was made but student not found
      systemInstruction += `\n\n⚠️ The student with ${studentQuery.rollNumber ? `roll number ${studentQuery.rollNumber}` : `name "${studentQuery.name}"`} was not found in the database.
Politely inform the user that the student record doesn't exist, but you can still help with general questions about SGPA, CGPA, and improvement strategies.`;
    } else {
      // General query - provide general assistance
      systemInstruction += `\n\nYou can help with:
- Explaining how SGPA and CGPA are calculated
- Providing improvement strategies for better grades
- Explaining the grading system
- General academic advice

To get specific student data, users should ask: "Show marks of roll 211991524001" or "What is SGPA of <name>".`;
    }

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
