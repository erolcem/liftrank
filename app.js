// ════════════════════════════════════════════════════════
// app.js — Application entry point
// Wires modules together, sets up navigation, handles PWA install.
// This is the only file that touches both engine and UI layers.
// ════════════════════════════════════════════════════════

import { RANKS, MUSCLES, THRESH, TOP_PCT_ARR, SUB } from './data/metrics.js';
import { on, getLogs, getSettings, goTo, getCurScreen } from './engine/state.js';
import { renderBody, applyColors } from './ui/bodygraph.js';
import { renderProgress } from './ui/progress.js';
import { renderProfile, setUnitFromProfile, exportDataFromProfile, clearDataFromProfile, handleImportFile } from './ui/profile.js';
import { openSheet, closeSheet, sheetBackdropClick, sheetLog, deleteLogFromSheet } from './ui/sheet.js';
import { showToast } from './ui/toast.js';
import { renderHabits, openAddHabit, editHabit, deleteHabitUI, saveHabitForm, closeHabitModal, toggleDay, toggleHabitDetail } from './ui/habits.js';

// ── EXPOSE GLOBAL LR NAMESPACE
window.LR = {
  goTo,
  openSheet,
  closeSheet,
  sheetBackdropClick,
  sheetLog,
  deleteLogFromSheet,
  setUnitFromProfile,
  exportDataFromProfile,
  clearDataFromProfile,
  handleImportFile,
  installApp,
  // Habits
  openAddHabit,
  editHabit,
  deleteHabitUI,
  saveHabitForm,
  closeHabitModal,
  toggleDay,
  toggleHabitDetail,
};

window.__LR__ = { RANKS, MUSCLES, THRESH, TOP_PCT_ARR, SUB };

// ── NAVIGATION
function _activateScreen(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + screen)?.classList.add('active');
  document.getElementById('nav-' + screen)?.classList.add('active');
  switch (screen) {
    case 'body':     renderBody();     break;
    case 'progress': renderProgress(); break;
    case 'profile':  renderProfile();  break;
    case 'habits':   renderHabits();   break;
  }
}

// ── REACT TO STATE CHANGES
on('nav:changed', ({ screen }) => _activateScreen(screen));

on('logs:changed', () => {
  const screen = getCurScreen();
  applyColors(getLogs());
  if (screen !== 'body') renderBody();
  _activateScreen(screen);
});

on('settings:changed', () => {
  const screen = getCurScreen();
  if (screen === 'profile') renderProfile();
});

// Quota exceeded warning
window.addEventListener('liftrank:quota', ({ detail }) => {
  showToast(`⚠️ Storage nearly full (${(detail.bytes / 1024).toFixed(0)} KB) — export a backup!`, '#f0622a');
});

// ── PWA INSTALL
let _installPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _installPrompt = e;
  document.getElementById('install-btn')?.classList.add('show');
});

function installApp() {
  if (!_installPrompt) return;
  _installPrompt.prompt();
  _installPrompt.userChoice.then(r => {
    if (r.outcome === 'accepted') document.getElementById('install-btn')?.classList.remove('show');
    _installPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  document.getElementById('install-btn')?.classList.remove('show');
  showToast('✓ LiftRank installed!', '#3dd6c0');
});

// ── SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ── BOOT
renderBody();