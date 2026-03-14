---
title: "Privacy Glossary"
description: "Plain-language definitions of every privacy and security term used across Privacy Terminal guides and tools. Bookmark this page."
category: "foundations"
order: 7
tags: ["glossary", "terminology", "definitions", "reference", "privacy-basics"]
relatedTools: ["fingerprint-analyzer", "leak-tester", "webrtc-detector", "hash-generator", "email-header-analyzer", "metadata-stripper", "threat-profiler"]
relatedGuides: ["how-youre-being-tracked", "what-is-a-threat-model", "the-5-minute-privacy-checkup", "choosing-a-browser-for-privacy"]
draft: false
---

# Privacy Glossary

Plain-language definitions of privacy and security terms used across this site. Terms are organized alphabetically. Each links to the guide where it is explained in depth.

---

## A

**Ad Tech** — The industry of companies that serve, target, and track digital advertising. Includes ad networks, demand-side platforms, supply-side platforms, and data management platforms that work together to show you targeted ads based on your behavior.

**Advertising ID (GAID/IDFA)** — A unique identifier assigned to your phone by Google (GAID) or Apple (IDFA) that advertising networks use to track your behavior across apps. Can and should be deleted. → [Your Phone Is Tracking You](/guides/your-phone-is-tracking-you)

**AES-256** — Advanced Encryption Standard with a 256-bit key. The gold standard for symmetric encryption, used by VPNs, password managers, and encrypted messaging. Considered unbreakable with current technology.

## B

**Browser Fingerprinting** — A tracking technique that identifies you by combining your browser\'s unique characteristics — screen resolution, installed fonts, GPU, audio processing, and dozens of other attributes — into a distinctive profile. Does not require cookies or storage. → [Browser Fingerprinting Explained](/guides/browser-fingerprinting-explained)

## C

**Canvas Fingerprinting** — A fingerprinting technique where a website draws invisible graphics on an HTML5 canvas element and reads back the rendered pixels. Subtle differences in GPU, font rendering, and anti-aliasing create a unique fingerprint. → [Browser Fingerprinting Explained](/guides/browser-fingerprinting-explained)

**CCPA (California Consumer Privacy Act)** — California law giving residents the right to know what data companies collect about them, to delete it, and to opt out of its sale. Expanded by CPRA in 2023.

**Chilling Effect** — The phenomenon where people self-censor their speech, searches, and behavior when they know or suspect they are being watched. Documented by researcher Elizabeth Stoycheff (2016).

**Credential Stuffing** — An automated attack where stolen username/password pairs from one data breach are tested against thousands of other websites. Works because people reuse passwords. → [Password Managers and Account Security](/guides/password-managers-account-security)

