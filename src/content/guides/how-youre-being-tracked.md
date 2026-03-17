---
title: "How You're Being Tracked Right Now"
description: "Every click, scroll, and keystroke pattern can identify you. Here's exactly how websites, advertisers, and data brokers track you — and what data they collect."
category: "foundations"
order: 1
tags: ["tracking", "fingerprinting", "cookies", "surveillance", "data-collection"]
relatedTools: ["fingerprint-analyzer", "webrtc-detector", "leak-tester"]
relatedGuides: ["who-wants-your-data", "what-is-a-threat-model", "browser-fingerprinting-explained", "privacy-myths-debunked"]
difficulty: 1
tldr:
  - "You are tracked through cookies, fingerprinting, IP addresses, and behavioral patterns"
  - "First-party tracking comes from sites you visit; third-party tracking follows you across the web"
  - "Your phone, browser, and apps all leak identifying data by default"
draft: false
---

# How You're Being Tracked Right Now

You opened a browser tab. You typed a URL. A web page loaded. In the time it took to read that sentence, somewhere between five and forty separate companies recorded your presence, categorized your device, and added data points to a profile that may have existed for years before you ever heard their name.

This is not hypothetical. It is not speculation about some dystopian future. It is the default state of the modern web, operating right now, on most websites you visit every day.

Understanding *how* you are tracked is the first step toward understanding what you can do about it. This guide covers every major tracking method in use today — from the familiar to the obscure — explained plainly, with technical accuracy and real examples of who uses each one.

---

## The Cookie Layer

### First-Party Cookies

Cookies are small text files that websites store in your browser. When the site that created the cookie is the same site you are visiting, it is called a **first-party cookie**. These have legitimate uses: keeping you logged in, remembering your shopping cart, saving your preferences.

However, even first-party cookies are used for analytics. When you visit a site that uses Google Analytics, the site embeds Google tracking code. Google places a `_ga` cookie — technically served from that site's domain — that creates a unique identifier for your browser session and tracks your behavior across every page of that site, reporting back to Google.

First-party cookies typically expire when you close your browser, or after a set time period. You can see them by opening your browser's developer tools and inspecting the "Storage" or "Application" tab.

### Third-Party Cookies

The more powerful (and more controversial) tracking mechanism is the **third-party cookie**. When you visit a news site, that page might load resources from dozens of other domains: ad networks, analytics platforms, social sharing buttons, embedded videos. Each of those third parties can set their own cookies in your browser.

Because those same third parties appear on thousands of other websites, they can see your movement across the entire web. Visit a shoe website on Monday, and the ad network that was embedded there knows you visited. When you read a news article on Wednesday, that same ad network is also embedded there — and it recognizes you. The shoe ads that follow you around are not a coincidence. They are the direct result of third-party cookie tracking.

The major players in this ecosystem — Google (through DoubleClick/Google Ad Manager), Meta, and The Trade Desk — operate tracker networks that appear on a significant percentage of the top 10,000 websites globally. Research by the Electronic Frontier Foundation has found trackers present on the vast majority of popular websites.

Most major browsers have begun restricting or phasing out third-party cookies. Safari blocked them by default in 2017. Firefox followed. Google Chrome, which has the largest market share, has been slower to act, repeatedly delaying its planned deprecation. As of 2024, third-party cookies still function in Chrome for most users.

### Supercookies and Evercookies

Cookies can be deleted. Advertising companies know this. So they developed ways to recreate cookies even after you delete them — called **supercookies** or **evercookies**.

Researcher Samy Kamkar's 2010 evercookie demonstration showed how a tracking script could store a unique identifier in at least eight different browser storage mechanisms simultaneously: standard cookies, localStorage, sessionStorage, IndexedDB, cached images, ETags, web history, and more. Even if a user cleared cookies, as long as any one storage mechanism survived, the script could read that surviving ID and repopulate all the others.

