/**
 * Privacy Terminal — Gamification Engine
 * Clearance level system, guide tier mapping, and progress analysis.
 * Reads from the same localStorage pt_progress used by privacy-score.ts.
 */

// ── Guide Tier Mapping ──────────────────────────────────────────

export const RECON_GUIDES = [
  'what-is-a-threat-model',
  'who-wants-your-data',
  'how-youre-being-tracked',
  'privacy-glossary',
  'privacy-myths-debunked',
  'the-5-minute-privacy-checkup',
  'your-phone-is-tracking-you',
] as const;

export const HARDENING_GUIDES = [
  'choosing-a-browser-for-privacy',
  'vpns-what-they-actually-protect',
  'password-managers-account-security',
  'encrypted-messaging',
  'dns-privacy-explained',
  'email-privacy-beyond-gmail',
  'private-search-engines',
  'social-media-privacy-settings',
  'operating-systems-for-privacy',
  'network-security-at-home',
  'browser-fingerprinting-explained',
] as const;

export const OPS_GUIDES = [
  'opsec-for-high-risk-individuals',
  'data-broker-opt-out',
  'how-to-delete-your-digital-footprint',
] as const;

export const ALL_GUIDES = [
  ...RECON_GUIDES,
  ...HARDENING_GUIDES,
  ...OPS_GUIDES,
] as const;

export const ALL_TOOLS = [
  'fingerprint-analyzer',
  'webrtc-detector',
  'leak-tester',
  'hash-generator',
  'email-header-analyzer',
  'metadata-stripper',
  'threat-profiler',
] as const;

// ── Clearance Level Definitions ─────────────────────────────────

export interface ClearanceLevel {
  level: number;
  name: string;
  cssColor: string;
  tailwindColor: string;
  hexColor: string;
}

export const CLEARANCE_LEVELS: ClearanceLevel[] = [
  { level: 0, name: 'CIVILIAN',  cssColor: 'text-gray-500',        tailwindColor: 'gray',  hexColor: '#6b7280' },
  { level: 1, name: 'AWARE',     cssColor: 'text-gray-200',        tailwindColor: 'white', hexColor: '#e5e7eb' },
  { level: 2, name: 'GUARDED',   cssColor: 'text-terminal-green',  tailwindColor: 'green', hexColor: '#00ff41' },
  { level: 3, name: 'HARDENED',  cssColor: 'text-terminal-cyan',   tailwindColor: 'cyan',  hexColor: '#00d4ff' },
  { level: 4, name: 'OPERATOR',  cssColor: 'text-terminal-amber',  tailwindColor: 'amber', hexColor: '#ffb000' },
  { level: 5, name: 'GHOST',     cssColor: 'text-terminal-red',    tailwindColor: 'red',   hexColor: '#ff3333' },
];

// ── Progress Summary ────────────────────────────────────────────

export interface ProgressSummary {
  recon: { completed: string[]; total: number };
  hardening: { completed: string[]; total: number };
  ops: { completed: string[]; total: number };
  tools: { used: string[]; total: number };
  totalGuides: { completed: number; total: number };
  lastScan: ScanSnapshot | null;
  clearance: ClearanceLevel;
}

export interface ScanSnapshot {
  overall_exposure: number;
  timestamp: string;
  vectors: Array<{ id: string; severity: number; status: string }>;
}

// ── Core Functions ──────────────────────────────────────────────

const PROGRESS_KEY = 'pt_progress';
const SCAN_KEY = 'pt_latest_scan';
const INITIAL_SCAN_KEY = 'pt_initial_scan';

export function getProgress(): any {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { score: 0, level: 1, level_name: 'NEWBIE', guides_completed: [], tools_used: [], achievements_unlocked: [] };
}

