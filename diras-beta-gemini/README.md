# DiraS Beta

**Digital Instructional Resource and Worksheet System**  
*From Learning Objectives to Meaningful Worksheets.*

DiraS Beta turns lesson objectives, materials and learning methods into an editable AI-generated workbook.

## Beta features
- Workbook input form
- Bahasa Indonesia, English and Arabic output
- Arabic RTL rendering
- Gemini AI workbook generation
- Section-level AI regeneration for Stimulus and Material Snapshot
- Objective/activity/assessment alignment indicators
- Browser local autosave
- Preview / print-to-PDF
- DOCX download

## Online deployment
The easiest path is GitHub + Vercel. See `DEPLOY-ONLINE.md`.

## Environment variables

```env
GEMINI_API_KEY=your_gemini_key_here
GEMINI_WORKBOOK_MODEL=gemini-3.8-flash
```

Do not commit real API keys to GitHub.

## Local development (optional)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
