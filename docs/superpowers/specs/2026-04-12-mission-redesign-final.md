# Mission Redesign & QR URL Integration Spec

**Status:** Approved
**Date:** 2026-04-12
**Topic:** Finalizing the mission list, positioning, UI descriptions, and URL-based QR automation.

## 1. Mission List & Content
The list is trimmed to 7 essential missions. Carbon savings values are removed from the UI.

| ID | Title | Description (New) | Type | Position |
| :--- | :--- | :--- | :--- | :--- |
| pledge | 에너지지킴이 서약 | 지구를 위한 소중한 약속에 동참해주세요. | pledge | Fixed 1st |
| m8 | 폐배터리 수거 | 장비실에 부착된 QR코드를 찍어주세요. | qr | Fixed 2nd |
| m1 | 계단 이용 | 계단에 보이는 층을 찍어주세요. | photo | Random |
| m3 | 다회용컵 이용 | 사용중인 다회용컵을 찍어주세요. | photo | Random |
| m7 | 콘센트 미차단 신고 | 끄지 않은 콘센트를 찍어주세요. | photo | Random |
| m10 | 메일함 비우기 | 삭제한 메일함을 찍어주세요. | photo | Random |
| m12 | 실내 적정온도 유지 | 에어컨의 적정온도를 찍어주세요. | photo | Random |

## 2. Positioning Logic
- The `MissionsTab` will receive the full list.
- It will explicitly pull `pledge` and `m8` to the top.
- The remaining 5 items will be shuffled using the Fisher-Yates algorithm.

## 3. UI Changes
- Remove `carbonSaved` display in mission cards.
- Display the `description` field prominently in the space where carbon metrics used to be.

## 4. URL-based QR Automation
- **URL**: `https://ekoelsa.vercel.app/?mission=m8`
- **Logic**: 
  - On mount, `page.js` checks `window.location.search`.
  - If `mission=m8` exists and user is logged in, trigger `handleMissionComplete(m8)`.
  - Use `window.history.replaceState` to clear the URL parameter after triggering.

## 5. Backend Updates
- Update `todayMissions` array in `apps/api/index.js` to match the new list and descriptions.
