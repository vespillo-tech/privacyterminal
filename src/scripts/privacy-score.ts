/**
 * Privacy Terminal — Client-side progress & scoring library
 * Manages session state, syncs with backend, falls back to localStorage
 * Game data (achievements, levels, config) is loaded from the DOM at runtime
 * via the #pt-game-data <script type="application/json"> element injected by BaseLayout.
 */

const PROGRESS_KEY  = 'pt_progress';
const HASH_COUNT_KEY = 'pt_hash_count';

// ── Types ──────────────────────────────────────────────────────

export interface ProgressData {
  user_id?: string;
  score: number;
  level: number;
  level_name: string;
  guides_completed: string[];
  tools_used: string[];
  achievements_unlocked: string[];
  threat_profile?: ThreatProfileData;
}

export interface ThreatProfileData {
  answers: Record<string, unknown>;
  risk_scores: Record<string, number>;
  completed_at: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  points: number;
}

interface LevelDef {
  level: number;
  name: string;
  min: number;
  max: number;
}

interface GameData {
  achievements: Record<string, AchievementDef>;
  levels: LevelDef[];
  guidePoints: number;
  toolPoints: number;
  apiBase: string;
}

// ── Game Data Loader (reads from DOM, injected by BaseLayout at build time) ──

let _gameData: GameData | null = null;

function getGameData(): GameData {
  if (_gameData) return _gameData;
  try {
    const el = typeof document !== 'undefined'
      ? document.getElementById('pt-game-data')
      : null;
    if (el?.textContent) {
      _gameData = JSON.parse(el.textContent) as GameData;
      return _gameData;
    }
  } catch { /* fall through to defaults */ }
  // Fallback defaults — only reached if DOM element is missing
  _gameData = {
    achievements: {
      FIRST_BOOT:          { id: 'FIRST_BOOT',          name: 'FIRST BOOT',          icon: '[*]', description: 'Welcome to Privacy Terminal',        points: 10 },
      FIRST_SCAN:          { id: 'FIRST_SCAN',          name: 'FIRST SCAN',          icon: '[~]', description: 'Ran your first fingerprint analysis', points: 30 },
      HASH_MASTER:         { id: 'HASH_MASTER',         name: 'HASH MASTER',         icon: '[#]', description: 'Generated 10 hashes',                points: 25 },
      THREAT_ASSESSED:     { id: 'THREAT_ASSESSED',     name: 'THREAT ASSESSED',     icon: '[!]', description: 'Completed the threat profiler',      points: 50 },
      FOUNDATION_COMPLETE: { id: 'FOUNDATION_COMPLETE', name: 'FOUNDATION COMPLETE', icon: '[=]', description: 'Read all foundations guides',        points: 40 },
      ESSENTIALS_COMPLETE: { id: 'ESSENTIALS_COMPLETE', name: 'ESSENTIALS COMPLETE', icon: '[v]', description: 'Read all essentials guides',         points: 40 },
      FULL_AUDIT:          { id: 'FULL_AUDIT',          name: 'FULL AUDIT',          icon: '[S]', description: 'Used every tool at least once',      points: 60 },
      SPEED_RUN:           { id: 'SPEED_RUN',           name: 'SPEED RUN',           icon: '[>]', description: 'Completed the 5-Min Checkup',        points: 20 },
    },
    levels: [
      { level: 1, name: 'NEWBIE',   min: 0,    max: 99   },
      { level: 2, name: 'AWARE',    min: 100,  max: 249  },
      { level: 3, name: 'CAUTIOUS', min: 250,  max: 499  },
      { level: 4, name: 'HARDENED', min: 500,  max: 999  },
      { level: 5, name: 'GHOST',    min: 1000, max: 9999 },
    ],
    guidePoints: 15,
    toolPoints: 10,
    apiBase: 'https://privacyterminal-api.terinmain.workers.dev',
  };
  return _gameData;
}

/**
 * Returns the achievements map. Use this instead of importing ACHIEVEMENTS directly.
 * Data is sourced from the pt-game-data DOM element (injected by BaseLayout).
 */
export function getAchievements(): Record<string, AchievementDef> {
  return getGameData().achievements;
}

/**
 * @deprecated Use getAchievements() instead.
 * Kept for backward compatibility — reads from DOM-sourced game data.
 */
export const ACHIEVEMENTS: Record<string, AchievementDef> = new Proxy(
  {} as Record<string, AchievementDef>,
  {
    get(_target, prop: string) { return getGameData().achievements[prop]; },
    has(_target, prop: string) { return prop in getGameData().achievements; },
    ownKeys()                  { return Object.keys(getGameData().achievements); },
    getOwnPropertyDescriptor(_target, prop: string) {
      const v = getGameData().achievements[prop];
      return v ? { value: v, enumerable: true, configurable: true, writable: false } : undefined;
    },
  }
);

// ── Helpers ─────────────────────────────────────────────────────

export function getLevelInfo(score: number) {
  const levels = getGameData().levels;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i].min) return { ...levels[i] };
  }
  return { ...levels[0] };
}

