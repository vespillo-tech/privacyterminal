/**
 * Privacy Terminal — Threat Scanner Engine
 * Runs real-time client-side privacy scans and returns structured results.
 * Used by /scan (Live Threat Assessment Dashboard).
 */

export interface ScanVector {
  id: string;
  label: string;
  status: string;
  severity: number;  // 0-100 exposure score for this vector
  detail: string;
  category: 'leak' | 'fingerprint' | 'metadata';
}

export interface ScanResult {
  vectors: ScanVector[];
  overall_exposure: number;  // 0-100 weighted average
  timestamp: string;
  duration_ms: number;
}

type ProgressCallback = (msg: string, pct: number) => void;

// ── Individual Scanners ─────────────────────────────────────────

async function scanWebRTC(): Promise<ScanVector> {
  const vec: ScanVector = {
    id: 'webrtc',
    label: 'WebRTC Leak',
    status: 'UNKNOWN',
    severity: 0,
    detail: '',
    category: 'leak',
  };
  try {
    if (typeof RTCPeerConnection === 'undefined') {
      vec.status = 'PROTECTED';
      vec.severity = 0;
      vec.detail = 'WebRTC not available — no leak possible';
      return vec;
    }
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const candidates: string[] = [];
    const timeout = new Promise<void>(r => setTimeout(r, 3000));
    const gather = new Promise<void>(resolve => {
      pc.onicecandidate = (e) => {
        if (!e.candidate) { resolve(); return; }
        const c = e.candidate.candidate;
        candidates.push(c);
        // Check for local/public IP patterns
        const ipMatch = c.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        if (ipMatch) {
          const ip = ipMatch[1];
          if (!ip.startsWith('0.') && ip !== '0.0.0.0') {
            candidates.push(ip);
          }
        }
      };
    });
    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await Promise.race([gather, timeout]);
    pc.close();

    const realIPs = candidates.filter(c => {
      const m = c.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      if (!m) return false;
      const ip = m[1];
      return !ip.startsWith('0.') && !ip.startsWith('127.') && ip !== '0.0.0.0';
    });

    if (realIPs.length > 0) {
      vec.status = 'EXPOSED';
      vec.severity = 85;
      vec.detail = `Local IP leaked via WebRTC (${realIPs.length} candidate${realIPs.length > 1 ? 's' : ''})`;
    } else {
      vec.status = 'PROTECTED';
      vec.severity = 5;
      vec.detail = 'No IP leak detected via WebRTC';
    }
  } catch {
    vec.status = 'PROTECTED';
    vec.severity = 0;
    vec.detail = 'WebRTC blocked or unavailable';
  }
  return vec;
}

async function scanDNS(apiBase: string): Promise<ScanVector> {
  const vec: ScanVector = {
    id: 'dns',
    label: 'DNS Resolver',
    status: 'UNKNOWN',
    severity: 50,
    detail: '',
    category: 'leak',
  };
  try {
    const resp = await fetch(`${apiBase}/dns-check`, { signal: AbortSignal.timeout(5000) });
    if (resp.ok) {
      const data = await resp.json();
      const resolver = data.resolver || data.dns || 'unknown';
      const isEncrypted = data.encrypted === true || data.doh === true || data.dot === true;
      if (isEncrypted) {
        vec.status = 'ENCRYPTED';
        vec.severity = 5;
        vec.detail = `DNS-over-HTTPS/TLS detected (${resolver})`;
      } else {
        vec.status = 'ISP DEFAULT';
        vec.severity = 65;
        vec.detail = `Standard DNS via ${resolver} — queries visible to ISP`;
      }
    } else {
      vec.status = 'CHECK FAILED';
      vec.detail = 'Could not reach DNS check endpoint';
    }
  } catch {
    vec.status = 'CHECK FAILED';
    vec.severity = 30;
    vec.detail = 'DNS check unavailable — endpoint timeout';
  }
  return vec;
}

async function scanIP(apiBase: string): Promise<ScanVector> {
  const vec: ScanVector = {
    id: 'ip',
    label: 'IP Visibility',
    status: 'UNKNOWN',
    severity: 50,
    detail: '',
    category: 'leak',
  };
  try {
    const resp = await fetch(`${apiBase}/ip`, { signal: AbortSignal.timeout(5000) });
    if (resp.ok) {
      const data = await resp.json();
      const ip = data.ip || 'unknown';
      const isVPN = data.vpn === true || data.proxy === true || data.tor === true;
      const country = data.country || '';
      const org = data.org || data.asn || '';
      if (isVPN || data.tor) {
        vec.status = data.tor ? 'TOR' : 'VPN DETECTED';
        vec.severity = 5;
        vec.detail = `IP masked — ${data.tor ? 'Tor exit node' : 'VPN/proxy detected'}`;
      } else {
        vec.status = 'EXPOSED';
        vec.severity = 75;
        const maskIP = ip.replace(/(\d+\.\d+)\.\d+\.\d+/, '$1.x.x');
        vec.detail = `Real IP visible: ${maskIP}${country ? ` (${country})` : ''}${org ? ` — ${org}` : ''}`;
      }
    } else {
      vec.status = 'CHECK FAILED';
      vec.detail = 'Could not reach IP check endpoint';
    }
  } catch {
    vec.status = 'CHECK FAILED';
    vec.severity = 30;
    vec.detail = 'IP check unavailable — endpoint timeout';
  }
  return vec;
}

