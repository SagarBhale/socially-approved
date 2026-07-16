# 🎬 Socially Approved – Video Carousel

A full-stack video carousel application built with **React + MUI** (frontend) and **Node.js + Express** (backend).  
Similar to the "Socially Approved" section on [driptrip.in](https://driptrip.in/).

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | _[deployed Vercel URL]_ |
| 🔌 Backend API | _[deployed Render URL]_ |
| 📋 API Health | `[Render URL]/api/health` |

---

## 📦 Project Structure

```
BridgeStone/
├── backend/          Node.js + Express API
│   ├── data/         Dummy video JSON (30 videos)
│   ├── routes/       videos.js, likes.js, shares.js
│   └── server.js     Entry point
│
└── frontend/         React + Vite + MUI
    └── src/
        ├── components/
        │   ├── OuterCarousel/   Horizontal scroll grid
        │   ├── InnerCarousel/   Fullscreen modal (3 videos)
        │   ├── VideoCard/       Thumbnail + lazy load
        │   ├── VideoPlayer/     Controls + progress bar
        │   └── ShareMenu/       Social share popover
        ├── hooks/               useVideoControls, useIntersectionObserver
        ├── services/api.js      Axios HTTP client
        ├── App.jsx              Root + MUI ThemeProvider
        └── index.css            CSS design tokens
```

---

## ✨ Features

### Frontend
- **Outer Carousel** – Horizontal drag-to-scroll with 30 video cards
- **Inner Modal Carousel** – 3 videos visible at a time; center auto-plays
- **Lazy Loading** – Thumbnails and video `src` load only when in viewport
- **Video Controls** – Play/Pause, Mute/Unmute, Seekable progress bar
- **Loading Spinner** – MUI `CircularProgress` while buffering
- **Like Button** – Optimistic UI update + heart animation
- **Share Menu** – Copy link, Twitter, WhatsApp, Facebook, Instagram
- **Comments** – Collapsible panel with add comment form
- **Performance** – Only ±2 slides rendered; auto-pause at 50% out of view
- **Keyboard Nav** – ←/→ arrows + Escape to close modal
- **Touch Swipe** – Swipe to navigate both carousels

### Backend
- `GET  /api/videos` – 30 video entries with pagination
- `POST /api/like`   – Toggle like/unlike per IP
- `POST /api/share`  – Track share events by platform
- `GET  /api/health` – Health check

---

## 🛠️ Local Development

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/socially-approved-carousel.git
cd socially-approved-carousel
```

### 2. Start Backend
```bash
cd backend
npm install
node server.js
# → http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🌐 Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo → select `backend/` as root directory
3. **Build command**: `npm install`
4. **Start command**: `node server.js`
5. Set env var: `NODE_ENV=production`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo → set **Root Directory** to `frontend`
3. Framework: **Vite** (auto-detected)
4. Add env variable: `VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api`
5. Deploy!

---

## 🔌 API Reference

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/videos` | — | `{ success, total, data[] }` |
| GET | `/api/videos/:id` | — | `{ success, data }` |
| POST | `/api/like` | `{ videoId }` | `{ success, liked, likes }` |
| POST | `/api/share` | `{ videoId, platform }` | `{ success, shares }` |
| GET | `/api/health` | — | `{ status: "OK" }` |

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, MUI v5, Vanilla CSS |
| Backend | Node.js, Express 4, CORS, body-parser |
| Deployment | Vercel (frontend), Render (backend) |
| Styling | CSS Custom Properties (Design Tokens) |

---

## 📄 License
MIT
