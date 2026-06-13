# HITECH | Intelligent Software Systems

This is a premium Next.js enterprise platform architected for HITECH SOFTWARE COMPANY.

## 🚀 Vercel Deployment Instructions

Follow these steps to host the HITECH platform on Vercel:

### 1. Push to GitHub
- Initialize a git repository: `git init`
- Add all files: `git add .`
- Commit changes: `git commit -m "Prepare for Vercel deployment"`
- Create a new repository on GitHub and push your code.

### 2. Import to Vercel
- Log in to [Vercel](https://vercel.com).
- Click **Add New** > **Project**.
- Import your GitHub repository.

### 3. Configure Environment Variables
In the Vercel "Configure Project" screen, expand the **Environment Variables** section and add the following keys (values found in your `.env` file):

#### Firebase (Required for Database & Auth)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### AI Intelligence (Required for Zainab & Strategy Studio)
- `GOOGLE_GENAI_API_KEY`: Obtain this from the [Google AI Studio](https://aistudio.google.com/).

#### Mail Bridge (Required for Onboarding & Contact)
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

### 4. Deploy
- Click **Deploy**. Vercel will autonomously build and host your HITECH platform.

---
## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Email**: Nodemailer (Mail Bridge)

© 2024 HITECH SOFTWARE COMPANY. Engineered for the extraordinary.
