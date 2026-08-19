# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HITECH SOFTWARE COMPANY's marketing/enterprise platform — a Next.js 15 (App Router) site with a Firebase backend (Firestore + Auth) and Genkit-powered AI flows (Gemini 2.5 Flash). Public marketing pages, a client/staff/admin portal system, and an AI solution consultant live in one app.

## Commands

```bash
npm run dev          # Next dev server (Turbopack) on port 9002
npm run build         # Production build (sets NODE_ENV=production; requires a POSIX shell — use Git Bash/WSL on Windows, not PowerShell, or prefix with cross-env)
npm run start          # Serve the production build
npm run lint            # next lint
npm run typecheck        # tsc --noEmit
npm run genkit:dev        # Run Genkit dev UI against src/ai/dev.ts
npm run genkit:watch       # Same, with watch mode
```

There is no test runner configured in this repo (no test script, no test framework dependency).

`next.config.ts` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — `next build` will succeed even with type or lint errors, so run `typecheck` and `lint` explicitly to catch issues.

## Architecture

### App Router structure (`src/app`)
Route groups map directly to marketing pages (`about`, `services`, `portfolio`, `case-studies`, `blog`, `careers`, `contact`, `mobile-apps`, `ai-studio`, `ai-tools`, `testimonials`, `team`, `pricing`, etc.) plus three portal areas with different audiences:
- `admin/*` — super-admin console (clients, communications, talent, system, web-management, my-account, marketplace). Every sub-portal page (`web-management`, `clients`, `talent`, `system`, `communications`, `marketplace`) gates itself with the same pattern: `isSuperAdmin = user?.email === 'hitechsoftware03@gmail.com'`, a `useDoc` fetch of `users/{uid}` for `profile`, and `hasXAccess = isSuperAdmin || profile?.accessiblePortals?.includes('portalId')` — both the `useEffect` redirect and the loading-gate `if` at the bottom of the component must check `hasXAccess`, not just `isSuperAdmin`, or delegated staff granted that portal in onboarding can never actually get past the redirect. This must stay in lockstep with `firestore.rules`: any collection a portal's page reads/writes needs `isSuperAdmin() || hasPortalAccess('portalId')`, not `isSuperAdmin()` alone, or the page loads but every write silently permission-denies. A new portal id needs updating in four places: the modules array in `admin/page.tsx`, the onboarding checkbox list in `admin/system/page.tsx`, the page's own gate, and `firestore.rules`.
- `portal/*` and `staff/*` — client/staff-facing views.
- `api/contact/route.ts` — generic mail-bridge API route (Nodemailer via `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`); any client component can POST arbitrary fields plus a `type` label and it emails `hitechsoftware03@gmail.com` by default.
- `api/admin/create-worker/route.ts` — the only route using the Firebase **Admin** SDK. Verifies the caller's ID token server-side and requires the Super Admin email before provisioning a real Firebase Auth account + `users/{uid}` Firestore profile for a new worker (see "Admin SDK" below). Called from `admin/system/page.tsx`'s onboarding dialog — do not go back to writing a Firestore-only `users` doc with a random id for onboarding, since `/login` authenticates against real Firebase Auth and that doc would never be able to sign in.

### Firebase integration (`src/firebase`)
A hand-rolled context/provider layer wraps the Firebase SDK for client components:
- `index.ts` — `initializeFirebase()` lazily creates the singleton `FirebaseApp`/`Firestore`/`Auth` instances from `config.ts` (populated from `NEXT_PUBLIC_FIREBASE_*` env vars).
- `client-provider.tsx` (`FirebaseClientProvider`) initializes Firebase once on the client and feeds it into `provider.tsx`'s `FirebaseProvider`/`useFirebase()`/`useFirestore()`/`useAuth()` context. Mounted once in `src/app/layout.tsx`.
- `firestore/use-collection.tsx` and `firestore/use-doc.tsx` — hooks for subscribing to Firestore data.
- `auth/use-user.tsx` — current-user hook.
- `errors.ts` + `error-emitter.ts` — Firestore permission errors are thrown as `FirestorePermissionError` (carries the path/operation/data that was denied) and broadcast through a shared `EventEmitter` (`errorEmitter`) rather than only rejecting a promise, so a global listener component can surface permission failures anywhere in the tree.

Firestore security model (`firestore.rules`): a single hardcoded Super Admin email has full read/write; other authorized access is granted per-collection via a `users/{uid}.accessiblePortals` array checked through `hasPortalAccess(portal)`. Public collections (`news`, `services`, `team`, `testimonials`, `banners`) are world-readable, admin-writable. `projectInquiries`, `jobApplications`, `contactMessages` and `marketplaceOrders` allow anonymous `create` (public forms) but restrict read/write to the matching staff portal. `quotations`/`invoices`/`lpos` (client ledger) and `retainerRequests` (worker advances) also have explicit rules — every Firestore collection a page reads or writes needs one, or the call silently permission-denies in production even though it looks fine locally against relaxed/test rules.

