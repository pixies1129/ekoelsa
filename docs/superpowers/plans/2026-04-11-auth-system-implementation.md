# Auth System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a password-based login/logout system with simple token authentication using `sessionStorage` and Redis.

**Architecture:** 
- Backend: Express middleware for token verification, Redis for token storage.
- Frontend: `LoginModal` for authentication, `sessionStorage` for token persistence, and `Header` integration for logout.

**Tech Stack:** Express.js, Redis, Next.js, lucide-react, native Fetch API.

---

### Task 1: Update Backend User & Auth APIs

**Files:**
- Modify: `apps/api/index.js`

- [ ] **Step 1: Update `/api/users/onboard` to save password**
```javascript
// Modify onboard route
app.post('/api/users/onboard', async (req, res) => {
  const { userName, charType, password } = req.body; // Added password
  const userKey = `user:${userName}`;
  // ... check exists
  await redis.hset(userKey, {
    userName,
    charType,
    password, // Store password (plain text for now as per simple Approach A)
    points: 0,
    carbonSaved: 0
  });
  // ...
});
```

- [ ] **Step 2: Implement `/api/auth/login` route**
```javascript
const { v4: uuidv4 } = require('uuid'); // Add uuid to apps/api dependencies first

app.post('/api/auth/login', async (req, res) => {
  const { userName, password } = req.body;
  const userKey = `user:${userName}`;
  const user = await redis.hgetall(userKey);

  if (Object.keys(user).length > 0 && user.password === password) {
    const token = uuidv4();
    // Store token in Redis for 24 hours (or as needed)
    await redis.set(`token:${token}`, userName, 'EX', 86400); 
    
    // TODO: Switch to jsonwebtoken.sign({ userName }, SECRET) for Approach C
    res.json({ accessToken: token, userName: user.userName });
  } else {
    res.status(401).json({ error: 'Invalid name or password' });
  }
});
```

- [ ] **Step 3: Implement Auth Middleware and `/api/auth/logout`**
```javascript
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  const userName = await redis.get(`token:${token}`);
  
  if (!userName) return res.status(401).json({ error: 'Invalid token' });
  
  // TODO: Switch to jsonwebtoken.verify(token, SECRET) for Approach C
  req.userName = userName;
  next();
};

app.post('/api/auth/logout', verifyToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  await redis.del(`token:${token}`);
  res.json({ message: 'Logged out' });
});
```

- [ ] **Step 4: Protect existing routes**
Apply `verifyToken` to `/api/users/me`, `/api/missions/:id/verify`, and `/api/points/gift`.

### Task 2: Update Frontend API Utility

**Files:**
- Modify: `apps/web/lib/api.js`

- [ ] **Step 1: Add auth functions and token header support**
```javascript
// Add login/logout functions
export const login = (userName, password) => 
  fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
  });

export const logout = (token) => 
  fetcher('/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });

// Update fetcher to include token if available in sessionStorage
async function fetcher(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('eko_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  // ... rest of fetcher logic
}
```

### Task 3: Implement Login UI and State Wiring

**Files:**
- Create: `apps/web/components/Modals/LoginModal.js`
- Modify: `apps/web/app/page.js`
- Modify: `apps/web/components/Header.js`

- [ ] **Step 1: Create `LoginModal.js`**
UI with Name and Password inputs, handling the login API call.

- [ ] **Step 2: Integrate authentication into `page.js`**
- Check for `eko_token` in `sessionStorage` on mount.
- If missing, force show `LoginModal`.
- On successful login, save token and fetch user profile.

- [ ] **Step 3: Add Logout to `Header.js`**
Add `LogOut` icon (lucide-react) and wire it to the logout handler passed from `page.js`.

### Task 4: Final Polish and Cleanup

**Files:**
- Modify: `apps/api/package.json`

- [ ] **Step 1: Install `uuid` in backend**
`pnpm --filter api add uuid`

- [ ] **Step 2: Test the flow**
Run `pnpm dev`, try onboarding a new user with password, then logging out and logging back in.
