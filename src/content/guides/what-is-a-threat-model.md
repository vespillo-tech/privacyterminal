---
title: "What Is a Threat Model? (And Why You Need One)"
description: "Privacy is personal. A threat model helps you decide what to protect, from whom, and how far to go — without the paralysis of trying to defend against everything."
category: "foundations"
order: 3
tags: ["threat-modeling", "risk-assessment", "privacy-planning", "opsec", "personal-security"]
relatedTools: ["fingerprint-analyzer", "dns-leak"]
relatedGuides: ["who-wants-your-data", "how-youre-being-tracked"]
difficulty: 2
tldr:
  - "A threat model answers: what are you protecting, from whom, and what are the consequences"
  - "Not everyone needs the same level of privacy — your model depends on your situation"
  - "Start with your biggest realistic threats, not worst-case scenarios"
draft: false
---

# What Is a Threat Model? (And Why You Need One)

If you have read the previous guides in this series, you now know [how you are being tracked](/guides/how-youre-being-tracked) and [who wants your data](/guides/who-wants-your-data). That knowledge can feel overwhelming. The natural reaction is either to try to lock down everything at once — or to give up entirely because the problem feels too big.

Both reactions are understandable. Both are wrong.

The missing piece is a **threat model**: a structured way of thinking about what you need to protect, from whom, and how much effort is worth spending. It is the single most important concept in personal privacy, because it transforms vague anxiety into specific, actionable decisions.

You do not need to be a security researcher to build one. You just need to answer five honest questions.

---

## The Lock on Your Front Door

You already threat model. You just do not call it that.

When you lock your front door, you are making a security decision. You have assessed that the contents of your home are worth protecting. You have identified potential adversaries — burglars, opportunistic thieves. You have evaluated the risk — break-ins happen, especially if doors are left unlocked. And you have chosen a countermeasure — a lock — that balances security with convenience.

You did not install a bank vault door. You did not hire armed guards. You did not decide your home was indefensible and leave the door wide open. You found a reasonable middle ground based on your situation.

Digital privacy works exactly the same way. The goal is not perfect security — that does not exist. The goal is **appropriate security** for your life, your circumstances, and your actual risks.

---

## The Five Questions

