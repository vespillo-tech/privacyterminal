/**
 * Privacy Terminal — Threat Scanner Engine
 * Runs real-time client-side privacy scans and returns structured results.
 * Used by /scan (Live Threat Assessment Dashboard).
 *
 * Design principles:
 * - Blocked/unavailable features score as PROTECTED (good privacy)
 * - API failures degrade gracefully — client-side checks always complete
 * - Every scanner wrapped in try/catch with timeout protection
 * - Hardened browsers (Mullvad, Tor) get recognized, not penalized
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

// ── Helpers ──────────────────────────────────────────────────────

/** Fetch with 5s timeout — returns null on any failure */
async function safeFetch(url: string): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}

// ── Individual Scanners ─────────────────────────────────────────

function classifyIP(ip: string): 'private' | 'public' | 'loopback' {
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip.startsWith('169.254.')) return 'private';
  if (ip.startsWith('127.') || ip === '0.0.0.0' || ip === '::1') return 'loopback';
  if (ip.startsWith('fd') || ip.startsWith('fe80')) return 'private';
  return 'public';
}

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
      vec.status = 'BLOCKED';
      vec.severity = 0;
      vec.detail = 'WebRTC API blocked — no leak possible. This is a strong privacy protection.';
      return vec;
    }
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const candidates: string[] = [];
    let hasMDNS = false;
    const timeout = new Promise<void>(r => setTimeout(r, 3000));
    const gather = new Promise<void>(resolve => {
      pc.onicecandidate = (e) => {
        if (!e.candidate) { resolve(); return; }
        const c = e.candidate.candidate;
        // Detect mDNS candidates (.local addresses)
        if (c.includes('.local')) { hasMDNS = true; }
        // Match IPv4
        const ipv4Match = c.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        if (ipv4Match) {
          const ip = ipv4Match[1];
          if (!ip.startsWith('0.') && ip !== '0.0.0.0') {
            candidates.push(ip);
          }
        }
        // Match IPv6
        const ipv6Match = c.match(/([0-9a-f]{1,4}(:[0-9a-f]{1,4}){2,7})/i);
        if (ipv6Match) {
          candidates.push(ipv6Match[1]);
        }
      };
    });
    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await Promise.race([gather, timeout]);
    pc.close();

    const realIPs = candidates.filter(ip => classifyIP(ip) !== 'loopback');
    const privateIPs = realIPs.filter(ip => classifyIP(ip) === 'private');
    const publicIPs = realIPs.filter(ip => classifyIP(ip) === 'public');

    if (publicIPs.length > 0 && privateIPs.length > 0) {
      vec.status = 'EXPOSED';
      vec.severity = 90;
      vec.detail = `Public and private IPs leaked via WebRTC (${publicIPs.length} public, ${privateIPs.length} private)`;
    } else if (publicIPs.length > 0) {
      vec.status = 'EXPOSED';
      vec.severity = 85;
      vec.detail = `Public IP leaked via WebRTC (${publicIPs.length} candidate${publicIPs.length > 1 ? 's' : ''})`;
    } else if (privateIPs.length > 0) {
      vec.status = 'PRIVATE IP LEAK';
      vec.severity = 40;
      vec.detail = `Private/local IP leaked via WebRTC (${privateIPs.length} candidate${privateIPs.length > 1 ? 's' : ''}) — not directly routable but aids network fingerprinting`;
    } else if (hasMDNS) {
      vec.status = 'MDNS ONLY';
      vec.severity = 10;
      vec.detail = 'Only mDNS (.local) candidates observed — real IP is obfuscated, minimal leak risk';
    } else {
      vec.status = 'PROTECTED';
      vec.severity = 5;
      vec.detail = 'No IP leak detected via WebRTC — STUN requests contained';
    }
  } catch {
    vec.status = 'BLOCKED';
    vec.severity = 0;
    vec.detail = 'WebRTC blocked or unavailable — no leak possible';
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
    const data = await safeFetch(`${apiBase}/dns-check`);
    if (!data) {
      vec.status = 'BLOCKED BY BROWSER';
      vec.severity = 5;
      vec.detail = 'DNS check endpoint unreachable — browser may be blocking external requests (privacy protection)';
      return vec;
    }

    const resolver = data.resolver || 'unknown';
    const assessment = data.dnsAssessment || '';
    const vpnTunneled = data.vpnTunneled === true;
    const encrypted = data.encrypted === true;
    const detail = data.detail || '';
    const note = data.note || '';

    if (assessment === 'vpn-tunneled' || vpnTunneled) {
      vec.status = 'VPN TUNNELED';
      vec.severity = 5;
      vec.detail = detail || `DNS queries routed through VPN tunnel${resolver !== 'unknown' ? ` (${resolver})` : ''}`;
    } else if (encrypted) {
      vec.status = 'ENCRYPTED';
      vec.severity = 10;
      vec.detail = `Encrypted DNS detected${resolver !== 'unknown' ? ` (${resolver})` : ''}`;
    } else if (assessment === 'isp-likely') {
      vec.status = 'UNVERIFIED';
      vec.severity = 40;
      vec.detail = `Server-side DNS detection is limited — ${note || 'consider enabling DNS-over-HTTPS (DoH) in your browser for verified protection'}`;
    } else {
      // Fallback for any other response shape
      vec.status = resolver !== 'unknown' ? 'DETECTED' : 'UNKNOWN';
      vec.severity = 35;
      vec.detail = detail || `DNS resolver: ${resolver}. Enable DoH in browser settings for best protection.`;
    }
  } catch {
    vec.status = 'BLOCKED BY BROWSER';
    vec.severity = 5;
    vec.detail = 'DNS check blocked — browser restricting external API calls (privacy protection)';
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
    const data = await safeFetch(`${apiBase}/ip`);
    if (!data) {
      vec.status = 'BLOCKED BY BROWSER';
      vec.severity = 5;
      vec.detail = 'IP check endpoint unreachable — browser may be blocking external requests (privacy protection)';
      return vec;
    }

    const ip = data.ip || 'unknown';
    const country = data.country || '';
    const asOrg = data.asOrg || data.org || data.asn || '';

    // Use the new VPN detection fields
    const isVPN = data.vpn === true;
    const isTor = data.tor === true;
    const isProxy = data.proxy === true;
    const confidence = data.vpnConfidence || 'unknown';
    const reason = data.vpnReason || '';
    const provider = data.vpnProvider || null;
    const isDC = data.datacenter === true;

    if (isTor) {
      vec.status = 'TOR EXIT NODE';
      vec.severity = 0;
      vec.detail = `IP routed through Tor network${asOrg ? ` — ${asOrg}` : ''}`;
    } else if (isVPN) {
      const providerStr = provider ? ` (${provider})` : '';
      const confStr = confidence === 'high' ? '' : ` [${confidence} confidence]`;
      vec.status = 'VPN ACTIVE';
      vec.severity = 5;
      vec.detail = reason
        ? `${reason}${providerStr}${confStr}`
        : `VPN detected${providerStr}${confStr}${asOrg ? ` — ${asOrg}` : ''}`;
    } else if (isProxy) {
      vec.status = 'PROXY DETECTED';
      vec.severity = 15;
      vec.detail = `Proxy server detected${asOrg ? ` — ${asOrg}` : ''}. Some proxy types still expose metadata.`;
    } else if (isDC) {
      // Datacenter IP but not flagged as VPN — could be a lesser-known VPN
      vec.status = 'DATACENTER IP';
      vec.severity = 25;
      vec.detail = `IP belongs to a datacenter${asOrg ? ` (${asOrg})` : ''} — not a residential ISP, but not confirmed VPN`;
    } else {
      // No VPN/Tor/Proxy detected — IP is exposed
      vec.status = 'EXPOSED';
      vec.severity = 75;
      const maskIP = ip.replace(/(\d+\.\d+)\.\d+\.\d+/, '$1.x.x');
      vec.detail = `Real IP visible: ${maskIP}${country ? ` (${country})` : ''}${asOrg ? ` — ${asOrg}` : ''}`;
    }
  } catch {
    vec.status = 'BLOCKED BY BROWSER';
    vec.severity = 5;
    vec.detail = 'IP check blocked — browser restricting external API calls (privacy protection)';
  }
  return vec;
}

