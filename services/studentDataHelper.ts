import { Student } from '../types';
import { GENERATED_STUDENTS } from '../generatedData';

// Get total number of students
export const getTotalStudents = (): number => {
  return GENERATED_STUDENTS.length;
};

// Get summary statistics for AI context
export const getStudentStatistics = (): string => {
  const totalStudents = GENERATED_STUDENTS.length;
  
  const sgpaList = GENERATED_STUDENTS.map(s => s.results[s.results.length - 1]?.sgpa || 0);
  const highestSGPA = Math.max(...sgpaList);
  const lowestSGPA = Math.min(...sgpaList.filter(s => s > 0));
  const avgSGPA = (sgpaList.reduce((a, b) => a + b, 0) / totalStudents).toFixed(2);
  
  const topperIndex = sgpaList.indexOf(highestSGPA);
  const topper = GENERATED_STUDENTS[topperIndex];
  
  const lowestIndex = sgpaList.indexOf(lowestSGPA);
  const lowestStudent = GENERATED_STUDENTS[lowestIndex];
  
  return `
CLASS STATISTICS:
- Total Students: ${totalStudents}
- Topper: ${topper?.name} (Roll: ${topper?.rollNumber}) with SGPA: ${highestSGPA}
- Lowest SGPA: ${lowestSGPA} by ${lowestStudent?.name} (Roll: ${lowestStudent?.rollNumber})
- Class Average SGPA: ${avgSGPA}
- Roll Number Range: ${GENERATED_STUDENTS[0]?.rollNumber} to ${GENERATED_STUDENTS[totalStudents - 1]?.rollNumber}
  `.trim();
};

// Find student by name - supports partial matching
export const findStudentsByName = (name: string): Student[] => {
  const searchName = name.toLowerCase().trim();
  return GENERATED_STUDENTS.filter(student => 
    student.name.toLowerCase().includes(searchName)
  );
};

// Find student by roll number - supports partial matching
export const findStudentByRollNumber = (rollNumber: string): Student | undefined => {
  const searchRoll = rollNumber.trim();
  
  // Try exact match first
  let student = GENERATED_STUDENTS.find(s => 
    s.rollNumber === searchRoll || 
    s.rollNumber.toLowerCase() === searchRoll.toLowerCase()
  );
  
  // Try ends with match (for queries like "roll 74" matching "211271524074")
  if (!student) {
    student = GENERATED_STUDENTS.find(s => s.rollNumber.endsWith(searchRoll));
  }
  
  // Try contains match
  if (!student) {
    student = GENERATED_STUDENTS.find(s => s.rollNumber.includes(searchRoll));
  }
  
  return student;
};

// Get complete details of a student formatted for AI
export const getStudentFullDetails = (student: Student): string => {
  const latestResult = student.results[student.results.length - 1];
  
  let details = `
═══════════════════════════════════════
STUDENT DETAILS
═══════════════════════════════════════
Name: ${student.name}
Roll Number: ${student.rollNumber}
Registration Number: ${student.regNumber}
Course: ${student.course}
Current Semester: ${student.currentSemester}
Email: ${student.email}
Contact: ${student.contact}

═══════════════════════════════════════
RESULT - SEMESTER ${latestResult?.semester}
═══════════════════════════════════════
Session: ${latestResult?.session}
SGPA: ${latestResult?.sgpa}
CGPA: ${latestResult?.cgpa}
Total Marks: ${latestResult?.totalMarks} / ${latestResult?.maxTotalMarks}
Percentage: ${latestResult?.percentile}%
Result: ${latestResult?.remarks}
Backlog Count: ${latestResult?.backlogCount}
Published Date: ${latestResult?.publishedDate}
`;

  if (latestResult?.subjects) {
    const theory = latestResult.subjects.filter(s => s.category === 'Theory');
    const practical = latestResult.subjects.filter(s => s.category === 'Practical');
    const termWork = latestResult.subjects.filter(s => s.category === 'Term Work');

    details += `
═══════════════════════════════════════
THEORY PAPERS
═══════════════════════════════════════
`;
    theory.forEach(sub => {
      details += `• ${sub.name}: ${sub.obtainedMarks}/${sub.maxMarks} | Grade: ${sub.grade} | Credits: ${sub.credits}\n`;
    });

    details += `
═══════════════════════════════════════
PRACTICAL PAPERS
═══════════════════════════════════════
`;
    practical.forEach(sub => {
      details += `• ${sub.name}: ${sub.obtainedMarks}/${sub.maxMarks} | Grade: ${sub.grade} | Credits: ${sub.credits}\n`;
    });

    details += `
═══════════════════════════════════════
TERM WORK
═══════════════════════════════════════
`;
    termWork.forEach(sub => {
      details += `• ${sub.name}: ${sub.obtainedMarks}/${sub.maxMarks} | Grade: ${sub.grade} | Credits: ${sub.credits}\n`;
    });
  }

  return details.trim();
};