function scanJavaScript(): ScanVector {
  // If this code is running, JS is enabled
  return {
    id: 'javascript',
    label: 'JavaScript',
    status: 'ENABLED',
    severity: 40,
    detail: 'JavaScript is active — enables fingerprinting and tracking scripts',
    category: 'metadata',
  };
}

function scanDoNotTrack(): ScanVector {
  const dnt = (navigator as any).doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
  const isOn = dnt === '1' || dnt === 'yes';
  return {
    id: 'dnt',
    label: 'Do Not Track',
    status: isOn ? 'ON' : 'OFF',
    severity: isOn ? 15 : 35,
    detail: isOn
      ? 'DNT header sent — note: most sites ignore it'
      : 'DNT not set — a minor but free signal to enable',
    category: 'metadata',
  };
}

function scanCookies(): ScanVector {
  const count = document.cookie ? document.cookie.split(';').filter(c => c.trim()).length : 0;
  let storageEstimate = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('pt_')) storageEstimate++;
    }
  } catch { /* ignore */ }
  const total = count + storageEstimate;
  return {
    id: 'cookies',
    label: 'Cookie/Storage',
    status: total === 0 ? 'CLEAN' : `${total} ITEM${total > 1 ? 'S' : ''}`,
    severity: total > 10 ? 60 : total > 3 ? 35 : total > 0 ? 15 : 0,
    detail: `${count} cookies, ${storageEstimate} non-PT localStorage items`,
    category: 'metadata',
  };
}

function scanReferrer(): ScanVector {
  const policy = document.referrer;
  const metaRef = document.querySelector('meta[name="referrer"]');
  const policyValue = metaRef?.getAttribute('content') || 'default';
  const isStrict = policyValue.includes('strict') || policyValue.includes('no-referrer') || policyValue === 'same-origin';
  return {
    id: 'referrer',
    label: 'Referrer Policy',
    status: isStrict ? 'STRICT' : 'LEAKING',
    severity: isStrict ? 5 : 45,
    detail: isStrict
      ? `Policy: ${policyValue} — referrer data restricted`
      : `Policy: ${policyValue} — may leak browsing history to sites`,
    category: 'metadata',
  };
}

function scanCanvasFingerprint(): ScanVector {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { id: 'canvas', label: 'Canvas Fingerprint', status: 'BLOCKED', severity: 0, detail: 'Canvas API unavailable', category: 'fingerprint' };
    }
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Privacy Terminal', 2, 15);
    const dataUrl = canvas.toDataURL();
    // Simple heuristic: if output is extremely short or uniform, likely randomized
    const hash = dataUrl.slice(-32);
    const unique = new Set(hash.split('')).size;
    const isRandomized = unique < 4;
    return {
      id: 'canvas',
      label: 'Canvas Fingerprint',
      status: isRandomized ? 'RANDOMIZED' : 'UNIQUE',
      severity: isRandomized ? 10 : 75,
      detail: isRandomized
        ? 'Canvas output appears randomized — fingerprinting defense active'
        : 'Canvas produces unique output — trackable across sites',
      category: 'fingerprint',
    };
  } catch {
    return { id: 'canvas', label: 'Canvas Fingerprint', status: 'BLOCKED', severity: 0, detail: 'Canvas fingerprinting blocked', category: 'fingerprint' };
  }
}

function scanWebGL(): ScanVector {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return { id: 'webgl', label: 'WebGL Renderer', status: 'HIDDEN', severity: 0, detail: 'WebGL not available', category: 'fingerprint' };
    }
    const g = gl as WebGLRenderingContext;
    const dbg = g.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) {
      return { id: 'webgl', label: 'WebGL Renderer', status: 'HIDDEN', severity: 10, detail: 'WebGL debug info extension blocked', category: 'fingerprint' };
    }
    const renderer = g.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'unknown';
    const vendor = g.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'unknown';
    return {
      id: 'webgl',
      label: 'WebGL Renderer',
      status: 'EXPOSED',
      severity: 70,
      detail: `${vendor} — ${renderer}`,
      category: 'fingerprint',
    };
  } catch {
    return { id: 'webgl', label: 'WebGL Renderer', status: 'HIDDEN', severity: 0, detail: 'WebGL blocked', category: 'fingerprint' };
  }
}

