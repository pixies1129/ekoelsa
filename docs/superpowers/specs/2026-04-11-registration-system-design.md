# User Registration System Design Spec

**Status:** Approved
**Date:** 2026-04-11
**Topic:** Implementation of a dedicated registration modal and integration with login flow.

## 1. Overview
Enhance the onboarding process by converting the simple name-based onboarding into a formal registration process with password security.

## 2. Components

### 2.1 `RegisterModal.js`
- **Fields:**
  - Name (userName)
  - Password
  - Confirm Password
- **Validation:**
  - Check if all fields are filled.
  - Check if Password and Confirm Password match.
- **Action:** Calls `api.onboardUser(userName, charType, password)`.

### 2.2 `LoginModal.js` (Update)
- Add a "Switch to Register" button/link at the bottom.

## 3. Flow
1. User opens the app.
2. If not logged in, `LoginModal` is shown.
3. User can toggle between `LoginModal` and `RegisterModal`.
4. After successful registration, automatically log in or redirect back to `LoginModal`.

## 4. Technical Integration
- Reuse existing `api.onboardUser` and `api.login` functions.
- Update `apps/web/app/page.js` to manage the visibility of both modals.