// Create compact list of ALL students for AI reference
export const getAllStudentsCompactList = (): string => {
  let list = "COMPLETE STUDENT LIST:\n";
  list += "Roll Number | Name | SGPA | Total Marks\n";
  list += "─────────────────────────────────────────\n";
  
  GENERATED_STUDENTS.forEach(student => {
    const result = student.results[student.results.length - 1];
    list += `${student.rollNumber} | ${student.name} | ${result?.sgpa} | ${result?.totalMarks}/${result?.maxTotalMarks}\n`;
  });
  
  return list;
};

// Get top N students by SGPA
export const getTopStudents = (count: number = 5): string => {
  const sorted = [...GENERATED_STUDENTS].sort((a, b) => {
    const sgpaA = a.results[a.results.length - 1]?.sgpa || 0;
    const sgpaB = b.results[b.results.length - 1]?.sgpa || 0;
    return sgpaB - sgpaA;
  });
  
  let result = `TOP ${count} STUDENTS BY SGPA:\n`;
  sorted.slice(0, count).forEach((student, index) => {
    const r = student.results[student.results.length - 1];
    result += `${index + 1}. ${student.name} (Roll: ${student.rollNumber}) - SGPA: ${r?.sgpa}, Marks: ${r?.totalMarks}/${r?.maxTotalMarks}\n`;
  });
  
  return result;
};

// Get bottom N students by SGPA
export const getBottomStudents = (count: number = 5): string => {
  const sorted = [...GENERATED_STUDENTS].sort((a, b) => {
    const sgpaA = a.results[a.results.length - 1]?.sgpa || 0;
    const sgpaB = b.results[b.results.length - 1]?.sgpa || 0;
    return sgpaA - sgpaB;
  });
  
  let result = `BOTTOM ${count} STUDENTS BY SGPA:\n`;
  sorted.slice(0, count).forEach((student, index) => {
    const r = student.results[student.results.length - 1];
    result += `${index + 1}. ${student.name} (Roll: ${student.rollNumber}) - SGPA: ${r?.sgpa}, Marks: ${r?.totalMarks}/${r?.maxTotalMarks}\n`;
  });
  
  return result;
};

