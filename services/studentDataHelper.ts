import { GENERATED_STUDENTS } from '../generatedData';
import { Student } from '../types';

/**
 * Returns a formatted string of all students for AI context
 */
export const getAllStudentsForAI = (): string => {
    return GENERATED_STUDENTS.map(student => {
        const latestResult = student.results[student.results.length - 1];
        return `${student.rollNumber} | ${student.name} | SGPA: ${latestResult.sgpa} | Total: ${latestResult.totalMarks}/${latestResult.maxTotalMarks}`;
    }).join('\n');
};

/**
 * Returns statistics about all students
 */
export const getStudentStatistics = () => {
    const totalStudents = GENERATED_STUDENTS.length;
    
    // Get all valid SGPAs
    const sgpas = GENERATED_STUDENTS.map(s => {
        const latestResult = s.results[s.results.length - 1];
        return typeof latestResult.sgpa === 'number' ? latestResult.sgpa : 0;
    }).filter(sgpa => sgpa > 0);
    
    const highestSGPA = Math.max(...sgpas);
    const lowestSGPA = Math.min(...sgpas);
    const averageSGPA = sgpas.reduce((sum, sgpa) => sum + sgpa, 0) / sgpas.length;
    
    // Find topper
    const topper = GENERATED_STUDENTS.find(s => {
        const latestResult = s.results[s.results.length - 1];
        return latestResult.sgpa === highestSGPA;
    });
    
    return {
        totalStudents,
        highestSGPA: highestSGPA.toFixed(2),
        lowestSGPA: lowestSGPA.toFixed(2),
        averageSGPA: averageSGPA.toFixed(2),
        topperName: topper?.name || 'N/A',
        topperRoll: topper?.rollNumber || 'N/A'
    };
};

/**
 * Finds students by partial name match (case-insensitive)
 */
export const findStudentByName = (name: string): Student[] => {
    const searchTerm = name.toLowerCase().trim();
    return GENERATED_STUDENTS.filter(student => 
        student.name.toLowerCase().includes(searchTerm)
    );
};

/**
 * Finds student by roll number with partial match support
 * Example: "74" will match "211271524074"
 */
export const findStudentByRoll = (roll: string): Student[] => {
    const searchTerm = roll.toLowerCase().trim();
    return GENERATED_STUDENTS.filter(student => 
        student.rollNumber.toLowerCase().includes(searchTerm)
    );
};

/**
 * Returns complete formatted details of a student including all subjects
 */
export const getStudentDetailsForAI = (student: Student): string => {
    const latestResult = student.results[student.results.length - 1];
    
    let details = `Student Details:\n`;
    details += `Name: ${student.name}\n`;
    details += `Roll Number: ${student.rollNumber}\n`;
    details += `Reg Number: ${student.regNumber}\n`;
    details += `Course: ${student.course}\n`;
    details += `SGPA: ${latestResult.sgpa}\n`;
    details += `CGPA: ${latestResult.cgpa}\n`;
    details += `Total Marks: ${latestResult.totalMarks}/${latestResult.maxTotalMarks}\n`;
    details += `Backlogs: ${latestResult.backlogCount}\n`;
    details += `Result: ${latestResult.remarks}\n\n`;
    
    details += `Subjects:\n`;
    latestResult.subjects.forEach(subject => {
        details += `- ${subject.name} (${subject.category}): ${subject.obtainedMarks}/${subject.maxMarks} [${subject.grade}]\n`;
    });
    
    return details;
};

/**
 * Returns compact list of all students
 * Format: "RollNumber|Name|SGPA|TotalMarks"
 */
export const getCompactStudentList = (): string => {
    return GENERATED_STUDENTS.map(student => {
        const latestResult = student.results[student.results.length - 1];
        return `${student.rollNumber}|${student.name}|${latestResult.sgpa}|${latestResult.totalMarks}`;
    }).join('\n');
};

/**
 * Processes user query to find relevant students
 * Handles patterns like:
 * - "roll number of Aman Kumar"
 * - "marks of student 74"
 * - "who is topper"
 * - "how many students"
 */
