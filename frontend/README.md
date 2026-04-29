# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.








Abubakar
abubakarmujahid980@gmail.com
(@#password@#)





TrackWise Frontend Project — Context & Current Status
Main ek React Native (Expo) app bana raha hun jiska naam TrackWise hai — German international students ke liye work hour tracking, document tracking, aur appointment management app.
Tech Stack:

Expo (Expo Router file-based routing)
TypeScript
Clerk authentication
TanStack Query
AsyncStorage (local, backend baad mein connect hoga)
expo-linear-gradient, @expo/vector-icons

Project Structure:
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/         — login, signup, forgot-password
│   │   ├── (tabs)/         — dashboard, work, history, documents, appointments, profile
│   │   ├── _providers/     — AppProviders.tsx (Clerk + QueryClient)
│   │   └── _layout.tsx     — Root layout with ClerkProvider + AuthGate
│   ├── pages/
│   │   ├── dashboard/      — DashboardPage.tsx
│   │   ├── add-work/       — AddWorkPage.tsx (Hub: Work + Docs + Appointments)
│   │   ├── work-history/   — WorkHistoryPage.tsx
│   │   ├── documents/      — DocumentsPage.tsx
│   │   └── appointments/   — AppointmentsPage.tsx
│   ├── shared/
│   │   ├── lib/
│   │   │   ├── auth.tsx        — Clerk useAuth wrapper
│   │   │   ├── useDocuments.tsx — Global docs state
│   │   │   └── useAppointments.tsx — Global appointments state
│   │   └── theme/colors.ts
│   ├── features/work-log/  — TanStack Query hooks
│   └── entities/work-entry/
Jo kaam ho chuka hai:

✅ Clerk signup/login (email verification)
✅ Dashboard — today hours, weekly, monthly, yearly 120-day German limit
✅ Add Hub — Work entry / Document / Appointment ek page pe
✅ Work History — month filter
✅ Documents page — expiry tracking, status badges
✅ Appointments page — urgency tracking
✅ Profile — edit name, change password, logout
✅ Custom tab bar — 6 tabs

Ab karna hai:

Documents aur Appointments tabs hataane hain — sirf 4 tabs: Dashboard, Add, History, Profile
Dashboard mein Documents aur Appointments cards add karne hain (useDocuments aur useAppointments hooks se)
History page mein 3 tabs: Work / Docs / Appointments
Dark/Light theme
CLI migration (React Native CLI) — Android Studio install ho raha hai

Important notes:

Backend se connect nahi — abhi local state hai
useDocuments aur useAppointments global module-level state use karte hain
Beginner developer hun React Native mein — step by step guide karo
Ek kaam khatam hone ke baad agla karo
Poora code diya karo, tukron mein nahi