export function buildProgressBar(score: number, blocks = 12): string {
  const lvl    = getLevelInfo(score);
  const range  = lvl.max - lvl.min;
  const pct    = range > 0 ? Math.min((score - lvl.min) / range, 1) : 1;
  const filled = Math.round(pct * blocks);
  return '█'.repeat(filled) + '░'.repeat(blocks - filled);
}

function defaultProgress(): ProgressData {
  return {
    score: 0,
    level: 1,
    level_name: 'NEWBIE',
    guides_completed: [],
    tools_used: [],
    achievements_unlocked: [],
  };
}

// ── Auth (removed — was client-only simulation with no backend) ─

// ── Progress Cache ─────────────────────────────────────────────

export function getCachedProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch { /* ignore */ }
  return defaultProgress();
}

function setCachedProgress(data: ProgressData): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    dispatchProgressUpdate(data);
  } catch { /* ignore */ }
}

// ── Events ────────────────────────────────────────────────────

function dispatchProgressUpdate(data: ProgressData): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pt:progress', { detail: data }));
  }
}

export function dispatchAchievement(achievementId: string): void {
  const ach = getGameData().achievements[achievementId];
  if (ach && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pt:achievement', { detail: ach }));
  }
}

// ── Server Sync (removed — all progress is client-side) ───────
// getProgress() was removed to eliminate duplication with gamification.ts.
// Use getCachedProgress() for synchronous access to progress data.

// ── Score Calculation ──────────────────────────────────────────

function recalcScore(p: ProgressData): ProgressData {
  const { achievements, guidePoints, toolPoints } = getGameData();
  let score = 0;
  score += p.guides_completed.length * guidePoints;
  score += p.tools_used.length       * toolPoints;
  for (const id of p.achievements_unlocked) {
    score += achievements[id]?.points ?? 0;
  }
  const lvl = getLevelInfo(score);
  return { ...p, score, level: lvl.level, level_name: lvl.name };
}

// ── Core Actions ──────────────────────────────────────────────

export async function completeGuide(guideId: string): Promise<void> {
  const p = getCachedProgress();
  if (p.guides_completed.includes(guideId)) return;
  p.guides_completed.push(guideId);
  setCachedProgress(recalcScore(p));

  // Check guide-based achievements
  try {
    const { RECON_GUIDES, HARDENING_GUIDES } = await import('./gamification');
    const completed = p.guides_completed;

    // FOUNDATION_COMPLETE: all recon guides done
    if (RECON_GUIDES.every((g: string) => completed.includes(g))) {
      await unlockAchievement('FOUNDATION_COMPLETE');
    }

    // ESSENTIALS_COMPLETE: all hardening guides done
    if (HARDENING_GUIDES.every((g: string) => completed.includes(g))) {
      await unlockAchievement('ESSENTIALS_COMPLETE');
    }

    // SPEED_RUN: completed the 5-minute privacy checkup
    if (guideId === 'the-5-minute-privacy-checkup') {
      await unlockAchievement('SPEED_RUN');
    }
  } catch { /* gamification optional */ }
}

export async function trackTool(toolId: string): Promise<void> {
  const p = getCachedProgress();
  if (p.tools_used.includes(toolId)) return;
  p.tools_used.push(toolId);
  setCachedProgress(recalcScore(p));

  // Check tool-based achievements
  try {
    const { ALL_TOOLS } = await import('./gamification');
    // FULL_AUDIT: all tools used
    if (ALL_TOOLS.every((t: string) => p.tools_used.includes(t))) {
      await unlockAchievement('FULL_AUDIT');
    }
  } catch { /* gamification optional */ }
}

export async function unlockAchievement(achievementId: string): Promise<void> {
  if (!getGameData().achievements[achievementId]) return;
  const p = getCachedProgress();
  if (p.achievements_unlocked.includes(achievementId)) return;
  p.achievements_unlocked.push(achievementId);
  setCachedProgress(recalcScore(p));
  dispatchAchievement(achievementId);
  // Progress saved to localStorage automatically
}

export async function saveThreatProfile(data: ThreatProfileData): Promise<void> {
  const p = getCachedProgress();
  p.threat_profile = data;
  setCachedProgress(p);
  // Progress saved to localStorage automatically
}

export function incrementHashCount(): number {
  try {
    const n = parseInt(localStorage.getItem(HASH_COUNT_KEY) ?? '0', 10) + 1;
    localStorage.setItem(HASH_COUNT_KEY, String(n));
    if (n >= 10) unlockAchievement('HASH_MASTER').catch(() => {});
    return n;
  } catch { return 0; }
}

// ── Init ──────────────────────────────────────────────────────

export function initPrivacyScore(): void {
  if (typeof window === 'undefined') return;
  const p = getCachedProgress();
  dispatchProgressUpdate(p);

  // FIRST_BOOT: trigger on very first visit (no progress saved yet)
  try {
    if (!localStorage.getItem(PROGRESS_KEY)) {
      unlockAchievement('FIRST_BOOT').catch(() => {});
    }
  } catch { /* ignore */ }
}
