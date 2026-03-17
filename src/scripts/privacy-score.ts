/**
 * Privacy Terminal — Client-side progress & scoring library
 * Manages session state, syncs with backend, falls back to localStorage
 * Game data (achievements, levels, config) is loaded from the DOM at runtime
 * via the #pt-game-data <script type="application/json"> element injected by BaseLayout.
 */

const SESSION_KEY   = 'pt_session';
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
    apiBase: 'https://privacyterminal-api.workers.dev',
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

// ── Session ────────────────────────────────────────────────────

export function isLoggedIn(): boolean {
  try { return !!localStorage.getItem(SESSION_KEY); } catch { return false; }
}

export function getToken(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}

export function logout(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    dispatchProgressUpdate(getCachedProgress());
  } catch { /* ignore */ }
}

// ── Auth API ────────────────────────────────────────────────────

export async function register(): Promise<{ user_id: string; recovery_code: string }> {
  // Fully client-side registration — no API needed
  const words = ['ALPHA','BRAVO','CHARLIE','DELTA','ECHO','FOXTROT','GOLF','HOTEL',
    'INDIA','JULIET','KILO','LIMA','MIKE','NOVEMBER','OSCAR','PAPA','QUEBEC',
    'ROMEO','SIERRA','TANGO','UNIFORM','VICTOR','WHISKEY','XRAY','YANKEE','ZULU',
    'CIPHER','GHOST','PROXY','ONION','SHIELD','VAULT','PIXEL','EMBER','FROST',
    'NEXUS','DRIFT','HAVEN','PRISM','SPARK','PULSE','FLARE','STORM','BLADE'];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  const num = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const recovery_code = `${pick()}-${pick()}-${pick()}-${num}`;

  // Generate user_id and session token
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  const user_id = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  const sessArr = new Uint8Array(32);
  crypto.getRandomValues(sessArr);
  const session_token = Array.from(sessArr).map(b => b.toString(16).padStart(2, '0')).join('');

  // Hash the recovery code for storage (so we can verify on login)
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(recovery_code));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const codeHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  try {
    localStorage.setItem(SESSION_KEY, session_token);
    localStorage.setItem('pt_user_id', user_id);
    localStorage.setItem('pt_code_hash', codeHash);
  } catch { /* ignore */ }
  return { user_id, recovery_code };
}

export async function login(code: string): Promise<boolean> {
  // Fully client-side login — verify recovery code against stored hash
  try {
    const storedHash = localStorage.getItem('pt_code_hash');
    if (!storedHash) return false;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(code.trim().toUpperCase()));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    if (inputHash !== storedHash) return false;
    // Restore session
    const sessArr = new Uint8Array(32);
    crypto.getRandomValues(sessArr);
    const session_token = Array.from(sessArr).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(SESSION_KEY, session_token);
    dispatchProgressUpdate(getCachedProgress());
    return true;
  } catch { return false; }
}

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

// ── Server Sync ────────────────────────────────────────────────

export async function getProgress(): Promise<ProgressData> {
  if (!isLoggedIn()) return getCachedProgress();
  return refreshProgress();
}

async function refreshProgress(): Promise<ProgressData> {
  // All progress is local — just return cached data
  return getCachedProgress();
}

async function syncLocalToServer(): Promise<void> {
  // No-op: all data is stored client-side in localStorage
}

// No external API calls — all progress is stored client-side in localStorage

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
  // Progress saved to localStorage automatically
}

export async function trackTool(toolId: string): Promise<void> {
  const p = getCachedProgress();
  if (p.tools_used.includes(toolId)) return;
  p.tools_used.push(toolId);
  setCachedProgress(recalcScore(p));
  // Progress saved to localStorage automatically
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
  dispatchProgressUpdate(getCachedProgress());
}
