---
title: "DNS Privacy Explained"
description: "Every website you visit starts with a DNS query — and by default, your ISP can see every one. Here is how DNS works, why it leaks your browsing history, and how to encrypt it."
category: "intermediate"
order: 4
tags: ["dns", "dns-over-https", "doh", "dot", "encrypted-dns", "isp", "cloudflare-dns", "quad9"]
relatedTools: ["leak-tester", "dns-leak"]
relatedGuides: ["vpns-what-they-actually-protect", "how-youre-being-tracked", "choosing-a-browser-for-privacy", "network-security-at-home"]
draft: false
---

# DNS Privacy Explained

Before your browser loads any website, it asks a question: "What is the IP address for this domain name?" This question is called a **DNS query**, and by default, it is sent in plaintext — readable by anyone between you and the DNS server.

Your Internet Service Provider typically handles your DNS queries. This means your ISP maintains a complete log of every domain you visit: every website, every app that connects to the internet, every service your devices contact. Even when you use HTTPS (which encrypts the *content* of your connection), the DNS query that initiates that connection is unencrypted. Your ISP sees `reddit.com`, `bankofamerica.com`, `plannedparenthood.org` — every domain, in the clear.

This guide explains how DNS works, why it is a privacy problem, and how to encrypt your DNS queries using the full landscape of available solutions.

---

## How DNS Works (30 Seconds)

1. You type `example.com` in your browser
2. Your device sends a DNS query: "What IP address does `example.com` resolve to?"
3. A DNS server responds: "`example.com` is at `93.184.216.34`"
4. Your browser connects to that IP address and loads the page

This happens for every domain your device contacts — not just websites, but app servers, update servers, analytics endpoints, and advertising networks. A typical device makes hundreds of DNS queries per day.

By default, these queries are sent over **UDP port 53** in **plaintext**. No encryption. No authentication. Anyone on the network path can read them, log them, or modify them.

---

## Why This Matters

### Your ISP Logs Your Browsing History

Your ISP resolves your DNS queries by default and can log every domain you visit. In the United States, ISPs can legally sell this data. Even ISPs that do not sell data retain DNS logs for varying periods and provide them in response to legal requests.

A VPN encrypts your traffic and hides it from your ISP — but if your DNS queries leak outside the VPN tunnel (a **DNS leak**), your ISP still sees every domain you visit. This is why DNS leak testing matters.

### DNS Can Be Manipulated

Because traditional DNS has no authentication, attackers can forge DNS responses (**DNS spoofing**) to redirect you to malicious websites. Your ISP can also use DNS to **block websites** by simply refusing to resolve certain domains, or to **redirect** failed queries to advertising pages.

### DNS Reveals Patterns

Even without seeing page content, DNS queries reveal your interests, habits, health concerns, political leanings, and relationships. A log of `webmd.com`, `aa.org`, `divorce-lawyer.com`, and `zillow.com` tells a story without reading a single page.

---

## The Solutions: Encrypted DNS

Two protocols encrypt DNS queries. Both solve the same core problem (preventing eavesdropping) but differ in implementation.

### DNS over HTTPS (DoH)

**How it works:** DNS queries are wrapped inside standard HTTPS traffic on **port 443** — the same port used for all encrypted web traffic.

**Key advantage:** DoH traffic is **indistinguishable** from regular web browsing. A network observer cannot tell that you are making a DNS query versus loading a website. This makes DoH resistant to blocking — you cannot block DoH without blocking all HTTPS traffic.

**Key limitation:** Because DoH hides DNS traffic inside HTTPS, network administrators (corporate IT, school networks) cannot monitor or filter DNS queries for security purposes. This is a feature for privacy but a concern for network security management.

**Supported by:** Firefox (built-in), Chrome (built-in), Edge, most major browsers and operating systems.

### DNS over TLS (DoT)

**How it works:** DNS queries are encrypted using TLS but sent on a **dedicated port (853)**.

**Key advantage:** DoT is cleaner architecturally — it separates DNS traffic from web traffic, making it easier for network administrators to manage.

