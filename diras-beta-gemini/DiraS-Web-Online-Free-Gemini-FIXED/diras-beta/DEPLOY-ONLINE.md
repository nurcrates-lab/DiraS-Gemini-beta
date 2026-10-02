# Deploy DiraS Beta to Vercel (Free-Tier Gemini)

DiraS Beta is configured to use the Gemini API so it can be tested with a Gemini Free Tier project, subject to Google's current free-tier quotas and limits.

## 1. Upload to GitHub
Upload the contents of this project to your GitHub repository.

## 2. Create a Gemini API key
1. Open Google AI Studio: https://aistudio.google.com/
2. Open Dashboard > API Keys.
3. Create or copy an API key for a Free Tier project.
4. Keep the key private. Do not commit it to GitHub.

## 3. Import the repository in Vercel
1. Sign in to https://vercel.com/ with GitHub.
2. Add New > Project.
3. Import your DiraS repository.
4. If your repository contains a `diras-beta` folder, set Root Directory to `diras-beta`.

## 4. Add Environment Variables
In Vercel > Project Settings > Environment Variables, add:

- `GEMINI_API_KEY` = your Gemini API key
- `GEMINI_WORKBOOK_MODEL` = `gemini-3.8-flash`

Apply them to Production (and Preview if you want test deployments to work too).

## 5. Deploy
Click Deploy. When deployment succeeds, Vercel gives you a public HTTPS URL.

## Notes
- Never put your API key in GitHub or client-side code.
- Free-tier availability and rate limits are controlled by Google and may change.
- The current Beta stores workbooks in the browser using localStorage; it does not yet have accounts/database sync.
