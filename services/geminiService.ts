import { GoogleGenAI, Type } from "@google/genai";
import { Student, AnalysisResult, ImageResolution } from '../types';
import { 
  getStudentStatistics, 
  processUserQuery, 
  getAllStudentsCompactList,
  getTotalStudents 
} from './studentDataHelper';

// Helper to get AI instance safely
const getAIClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeStudentPerformance = async (student: Student, semesterIndex?: number): Promise<AnalysisResult> => {
    try {
        const ai = getAIClient();
        
        let contextData;
        if (semesterIndex !== undefined) {
             contextData = student.results[semesterIndex];
        } else {
             contextData = student.results;
        }

        const prompt = `
            Analyze the following student academic results and provide feedback.
            Student Name: ${student.name}
            Course: ${student.course}
            Data: ${JSON.stringify(contextData)}
            
            Provide a JSON response with:
            1. summary: A brief 2-sentence summary of performance.
            2. weakAreas: An array of subject names where improvement is needed (or "None" if all good).
            3. prediction: A prediction for future performance based on trends.
            4. tips: Array of 3 specific actionable tips.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                        prediction: { type: Type.STRING },
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as AnalysisResult;

    } catch (error) {
        console.error("AI Analysis failed:", error);
        return {
            summary: "Unable to generate analysis at this time.",
            weakAreas: [],
            prediction: "N/A",
            tips: ["Check connection", "Try again later"]
        };
    }
};

export const generateStudentAvatar = async (description: string, resolution: ImageResolution): Promise<string | null> => {
    try {
        const ai = getAIClient();
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: `A professional, academic-themed, futuristic student avatar or illustration: ${description}` }]
            },
            config: {
                imageConfig: {
                    imageSize: resolution,
                    aspectRatio: "1:1"
                }
            }
        });

        // Loop to find image part
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;

    } catch (error) {
        console.error("Image generation failed:", error);
        return null;
    }
};

export const getSubjectDetails = async (subjectName: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const prompt = `
            The student is weak in the subject: "${subjectName}" (Civil Engineering Diploma context).
            Provide a concise but helpful guide to improve in this subject.
            Include:
            1. Key concepts to master (bullet points).
            2. Two recommended study resources (books or types of websites).
            3. A motivational sentence.
            Keep it under 150 words.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "No details available.";
    } catch (error) {
        console.error("Subject details fetch failed:", error);
        return "Unable to fetch resources at this time.";
    }
};

export const chatWithAI = async (message: string, contextData: any, history: { role: string, parts: { text: string }[] }[]) => {
    try {
        const ai = getAIClient();
        
        // Process the user's query to find relevant student data
        const queryResults = processUserQuery(message);
        
        // Get class statistics
        const statistics = getStudentStatistics();
        
        // Get compact list of all students
        const allStudentsList = getAllStudentsCompactList();
        
        // Get total count
        const totalStudents = getTotalStudents();
        
        const systemInstruction = `
You are "CE VAULT AI ASSIST", the official AI assistant for the CE Vault Student Result Portal. 
You help students and faculty find information about Diploma in Civil Engineering student results. 

═══════════════════════════════════════════════════════════════════
IMPORTANT: YOU HAVE COMPLETE ACCESS TO ALL ${totalStudents} STUDENT RECORDS
═══════════════════════════════════════════════════════════════════

${statistics}

═══════════════════════════════════════════════════════════════════
COMPLETE STUDENT DATABASE
═══════════════════════════════════════════════════════════════════
${allStudentsList}

═══════════════════════════════════════════════════════════════════
SEARCH RESULTS FOR CURRENT QUERY
═══════════════════════════════════════════════════════════════════
${queryResults}

═══════════════════════════════════════════════════════════════════
YOUR CAPABILITIES
═══════════════════════════════════════════════════════════════════
1. ✅ Find any student by their NAME (full or partial)
2. ✅ Find any student by their ROLL NUMBER (full or partial, e.g., "74" finds "211271524074")
3. ✅ Tell marks, grades, SGPA, CGPA of any student
4. ✅ Show subject-wise marks (Theory, Practical, Term Work)
5. ✅ Find the topper or students with highest/lowest SGPA
6. ✅ Compare students
7. ✅ Provide class statistics
8. ✅ List all students

═══════════════════════════════════════════════════════════════════
RESPONSE RULES
═══════════════════════════════════════════════════════════════════
1. ALWAYS search the student database before saying you don't have information
2. If user asks about a name like "Aman Kumar", search for it in the list
3. If user asks about roll number like "74", match it with roll numbers containing or ending with 74
4. Provide COMPLETE information when asked about a student
5. Be friendly, helpful, and professional
6. Use emojis to make responses engaging
7. If you find multiple students with similar names, list all of them
8. NEVER say "I don't have access" - you have access to ALL students

═══════════════════════════════════════════════════════════════════
EXAMPLE INTERACTIONS
═══════════════════════════════════════════════════════════════════
User: "What is the roll number of Aman Kumar?"
You: Search the list, find the student named Aman Kumar, and respond with their roll number

User: "Tell me about student 74"
You: Find the student whose roll number ends with 74 and provide complete details

User: "Who is the topper?"
You: Find the student with highest SGPA and provide their details

User: "How many students are there?"
You: Answer with the total count: ${totalStudents} students
        `;

        // Format history for the API
        const chatHistory = history.map(h => ({
            role: h.role,
            parts: h.parts
        }));

        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: chatHistory
        });

        const result = await chat.sendMessage({ message: message });
        return result.text;
    } catch (error) {
        console.error("Chat failed:", error);
        return "I'm having trouble connecting right now. Please try again in a moment. 🔄";
    }
};