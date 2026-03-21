---
title: 'Social Media Privacy Settings: Platform-by-Platform Guide'
description: Every social media platform defaults to maximum exposure. Here is exactly what to change on Facebook, Instagram, TikTok, X, and LinkedIn — step by step.
category: essentials
order: 5
publishedDate: '2026-03-17'
updatedDate: '2026-03-20'
tags:
- social-media
- facebook
- instagram
- tiktok
- twitter
- linkedin
- privacy-settings
- meta
relatedTools:
- fingerprint-analyzer
- metadata-stripper
relatedGuides:
- the-5-minute-privacy-checkup
- data-broker-opt-out
- how-youre-being-tracked
- how-to-delete-your-digital-footprint
tldr:
- Every social media platform defaults to maximum data exposure — you must manually restrict settings
- Facebook collects the most data — restrict off-Facebook activity tracking and ad personalization
- Disable location tagging, facial recognition, and contact syncing on all platforms
- Consider whether you need each platform at all — the most private setting is not having an account
faq:
- question: Which social media platform is worst for privacy?
  answer: Facebook (Meta) collects the most data. It tracks you across the web via the Facebook Pixel embedded on millions of websites, builds detailed advertising profiles, uses facial recognition, and
    shares data across Instagram, WhatsApp, and Messenger.
- question: Can I use social media privately?
  answer: You can reduce exposure significantly by hardening privacy settings, but you cannot eliminate tracking while using these platforms. They are designed to collect data. The most private approach
    is limiting what you share, using pseudonyms where possible, and restricting off-platform tracking in settings.
- question: Should I delete my social media accounts?
  answer: That depends on your threat model. If social media provides genuine value (professional networking, community, family contact), hardening your settings is a reasonable compromise. If you rarely
    use a platform, deleting the account removes a data collection vector. Consider downloading your data archive first.
draft: false
---

# Social Media Privacy Settings: Platform-by-Platform Guide

Social media platforms make money from your data. Their default settings are designed for maximum data collection and maximum visibility — not for your privacy. Every platform buries its privacy controls in nested menus, uses confusing language, and adds new tracking features faster than most users can keep up.

The [5-Minute Privacy Checkup](/guides/the-5-minute-privacy-checkup) covered the quick wins. This guide goes platform by platform through every setting that matters, with the exact navigation path for each one.

Time required: about 10 minutes per platform. Impact: significant — social media profiles are a primary source for data brokers, background checkers, and anyone searching your name.

---

## Facebook / Meta

Facebook collects more data about its users than any other social platform. It tracks you across the web via the Facebook Pixel (embedded on millions of websites), builds detailed advertising profiles, and shares data across its family of apps (Instagram, WhatsApp, Messenger, Threads).

### Essential Settings

**Who can see your posts:**
Settings → Privacy → Your Activity → Who can see your future posts → **Friends** (not Public)

**Who can look you up by email/phone:**
Settings → Privacy → How people find and contact you → Who can look you up using your email/phone → **Only me** or **Friends**

**Search engine visibility:**
Settings → Privacy → How people find and contact you → Do you want search engines outside Facebook to link to your profile? → **Turn off**

**Off-Facebook Activity (CRITICAL):**
Settings → Your information → Off-Facebook activity → **Clear previous activity** → **Manage future activity → Turn off**

This is Meta\'s system for tracking you across non-Facebook websites and apps. Hundreds of businesses send your activity data to Facebook. Turning this off significantly reduces cross-site tracking.

**Ad Preferences:**
Settings → Ad preferences → Ad settings:
- Data about your activity from partners → **Not allowed**
- Ads shown off of Meta → **Not allowed**
- Social interactions → **Only me**
- Categories used to reach you → Review and remove sensitive categories

**Face Recognition:**
Settings → Privacy → Face recognition → **Turn off** (if this option still appears)

**Location History:**
Settings → Location → Location History → **Turn off**
Settings → Location → Background location → **Turn off** for Facebook

**Two-Factor Authentication:**
Settings → Accounts Center → Password and security → Two-factor authentication → Enable with **authenticator app** (not SMS)

