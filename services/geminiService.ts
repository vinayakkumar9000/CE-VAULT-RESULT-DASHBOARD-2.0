import { GoogleGenAI, Type } from "@google/genai";
import { Student, AnalysisResult, ImageResolution } from '../types';

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
        const systemInstruction = `
            You are "ce vault ai assist ofhatbit", an intelligent assistant for a student result portal.
            You have access to the following raw student result data: ${JSON.stringify(contextData)}.
            
            Your primary goal is to help users find information about student marks, grades, SGPA, and performance.
            
            Rules:
            1. If a user asks about a specific student, check the data and provide accurate marks or grades.
            2. You can compare students (e.g., "Who got the highest SGPA?").
            3. Be concise, professional, and helpful.
            4. If the information is not in the data provided, state that you don't have that information.
            5. Use a friendly, academic tone.
            6. Keep responses short and fast.
        `;

        // Format history for the API
        const chatHistory = history.map(h => ({
            role: h.role,
            parts: h.parts
        }));

        const chat = ai.chats.create({
            // Using Flash-Lite for low-latency responses as requested
            model: 'gemini-flash-lite-latest',
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