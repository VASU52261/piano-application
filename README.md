#  Piano Application

A browser-based interactive piano application built with vanilla HTML, CSS, and JavaScript. Play real piano notes, record and replay your sessions, track your practice stats, and level up with a built-in gamification system.

---

##  Preview

> Piano keys on the left, feature panel on the right — separated by a clean divider.

---

##  Features

###  Interactive Piano
- 12-key piano (one full octave: C4 to B4, including all sharps/flats)
- Click any key to play a real sampled MP3 note
- Visual key press animation on click

###  Record & Playback
- Record your key presses with exact timing
- Replay your recording note-for-note with visual key highlights
- Status bar shows recording state and note count

###  Analytics & Progress
- Tracks total notes played across all sessions
- Tracks today's note count separately
- Tracks total practice time (saved on tab close)
- Session history stored persistently via `localStorage`

###  Gamification
- **XP System** — earn 2 XP per note played
- **10 Level Tiers** — Beginner → Novice → Learner → ... → Virtuoso
- **XP Progress Bar** — live visual fill as you earn XP
- **Daily Challenges** — auto-assigned goal each day (e.g. "Play 50 notes today")
- **Streak Tracking** — counts consecutive days you practice
- **Badge System** — unlock badges for milestones:
  - First Note
  -  50 Notes
  -  Level 5
  -  3 Day Streak
  -  Virtuoso (Level 10)

---

##  Project Structure

```
piano/
├── index.html         # Main HTML structure
├── style.css          # All styling
├── script.js          # All JavaScript logic
└── notes/
    └── notes/
        ├── A.mp3
        ├── Ab.mp3
        ├── B.mp3
        ├── Bb.mp3
        ├── C.mp3
        ├── D.mp3
        ├── Db.mp3
        ├── E.mp3
        ├── Eb.mp3
        ├── F.mp3
        ├── G.mp3
        └── Gb.mp3
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/piano-app.git
cd piano-app
```

### 2. Add your audio files

Place your `.mp3` note files inside the `notes/notes/` folder. The app expects these exact filenames:

`A.mp3`, `Ab.mp3`, `B.mp3`, `Bb.mp3`, `C.mp3`, `D.mp3`, `Db.mp3`, `E.mp3`, `Eb.mp3`, `F.mp3`, `G.mp3`, `Gb.mp3`

### 3. Run locally

Open with a local server (required for audio files to load):

**Option A — VS Code Live Server:**
Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html` → Open with Live Server.

**Option B — Python:**
```bash
python -m http.server 5501
```
Then visit `http://127.0.0.1:5501`

>  Do NOT open `index.html` directly as a file (`file://`) — audio will not load due to browser security restrictions.

---

##  Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure and audio elements |
| CSS3 | Styling, layout, animations |
| Vanilla JavaScript | All logic — audio, recording, analytics, gamification |
| Web Audio API | Audio context for playback timing |
| localStorage | Persistent data across sessions |

No frameworks. No libraries. No dependencies.

---

##  How to Use

| Action | How |
|---|---|
| Play a note | Click any piano key |
| Record a session | Click ** Record**, play keys, click **■ Stop** |
| Replay recording | Click ** Playback** |
| View practice stats | Check the ** Stats** panel on the right |
| Check XP & level | Check the ** Your Progress** panel on the right |

---

## Data Persistence

All progress is saved automatically in your browser's `localStorage`:

- `pianoAnalytics` — notes played, practice time, session history
- `pianoGame` — XP, level, streak, badges, challenge progress

Data persists across browser sessions on the same device. Clearing browser data will reset all progress.

---

##  Possible Future Features

- [ ] Keyboard support (play with keyboard keys)
- [ ] Multiple octaves
- [ ] Song library with auto-play
- [ ] Weekly/monthly progress graphs
- [ ] Leaderboard (multiplayer XP comparison)
- [ ] Mobile touch support

---