### The Nuclear Option

If you do not actively use Facebook but keep it for Marketplace or event invitations:
- Set all posts to Friends only
- Clear Off-Facebook Activity
- Remove your phone number
- Remove your birthday (or set it to only visible to you)
- Delete old posts in bulk (Settings → Your Activity → Manage activity → Filter by date → Delete)

---

## Instagram

Instagram is owned by Meta and shares its advertising infrastructure. Your Instagram activity feeds Meta\'s advertising profile.

### Essential Settings

**Private Account:**
Settings → Account Privacy → **Turn on Private Account**

This is the single most impactful change on Instagram. When your account is private, only approved followers can see your posts, stories, and reels. Your content is not indexed by search engines or data scrapers.

**Activity Status:**
Settings → Privacy → Activity Status → **Turn off**
(Prevents others from seeing when you were last active)

**Story Sharing:**
Settings → Privacy → Story → Allow sharing → **Turn off**

**Mentions:**
Settings → Privacy → Mentions → Allow mentions from → **People you follow** or **No one**

**Comments:**
Settings → Privacy → Comments → Allow comments from → **People you follow**

**Ad Preferences:**
Settings → Accounts Center → Ad preferences (same as Facebook — shared across Meta)

**Third-Party Apps:**
Settings → Security → Apps and websites → Remove any apps you do not actively use

**Photo Map / Location:**
- Remove location tags from existing photos (edit each post or use bulk tools)
- When posting, never add a location to real-time content. If you must tag a location, post after you have left.

---

## TikTok

TikTok collects extensive data including device identifiers, location, keystroke patterns, clipboard content, and browsing activity. The app\'s connection to ByteDance (a Chinese company) adds geopolitical concerns to the standard privacy issues.

### Essential Settings

**Private Account:**
Profile → ☰ → Settings and privacy → Privacy → **Turn on Private account**

**Personalized Ads:**
Settings → Privacy → Ads → **Turn off Personalized Ads**

**Data Downloads:**
Settings → Privacy → Download your data → **Request your data** (review what TikTok has collected about you)

**Activity Status:**
Settings → Privacy → Activity status → **Turn off**

**Who Can Find You:**
Settings → Privacy → Suggest your account to others:
- Contacts → **Off**
- Facebook friends → **Off**
- People who open or send links to you → **Off**

**Direct Messages:**
Settings → Privacy → Direct Messages → Who can send you direct messages → **No one** or **Friends**

**Comments:**
Settings → Privacy → Comments → Who can comment on your videos → **Friends** or **No one**

**Downloads:**
Settings → Privacy → Downloads → Allow downloads of your videos → **Off**

### The Honest Assessment

TikTok\'s data collection is extensive and the app has root-level access to your device. Privacy settings help but cannot fully mitigate the amount of data the app collects at the system level. If your [threat model](/guides/what-is-a-threat-model) includes concern about Chinese government access to your data, the most effective measure is not using TikTok — or using it only in a browser (tiktok.com) rather than the app.

---

## X (formerly Twitter)

Under current ownership, X has relaxed many privacy protections and expanded data collection for AI training (Grok).

### Essential Settings

**Protect Your Posts:**
Settings → Privacy and safety → Audience, media, and tagging → **Protect your posts**
(Only approved followers can see your posts. Retweets are disabled.)

**Discoverability:**
Settings → Privacy and safety → Discoverability and contacts:
- Let others find you by email → **Off**
- Let others find you by phone → **Off**

**Data Sharing and Personalization:**
Settings → Privacy and safety → Data sharing and personalization:
- Allow additional information sharing with business partners → **Off**
- Allow use of where you see X content across the web → **Off**
- Personalize based on your inferred identity → **Off**
- Share your data with X\'s business partners → **Off**

**Grok / AI Training:**
Settings → Privacy and safety → Grok → **Turn off "Allow your posts to be used for Grok training"**

This is new and defaults to ON. Your posts, conversations, inputs, and interactions may be used to train X\'s AI model unless you explicitly opt out.