**ETags** (entity tags) are a legitimate HTTP caching mechanism — but they can be abused. Your browser stores an ETag value from a previously loaded resource. When you revisit a site, your browser sends that ETag value back. If the server issued unique ETags per visitor, it now recognizes you, even if you cleared your cookies.

**HSTS supercookies** exploit the HTTP Strict Transport Security mechanism. A site can instruct your browser to always use HTTPS for a list of subdomains. The combination of which subdomains are on that list is unique enough to function as an identifier. Researchers at Princeton's Center for Information Technology Policy documented this technique in the wild.

Browsers have gradually closed many of these storage channels, but the cat-and-mouse dynamic continues.

---

## Browser Fingerprinting

This is where tracking becomes genuinely difficult to defend against — not because it is hidden, but because it exploits information your browser must share to function correctly.

**Browser fingerprinting** (also called device fingerprinting) works by collecting many attributes about your browser and hardware, combining them, and computing a value that is highly likely to be unique to you. No cookie is stored. Nothing is written to your device. Your browser simply *answers questions* that the page's JavaScript asks — and those answers identify you.

The Electronic Frontier Foundation's "Cover Your Tracks" study found that the vast majority of browsers tested had a unique fingerprint. A paper published at the IEEE Symposium on Security and Privacy found fingerprints stable enough to track users across sessions with high accuracy.

### Canvas Fingerprinting

Every combination of graphics hardware, operating system, browser, and installed fonts renders text and graphics slightly differently. **Canvas fingerprinting** exploits this.

A script draws text or geometric shapes to an invisible HTML `<canvas>` element. The rendering is then extracted as a pixel array. Because your GPU, driver, OS, and fonts all affect how that rendering is computed, the result is a signature unique to your system. This value is hashed and used as an identifier.

Canvas fingerprinting is one of the most reliable fingerprinting methods and is in widespread commercial use. Researchers at Princeton found it on a significant percentage of the top 100,000 websites. Companies like AddThis (owned by Oracle) have used it at scale.

### WebGL Fingerprinting

Similar to canvas fingerprinting, but using WebGL — the browser API for 3D graphics. A script renders a 3D scene and reads the output pixels, or reads renderer metadata directly. The `RENDERER` string from WebGL often identifies your exact GPU model, providing a stable hardware-level identifier.

WebGL also exposes precision values, supported extensions, and other parameters that vary by implementation — all contributing to a unique signature.

### AudioContext Fingerprinting

Your browser processes audio differently depending on hardware and software stack. **AudioContext fingerprinting** generates an audio signal programmatically (you never hear it) and measures how your browser processes it. The resulting numerical values differ by device, providing another stable identifier.

This technique works even when canvas fingerprinting is blocked, making it a useful backup for trackers. Research by Yinzhi Cao et al. documented cross-browser fingerprinting techniques using this method.

### Font Fingerprinting

Fonts installed on your system affect how text is rendered and how browser layout engines calculate element dimensions. By testing a large list of fonts and measuring rendered widths for characters in each, scripts can infer which fonts are installed without direct API access.

On some browsers and operating systems, font enumeration APIs provide a direct list. The combination of installed fonts is often unique enough to contribute significantly to a fingerprint.

### Hardware and System Attributes

Beyond rendering, browsers expose dozens of system attributes that combine into a fingerprint:

- **Screen resolution and color depth**: Your physical display characteristics
- **Device pixel ratio**: Whether you have a HiDPI/Retina display
- **Hardware concurrency**: The number of logical CPU cores reported
- **Device memory**: Memory tier (browsers report approximate values: 0.25, 0.5, 1, 2, 4, 8 GB)
- **Timezone**: Your system clock timezone (distinguishes region even with VPN)
- **Language and locale settings**: Browser and OS language preferences
- **Platform string**: Your operating system and architecture
- **Battery status**: On supported browsers and devices, battery level and charging state (this API has been restricted in most browsers due to fingerprinting concerns)
- **Connection type**: Whether you are on WiFi, cellular, ethernet
- **Media devices**: The count and IDs of cameras and microphones (not their content — just their existence)
- **Keyboard layout**: Inferred from language settings or available APIs