### Admin SDK (`src/lib/firebase-admin.ts`)
Server-only Firebase Admin singleton, separate from the client SDK in `src/firebase`. Requires `FIREBASE_PROJECT_ID` (already set), plus `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from a Firebase service account key (Project Settings → Service Accounts → Generate new private key) — without these, `getFirebaseAdmin()` throws and `/api/admin/create-worker` returns a 500. Never import this file from a client component; it holds a service-account private key.

### AI flows (`src/ai`)
Built on Genkit (`genkit.ts` configures the `googleai/gemini-2.5-flash` model via `@genkit-ai/google-genai`, keyed by `GOOGLE_GENAI_API_KEY`/`GEMINI_API_KEY`). Flows are registered in `dev.ts` for the Genkit dev UI:
- `flows/intelligent-solution-consultant.ts` — takes free-text business requirements, returns a structured (Zod-schema) architecture/services/justification recommendation. This is the "Intelligent Solution Consultant" feature referenced in `docs/blueprint.md`.
- `flows/tts-flow.ts`, `flows/zainab.ts` — additional flows (TTS, a named assistant persona).

Each flow file is `'use server'` and exports a plain async function wrapping an `ai.defineFlow`/`ai.definePrompt` pair — follow this pattern (typed Zod input/output schema, prompt template, thin exported wrapper) when adding new AI flows.

### UI layer
ShadCN UI (`components.json`: New York-adjacent "default" style, `neutral` base color, `src/components/ui` for primitives) on top of Radix primitives and Tailwind CSS (`tailwind.config.ts`). Path alias `@/*` → `src/*` (see `tsconfig.json`). Fonts are Space Grotesk (headline) and Inter (body), loaded via `next/font/google` in `layout.tsx`. Framer Motion is used for scroll/hero animations; `docs/blueprint.md` documents the intended visual language (electric-cyan-on-charcoal, glassmorphism, dark mode by default — `<html class="dark ...">`).

### Marketplace (`src/app/marketplace`, `src/app/admin/marketplace`)
A storefront selling digital products, fixed-scope service packages, and tech gadgets, backed by `marketplaceProducts` and `marketplaceOrders` Firestore collections (rules in `firestore.rules`; write access to both is `isSuperAdmin()` or `hasPortalAccess('marketplace')`).
- Cart state lives in `src/hooks/use-cart.tsx` (`CartProvider`/`useCart`), persisted to `localStorage`, mounted once in `layout.tsx` alongside `CartDrawer` (`src/components/marketplace/CartDrawer.tsx`).
- `/marketplace` lists products by category (falls back to `DEFAULT_PRODUCTS` in `page.tsx` when the collection is empty, same pattern as `Services.tsx`); `/marketplace/[id]` is the product detail page; `/marketplace/checkout` collects buyer details and writes a `marketplaceOrders` doc.
- Checkout is **manual proof-of-payment**, not a payment gateway: the buyer pays via Mobile Money or bank transfer offline and submits a transaction reference; the order is created with `status: 'pending_verification'` and a notification is sent through the existing `/api/contact` mail bridge. Staff verify payment and advance status (`verified_paid` → `fulfilled`, or `rejected`) from `/admin/marketplace`.
- `/admin/marketplace` follows the `web-management`/`clients` admin page pattern (sidebar tabs, super-admin gate, dialog-based product CRUD) and is also gated by `hasAccess('marketplace')` in `src/app/admin/page.tsx`'s module list — new marketplace staff need `accessiblePortals` to include `'marketplace'`.

### Site-wide editable content (`src/hooks/use-site-config.tsx`)
`useSiteConfig()` reads a single `siteConfig/main` Firestore doc and is called from `Hero.tsx`, `Footer.tsx`, `Contact.tsx`, `FloatingWhatsApp.tsx`, and `about/page.tsx`. Every caller applies its own `config?.field || 'existing hardcoded default'` fallback, so the site always renders its original copy until an admin actually fills a field in via `admin/web-management`'s "Global Config" tab — never remove a fallback when touching these components, that's what keeps the doc optional. `next.config.ts` allows any HTTPS image host (`hostname: '**'`) because this config, marketplace products, and the CMS collections all accept arbitrary pasted image URLs, not a fixed list of providers.

### Communications (`src/app/admin/communications`)
Fully wired: Quote Requests (`projectInquiries`) and Contacts (`contactMessages`) are read-only views; Subscribers lists the `subscribers` collection fed by `SubscribePopup.tsx` (mounted globally in `layout.tsx`, shows once per visitor via a `localStorage` snooze, not a session flag); Messages composes and sends a real campaign — it loops recipient emails through `/api/contact` (`type: 'Newsletter Campaign'`, which the route renders with the given `subject`/`message` instead of its generic form-fields template) and logs one `campaigns` doc per send.

Files uses **Cloudinary**, not Firebase Storage (deliberately — Storage requires the paid Blaze plan; Cloudinary's free tier needs no billing). Upload is an unsigned client-side `fetch` straight to `https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload` using `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (both non-secret, safe client-side — the preset must be created in the Cloudinary dashboard with Signing Mode "Unsigned"). The resulting `secure_url`/`public_id` are saved to a `files` Firestore doc so the tab can list/delete via normal Firestore rules instead of Cloudinary's secret-key-gated Admin API. Deleting a file only removes the Firestore record — the asset stays on Cloudinary (acceptable at this scale; revisit if that ever matters, e.g. by adding a server route with `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` calling the Admin API's destroy endpoint).

### Design intent reference
`docs/blueprint.md` is the original product/design brief (core features, color palette, typography, layout principles). Consult it when a UI change's intent isn't obvious from the code.

## Deployment

Configured for both Firebase App Hosting (`apphosting.yaml`, `studio.json` — Firebase Studio project `studio-5459364483-a76ee`) and Vercel (see `README.md` for the Vercel env-var checklist: Firebase client keys, `GOOGLE_GENAI_API_KEY`, SMTP credentials).
