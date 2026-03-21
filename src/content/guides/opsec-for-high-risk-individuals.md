---
title: OPSEC for High-Risk Individuals
description: If your privacy is not a preference but a necessity — if the wrong person seeing the wrong data could endanger you or someone you protect — this guide is for you.
category: advanced
order: 3
publishedDate: '2026-03-17'
updatedDate: '2026-03-20'
tags:
- opsec
- journalist
- activist
- whistleblower
- high-risk
- compartmentalization
- source-protection
relatedTools:
- fingerprint-analyzer
- leak-tester
- webrtc-detector
- metadata-stripper
- email-header-analyzer
relatedGuides:
- what-is-a-threat-model
- operating-systems-for-privacy
- encrypted-messaging
- vpns-what-they-actually-protect
tldr:
- OPSEC is a discipline, not a tool — it requires consistent behavior and compartmentalization
- Never mix identities — personal, professional, and sensitive activities use separate devices and accounts
- The weakest point in your security is usually human behavior, not technology
- 'Source protection requires end-to-end planning: secure communication, metadata removal, air-gapped storage'
faq:
- question: Who needs high-risk OPSEC?
  answer: Journalists protecting sources, activists in authoritarian countries, domestic abuse survivors, whistleblowers, security researchers, and anyone whose physical safety could be compromised by their
    digital activity.
- question: What is compartmentalization in OPSEC?
  answer: Compartmentalization means keeping different areas of your life completely separate in the digital world — different devices, different accounts, different networks, different identities. If one
    compartment is compromised, the others remain intact. This is the single most important OPSEC principle.
- question: What device should I use for sensitive communications?
  answer: A dedicated device used only for sensitive communications — ideally a Pixel phone running GrapheneOS or a laptop running Tails. This device should never be used for personal activities, should
    connect through Tor or a trusted VPN, and should never be linked to your real identity.
draft: false
---

# OPSEC for High-Risk Individuals

This guide is different from everything else on this site.

The other guides help you reduce commercial surveillance, limit data broker exposure, and improve your general privacy hygiene. They address the threats most people face. The stakes are usually convenience, money, or mild embarrassment.

This guide is for people whose stakes are higher. Journalists protecting sources. Activists organizing in hostile environments. Whistleblowers exposing wrongdoing. Domestic violence survivors hiding from abusers. Dissidents in authoritarian states. Researchers handling sensitive data.

For these individuals, a single operational security failure — one metadata leak, one unencrypted message, one location exposure — can result in imprisonment, physical harm, job loss, or danger to others.

If that is your situation, read everything below. If it is not, this guide may still sharpen your understanding of privacy in practice.

---

## The Principles

Operational security (OPSEC) is not a set of tools. It is a discipline built on five principles:

### 1. Compartmentalization

Never mix identities. Your personal life, your sensitive work, and your public persona should exist in separate, non-overlapping compartments.

**In practice:**
- Separate devices for sensitive work and personal use. At minimum, separate browser profiles.
- Separate email addresses with no connection between them (different providers, different recovery methods)
- Separate phone numbers (burner, VoIP, or dedicated device)
- Never log into a personal account from a work context, or vice versa
- Never use the same username, password, writing style, or behavioral patterns across compartments

**The failure mode:** You use your personal email to sign up for a service related to your sensitive work. That service is breached. Your email appears in the breach database. Someone searching your email now discovers your connection to that work.

### 2. Assume Compromise

Operate as if every device, network, and service could be monitored. This is not paranoia — it is a design principle.

**In practice:**
- Never say anything on a phone or messaging platform that you would not say in a public square — unless the platform provides verified end-to-end encryption and you have verified the contact\'s identity
- Never send sensitive material over unencrypted channels, even "just this once"
- Assume your phone\'s location is being tracked at all times (because it is — by your carrier, if no one else)
- Assume your internet traffic is being logged by your ISP (because it is, unless you use a VPN or Tor)

### 3. Minimize

Collect, store, and transmit the minimum amount of sensitive data possible.

**In practice:**
- Do not take unnecessary notes about sensitive meetings or conversations
- Use disappearing messages for sensitive communications
- Strip metadata from files before sharing (use our [Metadata Stripper](/tools/metadata-stripper))
- Do not photograph sensitive documents on a phone that syncs to the cloud
- Delete sensitive material when it is no longer needed — securely, not just to the trash

### 4. Verify

Do not trust assumptions. Verify that your tools are working correctly.

**In practice:**
- Verify your VPN is not leaking → [IP & DNS Leak Tester](/tools/leak-tester)
- Verify WebRTC is not exposing your real IP → [WebRTC Leak Detector](/tools/webrtc-detector)
- Verify your browser fingerprint is not unique → [Browser Fingerprint Analyzer](/tools/fingerprint-analyzer)
- Verify email headers do not reveal your location → [Email Header Analyzer](/tools/email-header-analyzer)
- Verify Signal safety numbers with contacts in person when possible
- Test your setup before you rely on it in a critical situation

### 5. Plan for Failure

What happens if your device is seized? If your account is compromised? If your VPN drops?

**In practice:**
- Enable full-disk encryption on all devices
- Use a strong passphrase, not biometrics, for device unlock (in most jurisdictions, courts can compel a fingerprint but not a passphrase — though this legal landscape is evolving)
- Enable your VPN\'s kill switch so all traffic stops if the VPN disconnects
- Know what data is on each device and what it reveals if examined
- Have a plan for secure communication if your primary channel is compromised
- Know your legal rights regarding device searches in your jurisdiction

---

## The Toolkit

Based on the principles above, here is the technical stack for high-risk OPSEC, with references to the detailed guides for each layer:

### Communication

