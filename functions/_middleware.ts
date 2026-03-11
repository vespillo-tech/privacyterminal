/**
 * Privacy Terminal — Server-Side Analytics Middleware
 * Cloudflare Pages Function — runs at the edge on every request.
 *
 * Zero browser impact: no headers, no cookies, no scripts.
 * D1 writes are fire-and-forget via context.waitUntil().
 * All errors silently swallowed — analytics NEVER breaks the site.
 */

interface Env {
  DB: D1Database;
  ANALYTICS: AnalyticsEngineDataset;
  STATS_SECRET?: string;
}

// Extensions we skip — no need to log static assets
const SKIP_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|avif|json|xml|txt|webmanifest)$/i;

// Paths we skip
const SKIP_PATHS = ['/cdn-cgi/', '/_astro/', '/fonts/', '/images/', '/favicon'];

// Common bot signatures
const BOT_PATTERNS = /bot|crawler|spider|slurp|bingpreview|mediapartners|apis-google|feedfetcher|lighthouse|pagespeed|pingdom|uptimerobot|headlesschrome|phantomjs/i;

function classifyDevice(ua: string): string {
  if (BOT_PATTERNS.test(ua)) return 'bot';
  if (/mobile|android.*mobile|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad|android(?!.*mobile)|kindle|silk/i.test(ua)) return 'tablet';
  return 'desktop';
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const start = Date.now();

  // Pass request through — get the response first, never block
  const response = await context.next();

  try {
    const url = new URL(context.request.url);
    const path = url.pathname;

    // Skip static assets
    if (SKIP_EXTENSIONS.test(path)) return response;
    if (SKIP_PATHS.some(p => path.startsWith(p))) return response;

    // Only log GET requests
    if (context.request.method !== 'GET') return response;

    // Only log HTML responses
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    // Skip bots
    const userAgent = context.request.headers.get('user-agent') || '';
    const deviceType = classifyDevice(userAgent);
    if (deviceType === 'bot') return response;

    const elapsed = Date.now() - start;

    // Extract Cloudflare request metadata
    const cf = (context.request as any).cf || {};
    const referer = context.request.headers.get('referer') || null;

    // Fire-and-forget: write to D1 + Analytics Engine
    context.waitUntil(
      logPageView(context.env, {
        path,
        method: 'GET',
        status: response.status,
        country: cf.country || null,
        city: cf.city || null,
        continent: cf.continent || null,
        region: cf.region || null,
        timezone: cf.timezone || null,
        asn: cf.asn ? Number(cf.asn) : null,
        colo: cf.colo || null,
        user_agent: userAgent.substring(0, 512),
        referer: referer ? referer.substring(0, 1024) : null,
        device_type: deviceType,
        content_type: 'text/html',
        response_time_ms: elapsed,
      })
    );
  } catch (_) {
    // Silently swallow — analytics must never break the site
  }

  return response;
};

interface PageViewData {
  path: string;
  method: string;
  status: number;
  country: string | null;
  city: string | null;
  continent: string | null;
  region: string | null;
  timezone: string | null;
  asn: number | null;
  colo: string | null;
  user_agent: string;
  referer: string | null;
  device_type: string;
  content_type: string;
  response_time_ms: number;
}

async function logPageView(env: Env, data: PageViewData): Promise<void> {
  const promises: Promise<unknown>[] = [];

  // Write to D1
  if (env.DB) {
    promises.push(
      env.DB.prepare(
        `INSERT INTO page_views (path, method, status, country, city, continent, region, timezone, asn, colo, user_agent, referer, device_type, content_type, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          data.path,
          data.method,
          data.status,
          data.country,
          data.city,
          data.continent,
          data.region,
          data.timezone,
          data.asn,
          data.colo,
          data.user_agent,
          data.referer,
          data.device_type,
          data.content_type,
          data.response_time_ms
        )
        .run()
        .catch(() => {}) // swallow D1 errors
    );
  }

  // Write to Analytics Engine
  if (env.ANALYTICS) {
    try {
      env.ANALYTICS.writeDataPoint({
        blobs: [
          data.path,
          data.country || '',
          data.device_type,
          data.referer || '',
          data.colo || '',
        ],
        doubles: [data.response_time_ms, data.status],
        indexes: [data.path],
      });
    } catch (_) {
      // swallow
    }
  }

  await Promise.allSettled(promises);
}
