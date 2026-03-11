/**
 * Privacy Terminal — Analytics Stats API
 * GET /api/stats
 *
 * Auth: X-Stats-Key header must match STATS_SECRET env var.
 * Set STATS_SECRET as a Cloudflare Pages secret via the dashboard.
 *
 * Query params:
 *   days  (int 1-365, default 30) — lookback window
 *   path  (string, optional)      — filter by path prefix, e.g. /guides
 */

// Always server-rendered — never pre-rendered as static HTML
export const prerender = false;

import type { APIRoute } from 'astro';

function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache',
      'x-robots-tag': 'noindex',
    },
  });
}

export const GET: APIRoute = async ({ request, locals }) => {

  // Auth
  const provided = request.headers.get('x-stats-key');
  const expected = locals.runtime?.env?.STATS_SECRET;
  if (!expected || !provided || provided !== expected) {
    return jsonRes({ error: 'Unauthorized' }, 401);
  }

  // Parse query params
  const url = new URL(request.url);
  const daysRaw = parseInt(url.searchParams.get('days') ?? '30', 10);
  const days = (isNaN(daysRaw) || daysRaw < 1 || daysRaw > 365) ? 30 : daysRaw;
  const pathFilter = url.searchParams.get('path') ?? '';

  const db = locals.runtime?.env?.DB;
  if (!db) return jsonRes({ error: 'Database unavailable' }, 503);

  try {
    const since = `datetime('now', '-${days} days')`;
    const pathCond = pathFilter ? 'AND path LIKE ?' : '';
    const pathBind: string[] = pathFilter ? [`${pathFilter}%`] : [];
    const bind = (s: D1PreparedStatement): D1PreparedStatement =>
      pathBind.length ? s.bind(...pathBind) : s;

    // Run all queries in parallel
    const [totalRow, byPath, byCountry, byDevice, daily, referers, perfRow] =
      await Promise.all([

        // 1. Total page views
        bind(db.prepare(
          `SELECT COUNT(*) AS total FROM page_views
           WHERE created_at > ${since} ${pathCond}`
        )).first<{ total: number }>(),

        // 2. Views by path (top 50)
        bind(db.prepare(
          `SELECT path, COUNT(*) AS views FROM page_views
           WHERE created_at > ${since} ${pathCond}
           GROUP BY path ORDER BY views DESC LIMIT 50`
        )).all<{ path: string; views: number }>(),

        // 3. Views by country (top 50)
        bind(db.prepare(
          `SELECT country, COUNT(*) AS views FROM page_views
           WHERE created_at > ${since} ${pathCond}
           GROUP BY country ORDER BY views DESC LIMIT 50`
        )).all<{ country: string | null; views: number }>(),

        // 4. Views by device type
        bind(db.prepare(
          `SELECT device_type, COUNT(*) AS views FROM page_views
           WHERE created_at > ${since} ${pathCond}
           GROUP BY device_type ORDER BY views DESC`
        )).all<{ device_type: string | null; views: number }>(),

        // 5. Daily views (most recent first)
        bind(db.prepare(
          `SELECT date(created_at) AS date, COUNT(*) AS views FROM page_views
           WHERE created_at > ${since} ${pathCond}
           GROUP BY date(created_at) ORDER BY date DESC`
        )).all<{ date: string; views: number }>(),

        // 6. Top referrers (non-empty, top 20)
        (() => {
          const rw = pathFilter
            ? `WHERE created_at > ${since} AND referer IS NOT NULL AND referer != '' AND path LIKE ?`
            : `WHERE created_at > ${since} AND referer IS NOT NULL AND referer != ''`;
          const s = db.prepare(
            `SELECT referer, COUNT(*) AS views FROM page_views ${rw}
             GROUP BY referer ORDER BY views DESC LIMIT 20`
          );
          return (pathBind.length ? s.bind(...pathBind) : s)
            .all<{ referer: string; views: number }>();
        })(),

        // 7. Performance stats
        bind(db.prepare(
          `SELECT ROUND(AVG(response_time_ms), 1) AS avg_ms, MAX(response_time_ms) AS max_ms
           FROM page_views WHERE created_at > ${since} ${pathCond}`
        )).first<{ avg_ms: number | null; max_ms: number | null }>(),

      ]);

    return jsonRes({
      ok: true,
      query: { days, path: pathFilter || null },
      summary: {
        total_views:     totalRow?.total ?? 0,
        avg_response_ms: perfRow?.avg_ms ?? null,
        max_response_ms: perfRow?.max_ms ?? null,
      },
      by_path:    byPath.results,
      by_country: byCountry.results,
      by_device:  byDevice.results,
      by_referer: referers.results,
      daily:      daily.results,
    });

  } catch (err) {
    console.error('[stats api] D1 error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
};

// Only GET is supported
export const POST: APIRoute = async () =>
  new Response('Method Not Allowed', { status: 405 });
