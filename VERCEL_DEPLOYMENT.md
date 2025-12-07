# Vercel Deployment Guide

This guide explains how to deploy the CE Vault Result Dashboard to Vercel with proper environment variable configuration.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)

## Step 1: Import Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository `vinayakkumar9000/CE-VAULT-RESULT-DASHBOARD-2.0`
4. Vercel will auto-detect the Vite framework settings

## Step 2: Configure Environment Variables

Before deploying, add the Gemini API key:

1. In your Vercel project settings, go to **Settings** → **Environment Variables**
2. Add a new environment variable:
   - **Name**: `VITE_GEMINI_API_KEY`
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

**ONLY ONE STEP**: Add `VITE_GEMINI_API_KEY` in Vercel → Project → Environment Variables.

That's it! No other configuration is needed.

### ❌ What You DON'T Need

- ❌ NO GitHub Secrets required
- ❌ NO local `.env` file needed for deployment
- ❌ NO GitHub Actions workflow changes needed
- ❌ NO manual builds required

### How It Works

1. **Vercel automatically reads** `VITE_GEMINI_API_KEY` from the environment
2. **Vite config** (`vite.config.ts`) loads it from `process.env.VITE_GEMINI_API_KEY`
3. **Build process** replaces `import.meta.env.VITE_GEMINI_API_KEY` with the actual value
4. **Client code** in `services/geminiService.ts` uses the injected value

### Local Development

If you want to run the project locally:

1. Create a `.env` file in the project root:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. Run the development server:
   ```bash
   npm install
   npm run dev
   ```

⚠️ **Note**: The `.env` file is in `.gitignore` and will never be committed to Git.

## Security Considerations

### ⚠️ Client-Side Exposure

Environment variables with the `VITE_` prefix are **exposed to the browser**. This means:

- Anyone can view the API key by inspecting the JavaScript bundle
- This is **intentional** for client-side API calls
- Google Gemini API allows client-side keys with proper restrictions

### 🔒 Recommended Security Measures

To protect your API key:

1. **Set Application Restrictions** in Google Cloud Console:
   - Go to https://console.cloud.google.com/apis/credentials
   - Select your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your Vercel domain (e.g., `https://your-project-name.vercel.app/*`)

2. **Set API Restrictions**:
   - Restrict the key to only use "Generative Language API"
   - This prevents misuse for other Google services

3. **Monitor Usage**:
   - Regularly check your API usage in Google Cloud Console
   - Set up billing alerts to catch unexpected usage

### 🛡️ Alternative: Backend Proxy (Optional)

If you need to completely hide the API key:

1. Create a Vercel Serverless Function (API route)
2. Move the Gemini API calls to the backend
3. Use a non-`VITE_` prefixed environment variable (e.g., `GEMINI_API_KEY`)
4. Update your frontend to call your API route instead

This approach keeps the key server-side only but requires additional setup.

## Troubleshooting

### Build Fails

If the build fails, check:

1. ✅ Environment variable name is **exactly** `VITE_GEMINI_API_KEY`
2. ✅ Environment variable is added to all environments (Production, Preview, Development)
3. ✅ You triggered a new deployment after adding the environment variable

### API Key Not Working

If the API key is not being used:

1. Check the browser console for errors
2. Verify the environment variable is set correctly in Vercel
3. Redeploy the project to ensure the new environment variable is picked up

### API Key Exposed Warning

This is expected behavior. Vite exposes `VITE_*` variables to the client. See [Security Considerations](#security-considerations) above for how to protect your key.

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
2. Verify your API key is valid at https://aistudio.google.com/app/apikey
3. Ensure the Gemini API is enabled in your Google Cloud project
