import { Student, AnalysisResult, ImageResolution } from '../types';

export const analyzeStudentPerformance = async (student: Student, semesterIndex?: number): Promise<AnalysisResult> => {
    try {
        let contextData = semesterIndex !== undefined ? student.results[semesterIndex] : student.results;

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

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error('Analysis request failed');
        const data = await response.json();
        return data as AnalysisResult;

    } catch (error) {
        console.error("AI Analysis failed:", error);
        return { summary: "Unable to generate analysis.", weakAreas: [], prediction: "N/A", tips: ["Try again later"] };
    }
};

export const generateStudentAvatar = async (description: string, resolution: ImageResolution): Promise<string | null> => {
    console.log("Image generation not supported by Gemma models");
    return null;
};

export const getSubjectDetails = async (subjectName: string): Promise<string> => {
    try {
        const prompt = `The student is weak in: "${subjectName}" (Civil Engineering). Provide key concepts, 2 resources, and motivation. Under 150 words.`;
        const response = await fetch('/api/subject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
        if (!response.ok) throw new Error('Request failed');
        const data = await response.json();
        return data.text || "No details available.";
    } catch (error) {
        console.error("Subject details fetch failed:", error);
        return "Unable to fetch resources.";
    }
};