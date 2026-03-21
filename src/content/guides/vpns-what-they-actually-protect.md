---
title: 'VPNs: What They Actually Protect'
description: VPNs are the most overhyped and misunderstood privacy tool on the internet. Here is what they genuinely protect, what they do not, and how to choose one honestly.
category: essentials
order: 2
publishedDate: '2026-03-17'
updatedDate: '2026-03-20'
tags:
- vpn
- network-privacy
- encryption
- isp
- mullvad
- protonvpn
- ivpn
- wireguard
relatedTools:
- leak-tester
- webrtc-detector
- dns-leak
relatedGuides:
- what-is-a-threat-model
- how-youre-being-tracked
- choosing-a-browser-for-privacy
- dns-privacy-explained
difficulty: 2
tldr:
- A VPN encrypts your traffic and hides your IP — that is all it does
- VPNs protect you from ISP surveillance, public Wi-Fi attacks, and IP-based geolocation
- VPNs do NOT protect against fingerprinting, account tracking, or malware
- Mullvad, IVPN, and ProtonVPN are the most trustworthy options based on audits and track record
faq:
- question: Do I need a VPN?
  answer: It depends on your threat model. If you want to prevent your ISP from logging your browsing history, bypass geographic restrictions, or protect yourself on public Wi-Fi, a VPN helps. If your main
    concern is website tracking, a VPN alone is insufficient — you also need browser hardening.
- question: Can a VPN provider see my traffic?
  answer: A VPN provider can see your traffic metadata (when you connect, how much data you transfer) and could theoretically log the sites you visit. This is why choosing a no-logs VPN with independent
    audits is critical. Mullvad, IVPN, and ProtonVPN have all passed independent no-logs audits.
- question: Are free VPNs safe to use?
  answer: Generally no. Free VPNs must fund their operations somehow — usually by logging and selling your browsing data, injecting ads, or providing poor security. Some free VPNs have been caught selling
    bandwidth or installing malware. The ProtonVPN free tier is one of the few trustworthy exceptions.
draft: false
---

# VPNs: What They Actually Protect

No privacy tool has been more aggressively marketed — or more widely misunderstood — than the VPN.

VPN companies spend hundreds of millions of dollars annually on advertising, sponsorships, and affiliate programs. They sponsor podcasters, YouTubers, and influencers. Their marketing promises range from the technically accurate to the flatly misleading: "military-grade encryption," "complete anonymity," "total protection from hackers."

The result is that millions of people now use VPNs with expectations these tools cannot meet. A 2025 survey found that 23% of VPN users believe their VPN makes them anonymous. It does not. Another 23% believe a VPN prevents tracking by Google, Facebook, and Amazon. It does not do that either.

A VPN is a useful privacy tool. It does specific things well. But it is one layer in a defense strategy, not a magic shield. Understanding exactly what a VPN protects — and what it leaves exposed — is essential to using one effectively.

---

## What a VPN Actually Does

A VPN does two things:

1. **Encrypts your internet traffic** between your device and the VPN server
2. **Replaces your IP address** with the VPN server\'s IP address

That is it. Everything a VPN does flows from these two functions. Everything it does *not* do is because these two functions have limits.

### Encryption in Transit

When you connect to a VPN, your device creates an encrypted tunnel to the VPN server. All internet traffic flows through this tunnel. Anyone monitoring the connection between your device and the VPN server — your ISP, a network administrator, someone eavesdropping on public Wi-Fi — sees only encrypted data. They cannot read the content, see which websites you visit, or identify what applications you are using.

Modern VPNs use **AES-256 encryption** (the same standard used by governments for classified information) or the newer **ChaCha20** cipher used by WireGuard. Both are considered unbreakable with current technology.

**The critical limit:** Encryption protects data *in transit* — while it is moving between your device and the VPN server. It does not protect data on your device, data after it reaches its destination, or data you voluntarily hand to a website by logging in.

### IP Address Replacement

Websites you visit see the VPN server\'s IP address instead of yours. This means:

- Your ISP cannot see which websites you visit (they see only that you are connected to a VPN server)
- Websites cannot determine your physical location from your IP
- Your real IP is hidden from trackers that log IP addresses

**The critical limit:** Your IP address is only one of many ways you are identified online. Changing it does not change your [browser fingerprint](/guides/browser-fingerprinting-explained), does not log you out of accounts, and does not prevent cookies from tracking you.

---

## What a VPN Protects Against

### ISP Surveillance and Data Sales