function scanJavaScript(): ScanVector {
  return {
    id: 'javascript',
    label: 'JavaScript',
    status: 'ENABLED',
    severity: 20,
    detail: 'JavaScript is active (required to run this scanner). Mitigate tracking with uBlock Origin or NoScript for untrusted sites.',
    category: 'metadata',
  };
}

function scanDoNotTrack(): ScanVector {
  try {
    const dnt = (navigator as any).doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
    const gpc = (navigator as any).globalPrivacyControl;
    const isDNT = dnt === '1' || dnt === 'yes';
    const isGPC = gpc === true;

    if (isDNT && isGPC) {
      return {
        id: 'dnt',
        label: 'Do Not Track',
        status: 'DNT + GPC',
        severity: 10,
        detail: 'Both Do Not Track and Global Privacy Control are active — GPC has legal force in some jurisdictions',
        category: 'metadata',
      };
    } else if (isGPC) {
      return {
        id: 'dnt',
        label: 'Do Not Track',
        status: 'GPC ON',
        severity: 10,
        detail: 'Global Privacy Control active — legally binding in California (CCPA) and some EU jurisdictions',
        category: 'metadata',
      };
    } else if (isDNT) {
      return {
        id: 'dnt',
        label: 'Do Not Track',
        status: 'DNT ON',
        severity: 15,
        detail: 'DNT header sent — note: most sites ignore it. Consider enabling GPC for legal weight.',
        category: 'metadata',
      };
    } else {
      return {
        id: 'dnt',
        label: 'Do Not Track',
        status: 'OFF',
        severity: 35,
        detail: 'Neither DNT nor GPC is set — enable Global Privacy Control in browser settings',
        category: 'metadata',
      };
    }
  } catch {
    return {
      id: 'dnt',
      label: 'Do Not Track',
      status: 'UNAVAILABLE',
      severity: 15,
      detail: 'Could not read tracking preference headers',
      category: 'metadata',
    };
  }
}

