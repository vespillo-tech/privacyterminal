# Privacy Terminal — Content Management Guide

> Last updated: 2026-03-09
> For: All agents working on this site

## ⚠️ IMPORTANT: Content Lives in YAML/Markdown Files, NOT in Code

As of March 2026, **all site content is managed through structured content files**, not hardcoded in Astro components. If you need to change what the site says, shows, or how gamification works — **edit the content files, not the component code**.

## 📁 Content File Locations

All content lives under `src/content/`:

```
src/content/
├── guides/              # Markdown guides (the main articles)
│   ├── how-youre-being-tracked.md
│   ├── browser-fingerprinting-explained.md
│   └── ... (8 total)
├── achievements/        # YAML — gamification achievements
│   ├── first-boot.yaml
│   ├── first-scan.yaml
│   └── ... (8 total)
├── tools/               # YAML — tool catalog entries
│   ├── threat-profiler.yaml
│   ├── hash-generator.yaml
│   └── ... (7 total)
└── site/                # YAML — site-wide singletons
    ├── game-config.yaml     # Levels, point values, API URL
    ├── site-settings.yaml   # Site name, version, URLs, meta
    ├── navigation.yaml      # Nav menu items and order
    ├── homepage.yaml        # Hero cards, boot messages, promises
    ├── about-page.yaml      # Principles, transparency, verification
    └── auth-copy.yaml       # All login/register modal text
```

## 🔧 Common Tasks — What File to Edit

| Task | File to edit |
|------|-------------|
| Add a new guide | Create `src/content/guides/my-new-guide.md` with proper frontmatter |
| Edit guide content | Edit the `.md` file directly |
| Add a new achievement | Create `src/content/achievements/my-achievement.yaml` |
| Change achievement points | Edit the `.yaml` file, change `points:` value |
| Add a new tool | Create `src/content/tools/my-tool.yaml` |
| Change tool status (soon→ready) | Edit tool yaml, change `status: ready` |
| Change level names/thresholds | Edit `src/content/site/game-config.yaml` |
| Change points per guide/tool | Edit `src/content/site/game-config.yaml` |
| Edit homepage hero cards | Edit `src/content/site/homepage.yaml` |
| Change nav menu items | Edit `src/content/site/navigation.yaml` |
| Edit about page | Edit `src/content/site/about-page.yaml` |
| Change login modal text | Edit `src/content/site/auth-copy.yaml` |
| Change site name/version | Edit `src/content/site/site-settings.yaml` |

## 📝 Content File Formats

### Guides (Markdown with frontmatter)
```markdown
---
title: "Guide Title"
description: "Short description for SEO and cards"
category: "foundations"   # foundations | essentials | intermediate | advanced
order: 1
tags: ["tag1", "tag2"]
relatedTools: ["tool-slug"]
relatedGuides: ["guide-slug"]
draft: false
---

# Guide content here in markdown...
```

### Achievements (YAML)
```yaml
id: ACHIEVEMENT_ID       # UPPER_SNAKE_CASE, must be unique
name: DISPLAY NAME       # Shown in toast popup
icon: "[*]"              # Terminal-style icon
description: What the user did to earn this
points: 25               # Score value
```

### Tools (YAML)
```yaml
title: Tool Display Name
description: What the tool does (shown on tools index page)
status: ready            # ready | soon
order: 1                 # Display order (lower = first)
```

## 🏗️ Build & Deploy Workflow

1. Edit content files
2. Run `npx astro build` to verify (from the privacyterminal directory)
3. `git add -A && git commit -m "content: description of change"`
4. `git push origin main`
5. Cloudflare Pages auto-deploys from main branch (~60s)

## 🚫 What NOT to Do

- **DON'T** hardcode content in `.astro` component files — use content files
- **DON'T** edit `privacy-score.ts` to change achievements/levels — edit the YAML files
- **DON'T** edit `pages/tools/index.astro` to add tools — create a new YAML file in `src/content/tools/`
- **DON'T** edit `pages/index.astro` to change homepage text — edit `src/content/site/homepage.yaml`

## 🔑 How Content Reaches the Browser

- **Static pages** (guides, tools, homepage, about): Astro reads YAML/MD at build time → renders HTML
- **Game data** (achievements, levels, points): Injected as `<script type="application/json" id="pt-game-data">` in BaseLayout → `privacy-score.ts` reads it at runtime
- **Keystatic admin** (`/keystatic`): Web UI that reads/writes the same content files via GitHub API

## 📊 Keystatic Admin Panel

The site has a CMS dashboard at `https://privacyterminal.com/keystatic` that the human owner uses to browse and edit content. It uses GitHub storage mode — edits create git commits automatically.

Agents should NOT use the Keystatic web UI. Edit files directly — it's faster and more reliable.

## 🗂️ Schema Reference

- Content schemas defined in: `src/content.config.ts`
- Keystatic field definitions: `keystatic.config.ts`
- If adding a new collection, update BOTH files