**Cross-Site Tracking** — Tracking your activity across multiple, unrelated websites — typically through third-party cookies, tracking pixels, or fingerprinting. → [How You\'re Being Tracked Right Now](/guides/how-youre-being-tracked)

## D

**Data Broker** — A company that collects, aggregates, and sells personal information from public records, commercial sources, and online activity. The industry generates over $250 billion annually. → [Who Wants Your Data and Why](/guides/who-wants-your-data)

**DNS (Domain Name System)** — The system that translates domain names (like `example.com`) into IP addresses. By default, DNS queries are unencrypted, allowing your ISP to see every domain you visit. → [DNS Privacy Explained](/guides/dns-privacy-explained)

**DNS Leak** — When DNS queries escape a VPN tunnel and reach your ISP\'s DNS servers instead of the VPN\'s, revealing the domains you visit. → [DNS Privacy Explained](/guides/dns-privacy-explained)

**DNS over HTTPS (DoH)** — A protocol that encrypts DNS queries inside standard HTTPS traffic, making them indistinguishable from normal web browsing and resistant to blocking.

**DNS over TLS (DoT)** — A protocol that encrypts DNS queries using TLS on a dedicated port (853). More visible than DoH but architecturally cleaner.

**Doxxing** — Publishing someone\'s private information (home address, phone number, real name, family members) online without their consent, typically to enable harassment.

## E

**Email Alias** — A forwarding email address that relays mail to your real inbox. Allows you to give a unique address to every service without exposing your real email. → [Email Privacy: Beyond Gmail](/guides/email-privacy-beyond-gmail)

**End-to-End Encryption (E2EE)** — Encryption where messages are encrypted on the sender\'s device and can only be decrypted on the recipient\'s device. The service provider cannot read the content, even if compelled. Used by Signal, WhatsApp, and Proton Mail. → [Encrypted Messaging: Your Options](/guides/encrypted-messaging)

**Entropy (in fingerprinting)** — A measure of identifying information. Each bit of entropy halves the population that could match. Around 33 bits uniquely identifies a person among 8 billion. → [Browser Fingerprinting Explained](/guides/browser-fingerprinting-explained)

## F

**FIDO2/WebAuthn** — An authentication standard that enables passwordless login using hardware security keys or device biometrics. Phishing-proof because authentication is tied to the specific website domain.

**Five Eyes** — An intelligence-sharing alliance between the US, UK, Canada, Australia, and New Zealand. Extended versions include Nine Eyes and Fourteen Eyes. Relevant when choosing privacy services by jurisdiction.

## G

**GDPR (General Data Protection Regulation)** — European Union regulation granting individuals rights over their personal data, including the right to access, correct, and delete data. Violations can result in fines up to 4% of global revenue.

**GrapheneOS** — A privacy-hardened Android operating system for Pixel phones that removes or sandboxes Google services and provides granular per-app permission control. → [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

## H

**HTTPS** — Hypertext Transfer Protocol Secure. Encrypts the content of web connections, preventing eavesdropping on data in transit. Does not hide which domain you visit (that is visible through DNS and SNI), does not verify the site is trustworthy, and does not prevent tracking.

## I

**IP Address** — A numeric address assigned to your device on a network. Your public IP reveals your approximate location and ISP. Websites log it. VPNs replace it with the VPN server\'s IP.

## K

**Kill Switch (VPN)** — A feature that blocks all internet traffic if the VPN connection drops, preventing data from leaking outside the encrypted tunnel.

## M

**Metadata** — Data about data. In messaging, metadata includes who you talk to, when, how often, and from where — everything except the message content itself. Can be as revealing as content. → [Encrypted Messaging: Your Options](/guides/encrypted-messaging)

**Multi-Factor Authentication (MFA/2FA)** — Requiring two or more verification methods to access an account: something you know (password), something you have (phone/key), or something you are (biometric). → [Password Managers and Account Security](/guides/password-managers-account-security)

## O

**Off-Facebook Activity** — Meta\'s system for collecting data about your activity on non-Facebook websites and apps through the Facebook Pixel and SDK. Can be cleared and disabled. → [Social Media Privacy Settings](/guides/social-media-privacy-settings)

## P

**Passkeys** — A passwordless authentication standard backed by Apple, Google, and Microsoft. Uses cryptographic key pairs instead of passwords. Phishing-proof. → [Password Managers and Account Security](/guides/password-managers-account-security)

**Perfect Forward Secrecy** — A property of encryption protocols where each message uses a unique key. If one key is compromised, past and future messages remain protected.

**PGP/GPG** — Pretty Good Privacy / GNU Privacy Guard. Encryption standard for email and files using public-key cryptography. Each person has a public key (shared) and a private key (secret).

## Q

**Qubes OS** — An operating system that isolates every activity in a separate virtual machine for maximum compartmentalization. → [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

## S

**Signal Protocol** — The open-source encryption protocol used by Signal, WhatsApp, and others. Provides end-to-end encryption with perfect forward secrecy. Considered the gold standard for messaging encryption.

**SIM Swapping** — An attack where a criminal convinces your mobile carrier to transfer your phone number to their SIM card, allowing them to intercept SMS codes and hijack accounts that use SMS-based 2FA.

## T

**Tails** — The Amnesic Incognito Live System. A live operating system that boots from USB, routes all traffic through Tor, and leaves no trace on the host computer. → [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

**Threat Model** — A structured framework for deciding what to protect, from whom, how likely threats are, and how much effort is warranted. The foundation of all privacy decisions. → [What Is a Threat Model?](/guides/what-is-a-threat-model)

**TLS (Transport Layer Security)** — The encryption protocol that secures HTTPS connections, VPN tunnels, and other network communications.

**Tor (The Onion Router)** — A network that routes traffic through three encrypted relays to anonymize your connection. No single relay knows both who you are and what you are accessing.

**TOTP (Time-based One-Time Password)** — A 2FA method where an authenticator app generates a new 6-digit code every 30 seconds. Stronger than SMS, weaker than hardware keys.

**Tracking Pixel** — A tiny, invisible image embedded in emails or web pages that reports back when loaded, revealing your IP address, email client, and the time you opened the message.

## V

**VPN (Virtual Private Network)** — A tool that encrypts your internet traffic and replaces your IP address with the VPN server\'s IP. Prevents ISP surveillance and IP-based tracking but does not stop fingerprinting, cookies, or logged-in tracking. → [VPNs: What They Actually Protect](/guides/vpns-what-they-actually-protect)

## W

**WebRTC** — Web Real-Time Communication. A browser API for video/voice calls that can leak your real IP address even behind a VPN. → Test with our [WebRTC Leak Detector](/tools/webrtc-detector)

**Whonix** — A two-VM operating system that routes all traffic through Tor while preventing IP leaks by architectural design. → [Operating Systems for Privacy](/guides/operating-systems-for-privacy)

**WireGuard** — A modern VPN protocol known for speed, simplicity, and strong cryptography. Used by Mullvad, ProtonVPN, and most privacy-focused VPN providers.

## Z

**Zero-Knowledge Encryption** — An architecture where the service provider cannot access your data, even if compelled. The encryption keys exist only on your devices. Used by Proton Mail, Bitwarden, and 1Password.

---

*This glossary is updated as new guides are published. If a term is missing, it will be added in a future update.*
