# TrackWise - Work Log Tracking App

## Overview
A mobile-first work log/tracking application for international students in Germany to track work hours with German legal compliance (120 full-day rule). Built with Expo (React Native) for the frontend.

## Architecture
- **Frontend**: Expo SDK 54 / React Native with Expo Router (file-based routing)
- **Backend**: Express.js wrapped with serverless-http (AWS Lambda target — not currently active)
- **Package Manager**: npm
- **Language**: TypeScript

## Feature-Sliced Architecture (single, in `frontend/src/`)
```
frontend/src/
├── app/                     # Expo Router routes (EXPO_ROUTER_APP_ROOT)
│   ├── _layout.tsx          # Root layout with auth gate + splash screen
│   ├── _providers/
│   │   └── AppProviders.tsx # QueryClient + i18n + AuthProvider
│   ├── (auth)/              # Auth flow screens (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   └── (tabs)/              # Main app tabs (authenticated)
│       ├── _layout.tsx      # Custom tab bar (gradient floating Add btn)
│       ├── index.tsx        # → DashboardPage
│       ├── work.tsx         # → AddWorkPage
│       └── history.tsx      # → WorkHistoryPage
├── entities/
│   └── work-entry/
│       ├── types.ts         # WorkEntry, JobType, DayType
│       └── lib/time.ts      # hoursForEntry, dayTypeFromHours
├── features/
│   └── work-log/
│       ├── api/workEntriesRepo.ts  # AsyncStorage CRUD (incl. delete)
│       ├── model/queries.ts        # React Query hooks
│       ├── model/seed.ts           # Sample data seeding
│       └── model/summary.ts       # Daily/weekly/monthly/yearly calculations
├── pages/
│   ├── dashboard/DashboardPage.tsx     # Gradient hero + metric cards
│   ├── add-work/AddWorkPage.tsx        # Work entry form
│   └── work-history/WorkHistoryPage.tsx  # Entry list with delete
└── shared/
    ├── config/storageKeys.ts    # AsyncStorage key constants
    ├── lib/
    │   ├── auth.tsx             # AuthContext (signup/login/logout/reset)
    │   ├── date.ts
    │   └── uuid.ts
    ├── i18n/
    │   ├── i18n.ts
    │   └── resources.ts         # English + German translations
    ├── theme/
    │   ├── colors.ts            # Design color system
    │   └── theme.ts             # (legacy, unused)
    └── ui/
        └── MetricCard.tsx       # Styled metric card component
```

## Key Features
- **Auth**: Signup/Login/Logout with local AsyncStorage (no backend needed)
- **Splash screen**: Gradient animated splash while loading auth state
- **Forgot/Reset password**: Demo flow with code "1234"
- **Dashboard**: Gradient hero showing today's hours + weekly/monthly/yearly cards
- **Yearly legal tracker**: German 120 full-day rule with color-coded status (green/yellow/red)
- **Add Work**: Job title, job type (mini/part/full), date, times, auto duration preview
- **History**: Colored entry cards with delete, empty state
- **Custom tab bar**: Floating gradient Add button in center
- **Header**: User avatar (initials) on all tabs, tapping logs out

## Design System (`src/shared/theme/colors.ts`)
- Primary: #2563EB (blue)
- Secondary: #7C3AED (purple)
- Gradient: #2563EB → #7C3AED
- Safe: #10B981, Warning: #F59E0B, Danger: #EF4444
- Background: #F1F5F9, Card: #FFFFFF

## Workflow
- **Start application**: Expo dev server on port 5000 (web mode)
  - Command: `cd frontend && ./node_modules/.bin/cross-env EXPO_ROUTER_APP_ROOT=src/app npx expo start --web --port 5000`

## Deployment
- **Type**: Static site
- **Build**: `cd frontend && ./node_modules/.bin/cross-env EXPO_ROUTER_APP_ROOT=src/app npx expo export --platform web --output-dir dist`
- **Public Dir**: `frontend/dist`

## Notes
- `EXPO_ROUTER_APP_ROOT=src/app` must be set (done in workflow command)
- Auth state stored in AsyncStorage: users array + currentUser
- Data stored in AsyncStorage: work entries array
- Seed data auto-populates on first run
- Mobile: scan QR code from Expo Go for native experience
- The `frontend/app/` directory exists but is ignored (EXPO_ROUTER_APP_ROOT overrides it)
