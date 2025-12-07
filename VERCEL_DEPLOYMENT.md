# Vercel Deployment Guide

This guide explains how to deploy the CE Vault Result Dashboard to Vercel with secure server-side API key management.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)

## Step 1: Import Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository `vinayakkumar9000/CE-VAULT-RESULT-DASHBOARD-2.0`
4. Vercel will auto-detect the Vite framework settings

## Step 2: Configure Environment Variables

Before deploying, add the Gemini API key **securely**:

1. In your Vercel project settings, go to **Settings** → **Environment Variables**
2. Add a new environment variable:
   - **Name**: `GOOGLE_GENERATIVE_AI_API_KEY` (recommended) or `GEMINI_API_KEY` (legacy)
   - **Value**: Your Gemini API key (e.g., `AIzaSy...`)
   - **Environment**: Select all three options:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **Save**

## Step 3: Deploy

1. Click **Deploy** in Vercel
2. Wait for the build to complete (~1-2 minutes)
3. Your site will be live at `https://your-project-name.vercel.app`

## Important Notes

### ✅ What You Need to Do

**ONLY ONE STEP**: Add `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel → Project → Environment Variables.

That's it! No other configuration is needed.

### ❌ What You DON'T Need

- ❌ NO GitHub Secrets required
- ❌ NO local `.env` file needed for deployment
- ❌ NO GitHub Actions workflow changes needed
- ❌ NO manual builds required
- ❌ NO `VITE_*` prefixed variables (security risk!)

### How It Works (Secure Architecture)

1. **Server-Side API Routes**: All AI operations use Vercel Serverless Functions in `api/` directory
2. **Environment Variables**: API key stored securely server-side, never exposed to client
3. **Vercel AI SDK**: Uses `@ai-sdk/google` for streaming responses
4. **Client Calls**: Frontend calls `/api/chat`, `/api/analyze`, `/api/subject` endpoints
5. **Zero Client Exposure**: API key never appears in browser JavaScript

### Architecture Overview

```
Client (Browser)
    ↓ POST /api/chat
Vercel Serverless Function (api/chat.ts)
    ↓ Uses process.env.GOOGLE_GENERATIVE_AI_API_KEY
Google Gemini API
    ↓ Streaming response
Client receives AI response
```

### Local Development

If you want to run the project locally:

1. Create a `.env` file in the project root:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

2. Run the development server:
   ```bash
   npm install
   npm run dev
   ```

⚠️ **Note**: The `.env` file is in `.gitignore` and will never be committed to Git.

## Security Considerations

### ✅ Secure Server-Side Architecture

This application uses a **secure server-side architecture**:

- ✅ API key stored **only** in Vercel Environment Variables
- ✅ API key **never** exposed to client-side code
- ✅ All AI operations through serverless functions
- ✅ Uses Vercel AI SDK for industry-standard security
- ✅ No `VITE_*` prefixed variables (which expose to browser)

### 🔒 Additional Security Measures

To further protect your API key:

1. **Set Application Restrictions** in Google Cloud Console:
   - Go to https://console.cloud.google.com/apis/credentials
   - Select your API key
   - Under "Application restrictions", select "IP addresses"
   - Add Vercel's IP ranges if needed (or use HTTP referrers for your domain)

2. **Set API Restrictions**:
   - Restrict the key to only use "Generative Language API"
   - This prevents misuse for other Google services

3. **Monitor Usage**:
   - Regularly check your API usage in Google Cloud Console
   - Set up billing alerts to catch unexpected usage

### 🛡️ Why This is Secure

Unlike the previous client-side approach:

- **Before (Insecure)**: `VITE_GEMINI_API_KEY` was embedded in browser JavaScript
- **After (Secure)**: `GOOGLE_GENERATIVE_AI_API_KEY` only exists in serverless functions

This architecture prevents:
- ❌ API key theft from browser inspection
- ❌ Unauthorized usage from leaked keys
- ❌ Direct API quota abuse

## Troubleshooting

### Build Fails

If the build fails, check:

1. ✅ Environment variable name is **exactly** `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY`
2. ✅ Environment variable is added to all environments (Production, Preview, Development)
3. ✅ You triggered a new deployment after adding the environment variable

### API Key Not Working

If the API key is not being used:

1. Check the browser console for errors
2. Check Vercel Function logs for API errors
3. Verify the environment variable is set correctly in Vercel
4. Redeploy the project to ensure the new environment variable is picked up

### Serverless Function Timeout

If you see timeout errors:

1. The `maxDuration` is set to 60 seconds in `vercel.json`
2. Check Vercel logs to see if the AI model is responding slowly
3. Consider upgrading your Vercel plan for longer timeouts

## Redeployment

To trigger a new deployment:

1. Push changes to your GitHub repository, OR
2. In Vercel Dashboard, go to "Deployments" → Click "..." on any deployment → "Redeploy"

Vercel will automatically:
- Pull the latest code
- Read the environment variables
- Build and deploy

## Support

If you encounter issues:

1. Check Vercel build logs in the "Deployments" tab
2. Check Vercel Function logs for runtime errors
3. Verify your API key is valid at https://aistudio.google.com/app/apikey
4. Ensure the Gemini API is enabled in your Google Cloud project

## Migration from Old Client-Side Architecture

If you're migrating from the old `VITE_GEMINI_API_KEY` approach:

1. **Remove** the old `VITE_GEMINI_API_KEY` environment variable from Vercel
2. **Add** the new `GOOGLE_GENERATIVE_AI_API_KEY` environment variable
3. **Redeploy** the application
4. **Test** that the chatbot and AI features work correctly

The application now uses Vercel AI SDK with server-side API routes for maximum security.
