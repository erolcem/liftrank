// ════════════════════════════════════════════════════════
// data/metrics.js — All static data definitions
// Add new metrics here. The rest of the app picks them up automatically.
// ════════════════════════════════════════════════════════

export const RANKS = [
  { name: 'Wood',     c: '#9e643a', glow: 'rgba(158,100,58,0.5)'   },
  { name: 'Bronze',   c: '#c28a67', glow: 'rgba(194,138,103,0.5)'  },
  { name: 'Silver',   c: '#b9c6d4', glow: 'rgba(185,198,212,0.5)'  },
  { name: 'Gold',     c: '#f6cf3e', glow: 'rgba(246,207,62,0.6)'   },
  { name: 'Platinum', c: '#4ce0c3', glow: 'rgba(76,224,195,0.65)'  },
  { name: 'Diamond',  c: '#8e8eff', glow: 'rgba(142,142,255,0.65)' },
  { name: 'Champion', c: '#e67be6', glow: 'rgba(230,123,230,0.65)' },
  { name: 'Titan',    c: '#fa3737', glow: 'rgba(250,55,55,0.7)'    },
];

// subranks within each tier (I, II, III), allowing for more rewarding progression. 
export const SUB = ['I', 'II', 'III'];

// Top percentile thresholds per rank tier (Wood→Titan)
// This determines metric standards.
export const TOP_PCT_ARR = [99, 80, 60, 40, 20, 10, 3, 1];

// Rank thresholds per metric — 7 values = Bronze through Titan
// To add a new metric: add an entry here AND in MUSCLES below.
export const THRESH = {
  // ── STRENGTH (kg 1RM via Epley formula)
  chest:      [30,  50,  70,  90,  110, 130, 150],
  shoulders:  [20,  35,  50,  65,  80,  95,  110],
  biceps:     [10,  20,  30,  40,  50,  60,  70 ],
  triceps:    [10,  30,  60,  90,  120, 150, 180],
  forearms:   [5,   15,  25,  35,  45,  55,  65 ],
  lats:       [10,  20,  40,  70,  100, 130, 160],
  traps:      [20,  40,  70,  90,  120, 160, 180],
  abs:        [20,  30,  40,  50,  60,  70,  80 ],
  quads:      [30,  60,  90,  120, 150, 180, 200],
  hamstrings: [20,  50,  80,  110, 140, 170, 190],
  glutes:     [30,  60,  90,  130, 150, 190, 230],
  calves:     [20,  40,  60,  80,  100, 130, 160],

  // ── PERFORMANCE & CNS
  run5k:     [9.0, 11.0, 13.0, 14.0, 15.0, 16.0, 17.0],
  plank:      [60,  120,  180,  240,  300,  360,  420 ],
  vert:       [25,  35,   45,   55,   65,   75,   85 ],
  mobility:   [1,  2,   4,    7,    10,   15,   20  ],

  // ── RECOVERY & CHASSIS
  mass:       [70,  74,  78,  82,  86,  90,  95 ],
  sleep:      [60,  70,  75,  80,  85,  90,  95 ],
  vo2max:     [35,  40,  45,  50,  55,  60,  65 ],
  hrv:        [40,  50,  60,  75,  90,  110, 130],
  cogspeed:   [30,  35,  40,  45,  50,  60,  70 ],

  // ── AESTHETICS & CARE
  skin:       [10,  50,  70,  80,  85,  90,  95 ],
  oral:       [10,  50,  70,  80,  90,  95,  100],
  eye:        [15,  30,  40,  60,  75,  90,  120],
  grooming:   [10,  30,  50,  70,  80,  90,  100],
  hair:       [100, 120, 140, 160, 180, 200, 220],
  voice:      [10,  30,  50,  70,  80,  90,  95],
};

