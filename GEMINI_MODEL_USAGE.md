# Gemini AI Model Usage Strategy

This document explains how different Gemini AI models are used across the application to optimize for performance and stay within free tier limits.

## Free Tier Models Used

Based on your Google AI Studio free tier quota:

| Model | RPM Limit | TPM Limit | Usage |
|-------|-----------|-----------|-------|
| **gemini-2.5-flash-lite** | 10 | 250K | ✅ Chatbot (fast responses) |
| **gemini-2.5-flash** | 5 | 250K | ✅ Analysis (deeper thinking) |

## Model Assignment by Feature

### 1. **Chatbot (CE VAULT AI ASSIST)**
- **Model**: `gemini-2.5-flash-lite`
- **Why**: Fast, responsive, higher RPM limit (10 requests/min)
- **Use Case**: Quick student data queries, roll number lookups, marks checking
- **File**: `services/geminiService.ts` → `chatWithAI()`

### 2. **Student Performance Analysis**
- **Model**: `gemini-2.5-flash`
- **Why**: Higher quality reasoning, deeper analysis
- **Use Case**: Analyzing student performance, identifying weak areas, providing tips
- **File**: `services/geminiService.ts` → `analyzeStudentPerformance()`

### 3. **Subject Details & Study Resources**
- **Model**: `gemini-2.5-flash`
- **Why**: Better educational content generation
- **Use Case**: Providing study resources and guidance for weak subjects
- **File**: `services/geminiService.ts` → `getSubjectDetails()`

### 4. **Avatar Generation**
- **Model**: None (Disabled)
- **Why**: Image generation models not available in free tier
- **Use Case**: Falls back to default avatars
- **File**: `services/geminiService.ts` → `generateStudentAvatar()`

## Load Distribution Strategy

Since we're using a **single API key** with **different models**, the load is naturally distributed:

1. **High-frequency requests** → `gemini-2.5-flash-lite` (chatbot)
   - Most user interactions happen here
   - 10 RPM limit handles normal usage

2. **Low-frequency requests** → `gemini-2.5-flash` (analysis)
   - Analysis is requested less often
   - 5 RPM limit is sufficient

This ensures:
- ✅ No single model gets overloaded
- ✅ Better user experience (fast chatbot + quality analysis)
- ✅ Stays within free tier limits
- ✅ Optimal use of available quota

## Rate Limit Handling

If you exceed rate limits:
- The application will show error messages
- Users can retry after a moment
- Consider adding exponential backoff for production

## Future Improvements

If you need to scale beyond free tier:
1. Add multiple API keys and implement round-robin selection
2. Implement request queuing for rate limit management
3. Add caching for frequently asked questions
4. Consider upgrading to paid tier for higher limits

---

**Note**: All models are accessed through a single `VITE_GEMINI_API_KEY` environment variable.
