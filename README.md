# HITECH | Intelligent Software Systems

This is a premium Next.js enterprise platform architected for HITECH SOFTWARE COMPANY.

## 🚀 GitHub & Vercel Deployment

Follow these steps to host the HITECH platform on Vercel using your repository.

### 1. Push to GitHub
If you haven't pushed your code yet, run these commands in your terminal:
```bash
git init
git remote add origin https://github.com/hitechsoftware1/hitechweb.git
git add .
git commit -m "Prepare HITECH platform for Vercel"
git branch -M main
git push -u origin main
```

### 2. Import to Vercel
- Log in to [Vercel](https://vercel.com).
- Click **Add New** > **Project**.
- Select the `hitechweb` repository from your GitHub list.

### 3. Configure Environment Variables
In the Vercel "Configure Project" screen, add these keys from your `.env`:

#### Firebase Core
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### AI Intelligence
- `GOOGLE_GENAI_API_KEY`: Obtain from [Google AI Studio](https://aistudio.google.com/).

#### Mail Bridge (Nodemailer)
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

### 4. Deploy
Click **Deploy**. Vercel will autonomously build and host your HITECH platform.

---
## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Email**: Nodemailer (Mail Bridge)

© 2024 HITECH SOFTWARE COMPANY. Engineered for the extraordinary.
