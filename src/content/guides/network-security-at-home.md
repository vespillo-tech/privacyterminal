---
title: Network Security at Home
description: Your home network is the foundation everything else runs on. DNS-level ad blocking, IoT segmentation, and router hardening protect every device — including the ones that cannot protect themselves.
category: advanced
order: 2
publishedDate: '2026-03-17'
updatedDate: '2026-03-20'
tags:
- network
- pi-hole
- adguard-home
- router
- vlan
- iot
- dns-blocking
- firewall
relatedTools:
- dns-leak
- leak-tester
relatedGuides:
- dns-privacy-explained
- vpns-what-they-actually-protect
- your-phone-is-tracking-you
tldr:
- Your home network is the foundation — it protects every device including those that cannot protect themselves
- DNS-level ad blocking (Pi-hole or AdGuard Home) blocks tracking across all devices on your network
- Isolate IoT devices on a separate network segment to limit their access
- Change your router default password and keep firmware updated
faq:
- question: What is Pi-hole and should I use it?
  answer: Pi-hole is a network-wide DNS-level ad and tracker blocker that runs on a Raspberry Pi or any Linux device. It blocks ads, tracking domains, and malware for every device on your network — including
    smart TVs, IoT devices, and phones that cannot run browser extensions.
- question: Should I segment my IoT devices on a separate network?
  answer: Yes. IoT devices (smart speakers, cameras, thermostats) often have poor security and phone home to manufacturer servers. Putting them on a separate VLAN or guest network prevents a compromised
    IoT device from accessing your computers, phones, and personal files.
- question: How do I secure my home router?
  answer: Change the default admin password, update firmware regularly, disable WPS (Wi-Fi Protected Setup), use WPA3 or WPA2 encryption, disable remote management, change the default SSID, and configure
    encrypted DNS. If your ISP router does not support these features, consider a third-party router.
draft: false
---

# Network Security at Home

Every privacy guide in this series addresses individual devices and applications — your browser, your phone, your messaging app. But all of these devices share one thing: your home network. And your home network, by default, has almost no privacy protections.

Your router is the gateway between every device in your home and the internet. Smart TVs, IoT devices, voice assistants, gaming consoles, security cameras, and guest devices all send traffic through it — and most of these devices cannot run a VPN, cannot install a browser extension, and cannot be configured for encrypted DNS. They are privacy blind spots.

Network-level protections address what device-level protections cannot. When you filter ads and trackers at the DNS level, *every* device on your network benefits — including the ones you cannot configure individually.

---

## Layer 1: Encrypted DNS for Your Entire Network

The simplest network-wide improvement is changing your router\'s DNS settings. As explained in [DNS Privacy Explained](/guides/dns-privacy-explained), your ISP\'s default DNS servers log every domain every device in your home resolves.

**On your router:**
1. Access your router\'s admin panel (typically 192.168.1.1 or 192.168.0.1)
2. Find DNS settings (often under WAN, Internet, or DHCP settings)
3. Replace your ISP\'s DNS with a privacy-respecting provider:
   - **Quad9:** `9.9.9.9` / `149.112.112.112` (nonprofit, malware blocking)
   - **Cloudflare:** `1.1.1.1` / `1.0.0.1` (fast, audited no-logs)
   - **Mullvad DNS:** `100.64.0.4` (pairs with Mullvad VPN)

If your router supports **DNS over TLS (DoT)**, enable it and enter the provider\'s hostname (e.g., `dns.quad9.net`). This encrypts DNS queries between your router and the resolver.

**Impact:** Every device on your network — including smart TVs, IoT devices, and guests — now uses encrypted, privacy-respecting DNS instead of your ISP\'s logging servers.

---

## Layer 2: DNS-Level Ad and Tracker Blocking

Going beyond encrypted DNS, you can block ads, trackers, and malicious domains at the DNS level — before they ever reach any device.

### Pi-hole — The Open-Source Standard

**What it is:** A network-wide DNS sinkhole that blocks advertising and tracking domains. Runs on a Raspberry Pi, any Linux machine, or in a Docker container.

**How it works:** Pi-hole sits between your devices and the internet as your network\'s DNS server. When a device requests an ad or tracking domain (e.g., `ads.google.com`, `facebook.net/tr`), Pi-hole returns a null response — the request never leaves your network. Legitimate domains resolve normally.

**Strengths:**
- Blocks ads and trackers for *every* device on your network, including smart TVs, IoT, and apps
- Open source, well-documented, large community
- Web dashboard shows which devices are making what queries
- Customizable blocklists
- Can serve as your network\'s DHCP server

**Limitations:**
- Requires a device to run on (Raspberry Pi ~$35, or Docker on existing hardware)
- Some websites detect DNS-level blocking and nag you to disable it
- Cannot block ads served from the same domain as content (YouTube ads, for example)
- Requires occasional maintenance (updating blocklists, monitoring)

### AdGuard Home — The Polished Alternative

**What it is:** Similar to Pi-hole but with a more polished interface, built-in DNS-over-HTTPS/TLS support, and additional filtering capabilities.

**Strengths:**
- Encrypted DNS (DoH/DoT) built in — no additional configuration
- Cleaner, more modern web interface
- Built-in HTTPS filtering and safe browsing
- Supports DNS rewrites and custom filtering rules
- Easier initial setup than Pi-hole

**Limitations:**
- Slightly higher resource usage than Pi-hole
- Smaller community than Pi-hole (though growing)
- Some features overlap with router-level settings, which can cause confusion

### The Comparison