// Main function to process any user query and find relevant data
export const processUserQuery = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  let response = '';

  // Pattern 1: Looking for roll number by name
  // Examples: "roll number of Aman Kumar", "what is Aman's roll number"
  const nameForRollPatterns = [
    /roll\s*(?:number|no\.?|#)?\s*(?:of|for)\s+([a-zA-Z\s]+)/i,
    /([a-zA-Z]+(?:\s+[a-zA-Z]+)+?)(?:'s|s)?\s*roll\s*(?:number|no\.?|#)?/i,
    /find\s+([a-zA-Z\s]+?)(?:'s)?\s*roll/i,
    /([a-zA-Z]+\s+[a-zA-Z]+)\s+roll/i
  ];
  
  for (const pattern of nameForRollPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const nameQuery = match[1].trim();
      const students = findStudentsByName(nameQuery);
      if (students.length > 0) {
        response += `\n\n🔍 SEARCH RESULTS FOR NAME "${nameQuery.toUpperCase()}":\n`;
        students.forEach(student => {
          response += `\n${getStudentFullDetails(student)}\n`;
        });
        return response;
      } else {
        response += `\n\n❌ No student found with name containing "${nameQuery}"`;
      }
    }
  }

  // Pattern 2: Looking for student by roll number
  // Examples: "roll number 74", "student 211271524074", "marks of 74"
  const rollPatterns = [
    /roll\s*(?:number|no\.?|#)?\s*[:\s]?\s*(\d+)/i,
    /student\s*(?:number|no\.?|#)?\s*[:\s]?\s*(\d+)/i,
    /(\d{12})/,
    /(?:marks?|result|sgpa|cgpa|details?)\s*(?:of|for)\s*(?:roll\s*(?:number|no\.?|#)?\s*)?(\d+)/i,
    /(\d{2,})\s*(?:roll|student|marks|result)/i
  ];
  
  for (const pattern of rollPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const rollQuery = match[1].trim();
      const student = findStudentByRollNumber(rollQuery);
      if (student) {
        response += `\n\n🔍 FOUND STUDENT WITH ROLL NUMBER "${rollQuery}":\n`;
        response += getStudentFullDetails(student);
        return response;
      } else {
        response += `\n\n❌ No student found with roll number containing "${rollQuery}"`;
      }
    }
  }

  // Pattern 3: Looking for student by name for marks/result
  // Examples: "marks of Aman Kumar", "Himanshu's result"
  const nameForMarksPatterns = [
    /(?:marks?|result|sgpa|cgpa|details?)\s*(?:of|for)\s+([a-zA-Z\s]+?)(?:\?|$|,|\.)/i,
    /([a-zA-Z]+(?:\s+[a-zA-Z]+)+?)(?:'s|s)?\s*(?:marks?|result|sgpa|cgpa)/i,
    /(?:tell|show|give|get)\s*(?:me)?\s*(?:about|the)?\s*([a-zA-Z\s]+?)(?:'s)?\s*(?:marks?|result)/i,
    /(?:about|find)\s+([a-zA-Z]+\s+[a-zA-Z]+)/i
  ];
  
  for (const pattern of nameForMarksPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      const nameQuery = match[1].trim();
      // Skip if it's a common word
      if (['the', 'a', 'an', 'this', 'that', 'student'].includes(nameQuery.toLowerCase())) continue;
      
      const students = findStudentsByName(nameQuery);
      if (students.length > 0) {
        response += `\n\n🔍 SEARCH RESULTS FOR "${nameQuery.toUpperCase()}":\n`;
        students.forEach(student => {
          response += `\n${getStudentFullDetails(student)}\n`;
        });
        return response;
      }
    }
  }

  // Pattern 4: Topper / Highest SGPA
  if (lowerQuery.includes('topper') || lowerQuery.includes('highest') || lowerQuery.includes('best') || lowerQuery.includes('top student') || lowerQuery.includes('first rank')) {
    response += `\n\n🏆 ${getTopStudents(5)}`;
    return response;
  }

  // Pattern 5: Lowest / Bottom students
  if (lowerQuery.includes('lowest') || lowerQuery.includes('bottom') || lowerQuery.includes('weak') || lowerQuery.includes('last rank') || lowerQuery.includes('failed')) {
    response += `\n\n📉 ${getBottomStudents(5)}`;
    return response;
  }

  // Pattern 6: Count / Total students
  if (lowerQuery.includes('how many') || lowerQuery.includes('total student') || lowerQuery.includes('count') || lowerQuery.includes('number of student')) {
    response += `\n\n📊 ${getStudentStatistics()}`;
    return response;
  }

  // Pattern 7: List all students
  if (lowerQuery.includes('list all') || lowerQuery.includes('all student') || lowerQuery.includes('show all') || lowerQuery.includes('every student')) {
    response += `\n\n📋 ${getAllStudentsCompactList()}`;
    return response;
  }

  // Pattern 8: Class statistics / average
  if (lowerQuery.includes('average') || lowerQuery.includes('statistic') || lowerQuery.includes('class') || lowerQuery.includes('overall')) {
    response += `\n\n📊 ${getStudentStatistics()}`;
    return response;
  }

  // If no pattern matched, return statistics and hint
  response += `\n\n📊 ${getStudentStatistics()}\n\n💡 TIP: You can ask me about any specific student by name or roll number!`;
  
  return response;
};

// Export all students for direct access
export const getAllStudents = (): Student[] => {
  return GENERATED_STUDENTS;
};
