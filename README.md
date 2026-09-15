# GymForge — Smart Gym Workout Planner & PWA Tracker

GymForge is a mobile-first, production-quality progressive web application (PWA) designed for personalized workout planning, active gym tracking, double-progression recommendations, and dynamic anatomical muscle visualization.

---

## Key Features

1. **Automatic Routine Generation**:
   - Deterministic, exercise-science-grounded routine generator.
   - Tailors splits (1-7 days/week: Full Body, Upper/Lower, PPL, or UL-PPL) to your goal, experience level, workout duration, and available equipment (commercial gym, dumbbells only, home gym, bodyweight).
   - Intelligent cardio placement (dedicated cardio days or post-workout conditioning).

2. **Zero-Data-Loss Active Workout Mode**:
   - Engineered for gym use with large touch targets.
   - Synchronous in-memory updates + debounced local IndexedDB (Dexie.js) persistence on every rep/set change.
   - Interrupted workout protection: close or refresh your browser mid-workout and instantly resume where you left off.

3. **Dynamic Vector Anatomical Muscle Highlighting**:
   - Single scalable vector SVG with individually addressable muscle groups for anterior (front) and posterior (back) views.
   - Highlights primary muscles in vibrant cyan and secondary muscles in warm amber.
   - Zero external raster images or heavy canvas dependencies.

4. **Double Progression Recommendation Engine**:
   - Evaluates previous performance sets, target rep ranges, and Reps In Reserve (RIR).
   - Generates plain-English progression cues: recommends when to increase weight (+1.25kg to +2.5kg upper, +2.5kg to +5kg lower), when to maintain, and when to deload.

5. **Intelligent Exercise Substitution**:
   - Multi-factor ranking scoring candidates based on movement pattern, primary/secondary muscle overlap, equipment availability, and workout redundancy.
   - Suggests top 2–3 suitable alternatives whenever you tap "Change Exercise".

6. **Progressive Web App (PWA) & Offline Capability**:
   - Web App Manifest (`manifest.json`) and Service Worker (`sw.js`).
   - Caches application shell, static icons, and exercise database.
   - Offline outbox queue for syncing completed workouts when internet connectivity is restored.

7. **MET-Based Calorie Estimation**:
   - Calculates energy expenditure based on exercise MET values, active time per set, and rest interval metabolic rates (EPOC).

8. **Personal Records (PRs) & Consistency Tracking**:
   - Tracks 1RM (Epley formula), maximum weight, and weekly consistency streaks.

---

## Tech Stack

* **Frontend**: Next.js 15 (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS + Lucide Icons + Gym Dark Theme tokens
* **Local Offline Storage**: Dexie.js (IndexedDB wrapper)
* **Cloud Storage & ORM**: Prisma ORM with SQLite (local zero-setup) / PostgreSQL (production)
* **Testing**: Vitest (pure algorithmic testing for generator, progression, substitution, calories, PRs)

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npx prisma db push
```

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or your mobile device on the same local network).

---

## Testing

Run unit tests covering all core algorithms:
```bash
npm run test
```
All 5 test suites validate:
* Schedule generation across 1–7 days
* Progression recommendations and plateau deload triggers
* Exercise substitution rankings and duplicate penalties
* MET calorie calculations
* 1RM and PR detection
