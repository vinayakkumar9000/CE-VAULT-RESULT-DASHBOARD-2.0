<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CE Vault Result Dashboard 2.0

A modern student result portal with AI-powered analytics using Google Gemini.

View your app in AI Studio: https://ai.studio/apps/drive/1Ml-lZxoDS9Xa4wT_iuLO5A51dJlszR8a

## 🚀 Quick Start

**Prerequisites:** Node.js 16+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Gemini API key:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Deployment

### Vercel (Recommended)

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick steps:**
1. Import your repository to Vercel
2. Add `VITE_GEMINI_API_KEY` environment variable in Vercel settings
3. Deploy!

### GitHub Pages

See [DEPLOYMENT.md](DEPLOYMENT.md) for PDF data extraction and GitHub Pages deployment instructions.
