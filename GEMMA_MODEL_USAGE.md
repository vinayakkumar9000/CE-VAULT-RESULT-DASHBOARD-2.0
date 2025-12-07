# Gemma AI Model Usage Strategy

This document explains how the Gemma AI model is used across the application to optimize for performance.

## Model Used

| Model | Usage |
|-------|-------|
| **gemma-3-27b** | ✅ Chatbot (fast responses) |
| **gemma-3-27b** | ✅ Analysis (deeper thinking) |

## Model Assignment by Feature

### 1. **Chatbot (CE VAULT AI ASSIST)**
- **Model**: `gemma-3-27b`
- **Use Case**: Quick student data queries, roll number lookups, marks checking
- **File**: `services/geminiService.ts` → `chatWithAI()`

### 2. **Student Performance Analysis**
- **Model**: `gemma-3-27b`
- **Use Case**: Analyzing student performance, identifying weak areas, providing tips
- **File**: `services/geminiService.ts` → `analyzeStudentPerformance()`

### 3. **Subject Details & Study Resources**
- **Model**: `gemma-3-27b`
- **Use Case**: Providing study resources and guidance for weak subjects
- **File**: `services/geminiService.ts` → `getSubjectDetails()`

### 4. **Avatar Generation**
- **Model**: None (Disabled)
- **Why**: Image generation models not available in free tier
- **Use Case**: Falls back to default avatars
- **File**: `services/geminiService.ts` → `generateStudentAvatar()`

## Model Benefits

The Gemma-3-27b model provides:
- ✅ High-quality responses for chatbot interactions
- ✅ Deep analysis capabilities for student performance
- ✅ Educational content generation for study resources
- ✅ Optimal performance for the application

## Future Improvements

If you need to scale:
1. Add multiple API keys and implement round-robin selection
2. Implement request queuing for rate limit management
3. Add caching for frequently asked questions
4. Consider upgrading to paid tier for higher limits

---

**Note**: All models are accessed through a single `VITE_GEMINI_API_KEY` environment variable.
