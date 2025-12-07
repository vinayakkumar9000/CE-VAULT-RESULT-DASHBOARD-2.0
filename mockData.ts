import { Student } from './types';

// VINIT KUMAR VICKY Data
const vinitSubjects: any[] = [
    // Theory
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Theory', maxMarks: 15, obtainedMarks: 13, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 45, credits: 3.0, grade: 'E', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 50, credits: 3.0, grade: 'D', isBacklog: false },
    { name: "ESSEN OF IND KNOWL. AND TRADIT", category: 'Theory', maxMarks: 25, obtainedMarks: 24, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "PRINCIPLES OF MANAGEMENT", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Theory', maxMarks: 100, obtainedMarks: 52, credits: 3.0, grade: 'D', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Theory', maxMarks: 100, obtainedMarks: 63, credits: 3.0, grade: 'C', isBacklog: false },
    // Practical
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Practical', maxMarks: 25, obtainedMarks: 21, credits: 0.5, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Practical', maxMarks: 50, obtainedMarks: 35, credits: 2.0, grade: 'B', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Practical', maxMarks: 50, obtainedMarks: 43, credits: 2.0, grade: 'A', isBacklog: false },
    { name: "ICT TOOLS", category: 'Practical', maxMarks: 50, obtainedMarks: 45, credits: 2.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Practical', maxMarks: 50, obtainedMarks: 45, credits: 2.0, grade: 'A+', isBacklog: false },
    // Term Work
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Term Work', maxMarks: 10, obtainedMarks: 9, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 40, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 41, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Term Work', maxMarks: 25, obtainedMarks: 22, credits: 0.5, grade: 'A', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Term Work', maxMarks: 50, obtainedMarks: 43, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "ICT TOOLS", category: 'Term Work', maxMarks: 50, obtainedMarks: 45, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Term Work', maxMarks: 50, obtainedMarks: 43, credits: 1.0, grade: 'A', isBacklog: false }
];

// NANDANI KUMARI Data
const nandaniSubjects: any[] = [
    // Theory
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Theory', maxMarks: 15, obtainedMarks: 14, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 49, credits: 3.0, grade: 'E', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 40, credits: 3.0, grade: 'E', isBacklog: true }, // Carry
    { name: "ESSEN OF IND KNOWL. AND TRADIT", category: 'Theory', maxMarks: 25, obtainedMarks: 24, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "PRINCIPLES OF MANAGEMENT", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Theory', maxMarks: 100, obtainedMarks: 64, credits: 3.0, grade: 'C', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Theory', maxMarks: 100, obtainedMarks: 59, credits: 3.0, grade: 'D', isBacklog: false },
    // Practical
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Practical', maxMarks: 25, obtainedMarks: 21, credits: 0.5, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Practical', maxMarks: 50, obtainedMarks: 39, credits: 2.0, grade: 'B', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Practical', maxMarks: 50, obtainedMarks: 43, credits: 2.0, grade: 'A', isBacklog: false },
    { name: "ICT TOOLS", category: 'Practical', maxMarks: 50, obtainedMarks: 45, credits: 2.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Practical', maxMarks: 50, obtainedMarks: 44, credits: 2.0, grade: 'A', isBacklog: false },
    // Term Work
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Term Work', maxMarks: 10, obtainedMarks: 9, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 42, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 42, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Term Work', maxMarks: 25, obtainedMarks: 23, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Term Work', maxMarks: 50, obtainedMarks: 43, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "ICT TOOLS", category: 'Term Work', maxMarks: 50, obtainedMarks: 45, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Term Work', maxMarks: 50, obtainedMarks: 42, credits: 1.0, grade: 'A', isBacklog: false }
];

