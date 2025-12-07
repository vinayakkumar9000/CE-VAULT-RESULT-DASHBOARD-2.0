import { GoogleGenAI, Type } from "@google/genai";
import { Student, AnalysisResult, ImageResolution } from '../types';
import { processQueryForAI, getStudentStatistics, getCompactStudentList } from './studentDataHelper';

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
        
        // Get relevant student info for this query
        const relevantInfo = processQueryForAI(message);
        
        // Get overall statistics
        const stats = getStudentStatistics();
        
        // Get compact student list
        const compactList = getCompactStudentList();
        
        const systemInstruction = `
            You are "ce vault ai assist ofhatbit", an intelligent assistant for a student result portal.
            
            STUDENT DATABASE STATISTICS:
            - Total Students: ${stats.totalStudents}
            - Highest SGPA: ${stats.highestSGPA} (${stats.topperName}, Roll: ${stats.topperRoll})
            - Lowest SGPA: ${stats.lowestSGPA}
            - Average SGPA: ${stats.averageSGPA}
            
            COMPACT STUDENT LIST (RollNumber|Name|SGPA|TotalMarks):
            ${compactList}
            
            ${relevantInfo ? `\nRELEVANT INFO FOR CURRENT QUERY:\n${relevantInfo}\n` : ''}
            
            Your primary goal is to help users find information about student marks, grades, SGPA, and performance.
            
            IMPORTANT RULES:
            1. When asked about a specific student by name, search the student list above and provide their exact details.
            2. When asked about a roll number, find the matching student from the list above.
            3. For "topper" or "highest SGPA" queries, refer to ${stats.topperName} (${stats.topperRoll}) with SGPA ${stats.highestSGPA}.
            4. For "how many students" queries, answer with ${stats.totalStudents} students.
            5. Be concise, professional, and helpful.
            6. If information is not in the data, state that clearly.
            7. Use a friendly, academic tone.
            8. Keep responses short and accurate.
            
            EXAMPLES:
            Q: "What is the roll number of Aman Kumar?"
            A: Search for "Aman Kumar" in the student list and provide their roll number.
            
            Q: "Tell me about student 74"
            A: Search for roll numbers containing "74" and provide their details.
            
            Q: "Who is the topper?"
            A: "${stats.topperName} is the topper with SGPA ${stats.highestSGPA} (Roll: ${stats.topperRoll})"
            
            Q: "How many students are there?"
            A: "There are ${stats.totalStudents} students in the database."
        `;

        // Format history for the API
        const chatHistory = history.map(h => ({
            role: h.role,
            parts: h.parts
        }));

        const chat = ai.chats.create({
            // Using gemini-2.0-flash for better responses as requested
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
        return "I'm having trouble connecting to the server right now. Please try again later.";
    }
};