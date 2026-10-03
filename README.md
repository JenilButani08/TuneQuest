# TuneQuest — Gamified Music Streaming & Knowledge Rewards Platform

> **"Listen. Play. Earn. Unlock."**

TuneQuest is a modern, production-grade music streaming and trivia rewards web application. It transforms the conventional passive listening experience into an interactive progression ecosystem: users discover curated music, prove their musical ear in audio challenges, earn virtual **TunePoints (TP)**, maintain daily streaks, and redeem their knowledge for VIP premium streaming perks.

---

## ⚡ The Core Gamification Loop

```
  🎧 LISTEN  ──────►  🎮 PLAY  ──────►  🧠 KNOW  ──────►  💎 EARN (TP & XP)
      ▲                                                           │
      │                                                           ▼
  🎧 STREAM VIP  ◄────  ⭐ UNLOCK  ◄────  🎁 REDEEM  ◄────  🏆 PROGRESS
```

1. **Listen:** Discover synthwave, lo-fi, afro-beats, indie, and global fusion tracks with rich trivia snippets.
2. **Play:** Take on daily gauntlets and category arenas (audio recognition, lyrics, album art, music history).
3. **Earn:** Receive +10 TunePoints per correct answer, level up with XP, and preserve daily fire streaks.
4. **Redeem:** Exchange TunePoints in the TuneQuest Reward Store for ad-free VIP passes (1-Day, 3-Day, 7-Day, 30-Day Pro).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 19 + TypeScript (Strict Mode) |
| **Build Tool** | Vite 8 + Rolldown Optimization |
| **Styling & Tokens** | Tailwind CSS + Custom CSS Variables Design Tokens |
| **Theme** | Dark-first obsidian aesthetic (`#08080D`, `#111118`, `#181820`, Electric Purple, Cyan, Magenta) |
| **State Management** | Zustand (Modular: `authStore`, `playerStore`, `quizStore`, `walletStore`, `uiStore`) |
| **Routing** | React Router v7 (`createBrowserRouter`) |
| **Audio Engine** | HTML5 Audio + Procedural Web Audio Synthesizer Fallback |
| **Icons** | Lucide React |
| **Animations** | Framer Motion + Canvas Confetti |
| **Validation** | Zod + React Hook Form |
| **API Abstraction** | Dedicated Service Layer (`apiClient`, `authService`, `musicService`, `quizService`, `rewardService`, `userService`) |

---

## 📁 Clean Architectural Directory Structure

