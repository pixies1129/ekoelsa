# EKO-ELSA Monorepo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing single-file EKO-ELSA application into a modern pnpm monorepo architecture with a Next.js (App Router) frontend and an Express.js backend, integrating the frontend with the backend via native Fetch API.

**Architecture:** A pnpm workspace containing two main applications: `apps/web` (Next.js frontend) and `apps/api` (Express backend). The frontend will be componentized from the existing `index.html` and will communicate with the backend using the native Fetch API. Data from the existing `localStorage` will be ignored (reset). Styling will remain with Tailwind CSS. Both will be deployed together on Vercel.

**Tech Stack:** pnpm, Next.js (App Router), React, Tailwind CSS, Express.js, ioredis, Vercel

---

### Task 1: Initialize pnpm Monorepo Structure

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (Root)
- Create: `.npmrc`

- [ ] **Step 1: Create `pnpm-workspace.yaml`**
```yaml
packages:
  - 'apps/*'
```

- [ ] **Step 2: Create root `package.json`**
```json
{
  "name": "eko-elsa-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter \"./apps/**\" dev",
    "build": "pnpm --filter \"./apps/**\" build",
    "start": "pnpm --filter \"./apps/**\" start"
  }
}
```

- [ ] **Step 3: Create `.npmrc`**
```text
auto-install-peers=true
```

### Task 2: Migrate Backend to `apps/api`

**Files:**
- Move: `api/index.js` -> `apps/api/index.js`
- Move: `package.json` -> `apps/api/package.json`
- Modify: `apps/api/package.json`
- Modify: `apps/api/index.js`

- [ ] **Step 1: Create `apps/api` directory and move files**
Move the existing `api/index.js` and root `package.json` (the one currently holding express dependencies) to `apps/api/`. 

- [ ] **Step 2: Update `apps/api/package.json`**
Update the name and add a dev script.
```json
{
  "name": "api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "node index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "ioredis": "^5.3.2"
  }
}
```

- [ ] **Step 3: Update `apps/api/index.js` CORS settings**
Modify `apps/api/index.js` to allow CORS from the upcoming Next.js frontend (e.g., localhost:3000). Ensure the port is set to something other than 3000 if Next.js uses 3000, e.g., 3001.
```javascript
// Add inside apps/api/index.js, replace existing cors setup
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL], // Adjust FRONTEND_URL for production
  credentials: true
}));

// Update PORT logic at the bottom
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001; // Use 3001 for API to avoid conflict with Next.js
  app.listen(PORT, () => {
    console.log(`Redis Connected (URL: ${process.env.REDIS_URL ? 'External' : 'Local'})`);
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
```

### Task 3: Initialize Next.js Frontend in `apps/web`

**Files:**
- Create: `apps/web/` via `create-next-app`

- [ ] **Step 1: Bootstrap Next.js App**
Run `pnpm create next-app apps/web --typescript=false --tailwind --eslint=false --app --src-dir=false --import-alias="@/*"` (Adjust flags as needed to match pure JS + Tailwind preference).

- [ ] **Step 2: Clean up default Next.js files**
Remove the boilerplate content from `apps/web/app/page.js` and `apps/web/app/globals.css` to prepare for the EKO-ELSA specific styling and components.

- [ ] **Step 3: Update `apps/web/package.json`**
Ensure the name is set to `web` to match standard monorepo naming.
```json
{
  "name": "web",
  // ... rest of next package.json
}
```

### Task 4: Migrate Static Assets and Global Styles

**Files:**
- Move: `icons/*` -> `apps/web/public/icons/`
- Move: `manifest.txt` -> `apps/web/public/manifest.json` (Rename if necessary for standard Next.js PWA setup later)
- Modify: `apps/web/app/layout.js`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Move public assets**
Move all contents of the root `icons/` folder to `apps/web/public/icons/`. Move `manifest.txt` to `apps/web/public/`.

- [ ] **Step 2: Migrate Global Styles**
Copy the custom CSS animations and container styles from the `<style>` block in the original `index.html` into `apps/web/app/globals.css`.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { -webkit-tap-highlight-color: transparent; }

