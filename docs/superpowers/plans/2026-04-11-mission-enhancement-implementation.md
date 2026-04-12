# Mission Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand missions, implement frequency limits, integrate native camera, and optimize for mobile (iOS/Android).

**Architecture:** 
- Backend: Redis keys for tracking daily completion and permanent pledge status.
- Frontend: `MissionsTab` expansion, `PledgeModal` UI state transition, and `100dvh` CSS support.

**Tech Stack:** Next.js, Express.js, Redis, HTML5 Media Capture.

---

### Task 1: Backend Logic & Mission Expansion

**Files:**
- Modify: `apps/api/index.js`

- [ ] **Step 1: Update `todayMissions` array**
Add the 4 new missions (메일함 비우기, 에코 드라이빙, 실내 적정온도 유지, 개인컵/텀블러 사용).

- [ ] **Step 2: Implement frequency limits in `/verify` API**
  - **Pledge**: Check `user:empId` hash for `pledgeDone`. If true, return error.
  - **Daily Missions**: Check Redis key `mission:{empId}:{missionId}:{YYYY-MM-DD}`. If exists, return error.
  - **Exception**: Skip check for `m8`.
  - **Update**: Set completion keys/flags in Redis on success.

- [ ] **Step 3: Update `/users/me` profile**
Ensure `pledgeDone` status is returned so frontend can disable the pledge mission.

### Task 2: Frontend UI & Interaction

**Files:**
- Modify: `apps/web/components/Tabs/MissionsTab.js`
- Modify: `apps/web/components/Modals/PledgeModal.js`
- Modify: `apps/web/app/page.js`

- [ ] **Step 1: Update `PledgeModal` UI**
Handle a `isDone` state or prop to change button to "서약 완료 ✅" and disable it.

- [ ] **Step 2: Integrate `pledgeDone` state**
In `page.js`, use the profile data to identify if the pledge is already done and pass this down to `MissionsTab`.

### Task 3: Mobile & Camera Integration

**Files:**
- Modify: `apps/web/app/page.js`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Fix Camera Input**
Ensure the hidden `<input type="file" capture="environment" />` is correctly wired to the mission completion handler.

- [ ] **Step 2: Mobile CSS Optimization**
Ensure `.app-container` uses `100dvh` and add `touch-action: manipulation` to prevent double-tap zoom issues on iOS.

### Task 4: Testing

- [ ] **Step 1: Verify on Mobile**
Test camera trigger on both Android and iPhone if possible. Verify that daily missions cannot be repeated.
