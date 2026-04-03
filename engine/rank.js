// ════════════════════════════════════════════════════════
// engine/rank.js — Pure rank calculation engine
// No DOM access. No side effects. All functions are deterministic.
// ════════════════════════════════════════════════════════

import { RANKS, THRESH, MUSCLES, TOP_PCT_ARR, SUB } from '../data/metrics.js';


export function epley(weight, reps) {
  // Guard clauses for edge cases
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;

  // Cap reps at 15: prevents Brzycki's divide-by-zero and keeps estimates realistic
  const effectiveReps = Math.min(reps, 15);

  // 1. Epley: Standard and aggressive
  const epley1 = weight * (1 + effectiveReps / 30);
  
  // 2. Brzycki: More conservative, highly accurate for low reps
  const brzycki = weight / (1.0278 - 0.0278 * effectiveReps);
  
  // 3. Lander: A different linear regression often used as a middle ground
  const lander = (100 * weight) / (101.3 - 2.67123 * effectiveReps);

  // Calculate the average
  const average = (epley1 + brzycki + lander) / 3;
  
  // Return rounded to 2 decimal places (e.g., 135.50)
  return Math.round(average * 100) / 100; 
}


// ── RANK LOOKUP
export function rankOf(mid, orm) {
  const t = THRESH[mid] || [];
  let r = 0;
  t.forEach((v, i) => { if (orm >= v) r = i + 1; });
  return Math.min(r, 7);
}

export function getSubrank(mid, orm) {
  const rank = rankOf(mid, orm);
  const t = THRESH[mid] || [];
  const cur = rank > 0 ? t[rank - 1] : 0;
  const nxt = rank < 7 ? t[rank] : (t[t.length - 1] || 1);
  if (rank === 0) { const p = (orm / (nxt || 1)) * 100; return p < 33 ? 0 : p < 66 ? 1 : 2; }
  if (rank >= 7) return 2;
  const p = ((orm - cur) / (nxt - cur)) * 100;
  return p < 33 ? 0 : p < 66 ? 1 : 2;
}

// ── CONTINUOUS RANK FRACTION (0–1 within current tier)
// Linear interpolation between the two surrounding threshold weights.
// Used by overallScore and progress charts — ensures they are always consistent.
export function preciseFraction(mid, orm) {
  const t    = THRESH[mid] || [];
  const rank = rankOf(mid, orm);
  if (!orm || orm <= 0) return 0;
  if (rank >= 7) return 1;            // capped at tier top
  const lo   = rank > 0 ? t[rank - 1] : 0;
  const hi   = t[rank] ?? lo + 1;
  return Math.max(0, Math.min(1, (orm - lo) / Math.max(hi - lo, 1)));
}

// ── PRECISE RANK VALUE — rank + continuous fraction (e.g. 3.742)
// This is the canonical value used by both overallScore and the progress charts.
export function preciseRankValue(mid, orm) {
  const rank = rankOf(mid, orm);
  if (!orm || orm <= 0) return 0;
  const t = THRESH[mid] || [];
  if (rank >= 7) {
    const maxT = t[t.length - 1] || 1;
    return Math.min(7.5, 7 + (orm - maxT) / Math.max(maxT * 0.1, 1));
  }
  return +(rank + preciseFraction(mid, orm)).toFixed(4);
}

export function getProgress(mid, orm) {
  const rank = rankOf(mid, orm);
  const t = THRESH[mid] || [];
  const cur = rank > 0 ? t[rank - 1] : 0;
  const nxt = rank < 7 ? t[rank] : (t[t.length - 1] || 1);
  const span = Math.max(nxt - cur, 1);
  const pct = rank >= 7 ? 100 : Math.max(0, Math.min(100, ((orm - cur) / span) * 100));
  return {
    orm, rank, cur, nxt, pct,
    m1: +(cur + span * 0.333).toFixed(1),
    m2: +(cur + span * 0.666).toFixed(1),
  };
}

export function overallScore(logs) {
  const scores = MUSCLES.map(m => preciseRankValue(m.id, latestORM(m.id, logs)));
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ── LATEST ORM HELPER
export function latestORM(mid, logs) {
  const e = logs[mid];
  return (e && e.length) ? e[e.length - 1].oneRM : 0;
}

// ── PRECISE PERCENTILE INTERPOLATION
export function getPrecisePercent(mid, orm) {
  if (!orm || orm <= 0) return '99.9';
  const rank = rankOf(mid, orm);
  const t = THRESH[mid] || [];
  if (rank >= 7) {
    const maxThresh = t[t.length - 1];
    const over = orm - maxThresh;
    return Math.max(0.01, 1 - (over * 0.05)).toFixed(2);
  }
  const curW = rank > 0 ? t[rank - 1] : 0;
  const nxtW = t[rank] || 1;
  const curP = rank > 0 ? TOP_PCT_ARR[rank] : 99;
  const nxtP = TOP_PCT_ARR[rank + 1];
  const fraction = (orm - curW) / (nxtW - curW);
  return (curP - (fraction * (curP - nxtP))).toFixed(1);
}

export function getPrecisePercentOverall(score) {
  const baseRank = Math.floor(score);
  if (baseRank >= 7) return '1.0';
  const fraction = score % 1;
  const curP = TOP_PCT_ARR[baseRank];
  const nxtP = TOP_PCT_ARR[baseRank + 1];
  return (curP - (fraction * (curP - nxtP))).toFixed(1);
}

// ── DATE PARSING (en-AU format: "02 Apr 25")
export function parseDate(str) {
  const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
  const p = str.split(' ');
  if (p.length < 3) return new Date();
  return new Date(2000 + parseInt(p[2]), months[p[1]] || 0, parseInt(p[0]));
}

// ── DISPLAY FORMATTING
export function formatScore(mid, val, unit) {
  if (!val && val !== 0) return '—';
  const m = MUSCLES.find(x => x.id === mid);
  if (m && m.type === 'score') return val.toFixed(1) + ' ' + m.unit;
  return val.toFixed(1) + ' ' + (unit || 'kg');
}

// ── SUB-RANK STRING HELPER
export function subLabel(mid, orm) {
  return SUB[getSubrank(mid, orm)];
}

// ── RANK COLOR HELPERS (reads from RANKS, no DOM)
export function rankColor(mid, logs) {
  return RANKS[rankOf(mid, latestORM(mid, logs))].c;
}

export function rankGlow(mid, logs) {
  return RANKS[rankOf(mid, latestORM(mid, logs))].glow;
}