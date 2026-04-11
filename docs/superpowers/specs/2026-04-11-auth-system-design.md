# Auth System (Login/Logout) Design Spec

**Status:** Approved
**Date:** 2026-04-11
**Topic:** Implementation of simple token-based authentication for EKO-ELSA

## 1. Overview
Introduce a password-based login system to enhance security and user management. Use a simple token stored in `sessionStorage` for session-only persistence.

## 2. Architecture
- **Type:** Simple Token-based (Extensible to JWT)
- **Persistence:** `sessionStorage` (Wiped on tab close)
- **Security:** Backend middleware to verify tokens on protected routes.

## 3. API Specification

### 3.1 `POST /api/auth/login`
- **Request:** `{ "userName": "...", "password": "..." }`
- **Logic:**
    1. Verify credentials against Redis.
    2. Generate a unique `accessToken` (e.g., UUID).
    3. Store token in Redis with user mapping (Key: `token:<token>`, Value: `userName`).
    4. // TODO: Switch to `jsonwebtoken.sign()` for Way C.
- **Response:** `{ "accessToken": "..." }`

### 3.2 `POST /api/auth/logout`
- **Request:** `Authorization: Bearer <token>`
- **Logic:** Remove token from Redis.
- **Response:** `200 OK`

### 3.3 Modified `POST /api/users/onboard`
- **Request:** `{ "userName": "...", "password": "...", "charType": "..." }`
- **Logic:** Store `password` in the user's Redis hash.

## 4. Frontend Changes

### 4.1 Login Component
- Create `apps/web/components/Modals/LoginModal.js` or a full-page overlay.
- Form fields: Name, Password.
- Handle state: Save token to `sessionStorage`.

### 4.2 Header Integration
- Add `LogOut` icon (Lucide) to the top right of `Header.js`.
- Trigger API call and clear `sessionStorage` on click.

### 4.3 Protected Routes / Content
- Modify `apps/web/app/page.js`:
    - Check for token in `sessionStorage`.
    - If missing, render `LoginModal` exclusively.

## 5. Security Middleware (Backend)
- Implement `verifyToken` middleware in `apps/api/index.js`.
- Protect: `/api/missions/:id/verify`, `/api/points/gift`, `/api/users/me`.
- // TODO: Switch to `jsonwebtoken.verify()` for Way C.

## 6. Self-Review
- [x] Includes password requirement.
- [x] Includes session-only requirement.
- [x] Includes JWT extensibility guide.
- [x] Defines UI placement for logout.
