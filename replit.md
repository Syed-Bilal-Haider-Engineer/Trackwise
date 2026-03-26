# TrackWise - Work Log Tracking App

## Overview
A mobile-responsive work log/tracking application built with Expo (React Native) for the frontend and a Node.js/Express backend designed for AWS Lambda.

## Architecture
- **Frontend**: Expo SDK 54 / React Native with Expo Router (file-based routing)
- **Backend**: Express.js wrapped with serverless-http (AWS Lambda target)
- **Package Manager**: npm (per-directory)
- **Language**: TypeScript (frontend), JavaScript (backend)

## Project Structure
```
/
├── frontend/           # Expo React Native app
│   ├── src/app/        # Main Expo Router routes (EXPO_ROUTER_APP_ROOT)
│   │   ├── _layout.tsx
│   │   ├── _providers/  # AppProviders (QueryClient, i18n, Paper theme)
│   │   ├── (tabs)/      # Tab navigation (Dashboard, Add, History)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── ...
│   ├── src/entities/   # Domain types (work-entry)
│   ├── src/features/   # Feature modules (work-log API, state, seeds)
│   ├── src/pages/      # Page components (DashboardPage, AddWorkPage)
│   ├── src/shared/     # Shared UI components, i18n, theme
│   └── app.json        # Expo config (web output: static)
└── backend/            # AWS Lambda Express API
    ├── handler.js
    └── serverless.yml
```

## Key Dependencies
- `expo-router` - File-based routing
- `@tanstack/react-query` - Server state management
- `@react-native-async-storage/async-storage` - Local data persistence
- `react-native-paper` - UI component library
- `i18next` + `react-i18next` - Internationalization
- `expo-linear-gradient` - Gradient UI elements

## Workflows
- **Start application**: Runs Expo dev server on port 5000 (web mode)
  - Command: `cd frontend && ./node_modules/.bin/cross-env EXPO_ROUTER_APP_ROOT=src/app npx expo start --web --port 5000`

## Deployment
- **Type**: Static site
- **Build**: `cd frontend && ./node_modules/.bin/cross-env EXPO_ROUTER_APP_ROOT=src/app npx expo export --platform web --output-dir dist`
- **Public Dir**: `frontend/dist`

## Notes
- `EXPO_ROUTER_APP_ROOT=src/app` must be set to point Expo Router to the correct app root
- The app uses local AsyncStorage for data persistence (no external DB required for basic usage)
- Backend is configured for AWS Lambda/Serverless deployment separately