**Key limitation:** Because DoT uses a dedicated port, it is **easily identifiable and blockable**. A network that wants to prevent encrypted DNS can simply block port 853.

**Supported by:** Android (Private DNS feature), Linux (systemd-resolved), some routers.

### Which Should You Use?

| Factor | DoH | DoT |
|---|---|---|
| **Harder to block** | ✅ Blends with HTTPS | ❌ Dedicated port |
| **Easier to set up** | ✅ Built into browsers | ⚠️ Requires OS/router config |
| **Network transparency** | ❌ Hidden from network admins | ✅ Visible as DNS traffic |
| **Best for** | Personal privacy | Network-wide deployment |

**For most individuals:** DoH is the practical choice. It is built into your browser and cannot be easily blocked.

---

## Choosing a DNS Provider

Encrypting your DNS queries prevents eavesdropping *in transit*, but the DNS provider you send queries to still sees every domain you resolve. You are moving trust from your ISP to your chosen DNS provider. Choose carefully.

### The Privacy DNS Landscape

| Provider | Privacy Policy | Logging | Special Features |
|---|---|---|---|
| **Quad9** (9.9.9.9) | Swiss nonprofit, strong privacy | No IP logging | Malware/phishing domain blocking, DNSSEC validation |
| **Cloudflare** (1.1.1.1) | US company, audited no-logs | Purged within 24 hours, audited by KPMG | Fastest major resolver, supports DoH/DoT/DoQ |
| **Mullvad DNS** | Swedish, same team as Mullvad VPN | No logging | Ad/tracker blocking options, pairs with Mullvad VPN |
| **NextDNS** | US/EU, customizable | Configurable (can be zero-log) | Customizable blocking lists, analytics dashboard (optional), free tier |
| **AdGuard DNS** | Cyprus | Configurable | Ad and tracker blocking at DNS level |
| **Control D** | Canadian | Configurable | Highly customizable filtering and blocking |

### Provider Selection by Threat Model

| Your Priority | Choose | Why |
|---|---|---|
| Maximum privacy, nonprofit trust | **Quad9** | Swiss nonprofit, no IP logging, DNSSEC |
| Fastest speed, audited no-logs | **Cloudflare 1.1.1.1** | KPMG-audited, globally distributed, fastest |
| Pair with Mullvad VPN | **Mullvad DNS** | Same trust model, ad blocking available |
| Customizable blocking + privacy | **NextDNS** | Build your own filter lists, zero-log option |
| Block ads at network level | **AdGuard DNS** | DNS-level ad blocking for all devices |

### What to Avoid

**Your ISP\'s default DNS.** It logs your queries, may inject ads, and may censor content.

**Google DNS (8.8.8.8).** Google logs DNS queries and associates them with other Google data. Using Google DNS while trying to avoid Google tracking is counterproductive.

---

## How to Set Up Encrypted DNS

### In Your Browser (Quickest)

**Firefox:**
1. Settings → Privacy & Security → scroll to "DNS over HTTPS"
2. Select "Max Protection" or "Increased Protection"
3. Choose provider (Cloudflare is default; you can enter a custom DoH URL)

**Chrome/Edge/Brave:**
1. Settings → Privacy and Security → Security
2. Toggle "Use secure DNS"
3. Select a provider or enter a custom URL

### On Your Phone

**Android (9+):**
1. Settings → Network & Internet → Private DNS
2. Select "Private DNS provider hostname"
3. Enter: `dns.quad9.net` or `one.one.one.one` or `dns.mullvad.net`

**iPhone:**
DNS encryption requires installing a configuration profile from your chosen provider. Cloudflare\'s 1.1.1.1 app and NextDNS both provide iOS profiles that enable system-wide encrypted DNS.

### On Your Router (Protects All Devices)

Configuring encrypted DNS on your router protects every device on your network — including IoT devices, smart TVs, and guests. The process varies by router but generally involves:

1. Access your router\'s admin panel
2. Find DNS settings
3. Replace ISP DNS with your chosen provider\'s IP addresses
4. If your router supports DoT, enable it and enter the provider\'s hostname

Note: Most consumer routers support custom DNS servers but not all support DoT/DoH natively. Routers running OpenWrt, pfSense, or similar firmware offer full support.

---

## Verify Your DNS Is Private

- **[DNS Leak Test](/tools/dns-leak)** — Our tool checks whether your DNS queries are going through your chosen encrypted provider or leaking to your ISP
- **dnsleaktest.com** — Independent DNS leak testing
- **1.1.1.1/help** — Cloudflare\'s diagnostic page shows whether you are using encrypted DNS

Test after every configuration change. Test on each device. Test on different networks (home, mobile, public Wi-Fi).

---

## DNS + VPN: How They Interact

If you use a VPN, your DNS queries should go through the VPN tunnel to the VPN provider\'s DNS servers. This is the default behavior for most quality VPNs.

A **DNS leak** occurs when some DNS queries escape the VPN tunnel and reach your ISP\'s DNS servers instead. This reveals the domains you visit to your ISP, defeating part of the VPN\'s purpose.

Common causes of DNS leaks:
- VPN client misconfiguration
- OS falling back to default DNS during VPN reconnection
- IPv6 DNS queries not routed through the VPN
- Smart Multi-Homed Name Resolution (Windows feature that queries all available DNS servers)

If you use a VPN, test for DNS leaks regularly using our [DNS Leak Test](/tools/dns-leak) or similar tools.

---

## 🔮 Where DNS Privacy Is Heading

**DNS over QUIC (DoQ) is emerging.** QUIC offers lower latency than TLS, potentially making encrypted DNS faster. AdGuard and some other providers already support it.

**Oblivious DNS over HTTPS (ODoH) separates identity from queries.** ODoH adds a proxy between you and the DNS resolver, so the resolver sees your query but not your IP, and the proxy sees your IP but not your query. Cloudflare and Apple have deployed this. It is the strongest DNS privacy option available.

**Encrypted Client Hello (ECH) closes the remaining gap.** Even with encrypted DNS, the TLS handshake (SNI) reveals the domain you are connecting to. ECH encrypts this, closing the last major plaintext leak. Browser and server support is growing.

**ISPs are pushing back.** Some ISPs have lobbied against DoH, arguing it undermines their ability to filter malicious content and comply with legal obligations. This tension will continue as encrypted DNS adoption grows.

---

## Key Takeaways

1. **Your ISP can see every domain you visit** through unencrypted DNS — even when you use HTTPS.
2. **DNS over HTTPS (DoH)** is the easiest way to encrypt DNS for individuals — enable it in your browser in 30 seconds.
3. **Choose a trustworthy DNS provider.** Quad9 (nonprofit), Cloudflare (audited), or Mullvad DNS are strong choices depending on your priorities.
4. **Do not use your ISP\'s DNS or Google DNS** if privacy is a concern.
5. **If you use a VPN, test for DNS leaks.** A VPN with DNS leaks still exposes your browsing to your ISP.
6. **Router-level DNS** protects all devices on your network, including those that cannot configure DNS themselves.

---

## Sources

- Cloudflare, "DNS over TLS vs. DNS over HTTPS," cloudflare.com/learning, 2025.
- WhoisFreaks, "DNS over HTTPS vs DNS over TLS: What You Need to Know in 2025," 2025.
- ControlD, "DNS-over-TLS (DoT) vs DNS-over-HTTPS (DoH): What\'s the Difference?," 2025.
- BitLaunch, "The 11 Best DNS Servers for Privacy in 2026," 2026.
- BufferSpeed, "DNS-over-HTTPS vs DNS-over-TLS: Which Should You Use in 2026?," 2026.
- NameSilo, "DoH vs DoT in 2025: Which DNS Privacy Protocol Wins?," 2025.
- Cloudflare, "Oblivious DNS over HTTPS (ODoH)," blog.cloudflare.com, 2023.