/* PC/모바일 반응형 완벽 대응을 위한 컨테이너 높이 설정 */
.app-container {
  height: 100vh; /* 구형 브라우저 대비용 */
  height: 100dvh; /* 최신 모바일 브라우저 주소창 대응 */
}
@media (min-width: 640px) {
  .app-container {
    height: 850px;
    max-height: 90vh;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes bounce-slow {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(0); }
}
.animate-bounce-slow { animation: bounce-slow 2s infinite; }

@keyframes breath { 
  0%, 100% { transform: scale(1); } 
  50% { transform: scale(1.1); } 
}
.animate-breath { animation: breath 2.5s ease-in-out infinite; }

@keyframes sway { 
  0%, 100% { transform: rotate(-8deg); } 
  50% { transform: rotate(8deg); } 
}
.animate-sway { animation: sway 3s ease-in-out infinite; transform-origin: bottom center; }

@keyframes float { 
  0%, 100% { transform: translateY(0px); } 
  50% { transform: translateY(-12px); } 
}
.animate-float { animation: float 3s ease-in-out infinite; }

@keyframes pulse-ring { 
  0% { transform: scale(0.7); opacity: 0.5; } 
  100% { transform: scale(1.4); opacity: 0; } 
}
.animate-pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }

@keyframes spin-slow { 
  100% { transform: rotate(360deg); } 
}
.animate-spin-slow { animation: spin-slow 10s linear infinite; }
```

- [ ] **Step 3: Setup Root Layout**
Update `apps/web/app/layout.js` to include the Lucide icon CDN (or better, install `lucide-react` in the next task) and set up the main HTML structure matching the original `index.html` body wrapping.

### Task 5: Componentize UI and Implement Fetch Logic

**Files:**
- Create: `apps/web/components/Header.js`
- Create: `apps/web/components/BottomNav.js`
- Create: `apps/web/app/page.js` (Main Container)
- Create: `apps/web/lib/api.js` (Fetch utilities)

- [ ] **Step 1: Install `lucide-react`**
Run `pnpm --filter web add lucide-react` to replace the CDN script with React components.

- [ ] **Step 2: Create API utility (`apps/web/lib/api.js`)**
Create helper functions using native `fetch` to interact with the backend API (e.g., `http://localhost:3001/api/...`).

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchMissions() {
  const res = await fetch(`${API_BASE_URL}/missions`);
  if (!res.ok) throw new Error('Failed to fetch missions');
  return res.json();
}

export async function onboardUser(userName, charType) {
    const res = await fetch(`${API_BASE_URL}/users/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, charType })
    });
    if (!res.ok) throw new Error('Failed to onboard user');
    return res;
}

// Add other necessary fetch calls (verify mission, get profile, get rankings, etc.) based on API_SPEC.md
```

- [ ] **Step 3: Build Base Layout Components**
Create `Header` and `BottomNav` React components based on the HTML in the original `index.html`.

- [ ] **Step 4: Implement Page Logic (`apps/web/app/page.js`)**
Create the main stateful component that manages the active tab (home, missions, forest) and renders the corresponding sub-components (which will need to be further broken down from the monolithic `index.html`).

### Task 6: Cleanup and Vercel Configuration

**Files:**
- Delete: Original `index.html`, `sw.js`, `api/index.js`, root `package.json` (old), etc.
- Modify: `vercel.json`

- [ ] **Step 1: Delete old monolithic files**
Remove the original files from the root directory that have now been migrated to `apps/web` or `apps/api`.

- [ ] **Step 2: Update Vercel Configuration**
Update `vercel.json` to properly deploy a monorepo, routing API requests to the Express backend and everything else to Next.js. Or configure Vercel project settings via the dashboard to point to the `apps/web` root for the frontend and deploy the `apps/api` separately or as serverless functions. *Note: Deploying Express alongside Next.js on Vercel usually requires wrapping the Express app in a serverless function handler within the `api` directory of the Next.js app, or deploying them as separate Vercel projects.*

**Deployment Strategy Note for Vercel Monorepo:**
To deploy both on Vercel under one project, you might need to structure the `apps/api` to be exportable as serverless functions that Vercel recognizes, or integrate the Express routes into Next.js API routes (`apps/web/app/api/...`). Given the requirement "Vercel 하나로 통합 배포", we should ensure the `vercel.json` is configured to route `/api` to the backend workspace, OR migrate the Express backend logic directly into Next.js Route Handlers.

*Correction for Task 6:* Since the user wants "Vercel 하나로 통합 배포" and is using Next.js App Router, the most Vercel-native way is to move the Express logic into **Next.js Route Handlers** (`apps/web/app/api/...`). If we keep a separate Express app in `apps/api`, Vercel requires specific `vercel.json` rewrites and a specific entrypoint for serverless functions, which can be complex.

Let's refine the backend approach for Vercel integration in the final review if needed, but for now, the plan sets up the monorepo structure.