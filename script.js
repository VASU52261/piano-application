// ─── AUDIO ENGINE ────────────────────────────────────────────
function playNote(noteId) {
  const audio = document.getElementById(noteId);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
}

// ─── KEY CLICK HANDLING ──────────────────────────────────────
const keys = document.querySelectorAll(".key");

keys.forEach(key => {
  key.addEventListener("click", () => handleKeyClick(key));
});

function handleKeyClick(key) {
  const note = key.dataset.note;

  playNote(note);
  recordNote(note);
  trackNote();
  addXP(XP_PER_NOTE);     // ← gamification

  key.classList.add("active");
  const audio = document.getElementById(note);
  if (audio) {
    audio.addEventListener("ended", () => {
      key.classList.remove("active");
    }, { once: true });
  }
}

// ─── RECORD & PLAYBACK ───────────────────────────────────────
let recording = [];
let isRecording = false;
let recordingStartTime = 0;

function startRecording() {
  recording = [];
  isRecording = true;
  recordingStartTime = Date.now();
  document.getElementById('rec-btn').textContent = '● Recording...';
  document.getElementById('rec-btn').style.color = 'red';
  document.getElementById('status').textContent = '🔴 Recording in progress...';
}

function stopRecording() {
  isRecording = false;
  document.getElementById('rec-btn').textContent = '● Record';
  document.getElementById('rec-btn').style.color = '';
  document.getElementById('status').textContent =
    ` Recorded ${recording.length} note(s). Hit Play to hear it back!`;
}

function recordNote(note) {
  if (!isRecording) return;
  recording.push({
    note: note,
    time: Date.now() - recordingStartTime
  });
}

function playback() {
  if (recording.length === 0) {
    document.getElementById('status').textContent = ' Nothing recorded yet!';
    return;
  }
  document.getElementById('status').textContent = '▶️ Playing back...';
  recording.forEach(entry => {
    setTimeout(() => {
      playNote(entry.note);
      const key = document.querySelector(`[data-note="${entry.note}"]`);
      if (key) {
        key.classList.add("active");
        setTimeout(() => key.classList.remove("active"), 300);
      }
    }, entry.time);
  });
  const lastTime = recording[recording.length - 1].time;
  setTimeout(() => {
    document.getElementById('status').textContent = ' Playback complete!';
  }, lastTime + 500);
}

// ─── ANALYTICS & PROGRESS ────────────────────────────────────
let sessionStart = Date.now();
let sessionNotes = 0;

let analyticsData = JSON.parse(localStorage.getItem('pianoAnalytics')) || {
  totalPracticeTime: 0,
  totalNotes: 0,
  dailyNotes: {},
  sessions: []
};

function trackNote() {
  sessionNotes++;
  analyticsData.totalNotes++;
  const today = new Date().toISOString().split('T')[0];
  analyticsData.dailyNotes[today] = (analyticsData.dailyNotes[today] || 0) + 1;
  saveAnalytics();
  updateStatsPanel();
}

function saveAnalytics() {
  localStorage.setItem('pianoAnalytics', JSON.stringify(analyticsData));
}

function endSession() {
  const duration = Math.floor((Date.now() - sessionStart) / 1000);
  analyticsData.totalPracticeTime += duration;
  analyticsData.sessions.push({
    date: new Date().toISOString(),
    duration: duration,
    notes: sessionNotes
  });
  saveAnalytics();
}

window.addEventListener('beforeunload', endSession);

function updateStatsPanel() {
  const panel = document.getElementById('stats-panel');
  if (!panel) return;
  const totalMins = Math.floor(analyticsData.totalPracticeTime / 60);
  const totalSecs = analyticsData.totalPracticeTime % 60;
  const today = new Date().toISOString().split('T')[0];
  const todayNotes = analyticsData.dailyNotes[today] || 0;
  panel.innerHTML = `
    <div class="stat-box">
      <span class="stat-icon"></span>
      <span class="stat-value">${analyticsData.totalNotes}</span>
      <span class="stat-label">Total Notes</span>
    </div>
    <div class="stat-box">
      <span class="stat-icon"></span>
      <span class="stat-value">${todayNotes}</span>
      <span class="stat-label">Today's Notes</span>
    </div>
    <div class="stat-box">
      <span class="stat-icon"></span>
      <span class="stat-value">${totalMins}m ${totalSecs}s</span>
      <span class="stat-label">Total Practice</span>
    </div>
    <div class="stat-box">
      <span class="stat-icon"></span>
      <span class="stat-value">${analyticsData.sessions.length}</span>
      <span class="stat-label">Sessions</span>
    </div>
  `;
}

