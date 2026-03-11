/**
 * Privacy Terminal — Analytics Stats API
 * GET /api/stats
 *
 * Auth: X-Stats-Key header must match STATS_SECRET env var.
 * Query params:
 *   days  (int 1-365, default 30) — lookback window
 *   path  (string, optional)      — filter by path prefix
 */

interface Env {
  DB: D1Database;
  STATS_SECRET?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // Only allow GET
  if (context.request.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Auth check
  const secret = context.env.STATS_SECRET;
  const provided = context.request.headers.get('x-stats-key');
  if (!secret || !provided || provided !== secret) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Parse query params
  const url = new URL(context.request.url);
  const daysParam = parseInt(url.searchParams.get('days') || '30', 10);
  const days = Math.max(1, Math.min(365, isNaN(daysParam) ? 30 : daysParam));
  const pathFilter = url.searchParams.get('path') || null;

  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 19).replace('T', ' ');

  try {
    const db = context.env.DB;
    const pathClause = pathFilter ? ` AND path LIKE ?` : '';
    const baseParams = pathFilter ? [since, pathFilter + '%'] : [since];

    // Summary
    const summary = await db
      .prepare(
        `SELECT COUNT(*) as total_views, ROUND(AVG(response_time_ms), 1) as avg_response_ms
         FROM page_views WHERE created_at >= ?${pathClause}`
      )
      .bind(...baseParams)
      .first();

    // By path (top 50)
    const byPath = await db
      .prepare(
        `SELECT path, COUNT(*) as views
         FROM page_views WHERE created_at >= ?${pathClause}
         GROUP BY path ORDER BY views DESC LIMIT 50`
      )
      .bind(...baseParams)
      .all();

    // By country (top 30)
    const byCountry = await db
      .prepare(
        `SELECT country, COUNT(*) as views
         FROM page_views WHERE created_at >= ? AND country IS NOT NULL${pathClause}
         GROUP BY country ORDER BY views DESC LIMIT 30`
      )
      .bind(...baseParams)
      .all();

    // By device
    const byDevice = await db
      .prepare(
        `SELECT device_type, COUNT(*) as views
         FROM page_views WHERE created_at >= ?${pathClause}
         GROUP BY device_type ORDER BY views DESC`
      )
      .bind(...baseParams)
      .all();

    // By referer (top 20, external only)
    const byReferer = await db
      .prepare(
        `SELECT referer, COUNT(*) as views
         FROM page_views WHERE created_at >= ? AND referer IS NOT NULL AND referer NOT LIKE '%privacyterminal.com%'${pathClause}
         GROUP BY referer ORDER BY views DESC LIMIT 20`
      )
      .bind(...baseParams)
      .all();

    // Daily views
    const daily = await db
      .prepare(
        `SELECT DATE(created_at) as date, COUNT(*) as views
         FROM page_views WHERE created_at >= ?${pathClause}
         GROUP BY DATE(created_at) ORDER BY date DESC`
      )
      .bind(...baseParams)
      .all();

    return new Response(
      JSON.stringify(
        {
          ok: true,
          period: { days, since: since.slice(0, 10) },
          summary: summary || { total_views: 0, avg_response_ms: 0 },
          by_path: byPath.results,
          by_country: byCountry.results,
          by_device: byDevice.results,
          by_referer: byReferer.results,
          daily: daily.results,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal error', detail: String(err) }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
};
