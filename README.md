# Imposter Game - The Ultimate Social Deduction Party Game

A high-polish, feature-rich web duplicate of the viral **Imposter** party game app (Who is the Imposter / Imposter Codewords). Gather your friends, pass one phone around, bluff your way through secret word clues, and vote to unmask the imposter!

---

## ✨ Features

- 🌐 **Online Multiplayer (Play on Own Phones)**: Create a room, share a link / QR code, and play synchronized rounds across everyone's personal devices with real-time Socket.io state sync!
- 🎮 **Pass & Play (1 Phone, 3-20 Players)**: Seamless local party play designed specifically for group game nights.
- 🎭 **Multiple Game Modes**:
  - **Classic**: Imposter receives no secret word and must bluff blindly.
  - **Undercover**: Imposter receives a slightly different related word (e.g. *Pizza* vs *Burger*).
  - **Confused Innocent Role**: An innocent player unknowingly receives an alternate word, adding hilarious chaos.
- 💡 **Helpful Hints**: Option to grant imposters a broad category hint so they can craft believable clues.
- 📦 **Rich Word Categories**:
  - 🍕 Food & Drinks
  - 🦁 Animals & Nature
  - 🎬 Movies & Pop Culture
  - 🎒 Everyday Objects
  - ✈️ Places & Travel
  - 💼 Professions & Jobs
  - ⚽ Sports & Hobbies
  - 🎉 Party Night & Fun
- 🛠️ **Custom Word Packs Creator**: Easily create and save custom categories and secret word pairs.
- ⏱️ **Clue Order & Discussion Timer**: Automatic randomized first speaker, speaking order badges, and interactive countdown timer.
- 🗳️ **In-App Secret Voting & Group Consensus**: Vote privately on the device or eliminate players with quick group consensus.
- 👑 **Imposter Redemption Guessing**: If unmasked, the imposter can attempt to guess the secret word to steal victory.
- 🏆 **Party Leaderboard & Persistent Scores**: Tracks scores across multiple rounds using browser local storage.
- 🔊 **Synthesized Web Audio & Haptics**: Rich sound effects for clicks, card reveals, imposter stingers, timer countdowns, buzzer, and victory fanfare (plus confetti!).
- 📱 **Mobile First & Responsive**: Optimized for iOS/Android smartphones, tablets, and desktop browsers.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Delanoso/Imposter-game.git
cd Imposter-game

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 100% Free Hosting & Deployment Guide

Because this app includes live **Socket.io** online multiplayer, you can host it for free on:

### Option 1: Render.com (Recommended for Node + WebSocket)
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** -> **Web Service** and link your GitHub repo (`Delanoso/Imposter-game`).
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Deploy! You'll receive a free permanent `https://your-app.onrender.com` link.

### Option 2: Railway / Fly.io
- Connect repository and run `npm start` with auto HTTPS and WebSocket support.

### 📲 How Users "Download" / Install Free (PWA):
- **iPhone (iOS Safari)**: Open link -> Tap **Share** (square with up arrow) -> Tap **"Add to Home Screen"**.
- **Android (Chrome)**: Open link -> Tap **Three Dots (⋮)** -> Tap **"Install app"** or **"Add to Home Screen"**.

---

## 📖 How to Play

1. **Setup**: Choose player count (3–20), select avatars & names, and choose game mode & categories.
2. **Pass & Peek**: Pass the device to each player. Tap the card to secretly peek at your word.
3. **Clues**: In speaking order, each player says **ONE WORD** related to the secret word.
4. **Debate & Vote**: When time runs out, discuss and vote on who is the imposter!
5. **Score**:
   - Civilians earn **+2 points** if the imposter is caught.
   - The imposter earns **+3 points** if they survive undetected.
   - If caught, the imposter can attempt to guess the secret word for redemption.