Your Internet Service Provider can see every unencrypted DNS query and every website you connect to. In the United States, ISPs can legally collect and sell this browsing data. Verizon was caught injecting unique tracking headers ("supercookies") into customer traffic. AT&T once charged customers extra to opt out of tracking.

A VPN effectively blinds your ISP. They can see that you are sending encrypted traffic to a VPN server. They cannot see what websites you visit, what you download, or what applications you use. This is one of the most legitimate and clear-cut use cases for a VPN.

### Public Wi-Fi Attacks

On public Wi-Fi — coffee shops, airports, hotels — other users on the same network can potentially intercept unencrypted traffic. Attackers can set up fake hotspots ("evil twin" attacks) that mimic legitimate networks. A VPN encrypts all traffic leaving your device, rendering these attacks ineffective.

Note: Modern HTTPS encryption already protects the *content* of your connection to most websites. A VPN adds protection for *metadata* (which sites you visit) and protects traffic from applications that may not use HTTPS.

### IP-Based Tracking and Location Profiling

Some tracking systems log your IP address to approximate your location or link your visits across websites. A VPN prevents this specific tracking vector.

### Network-Level Censorship

In countries that block access to specific websites or services, a VPN can bypass these restrictions by routing your traffic through a server in an unrestricted location. For users in restrictive environments, this can be essential.

---

## What a VPN Does NOT Protect Against

This section is more important than the one above. These are the threats that VPN marketing implies coverage for but does not deliver.

### Browser Fingerprinting

As described in [Browser Fingerprinting Explained](/guides/browser-fingerprinting-explained), websites can identify your browser through its unique combination of screen resolution, installed fonts, GPU renderer, audio processing characteristics, and dozens of other attributes. None of this changes when you connect to a VPN. Your fingerprint is the same with or without a VPN.

**The analogy:** A VPN is like changing your license plate. Browser fingerprinting is like identifying your car by its make, model, color, dents, bumper stickers, and tire brand. Changing the plate does not help if the car itself is unique.

### Cookies and Logged-In Tracking

If you are logged into Google, Facebook, Amazon, or any other platform, those companies know exactly who you are — VPN or not. You told them. Cookies stored in your browser continue to identify you across sessions. A VPN encrypts your connection to these services but does nothing to prevent the tracking they perform once you arrive.

Using a VPN while logged into Chrome and signed into Google is, as one security researcher put it, "like wearing a ski mask to the bank but handing the teller your driver\'s license."

### Malware and Viruses

A VPN encrypts your network traffic. Malware operates on your device. If you download a malicious file, the VPN will dutifully encrypt its delivery to you. Keyloggers capture your keystrokes before they reach the VPN tunnel. Screen capture malware reads your screen regardless of your network connection.

A VPN is not an antivirus. It is not a firewall. It does not scan content for threats.

### Phishing and Social Engineering

If you click a link to a fake banking website and enter your credentials, the VPN encrypts that transaction beautifully. It does not know or care that the website is fraudulent.

### Account Compromise

If your password is in a data breach and an attacker uses it to log into your accounts, the VPN is irrelevant. Account security depends on strong, unique passwords and two-factor authentication — not on your network connection.

---

## The Honest VPN Decision

Do you need a VPN? The answer depends on your [threat model](/guides/what-is-a-threat-model):

| Your Concern | Does a VPN Help? |
|---|---|
| ISP collecting and selling your browsing data | **Yes** — primary use case |
| Public Wi-Fi security | **Yes** — encrypts all traffic on untrusted networks |
| Bypassing geographic restrictions | **Yes** — changes your apparent location |
| Hiding your IP from websites | **Yes** — replaces your IP with the server\'s |
| Preventing Google/Facebook tracking | **No** — they track you by account, cookies, and fingerprint |
| Stopping browser fingerprinting | **No** — fingerprint is device/browser-based, not IP-based |
| Protecting against malware | **No** — malware operates on your device, not your network |
| Achieving anonymity | **Partially** — hides IP but does not address other identifiers |
| Preventing government surveillance | **Partially** — hides content from passive ISP monitoring, but sophisticated adversaries have other methods |

---

## Choosing a VPN: The Landscape

If you decide a VPN serves your threat model, choosing a provider matters enormously. The VPN you choose sees *all* of your internet traffic. You are not eliminating surveillance — you are moving trust from your ISP to your VPN provider. Choose poorly, and you have made your privacy worse, not better.

### What to Look For

**Independently audited no-logs policy.** Any VPN can claim it keeps no logs. The ones that matter have hired independent security firms to verify this claim and published the results. Look for audits by firms like Cure53, Assured, or SEC Consult.

