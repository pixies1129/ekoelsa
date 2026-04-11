# User Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy `OnboardingModal` with a dedicated `RegisterModal` and link it with the `LoginModal` for a complete authentication flow.

**Architecture:** 
- `RegisterModal`: Collects Name and Password, calls `onboardUser`.
- `LoginModal`: Updated to include a link to the registration modal.
- `page.js`: Manages the visibility toggle between Login and Register.

**Tech Stack:** Next.js, Tailwind CSS, native Fetch API.

---

### Task 1: Create RegisterModal Component

**Files:**
- Create: `apps/web/components/Modals/RegisterModal.js`

- [ ] **Step 1: Implement `RegisterModal.js`**
Build a UI similar to `LoginModal` but with a password confirmation field. It should call `api.onboardUser` on success.

### Task 2: Update LoginModal Component

**Files:**
- Modify: `apps/web/components/Modals/LoginModal.js`

- [ ] **Step 1: Add "Register" link to `LoginModal.js`**
Add a button or link at the bottom of the form to trigger the switch to the registration modal.

### Task 3: Wire Modals in Page logic

**Files:**
- Modify: `apps/web/app/page.js`

- [ ] **Step 1: Update state management in `page.js`**
Replace `modals.onboarding` logic with a state that can toggle between `LoginModal` and `RegisterModal`. Ensure `LoginModal` is shown by default if not authenticated.

### Task 4: Cleanup

**Files:**
- Delete: `apps/web/components/Modals/OnboardingModal.js`

- [ ] **Step 1: Remove legacy onboarding component**
Delete the old `OnboardingModal.js` as it is no longer used.
