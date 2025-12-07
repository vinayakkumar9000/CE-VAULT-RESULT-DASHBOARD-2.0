# Gemma AI Model Usage Strategy

This document explains how the Gemma AI model is used across the application with secure server-side architecture.

## Model Used

| Model | Usage |
|-------|-------|
| **gemma-3-27b-it** | ✅ Chatbot (fast responses) |
| **gemma-3-27b-it** | ✅ Analysis (deeper thinking) |

## Secure Architecture

### Server-Side API Routes
All AI operations now use **Vercel Serverless Functions** with the **Vercel AI SDK**:

- **API Key Location**: Server-side only (in Vercel Environment Variables)
- **Client Access**: Frontend calls `/api/chat`, `/api/analyze`, `/api/subject` routes
- **Security**: API key never exposed to client-side code
- **Environment Variable**: `GOOGLE_GENERATIVE_AI_API_KEY` (auto-detected by Vercel AI SDK)

### Migration from Client-Side
**Before (Insecure):**
```typescript
// ❌ Client-side API key exposure
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**After (Secure):**
```typescript
// ✅ Server-side API route
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  // ... secure processing
}
```

## Model Assignment by Feature

### 1. **Chatbot (CE VAULT AI ASSIST)**
- **Model**: `gemma-3-27b-it`
- **Use Case**: Quick student data queries, roll number lookups, marks checking
- **Implementation**: `api/chat.ts` using Vercel AI SDK's `streamText()`
- **Frontend**: `components/ChatBot.tsx` using `useChat` hook for streaming responses

### 2. **Student Performance Analysis**
- **Model**: `gemma-3-27b-it`
- **Use Case**: Analyzing student performance, identifying weak areas, providing tips
- **Implementation**: `api/analyze.ts` with structured JSON output
- **Frontend**: `services/geminiService.ts` → `analyzeStudentPerformance()`

### 3. **Subject Details & Study Resources**
- **Model**: `gemma-3-27b-it`
- **Use Case**: Providing study resources and guidance for weak subjects
- **Implementation**: `api/subject.ts`
- **Frontend**: `services/geminiService.ts` → `getSubjectDetails()`

### 4. **Avatar Generation**
- **Model**: None (Disabled)
- **Why**: Image generation models not available in free tier
- **Use Case**: Falls back to default avatars
- **Implementation**: `services/geminiService.ts` → `generateStudentAvatar()`

## Model Benefits

The Gemma-3-27b-it model with Vercel AI SDK provides:
- ✅ High-quality responses for chatbot interactions
- ✅ Deep analysis capabilities for student performance
- ✅ Educational content generation for study resources
- ✅ Streaming responses for better user experience
- ✅ Secure server-side API key management
- ✅ Optimal performance for the application

## Environment Setup

### Vercel Deployment
Set the environment variable in Vercel Dashboard:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### Local Development
Create a `.env` file (not committed to git):
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

**Legacy Support**: The system also supports `GEMINI_API_KEY` for backward compatibility.

## Future Improvements

If you need to scale:
1. Add multiple API keys and implement round-robin selection
2. Implement request queuing for rate limit management
3. Add caching for frequently asked questions
4. Consider upgrading to paid tier for higher limits
5. Implement response caching for common queries

## Security Best Practices

✅ **DO:**
- Store API keys in Vercel Environment Variables
- Use server-side API routes for all AI operations
- Use `GOOGLE_GENERATIVE_AI_API_KEY` as the environment variable name

❌ **DON'T:**
- Never use `VITE_*` prefix for API keys (exposes to client)
- Never import API keys in client-side code
- Never commit API keys to version control

---

**Note**: All AI operations are now secured through Vercel Serverless Functions using the Vercel AI SDK.
