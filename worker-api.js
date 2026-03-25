// Known VPN / proxy / datacenter ASN organization keywords
const VPN_ASN_KEYWORDS = [
  'mullvad', 'nordvpn', 'nord-vpn', 'expressvpn', 'surfshark', 'cyberghost',
  'private internet access', 'pia', 'protonvpn', 'proton vpn', 'proton ag',
  'ivpn', 'windscribe', 'torguard', 'airvpn', 'hide.me', 'hotspot shield',
  'tunnelbear', 'zenmate', 'ipvanish', 'strongvpn', 'vyprvpn', 'perfect privacy',
  'azirevpn', 'ovpn', 'mozilla vpn', 'astrill', 'purevpn',
  'digitalocean', 'amazon', 'aws', 'google cloud', 'microsoft azure',
  'linode', 'akamai connected', 'vultr', 'hetzner', 'ovh', 'scaleway',
  'choopa', 'quadranet', 'psychz', 'leaseweb', 'serverius', 'm247',
  'datacamp', 'frantech', 'buyvm', 'hostinger', 'contabo', 'ionos',
  'clouvider', 'hostwinds', 'ramnode', 'datapacket', 'cdn77',
  'cloudflare warp', 'warp', 'one.one', '1.1.1.1',
  'tor exit', 'tor relay', 'tor project',
];

const ENCRYPTED_DNS_PROVIDERS = [
  'cloudflare', 'google', 'quad9', 'nextdns', 'adguard', 'opendns',
  'cisco umbrella', 'cleanbrowsing', 'dns.sb', 'mullvad',
];

function detectVPN(asOrg, asn) {
  if (!asOrg) return { vpn: false, confidence: 'low', reason: 'no ASN data' };
  const orgLower = asOrg.toLowerCase();
  const vpnProviders = [
    'mullvad', 'nordvpn', 'nord-vpn', 'expressvpn', 'surfshark', 'cyberghost',
    'private internet access', 'protonvpn', 'proton vpn', 'proton ag',
    'ivpn', 'windscribe', 'torguard', 'airvpn', 'hide.me', 'hotspot shield',
    'tunnelbear', 'zenmate', 'ipvanish', 'strongvpn', 'vyprvpn', 'perfect privacy',
    'azirevpn', 'ovpn', 'mozilla vpn', 'astrill', 'purevpn',
    'cloudflare warp', 'warp',
  ];
  for (const kw of vpnProviders) {
    if (orgLower.includes(kw)) {
      return { vpn: true, confidence: 'high', reason: `VPN provider: ${asOrg}`, provider: kw };
    }
  }
  const datacenterKws = [
    'digitalocean', 'amazon', 'aws', 'google cloud', 'microsoft azure',
    'linode', 'akamai connected', 'vultr', 'hetzner', 'ovh', 'scaleway',
    'choopa', 'quadranet', 'psychz', 'leaseweb', 'serverius', 'm247',
    'datacamp', 'frantech', 'buyvm', 'hostinger', 'contabo', 'ionos',
    'clouvider', 'hostwinds', 'ramnode', 'datapacket', 'cdn77',
  ];
  for (const kw of datacenterKws) {
    if (orgLower.includes(kw)) {
      return { vpn: true, confidence: 'medium', reason: `Datacenter IP: ${asOrg}`, provider: kw };
    }
  }
  if (orgLower.includes('tor exit') || orgLower.includes('tor relay') || orgLower.includes('tor project')) {
    return { vpn: true, confidence: 'high', reason: 'Tor network', tor: true };
  }
  return { vpn: false, confidence: 'medium', reason: `Residential ISP: ${asOrg}` };
}

// ── TRACKER MAP: Known tracker database (100+ domains) ──────────────────