/** Rewritten: tests browser cookie/storage POLICY, not just current counts */
function scanCookies(): ScanVector {
  const vec: ScanVector = {
    id: 'cookies',
    label: 'Cookie/Storage',
    status: 'UNKNOWN',
    severity: 30,
    detail: '',
    category: 'metadata',
  };

  try {
    const findings: string[] = [];
    let protections = 0;
    let exposures = 0;

    // 1. Check navigator.cookieEnabled
    const cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
      findings.push('Cookies disabled globally');
      protections++;
    }

    // 2. Test actual cookie writability
    let canWriteCookie = false;
    try {
      document.cookie = '__pt_test=1; SameSite=Strict; path=/';
      canWriteCookie = document.cookie.includes('__pt_test=1');
      // Clean up
      document.cookie = '__pt_test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } catch {
      canWriteCookie = false;
    }

    if (!canWriteCookie && cookieEnabled) {
      findings.push('Cookie writes blocked despite cookieEnabled=true (hardened mode)');
      protections++;
    } else if (!canWriteCookie) {
      findings.push('Cookie writes blocked');
      protections++;
    } else {
      findings.push('Cookies writable (first-party)');
      exposures++;
    }

    // 3. Check localStorage accessibility and count
    let lsAccessible = false;
    let lsCount = 0;
    try {
      localStorage.setItem('__pt_test', '1');
      localStorage.removeItem('__pt_test');
      lsAccessible = true;
      lsCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('pt_') && !key.startsWith('__pt_')) lsCount++;
      }
    } catch {
      lsAccessible = false;
    }

    if (!lsAccessible) {
      findings.push('localStorage blocked');
      protections++;
    } else {
      findings.push(`localStorage accessible (${lsCount} item${lsCount !== 1 ? 's' : ''})`);
      if (lsCount > 5) exposures++;
    }

    // 4. Check sessionStorage accessibility
    let ssAccessible = false;
    try {
      sessionStorage.setItem('__pt_test', '1');
      sessionStorage.removeItem('__pt_test');
      ssAccessible = true;
    } catch {
      ssAccessible = false;
    }

    if (!ssAccessible) {
      findings.push('sessionStorage blocked');
      protections++;
    }

    // 5. Check StorageManager API (indicates storage partitioning support)
    const hasStorageManager = 'storage' in navigator && typeof (navigator as any).storage?.estimate === 'function';
    if (hasStorageManager) {
      findings.push('StorageManager API available');
    }

    // 6. Check IndexedDB accessibility
    let idbAccessible = false;
    try {
      if (typeof indexedDB === 'undefined') {
        idbAccessible = false;
      } else {
        // In hardened browsers, just calling open() throws SecurityError
        const req = indexedDB.open('__pt_idb_test');
        idbAccessible = true;
        // Schedule cleanup (non-blocking)
        req.onsuccess = () => { try { req.result.close(); indexedDB.deleteDatabase('__pt_idb_test'); } catch {} };
        req.onerror = () => {};
      }
    } catch {
      idbAccessible = false;
    }

    if (!idbAccessible) {
      findings.push('IndexedDB blocked');
      protections++;
    }

    // 7. Count existing cookies on this domain
    const cookieCount = document.cookie ? document.cookie.split(';').filter(c => c.trim()).length : 0;
    if (cookieCount > 0) {
      findings.push(`${cookieCount} active cookie${cookieCount > 1 ? 's' : ''} on this domain`);
    }

    // Score based on protections vs exposures
    if (protections >= 3) {
      vec.status = 'HARDENED';
      vec.severity = 0;
    } else if (protections >= 2) {
      vec.status = 'RESTRICTED';
      vec.severity = 10;
    } else if (!cookieEnabled || !canWriteCookie) {
      vec.status = 'COOKIES BLOCKED';
      vec.severity = 10;
    } else if (exposures === 0) {
      vec.status = 'MINIMAL';
      vec.severity = 15;
    } else {
      vec.status = 'STANDARD';
      vec.severity = 35;
    }

    vec.detail = findings.join(' · ');
  } catch {
    vec.status = 'BLOCKED';
    vec.severity = 0;
    vec.detail = 'Storage APIs inaccessible — browser blocking storage mechanisms (privacy protection)';
  }
  return vec;
}

