import { track } from '@vercel/analytics';

/**
 * Track when a user searches for a student
 * Only tracks metadata for privacy
 */
export const trackStudentSearch = () => {
    track('student_search', {
        timestamp: new Date().toISOString()
    });
};

/**
 * Track when a user views a student result
 * Only tracks metadata for privacy, not actual student identifiers
 */
export const trackResultView = () => {
    track('result_view', {
        timestamp: new Date().toISOString()
    });
};

/**
 * Track chatbot interactions
 * Only tracks metadata, not the actual message content to protect user privacy
 */
export const trackChatbotInteraction = (messageLength: number, queryType?: string) => {
    track('chatbot_interaction', {
        messageLength: messageLength,
        queryType: queryType || 'general',
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