export const processQueryForAI = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Check for topper query
    if (lowerQuery.includes('topper') || lowerQuery.includes('highest sgpa') || lowerQuery.includes('top student')) {
        const stats = getStudentStatistics();
        const topper = GENERATED_STUDENTS.find(s => {
            const latestResult = s.results[s.results.length - 1];
            return latestResult.sgpa === parseFloat(stats.highestSGPA);
        });
        if (topper) {
            return `Topper Information:\n${getStudentDetailsForAI(topper)}`;
        }
    }
    
    // Check for student count query
    if (lowerQuery.includes('how many students') || lowerQuery.includes('total students') || lowerQuery.includes('number of students')) {
        const stats = getStudentStatistics();
        return `Total Students: ${stats.totalStudents}\nHighest SGPA: ${stats.highestSGPA}\nLowest SGPA: ${stats.lowestSGPA}\nAverage SGPA: ${stats.averageSGPA}`;
    }
    
    // Extract potential roll numbers (look for numbers with at least 2 digits to avoid false matches)
    const rollMatches = query.match(/\b\d+\b/g);
    if (rollMatches && rollMatches.length > 0) {
        for (const rollNum of rollMatches) {
            // Only consider numbers with at least 2 digits to reduce false positives
            if (rollNum.length >= 2) {
                const students = findStudentByRoll(rollNum);
                if (students.length > 0) {
                    if (students.length === 1) {
                        return getStudentDetailsForAI(students[0]);
                    } else {
                        return `Multiple students found:\n` + 
                               students.map(s => `${s.rollNumber} - ${s.name}`).join('\n') + 
                               '\n\nPlease be more specific.';
                    }
                }
            }
        }
    }
    
    // Extract potential names (handle both Title Case like "Aman Kumar" and ALL CAPS like "AMAN KUMAR")
    // Match words starting with capital letter, followed by either lowercase letters or more capitals
    const nameMatches = query.match(/\b[A-Z](?:[a-z]+|[A-Z]+)(?:\s+[A-Z](?:[a-z]+|[A-Z]+))*\b/g);
    if (nameMatches && nameMatches.length > 0) {
        for (const name of nameMatches) {
            // Only try names with spaces (multi-word) or 4+ characters to avoid common words
            if (name.includes(' ') || name.length >= 4) {
                const students = findStudentByName(name);
                if (students.length > 0) {
                    if (students.length === 1) {
                        return getStudentDetailsForAI(students[0]);
                    } else if (students.length <= 5) {
                        return `Multiple students found:\n` + 
                               students.map(s => getStudentDetailsForAI(s)).join('\n---\n');
                    } else {
                        return `Found ${students.length} students matching "${name}":\n` + 
                               students.slice(0, 5).map(s => `${s.rollNumber} - ${s.name}`).join('\n') + 
                               '\n\nShowing first 5. Please be more specific.';
                    }
                }
            }
        }
    }
    
    // Look for common name patterns in lowercase
    // Try matching any word in the query that might be a name
    const words = lowerQuery.split(/\s+/);
    for (const word of words) {
        if (word.length >= 3) { // Only consider words with 3+ characters
            const students = findStudentByName(word);
            if (students.length > 0) {
                if (students.length === 1) {
                    return getStudentDetailsForAI(students[0]);
                } else if (students.length <= 5) {
                    return `Multiple students found with "${word}":\n` + 
                           students.map(s => `${s.rollNumber} - ${s.name} - SGPA: ${s.results[s.results.length - 1].sgpa}`).join('\n');
                } else {
                    return `Found ${students.length} students with "${word}" in their name:\n` + 
                           students.slice(0, 5).map(s => `${s.rollNumber} - ${s.name} - SGPA: ${s.results[s.results.length - 1].sgpa}`).join('\n') + 
                           '\n\nShowing first 5. Please be more specific.';
                }
            }
        }
    }
    
    return ''; // Return empty if no specific data found
};