function scanReferrer(): ScanVector {
  try {
    const metaRef = document.querySelector('meta[name="referrer"]');
    const policyValue = metaRef?.getAttribute('content') || 'default';
    const isStrict = policyValue.includes('strict') || policyValue.includes('no-referrer') || policyValue === 'same-origin';

    // Also check the actual referrer-policy header behavior via API
    const currentReferrer = document.referrer;
    const hasReferrer = currentReferrer.length > 0;

    return {
      id: 'referrer',
      label: 'Referrer Policy',
      status: isStrict ? 'STRICT' : 'PERMISSIVE',
      severity: isStrict ? 10 : 30,
      detail: isStrict
        ? `This site sets a strict referrer policy (${policyValue}). Your browser's global referrer policy may differ — check browser settings for site-independent protection.`
        : `This site's referrer policy is ${policyValue}. Note: this reflects the site's setting, not your browser's global policy.`,
      category: 'metadata',
    };
  } catch {
    return {
      id: 'referrer',
      label: 'Referrer Policy',
      status: 'UNAVAILABLE',
      severity: 15,
      detail: 'Could not determine referrer policy',
      category: 'metadata',
    };
  }
}

function scanCanvasFingerprint(): ScanVector {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        id: 'canvas',
        label: 'Canvas Fingerprint',
        status: 'BLOCKED',
        severity: 0,
        detail: 'Canvas 2D context unavailable — fingerprinting via canvas not possible (strong protection)',
        category: 'fingerprint',
      };
    }

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Privacy Terminal', 2, 15);

    let dataUrl: string;
    try {
      dataUrl = canvas.toDataURL();
    } catch {
      // toDataURL blocked (e.g., Tor Browser "Safest" mode)
      return {
        id: 'canvas',
        label: 'Canvas Fingerprint',
        status: 'BLOCKED',
        severity: 0,
        detail: 'Canvas data extraction blocked — toDataURL() restricted (strong fingerprint protection)',
        category: 'fingerprint',
      };
    }

    // Detect randomization: compare two renders
    const canvas2 = document.createElement('canvas');
    canvas2.width = 200;
    canvas2.height = 50;
    const ctx2 = canvas2.getContext('2d');
    let isRandomized = false;
    if (ctx2) {
      ctx2.textBaseline = 'top';
      ctx2.font = '14px Arial';
      ctx2.fillStyle = '#f60';
      ctx2.fillRect(125, 1, 62, 20);
      ctx2.fillStyle = '#069';
      ctx2.fillText('Privacy Terminal', 2, 15);
      try {
        const dataUrl2 = canvas2.toDataURL();
        isRandomized = dataUrl !== dataUrl2;
      } catch {
        isRandomized = true; // If second read fails, treat as protected
      }
    }

    // Also check if the output looks like a blank/uniform canvas
    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = 200;
    blankCanvas.height = 50;
    let isBlank = false;
    try {
      isBlank = dataUrl === blankCanvas.toDataURL();
    } catch { /* ignore */ }

    if (isRandomized) {
      return {
        id: 'canvas',
        label: 'Canvas Fingerprint',
        status: 'RANDOMIZED',
        severity: 5,
        detail: 'Canvas output differs between renders — anti-fingerprinting noise active',
        category: 'fingerprint',
      };
    } else if (isBlank) {
      return {
        id: 'canvas',
        label: 'Canvas Fingerprint',
        status: 'BLOCKED',
        severity: 0,
        detail: 'Canvas returns blank data — rendering blocked (fingerprint protection active)',
        category: 'fingerprint',
      };
    } else {
      return {
        id: 'canvas',
        label: 'Canvas Fingerprint',
        status: 'CONSISTENT',
        severity: 60,
        detail: 'Canvas produces consistent output — likely trackable, but session-stable randomization (Firefox RFP) cannot be ruled out from a single session',
        category: 'fingerprint',
      };
    }
  } catch {
    return {
      id: 'canvas',
      label: 'Canvas Fingerprint',
      status: 'BLOCKED',
      severity: 0,
      detail: 'Canvas API blocked or errored — fingerprinting not possible (strong protection)',
      category: 'fingerprint',
    };
  }
}