// ── MUSCLE / METRIC DEFINITIONS
// type: undefined = weight+reps strength lift
// type: 'score'   = single numeric score
// cat:  undefined = main strength muscle (shown in bodygraph grid)
// cat:  'perf' | 'body' | 'aes' = holistic dashboard group
export const MUSCLES = [
  // STRENGTH — bodygraph muscles
  { id: 'chest',      label: 'Chest',       measure: 'Estimated 1RM via Epley/Brzycki — log your working sets',       ex: 'Bench Press',           front: ['F-chest-l','F-chest-r'],                                       back: []                                             },
  { id: 'shoulders',  label: 'Shoulders',   measure: 'Estimated 1RM from overhead press sets',   ex: 'Overhead Press',        front: ['F-delt-l','F-delt-r'],                                          back: ['B-delt-l','B-delt-r']                        },
  { id: 'biceps',     label: 'Biceps',      measure: 'Estimated 1RM from barbell curl sets',      ex: 'Barbell Curl',          front: ['F-bi-l','F-bi-r'],                                              back: []                                             },
  { id: 'triceps',    label: 'Triceps',     measure: 'Estimated 1RM from dip sets (add belt weight)',     ex: 'Tricep Dips',           front: [],                                                               back: ['B-tri-l','B-tri-r']                          },
  { id: 'forearms',   label: 'Forearms',    measure: 'Estimated 1RM from reverse curl sets',    ex: 'Reverse Barbell Curl',  front: ['F-fore-l','F-fore-r'],                                          back: ['B-fore-l','B-fore-r']                        },
  { id: 'lats',       label: 'Lats / Back', measure: 'Estimated 1RM from weighted pull-up (bodyweight + load)', ex: 'Weighted Pull-Up',      front: [],                                                               back: ['B-lat-l','B-lat-r','B-midback','B-lower']    },
  { id: 'traps',      label: 'Traps',       measure: 'Estimated 1RM from barbell shrug sets',       ex: 'Barbell Shrug',         front: ['F-traps'],                                                      back: ['B-traps']                                    },
  { id: 'abs',        label: 'Abs',         measure: 'Estimated 1RM from hanging leg raise with added weight',         ex: 'Hanging Leg Raise',     front: ['F-abs'],                                                        back: []                                             },
  { id: 'quads',      label: 'Quads',       measure: 'Estimated 1RM from back squat sets',       ex: 'Barbell Back Squat',    front: ['F-quad-lo','F-quad-li','F-quad-ro','F-quad-ri'],                 back: []                                             },
  { id: 'hamstrings', label: 'Hamstrings',  measure: 'Estimated 1RM from Romanian deadlift sets',  ex: 'Romanian Deadlift',     front: [],                                                               back: ['B-ham-lo','B-ham-li','B-ham-ro','B-ham-ri']  },
  { id: 'glutes',     label: 'Glutes',      measure: 'Estimated 1RM from barbell hip thrust sets',      ex: 'Barbell Hip Thrust',    front: [],                                                               back: ['B-glute-l','B-glute-r']                      },
  { id: 'calves',     label: 'Calves',      measure: 'Estimated 1RM from standing calf raise sets',      ex: 'Standing Calf Raise',   front: ['F-calf-l','F-calf-r'],                                          back: ['B-calf-l','B-calf-r']                        },
  

  // INNER BODYGRAPH — mapped to anatomical shapes on the inner figure
  // inner[] = SVG element IDs on the inner bodygraph
  { id: 'sleep',    label: 'Sleep Arch.',  measure: 'Use Oura / Whoop / Apple Health sleep quality score (0–100)',  ex: 'Clinical Score', front: [], back: [], inner: ['I-brain'],              type: 'score', unit: '/100',  icon: '💤', cat: 'inner' },
  { id: 'hrv',      label: 'HRV',          measure: 'Morning resting HRV in ms — use Polar H10 or Oura ring',          ex: 'CNS Recovery',   front: [], back: [], inner: ['I-heart'],              type: 'score', unit: 'ms',    icon: '❤️', cat: 'inner' },
  { id: 'vo2max',   label: 'VO₂ Max',      measure: 'Lab test or estimated via Apple Watch / Garmin running',      ex: 'Oxygen Engine',  front: [], back: [], inner: ['I-lung-l','I-lung-r'],  type: 'score', unit: 'ml/kg', icon: '🫁', cat: 'inner' },
  { id: 'plank',    label: 'Plank',        measure: 'Max hold in seconds — flat forearm plank to form failure',        ex: 'Max Core Hold',  front: [], back: [], inner: ['I-core'],               type: 'score', unit: 'sec',   icon: '⏱️', cat: 'inner' },
  { id: 'cogspeed', label: 'Reflexes',     measure: '10000 ÷ your reaction time in ms — use humanBenchmark.com',     ex: '10000 / RT(ms)', front: [], back: [], inner: ['I-hand-l','I-hand-r'],  type: 'score', unit: 'pts',   icon: '⚡', cat: 'inner' },
  { id: 'mobility', label: 'Mobility',     measure: 'Sit-and-reach cm past toes — tape measure on floor',     ex: 'cm past toes',   front: [], back: [], inner: ['I-thigh-l','I-thigh-r'],type: 'score', unit: 'cm',    icon: '🤸', cat: 'inner' },
  { id: 'run5k',   label: '5k Run',      measure: 'Average speed km/h over a 5 km run or time trial',      ex: 'Speed km/h',     front: [], back: [], inner: ['I-tibia-l','I-tibia-r'],type: 'score', unit: 'km/h',  icon: '🏃', cat: 'inner' },
  { id: 'vert',     label: 'Vert Jump',    measure: 'Max vertical jump height in cm — chalk mark or jump mat',    ex: 'Max Height',     front: [], back: [], inner: ['I-foot-l','I-foot-r'],  type: 'score', unit: 'cm',    icon: '🚀', cat: 'inner' },
  { id: 'mass',     label: 'Total Mass',   measure: 'Bodyweight in kg — morning fasted, same scale each time',   ex: 'Target: 95kg',   front: [], back: [], inner: ['I-platform'],           type: 'score', unit: 'kg',    icon: '⚖️', cat: 'inner' },

  // AESTHETICS & CARE — icon-only dashboard (no bodygraph shape)
  { id: 'skin',     label: 'Skin Health',  measure: 'AI skin analysis app score or dermatologist rating /100',  ex: 'AI Analysis',    front: [], back: [], inner: [], type: 'score', unit: '/100',  icon: '💧', cat: 'aes'  },
  { id: 'oral',     label: 'Oral Health',  measure: 'Smart toothbrush app score or dentist hygiene rating /100',  ex: 'Smart Brush',    front: [], back: [], inner: [], type: 'score', unit: '/100',  icon: '🦷', cat: 'aes'  },
  { id: 'eye',      label: 'Eye Health',   measure: 'Daily outdoor light exposure minutes — lux meter or app',   ex: 'Lux Mins',       front: [], back: [], inner: [], type: 'score', unit: 'mins',  icon: '👁️', cat: 'aes'  },
  { id: 'grooming', label: 'Grooming',     measure: '% of hair + nail maintenance zones actioned that week',     ex: 'Zone Adherence (hair + nails)', front: [], back: [], inner: [], type: 'score', unit: '%',     icon: '🪒', cat: 'aes'  },
  { id: 'hair',     label: 'Hair Density', measure: 'Trichoscopy count per cm² or dermatologist assessment', ex: 'Hairs per cm²',  front: [], back: [], inner: [], type: 'score', unit: '/cm²',  icon: '💈', cat: 'aes'  },
  { id: 'voice',    label: 'Voice Quality',measure: 'AI voice analysis app score — clarity, resonance, projection', ex: 'AI analysis', front: [], back: [], inner: [], type: 'score', unit: '/100',  icon: '🎤', cat: 'aes'  },
];

// Holistic dashboard category definitions (order matters for display)
// 'inner' metrics appear on the inner bodygraph AND as icon tiles below it
// 'aes'   metrics appear as icon tiles only (no bodygraph shape)
export const HOL_CATEGORIES = [
  { id: 'inner', name: 'Performance & Recovery' },
  { id: 'aes',   name: 'Aesthetics & Armor'     },
];