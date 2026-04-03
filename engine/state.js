// ════════════════════════════════════════════════════════
// engine/state.js — Centralised app state + pub/sub event bus
// UI modules listen for events rather than calling each other directly.
// ════════════════════════════════════════════════════════

import { loadLogs, loadSettings, saveLogs, saveSettings, loadHabits, saveHabits } from './storage.js';

// ── INTERNAL STATE (module-private)
let _logs     = loadLogs();
let _settings = loadSettings();
let _habits   = loadHabits();
let _curScreen = 'body';
let _sheetMid  = null;
let _logMid    = null;
let _rhSelected = ['overall'];
let _ormMid    = 'chest';

// ── MINIMAL PUB/SUB EVENT BUS
const _listeners = {};

export function on(event, fn) {
  if (!_listeners[event]) _listeners[event] = [];
  _listeners[event].push(fn);
}

export function off(event, fn) {
  if (!_listeners[event]) return;
  _listeners[event] = _listeners[event].filter(f => f !== fn);
}

function emit(event, detail) {
  (_listeners[event] || []).forEach(fn => fn(detail));
}

// ── GETTERS
export function getLogs()     { return _logs; }
export function getSettings() { return _settings; }
export function getCurScreen(){ return _curScreen; }
export function getSheetMid() { return _sheetMid; }
export function getLogMid()   { return _logMid; }
export function getRHSelected(){ return _rhSelected; }
export function getORMMid()   { return _ormMid; }
export function getHabits()   { return _habits; }

// ── LOG MUTATIONS
export function addLog(mid, entry) {
  if (!_logs[mid]) _logs[mid] = [];
  _logs[mid].push(entry);
  const saved = saveLogs(_logs);
  emit('logs:changed', { mid, logs: _logs });
  return saved;
}

export function deleteLog(mid, idx) {
  if (!_logs[mid]) return;
  _logs[mid].splice(idx, 1);
  if (!_logs[mid].length) delete _logs[mid];
  saveLogs(_logs);
  emit('logs:changed', { mid, logs: _logs });
}

export function importLogs(newLogs, newSettings) {
  _logs = newLogs;
  _settings = newSettings;
  saveLogs(_logs);
  saveSettings(_settings);
  emit('logs:changed', { logs: _logs });
  emit('settings:changed', { settings: _settings });
}

export function clearLogs() {
  _logs = {};
  saveLogs(_logs);
  emit('logs:changed', { logs: _logs });
}

// ── SETTINGS MUTATIONS
export function setUnit(unit) {
  _settings = { ..._settings, unit };
  saveSettings(_settings);
  emit('settings:changed', { settings: _settings });
}

// ── NAVIGATION
export function goTo(screen) {
  _curScreen = screen;
  emit('nav:changed', { screen });
}

// ── SHEET STATE
export function setSheetMid(mid) {
  _sheetMid = mid;
  emit('sheet:changed', { mid });
}

// ── LOG SCREEN STATE
export function setLogMid(mid) {
  _logMid = mid;
  emit('logMid:changed', { mid });
}

// ── PROGRESS SCREEN STATE
export function setRHSelected(ids) {
  _rhSelected = ids;
  emit('rh:changed', { ids });
}

export function setORMMid(mid) {
  _ormMid = mid;
  emit('orm:changed', { mid });
}

// ── HABIT MUTATIONS
function _uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function addHabit(section, habit) {
  if (!_habits[section]) _habits[section] = [];
  _habits[section].push({ ...habit, id: _uid() });
  saveHabits(_habits);
  emit('habits:changed', { habits: _habits });
}

export function updateHabit(section, id, updates) {
  if (!_habits[section]) return;
  const idx = _habits[section].findIndex(h => h.id === id);
  if (idx === -1) return;
  _habits[section][idx] = { ..._habits[section][idx], ...updates };
  saveHabits(_habits);
  emit('habits:changed', { habits: _habits });
}

export function deleteHabit(section, id) {
  if (!_habits[section]) return;
  _habits[section] = _habits[section].filter(h => h.id !== id);
  saveHabits(_habits);
  emit('habits:changed', { habits: _habits });
}
export function importHabitsData(newHabits) {
  _habits = { daily: [], weekly: [], monthly: [], ...newHabits };
  saveHabits(_habits);
  emit('habits:changed', { habits: _habits });
}