function scanWebGL(): ScanVector {
  try {
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    } catch {
      return {
        id: 'webgl',
        label: 'WebGL Renderer',
        status: 'BLOCKED',
        severity: 0,
        detail: 'WebGL context creation blocked — GPU fingerprinting not possible (strong protection)',
        category: 'fingerprint',
      };
    }

    if (!gl) {
      return {
        id: 'webgl',
        label: 'WebGL Renderer',
        status: 'BLOCKED',
        severity: 0,
        detail: 'WebGL not available — GPU fingerprinting not possible (privacy protection)',
        category: 'fingerprint',
      };
    }

    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) {
      return {
        id: 'webgl',
        label: 'WebGL Renderer',
        status: 'HIDDEN',
        severity: 10,
        detail: 'WebGL available but debug renderer info blocked — GPU identity hidden',
        category: 'fingerprint',
      };
    }

    const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'unknown';
    const vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'unknown';

    // Check for spoofed/generic values
    const genericRenderers = ['WebKit WebGL', 'Mozilla', 'unknown', 'Generic Renderer', 'ANGLE'];
    const isSpoofed = genericRenderers.some(g => renderer === g || vendor === g) ||
      (renderer === 'unknown' && vendor === 'unknown');

    if (isSpoofed) {
      return {
        id: 'webgl',
        label: 'WebGL Renderer',
        status: 'SPOOFED',
        severity: 10,
        detail: `GPU identity masked: ${vendor} — ${renderer}`,
        category: 'fingerprint',
      };
    }

    return {
      id: 'webgl',
      label: 'WebGL Renderer',
      status: 'EXPOSED',
      severity: 70,
      detail: `${vendor} — ${renderer}`,
      category: 'fingerprint',
    };
  } catch {
    return {
      id: 'webgl',
      label: 'WebGL Renderer',
      status: 'BLOCKED',
      severity: 0,
      detail: 'WebGL blocked or errored — GPU fingerprinting not possible (strong protection)',
      category: 'fingerprint',
    };
  }
}

