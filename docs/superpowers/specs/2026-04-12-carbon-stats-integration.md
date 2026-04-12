# Real-time Carbon Stats Integration Design Spec

**Status:** Approved
**Date:** 2026-04-12
**Topic:** Aggregating total carbon savings from all users and displaying it in real-time.

## 1. Goal
Replace static or individual-only carbon metrics with a real-time, branch-wide aggregate to boost group motivation.

## 2. Backend Logic (Redis)
- **Global Key**: `stats:totalCarbon` (Float)
- **Trigger**: Every time `/api/missions/:id/verify` is successfully called.
- **Operation**: Use `INCRBYFLOAT` to add the mission's `carbon` value to the global key.
- **Data Fetching**: Include the global total in the response of `/api/users/me` or a dedicated `/api/stats` endpoint.

## 3. Frontend Integration
- **`apps/web/lib/api.js`**: Ensure the profile fetcher can handle the expanded response object.
- **`apps/web/app/page.js`**: Manage a new `totalCarbon` state.
- **`apps/web/components/Tabs/HomeTab.js`**: Update UI to display the fetched global total alongside the user's personal total.

## 4. UI Adjustments
- "지사 총 탄소저감" card in the Home tab will now show the dynamic value from Redis.
- Use `toFixed(3)` for consistent decimal display.