**Jurisdiction.** Where a VPN is incorporated determines what laws apply to user data requests. Switzerland (ProtonVPN) and Sweden (Mullvad) have strong privacy protections. Avoid providers in countries with aggressive data retention laws or that participate in intelligence-sharing agreements without strong countermeasures.

**Anonymous payment options.** If a VPN requires your name, email, and credit card, it has your identity regardless of its logging policy. The most privacy-respecting providers accept cryptocurrency or even cash, and do not require an email address.

**Open-source clients.** If the VPN\'s app is closed-source, you are trusting the company\'s claims about what the software does. Open-source clients can be independently verified.

**WireGuard or audited OpenVPN.** These are the gold-standard VPN protocols. Avoid proprietary protocols you cannot verify.

### The Privacy VPN Landscape

Arranged from most privacy-focused to most feature-rich. This is not a ranking — the right choice depends on your priorities.

#### Mullvad — Maximum Privacy, Minimum Trust Required

**Price:** €5/month (flat, never changes)
**Jurisdiction:** Sweden
**What makes it different:** Mullvad does not want to know who you are. Your account is a randomly generated number. No email required. No name required. You can pay with **cash** — literally mail currency to their office in Gothenburg — or with Bitcoin Lightning Network. Mullvad cannot identify its own customers, by design.

**Technical strengths:**
- RAM-only servers (no persistent storage; data is lost on reboot)
- Quantum-resistant tunnels (post-quantum encryption already deployed)
- MultiHop routing through two servers
- Owned servers (not rented) in key locations
- Independently audited by Cure53 (2024 infrastructure) and Assured (2025 web app)

**Honest limitations:**
- Smaller server network than commercial VPNs (~700 servers vs. thousands)
- No streaming optimization (not designed for Netflix unblocking)
- Fewer simultaneous device connections (5)
- Minimalist apps — functional but not polished

**Best for:** Users who want the strongest possible privacy guarantees with the least required trust. Journalists, activists, and anyone whose threat model includes sophisticated adversaries.

#### IVPN — Transparency as a Feature

**Price:** €6/month (Standard) or €10/month (Pro with multi-hop)
**Jurisdiction:** Gibraltar (British Overseas Territory)
**What makes it different:** IVPN publishes its ownership structure, network configuration, and infrastructure details publicly. It accepts anonymous payment. Multi-hop (routing through two countries) is a standard feature, not an upsell.

**Technical strengths:**
- Multi-hop through two VPN servers in different jurisdictions
- No email required for account creation
- Supports WireGuard and OpenVPN
- Open-source clients
- Transparent about its business practices and limitations

**Honest limitations:**
- Small server network (~35 countries)
- Less well-known, smaller user community
- Pricing is not competitive per-feature with larger providers

**Best for:** Users who value transparency and principled business practices. The most "you know exactly what you are getting" option.

#### ProtonVPN — Privacy Ecosystem With Broader Features

**Price:** Free tier available (unlimited data); paid plans from ~$4/month
**Jurisdiction:** Switzerland
**What makes it different:** Part of the Proton AG ecosystem (Proton Mail, Proton Drive, Proton Calendar). Offers a genuinely functional free tier with no data limits — the only major VPN to do this honestly. Secure Core servers route sensitive traffic through Proton-owned servers in privacy-friendly countries before exiting.

**Technical strengths:**
- Secure Core architecture for high-risk users
- NetShield ad/tracker blocker built in
- VPN Accelerator for faster long-distance connections
- Open-source clients with published audit results (SEC Consult 2019, plus subsequent audits)
- Free tier with no data caps (covers ~100 servers in 5 countries)
- Part of a broader encrypted ecosystem

**Honest limitations:**
- Requires email for account creation (you can use a Proton Mail address)
- Free tier is limited in speed and server selection
- More complex pricing with multiple tiers
- Larger company with more potential attack surface than minimalist providers

**Best for:** Users who want a VPN that integrates with a broader privacy ecosystem. Users who want a free VPN that is not itself a privacy threat. Users who need a balance of privacy and features.

### What to Avoid

**Free VPNs from unknown companies.** If you are not paying, you are the product. Many free VPNs have been caught selling user data, injecting ads, or containing malware. ProtonVPN\'s free tier is the notable exception — but verify before trusting any "free" VPN.

**VPNs with aggressive affiliate marketing.** If a VPN\'s primary visibility comes from paid YouTube sponsorships and affiliate deals, question where their budget priorities lie. Some of the most heavily marketed VPNs have had significant privacy and security incidents.

