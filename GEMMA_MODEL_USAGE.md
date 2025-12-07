# Gemini AI Model Usage Strategy

This document explains how the Gemini AI model is used across the application with secure server-side architecture.

## Model Used

| Model | Usage |
|-------|-------|
| **gemini-robotics-er-1.5-preview** | ✅ Chatbot (streaming responses) |
| **gemini-robotics-er-1.5-preview** | ✅ Analysis (structured JSON output) |
| **gemini-robotics-er-1.5-preview** | ✅ Subject Details (text generation) |

## Secure Architecture

### Server-Side API Routes
All AI operations use **Vercel Serverless Functions** with centralized Gemini client:

- **API Key Location**: Server-side only (in Vercel Environment Variables)
- **Client Access**: Frontend calls `/api/chat`, `/api/analyze`, `/api/subject` routes
- **Security**: API key never exposed to client-side code
- **Environment Variable**: `GEMINI_API_KEY` (required)
- **Model Configuration**: `GEMINI_MODEL` (optional, defaults to `gemini-robotics-er-1.5-preview`)

### Centralized Client

All AI operations use the centralized client in `lib/aiClient.ts`:

```typescript
// ✅ Centralized client usage
import { callModel, callModelJSON } from '../lib/aiClient';

// For text generation
const text = await callModel(prompt);

// For structured JSON responses
const data = await callModelJSON(prompt, jsonSchema);
```

## Model Assignment by Feature

### 1. **Chatbot (CE VAULT AI ASSIST)**
- **Model**: `gemini-robotics-er-1.5-preview`
- **Use Case**: Quick student data queries, roll number lookups, marks checking
- **Implementation**: `api/chat.ts` using Vercel AI SDK's `streamText()` for streaming
- **Frontend**: `components/ChatBot.tsx` using `useChat` hook for streaming responses
- **Client**: Uses centralized `getModelName()` for model configuration

### 2. **Student Performance Analysis**
- **Model**: `gemini-robotics-er-1.5-preview`
- **Use Case**: Analyzing student performance, identifying weak areas, providing tips
- **Implementation**: `api/analyze.ts` using centralized `callModelJSON()` with structured JSON output
- **Frontend**: `services/geminiService.ts` → `analyzeStudentPerformance()`

### 3. **Subject Details & Study Resources**
- **Model**: `gemini-robotics-er-1.5-preview`
- **Use Case**: Providing study resources and guidance for weak subjects
- **Implementation**: `api/subject.ts` using centralized `callModel()`
- **Frontend**: `services/geminiService.ts` → `getSubjectDetails()`

### 4. **Avatar Generation**
- **Model**: None (Disabled)
- **Why**: Image generation not supported by Gemini models
- **Use Case**: Falls back to default avatars
- **Implementation**: `services/geminiService.ts` → `generateStudentAvatar()`

## Model Benefits

The `gemini-robotics-er-1.5-preview` model provides:
- ✅ High-quality responses for chatbot interactions
- ✅ Deep analysis capabilities for student performance
- ✅ Educational content generation for study resources
- ✅ Streaming responses for better user experience
- ✅ Secure server-side API key management
- ✅ Centralized configuration for easy maintenance

## Environment Setup

### Required Environment Variables

**GEMINI_API_KEY** (required)
- Your Google Gemini API key
- Get it from: https://aistudio.google.com/app/apikey
- Must be set in both local development and production

**GEMINI_MODEL** (optional)
- Model name to use (defaults to `gemini-robotics-er-1.5-preview`)
- Can be overridden if needed

### Vercel Deployment
Set the environment variables in Vercel Dashboard:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-robotics-er-1.5-preview  # Optional
```

### Local Development
Create a `.env` file (not committed to git):
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-robotics-er-1.5-preview  # Optional
```

## Centralized Client API

The `lib/aiClient.ts` module provides:

- `callModel(prompt, options?)` - Generate text responses
- `callModelJSON<T>(prompt, jsonSchema, options?)` - Generate structured JSON responses
- `getModelName()` - Get the configured model name

All functions automatically:
- Read `GEMINI_API_KEY` from environment
- Use `GEMINI_MODEL` or default to `gemini-robotics-er-1.5-preview`
- Handle errors with clear messages
- Manage client initialization

## Security Best Practices

✅ **DO:**
- Store API keys in Vercel Environment Variables
- Use server-side API routes for all AI operations
- Use `GEMINI_API_KEY` as the environment variable name
- Keep API keys out of version control

❌ **DON'T:**
- Never use `VITE_*` prefix for API keys (exposes to client)
- Never import API keys in client-side code
- Never commit API keys to version control
- Never hardcode API keys in source code

---

**Note**: All AI operations are secured through Vercel Serverless Functions using a centralized Gemini client.
