# YAMI AI — Voice-Interactive Thesis Consultant

> **Agora Voice AI Hackathon Manila 2026** · Group B · Team Setso

YAMI (Your AI Mentor & Inquisitor) is a real-time, voice-interactive AI framework for graduate thesis consultation. It simulates a thesis defense panel, reading your uploaded PDF and giving contextual, voice-driven feedback through a modern web interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Viewer** | Upload and view any PDF directly in the browser via drag-and-drop or file picker |
| 🎙️ **Voice Session** | Full-screen video-call style modal with the animated YAMI avatar |
| 🧠 **Consultation Styles** | Switch between **Guided**, **Standard**, and **Rigorous** questioning modes |
| 🤖 **AI Avatar** | Animated face (mouth open/closed) synced to speech state |
| 💬 **Conversation Log** | Scrollable chat thread with one-click `.txt` export |
| 🔄 **Defense / Mentor Mode** | Toggle between adversarial panel mode and supportive mentor mode |
| 📁 **File Management** | Open, close, and replace PDFs without page reload |

---

## 🧱 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, `"use client"`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Geist Sans & Geist Mono (via `next/font`)
- **Images:** `next/image` with blob URL for uploaded PDFs

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout, metadata & favicon config
│   ├── page.tsx            # Main app shell (wires all components)
│   └── globals.css
├── components/
│   ├── AvatarAnimated.tsx  # Alternating mouth-open/closed avatar image
│   ├── DocumentToolbar.tsx # File open/close, mode toggle, zoom controls
│   ├── HeaderAction.tsx    # Share / Export header buttons
│   ├── MessageBubble.tsx   # Conversation log chat bubbles
│   ├── PdfViewer.tsx       # PDF iframe viewer + drag-and-drop upload zone
│   ├── SidebarButton.tsx   # Sidebar navigation icon buttons
│   ├── ToolbarIconButton.tsx
│   ├── VoiceSessionModal.tsx # Full-screen voice call UI with controls
│   └── icons/
│       └── index.tsx       # All SVG icon components (barrel export)
└── public/
    ├── mr-yami.png         # YAMI avatar (default)
    ├── mr-yami-open.png    # YAMI avatar (mouth open)
    ├── mr-yami-closed.png  # YAMI avatar (mouth closed)
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    └── android-chrome-512x512.png
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Install & Run

```bash
cd "submissions/Group B/team-setso/Source Code/frontend"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Use

1. **Open a PDF** — Click the **Open** button in the document toolbar and select a `.pdf` file, or drag & drop it onto the canvas
2. **Choose a mode** — Use the **Defense Mode / Mentor Mode** toggle to set the AI's approach
3. **Start a session** — Click **Connect Voice** in the right panel to open the voice call UI
4. **Pick a consultation style** in the call:
   - 🟢 **Guided** — Supportive, step-by-step assistance
   - 🔵 **Standard** — Balanced academic examination
   - 🔴 **Rigorous** — Adversarial panel-style defense
5. **Mute / End** the call using the on-screen controls
6. **Export** the conversation log as a `.txt` file via the export button next to the log header

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 👥 Team Setso — Group B

Built for the **Agora Voice AI Hackathon Manila 2026**.
