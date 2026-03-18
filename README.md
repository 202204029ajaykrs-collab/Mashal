# Mashal (TikTok-style Video App)

This repository contains a **full-stack <u>React Native + Node/Express + MongoDB</u> video app** (a simplified TikTok-style experience).

## ✅ What is working right now (current stage)

### Backend (Node.js + Express)
- ✅ User auth (register / login) using **JWT**
- ✅ Google Sign-In endpoint
- ✅ Protected routes using `x-auth-token`
- ✅ Video upload endpoint (stores videos in **Cloudinary**)
- ✅ Feed endpoint: list all videos, with uploader metadata
- ✅ Like and comment APIs (toggle like, add comment)
- ✅ Safe behavior when MongoDB connection fails (app stays running and prints hints)

### Mobile App (React Native)
- ✅ Auth flow (login / register + Google auth)
- ✅ Feed screen with video playback (react-native-video)
- ✅ Upload screen (select local video + upload to backend)
- ✅ Like button + like count
- ✅ Simple navigation (login/signup ↔ feed ↔ upload) using React Navigation

---

## 🧭 Project Overview
Mashal is a short-video social app prototype:
- Users can sign up / log in
- Upload small videos (compressed) to Cloudinary
- Watch a feed of uploaded videos
- Like videos (tracked in MongoDB)
- Comment on videos (stored in MongoDB)

The architecture is set up to eventually support:
- Offline action queue (like/comment while offline)
- Preloaded local video cache
- Recommendation engine backend

---

## ✅ What is still pending / next improvements

### Backend
- ✅ (Done) Basic auth + video upload + likes/comments
- 🔲 Add user follow/following system
- 🔲 Add proper pagination / feed recommendation logic
- 🔲 Add server-side validation for video upload size/type
- 🔲 Add unit/integration tests (Jest/Supertest)

### Mobile
- 🔲 Offline mode (queue likes/comments locally + sync)
- 🔲 Add video player UI improvements (progress, buffering, swipe navigation)
- 🔲 Add user profile screen + follow system
- 🔲 Add proper error display (currently logged in console)

---

## 🚀 Run the project (full stack)

This repo has TWO parts:
1. `backend/` – Node.js API + MongoDB
2. `mobile/MashalApp/` – React Native mobile app

> ⚠️ **Important:** Both must be running for the mobile app to work.

---

## ✅ Prerequisites (common to Linux/Windows/macOS)

- Node.js (recommended **>= 18.x**, but project expects Node 22+ based on package.json)
- npm (comes with Node)
- MongoDB (Atlas or local) – see **MongoDB setup** below
- Git

---

## 🧩 MongoDB Setup (required)

This project uses MongoDB for storing users, videos, likes, and comments.

### Option A: MongoDB Atlas (cloud)
1. Create an Atlas account and a cluster.
2. Create a database user (username + password).
3. Add your IP (or 0.0.0.0/0 for testing) to the Network Access whitelist.
4. Copy the connection string, then set it in `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Option B: Local MongoDB (recommended for offline/dev)
1. Install MongoDB Community Server (https://www.mongodb.com/docs/manual/installation/)
2. Run it (default: `mongodb://127.0.0.1:27017`)
3. Update `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mashal
```

> ✅ The backend will attempt a local fallback automatically if Atlas fails.

---

## 🛠 Run backend (API)

### 1) Install dependencies
```bash
cd backend
npm install
```

### 2) Create `.env` (copy from `.env.example` if present)
Make sure you have at least:
```env
PORT=3000
MONGO_URI=<your mongo uri>
JWT_SECRET=<any secret key>
CLOUDINARY_CLOUD_NAME=<your cloudinary name>
CLOUDINARY_API_KEY=<your cloudinary key>
CLOUDINARY_API_SECRET=<your cloudinary secret>
GOOGLE_CLIENT_ID=<your google oauth web client id>
```

### 3) Start the server
```bash
npm start
```

If the server crashes with an error like `querySrv ECONNREFUSED ...` or `bad auth`, check:
- `backend/.env` is correct
- Your Atlas cluster network access includes your machine IP
- Your Mongo URI is valid (user/password)

---

## 📱 Run mobile app (React Native)

### 1) Install dependencies
```bash
cd mobile/MashalApp
npm install
```

### 2) Configure API URL
For emulator/device, the mobile app uses `mobile/MashalApp/src/config/api.js`.
- Android emulator uses `http://10.0.2.2:3000`
- iOS simulator uses `http://localhost:3000`

If you run on a real device, replace with your machine’s LAN IP:
```js
export const API_URL = 'http://192.168.1.xxx:3000';
```

---

## 🧪 Running on Linux

### Backend (Linux)
```bash
cd backend
npm install
npm start
```

### Mobile (Linux)
1. Install Android Studio + SDK
2. Start an emulator
3. Run:
```bash
cd mobile/MashalApp
npm install
npx react-native run-android
```

---

## 🪟 Running on Windows

### Backend (Windows)
```bash
cd backend
npm install
npm start
```

### Mobile (Windows)
1. Install Android Studio + SDK
2. Start an emulator
3. Run:
```bash
cd mobile/MashalApp
npm install
npx react-native run-android
```

---

## 🍎 Running on macOS

### Backend (macOS)
```bash
cd backend
npm install
npm start
```

### Mobile (macOS)
You can run Android (same as Windows/Linux) or iOS.

#### Android
```bash
cd mobile/MashalApp
npm install
npx react-native run-android
```

#### iOS
1. Install CocoaPods
2. Run:
```bash
cd mobile/MashalApp




























- better network error handling in the app- a user profile screen- a “follow” system + personalized feed- an offline action queue (like/comment while offline)If you want, I can also add:---- If you see a crash about `RNGestureHandlerModule`, make sure `react-native-gesture-handler` is installed and rebuild the Android app.- Uploads use `multipart/form-data` and require the backend to be running.- The app currently uses Cloudinary for video storage (free-tier limited to 25GB).## 📌 Notes---- `mobile/MashalApp/src/` – app source (screens, navigation, context)- `mobile/MashalApp/` – React Native app with screens and navigation- `backend/` – Express API, MongoDB models, auth + video APIs## 🧠 Project structure (high-level)---```npx react-native run-iosnpm installbundle exec pod installbundle install