/**
 * Privacy Terminal — Client-side progress & scoring library
 * Manages session state, syncs with backend, falls back to localStorage
 */

const API_BASE = 'https://privacyterminal-api.workers.dev';
const SESSION_KEY = 'pt_session';
const PROGRESS_KEY = 'pt_progress';
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

// ── Achievement Definitions ────────────────────────────────────

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  FIRST_BOOT:          { id: 'FIRST_BOOT',          name: 'FIRST BOOT',          icon: '[*]', description: 'Welcome to Privacy Terminal',           points: 10 },
  FIRST_SCAN:          { id: 'FIRST_SCAN',          name: 'FIRST SCAN',          icon: '[~]', description: 'Ran your first fingerprint analysis',    points: 30 },
  HASH_MASTER:         { id: 'HASH_MASTER',         name: 'HASH MASTER',         icon: '[#]', description: 'Generated 10 hashes',                    points: 25 },
  THREAT_ASSESSED:     { id: 'THREAT_ASSESSED',     name: 'THREAT ASSESSED',     icon: '[!]', description: 'Completed the threat profiler',           points: 50 },
  FOUNDATION_COMPLETE: { id: 'FOUNDATION_COMPLETE', name: 'FOUNDATION COMPLETE', icon: '[=]', description: 'Read all foundations guides',            points: 40 },
  ESSENTIALS_COMPLETE: { id: 'ESSENTIALS_COMPLETE', name: 'ESSENTIALS COMPLETE', icon: '[v]', description: 'Read all essentials guides',              points: 40 },
  FULL_AUDIT:          { id: 'FULL_AUDIT',          name: 'FULL AUDIT',          icon: '[S]', description: 'Used every tool at least once',           points: 60 },
  SPEED_RUN:           { id: 'SPEED_RUN',           name: 'SPEED RUN',           icon: '[>]', description: 'Completed the 5-Min Checkup',             points: 20 },
};

// ── Level Definitions ────────────────────────────────────────────

const LEVELS = [
  { level: 1, name: 'NEWBIE',   min: 0,    max: 99   },
  { level: 2, name: 'AWARE',    min: 100,  max: 249  },
  { level: 3, name: 'CAUTIOUS', min: 250,  max: 499  },
  { level: 4, name: 'HARDENED', min: 500,  max: 999  },
  { level: 5, name: 'GHOST',    min: 1000, max: 9999 },
];

const GUIDE_POINTS = 15;
const TOOL_POINTS  = 10;

// ── Helpers ─────────────────────────────────────────────────────

export function getLevelInfo(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return { ...LEVELS[i] };
  }
  return { ...LEVELS[0] };
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

// ── Session ───────────────────────────────────────────────────

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

// ── Auth API ────────────────────────────────────────────────

export async function register(): Promise<{ user_id: string; recovery_code: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Registration failed' })) as { error?: string };
    throw new Error(err.error ?? 'Registration failed');
  }
  const data = await res.json() as { user_id: string; recovery_code: string; session_token: string };
  try {
    localStorage.setItem(SESSION_KEY, data.session_token);
    syncLocalToServer().catch(() => {});
  } catch { /* ignore */ }
  return { user_id: data.user_id, recovery_code: data.recovery_code };
}

export async function login(code: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recovery_code: code.trim().toUpperCase() }),
    });
    if (!res.ok) return false;
    const data = await res.json() as { session_token: string };
    localStorage.setItem(SESSION_KEY, data.session_token);
    await refreshProgress();
    return true;
  } catch { return false; }
}

// ── Progress Cache ─────────────────────────────────────────

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

// ── Events ───────────────────────────────────────────────────

function dispatchProgressUpdate(data: ProgressData): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pt:progress', { detail: data }));
  }
}

export function dispatchAchievement(achievementId: string): void {
  const ach = ACHIEVEMENTS[achievementId];
  if (ach && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pt:achievement', { detail: ach }));
  }
}

