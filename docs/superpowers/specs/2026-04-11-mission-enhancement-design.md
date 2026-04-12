# Mission Enhancement & Mobile Optimization Design Spec

**Status:** Approved
**Date:** 2026-04-11
**Topic:** Adding missions, implementing camera integration, and enforcing mission frequency limits.

## 1. Mission Expansion
New missions to be added to the registry:
- **메일함 비우기**: (15P, 0.001kg) 디지털 탄소 발자국 줄이기.
- **에코 드라이빙**: (15P, 0.1kg) 급가속/급감속 자제.
- **실내 적정온도 유지**: (20P, 0.05kg) 여름 26도, 겨울 20도.
- **개인컵/텀블러 사용**: (15P, 0.01kg) 일회용품 줄이기.

## 2. Interaction Enhancements
- **Pledge Modal**: The "Complete Pledge" button will transition to a disabled "Pledge Completed ✅" state upon success.

## 3. Native Camera Integration
- **Implementation**: Use `<input type="file" accept="image/*" capture="environment" />`.
- **Flow**: Clicking a "Photo Verification" mission triggers the hidden input, and the `onchange` event triggers the backend verification.

## 4. Business Logic (Frequency Limits)
- **Pledge**: Store `pledgeDone: true` in user hash. Check before awarding points.
- **Daily Missions**: Use Redis key `mission:{empId}:{missionId}:{YYYY-MM-DD}` to track daily completion.
- **Exception**: `m8` (Battery collection) has no limit.

## 5. Mobile Optimization
- Ensure `100dvh` is used for the app container to handle mobile browser address bars.
- iOS specific: Ensure `user-scalable=no` and touch-action improvements are applied in `layout.js` or CSS.
