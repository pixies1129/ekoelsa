# Cleanup and Vercel Configuration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the old monolithic structure and configure Vercel for the monorepo.

**Architecture:** Monorepo root cleanup and centralized `vercel.json` for routing.

**Tech Stack:** Bash, Vercel (rewrites)

---

### Task 1: Cleanup Root

**Files:**
- Delete: `index.html`, `sw.js`, `api/`, `manifest.txt`, `icons/`, `package.json`, `package-lock.json` in the root of the worktree.

- [ ] **Step 1: Delete monolithic files and directories**

Run: `rm -rf /Users/junoh/ekoelsa/.worktrees/monorepo-migration/index.html /Users/junoh/ekoelsa/.worktrees/monorepo-migration/sw.js /Users/junoh/ekoelsa/.worktrees/monorepo-migration/api /Users/junoh/ekoelsa/.worktrees/monorepo-migration/manifest.txt /Users/junoh/ekoelsa/.worktrees/monorepo-migration/icons /Users/junoh/ekoelsa/.worktrees/monorepo-migration/package.json /Users/junoh/ekoelsa/.worktrees/monorepo-migration/package-lock.json`

- [ ] **Step 2: Verify deletion**

Run: `ls -la /Users/junoh/ekoelsa/.worktrees/monorepo-migration`
Expected: `index.html`, `sw.js`, `api/`, etc. are GONE.

### Task 2: Configure `vercel.json`

**Files:**
- Modify: `vercel.json` in the root.

- [ ] **Step 1: Update `vercel.json` with rewrites**

In `/Users/junoh/ekoelsa/.worktrees/monorepo-migration/vercel.json`, replace content with:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/apps/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/apps/web/$1"
    }
  ]
}
```

- [ ] **Step 2: Verify `vercel.json` content**

Run: `cat /Users/junoh/ekoelsa/.worktrees/monorepo-migration/vercel.json`
Expected: Content matches the above.

### Task 3: Commit Changes

- [ ] **Step 1: Commit cleanup and configuration**

Run: `git add vercel.json && git add -u && git commit -m "chore: cleanup old monolithic files and configure vercel.json"`
