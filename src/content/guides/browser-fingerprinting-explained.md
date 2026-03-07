---
title: "Browser Fingerprinting Explained"
description: "Your browser reveals more about you than you think. Understand how canvas, WebGL, audio, and behavioral fingerprinting work — and what you can realistically do about each one."
category: "foundations"
order: 5
tags: ["fingerprinting", "canvas", "webgl", "audio-fingerprint", "browser-privacy", "tracking", "entropy"]
relatedTools: ["fingerprint-analyzer"]
relatedGuides: ["how-youre-being-tracked", "choosing-a-browser-for-privacy"]
draft: false
---

# Browser Fingerprinting Explained

You can block cookies. You can clear your history. You can use incognito mode. And you can still be identified.

Browser fingerprinting is a tracking technique that identifies you not by storing anything on your device, but by reading what your device reveals about itself. Every time your browser loads a web page, it exposes dozens of technical details — your screen resolution, installed fonts, graphics hardware, audio processing characteristics, timezone, language settings, and more. Individually, these details are mundane. Combined, they create a profile so specific that it functions as a unique identifier.

Research by Laperdrix et al. found that approximately 33.6% of desktop browser fingerprints are completely unique — identifiable among millions of users. On mobile devices, the figure is lower (~18.5%) because hardware is more homogeneous, but it is still remarkably effective.

This guide explains exactly how each fingerprinting technique works, how much identifying power it carries, and what your realistic options are for reducing your exposure.

---

## How Fingerprinting Differs from Cookies

Cookies are *stored* on your device. You can see them, delete them, and block them. When you clear cookies or use a fresh browser profile, cookie-based tracking resets.

Fingerprinting *reads* your device. Nothing is stored. There is nothing to delete. Clearing your cookies, using incognito mode, or switching to a private browsing window does not change your fingerprint, because the fingerprint is derived from your device\'s characteristics — characteristics that remain the same across sessions.

This is what makes fingerprinting powerful and, from a privacy standpoint, insidious. It works silently, leaves no trace on your device, and cannot be defeated by the privacy tools most people know about.

---

## The Fingerprinting Vectors

Modern fingerprinting uses multiple data sources, each contributing bits of **entropy** — a measure of identifying information. The more bits of entropy a data point provides, the more it narrows down who you are. Around 33 bits of entropy is enough to uniquely identify a person among the entire world population.

Here are the major vectors, from most impactful to least.

### Canvas Fingerprinting

**How it works:** A website creates an invisible HTML5 `<canvas>` element and instructs your browser to draw specific text, shapes, and gradients on it. The browser renders this content using your operating system\'s graphics stack, your GPU, your installed fonts, and your display driver\'s anti-aliasing algorithms. The script then reads back the rendered pixels.

The result looks identical to the human eye across different machines. But at the pixel level, the rendering differs — subtly, consistently, and measurably. Different font smoothing, different sub-pixel rendering, different GPU architectures all produce slightly different output. The pixel data is hashed into a fingerprint value.

**Entropy:** ~5.7 bits on average.

**Who uses it:** Virtually every major ad tracking network. Studies have found canvas fingerprinting scripts on over 5% of the top 100,000 websites, and the number has grown.

**The technical process:**
1. Create a canvas element (e.g., 200×50 pixels)
2. Draw text in multiple fonts, sizes, and colors
3. Add geometric shapes with gradients and transparency
4. Call `canvas.toDataURL()` to extract the rendered image as a data string
5. Hash the result — this is the canvas fingerprint

### WebGL Fingerprinting

**How it works:** WebGL allows browsers to render 3D graphics using the device\'s GPU. A fingerprinting script asks the browser to draw a 3D scene and reads back both the rendered output (which varies by GPU, driver, and OS, just like canvas) and the WebGL metadata — GPU vendor, renderer string, supported extensions, shader precision formats, and maximum capabilities.

**Entropy:** High — the combination of GPU renderer string and rendering output achieves 98%+ accuracy in identification.

**What it reveals:** Your exact graphics card model, driver version, and rendering capabilities. A script calling `gl.getParameter(gl.RENDERER)` might return something like "ANGLE (NVIDIA GeForce RTX 4070 Ti Direct3D11 vs_5_0)" — a string that, combined with other data points, is highly identifying.

**Why it is hard to block:** WebGL is required for many websites, games, and applications. Disabling it entirely breaks significant web functionality.

### AudioContext Fingerprinting

**How it works:** The Web Audio API lets browsers generate, process, and analyze audio. A fingerprinting script creates an `AudioContext`, generates an audio signal (typically an oscillator), processes it through a compressor or other audio node, and reads the resulting waveform.

Different hardware, drivers, and operating system audio stacks process the signal slightly differently. These differences are consistent across sessions and distinctive enough to serve as an identifier.

**Entropy:** ~4.8 bits on average.

**What makes it effective:** Audio fingerprinting operates on a different hardware axis than canvas or WebGL. Even if two machines have identical screens and GPUs, their audio processing may differ. This makes it a valuable supplementary signal.

