# 🔴 Hawkins Python Lab

A **Stranger Things-themed interactive Python learning website** for kids, covering all 7 units of the Khan Academy *Intro to Python Fundamentals* course. Students learn Python through missions, secret intel, and battles against the Mind Flayer — no prior experience required.

![Hawkins Python Lab](https://img.shields.io/badge/Python-Learning-e63946?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)

---

## ✨ Features

- 🖥️ **Streaming terminal intro** — Stranger Things-style welcome briefing with 80s synth background music
- 📚 **25 interactive lessons** across 7 units — all with editable code, quizzes, and fill-in-the-blank exercises
- ▶️ **In-browser Python runner** — no installs needed; students run code right in the page
- 🧭 **Left sidebar navigation** — collapsible units with scroll-aware active highlighting
- 🎨 **Full Stranger Things theme** — Creepster font, red glow effects, Christmas lights, Upside Down atmosphere
- 🔐 **Google sign-in** — students can log in with Google for a personalized session
- ☁️ **Firebase progress tracking** — lesson completion and unit progress are saved in Firestore

---

## 📖 Course Units

| Unit | Stranger Things Title | Topics |
|------|----------------------|--------|
| 1 | The Hawkins Files | Data types, Variables, Math, Debugging |
| 2 | Upside Down Decisions | if / elif / else, Nested conditionals, Logic operators |
| 3 | Time Loops in Hawkins | for loops, while loops, break / continue, random |
| 4 | Eleven's Power Protocols | Functions, Return values, Scope, assert |
| 5 | The Party Roster | Lists, String manipulation, List mutation |
| 6 | Hawkins Lab Dossiers | Dictionaries, Dict iteration, Nested data |
| 7 | Building the Mind Hive | Classes, Methods, Composition |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **v18 or later**
- [pnpm](https://pnpm.io/installation) — install with:
  ```bash
  npm install -g pnpm
  ```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gauravk79/python-lab.git
cd python-lab

# 2. Install dependencies
pnpm install
```

### Running Locally

```bash
PORT=5174 BASE_PATH=/ pnpm --filter @workspace/python-app run dev
```

Then open **http://localhost:5174** in your browser.

### Firebase Setup (Google Auth + Progress Tracking)

Create `artifacts/python-app/.env.local` with your Firebase project values:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

What this enables:
- Google authentication (sign in/sign out)
- Student progress persistence in Firestore (section-level completion, unit progress, resume state)

### Building for Production

```bash
pnpm --filter @workspace/python-app run build
```

The production-ready files will be output to `artifacts/python-app/dist/`.

---

## 🗂️ Project Structure

```
python-lab/
├── artifacts/
│   └── python-app/          # Main React + Vite web app
│       ├── public/
│       │   └── audio/       # Intro theme music
│       └── src/
│           ├── components/
│           │   ├── IntroSection.tsx    # Streaming terminal welcome briefing
│           │   ├── ConceptSection.tsx  # Individual lesson cards
│           │   └── Sidebar.tsx         # Left navigation panel
│           ├── data/
│           │   └── concepts.ts         # All 25 lessons, quizzes & exercises
│           ├── hooks/
│           │   └── useActiveSection.ts # Scroll-aware sidebar highlighting
│           ├── pages/
│           │   └── Home.tsx            # Main layout
│           ├── utils/
│           │   └── pythonSimulator.ts  # Client-side Python output engine
│           └── index.css               # Theme styles & animations
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 5 | Dev server & bundler |
| TypeScript | Type safety |
| Tailwind CSS | Utility styling |
| Framer Motion | Animations |
| pnpm workspaces | Monorepo management |

---

## 🎮 How It Works

- **No backend required** — the app is fully client-side. The Python simulator (`pythonSimulator.ts`) matches known code patterns and returns the correct output without using `eval()`.
- **Music** — the intro terminal plays an AI-generated 80s synth score. Students click the terminal to start it, and can mute or replay at any time.
- **Quizzes** — each lesson ends with a multiple-choice "Mind Flayer's Test" and a fill-in-the-blank "Patch the Signal" exercise, both checked instantly in the browser.

---

## 📄 License

MIT — free to use, fork, and adapt for educational purposes.
