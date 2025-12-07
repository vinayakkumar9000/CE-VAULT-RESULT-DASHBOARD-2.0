export interface Subject {
  code?: string;
  name: string;
  category: 'Theory' | 'Practical' | 'Term Work';
  maxMarks: number;
  obtainedMarks: number;
  credits: number;
  grade: string;
  isBacklog: boolean; // Carry
}

export interface SemesterResult {
  semester: number;
  session: string;
  subjects: Subject[];
  sgpa: number | 'N/A';
  cgpa: number; 
  totalMarks: number;
  maxTotalMarks: number;
  remarks: string;
  backlogCount: number;
  publishedDate: string;
  percentile: number | string;
}

export interface Student {
  id: string;
  rollNumber: string;
  regNumber: string;
  name: string;
  course: string; // e.g., Diploma in Civil Engineering
  email: string;
  contact: string;
  currentSemester: number;
  results: SemesterResult[];
  avatarUrl?: string; // For AI generated avatar
}

export type ImageResolution = '1K' | '2K' | '4K';

export interface AnalysisResult {
  summary: string;
  weakAreas: string[];
  prediction: string;
  tips: string[];
}