### Font Fingerprinting

**How it works:** Scripts measure the dimensions of text rendered in specific fonts. If a font is installed on your system, text rendered in that font will have predictable metrics. If it is not installed, the browser falls back to a default, and the metrics differ. By testing dozens or hundreds of fonts, the script determines which are installed on your machine.

Your installed font set is surprisingly unique. It depends on your operating system, language packs, applications you have installed (Adobe products add many fonts, as do Microsoft Office and various design tools), and any fonts you have manually added.

**Entropy:** Moderate individually, but highly complementary to other vectors.

### Screen and Hardware Fingerprinting

**How it works:** Your browser willingly reports a range of hardware characteristics through standard JavaScript APIs:

- Screen resolution and color depth (`screen.width`, `screen.height`, `screen.colorDepth`)
- Available screen area (excluding taskbar)
- Device pixel ratio (retina/HiDPI detection)
- Number of CPU cores (`navigator.hardwareConcurrency`)
- Available memory (`navigator.deviceMemory`)
- Timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`)
- Language and locale settings
- Platform identifier
- Touch capability and max touch points

Individually, each attribute has low entropy. A screen resolution of 1920×1080 is shared by millions of users. But the *combination* of resolution + color depth + pixel ratio + cores + memory + timezone + language + platform rapidly narrows the field.

### Network and Protocol Fingerprinting

**How it works:** Beyond what JavaScript reveals, the way your browser communicates leaks identifying information:

- **HTTP headers** — User-Agent string, accepted languages, encoding preferences, Do-Not-Track setting
- **TLS fingerprinting (JA3/JA4)** — The specific way your browser negotiates a TLS connection (cipher suites, extensions, elliptic curves) creates a network-level fingerprint that cannot be controlled by JavaScript settings
- **WebRTC** — If enabled, WebRTC can leak your real IP address even behind a VPN, and exposes local network interface information

---

## How Fingerprints Are Combined

No single vector uniquely identifies you. The power of fingerprinting is in combination.

Consider a simplified example:

| Attribute | Your Value | % of Users Sharing It |
|---|---|---|
| Screen resolution | 2560×1440 | 8% |
| Timezone | America/Denver | 3% |
| Language | en-US | 45% |
| CPU cores | 12 | 11% |
| GPU renderer | RTX 4070 Ti | 2% |
| Canvas hash | a7f2c9... | 0.4% |
| AudioContext hash | 3e8b1d... | 1.2% |
| Installed fonts | 347 fonts | 0.1% |

Each attribute alone leaves you in a crowd. But the intersection — someone with *this* resolution AND *this* timezone AND *this* GPU AND *this* canvas hash AND *this* font set — likely describes exactly one person. Or very few.

This is the **entropy addition principle**. Each independent data point adds bits of entropy, narrowing the pool of matching users exponentially. A fingerprinting system combining 15–20 attributes routinely achieves enough combined entropy to uniquely identify individual browsers among millions.

---

## The Countermeasure Landscape

There is no single solution to fingerprinting. But there is a spectrum of approaches, each with trade-offs. True to this site\'s principles, here is the full landscape — from least disruptive to most protective.

### Level 1: Reduce Your Surface (Minimal Effort)

- **Use a mainstream browser with tracking protection** — Firefox with Enhanced Tracking Protection set to Strict blocks known fingerprinting scripts. This does not change your fingerprint but prevents many scripts from reading it.
- **Keep your browser updated** — Updates sometimes reduce fingerprintable surface area.
- **Use fewer browser extensions** — Each extension can modify your browser\'s behavior in detectable ways. Paradoxically, privacy extensions can make your fingerprint *more* unique.

**Tradeoff:** Minimal inconvenience. Reduces exposure to known fingerprinting scripts but does not address sophisticated trackers.

### Level 2: Add Noise (Moderate Effort)

- **Brave Browser** — Brave\'s "farbling" system adds controlled randomness to Canvas, WebGL, and AudioContext outputs. Each session produces slightly different fingerprint values, making it harder to link sessions. This is currently the most practical mainstream anti-fingerprinting implementation.
- **Firefox `resistFingerprinting`** — In `about:config`, set `privacy.resistFingerprinting` to `true`. Firefox will report generic values for many attributes (standardized screen size, UTC timezone, generic fonts). This significantly reduces fingerprint uniqueness but can break some websites.

**Tradeoff:** Brave\'s approach is nearly transparent; you may not notice it. Firefox\'s resistFingerprinting causes noticeable changes (timezone, window sizing) that affect daily usability.

### Level 3: Blend Into the Crowd (Significant Effort)

- **Tor Browser** — Built on Firefox with aggressive anti-fingerprinting. All Tor Browser users are designed to look identical to each other. Screen size is standardized, fonts are restricted, canvas returns generic output, JavaScript APIs report uniform values. This is the "herd immunity" approach — you are safe because you are indistinguishable from every other Tor user.
- **LibreWolf** — A Firefox fork with privacy hardening applied by default, including resistFingerprinting. Less extreme than Tor but more private than stock Firefox.

**Tradeoff:** Tor is significantly slower due to onion routing. Many websites block or challenge Tor users. LibreWolf requires manual updates and may break some sites. Both reduce convenience measurably.

### Level 4: Compartmentalize (High Effort)

- **Use different browsers for different activities** — One browser for logged-in services (where you are identified anyway), another for anonymous browsing. This does not reduce your fingerprint but prevents fingerprinting from linking your anonymous activity to your identified activity.
- **Browser profiles** — Firefox and Chrome support multiple profiles, each with separate cookies, history, and extensions. Use them.
- **Virtual machines** — For high-stakes anonymity, browse from a VM with standardized hardware characteristics.

**Tradeoff:** Requires discipline and workflow changes. Inconvenient but effective at preventing identity linkage.

### What Does NOT Work

- **Incognito/Private mode** — Does not change your fingerprint. Only prevents local storage of history and cookies.
- **Clearing cookies** — Fingerprinting does not use cookies. Clearing them does nothing to your fingerprint.
- **VPNs alone** — A VPN changes your IP address but does not change your browser fingerprint. You are still identifiable; you are just identifiable from a different IP.
- **Randomizing everything** — If your fingerprint changes on every page load, that inconsistency itself becomes a signal. Sophisticated systems detect and flag it.

---

## See Your Own Fingerprint

The best way to understand fingerprinting is to see what your browser reveals. Our **[Browser Fingerprint Analyzer](/tools/fingerprint)** tests your browser against every major fingerprinting vector and shows you:

- Your canvas, WebGL, and AudioContext fingerprints
- Your screen and hardware attributes
- Your font fingerprint
- Your overall entropy score
- How unique your combination is

Everything runs locally in your browser. No data is sent to any server.

Try it before and after making changes from this guide to see the difference.

---

## 🔮 The Next Generation: Behavioral Fingerprinting

The fingerprinting techniques described above all rely on reading static device characteristics. The next frontier is **behavioral fingerprinting** — tracking *how* you interact with your device, not just what device you have.

**What is being measured:**
- Mouse movement patterns — speed, acceleration, curvature of motion
- Scroll behavior — speed, frequency, momentum
- Keystroke dynamics — typing speed, rhythm, interval between specific key pairs
- Touch patterns on mobile — pressure, area, gesture characteristics
- Navigation patterns — how you move through a site

AI-powered behavioral analysis now achieves 98%+ identification accuracy in research settings. It is functionally immune to the countermeasures described above because it does not depend on browser APIs that can be restricted — it reads your physical behavior through normal user interaction events that every website needs to function.

This is still emerging. Widespread deployment is limited by computational cost and privacy regulations. But it represents the direction fingerprinting is heading: from identifying your device to identifying *you*, regardless of what device or browser you use.

The European GDPR classifies browser fingerprints as personal data, and fingerprinting without consent is technically illegal in the EU. Enforcement has been inconsistent, but regulatory pressure is mounting. Several US state privacy laws enacted in 2025-2026 are beginning to address similar concerns, though coverage remains fragmented.

---

## Key Takeaways

1. **Fingerprinting works without cookies, without storage, and without your knowledge.** Clearing your browser data does not help.

2. **No single technique identifies you.** It is the combination of 15–20 attributes that creates a unique profile.

3. **Your threat model determines your response.** If your concern is mass commercial tracking, Brave\'s farbling or Firefox\'s Strict protection may be sufficient. If your concern is targeted identification by a sophisticated adversary, only Tor Browser provides meaningful resistance — and even that has limits.

4. **Consistency beats randomization.** Systems that look identical to other systems (Tor\'s approach) are more effective than systems that produce random values (which can be detected as anomalous).

5. **The arms race continues.** Behavioral fingerprinting is emerging as a next-generation technique that current browser defenses cannot address. Awareness and regulatory pressure may be the most effective long-term countermeasures.

---

## Sources and Further Reading

- Laperdrix, P., Bielova, N., Baudry, B., and Avoine, G., "Browser Fingerprinting: A Survey," ACM Transactions on the Web, 2020.
- Englehardt, S. and Narayanan, A., "Online Tracking: A 1-Million-Site Measurement and Analysis," ACM CCS, 2016.
- Cao, Y., Li, S., and Wijmans, E., "(Cross-)Browser Fingerprinting via OS and Hardware Level Features," NDSS, 2017.
- Bauer, K., et al., "Who Touched My Browser Fingerprint?," IMC, 2020.
- Coronium, "Browser Fingerprint Detection: Complete 2026 Guide," coronium.io, 2026.
- DataDome, "The End of Fingerprinting As We Know It: How Browser Privacy Is Reshaping Bot Detection," datadome.co, 2025.
- Electronic Frontier Foundation, "Cover Your Tracks" (formerly Panopticlick), coveryourtracks.eff.org.
- arXiv, "Browser Fingerprint Detection and Anti-Tracking," arXiv:2502.14326, 2025.
