# CHUKKU × HYPHAE

> “I made a little world for you.”

A production-quality MERN full-stack romantic website created by **Hyphae** for **Chukku**. Designed with emotional depth, cinematic typography, handcrafted polaroid scrapbook elements, and strict cryptographic privacy separation between the public storytelling experience and the dark, secretive **Private Vault**.

---

## 🌟 Highlights & Features

### 1. Two Completely Distinct Spaces
- **Public Website** (`/`, `/chukku`, `/hyphae`, `/gallery`, `/timeline`, `/love-letter`, `/future`):
  - Soft, warm, dreamy, and nostalgic ivory & dusty rose aesthetic.
  - Zero admin links or vault routes visible in the public navbar.
  - Strict backend filtering: unauthenticated requests never receive private or draft content.
  - Interactive polaroids with subtle tilt, lightbox modal with arrow/swipe navigation, milestone story timeline, dual perspective cards, and public love letter with wax seal aesthetics.
  - "One Last Thing…" final reveal with gentle confetti.
  - Floating romantic music player with volume control (never autoplays).

- **Private Admin Vault** (`/admin/login`, `/admin`, `/admin/private`):
  - Dark wine and black aesthetic with subtle ruby glow and lock motifs.
  - Protected by JWT authentication and Bcrypt password hashing.
  - **Private Memories**: Photos that never appear on the public website with secret notes.
  - **Private Letters**: Unfiltered letters meant only for Hyphae.
  - **Private Notes**: Categorized reminders, gift ideas, and memories.
  - **Surprise Ideas**: Complete planning tool with action checklists, status tracking, locations, and budgets.
  - **Personal Journal**: Digital diary with mood tracking and timestamps.
  - **Content Visibility Workflow**: Easily change any memory between `PUBLIC`, `PRIVATE`, and `DRAFT`. Moving a photo to `PRIVATE` immediately removes it from public APIs.

---

## 🚀 Setup & Installation Guide

### 1. Clone Project
```bash
git clone <repository-url>
cd chukku-hyphae
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment settings in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/chukku_hyphae?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_romantic_jwt_key
ADMIN_EMAIL=hyphae@chukku.world
ADMIN_PASSWORD=forever_and_always
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
*Note: If `MONGODB_URI` is omitted or in offline sandbox mode, the backend automatically uses an embedded, file-persisted JSON document store in `data/db.json` with identical schema and query semantics.*

### 4. Seeded Admin Credentials
- **Email:** `hyphae@chukku.world`
- **Password:** `forever_and_always`
*(You can change the passphrase at any time from the admin dashboard or via `/api/auth/change-password`)*

### 5. Start Development Server
```bash
npm run dev
```
The server starts Express on port 3000 with Vite middleware handling client routes and hot reloading.

### 6. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Architecture

1. **Backend Database-Level Filtering:**
   Public APIs (`/api/gallery`, `/api/timeline`, `/api/cards/*`, `/api/love-letter`, `/api/future`) execute explicit queries:
   ```ts
   isPrivate !== true && isPublished === true
   ```
   No private data is ever leaked or sent to the browser.
2. **Private Route Guarding:**
   Every `/api/admin/private/*` route requires a valid JWT Bearer token or httpOnly cookie. Unauthenticated requests receive `401 Unauthorized`.
3. **Password Security:**
   Passphrases are salted and hashed using `bcryptjs`. Plaintext passwords are never stored.

---

## 📸 Photo Assets & Cloudinary
- High-fidelity photograph references and metadata pre-seeded for Chukku & Hyphae's real moments (Lake Pichola boat ride, cafe dates, late night video calls, birthday surprises).
- Direct file uploads are handled via `multer` into `/uploads` with Cloudinary support for production CDN hosting.

---

## 💌 Handcrafted with Love
Created by Hyphae for Chukku.