| Feature | Pi-hole | AdGuard Home |
|---|---|---|
| **Ad/tracker blocking** | ✅ | ✅ |
| **Encrypted DNS built-in** | ❌ (requires additional setup) | ✅ |
| **Interface** | Functional | Polished |
| **Community/docs** | Larger | Growing |
| **Resource usage** | Lower | Moderate |
| **Best for** | Tinkerers, existing Pi owners | Users wanting easiest setup |

Both are excellent. If you already have a Raspberry Pi, start with Pi-hole. If you want the easiest path to DNS filtering with encryption, choose AdGuard Home.

---

## Layer 3: Router Hardening

Your router is the most important and most neglected security device in your home.

### Essential Router Settings

**Change the admin password.** Default credentials for every router model are published online. If your admin password is still `admin`/`password`, anyone on your network (or within Wi-Fi range) can reconfigure your router.

**Update firmware.** Router vulnerabilities are discovered regularly. Many consumer routers never receive updates, or require manual updates. Check for updates monthly.

**Disable remote management.** Unless you specifically need to manage your router from outside your home, disable remote admin access.

**Disable WPS (Wi-Fi Protected Setup).** WPS has known vulnerabilities that allow brute-force attacks against the PIN. Disable it.

**Use WPA3 (or WPA2 with a strong password).** WPA3 is the current standard. If your router only supports WPA2, use a long, random passphrase (20+ characters). Never use WEP or open networks.

**Disable UPnP (Universal Plug and Play).** UPnP automatically opens ports on your router when devices request it — including potentially compromised devices or malware. Disable it and manually forward only the ports you need.

**Change the default subnet.** Most routers use 192.168.1.x or 192.168.0.x. Changing to a less common subnet (e.g., 192.168.47.x) provides a minor layer of obscurity.

---

## Layer 4: Network Segmentation

The most powerful network security improvement for advanced users is **segmentation** — separating your network into isolated zones.

### Why Segmentation Matters

A flat home network (the default) means every device can communicate with every other device. Your smart TV, your guest\'s phone, your IoT thermostat, and your work laptop all share the same network. If one device is compromised, the attacker can potentially access everything.

Segmentation creates boundaries:

| Zone | Devices | Access |
|---|---|---|
| **Trusted** | Your laptop, phone, NAS | Full internet + local access |
| **IoT** | Smart TV, cameras, thermostat | Internet only, no access to trusted devices |
| **Guest** | Visitors\' devices | Internet only, isolated from everything |

### How to Segment

**Guest Network (easiest):** Most modern routers support a separate guest Wi-Fi network. Enable it and put IoT devices and visitors on it. This provides basic isolation with zero technical skill.

**VLANs (advanced):** Virtual LANs create true network segmentation at the switch/router level. Devices on different VLANs cannot communicate unless explicitly allowed by firewall rules. Requires a VLAN-capable router (most consumer routers do not support this — you need prosumer or enterprise equipment, or custom firmware like OpenWrt).

**Separate physical networks:** For maximum isolation, some users run separate physical routers for IoT and trusted devices. This is overkill for most but may be appropriate for high-security environments.

---

## Layer 5: Advanced Router Firmware

Consumer router firmware is often abandoned by manufacturers within 1-2 years. Open-source alternatives provide better security, more features, and longer support.

### OpenWrt

The gold standard for open-source router firmware. Provides full Linux networking capabilities: VLANs, advanced firewall rules, VPN client/server, DNS filtering, and more. Requires compatible hardware and comfort with Linux configuration.

### OPNsense / pfSense

Full-featured firewall/router operating systems that run on dedicated hardware (an old PC, a mini PC, or purpose-built appliances). Overkill for most homes but provide enterprise-grade network security for those who want it.

---

## The Practical Progression

| Step | Effort | Impact |
|---|---|---|
| Change router DNS to Quad9/Cloudflare | 5 minutes | All devices get encrypted DNS |
| Change admin password, update firmware, disable WPS/UPnP | 15 minutes | Closes the most common attack vectors |
| Enable guest network for IoT devices | 5 minutes | Basic isolation of untrusted devices |
| Install Pi-hole or AdGuard Home | 1-2 hours | Network-wide ad/tracker blocking |
| Configure VLANs for true segmentation | Several hours | Strong isolation between device categories |
| Install OpenWrt or dedicated firewall | Half a day | Maximum control over your network |

---

## 🔮 Where Home Network Security Is Heading

**Wi-Fi 7 and WPA3** are becoming standard, improving both speed and encryption. Ensure your next router supports both.

**Matter/Thread smart home protocols** are reducing IoT devices\' dependence on cloud connections, potentially improving local privacy.

**DNS-over-QUIC and Oblivious DoH** are reaching consumer routers, providing even stronger DNS privacy.

**Router-level VPN** support is improving. Some routers now natively support WireGuard, allowing you to route all household traffic through a VPN without configuring individual devices.

---

## Key Takeaways

1. **Change your router\'s DNS** to a privacy-respecting provider. 5 minutes, protects every device.
2. **Harden your router** — change admin password, update firmware, disable WPS and UPnP.
3. **Pi-hole or AdGuard Home** blocks ads and trackers for your entire network, including devices you cannot configure individually.
4. **Use your guest network** for IoT devices and visitors — basic but effective isolation.
5. **VLANs** provide true network segmentation for advanced users.
6. **Your router is the most neglected security device in your home.** Give it attention.

---

## Sources

- Pi-hole, "Network-Wide Ad Blocking," pi-hole.net, 2026.
- AdGuard, "AdGuard Home," adguard.com, 2026.
- OpenWrt, "Table of Hardware," openwrt.org, 2026.
- NIST, "Securing Small-Office/Home-Office (SOHO) Routers," SP 1800-36, 2024.
- CISA, "Home Network Security Best Practices," cisa.gov, 2025.
- Ars Technica, "Why You Should Segment Your Home Network," 2024.
