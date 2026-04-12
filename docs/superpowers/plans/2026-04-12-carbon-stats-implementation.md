# Real-time Carbon Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize personal and branch-wide carbon savings stats in real-time using Redis.

**Architecture:** 
- Backend: Update `stats:totalCarbon` in Redis on every mission verification. Return this total in the user profile API.
- Frontend: Display the branch-wide total in the `HomeTab`.

**Tech Stack:** Next.js, Express.js, Redis.

---

### Task 1: Update Backend Aggregation Logic

**Files:**
- Modify: `apps/api/index.js`

- [ ] **Step 1: Update `/verify` API**
Add logic to increment `stats:totalCarbon` whenever a mission is verified.
```javascript
// Inside /api/missions/:id/verify
await redis.incrbyfloat('stats:totalCarbon', mission.carbon);
```

- [ ] **Step 2: Update `/api/users/me` API**
Fetch the global total and include it in the response.
```javascript
const totalCarbon = await redis.get('stats:totalCarbon') || 0;
res.json({ ...user, totalCarbon: parseFloat(totalCarbon) });
```

### Task 2: Frontend Integration in HomeTab

**Files:**
- Modify: `apps/web/app/page.js`
- Modify: `apps/web/components/Tabs/HomeTab.js`

- [ ] **Step 1: Update Page State**
Ensure the `user` state update in `handleMissionComplete` also refreshes the total carbon data if returned by the API.

- [ ] **Step 2: Update HomeTab UI**
Modify the "지사 총 탄소저감" card to display `profile.totalCarbon` instead of a static value. Use `.toFixed(2)` or similar for formatting.

### Task 3: Verification

- [ ] **Step 1: Test Integration**
1. Log in with a user.
2. Complete a mission.
3. Check if both "나의 누적 탄소저감" and "지사 총 탄소저감" increase.
4. Log in with a DIFFERENT user and complete a mission.
5. Verify that the "지사 총 탄소저감" reflects the sum of both users.