// HIMANSHU KUMAR Data
const himanshuSubjects: any[] = [
    // Theory
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Theory', maxMarks: 15, obtainedMarks: 12, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 61, credits: 3.0, grade: 'C', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Theory', maxMarks: 100, obtainedMarks: 85, credits: 3.0, grade: 'A', isBacklog: false },
    { name: "ESSEN OF IND KNOWL. AND TRADIT", category: 'Theory', maxMarks: 25, obtainedMarks: 24, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "PRINCIPLES OF MANAGEMENT", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Theory', maxMarks: 25, obtainedMarks: 23, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Theory', maxMarks: 100, obtainedMarks: 75, credits: 3.0, grade: 'B', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Theory', maxMarks: 100, obtainedMarks: 75, credits: 3.0, grade: 'B', isBacklog: false },
    // Practical
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Practical', maxMarks: 25, obtainedMarks: 20, credits: 0.5, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Practical', maxMarks: 50, obtainedMarks: 39, credits: 2.0, grade: 'B', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Practical', maxMarks: 50, obtainedMarks: 45, credits: 2.0, grade: 'A+', isBacklog: false },
    { name: "ICT TOOLS", category: 'Practical', maxMarks: 50, obtainedMarks: 45, credits: 2.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Practical', maxMarks: 50, obtainedMarks: 43, credits: 2.0, grade: 'A', isBacklog: false },
    // Term Work
    { name: "ENVT. EDU. AND SUST. DEVELOP.", category: 'Term Work', maxMarks: 10, obtainedMarks: 8, credits: 0.5, grade: 'A', isBacklog: false },
    { name: "APPLIED PHYSICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 40, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "APPLIED MATHEMATICS -A", category: 'Term Work', maxMarks: 50, obtainedMarks: 44, credits: 1.0, grade: 'A', isBacklog: false },
    { name: "INDIAN CONSTITUTION", category: 'Term Work', maxMarks: 25, obtainedMarks: 23, credits: 0.5, grade: 'A+', isBacklog: false },
    { name: "PYTHON PROGRAMMING", category: 'Term Work', maxMarks: 50, obtainedMarks: 45, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "ICT TOOLS", category: 'Term Work', maxMarks: 50, obtainedMarks: 45, credits: 1.0, grade: 'A+', isBacklog: false },
    { name: "ENGG. MECHANICS", category: 'Term Work', maxMarks: 50, obtainedMarks: 41, credits: 1.0, grade: 'A', isBacklog: false }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    rollNumber: '211271524001',
    regNumber: '1271524001',
    name: 'VINIT KUMAR VICKY',
    course: 'Diploma in Civil Engineering',
    email: 'vinit.k@college.edu',
    contact: '+91 98765 43210',
    currentSemester: 2,
    results: [
        {
            semester: 2,
            session: '2024-2027',
            subjects: vinitSubjects,
            sgpa: 8.00,
            cgpa: 8.00,
            totalMarks: 725,
            maxTotalMarks: 1000,
            remarks: 'First Class',
            backlogCount: 0,
            publishedDate: '10/06/2025',
            percentile: 72.5
        }
    ]
  },
  {
    id: '2',
    rollNumber: '211271524002',
    regNumber: '1271524002',
    name: 'NANDANI KUMARI',
    course: 'Diploma in Civil Engineering',
    email: 'nandani.k@college.edu',
    contact: '+91 98765 43211',
    currentSemester: 2,
    results: [
        {
            semester: 2,
            session: '2024-2027',
            subjects: nandaniSubjects,
            sgpa: 'N/A', // or 0
            cgpa: 0,
            totalMarks: 734,
            maxTotalMarks: 1000,
            remarks: 'Carry',
            backlogCount: 1,
            publishedDate: '10/06/2025',
            percentile: 'N/A'
        }
    ]
  },
  {
    id: '3',
    rollNumber: '211271524003',
    regNumber: '1271524003',
    name: 'HIMANSHU KUMAR',
    course: 'Diploma in Civil Engineering',
    email: 'himanshu.k@college.edu',
    contact: '+91 98765 43212',
    currentSemester: 2,
    results: [
        {
            semester: 2,
            session: '2024-2027',
            subjects: himanshuSubjects,
            sgpa: 8.83,
            cgpa: 8.83,
            totalMarks: 816,
            maxTotalMarks: 1000,
            remarks: 'First Class with Distinction',
            backlogCount: 0,
            publishedDate: '10/06/2025',
            percentile: 81.6
        }
    ]
  }
];
