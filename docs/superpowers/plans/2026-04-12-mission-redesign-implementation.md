# Mission Redesign & QR Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the mission list (7 items), implement fixed+random positioning, replace carbon metrics with guide descriptions, and automate QR verification via URL parameters.

**Architecture:** 
- Backend: Update static mission data with new descriptions.
- Frontend: `MissionsTab` logic for hybrid sorting (fixed top 2 + random others) and UI cleaning. `page.js` for URL-based auto-verification.

**Tech Stack:** Next.js, Express.js, Tailwind CSS.

---

### Task 1: Update Backend Mission Data

**Files:**
- Modify: `apps/api/index.js`

- [ ] **Step 1: Clean up `todayMissions`**
Remove deleted missions and update existing ones with the new `description` field and correct labels.

```javascript
const todayMissions = [
  { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0, type: 'pledge', description: '지구를 위한 소중한 약속에 동참해주세요.' },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1, type: 'qr', description: '장비실에 부착된 QR코드를 찍어주세요.' },
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032, type: 'photo', description: '계단에 보이는 층을 찍어주세요.' },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05, type: 'photo', description: '사용중인 다회용컵을 찍어주세요.' },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1, type: 'photo', description: '끄지 않은 콘센트를 찍어주세요.' },
  { id: 'm10', title: '메일함 비우기', points: 15, carbon: 0.001, type: 'photo', description: '삭제한 메일함을 찍어주세요.' },
  { id: 'm12', title: '실내 적정온도 유지', points: 20, carbon: 0.05, type: 'photo', description: '에어컨의 적정온도를 찍어주세요.' }
];
```

### Task 2: Implement Hybrid Sorting & UI Redesign

**Files:**
- Modify: `apps/web/components/Tabs/MissionsTab.js`

- [ ] **Step 1: Update Shuffle Logic**
Modify `useEffect` to keep `pledge` and `m8` at index 0 and 1, and shuffle the rest.

- [ ] **Step 2: Redesign Mission Card**
Remove the carbon savings text and display the `description` instead. Ensure the styling is clean and fits the mobile aesthetic.

### Task 3: URL-based QR Automation

**Files:**
- Modify: `apps/web/app/page.js`

- [ ] **Step 1: Enhance URL param check**
Refine the `useEffect` that checks for `mission=m8` to ensure it only triggers when the user is fully logged in and profile is loaded. Ensure it clears the URL immediately to prevent double-triggering on refresh.

### Task 4: Final Verification

- [ ] **Step 1: Test the flow**
1. Check if '서약' and '폐배터리' are always at the top.
2. Check if other 5 missions change order on every tab visit.
3. Access `/?mission=m8` and verify auto-completion.
4. Verify that carbon numbers are gone and descriptions are visible.