const TRACKER_DB = {
  // ── ANALYTICS ──
  'google-analytics.com':     { name: 'Google Analytics', category: 'analytics' },
  'analytics.google.com':     { name: 'Google Analytics', category: 'analytics' },
  'googletagmanager.com':     { name: 'Google Tag Manager', category: 'analytics' },
  'tagmanager.google.com':    { name: 'Google Tag Manager', category: 'analytics' },
  'chartbeat.com':            { name: 'Chartbeat', category: 'analytics' },
  'static.chartbeat.com':     { name: 'Chartbeat', category: 'analytics' },
  'hotjar.com':               { name: 'Hotjar', category: 'analytics' },
  'static.hotjar.com':        { name: 'Hotjar', category: 'analytics' },
  'script.hotjar.com':        { name: 'Hotjar', category: 'analytics' },
  'mixpanel.com':             { name: 'Mixpanel', category: 'analytics' },
  'cdn.mxpnl.com':            { name: 'Mixpanel', category: 'analytics' },
  'segment.com':              { name: 'Segment', category: 'analytics' },
  'cdn.segment.com':          { name: 'Segment', category: 'analytics' },
  'api.segment.io':           { name: 'Segment', category: 'analytics' },
  'amplitude.com':            { name: 'Amplitude', category: 'analytics' },
  'cdn.amplitude.com':        { name: 'Amplitude', category: 'analytics' },
  'heap.io':                  { name: 'Heap Analytics', category: 'analytics' },
  'cdn.heapanalytics.com':    { name: 'Heap Analytics', category: 'analytics' },
  'nr-data.net':              { name: 'New Relic', category: 'analytics' },
  'js-agent.newrelic.com':    { name: 'New Relic', category: 'analytics' },
  'bam.nr-data.net':          { name: 'New Relic', category: 'analytics' },
  'plausible.io':             { name: 'Plausible', category: 'analytics' },
  'fathom.io':                { name: 'Fathom', category: 'analytics' },
  'usefathom.com':            { name: 'Fathom', category: 'analytics' },
  'matomo.org':               { name: 'Matomo', category: 'analytics' },
  'pendo.io':                 { name: 'Pendo', category: 'analytics' },
  'cdn.pendo.io':             { name: 'Pendo', category: 'analytics' },
  'fullstory.com':            { name: 'FullStory', category: 'analytics' },
  'rs.fullstory.com':         { name: 'FullStory', category: 'analytics' },
  'mouseflow.com':            { name: 'Mouseflow', category: 'analytics' },
  'cdn.mouseflow.com':        { name: 'Mouseflow', category: 'analytics' },
  'crazyegg.com':             { name: 'Crazy Egg', category: 'analytics' },
  'script.crazyegg.com':      { name: 'Crazy Egg', category: 'analytics' },
  'luckyorange.com':          { name: 'Lucky Orange', category: 'analytics' },
  'cdn.luckyorange.com':      { name: 'Lucky Orange', category: 'analytics' },
  'kissmetrics.com':          { name: 'Kissmetrics', category: 'analytics' },
  'clarity.ms':               { name: 'Microsoft Clarity', category: 'analytics' },
  'www.clarity.ms':           { name: 'Microsoft Clarity', category: 'analytics' },
  'sentry.io':                { name: 'Sentry', category: 'analytics' },
  'browser.sentry-cdn.com':   { name: 'Sentry', category: 'analytics' },
  'bugsnag.com':              { name: 'Bugsnag', category: 'analytics' },
  'd2wy8f7a9ursnm.cloudfront.net': { name: 'Bugsnag', category: 'analytics' },
  'logrocket.com':            { name: 'LogRocket', category: 'analytics' },
  'cdn.lr-ingest.com':        { name: 'LogRocket', category: 'analytics' },
  'smartlook.com':            { name: 'Smartlook', category: 'analytics' },
  'rec.smartlook.com':        { name: 'Smartlook', category: 'analytics' },

  // ── ADVERTISING ──
  'doubleclick.net':          { name: 'Google Ads (DoubleClick)', category: 'advertising' },
  'ad.doubleclick.net':       { name: 'Google Ads (DoubleClick)', category: 'advertising' },
  'googlesyndication.com':    { name: 'Google AdSense', category: 'advertising' },
  'pagead2.googlesyndication.com': { name: 'Google AdSense', category: 'advertising' },
  'googleadservices.com':     { name: 'Google Ads', category: 'advertising' },
  'www.googleadservices.com': { name: 'Google Ads', category: 'advertising' },
  'google.com/ads':           { name: 'Google Ads', category: 'advertising' },
  'amazon-adsystem.com':      { name: 'Amazon Ads', category: 'advertising' },
  'aax.amazon-adsystem.com':  { name: 'Amazon Ads', category: 'advertising' },
  'criteo.com':               { name: 'Criteo', category: 'advertising' },
  'static.criteo.net':        { name: 'Criteo', category: 'advertising' },
  'adsrvr.org':               { name: 'The Trade Desk', category: 'advertising' },
  'match.adsrvr.org':         { name: 'The Trade Desk', category: 'advertising' },
  'adnxs.com':                { name: 'Xandr (AppNexus)', category: 'advertising' },
  'ib.adnxs.com':             { name: 'Xandr (AppNexus)', category: 'advertising' },
  'pubmatic.com':             { name: 'PubMatic', category: 'advertising' },
  'ads.pubmatic.com':         { name: 'PubMatic', category: 'advertising' },
  'rubiconproject.com':       { name: 'Magnite (Rubicon)', category: 'advertising' },
  'fastlane.rubiconproject.com': { name: 'Magnite (Rubicon)', category: 'advertising' },
  'openx.com':                { name: 'OpenX', category: 'advertising' },
  'openx.net':                { name: 'OpenX', category: 'advertising' },
  'taboola.com':              { name: 'Taboola', category: 'advertising' },
  'cdn.taboola.com':          { name: 'Taboola', category: 'advertising' },
  'outbrain.com':             { name: 'Outbrain', category: 'advertising' },
  'widgets.outbrain.com':     { name: 'Outbrain', category: 'advertising' },
  'media.net':                { name: 'Media.net', category: 'advertising' },
  'static.media.net':         { name: 'Media.net', category: 'advertising' },
  'moatads.com':              { name: 'Moat (Oracle)', category: 'advertising' },
  'z.moatads.com':            { name: 'Moat (Oracle)', category: 'advertising' },
  'bidswitch.net':            { name: 'Bidswitch', category: 'advertising' },
  'casalemedia.com':          { name: 'Index Exchange', category: 'advertising' },
  'sharethrough.com':         { name: 'Sharethrough', category: 'advertising' },
  'triplelift.com':           { name: 'TripleLift', category: 'advertising' },
  'contextweb.com':           { name: 'PulsePoint', category: 'advertising' },
  'spotxchange.com':          { name: 'SpotX', category: 'advertising' },
  'sovrn.com':                { name: 'Sovrn', category: 'advertising' },
  'lijit.com':                { name: 'Sovrn', category: 'advertising' },
  'yieldmo.com':              { name: 'YieldMo', category: 'advertising' },
  'quantserve.com':           { name: 'Quantcast', category: 'advertising' },
  'pixel.quantserve.com':     { name: 'Quantcast', category: 'advertising' },
  'richaudience.com':         { name: 'Rich Audience', category: 'advertising' },
  'smartadserver.com':        { name: 'Equativ (Smart)', category: 'advertising' },
  'gumgum.com':               { name: 'GumGum', category: 'advertising' },

  // ── TRACKING PIXELS ──
  'facebook.com/tr':          { name: 'Meta Pixel', category: 'pixel' },
  'connect.facebook.net':     { name: 'Meta Pixel / SDK', category: 'pixel' },
  'www.facebook.com/tr':      { name: 'Meta Pixel', category: 'pixel' },
  'bat.bing.com':             { name: 'Microsoft UET', category: 'pixel' },
  'snap.licdn.com':           { name: 'LinkedIn Insight Tag', category: 'pixel' },
  'analytics.tiktok.com':     { name: 'TikTok Pixel', category: 'pixel' },
  'pinterest.com/ct':         { name: 'Pinterest Tag', category: 'pixel' },
  'ct.pinterest.com':         { name: 'Pinterest Tag', category: 'pixel' },
  'reddit.com/pixel':         { name: 'Reddit Pixel', category: 'pixel' },
  'alb.reddit.com':           { name: 'Reddit Pixel', category: 'pixel' },
  't.co':                     { name: 'X (Twitter) Pixel', category: 'pixel' },
  'analytics.twitter.com':    { name: 'X (Twitter) Analytics', category: 'pixel' },
  'static.ads-twitter.com':   { name: 'X (Twitter) Ads', category: 'pixel' },
  'ads.linkedin.com':         { name: 'LinkedIn Ads', category: 'pixel' },
  'px.ads.linkedin.com':      { name: 'LinkedIn Pixel', category: 'pixel' },
  'sp.analytics.yahoo.com':   { name: 'Yahoo Analytics', category: 'pixel' },
  'pixel.wp.com':             { name: 'WordPress Stats', category: 'pixel' },
  'stats.wp.com':             { name: 'WordPress Stats', category: 'pixel' },
  'pixel.facebook.com':       { name: 'Meta Pixel', category: 'pixel' },
  'tr.snapchat.com':          { name: 'Snapchat Pixel', category: 'pixel' },
  'sc-static.net':            { name: 'Snapchat Pixel', category: 'pixel' },

  // ── SOCIAL WIDGETS ──
  'platform.twitter.com':     { name: 'Twitter Widgets', category: 'social' },
  'platform.linkedin.com':    { name: 'LinkedIn Widgets', category: 'social' },
  'apis.google.com':          { name: 'Google APIs', category: 'social' },
  'widgets.pinterest.com':    { name: 'Pinterest Widgets', category: 'social' },
  'platform.instagram.com':   { name: 'Instagram Embed', category: 'social' },
  'www.instagram.com':        { name: 'Instagram Embed', category: 'social' },
  'embed.reddit.com':         { name: 'Reddit Embed', category: 'social' },
  'player.vimeo.com':         { name: 'Vimeo Player', category: 'social' },
  'www.youtube.com':          { name: 'YouTube Embed', category: 'social' },
  'www.tiktok.com':           { name: 'TikTok Embed', category: 'social' },
  'disqus.com':               { name: 'Disqus Comments', category: 'social' },
  'c.disquscdn.com':          { name: 'Disqus Comments', category: 'social' },

  // ── A/B TESTING ──
  'optimizely.com':           { name: 'Optimizely', category: 'ab_testing' },
  'cdn.optimizely.com':       { name: 'Optimizely', category: 'ab_testing' },
  'logx.optimizely.com':      { name: 'Optimizely', category: 'ab_testing' },
  'vwo.com':                  { name: 'VWO', category: 'ab_testing' },
  'dev.visualwebsiteoptimizer.com': { name: 'VWO', category: 'ab_testing' },
  'launchdarkly.com':         { name: 'LaunchDarkly', category: 'ab_testing' },
  'app.launchdarkly.com':     { name: 'LaunchDarkly', category: 'ab_testing' },
  'split.io':                 { name: 'Split.io', category: 'ab_testing' },
  'cdn.split.io':             { name: 'Split.io', category: 'ab_testing' },
  'statsig.com':              { name: 'Statsig', category: 'ab_testing' },
  'featuregates.org':         { name: 'Statsig', category: 'ab_testing' },
  'abtasty.com':              { name: 'AB Tasty', category: 'ab_testing' },
  'kameleoon.com':            { name: 'Kameleoon', category: 'ab_testing' },
  'convertkit.com':           { name: 'ConvertKit', category: 'ab_testing' },

  // ── CDN / UTILITY (benign) ──
  'cdn.cloudflare.com':       { name: 'Cloudflare CDN', category: 'cdn' },
  'cdnjs.cloudflare.com':     { name: 'Cloudflare CDNJS', category: 'cdn' },
  'challenges.cloudflare.com':{ name: 'Cloudflare Security', category: 'cdn' },
  'cloudfront.net':           { name: 'AWS CloudFront', category: 'cdn' },
  'jsdelivr.net':             { name: 'jsDelivr CDN', category: 'cdn' },
  'cdn.jsdelivr.net':         { name: 'jsDelivr CDN', category: 'cdn' },
  'unpkg.com':                { name: 'UNPKG CDN', category: 'cdn' },
  'ajax.googleapis.com':      { name: 'Google Hosted Libraries', category: 'cdn' },
  'fonts.googleapis.com':     { name: 'Google Fonts', category: 'cdn' },
  'fonts.gstatic.com':        { name: 'Google Fonts', category: 'cdn' },
  'stackpath.bootstrapcdn.com': { name: 'BootstrapCDN', category: 'cdn' },
  'maxcdn.bootstrapcdn.com':  { name: 'BootstrapCDN', category: 'cdn' },
  'code.jquery.com':          { name: 'jQuery CDN', category: 'cdn' },
  'cdn.shopify.com':          { name: 'Shopify CDN', category: 'cdn' },
  'use.fontawesome.com':      { name: 'Font Awesome', category: 'cdn' },
  'ka-f.fontawesome.com':     { name: 'Font Awesome', category: 'cdn' },
  'cdn.polyfill.io':          { name: 'Polyfill.io', category: 'cdn' },
  'polyfill.io':              { name: 'Polyfill.io', category: 'cdn' },
  'use.typekit.net':          { name: 'Adobe Fonts', category: 'cdn' },
  'p.typekit.net':            { name: 'Adobe Fonts', category: 'cdn' },
};