// ── Server Sync ──────────────────────────────────────────────

export async function getProgress(): Promise<ProgressData> {
  if (!isLoggedIn()) return getCachedProgress();
  return refreshProgress();
}

async function refreshProgress(): Promise<ProgressData> {
  const token = getToken();
  if (!token) return getCachedProgress();
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return getCachedProgress();
    const data = await res.json() as ProgressData;
    const lvl = getLevelInfo(data.score);
    data.level      = lvl.level;
    data.level_name = lvl.name;
    setCachedProgress(data);
    return data;
  } catch { return getCachedProgress(); }
}

async function syncLocalToServer(): Promise<void> {
  const local = getCachedProgress();
  for (const guide of local.guides_completed) {
    await apiPost('/progress/guide', { guide_id: guide }).catch(() => {});
  }
  for (const tool of local.tools_used) {
    await apiPost('/progress/tool', { tool_id: tool }).catch(() => {});
  }
  for (const ach of local.achievements_unlocked) {
    await apiPost('/progress/achievement', { achievement_id: ach }).catch(() => {});
  }
}

async function apiPost(path: string, body: Record<string, unknown>): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

// ── Score Calculation ────────────────────────────────────────

function recalcScore(p: ProgressData): ProgressData {
  let score = 0;
  score += p.guides_completed.length   * GUIDE_POINTS;
  score += p.tools_used.length         * TOOL_POINTS;
  for (const id of p.achievements_unlocked) {
    score += ACHIEVEMENTS[id]?.points ?? 0;
  }
  const lvl = getLevelInfo(score);
  return { ...p, score, level: lvl.level, level_name: lvl.name };
}

// ── Core Actions ─────────────────────────────────────────────

export async function completeGuide(guideId: string): Promise<void> {
  const p = getCachedProgress();
  if (p.guides_completed.includes(guideId)) return;
  p.guides_completed.push(guideId);
  setCachedProgress(recalcScore(p));
  if (isLoggedIn()) apiPost('/progress/guide', { guide_id: guideId }).catch(() => {});
}

export async function trackTool(toolId: string): Promise<void> {
  const p = getCachedProgress();
  if (p.tools_used.includes(toolId)) return;
  p.tools_used.push(toolId);
  setCachedProgress(recalcScore(p));
  if (isLoggedIn()) apiPost('/progress/tool', { tool_id: toolId }).catch(() => {});
}

export async function unlockAchievement(achievementId: string): Promise<void> {
  if (!ACHIEVEMENTS[achievementId]) return;
  const p = getCachedProgress();
  if (p.achievements_unlocked.includes(achievementId)) return;
  p.achievements_unlocked.push(achievementId);
  setCachedProgress(recalcScore(p));
  dispatchAchievement(achievementId);
  if (isLoggedIn()) apiPost('/progress/achievement', { achievement_id: achievementId }).catch(() => {});
}

export async function saveThreatProfile(data: ThreatProfileData): Promise<void> {
  const p = getCachedProgress();
  p.threat_profile = data;
  setCachedProgress(p);
  if (isLoggedIn()) apiPost('/progress/threat-profile', { threat_profile: data }).catch(() => {});
}

export function incrementHashCount(): number {
  try {
    const n = parseInt(localStorage.getItem(HASH_COUNT_KEY) ?? '0', 10) + 1;
    localStorage.setItem(HASH_COUNT_KEY, String(n));
    if (n >= 10) unlockAchievement('HASH_MASTER').catch(() => {});
    return n;
  } catch { return 0; }
}

// ── Init ─────────────────────────────────────────────────────────

export function initPrivacyScore(): void {
  if (typeof window === 'undefined') return;
  // Emit current cached state immediately for instant render
  dispatchProgressUpdate(getCachedProgress());
  // Background sync with server
  if (isLoggedIn()) refreshProgress().catch(() => {});
}
