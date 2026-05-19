# HITECH | Intelligent Software Systems

This is a premium Next.js enterprise platform architected for HITECH SOFTWARE COMPANY.

## 🚀 Deployment Instructions

### 1. GitHub
- Initialize a git repository: `git init`
- Add files: `git add .`
- Commit: `git commit -m "Initial HITECH deployment"`
- Push to your GitHub repository.

### 2. Vercel / App Hosting
When deploying to Vercel, ensure you configure the following Environment Variables:

#### Firebase Configuration (Client-Side)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### AI & Intelligence (Server-Side)
- `GOOGLE_GENAI_API_KEY`: Required for Zainab (AI Concierge) and the Strategy Studio.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Animations**: Framer Motion

## 📁 Architecture
- `/src/app`: Application routes and pages.
- `/src/components`: Reusable UI modules and section layouts.
- `/src/firebase`: Firebase initialization and custom data hooks.
- `/src/ai`: Genkit flows and AI logic.

---
© 2024 HITECH SOFTWARE COMPANY. Engineered for the extraordinary.