function scanFonts(): ScanVector {
  try {
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

    // Check if all base fonts report the same width (possible font enumeration blocking)
    const baseValues = Object.values(baseWidths);
    const allBaseSame = baseValues.every(w => w === baseValues[0]);

    let detected = 0;
    for (const font of testFonts) {
      for (const base of baseFonts) {
        span.style.fontFamily = `"${font}", ${base}`;
        if (span.offsetWidth !== baseWidths[base]) {
          detected++;
          break;
        }
      }
    }
    document.body.removeChild(span);

    // If zero fonts detected AND all bases same, font enumeration is likely blocked
    if (detected === 0 && allBaseSame) {
      return {
        id: 'fonts',
        label: 'System Fonts',
        status: 'BLOCKED',
        severity: 0,
        detail: 'Font enumeration appears blocked — all test fonts report identical metrics (strong protection)',
        category: 'fingerprint',
      };
    }

    if (detected <= 3) {
      return {
        id: 'fonts',
        label: 'System Fonts',
        status: 'RESTRICTED',
        severity: 10,
        detail: `Only ${detected} of ${testFonts.length} test fonts detected — limited font enumeration surface`,
        category: 'fingerprint',
      };
    }

    return {
      id: 'fonts',
      label: 'System Fonts',
      status: `${detected} DETECTED`,
      severity: detected > 15 ? 65 : detected > 8 ? 45 : 25,
      detail: `${detected} of ${testFonts.length} test fonts detected — contributes to fingerprint uniqueness`,
      category: 'fingerprint',
    };
  } catch {
    return {
      id: 'fonts',
      label: 'System Fonts',
      status: 'BLOCKED',
      severity: 0,
      detail: 'Font enumeration blocked — DOM measurement restricted (privacy protection)',
      category: 'fingerprint',
    };
  }
}

function scanScreen(): ScanVector {
  try {
    const w = screen.width;
    const h = screen.height;
    const dpr = window.devicePixelRatio;
    const common = ['1920x1080', '1366x768', '1536x864', '1440x900', '2560x1440', '3840x2160', '1280x720', '1280x800'];
    const res = `${w}x${h}`;
    const isCommon = common.includes(res);

    // Detect letterboxed/spoofed resolution (common in Tor/Mullvad Browser)
    const innerW = window.innerWidth;
    const innerH = window.innerHeight;
    // Tor/Mullvad letterboxing: rounded inner dimensions + significant gap from screen size
    const wGap = w - innerW;
    const hGap = h - innerH;
    const isRounded = (innerW % 200 === 0) && (innerH % 100 === 0);
    const hasSignificantGap = wGap > 100 || hGap > 100;
    const isLetterboxed = isRounded && hasSignificantGap;

    if (isLetterboxed) {
      return {
        id: 'screen',
        label: 'Screen Resolution',
        status: 'LETTERBOXED',
        severity: 10,
        detail: `Window: ${innerW}x${innerH} (rounded) @ ${dpr}x — letterboxing detected, reduces fingerprint precision`,
        category: 'fingerprint',
      };
    }

    return {
      id: 'screen',
      label: 'Screen Resolution',
      status: res,
      severity: isCommon ? 20 : 50,
      detail: `${res} @ ${dpr}x pixel ratio${isCommon ? ' (common resolution)' : ' (uncommon — more identifiable)'}`,
      category: 'fingerprint',
    };
  } catch {
    return {
      id: 'screen',
      label: 'Screen Resolution',
      status: 'UNAVAILABLE',
      severity: 5,
      detail: 'Screen properties inaccessible',
      category: 'fingerprint',
    };
  }
}