function toggleStats() {
  const panel = document.getElementById('stats-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

// ─── GAMIFICATION ─────────────────────────────────────────────
const XP_PER_NOTE = 2;

let gameData = JSON.parse(localStorage.getItem('pianoGame')) || {
  xp: 0,
  level: 1,
  totalXP: 0,
  streak: 0,
  lastPlayedDate: null,
  badges: [],
  challengeProgress: 0,
  challengeCompleted: false
};

const LEVELS = [
  { level: 1,  xpNeeded: 0,    title: "Beginner" },
  { level: 2,  xpNeeded: 100,  title: "Novice" },
  { level: 3,  xpNeeded: 250,  title: "Learner" },
  { level: 4,  xpNeeded: 500,  title: "Practitioner" },
  { level: 5,  xpNeeded: 800,  title: "Intermediate" },
  { level: 6,  xpNeeded: 1200, title: "Skilled" },
  { level: 7,  xpNeeded: 1700, title: "Advanced" },
  { level: 8,  xpNeeded: 2300, title: "Expert" },
  { level: 9,  xpNeeded: 3000, title: "Master" },
  { level: 10, xpNeeded: 4000, title: "Virtuoso" }
];

const DAILY_CHALLENGES = [
  { task: "Play 20 notes today",  goal: 20  },
  { task: "Play 50 notes today",  goal: 50  },
  { task: "Play 100 notes today", goal: 100 },
  { task: "Play 30 notes today",  goal: 30  },
  { task: "Play 75 notes today",  goal: 75  },
];

const BADGES = [
  { id: "first_note",  label: " First Note",  desc: "Play your first note",  condition: (g) => g.totalXP >= 2   },
  { id: "fifty_notes", label: " 50 Notes",    desc: "Play 50 notes total",   condition: (g) => g.totalXP >= 100 },
  { id: "level5",      label: " Level 5",     desc: "Reach Level 5",         condition: (g) => g.level >= 5     },
  { id: "streak3",     label: " 3 Day Streak",desc: "Play 3 days in a row",  condition: (g) => g.streak >= 3    },
  { id: "virtuoso",    label: " Virtuoso",    desc: "Reach Level 10",        condition: (g) => g.level >= 10    },
];

function getDailyChallenge() {
  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[dayIndex];
}

function getCurrentLevel() {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (gameData.totalXP >= LEVELS[i].xpNeeded) {
      current = LEVELS[i];
      break;
    }
  }
  return current;
}

function getNextLevel() {
  const current = getCurrentLevel();
  return LEVELS.find(l => l.level === current.level + 1) || null;
}

function addXP(amount) {
  gameData.xp += amount;
  gameData.totalXP += amount;

  const prevLevel = gameData.level;
  const currentLevel = getCurrentLevel();
  gameData.level = currentLevel.level;

  if (gameData.level > prevLevel) {
    showLevelUpNotification(currentLevel);
  }

  updateStreak();
  updateChallenge();
  checkBadges();
  saveGameData();
  updateHUD();
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  if (gameData.lastPlayedDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (gameData.lastPlayedDate === yesterday) {
    gameData.streak++;
  } else {
    gameData.streak = 1;
  }
  gameData.lastPlayedDate = today;
}

function updateChallenge() {
  if (gameData.challengeCompleted) return;
  const challenge = getDailyChallenge();
  const today = new Date().toISOString().split('T')[0];
  const todayNotes = analyticsData.dailyNotes[today] || 0;
  gameData.challengeProgress = Math.min(todayNotes, challenge.goal);
  if (todayNotes >= challenge.goal) {
    gameData.challengeCompleted = true;
    gameData.totalXP += 50;
    showToast(" Daily Challenge Complete! +50 XP");
  }
}

function checkBadges() {
  BADGES.forEach(badge => {
    if (!gameData.badges.includes(badge.id) && badge.condition(gameData)) {
      gameData.badges.push(badge.id);
      showToast(`${badge.label} Unlocked! — ${badge.desc}`);
    }
  });
}

function showLevelUpNotification(level) {
  showToast(`🎉 Level Up! You are now Level ${level.level} — ${level.title}!`);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function saveGameData() {
  localStorage.setItem('pianoGame', JSON.stringify(gameData));
}

function updateHUD() {
  const level = getCurrentLevel();
  const nextLevel = getNextLevel();
  const challenge = getDailyChallenge();
  const progress = nextLevel
    ? Math.floor(((gameData.totalXP - level.xpNeeded) / (nextLevel.xpNeeded - level.xpNeeded)) * 100)
    : 100;

  document.getElementById('hud-level').textContent = `Level ${gameData.level} — ${level.title}`;
  document.getElementById('hud-xp').textContent = nextLevel
    ? `${gameData.totalXP} XP  (${gameData.totalXP - level.xpNeeded} / ${nextLevel.xpNeeded - level.xpNeeded} to next level)`
    : `${gameData.totalXP} XP — MAX LEVEL `;
  document.getElementById('hud-streak').textContent = ` ${gameData.streak} day streak`;
  document.getElementById('xp-bar-fill').style.width = `${progress}%`;

  const challengePercent = Math.floor((gameData.challengeProgress / challenge.goal) * 100);
  document.getElementById('challenge-text').textContent = gameData.challengeCompleted
    ? ` ${challenge.task} — Done!`
    : ` ${challenge.task}`;
  document.getElementById('challenge-bar-fill').style.width = `${Math.min(challengePercent, 100)}%`;
  document.getElementById('challenge-progress').textContent =
    `${gameData.challengeProgress} / ${challenge.goal}`;

  const badgeContainer = document.getElementById('badge-list');
  badgeContainer.innerHTML = '';
  BADGES.forEach(badge => {
    const el = document.createElement('div');
    el.className = 'badge ' + (gameData.badges.includes(badge.id) ? 'earned' : 'locked');
    el.title = badge.desc;
    el.textContent = gameData.badges.includes(badge.id) ? badge.label : '🔒 ' + badge.desc;
    badgeContainer.appendChild(el);
  });
}

function toggleGamePanel() {
  const panel = document.getElementById('game-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  updateHUD();
}

// ─── INIT ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
  updateStatsPanel();
  updateHUD();
  document.getElementById('stats-panel').style.display = 'none';
  document.getElementById('game-panel').style.display = 'none';
});