**Location:**
Settings → Privacy and safety → Location information:
- Precise location → **Off**
- Location on posts → **Off**

**Two-Factor Authentication:**
Settings → Security and account access → Security → Two-factor authentication → Enable with **Authenticator app**
(Note: X removed free SMS-based 2FA in 2023, restricting it to paid Blue/Premium subscribers.)

---

## LinkedIn

LinkedIn is a professional network, which means its privacy implications are different — your profile is often intentionally public for career purposes. But LinkedIn collects significantly more data than most users realize.

### Essential Settings

**Profile Visibility:**
Settings → Visibility → Profile viewing options:
- Choose how others see your LinkedIn activity → **Private mode** (prevents others from seeing that you viewed their profile, but also prevents you from seeing who viewed yours)

**Off-LinkedIn Data:**
Settings → Data privacy → How LinkedIn uses your data:
- Use data for research → **Off**
- Share data with third parties → **Off**
- Social, economic, and workplace research → **Off**

**Generative AI:**
Settings → Data privacy → Data for Generative AI Improvement → **Turn off**
(Prevents LinkedIn from using your data to train AI models)

**Advertising Data:**
Settings → Advertising data:
- Connections → **Off**
- Location → **Off**
- Demographics → **Off**
- Companies you follow → **Off**
- Education → Review and limit
- Job information → Review and limit

**Email Preferences:**
Settings → Communications → Email → Turn off everything except essential account security emails

---

## Universal Principles (All Platforms)

Regardless of which platforms you use:

1. **Audit third-party app connections quarterly.** Every platform has an "Apps and websites" or "Connected apps" section. Remove anything you do not actively use.

2. **Never use "Sign in with Facebook/Google."** Each social login creates a data connection between that platform and the service you are signing into. Use email + password instead.

3. **Remove your phone number** from social profiles where possible. Phone numbers are a persistent identifier used for account matching by data brokers.

4. **Set post visibility retroactively.** Facebook: Use "Limit past posts" to bulk-change all previous public posts to Friends only. Other platforms: review and clean up old public posts.

5. **Disable location services** for social media apps entirely. No social media app needs your location to function.

6. **Review tagged photos and mentions.** Other people\'s posts about you can expose your location, activities, and associations even if your own settings are locked down.

7. **Consider the delete vs. deactivate question.** If you no longer use a platform, deleting your account removes your data (eventually). Deactivation preserves it indefinitely.

---

## 🔮 What Is Changing

**AI training opt-outs are becoming critical.** Meta, X, and LinkedIn have all begun using user content to train AI models, with default opt-in. Expect more platforms to follow. Check AI/generative AI settings on every platform annually.

**The EU Digital Services Act** is forcing platforms to offer clearer privacy controls for European users. Some of these improvements are rolling out globally.

**Platform-level encryption** is expanding. Instagram and Messenger now offer end-to-end encrypted messaging by default. But this does not affect the metadata or account-level tracking described above.

---

## Key Takeaways

1. **Every platform defaults to maximum exposure.** You must actively opt out.
2. **Off-Facebook Activity** is the single most impactful setting on Meta platforms — turn it off.
3. **Private accounts** on Instagram and TikTok dramatically reduce your exposure.
4. **AI training opt-outs** are new and default to ON — check settings on every platform.
5. **Quarterly audits** of connected apps, privacy settings, and post visibility keep your settings from drifting.
6. **No setting fully mitigates** the data collected at the platform level. The most private social media is less social media.

---

## Sources

- Tom\'s Guide, "5 Steps to Safer Social Media in 2026," 2026.
- SocialRails, "Social Media Privacy Settings Guide 2026," 2026.
- NCSC (UK), "Social Media: How to Use It Safely," 2025.
- GhostMyData, "Complete Guide to Social Media Privacy in 2026," 2026.
- DHS Federal Protective Service, "Social Media Privacy Settings," 2025.
- Meta, "Off-Facebook Activity," facebook.com, 2025.
- X (Twitter), "Data Sharing and Personalization Settings," 2025.
- LinkedIn, "Data Privacy Settings," linkedin.com, 2025.
