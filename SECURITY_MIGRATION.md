# Security Migration: Client-Side to Server-Side API Architecture

**Date**: December 7, 2025  
**PR**: Secure API Key with Vercel AI SDK  
**Status**: ✅ Complete

## Overview

This document details the security migration from exposing the Gemini API key in client-side code to a secure server-side architecture using Vercel Serverless Functions and the Vercel AI SDK.

## Security Problem

### Before (Insecure)
The application exposed the API key in client-side code:

```typescript
// ❌ INSECURE - Exposed in browser
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Vulnerabilities:**
- API key visible in browser JavaScript bundle
- Anyone could steal the key by inspecting network requests
- No way to rotate key without redeploying entire frontend
- Key could be extracted and used maliciously

### After (Secure)
The application now uses server-side API routes:

```typescript
// ✅ SECURE - Only in serverless functions
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
```

**Benefits:**
- API key never sent to browser
- Key stored securely in Vercel Environment Variables
- Can rotate key without code changes
- Industry-standard security practices

## Implementation Details

### 1. New Dependencies
Added Vercel AI SDK packages:
```json
{
  "dependencies": {
    "ai": "^3.4.33",
    "@ai-sdk/google": "^0.0.50"
  }
}
```

### 2. API Route Update (`api/chat.ts`)
**Before:**
- Used `@google/genai` package
- Custom chat implementation
- Non-streaming responses

**After:**
- Uses Vercel AI SDK's `@ai-sdk/google`
- Implements `streamText()` for streaming responses
- Handles messages array format from `useChat` hook
- Increased timeout to 60 seconds

Key changes:
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const result = await streamText({
  model: google('gemma-3-27b-it'),
  system: systemInstruction,
  messages,
});

return result.toDataStreamResponse();
```

### 3. ChatBot Component Update (`components/ChatBot.tsx`)
**Before:**
- Manual state management
- Custom message handling
- Called `chatWithAI` from geminiService

**After:**
- Uses `useChat` hook from `ai/react`
- Automatic streaming response handling
- Better UX with real-time typing indicator
- Optimized with `useMemo` for context data

Key changes:
```typescript
import { useChat } from 'ai/react';

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: { studentData: contextData }
});
```

### 4. Service Layer Cleanup (`services/geminiService.ts`)
**Removed:**
- `chatWithAI()` function (moved to API route)
- Direct imports from `studentDataHelper`

**Kept:**
- `analyzeStudentPerformance()` - still uses `/api/analyze`
- `getSubjectDetails()` - still uses `/api/subject`
- `generateStudentAvatar()` - disabled (placeholder)

### 5. Environment Variable Changes

**Old (Insecure):**
```bash
VITE_GEMINI_API_KEY=your_key_here
```

**New (Secure):**
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

**Why the name change:**
- `VITE_*` prefix exposes variable to browser
- `GOOGLE_GENERATIVE_AI_API_KEY` is auto-detected by Vercel AI SDK
- Follows industry naming conventions
- Backward compatible with `GEMINI_API_KEY` fallback

### 6. Configuration Updates

**vercel.json:**
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```
Increased from 30 to 60 seconds to prevent timeout errors.

### 7. Documentation Updates
Updated all documentation to reflect secure architecture:
- ✅ `README.md` - Quick start guide
- ✅ `VERCEL_DEPLOYMENT.md` - Detailed deployment instructions
- ✅ `GEMMA_MODEL_USAGE.md` - AI model configuration
- ✅ `IMPLEMENTATION_SUMMARY.md` - Environment variables
- ✅ `.env.example` - Example configuration

## Architecture Diagram

### Old Architecture (Insecure)
```
┌─────────────────┐
│   Client        │
│   (Browser)     │
│                 │
│ Has API Key     │ ❌ INSECURE
│ ↓               │
│ Direct API Call │
│ ↓               │
└─────────────────┘
        ↓
┌─────────────────┐
│  Google Gemini  │
│      API        │
└─────────────────┘
```

### New Architecture (Secure)
```
┌─────────────────┐
│   Client        │
│   (Browser)     │
│                 │
│ No API Key      │ ✅ SECURE
│ ↓               │
│ POST /api/chat  │
└─────────────────┘
        ↓
