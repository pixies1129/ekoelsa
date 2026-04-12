# Mission Randomization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Randomize the order of all missions in the `MissionsTab` every time it is displayed.

**Architecture:** 
- Logic: Implement a shuffle helper function inside `MissionsTab.js`.
- State: Manage `shuffledMissions` in the component state.
- Lifecycle: Trigger shuffling on component mount via `useEffect`.

**Tech Stack:** React (Next.js).

---

### Task 1: Implement Shuffle Logic in MissionsTab

**Files:**
- Modify: `apps/web/components/Tabs/MissionsTab.js`

- [ ] **Step 1: Add shuffle state and helper**
```javascript
const [shuffledMissions, setShuffledMissions] = useState([]);

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
```

- [ ] **Step 2: Trigger shuffle on mount**
```javascript
useEffect(() => {
  if (missions && missions.length > 0) {
    setShuffledMissions(shuffleArray(missions));
  }
}, [missions]);
```

- [ ] **Step 3: Update rendering loop**
Change the `.map()` function to iterate over `shuffledMissions` instead of `missions`.

### Task 2: Testing

- [ ] **Step 1: Verify Randomization**
Switch between "Home" and "Missions" tabs several times and verify that the mission order changes each time.
