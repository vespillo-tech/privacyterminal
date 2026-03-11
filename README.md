# Privacy Terminal

**Open-source privacy tools and education. No tracking. No cookies. No servers.**

🔗 [privacyterminal.com](https://privacyterminal.com)

---

## What is this?

Privacy Terminal is a collection of browser-based privacy tools and educational guides designed to help you understand and reduce your digital footprint.

Every tool runs entirely in your browser — your data never touches our servers. Every guide presents the full landscape of options with honest trade-offs. Every line of code is publicly auditable.

## Tools

| Tool | Description |
|------|-------------|
| **Browser Fingerprint Analyzer** | See what makes your browser uniquely identifiable |
| **WebRTC Leak Detector** | Check if your real IP leaks through WebRTC |
| **Email Header Analyzer** | Trace the path and authenticity of any email |
| **Hash Generator** | Generate SHA-256, SHA-512, MD5 and other hashes client-side |
| **Metadata Stripper** | Remove EXIF/GPS data from images before sharing |
| **Threat Profiler** | Assess your personal threat model interactively |

All tools run 100% client-side. Open DevTools → Network tab to verify.

## Guides

15 in-depth privacy guides organized by difficulty:

**Foundations** — How tracking works, who wants your data, threat modeling
**Essentials** — VPNs, encrypted messaging, browser choices
**Intermediate** — Password managers, email privacy, DNS encryption, phone tracking, data broker opt-outs
**Advanced** — Browser fingerprinting deep-dives, private search, myth-busting

Every guide shows the full spectrum of options — from free and easy to advanced and thorough.

## Tech Stack

- **Framework:** [Astro](https://astro.build) (static site generation)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **CMS:** [Keystatic](https://keystatic.com) (git-based content management)
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com) (free tier)
- **Font:** JetBrains Mono
- **Crypto:** Web Crypto API (browser-native)

Zero external JavaScript. Zero tracking scripts. Zero cookies.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/vespillo-tech/privacyterminal.git
cd privacyterminal

# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/           # Routes (tools, guides, about)
│   └── tools/       # Interactive privacy tools
├── content/
│   ├── guides/      # Markdown guide content
│   ├── tools/       # Tool metadata (YAML)
│   ├── achievements/# Gamification achievements
│   └── site/        # Site config, nav, homepage content
├── layouts/         # Base, Guide, and Tool layouts
├── components/      # Shared Astro components
├── scripts/         # Client-side TypeScript
└── styles/          # Global CSS + Tailwind
public/
├── fonts/           # Self-hosted JetBrains Mono
├── images/          # Static assets
└── .well-known/     # security.txt
```

## Content Management

Guides and site content are managed through Keystatic. See [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) for details on adding and editing content.

## Privacy Commitments

- ✅ No tracking scripts or analytics
- ✅ No cookies
- ✅ No external requests from tools
- ✅ No user data collection
- ✅ No third-party JavaScript
- ✅ All tools run client-side
- ✅ CSP headers block external connections
- ✅ Source code is public and unobfuscated

## License

This project uses a dual license:

- **Code** (layouts, components, tools, scripts, styles, configuration) — [AGPL-3.0](LICENSE)
- **Content** (guides, educational text in `src/content/guides/`) — [CC BY-NC-SA 4.0](LICENSE-CONTENT)

See [LICENSE](LICENSE) and [LICENSE-CONTENT](LICENSE-CONTENT) for full terms.

## Security

Found a vulnerability? See [security.txt](https://privacyterminal.com/.well-known/security.txt) for contact details.

---

*Built with the belief that privacy education should be free, transparent, and verifiable.*