The framework used by the [Electronic Frontier Foundation](https://ssd.eff.org) and recommended by most credible privacy organizations is built on five questions. They are simple to state and genuinely useful to answer.

### 1. What do I want to protect?

These are your **assets** — anything you value that exists in digital form. Start by listing them:

- Email content and contact lists
- Private messages and chat history
- Photos and videos (especially intimate or identifying ones)
- Financial information — bank accounts, credit cards, transaction history
- Location data — where you live, work, and travel
- Health information — prescriptions, diagnoses, therapy records
- Browsing history and search queries
- Social connections — who you talk to, how often, about what
- Professional information — trade secrets, client data, internal communications
- Identity documents — passport scans, Social Security numbers, government IDs
- Biometric data — fingerprints, face scans, voice recordings

For each asset, note where it lives. Your email is stored on Google's servers, your phone's location history is with Apple or Google, your messages might be on Meta's infrastructure. Knowing where your data is stored tells you who already has access to it.

### 2. Who do I want to protect it from?

These are your **adversaries**. Be specific. Different adversaries have very different capabilities:

| Adversary | Capability | Typical Goal |
|---|---|---|
| **Advertising networks** | Massive data aggregation, cross-site tracking, behavioral profiling | Sell your attention to advertisers |
| **Data brokers** | Purchase, aggregate, and resell data from hundreds of sources | Build and sell comprehensive profiles |
| **Hackers/criminals** | Phishing, credential stuffing, malware, social engineering | Steal money, identities, or leverage for extortion |
| **Nosy individuals** | Physical access to devices, shoulder surfing, social media stalking | Curiosity, jealousy, control |
| **Employers** | Network monitoring, device management software, productivity tracking | Manage risk, monitor productivity |
| **Internet Service Providers** | Can see all unencrypted traffic, DNS queries, connection metadata | Sell browsing data, comply with legal requests |
| **Government (passive)** | Bulk metadata collection, data purchases from brokers, legal compulsion of companies | National security, law enforcement |
| **Government (active)** | Targeted surveillance, device exploitation, informants | Investigate specific individuals |

Most people face a combination of these. Almost everyone faces the first three. Fewer people have realistic concerns about the last two.

### 3. How likely is it that I will need protection?

This is **risk assessment**. Not everything that *could* happen is equally likely to happen.

A data broker selling your information to an advertiser? That is happening right now, to essentially everyone. The probability is near 100%.

A nation-state intelligence agency targeting you specifically? Unless you are a journalist covering national security, a political dissident, or involved in sensitive government work, this is extremely unlikely.

Both are real threats. But they demand very different responses. Spending energy defending against an unlikely attack while ignoring a certain one is a common and costly mistake.

### 4. How bad are the consequences if protection fails?

This is **impact assessment**. Some privacy failures are annoying. Others are devastating.

- Your browsing history is sold to advertisers → You see creepy targeted ads. **Annoying.**
- Your email is compromised → An attacker resets passwords on other accounts, locks you out, accesses financial information. **Serious.**
- Your home address is published online by a hostile actor → You receive threats, fear for physical safety, may need to relocate. **Severe.**
- A journalist's source is identified through communication metadata → The source faces imprisonment or worse. **Catastrophic.**

The severity of consequences determines how much inconvenience is justified in prevention.

### 5. How much trouble am I willing to go through?

This is the **reality check**. Security measures that you will not actually use provide no security at all.

Using a password manager requires changing your habits. Switching to encrypted messaging means convincing your contacts to switch too. Using Tor for browsing is slower. Running a VPN adds a step. Avoiding major cloud platforms means finding alternatives for services you rely on.

Every security measure has a cost — in time, money, convenience, or social friction. The best threat model is one you will actually follow. An imperfect plan you stick to beats a perfect plan you abandon after a week.

---

## Four People, Four Threat Models

Abstract frameworks become useful when applied to real situations. Here are four people with very different privacy needs. None of them is more "correct" than another. Each has built a threat model appropriate to their life.

### Maya — The Everyday User

**Who she is:** A 34-year-old graphic designer. Uses Instagram, shops online, streams music. No particular enemies. No public profile.

**Her main concerns:** She does not want companies building a detailed profile of her life. She was unsettled when an ad appeared for something she only mentioned in conversation. She does not want an ex to easily find her new address.

**Her adversaries:** Advertising networks, data brokers, nosy acquaintances.

**Her threat model:**
- Use a password manager and unique passwords for every account (prevents credential stuffing)
- Enable two-factor authentication on email and financial accounts
- Switch default browser to one with better tracking protection
- Install a reputable ad/tracker blocker
- Review social media privacy settings quarterly
- Opt out of major data broker sites
- Use a privacy-respecting search engine for sensitive queries

**What she does not need:** A VPN for everyday browsing (though it would help on public Wi-Fi), Tor Browser, encrypted email, a burner phone. These tools exist for real threats, but they are not proportionate to Maya's actual risks. If her situation changes — a stalker, a contentious divorce, a public-facing role — she can add layers.

### David — The Privacy-Conscious Professional

**Who he is:** A 41-year-old attorney who handles sensitive client communications. Works partially from coffee shops and co-working spaces. Active on LinkedIn. Handles privileged legal information daily.

**His main concerns:** Client confidentiality is a professional obligation. He uses public Wi-Fi regularly. A breach of client data could end his career and expose him to malpractice liability. His LinkedIn profile makes him easy to research for social engineering.

**His adversaries:** Hackers (phishing, credential theft), network eavesdroppers on public Wi-Fi, opposing counsel (in contentious cases), data brokers (professional profiling).

**His threat model (adds to Maya's baseline):**
- VPN active whenever on public or untrusted networks
- Encrypted email (or encrypted attachments) for all client communications
- Full-disk encryption on all devices
- Separate browser profiles for work and personal use
- Regular review of what information about him is publicly available
- Phishing awareness — verify unexpected requests through a second channel
- Device lock screens with short timeouts
- Remote wipe capability on phone and laptop

**What he does not need (yet):** Tor for daily use, anonymous phone numbers, compartmentalized identities. His threat is primarily opportunistic hackers and network snoopers, not targeted surveillance.

### Lucia — The Public-Facing Activist

**Who she is:** A 28-year-old climate activist who organizes protests and has a growing social media following. She has received online harassment and a few vague threats. Her real name is publicly associated with her activism.

**Her main concerns:** Doxxing — someone publishing her home address, phone number, or family members' information. Harassment campaigns. Physical safety at protests. Government monitoring of protest organizing.

**Her adversaries:** Hostile online communities, data brokers (easy source for doxxers), law enforcement (protest surveillance, social media monitoring), social engineers targeting her or her family.

**Her threat model (adds to David's baseline):**
- Aggressive data broker opt-outs, repeated quarterly (brokers re-list)
- Separate identities: activism under public name, personal life locked down
- End-to-end encrypted messaging for all organizing (Signal, not SMS, not unencrypted email)
- Protest-specific measures: phone in airplane mode or left home, no biometrics to unlock (use PIN)
- Social media audit: remove location metadata from photos before posting, limit personal details
- Secure her family's information — they are indirect targets
- Two separate email addresses: public-facing and private (never linked)
- Be cautious about who has her phone number

**What she monitors:** Whether her home address appears in new data broker listings. Whether new social media accounts are created impersonating her. Whether her name appears in government records requests (where FOIA allows).

### James — The Investigative Journalist

**Who he is:** A 45-year-old journalist covering corruption in government contracting. His sources face retaliation if identified. He has been the subject of legal threats and suspects his communications have been targeted.

**His main concerns:** Source protection is paramount — not just ethically, but legally. If a source is burned, that person may face prosecution, termination, or physical danger. His own communications, travel patterns, and contacts are all potential intelligence for adversaries.

**His adversaries:** Government agencies (both domestic and foreign), well-resourced corporate legal teams, private intelligence firms hired to identify sources, sophisticated hackers.

**His threat model (adds to Lucia's baseline):**
- All source communication via Signal with disappearing messages — or SecureDrop for initial contact
- Tor Browser for all research related to investigations
- Dedicated air-gapped device for handling the most sensitive documents
- Never carry a phone to source meetings
- VPN with a trustworthy, audited provider — or Tor — for all work browsing
- Encrypted laptop with strong passphrase (not biometric — a court can compel a fingerprint but not a passphrase in most US jurisdictions, though this is evolving)
- Assumption that email, even encrypted, may have metadata exposed — minimize email use for sensitive work
- Physical security awareness: vary routines, be aware of surveillance
- Legal preparation: know his rights if devices are seized at borders or during legal proceedings

**The reality he accepts:** This level of operational security is burdensome. It slows his work. It makes simple tasks complicated. He accepts this because the consequences of failure are not inconvenience — they are someone else's safety.

---

## Common Mistakes

Having helped you build the framework, here is what goes wrong most often:

**Trying to do everything at once.** You read a privacy guide, get motivated, and spend a weekend switching every tool, locking down every account, and installing twelve new applications. By Wednesday, you are exhausted and frustrated. Two weeks later, you have abandoned most of it. Start with the measures that address your highest-impact, highest-likelihood risks. Add layers gradually.

**Copying someone else's threat model.** A journalist's operational security is overkill for most people — and may actually draw more attention than it deflects. Conversely, a casual user's measures would be negligent for someone facing targeted harassment. Your threat model must be *yours*.

**Ignoring the human factor.** The most sophisticated encryption is useless if you tell someone your password, click a phishing link, or leave your unlocked phone on a restaurant table. Most breaches exploit people, not technology.

**Assuming it is permanent.** Your threat model should change when your life does. A new job, a new relationship, a move to a new country, a shift into public life, a contentious legal proceeding — all of these change your risk profile. Revisit your threat model at least once a year, and immediately after any major life change.

**Letting perfect be the enemy of good.** There is no configuration of tools that makes you invisible. Reducing your exposure by 80% with modest effort is vastly better than reducing it by 0% because you could not achieve 100%.

---

## Building Your Threat Model: A 15-Minute Exercise

Open a document or grab a piece of paper. You do not need to share this with anyone.

1. **List your top 5 digital assets** — the data or accounts that would cause you the most harm if compromised. Rank them by consequence severity.

2. **List your realistic adversaries** — not everyone from the table above, just the ones that actually apply to your life right now. Be honest, not dramatic.

3. **For each asset + adversary pair, rate the likelihood** (low, medium, high) and the impact (annoying, serious, severe, catastrophic).

4. **Identify the high-likelihood, high-impact combinations.** These are your priorities. Everything else can wait.

5. **Choose one or two countermeasures you will actually implement this week.** Not ten. One or two.

Write down what you chose and when you will revisit this exercise. Set a calendar reminder for 90 days from now.

---

## 🔮 The Evolving Landscape

Your threat model exists in a changing world. Several trends are reshaping the privacy landscape in ways worth monitoring:

**The legal patchwork is growing.** As of 2026, twenty US states have comprehensive privacy laws in effect, but there is still no federal privacy law. This means your rights vary depending on where you live — and companies often default to the least protective standard. The European GDPR remains the strongest baseline, but enforcement is uneven.

**AI is amplifying both sides.** AI-powered tools make it easier for adversaries to aggregate data, generate convincing phishing attacks, and identify individuals from partial data. But AI also powers better spam filters, threat detection, and privacy tools. The arms race is accelerating.

**Data broker regulation is beginning.** Several states now require data brokers to register and honor deletion requests. This is new, imperfect, and worth watching. The FTC has signaled increased interest in enforcement.

**Biometric data is the next frontier.** Face recognition, voice prints, gait analysis, and behavioral biometrics are being collected at increasing scale. Unlike a password, you cannot change your face. Threat models will increasingly need to account for biometric exposure.

**The aggregation problem is worsening.** Individual data points that seem harmless — a coffee shop check-in, a fitness app route, a purchase receipt — become revealing when combined. As data brokers merge datasets and AI improves pattern matching, the bar for "identifying information" keeps dropping.

---

## What Comes Next

You now have the three foundations of privacy literacy:

1. **How tracking works** — the technical mechanisms
2. **Who is doing it and why** — the actors and incentives
3. **How to think about your own risk** — your threat model

With this framework, every recommendation in the guides that follow becomes something you can evaluate for yourself. When a guide says "consider using a VPN," you can ask: *Does this address a threat I actually face? Is the tradeoff worth it for my situation?*

That is the power of a threat model. It replaces anxiety with agency.

The next guide in this series, [The 5-Minute Privacy Checkup](/guides/the-5-minute-privacy-checkup), walks you through immediate, high-impact steps that apply to nearly everyone — the quick wins that every threat model includes.

---

## Sources and Further Reading

- Electronic Frontier Foundation, "Security Planning (Threat Modeling)," Surveillance Self-Defense, updated 2025. [ssd.eff.org](https://ssd.eff.org)
- Privacy Guides, "Threat Modeling," 2024. [privacyguides.org/en/basics/threat-modeling](https://www.privacyguides.org/en/basics/threat-modeling/)
- Mavroudis, V. and Veale, M., "Eavesdropping Whilst You're Shopping: Balancing Personalisation and Privacy in Connected Retail Spaces," 2023.
- CMU CyLab, "UsersFirst: A User-Centric Privacy Threat Modeling Framework," USENIX PEPR, 2025.
- National Association of Attorneys General, "The Escalating Threats of Doxxing and Swatting," 2025.
- Gibson Dunn, "U.S. Cybersecurity and Data Privacy Review and Outlook — 2025," 2025.
- Solove, Daniel J., "'I've Got Nothing to Hide' and Other Misunderstandings of Privacy," San Diego Law Review, 2007.
