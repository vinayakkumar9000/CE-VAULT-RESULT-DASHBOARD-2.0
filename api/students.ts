import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/db.js';
import Student from '../models/Student.js';
import { escapeRegex } from '../lib/regexUtils.js';

export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(503).json({
        error: 'Database not connected. Please configure MONGODB_URI.',
      });
    }

    // POST /api/students - Create or update a student
    if (req.method === 'POST') {
      const {
        rollNumber,
        name,
        semester,
        branch,
        subjects,
        sgpa,
        cgpa,
      } = req.body;

      if (!rollNumber || !name || !semester || !branch || !subjects || sgpa === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: rollNumber, name, semester, branch, subjects, sgpa',
        });
      }

      // Validate subjects array
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ error: 'subjects must be a non-empty array' });
      }

      // Upsert student (update if exists, create if not)
      const student = await Student.findOneAndUpdate(
        { rollNumber },
        {
          rollNumber,
          name,
          semester,
          branch,
          subjects,
          sgpa,
          cgpa,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        student,
      });
    }

    // GET /api/students - Get student(s) by rollNumber or name
    if (req.method === 'GET') {
      const { rollNumber, name } = req.query;

      if (rollNumber) {
        // Search by roll number (exact or partial match) - escape regex to prevent injection
        const escapedRollNumber = escapeRegex(rollNumber as string);
        const students = await Student.find({
          rollNumber: { $regex: escapedRollNumber, $options: 'i' },
        }).limit(10);

        return res.status(200).json({
          success: true,
          count: students.length,
          students,
        });
      }

      if (name) {
        // Search by name (case-insensitive, partial match) - escape regex to prevent injection
        const escapedName = escapeRegex(name as string);
        const students = await Student.find({
          name: { $regex: escapedName, $options: 'i' },
        }).limit(10);

        return res.status(200).json({
          success: true,
          count: students.length,
          students,
        });
      }

      // No query params - return all students (limit to 100)
      const students = await Student.find().limit(100).sort({ rollNumber: 1 });

      return res.status(200).json({
        success: true,
        count: students.length,
        students,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Students API error:', err);
    return res.status(500).json({
      error: String(err?.message || err),
    });
  }
}