| Sensitivity | Tool | Why |
|---|---|---|
| Standard secure | **Signal** (disappearing messages ON) | Minimal metadata, proven in court, open source |
| Source contact | **SecureDrop** (if your organization runs one) | Air-gapped architecture, Tor-only, designed for whistleblower submissions |
| Anonymous contact | **Session** | No phone number required, onion-routed, decentralized |
| Email (if unavoidable) | **Proton Mail** (with Tor Browser) | End-to-end encrypted, but email metadata is inherently leaky |

Detailed comparison → [Encrypted Messaging: Your Options](/guides/encrypted-messaging)

### Browsing and Research

| Activity | Tool | Why |
|---|---|---|
| Sensitive research | **Tor Browser** | Three-hop encrypted routing, standardized fingerprint |
| Daily browsing (separate identity) | **Brave** or **LibreWolf** | Strong defaults without Tor\'s speed penalty |
| File downloading | **Tails** (USB boot) | Leaves no traces on the host computer |

Detailed comparison → [Choosing a Browser for Privacy](/guides/choosing-a-browser-for-privacy) and [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

### Network

| Need | Tool | Why |
|---|---|---|
| IP privacy from ISP | **Mullvad VPN** (cash/crypto payment) | No account data, no email required, independently audited |
| IP anonymity for research | **Tor** (via Tor Browser or Whonix) | Strongest anonymity, but slower |
| DNS privacy | **Encrypted DNS** via VPN or router | Prevents DNS query logging |

Detailed comparison → [VPNs: What They Actually Protect](/guides/vpns-what-they-actually-protect)

### Device

| Scenario | Tool | Why |
|---|---|---|
| Desktop/laptop for sensitive work | **Qubes OS** (with Whonix for Tor) | Maximum compartmentalization |
| Temporary sensitive sessions | **Tails** (USB boot) | Amnesia — leaves no trace |
| Daily mobile | **GrapheneOS** | Sandboxed Google, per-app network control |
| Sensitive mobile | **Dedicated device** with GrapheneOS, no SIM | Eliminates carrier tracking |

Detailed comparison → [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

---

## Specific Scenarios

### Protecting a Confidential Source (Journalists)

1. **First contact:** SecureDrop or Signal (have the source contact you; do not reach out via channels that create records)
2. **Communication:** Signal with disappearing messages. Verify Safety Numbers in person if possible.
3. **Never store source\'s real identity** on any networked device
4. **In-person meetings:** Leave your phone at home or in a Faraday bag. Do not meet at locations linked to either party. Pay cash.
5. **Document handling:** Receive documents via SecureDrop or air-gapped device. Strip metadata before any further handling. Never open documents on a networked computer first — use Tails or a Qubes disposable VM.
6. **Publication:** Ensure published documents are scrubbed of hidden metadata (printer dots, EXIF, embedded identifiers)

### Organizing in Hostile Environments (Activists)

1. **Communication:** Signal group with trusted members only. Disappearing messages enabled. Verify each member\'s Safety Number.
2. **Planning:** Never discuss specific plans on any platform — only in person or via verified Signal with disappearing messages
3. **Protest/action:** Phone in airplane mode or left at home. If bringing a phone, use a dedicated device with no personal data. Use PIN, not biometrics.
4. **Photography:** If documenting, disable location metadata before posting. Blur faces of participants. Post after leaving the area.
5. **Post-action:** Review what digital traces were created. Delete unnecessary documentation.

### Escaping Domestic Violence

1. **Immediate:** If your abuser has access to your phone or accounts, assume everything on those devices is compromised
2. **New device:** Obtain a new phone that your abuser does not know about. Prepaid, purchased with cash. Do not connect it to your existing accounts.
3. **Communication:** Use Signal on the new device. Do not call or text from numbers known to your abuser.
4. **Location:** Turn off location services on all devices. Check for AirTags or tracking devices on your person and vehicle.
5. **Accounts:** Do not change passwords on shared accounts until you are safe — sudden changes can alert an abuser. Create new accounts from the new device.
6. **Address confidentiality:** Contact your state\'s Address Confidentiality Program (ACP) for a substitute address.
7. **Support:** The National Domestic Violence Hotline (1-800-799-7233) has trained technology safety specialists.

---

## The Hardest Part

The hardest part of OPSEC is not the technology. It is the discipline.

Technology fails predictably. Humans fail unpredictably. One moment of convenience — checking personal email on a work device, using a familiar username, sending an unencrypted message "just this once" — can unravel months of careful practice.

OPSEC is not a configuration. It is a habit. The tools change. The principles do not.

---

## Resources

- **EFF Surveillance Self-Defense:** [ssd.eff.org](https://ssd.eff.org) — comprehensive guides for various threat levels
- **Freedom of the Press Foundation:** [freedom.press](https://freedom.press) — journalist-specific security resources, SecureDrop
- **Security in a Box:** [securityinabox.org](https://securityinabox.org) — security guides for activists and human rights defenders
- **Access Now Digital Security Helpline:** [accessnow.org/help](https://www.accessnow.org/help/) — free, direct support for civil society under threat
- **National Domestic Violence Hotline:** 1-800-799-7233 — includes technology safety specialists
- **Frontline Defenders:** [frontlinedefenders.org](https://www.frontlinedefenders.org/) — protection resources for human rights defenders

---

## Sources

- Electronic Frontier Foundation, Surveillance Self-Defense, ssd.eff.org, 2025.
- Freedom of the Press Foundation, "Security for Journalists," freedom.press, 2025.
- Committee to Protect Journalists, "Digital Safety Kit," cpj.org, 2025.
- Amnesty International / Citizen Lab, Pegasus Project investigation, 2021-2025.
- Privacy Guides, "Desktop and Mobile Operating Systems," privacyguides.org, 2025.
- Signal Foundation, "Safety Numbers," signal.org, 2024.