┌─────────────────┐
│ Vercel          │
│ Serverless      │
│ Function        │
│                 │
│ Has API Key     │ ✅ SECURE
│ ↓               │
│ Vercel AI SDK   │
└─────────────────┘
        ↓
┌─────────────────┐
│  Google Gemini  │
│      API        │
└─────────────────┘
```

## Testing & Validation

### Build Test
```bash
npm run build
```
✅ Build successful with no errors

### Code Review
✅ Passed automated code review with fixes:
- Removed `process.env` mutation anti-pattern
- Added `useMemo` optimization for performance
- Fixed TypeScript type safety

### Security Scan
✅ CodeQL security scan passed with 0 alerts

### Known Vulnerabilities (npm audit)
⚠️ The following vulnerabilities exist in dependencies:
- `@ai-sdk/google` (moderate) - can upgrade to v2.0.44 (breaking change)
- `ai` (moderate) - can upgrade to v5.0.108 (breaking change)
- `@vercel/node` (high) - requires downgrade to v2.3.0 (breaking change)

**Decision:** Not addressing in this PR to maintain minimal changes. These should be addressed in a follow-up PR with comprehensive testing.

## Migration Guide for Developers

If you're updating an existing deployment:

### Step 1: Update Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Remove: `VITE_GEMINI_API_KEY`
3. Add: `GOOGLE_GENERATIVE_AI_API_KEY` with your API key
4. Apply to: Production, Preview, Development

### Step 2: Deploy New Code
1. Merge this PR to main branch
2. Vercel will automatically deploy
3. Monitor deployment logs for any errors

### Step 3: Test
1. Open the deployed application
2. Test the chatbot functionality
3. Verify no API key is visible in browser console/network tab
4. Check Vercel Function logs if issues occur

### Step 4: Clean Up Local Development
1. Update your local `.env` file:
   ```bash
   # Remove
   VITE_GEMINI_API_KEY=...
   
   # Add
   GOOGLE_GENERATIVE_AI_API_KEY=...
   ```
2. Run `npm install` to get new dependencies
3. Test locally with `npm run dev`

## Security Best Practices

### ✅ DO
- Store API keys in Vercel Environment Variables
- Use server-side API routes for all AI operations
- Use `GOOGLE_GENERATIVE_AI_API_KEY` as the environment variable name
- Rotate keys regularly
- Monitor API usage in Google Cloud Console

### ❌ DON'T
- Never use `VITE_*` prefix for secrets (exposes to client)
- Never commit API keys to git
- Never hardcode API keys in source code
- Never share API keys in documentation or screenshots

## Files Changed

| File | Lines Changed | Type |
|------|---------------|------|
| `package.json` | +2 | Dependencies added |
| `package-lock.json` | +1029 | Lock file update |
| `api/chat.ts` | ~46 | Complete rewrite |
| `components/ChatBot.tsx` | ~180 | Significant refactor |
| `services/geminiService.ts` | -35 | Function removed |
| `.env.example` | ~6 | Variable renamed |
| `GEMMA_MODEL_USAGE.md` | +40 | Security docs added |
| `IMPLEMENTATION_SUMMARY.md` | ~10 | Env var updated |
| `VERCEL_DEPLOYMENT.md` | +71/-35 | Complete rewrite |
| `README.md` | +3/-1 | Quick start updated |
| `vercel.json` | +1 | Timeout increased |

**Total:** 11 files changed, ~1200 insertions, ~150 deletions

## Rollback Plan

If issues occur after deployment:

1. **Quick Fix**: Revert to previous deployment in Vercel Dashboard
2. **Environment Variable**: Switch back to `VITE_GEMINI_API_KEY` temporarily
3. **Code Rollback**: Revert the PR commits
4. **Debug**: Check Vercel Function logs for error details

## Future Improvements

1. **Dependency Updates**: Upgrade to latest versions of `ai` and `@ai-sdk/google` packages
2. **Caching**: Implement response caching for common queries
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Error Handling**: Enhanced error messages for better debugging
5. **Monitoring**: Add application monitoring and alerting

## References

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Google Generative AI API](https://ai.google.dev/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables Best Practices](https://12factor.net/config)

## Contact

For questions or issues related to this migration, please:
1. Check the updated documentation files
2. Review Vercel Function logs
3. Open an issue on GitHub with detailed error information

---

**Migration completed successfully on December 7, 2025**  
**Security Status**: ✅ All API keys now secured server-side
