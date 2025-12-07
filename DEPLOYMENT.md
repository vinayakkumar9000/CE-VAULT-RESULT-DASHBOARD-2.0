# PDF Data Extraction and Deployment Guide

This document explains how to extract student data from PDF mark sheets and deploy the website to GitHub Pages.

## Prerequisites

- Python 3.x with pip
- Node.js (v16+) and npm
- PDF files in the `result/` directory

## Step 1: Extract Data from PDFs

Install the required Python library:

```bash
pip install pdfplumber
```

Run the extraction script to parse all PDF files:

```bash
python3 extract_pdf_data.py
```

This will:
- Parse all PDF files in the `result/` directory
- Extract subject-wise data (subject name, credits, marks, grades, etc.)
- Generate individual JSON files for each student (e.g., `result/211271524001.json`)
- Create a combined `result/all_students.json` file

### Extracted Data Format

Each subject has the following fields:
- `subject_name`: Name of the subject (as written in PDF)
- `credits`: Credit value (e.g., "1.0", "3.0")
- `total_marks`: Maximum marks (e.g., "015", "100", "025")
- `marks_internal`: Internal assessment marks
- `marks_final`: Final exam marks (empty if no final exam)
- `marks_total`: Total marks obtained
- `grade`: Grade (A+, A, B, C, D, E)
- `category`: One of "THEORY", "PRACTICAL", "TERM WORK"

## Step 2: Convert to Application Format

Run the conversion script to transform extracted data into TypeScript format:

```bash
python3 convert_to_app_format.py
```

This will:
- Load `result/all_students.json`
- Calculate SGPA, percentile, and other statistics
- Generate `generatedData.ts` with TypeScript-formatted data
- Create `result/students_app_format.json` for debugging

## Step 3: Build the Application

Install dependencies and build:

```bash
npm install
npm run build
```

The built files will be in the `dist/` directory.

## Step 4: Deploy to GitHub Pages

### Automatic Deployment (Recommended)

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup Instructions:**

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push your changes to the `main` branch
4. The workflow will automatically build and deploy

Your site will be available at:
```
https://[username].github.io/CE-VAULT-RESULT-DASHBOARD-2.0/
```

### Manual Deployment

If you need to deploy manually:

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to your hosting service

## Step 5: Verify Deployment

Once deployed, verify:
- All 81 student cards are visible on the home page
- Search functionality works
- Clicking a student card shows detailed results
- All subjects are categorized correctly (Theory, Practical, Term Work)

## Updating Data

When new PDFs are added or existing ones are updated:

1. Place PDF files in the `result/` directory
2. Run `python3 extract_pdf_data.py`
3. Run `python3 convert_to_app_format.py`
4. Commit the changes to Git
5. Push to `main` branch (automatic deployment will trigger)

## Troubleshooting

### PDFs not parsing correctly
- Check that PDF files are in the correct format
- Verify the PDF contains the expected sections (THEORY PAPERS, PRACTICAL PAPERS, TERM WORK PAPERS)
- Check the extraction script output for errors

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify `generatedData.ts` is properly formatted

### GitHub Pages not updating
- Check the Actions tab in your repository for build logs
- Verify GitHub Pages is enabled in repository settings
- Ensure the workflow has proper permissions

## Notes

- The application is configured to use the base path `/CE-VAULT-RESULT-DASHBOARD-2.0/` for GitHub Pages
- If deploying to a custom domain, update the `base` in `vite.config.ts`
- Student data is embedded in the JavaScript bundle for fast loading
- No backend server is required - this is a static site
