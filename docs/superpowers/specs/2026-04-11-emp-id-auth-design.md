# Employee ID Based Auth System Design Spec

**Status:** Approved
**Date:** 2026-04-11
**Topic:** Switching from Name-based to Employee ID (empId) based authentication.

## 1. Overview
Use Employee ID (empId) as the primary unique identifier for users to prevent name duplication issues and align with corporate standards.

## 2. API Changes

### 2.1 `POST /api/users/onboard`
- **Request:** `{ "userName": "...", "empId": "...", "password": "...", "charType": "..." }`
- **Logic:** Store in Redis key `user:${empId}`. Add `empId` to the `rankings` set instead of `userName` (or keep a mapping).

### 2.2 `POST /api/auth/login`
- **Request:** `{ "empId": "...", "password": "..." }`
- **Logic:** Fetch user by `user:${empId}` and verify password.

### 2.3 `verifyToken` Middleware
- **Logic:** `redis.get(\`token:${token}\`)` will now return `empId`.

## 3. Frontend Changes

### 3.1 `RegisterModal.js`
- Add "Employee ID (사번)" input field.
- Ensure all fields (Name, ID, Password) are sent to backend.

### 3.2 `LoginModal.js`
- Change "User Name" field to "Employee ID (사번)".

### 3.3 `api.js` Utility
- Update function signatures to prioritize `empId`.
- Example: `getUserProfile(empId)`, `verifyMission(missionId, empId, content)`.

## 4. Migration Note
Existing users indexed by `userName` in Redis will need to re-register under the new `empId` system. Existing data in `rankings` using `userName` should be cleared for consistency.
