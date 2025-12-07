import { Student } from '../types';
import { GENERATED_STUDENTS } from '../generatedData';

let studentsCache: Student[] | null = null;

export const getStudents = (): Student[] => {
  if (!studentsCache) {
    studentsCache = GENERATED_STUDENTS;
  }
  return studentsCache;
};

export const getStudentByRoll = (rollNo: string): Student | undefined => {
  const students = getStudents();
  return students.find(s => s.rollNumber.toLowerCase() === rollNo.toLowerCase());
};

export const searchStudents = (query: string): Student[] => {
  const students = getStudents();
  const lowerQuery = query.toLowerCase();
  return students.filter(s => 
    s.rollNumber.toLowerCase().includes(lowerQuery) ||
    s.name.toLowerCase().includes(lowerQuery)
  );
};