```
tunequest/
├── public/
│   ├── favicon.svg             # Vector emblem (music note + quest diamond)
│   ├── manifest.json           # PWA web app manifest
│   └── robots.txt              # Production crawler configuration
├── src/
│   ├── app/
│   │   ├── config/             # Environment & app constants
│   │   └── router/             # React Router configuration
│   ├── components/
│   │   ├── layout/             # AppLayout, Navbar, Sidebar, MobileNav
│   │   ├── music/              # MusicPlayer, MiniPlayer, ExpandedMobilePlayer, SongRow, MusicCard, AddToPlaylistModal
│   │   ├── quiz/               # Question views, timer, option cards
│   │   ├── rewards/            # RedemptionModal, reward cards
│   │   └── ui/                 # Button, Badge, Card, Modal, ProgressBar, Input, Skeleton, ToastContainer
│   ├── mock/                   # Realistic seed datasets: users, songs, artists, albums, quizzes, rewards, leaderboard
│   ├── pages/
│   │   ├── Landing/            # Public hero & feature showcase
│   │   ├── Login/              # 1-Click demo login & secure auth form
│   │   ├── Register/           # Multi-step onboarding & genre selector
│   │   ├── ForgotPassword/     # Password recovery workflow
│   │   ├── Terms/ & Privacy/   # Legal placeholder disclosures
│   │   ├── Home/               # Dynamic greeting, quick actions, daily challenge card, progress overview
│   │   ├── Search/             # Debounced live search with tabs (all, songs, artists, albums, playlists)
│   │   ├── Browse/             # Activity mood cards, genres grid, creator highlights
│   │   ├── Artist/ & Album/    # Discography details and tracklists
│   │   ├── Playlist/           # Playlist manager with play, shuffle, remove
│   │   ├── Library/            # Saved playlists and collections
│   │   ├── Liked/ & History/   # Liked tracks and streaming logs
│   │   ├── Quiz/               # QuizIndex, DailyQuiz, QuizPlay (timer & audio clues), QuizResult
│   │   ├── Rewards/            # TunePoints Wallet & Redeem Store
│   │   ├── Leaderboard/        # Top 3 podium, timeframe tabs, user ranking
│   │   ├── Achievements/       # Milestone badges, progress meters
│   │   ├── Profile/            # Streak calendar, level progress, stats
│   │   └── Settings/           # Audio bitrate, volume normalization, danger zone
│   ├── services/
│   │   ├── api/                # apiClient with credentials & error interception
│   │   ├── auth/               # authService (mock / real backend separation)
│   │   ├── music/              # musicService (catalog, search, likes)
│   │   ├── playlist/           # playlistService (CRUD playlists)
│   │   ├── quiz/               # quizService (authoritative validation & anti-cheat)
│   │   ├── rewards/            # rewardService (atomic points & transactions)
│   │   └── user/               # userService (leaderboard, achievements, analytics)
│   ├── store/                  # Zustand global state slices
│   ├── types/                  # Strict TypeScript domain interfaces
│   ├── utils/                  # audioSynth (Web Audio procedural synthesizer)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Design tokens & glassmorphic styles
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🔒 Security Principles

Even though running in a browser environment, TuneQuest follows production-grade security architecture:

1. **Non-Authoritative Frontend:**
   - The client never mutates `wallet.balance += 10`.
   - The backend validates quiz attempts, verifies timestamps, computes scores, and executes atomic ledger balance deductions.
2. **Anti-Cheat Preparation:**
   - Correct question answers (`correctOptionId`) are never delivered to the client upfront.
   - Each quiz submission carries an `attemptId`, `questionId`, and timing metrics for anomaly detection.
3. **Tokenless Cookie Sessions:**
   - Authentication is designed around `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
   - Plaintext passwords and secrets are **never** stored in browser `localStorage`.
4. **Rate Limiting UX:**
   - Built-in `429 Too Many Requests` status code interception with friendly throttle alerts.

---

## 🎵 Legal Music Demonstration & Audio Engine

TuneQuest uses legally compliant, royalty-free audio and high-resolution Unsplash creator photography. 

To ensure continuous playback without network dependencies or broken third-party links, the platform includes a **Web Audio Procedural Synthesizer** (`src/utils/audioSynth.ts`):
- Generates real harmonic progressions for Synthwave, Lo-Fi, Ambient, and Cyberpunk.
- Provides interactive UI chime feedback for quiz timer alerts and answer selections.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0+`
- npm `v9.0+`

### Installation
```bash
# Clone or navigate to the project directory
cd tunequest

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configuration variables:
```ini
VITE_APP_NAME=TuneQuest
VITE_APP_TAGLINE="Listen. Play. Earn. Unlock."
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_AUDIO_SYNTH_FALLBACK=true
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build & Typecheck
```bash
npm run build
```

---

## 🎮 Demo User Credentials

In Demo Mode (`VITE_DEMO_MODE=true`):
- **Username:** `MusicExplorer`
- **Display Name:** `Alex Rivers`
- **Email:** `explorer@tunequest.app`
- **Level:** 7 (Music Explorer)
- **TunePoints Balance:** `1,240 TP`
- **Daily Streak:** 7 Days (Active)
- **Quiz Accuracy:** 82%

Click **"1-Click Demo"** on the [Login page](/login) to instantly log in.

---

## 🌐 Future Backend Integration

The frontend service layer is structured to seamlessly plug into a backend stack:
- **Backend:** Django REST Framework / FastAPI / Express
- **Database:** PostgreSQL (users, tracks, quiz_attempts, point_transactions, subscriptions)
- **Caching & Rate Limiting:** Redis
- **Storage & CDN:** Cloudflare R2 / AWS S3 for audio streams and album art

To connect to a live backend, simply point `VITE_API_BASE_URL` to your API endpoint and set `VITE_DEMO_MODE=false`.

---

## 📄 License
This application is created for demonstration and educational purposes. Audio samples and demo assets are provided under open Creative Commons and royalty-free licenses.
