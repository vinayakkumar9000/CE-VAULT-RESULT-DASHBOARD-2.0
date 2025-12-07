import { track } from '@vercel/analytics';

// Track when a student searches for results
export const trackStudentSearch = (rollNumber: string) => {
  track('student_search', {
    rollNumber: rollNumber,
  });
};

// Track when a student views their results
export const trackResultView = (rollNumber: string, studentName: string) => {
  track('result_view', {
    rollNumber: rollNumber,
    studentName: studentName,
  });
};

// Track when user interacts with chatbot
export const trackChatbotInteraction = () => {
  track('chatbot_opened');
};

// Track page navigation
export const trackPageView = (pageName: string) => {
  track('page_view', {
    page: pageName,
  });
};