No single attribute uniquely identifies you. Combined, they narrow the population dramatically.

### Behavioral Fingerprinting

Some of the most invasive tracking goes beyond what your system is and captures how you use it.

**Mouse movement patterns**: You move your mouse in a subtly unique way. The speed, acceleration, curvature of paths, and tendency to hover over certain elements are measurable. Academic research has demonstrated that mouse movement can identify individuals with reasonable accuracy.

**Scroll behavior**: How fast you scroll, in what patterns, whether you scroll to the bottom of pages — these behaviors are measurable and contribute to behavioral profiles.

**Keystroke dynamics**: The timing between keystrokes — specifically the time a key is held down and the interval before the next key — forms a biometric signature. This is used actively in banking authentication systems (as a security feature) and passively by some trackers.

These behavioral signals are collected by session replay companies like FullStory, LogRocket, and Hotjar — tools that record users' entire sessions for UX research purposes. The data collected is often granular enough to reconstruct exactly what you typed, even in password fields, leading to significant controversy and several regulatory actions.

---

## IP Address Tracking

Every connection you make to a server sends your IP address. This is technically unavoidable — it is how TCP/IP networking works. Your IP address reveals:

- **Your approximate geographic location**: Often accurate to city level for residential connections, sometimes more precise
- **Your Internet Service Provider**: The ISP's name is publicly registered
- **Whether you are using a VPN or proxy**: VPN IP ranges are often known and listed in databases
- **Connection patterns**: When you are online, how long, to which services

IP addresses are logged by every web server you connect to. They are also used in real-time for fraud detection, bot filtering, and ad targeting (IP-based geotargeting).

Because most residential ISPs use **dynamic IP addresses** (changing periodically), IP addresses alone are less reliable for long-term tracking. However, combined with other identifiers, they become powerful. And for users on static IPs (many business connections), the IP is effectively a permanent identifier.

---

## Tracking Pixels and Invisible Beacons

A **tracking pixel** is a 1×1 transparent image embedded in a webpage or email. When your browser or email client loads the image, it makes an HTTP request to the tracker's server — revealing your IP address, the time you viewed the content, your browser/email client, and your operating system.

Tracking pixels are ubiquitous in email marketing. When you open a newsletter or marketing email, the sender's email service provider (Mailchimp, Constant Contact, HubSpot, etc.) typically records that you opened it, when, where, and on what device — even if you never clicked anything.

In web pages, tracking pixels function similarly to third-party cookies, providing another mechanism to record page views and stitch together browsing history across sites.

---

## Cross-Device Tracking

You use multiple devices. Trackers have developed methods to link those devices into a single profile.

**Deterministic matching** works when you log in. If you sign into Google on your phone and your laptop, Google knows both devices belong to you. The same applies to Meta (Facebook/Instagram), Apple, Amazon, and any service with an account system.

**Probabilistic matching** works without login. By comparing IP addresses, browsing times, behavioral patterns, and other signals across devices, advertising platforms infer that a phone and a laptop belong to the same person. If both devices are consistently on the same home IP address, connect at the same times, and show correlated browsing patterns, the system assigns high confidence that they share an owner.

Adobe, LiveRamp, Oracle Data Cloud, and others operate cross-device identity graphs that link billions of device pairs. These graphs are sold to advertisers to enable cross-device campaign targeting and attribution.

---

## CNAME Cloaking

As browsers and ad blockers became better at blocking third-party tracking scripts, the ad-tech industry developed a countermeasure: **CNAME cloaking**.

Instead of loading a tracker from `tracker.com` (which ad blockers can block by domain), the tracking script is served from a subdomain of the visited site — say `analytics.examplesite.com`. Behind the scenes, that subdomain is configured in DNS as a **CNAME** (alias) that points to `tracker.com`'s servers.