// ── Hardened Browser Detection ──────────────────────────────────

function detectHardenedBrowser(vectors: ScanVector[]): ScanVector | null {
  const blockedStatuses = ['BLOCKED', 'BLOCKED BY BROWSER'];
  const protectedStatuses = ['BLOCKED', 'BLOCKED BY BROWSER', 'RANDOMIZED', 'HIDDEN', 'SPOOFED', 'LETTERBOXED', 'RESTRICTED', 'HARDENED'];

  let blockedCount = 0;
  let protectedCount = 0;

  for (const v of vectors) {
    if (blockedStatuses.includes(v.status)) blockedCount++;
    if (protectedStatuses.includes(v.status)) protectedCount++;
  }

  if (protectedCount >= 3) {
    // Determine likely browser
    const hasWebRTCBlocked = vectors.find(v => v.id === 'webrtc' && blockedStatuses.includes(v.status));
    const hasCanvasBlocked = vectors.find(v => v.id === 'canvas' && protectedStatuses.includes(v.status));
    const hasWebGLBlocked = vectors.find(v => v.id === 'webgl' && protectedStatuses.includes(v.status));
    const hasFontsBlocked = vectors.find(v => v.id === 'fonts' && protectedStatuses.includes(v.status));
    const vpnVec = vectors.find(v => v.id === 'ip');
    const isTor = vpnVec?.status === 'TOR EXIT NODE';
    const isVPN = vpnVec?.status === 'VPN ACTIVE';

    let browserGuess = 'hardened browser';
    if (isTor && hasCanvasBlocked && hasWebGLBlocked) {
      browserGuess = 'Tor Browser (or Mullvad Browser in Safest mode)';
    } else if (isVPN && hasCanvasBlocked) {
      browserGuess = 'Mullvad Browser or similar hardened Firefox fork';
    } else if (blockedCount >= 4) {
      browserGuess = 'heavily hardened browser (Safest security level)';
    } else if (hasCanvasBlocked || hasWebGLBlocked) {
      browserGuess = 'privacy-hardened browser with anti-fingerprinting';
    }

    return {
      id: 'hardened_browser',
      label: '🛡 Hardened Browser',
      status: `${protectedCount} PROTECTIONS`,
      severity: 0,
      detail: `Detected ${browserGuess} — ${protectedCount} scan vectors returned protected/blocked status. ` +
        `Blocked features ARE the privacy improvement. ` +
        `Your browser is actively resisting fingerprinting and tracking.`,
      category: 'metadata',
    };
  }

  return null;
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
    { label: 'Assessing cookie & storage policy...', fn: scanCookies },
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
    try {
      const result = await step.fn();
      vectors.push(result);
    } catch {
      // Absolute fallback — should never reach here due to per-scanner try/catch
      vectors.push({
        id: steps[i].label.toLowerCase().replace(/[^a-z]/g, '_'),
        label: step.label.replace(/\.\.\.$/, ''),
        status: 'UNAVAILABLE',
        severity: 5,
        detail: 'Check could not complete',
        category: 'metadata',
      });
    }
  }

  // Check for hardened browser and append if detected
  const hardenedVec = detectHardenedBrowser(vectors);
  if (hardenedVec) {
    vectors.push(hardenedVec);
  }

  // Calculate weighted overall exposure
  // Leaks weighted heavier than fingerprints, metadata lowest
  const weights: Record<string, number> = { leak: 1.5, fingerprint: 1.0, metadata: 0.6 };
  let weightedSum = 0;
  let weightTotal = 0;
  for (const v of vectors) {
    // Don't count the hardened browser summary in exposure calculation
    if (v.id === 'hardened_browser') continue;
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
