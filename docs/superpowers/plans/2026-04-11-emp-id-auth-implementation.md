# Employee ID Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate authentication from Name-based to Employee ID (empId) based system.

**Architecture:** 
- Backend: Use `user:${empId}` as Redis keys. Update token storage to map tokens to `empId`.
- Frontend: Update `RegisterModal` and `LoginModal` fields. Synchronize `api.js` with new backend signatures.

**Tech Stack:** Express.js, Redis, Next.js, lucide-react.

---

### Task 1: Update Backend to use Employee ID

**Files:**
- Modify: `apps/api/index.js`

- [ ] **Step 1: Update `onboard` API**
Modify to accept `empId`, use `user:${empId}` as key, and add `empId` to rankings. Store `userName` inside the hash.

- [ ] **Step 2: Update `login` API**
Change to accept `empId` and `password`. Map token to `empId` in Redis.

- [ ] **Step 3: Update `verifyToken` and Protected Routes**
Ensure `req.empId` is set instead of `userName`. Update routes like `/me`, `verify`, and `gift` to use `empId` for lookups and processing.

- [ ] **Step 4: Update Ranking Logic**
Modify `/api/rankings` to handle `empId` as members and fetch `userName` from individual hashes for display.

### Task 2: Update Frontend API Utility

**Files:**
- Modify: `apps/web/lib/api.js`

- [ ] **Step 1: Update all function signatures**
Change parameters from `userName` to `empId` where appropriate. Ensure `onboardUser` sends `userName`, `empId`, and `password`.

### Task 3: Update UI Modals

**Files:**
- Modify: `apps/web/components/Modals/RegisterModal.js`
- Modify: `apps/web/components/Modals/LoginModal.js`

- [ ] **Step 1: Update `RegisterModal.js`**
Add "사번 (Employee ID)" input field. Ensure state handles `empId`.

- [ ] **Step 2: Update `LoginModal.js`**
Change "사용자 이름" to "사번". Update state and placeholders.

### Task 4: Integration in Main Page

**Files:**
- Modify: `apps/web/app/page.js`

- [ ] **Step 1: Update state and handlers**
Update `user` state handling and `loadUserProfile` to use the identifier returned from login/auth. Ensure `localStorage` keys (if any used for caching name) are updated or cleared.