function scanFonts(): ScanVector {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Arial Black', 'Courier New', 'Georgia', 'Helvetica', 'Impact',
    'Lucida Console', 'Monaco', 'Palatino Linotype', 'Tahoma', 'Times New Roman',
    'Trebuchet MS', 'Verdana', 'Comic Sans MS', 'Calibri', 'Cambria', 'Consolas',
    'Segoe UI', 'Ubuntu', 'Cantarell', 'Roboto', 'Noto Sans', 'Fira Code',
    'JetBrains Mono', 'Source Code Pro', 'DejaVu Sans', 'Menlo',
  ];
  const span = document.createElement('span');
  span.style.cssText = 'position:absolute;left:-9999px;font-size:72px;visibility:hidden';
  span.textContent = 'mmmmmmmmmmlli';
  document.body.appendChild(span);
  const baseWidths: Record<string, number> = {};
  for (const base of baseFonts) {
    span.style.fontFamily = base;
    baseWidths[base] = span.offsetWidth;
  }
  let detected = 0;
  for (const font of testFonts) {
    for (const base of baseFonts) {
      span.style.fontFamily = `"${font}", ${base}`;
      if (span.offsetWidth !== baseWidths[base]) { detected++; break; }
    }
  }
  document.body.removeChild(span);
  return {
    id: 'fonts',
    label: 'System Fonts',
    status: `${detected} EXPOSED`,
    severity: detected > 15 ? 65 : detected > 8 ? 45 : detected > 0 ? 25 : 5,
    detail: `${detected} of ${testFonts.length} test fonts detected — contributes to fingerprint uniqueness`,
    category: 'fingerprint',
  };
}

function scanScreen(): ScanVector {
  const w = screen.width;
  const h = screen.height;
  const dpr = window.devicePixelRatio;
  // Common resolutions are less identifying
  const common = ['1920x1080', '1366x768', '1536x864', '1440x900', '2560x1440', '3840x2160', '1280x720'];
  const res = `${w}x${h}`;
  const isCommon = common.includes(res);
  return {
    id: 'screen',
    label: 'Screen Resolution',
    status: `${res}`,
    severity: isCommon ? 20 : 50,
    detail: `${res} @ ${dpr}x pixel ratio${isCommon ? ' (common resolution)' : ' (uncommon — more identifiable)'}`,
    category: 'fingerprint',
  };
}

// ── Main Scanner ────────────────────────────────────────────────

export async function runThreatScan(
  apiBase: string = 'https://privacyterminal-api.terinmain.workers.dev',
  onProgress?: ProgressCallback
): Promise<ScanResult> {
  const start = performance.now();
  const vectors: ScanVector[] = [];

  const steps: Array<{ label: string; fn: () => Promise<ScanVector> | ScanVector }> = [
    { label: 'Scanning WebRTC leak...', fn: scanWebRTC },
    { label: 'Checking DNS resolver...', fn: () => scanDNS(apiBase) },
    { label: 'Checking IP visibility...', fn: () => scanIP(apiBase) },
    { label: 'Checking JavaScript status...', fn: scanJavaScript },
    { label: 'Checking Do Not Track...', fn: scanDoNotTrack },
    { label: 'Checking cookies/storage...', fn: scanCookies },
    { label: 'Checking referrer policy...', fn: scanReferrer },
    { label: 'Testing canvas fingerprint...', fn: scanCanvasFingerprint },
    { label: 'Testing WebGL renderer...', fn: scanWebGL },
    { label: 'Probing system fonts...', fn: scanFonts },
    { label: 'Checking screen resolution...', fn: scanScreen },
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const pct = Math.round(((i + 1) / steps.length) * 100);
    onProgress?.(step.label, pct);
    const result = await step.fn();
    vectors.push(result);
  }

  // Calculate weighted overall exposure
  // Leaks are weighted heavier than fingerprints, metadata lowest
  const weights: Record<string, number> = { leak: 1.5, fingerprint: 1.0, metadata: 0.6 };
  let weightedSum = 0;
  let weightTotal = 0;
  for (const v of vectors) {
    const w = weights[v.category] ?? 1;
    weightedSum += v.severity * w;
    weightTotal += 100 * w;
  }
  const overall = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 100) : 0;

  const duration = Math.round(performance.now() - start);
  return {
    vectors,
    overall_exposure: overall,
    timestamp: new Date().toISOString(),
    duration_ms: duration,
  };
}