**VPNs that promise "anonymity" or "military-grade security."** These are marketing terms, not technical ones. A VPN that overpromises is a VPN that does not respect your intelligence.

**VPNs with unclear ownership.** Several VPN brands are owned by the same parent companies. Kape Technologies owns ExpressVPN, CyberGhost, Private Internet Access, and Zenmate. This is not inherently disqualifying, but you should know who owns the service that sees all your traffic.

---

## The VPN Is One Layer

A VPN addresses one layer of your privacy: the network layer. It prevents your ISP from seeing your traffic and websites from seeing your IP. That is valuable. But it is one layer.

A complete privacy strategy also includes:

- **A privacy-respecting browser** that resists fingerprinting and blocks trackers → [Choosing a Browser for Privacy](/guides/choosing-a-browser-for-privacy)
- **Encrypted messaging** that protects communication content and metadata → [Encrypted Messaging: Your Options](/guides/encrypted-messaging)
- **Good account security** — unique passwords, two-factor authentication, awareness of phishing
- **Awareness of what you share** — no tool can protect data you voluntarily give away

The most private VPN in the world cannot help you if you are logged into Chrome, signed into Google, accepting every cookie, and posting your location on Instagram. Privacy is a practice, not a purchase.

---

## Verify Your VPN Is Working

After connecting to a VPN, verify it is actually doing what it should:

- **[DNS Leak Test](/tools/leak-tester)** — Verify your DNS queries are going through the VPN, not leaking to your ISP
- **[WebRTC Leak Detector](/tools/webrtc-detector)** — Check if your real IP is leaking through WebRTC
- **IP check** — Visit a site like `whatismyipaddress.com` and confirm it shows the VPN server\'s IP, not yours

Do this check periodically, not just once. VPN connections can drop silently. Most quality VPNs include a "kill switch" that blocks all traffic if the VPN disconnects — make sure it is enabled.

---

## 🔮 Where VPN Technology Is Heading

**Post-quantum encryption is arriving.** Mullvad has already deployed quantum-resistant tunnels. ProtonVPN and others are following. As quantum computing advances, VPN encryption that resists quantum attacks will shift from "nice to have" to essential.

**Traffic analysis is the next battlefield.** Even with a VPN, sophisticated observers can analyze traffic *patterns* — when you connect, how much data flows, timing correlations — to infer activity. Some VPN providers are beginning to implement defenses against AI-powered traffic analysis. This is an early but important development.

**Decentralized VPNs are emerging.** Projects like NymVPN route traffic through decentralized mixnets rather than centralized VPN servers, eliminating the single point of trust. This technology is still maturing but represents a potential paradigm shift in network privacy.

**Regulation is tightening.** Some countries are restricting or banning VPN use. Others are requiring VPN providers to log user data. The regulatory landscape is diverging — VPNs are becoming more legally protected in some jurisdictions and more legally restricted in others. Your VPN provider\'s jurisdiction matters more than ever.

---

## Key Takeaways

1. **A VPN encrypts your traffic and hides your IP.** That is what it does. Not more.
2. **It does not make you anonymous.** It does not stop fingerprinting, cookies, or logged-in tracking.
3. **The primary use case is blocking ISP surveillance** and protecting traffic on untrusted networks.
4. **Your VPN provider sees everything your ISP used to see.** Choose a provider you have reason to trust — audited, transparent, no-logs.
5. **A VPN is one layer.** Combine it with a private browser, good account security, and awareness of what you share.
6. **If privacy is the goal, prioritize providers like Mullvad, IVPN, or ProtonVPN** that have demonstrated commitment through audits, transparency, and business models that do not depend on selling your data.

---

## Sources

- Outbyte, "What a VPN Can and Can\'t Protect You From in 2026," outbyte.com, 2026.
- Windscribe, "Does a VPN Protect You From Hackers?," windscribe.com, 2025.
- CyberInsider, "Mullvad vs Proton VPN: Which VPN Is Best in 2026?," January 2026.
- CNET, "Mullvad vs. Proton VPN: Two Privacy Powerhouses Compared," 2026.
- Wirecutter/New York Times, "The 3 Best VPN Services of 2026," nytimes.com, 2026.
- Deepak Gupta, "Top 10 VPNs of 2026: Speed, Privacy, and Value Compared," 2026.
- Cure53, Mullvad VPN Infrastructure Audit, 2024.
- Assured, Mullvad VPN Web App Audit, 2025.
- SEC Consult, Proton VPN Security Audit, 2019.
