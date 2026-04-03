// ════════════════════════════════════════════════════════
// engine/storage.js — All localStorage I/O with error handling
// Never call localStorage directly from UI modules — always go through here.
// ════════════════════════════════════════════════════════

const LOGS_KEY     = 'liftrank-logs';
const SETTINGS_KEY = 'liftrank-settings';
const HABITS_KEY   = 'liftrank-habits';

const DEFAULT_SETTINGS = { unit: 'kg' };
const DEFAULT_HABITS   = { daily: [], weekly: [], monthly: [] };

// ── LOAD (safe — returns defaults if missing/corrupt)
export function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '{}');
  } catch {
    console.warn('[LiftRank] Could not parse logs, resetting.');
    return {};
  }
}

export function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function loadHabits() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HABITS_KEY) || '{}');
    return { ...DEFAULT_HABITS, ...parsed };
  } catch {
    return { ...DEFAULT_HABITS };
  }
}

// ── SAVE (protected against QuotaExceededError)
export function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      window.dispatchEvent(new CustomEvent('liftrank:quota', {
        detail: { bytes: JSON.stringify(logs).length }
      }));
    } else {
      console.error('[LiftRank] Save failed:', e);
    }
    return false;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return true;
  } catch {
    return false;
  }
}

// ── EXPORT (triggers browser download)
export function exportData(logs, settings, habits) {
  const payload = JSON.stringify({ logs, settings, habits: habits || {}, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `liftrank-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── IMPORT (returns { logs, settings } or throws)
export function parseImport(jsonText) {
  const data = JSON.parse(jsonText);
  if (!data.logs || typeof data.logs !== 'object') {
    throw new Error('Invalid LiftRank backup: missing logs object.');
  }
  return {
    logs: data.logs,
    settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
    habits: data.habits || null,
  };
}

// ── STORAGE USAGE ESTIMATE (returns human-readable string)
export function storageUsage() {
  try {
    const bytes = (localStorage.getItem(LOGS_KEY) || '').length
                + (localStorage.getItem(SETTINGS_KEY) || '').length
                + (localStorage.getItem(HABITS_KEY) || '').length;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } catch {
    return 'unknown';
  }
}

// ── CLEAR ALL DATA
export function clearAllData() {
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(HABITS_KEY);
}