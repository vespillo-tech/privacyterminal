<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title" /> — RSS Feed</title>
        <style>
          body { font-family: monospace; background: #0a0a0a; color: #b0b0b0; max-width: 700px; margin: 2rem auto; padding: 1rem; }
          h1 { color: #00ff41; font-size: 1.2rem; }
          p.desc { color: #666; font-size: 0.85rem; margin-bottom: 2rem; }
          .item { border-top: 1px solid #222; padding: 0.75rem 0; }
          .item a { color: #00d4ff; text-decoration: none; }
          .item a:hover { color: #00ff41; }
          .date { color: #555; font-size: 0.75rem; }
          .note { color: #444; font-size: 0.75rem; margin-bottom: 1.5rem; padding: 0.5rem; border: 1px solid #222; }
        </style>
      </head>
      <body>
        <h1>📡 <xsl:value-of select="rss/channel/title" /></h1>
        <p class="desc"><xsl:value-of select="rss/channel/description" /></p>
        <div class="note">This is an RSS feed. Copy the URL into your RSS reader to subscribe.</div>
        <xsl:for-each select="rss/channel/item">
          <div class="item">
            <a href="{link}"><xsl:value-of select="title" /></a>
            <div class="date"><xsl:value-of select="pubDate" /></div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