export function getLastScan(): ScanSnapshot | null {
  try {
    const raw = localStorage.getItem(SCAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export function getInitialScan(): ScanSnapshot | null {
  try {
    const raw = localStorage.getItem(INITIAL_SCAN_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export function saveScanResults(snapshot: ScanSnapshot): void {
  try {
    // Save as latest
    localStorage.setItem(SCAN_KEY, JSON.stringify(snapshot));
    // Save as initial if first scan
    if (!localStorage.getItem(INITIAL_SCAN_KEY)) {
      localStorage.setItem(INITIAL_SCAN_KEY, JSON.stringify(snapshot));
    }
    // Also update progress clearance
    const p = getProgress();
    p.pt_latest_scan = snapshot;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    // Dispatch update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pt:progress', { detail: p }));
    }
  } catch { /* ignore */ }
}

export function calculateClearance(progress?: any): ClearanceLevel {
  const p = progress || getProgress();
  const completed: string[] = p.guides_completed || [];
  const toolsUsed: string[] = p.tools_used || [];
  const scan = p.pt_latest_scan || getLastScan();

  const reconDone = RECON_GUIDES.filter(g => completed.includes(g));
  const hardeningDone = HARDENING_GUIDES.filter(g => completed.includes(g));
  const allGuidesComplete = ALL_GUIDES.every(g => completed.includes(g));
  const allToolsUsed = ALL_TOOLS.every(t => toolsUsed.includes(t));

  // Level 5: GHOST — all complete + scan below 20% exposure
  if (allGuidesComplete && allToolsUsed && scan && scan.overall_exposure < 20) {
    return CLEARANCE_LEVELS[5];
  }
  // Level 4: OPERATOR — all guides + all tools
  if (allGuidesComplete && allToolsUsed) {
    return CLEARANCE_LEVELS[4];
  }
  // Level 3: HARDENED — 8+ hardening guides
  if (hardeningDone.length >= 8) {
    return CLEARANCE_LEVELS[3];
  }
  // Level 2: GUARDED — all recon + 3 tools
  if (reconDone.length === RECON_GUIDES.length && toolsUsed.length >= 3) {
    return CLEARANCE_LEVELS[2];
  }
  // Level 1: AWARE — 3+ recon guides
  if (reconDone.length >= 3) {
    return CLEARANCE_LEVELS[1];
  }
  // Level 0: CIVILIAN
  return CLEARANCE_LEVELS[0];
}

export function getProgressSummary(progress?: any): ProgressSummary {
  const p = progress || getProgress();
  const completed: string[] = p.guides_completed || [];
  const toolsUsed: string[] = p.tools_used || [];

  return {
    recon: {
      completed: RECON_GUIDES.filter(g => completed.includes(g)),
      total: RECON_GUIDES.length,
    },
    hardening: {
      completed: HARDENING_GUIDES.filter(g => completed.includes(g)),
      total: HARDENING_GUIDES.length,
    },
    ops: {
      completed: OPS_GUIDES.filter(g => completed.includes(g)),
      total: OPS_GUIDES.length,
    },
    tools: {
      used: ALL_TOOLS.filter(t => toolsUsed.includes(t)),
      total: ALL_TOOLS.length,
    },
    totalGuides: {
      completed: completed.length,
      total: ALL_GUIDES.length,
    },
    lastScan: getLastScan(),
    clearance: calculateClearance(p),
  };
}

// ── Challenge Tracking ──────────────────────────────────────────

const CHALLENGES_KEY = 'pt_challenges_completed';

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  category: 'hardening' | 'recon' | 'operations';
  difficulty: number;
  verificationTool: string;
  verificationTarget: string;
  reward: number;
}

export function getCompletedChallenges(): string[] {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function completeChallenge(challengeId: string): boolean {
  const completed = getCompletedChallenges();
  if (completed.includes(challengeId)) return false;
  completed.push(challengeId);
  try {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(completed));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pt:challenge-complete', { detail: challengeId }));
    }
  } catch { /* ignore */ }
  return true;
}

/**
 * Check all challenges against current progress/scan data and auto-complete.
 * Returns array of newly completed challenge IDs.
 */
export function evaluateChallenges(challenges: ChallengeData[]): string[] {
  const progress = getProgress();
  const completed: string[] = progress.guides_completed || [];
  const toolsUsed: string[] = progress.tools_used || [];
  const scan = getLastScan();
  const alreadyDone = getCompletedChallenges();
  const clearance = calculateClearance(progress);
  const newlyCompleted: string[] = [];

  for (const ch of challenges) {
    if (alreadyDone.includes(ch.id)) continue;

    let pass = false;

    switch (ch.id) {
      case 'full-scan':
        pass = scan !== null;
        break;
      case 'full-recon':
        pass = RECON_GUIDES.every(g => completed.includes(g));
        break;
      case 'ghost-protocol':
        pass = clearance.level >= 5;
        break;
      case 'threat-modeler':
        pass = toolsUsed.includes('threat-profiler');
        break;
      case 'metadata-ghost':
        pass = toolsUsed.includes('metadata-stripper');
        break;
      case 'zero-fingerprint':
        if (scan) {
          const fpVec = scan.vectors.find(v => v.id === 'canvas');
          const fontsVec = scan.vectors.find(v => v.id === 'fonts');
          const webglVec = scan.vectors.find(v => v.id === 'webgl');
          const fpAvg = [
            fpVec?.severity ?? 100,
            fontsVec?.severity ?? 100,
            webglVec?.severity ?? 100,
          ].reduce((a, b) => a + b, 0) / 3;
          pass = fpAvg < 20;
        }
        break;
      case 'dns-lockdown':
        if (scan) {
          const dnsVec = scan.vectors.find(v => v.id === 'dns');
          pass = dnsVec !== undefined && dnsVec.severity <= 10;
        }
        break;
      case 'webrtc-shield':
        if (scan) {
          const rtcVec = scan.vectors.find(v => v.id === 'webrtc');
          pass = rtcVec !== undefined && rtcVec.severity <= 10;
        }
        break;
      default:
        break;
    }

    if (pass) {
      completeChallenge(ch.id);
      newlyCompleted.push(ch.id);
    }
  }

  return newlyCompleted;
}

// ── Reset Baseline ──────────────────────────────────────────────

export function resetBaseline(): void {
  const latest = getLastScan();
  if (latest) {
    try {
      localStorage.setItem(INITIAL_SCAN_KEY, JSON.stringify(latest));
    } catch { /* ignore */ }
  }
}

// ── Bar Rendering Helpers ───────────────────────────────────────

export function renderBar(value: number, max: number, width: number = 14): string {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const filled = Math.round(pct * width);
  return '\u2588'.repeat(filled) + '\u2591'.repeat(width - filled);
}

export function exposureLabel(pct: number): string {
  if (pct >= 75) return 'CRITICAL';
  if (pct >= 50) return 'HIGH';
  if (pct >= 25) return 'MODERATE';
  return 'LOW';
}

export function exposureColor(pct: number): string {
  if (pct >= 75) return 'text-terminal-red';
  if (pct >= 50) return 'text-terminal-amber';
  if (pct >= 25) return 'text-terminal-cyan';
  return 'text-terminal-green';
}