const CATEGORY_META = {
  analytics:  { icon: '📊', label: 'ANALYTICS', severity: 8 },
  advertising:{ icon: '🎯', label: 'ADVERTISING', severity: 12 },
  pixel:      { icon: '👁️', label: 'TRACKING PIXELS', severity: 10 },
  ab_testing: { icon: '🧪', label: 'A/B TESTING', severity: 5 },
  social:     { icon: '📱', label: 'SOCIAL', severity: 6 },
  cdn:        { icon: '🔧', label: 'CDN/UTILITY', severity: 0 },
  unknown:    { icon: '❓', label: 'UNKNOWN THIRD-PARTY', severity: 3 },
};

function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch {
    // Try adding protocol
    try {
      const u = new URL('https://' + url);
      return u.hostname.toLowerCase();
    } catch {
      return null;
    }
  }
}

function categorizeTracker(domain) {
  // Exact match
  if (TRACKER_DB[domain]) return TRACKER_DB[domain];
  // Try parent domain (strip first subdomain)
  const parts = domain.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join('.');
    if (TRACKER_DB[parent]) return TRACKER_DB[parent];
  }
  return null;
}

function parseHTML(html, siteHostname) {
  const resources = [];
  const seenDomains = new Set();

  // Extract script src
  const scriptRe = /<script[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const url = m[1];
    const domain = extractDomain(url);
    if (domain && domain !== siteHostname && !domain.endsWith('.' + siteHostname)) {
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        resources.push({ type: 'script', url, domain });
      }
    }
  }

  // Extract img src (potential tracking pixels)
  const imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const url = m[1];
    const domain = extractDomain(url);
    if (domain && domain !== siteHostname && !domain.endsWith('.' + siteHostname)) {
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        resources.push({ type: 'img', url, domain });
      }
    }
  }

  // Extract iframe src
  const iframeRe = /<iframe[^>]+src=["']([^"']+)["']/gi;
  while ((m = iframeRe.exec(html)) !== null) {
    const url = m[1];
    const domain = extractDomain(url);
    if (domain && domain !== siteHostname && !domain.endsWith('.' + siteHostname)) {
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        resources.push({ type: 'iframe', url, domain });
      }
    }
  }

  // Extract link preconnect/prefetch/dns-prefetch
  const linkRe = /<link[^>]+(?:rel=["'](?:preconnect|prefetch|dns-prefetch)["'])[^>]+href=["']([^"']+)["']/gi;
  while ((m = linkRe.exec(html)) !== null) {
    const url = m[1];
    const domain = extractDomain(url);
    if (domain && domain !== siteHostname && !domain.endsWith('.' + siteHostname)) {
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        resources.push({ type: 'preconnect', url, domain });
      }
    }
  }
  // Also match reverse order (href before rel)
  const linkRe2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:preconnect|prefetch|dns-prefetch)["']/gi;
  while ((m = linkRe2.exec(html)) !== null) {
    const url = m[1];
    const domain = extractDomain(url);
    if (domain && domain !== siteHostname && !domain.endsWith('.' + siteHostname)) {
      if (!seenDomains.has(domain)) {
        seenDomains.add(domain);
        resources.push({ type: 'preconnect', url, domain });
      }
    }
  }

  return resources;
}

async function handleTrackerMap(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  let targetUrl = (body.url || '').trim();
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Normalize URL
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  let siteHostname;
  try {
    siteHostname = new URL(targetUrl).hostname.toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Fetch the target page
  let html;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const resp = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `Site returned HTTP ${resp.status}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    html = await resp.text();
  } catch (err) {
    const msg = err.name === 'AbortError' ? 'Request timed out (10s)' : `Failed to fetch: ${err.message}`;
    return new Response(JSON.stringify({ error: msg }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Parse and categorize
  const resources = parseHTML(html, siteHostname);
  const categorized = {};

  for (const res of resources) {
    const match = categorizeTracker(res.domain);
    const category = match ? match.category : 'unknown';
    const name = match ? match.name : res.domain;

    if (!categorized[category]) categorized[category] = [];
    categorized[category].push({
      domain: res.domain,
      name: name,
      type: res.type,
      url: res.url,
    });
  }

  // Calculate surveillance score
  let score = 0;
  let totalTrackers = 0;
  const uniqueCompanies = new Set();
  for (const [cat, items] of Object.entries(categorized)) {
    const meta = CATEGORY_META[cat] || CATEGORY_META.unknown;
    for (const item of items) {
      score += meta.severity;
      totalTrackers++;
      uniqueCompanies.add(item.name);
    }
  }
  score = Math.min(Math.round(score), 100);

  let severity;
  if (score >= 70) severity = 'CRITICAL';
  else if (score >= 45) severity = 'HIGH';
  else if (score >= 20) severity = 'MODERATE';
  else severity = 'LOW';

  return new Response(JSON.stringify({
    url: targetUrl,
    hostname: siteHostname,
    totalTrackers,
    uniqueCompanies: uniqueCompanies.size,
    surveillanceScore: score,
    severity,
    categories: categorized,
    categoryMeta: CATEGORY_META,
    scannedAt: new Date().toISOString(),
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

// ── MAIN HANDLER ──────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
      'https://privacyterminal.pages.dev',
      'https://privacyterminal.com',
      'https://www.privacyterminal.com',
      'http://localhost:4321',
      'http://localhost:3000'
    ];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Tracker Map endpoint
    if (url.pathname === '/tracker-map' || url.pathname === '/tracker-map/') {
      return handleTrackerMap(request, corsHeaders);
    }

    if (url.pathname === '/ip' || url.pathname === '/ip/') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const country = request.headers.get('CF-IPCountry') || 'unknown';
      const colo = request.cf?.colo || 'unknown';
      const asn = request.cf?.asn || 'unknown';
      const asOrg = request.cf?.asOrganization || 'unknown';
      const city = request.cf?.city || 'unknown';
      const region = request.cf?.region || 'unknown';
      const timezone = request.cf?.timezone || 'unknown';
      const postalCode = request.cf?.postalCode || 'unknown';
      const isEU = request.cf?.isEUCountry === '1';
      const httpProtocol = request.cf?.httpProtocol || 'unknown';
      const tlsVersion = request.cf?.tlsVersion || 'unknown';
      const vpnResult = detectVPN(asOrg, asn);

      return new Response(JSON.stringify({
        ip, country, city, region, postalCode, timezone,
        asn: String(asn), asOrg, colo, isEU, httpProtocol, tlsVersion,
        vpn: vpnResult.vpn,
        proxy: vpnResult.vpn && vpnResult.confidence === 'medium',
        tor: vpnResult.tor || false,
        vpnConfidence: vpnResult.confidence,
        vpnReason: vpnResult.reason,
        vpnProvider: vpnResult.provider || null,
        datacenter: vpnResult.confidence === 'medium' && vpnResult.vpn,
        timestamp: new Date().toISOString(),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    if (url.pathname === '/dns-check' || url.pathname === '/dns-check/') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const asOrg = request.cf?.asOrganization || 'unknown';
      const asn = request.cf?.asn || 'unknown';
      const colo = request.cf?.colo || 'unknown';
      const httpProtocol = request.cf?.httpProtocol || 'unknown';
      const tlsVersion = request.cf?.tlsVersion || 'unknown';
      const vpnResult = detectVPN(asOrg, asn);
      const isModernTLS = tlsVersion === 'TLSv1.3';

      let dnsAssessment = 'unknown';
      let encrypted = false;
      let resolver = asOrg;
      let detail = '';

      if (vpnResult.vpn) {
        dnsAssessment = 'vpn-tunneled';
        encrypted = true;
        resolver = vpnResult.provider || asOrg;
        detail = 'DNS queries routed through VPN tunnel';
      } else {
        dnsAssessment = 'isp-likely';
        encrypted = false;
        resolver = asOrg;
        detail = 'Connection via residential ISP. Use browser DNS-over-HTTPS settings for protection.';
      }

      return new Response(JSON.stringify({
        resolverIP: ip, resolver, dnsAssessment, encrypted,
        vpnTunneled: vpnResult.vpn, asOrg, asn: String(asn), colo,
        tlsVersion, httpProtocol, isModernTLS, detail,
        note: 'DNS resolver detection requires authoritative DNS infrastructure. This check uses connection metadata as a heuristic.',
        timestamp: new Date().toISOString(),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    return new Response(JSON.stringify({
      service: 'Privacy Terminal API',
      version: '3.0.0',
      endpoints: ['/ip', '/dns-check', '/tracker-map'],
      privacy: 'No data is stored. No logs are kept.',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};