From the browser's perspective, the request appears to be a first-party request to the same site you are visiting — bypassing both browser privacy protections and most ad blockers. But the actual request reaches the tracker's servers, complete with cookies and identifiers.

CNAME cloaking has been documented by researchers at KU Leuven and UCLouvain, who found it in use on hundreds of popular websites. Adobe Analytics, Eulerian, and other analytics vendors have offered CNAME-based deployment specifically to circumvent ad blockers.

Safari's Intelligent Tracking Prevention and newer versions of Firefox have developed countermeasures, but CNAME cloaking remains effective against many defenses.

---

## Social Media Widgets

Even if you never use Facebook, the Facebook "Like" button appears on millions of websites. When you visit a page containing that button, your browser loads resources from Facebook's servers — meaning Facebook receives your IP address, browser fingerprint, and the URL of the page you are reading, regardless of whether you click anything.

The same applies to Twitter/X share buttons, LinkedIn share buttons, Pinterest widgets, YouTube embeds, and similar third-party integrations. Each is a data collection point for the platform that provides it.

Facebook's **off-Facebook activity** feature, launched in 2019, allows users to see (and partially limit) the data collected about them from third-party websites. What it reveals is often shocking — hundreds of websites, sending data every visit.

---

## The Aggregation Problem

No single tracking technique in this guide is catastrophic in isolation. Knowing that one website knows your IP address is not alarming. But surveillance is not a single-data-point problem — it is an **aggregation problem**.

When a data broker combines:
- Your browsing history (from third-party cookies or fingerprinting)
- Your IP address history (from ISP data purchases)
- Your location data (from mobile app permissions)
- Your purchase history (from loyalty card programs)
- Your demographic data (from voter records and public databases)
- Your social graph (from social media activity)

...the result is not a collection of harmless fragments. It is a detailed portrait of who you are, where you go, what you buy, who you know, what you believe, and what you are likely to do next.

This aggregated profile is bought and sold without your meaningful awareness or consent, analyzed by algorithms you cannot inspect, and used to make decisions that affect your insurance rates, credit offers, employment prospects, and political targeting.

---

## Check Your Own Footprint

The best way to understand tracking is to see it in action on your own browser. Our **[Browser Fingerprint Analyzer](/tools/fingerprint-analyzer)** runs every test described in this guide on your own browser and shows you exactly what information you are broadcasting — which attributes make you unique, which tracking methods are effective against your current setup, and which protections are working.

The results are often surprising, even for technically sophisticated users.

Understanding your exposure is the first step. The next guides in this series cover what you can actually do about it — not with a single magic solution, but with a clear-eyed look at the full spectrum of available protections.

---

## Sources and Further Reading

- Electronic Frontier Foundation. *Cover Your Tracks*. coveryourtracks.eff.org
- Eckersley, P. (2010). *How Unique Is Your Web Browser?* EFF. Proceedings of the 10th International Symposium on Privacy Enhancing Technologies.
- Englehardt, S., & Narayanan, A. (2016). *Online Tracking: A 1-million-site Measurement and Analysis.* Proceedings of ACM CCS 2016.
- Cao, Y., Li, S., & Wijmans, E. (2017). *(Cross-)Browser Fingerprinting via OS and Hardware Level Features.* NDSS Symposium 2017.
- Bauer, L., et al. (2020). *CNAME Cloaking-Based Tracking on the Web.* IMC 2020.
- Kamkar, S. (2010). *Evercookie.* samy.pl/evercookie
- Mozilla. *Firefox Privacy Notice and Tracking Protection Documentation.* mozilla.org
- Princeton Center for Information Technology Policy. *Web Transparency and Accountability Project.* webtap.princeton.edu
- Acar, G., et al. (2014). *The Web Never Forgets: Persistent Tracking Mechanisms in the Wild.* Proceedings of ACM CCS 2014.
