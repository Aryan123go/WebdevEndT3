# 🎓 Smart Queue System for Campus Services

A modern, real-time Virtual Queue System built to solve the problem of students wasting time standing in physical queues at campus facilities like the Canteen, Admin Office, and Library. 

This is a production-level React project developed for end-term evaluation, focusing on clean UI/UX, robust state management, and real-time database synchronization.

## ✨ Features

- **Role-Based Authentication:** Clean Login/Signup flows supporting two user personas: Students and Admins.
- **Real-Time Virtual Queuing:** Powered by Firebase Cloud Firestore, students can join a virtual line and instantly see their live numerical position update without refreshing the page.
- **Smart Dashboard:** Dynamic Queue cards natively track if you are currently waiting in a line, adapting UI colors and button states for brilliant user experience.
- **Admin Control Panel:** Dedicated dashboard for staff to view the current list of waiting students, check queue durations, approve interactions, and manage the waitlist.
- **Native Browser Nudge:** Employs the native Browser Notification API to visually alert the student when their position reaches `#1` (Next up!).

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 (via Vite)
- **Routing:** React Router v7 (Protected & Public Routes)
- **Styling:** Tailwind CSS v4 (Utility-first CSS framework natively integrated via Vite plugin)
- **Icons & UI:** Lucide React
- **Backend/Database:** Firebase Authentication & Firestore (NoSQL)
- **Date Formatting:** `date-fns` for human-readable time tracking.

## 🚀 Setting Up the Project Locally

### 1. Requirements
Ensure you have `Node.js` installed on your machine.

### 2. Installation
Clone the repository and install the NPM dependencies:
```bash
git clone https://github.com/Aryan123go/WebdevEndT3.git
cd WebdevEndT3
npm install
```

### 3. Firebase Configuration
To run this application locally, you must provide your own Firebase keys.
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** (Start in Test Mode).
3. Enable **Authentication** (Email/Password).
4. Locate your Web App Config credentials and paste them precisely into `src/services/firebase.js`.

### 4. Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 💡 Architecture & Design Patterns

This system applies several core React principles tightly:
- **`useQueue.js` Custom Hook:** Condenses raw Firebase `onSnapshot` subscriptions into structured, client-side array management utilizing native JavaScript `.filter()` and `.sort()` to bypass rigid composite indexing limitations.
- **`AuthContext.jsx`:** A React Context wrapper protecting child tree routes and passing down instantaneous `currentUser` payload validations seamlessly.
- **Memoization (`useMemo` / `useCallback`):** Applied across intensive array-mapping features to ensure the frontend doesn't lag when sorting through large historical waitlists.

## 👤 Author
Developed by Aryan Jaiswal.
