import { track } from '@vercel/analytics';

/**
 * Analytics service for tracking custom events.
 * Note: Consider privacy regulations (GDPR, CCPA) when tracking user data.
 * These functions are optional and should only be used if compliant with your privacy policy.
 */

// Track when a student searches for results
export const trackStudentSearch = (rollNumber: string) => {
  track('student_search', {
    rollNumber,
  });
};

// Track when a student views their results
export const trackResultView = (rollNumber: string, studentName: string) => {
  track('result_view', {
    rollNumber,
    studentName,
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
