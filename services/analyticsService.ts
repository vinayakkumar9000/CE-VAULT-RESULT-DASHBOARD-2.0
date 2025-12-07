import { track } from '@vercel/analytics';

/**
 * Track when a user searches for a student
 */
export const trackStudentSearch = (rollNumber: string) => {
    track('student_search', {
        rollNumber: rollNumber,
        timestamp: new Date().toISOString()
    });
};

/**
 * Track when a user views a student result
 */
export const trackResultView = (studentName: string, rollNumber: string) => {
    track('result_view', {
        studentName: studentName,
        rollNumber: rollNumber,
        timestamp: new Date().toISOString()
    });
};

/**
 * Track chatbot interactions
 */
export const trackChatbotInteraction = (message: string, messageLength: number) => {
    track('chatbot_interaction', {
        messageLength: messageLength,
        timestamp: new Date().toISOString()
    });
};

/**
 * Track page views
 */
export const trackPageView = (pageName: string) => {
    track('page_view', {
        page: pageName,
        timestamp: new Date().toISOString()
    });
};
