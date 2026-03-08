---
title: "The 5-Minute Privacy Checkup"
description: "Five minutes. Five changes. Measurably less tracking. This is the fastest way to meaningfully reduce your digital exposure — no new software required."
category: "foundations"
order: 4
tags: ["quick-start", "privacy-settings", "tracking", "ad-tracking", "phone-privacy", "browser-privacy"]
relatedTools: ["fingerprint-analyzer", "dns-leak"]
relatedGuides: ["how-youre-being-tracked", "what-is-a-threat-model"]
draft: false
---

# The 5-Minute Privacy Checkup

You have read about [how tracking works](/guides/how-youre-being-tracked). You have learned [who wants your data](/guides/who-wants-your-data). You have thought about [your own threat model](/tools/threat-profiler). Now it is time to do something.

This guide is designed to be completed in five minutes using only the settings already on your devices. No new software to install. No accounts to create. No technical expertise required. Just five changes that immediately reduce how much data companies collect about you.

Every step here addresses tracking that is happening to nearly everyone, right now, by default. These are the quick wins that belong in virtually every threat model.

Set a timer if you want. Let us begin.

---

## Minute 1: Kill Your Advertising ID

Every smartphone ships with a unique **advertising identifier** — a string of characters assigned to your device that advertising networks use to track your behavior across apps. It is the single most effective cross-app tracking mechanism on your phone, and it is turned on by default.

Deleting or resetting this ID does not break any app. It simply removes the easy, universal tracking key that ties your behavior together across every app on your device.

### On Android
1. Open **Settings**
2. Go to **Security & Privacy** → **Privacy Controls** → **Ads**
3. Tap **"Delete advertising ID"**
4. Confirm when prompted

On older Android versions, the path may be **Settings → Google → Ads → Delete advertising ID**.

### On iPhone
1. Open **Settings**
2. Go to **Privacy & Security** → **Tracking**
3. Turn off **"Allow Apps to Request to Track"**

This tells every app on your phone that you do not consent to cross-app tracking. Apps that ask will be automatically denied.

Also go to **Settings → Privacy & Security → Apple Advertising** and turn off **Personalized Ads**.

**What this does:** Removes the universal tracking key that lets ad networks follow you across apps. It does not stop tracking entirely — apps can still collect data internally — but it breaks the cross-app connection that data brokers rely on most heavily.

---

## Minute 2: Audit Location Permissions

Your phone's GPS can pinpoint you to within a few meters. Many apps request location access and then share that data with third-party analytics companies and data brokers — often without making this obvious.

A 2025 investigation found that a single free weather app was sharing precise location data with over forty external partners. The fix is simple: review which apps can access your location and revoke access from any that do not genuinely need it.

### On Android
1. Open **Settings** → **Location** → **App Permissions**
2. You will see apps grouped by access level: **Allowed all the time**, **Allowed only while in use**, **Ask every time**, and **Not allowed**
3. For each app in "Allowed all the time," ask: *Does this app need my location when I am not using it?* Maps and navigation — maybe. A flashlight app, a game, a note-taking app — no
4. Downgrade unnecessary apps to **"Only while using"** or **"Not allowed"**
5. For apps that remain, tap each one and toggle off **"Use precise location"** unless the app genuinely requires it (navigation does; weather does not)

### On iPhone
1. Open **Settings** → **Privacy & Security** → **Location Services**
2. Tap each app and choose **Never**, **Ask Next Time**, or **While Using the App**
3. For apps that remain, toggle off **Precise Location** where possible

**The rule of thumb:** If an app's core function does not depend on knowing where you are, it should not have location access. Period.

**What this does:** Stops apps from continuously logging and sharing your physical movements. Location data is among the most sensitive and valuable data types — it reveals where you live, work, worship, seek medical care, and who you spend time with.

---

## Minute 3: Tighten Your Browser

Your web browser is the primary window through which tracking companies observe you. A few settings changes significantly reduce what they can see.

### If you use Chrome
Chrome is built by an advertising company. Its defaults favor data collection. These changes help:

1. Open Chrome → tap **⋮** (menu) → **Settings** → **Privacy and Security**
2. Turn on **"Send a 'Do Not Track' request"** (this is largely symbolic — most sites ignore it — but costs nothing)
3. Under **Third-party cookies**, select **"Block third-party cookies"**
4. Under **Ad Privacy**, turn off **Ad Topics**, **Site-suggested ads**, and **Ad measurement**
5. Under **Security**, ensure **"Always use secure connections" (HTTPS-Only Mode)** is enabled

### If you use Safari (iPhone/Mac)
1. Open **Settings** → **Apps** → **Safari** (or Safari → Preferences on Mac)
2. Ensure **"Prevent Cross-Site Tracking"** is on (it should be by default)
3. Ensure **"Hide IP Address"** is set to **"From Trackers"** (or "From Trackers and Websites")
4. Turn off **"Privacy Preserving Ad Measurement"** (this still shares data with advertisers, just less of it)

### If you use Firefox
1. Open Settings → **Privacy & Security**
2. Set **Enhanced Tracking Protection** to **Strict**
3. Enable **HTTPS-Only Mode** in all windows

**A note on browser choice:** These settings improve your current browser. If you want *significantly* better privacy, switching browsers entirely is the most impactful single change. But that is a bigger decision covered in [Choosing a Browser for Privacy](/guides) (coming soon). For now, these settings reduce tracking within whatever browser you already use.

**What this does:** Blocks or limits the most common cross-site tracking mechanisms that advertising networks use to follow you from website to website.

---

## Minute 4: Lock Down Your Google or Apple Account

Both Google and Apple provide privacy dashboards that let you control what they collect. Most people have never visited them.

### Google Account (if you use Android or any Google service)
1. Visit [myaccount.google.com/privacycheckup](https://myaccount.google.com/privacycheckup) on any browser (or go to **Settings → Google → Manage your Google Account → Data & privacy**)
2. **Web & App Activity**: Consider pausing this, or at minimum turn off **"Include Chrome history and activity from sites, apps, and devices that use Google services"** and turn off **"Include voice and audio activity"**
3. **Location History (Timeline)**: Turn this off unless you actively use Google Timeline. If you do, set auto-delete to **3 months**
4. **YouTube History**: Consider pausing, or set auto-delete to **3 months**
5. **Ad Personalization**: Turn this off entirely

### Apple Account (if you use iPhone/Mac)
1. Open **Settings** → tap your name at the top → **Privacy & Security**
2. Review **Analytics & Improvements** — turn off **Share iPhone Analytics**, **Improve Siri & Dictation**, and **Share with App Developers**
3. Go to **Settings → Privacy & Security → Apple Advertising** → turn off **Personalized Ads**

**What this does:** Reduces the amount of behavioral data that Google or Apple collects, stores, and uses to build a profile of your interests, movements, and habits. Google in particular stores an extraordinarily detailed activity log by default.

---

## Minute 5: Check Your Social Media Exposure

Social media platforms default to maximum visibility. A quick pass through your settings reduces how much of your information is public.

### Facebook/Meta
1. Go to **Menu → Settings & Privacy → Privacy Checkup**
2. Walk through each section. Pay particular attention to:
   - **Who can see your future posts** — change from "Public" to "Friends"
   - **Who can look you up using your email/phone number** — set to "Only me" or "Friends"
   - **Do you want search engines outside Facebook to link to your profile?** — turn off
3. Under **Settings → Privacy → Off-Facebook Activity**, tap **"Clear Previous Activity"** and turn off **"Future Off-Facebook Activity"** for all apps

### Instagram
1. Go to **Settings → Account Privacy** → turn on **Private Account** (if appropriate for your use)
2. Go to **Settings → Ad Preferences** and review/limit ad topics

### Any platform
- If you have not used a social media account in over a year, consider deleting it rather than leaving a dormant profile with your data
- Check what third-party apps have access to your social accounts (Settings → Apps and Websites on most platforms) and remove any you do not actively use

**What this does:** Reduces the surface area of personal information that is publicly accessible, searchable by strangers, and usable by data brokers who scrape social media profiles.

---

## What You Just Accomplished

In five minutes, you have:

- ✅ **Removed the advertising ID** that let ad networks track you across every app on your phone
- ✅ **Cut off location access** from apps that had no business knowing where you are
- ✅ **Blocked cross-site tracking** in your browser, breaking the most common web surveillance mechanism
- ✅ **Reduced data collection** by Google or Apple at the account level
- ✅ **Locked down social media** so your information is less exposed to strangers and scrapers

None of these steps cost money. None of them broke anything. None of them required technical expertise. And collectively, they meaningfully reduce the volume of data being collected about you every day.

---

## Verify Your Changes

Want to see what trackers can still see? Use our tools to check:

- **[Browser Fingerprint Analyzer](/tools) (coming soon)** — See how identifiable your browser is after your changes
- **[DNS Leak Test](/tools) (coming soon)** — Check if your DNS queries are being exposed
- **[WebRTC Leak Detector](/tools) (coming soon)** — Check if your real IP is leaking through your browser

These tools run entirely in your browser — no data leaves your device.

---

## What Comes Next

This checkup addressed the lowest-hanging fruit. If you want to go further, the natural next steps are:

| If you want to... | Read this next |
|---|---|
| Choose a more private browser | [Choosing a Browser for Privacy](/guides) (coming soon) |
| Understand what a VPN does (and does not do) | [VPNs: What They Actually Protect](/guides) (coming soon) |
| Switch to encrypted messaging | [Encrypted Messaging: Your Options](/guides) (coming soon) |
| Understand your browser\'s fingerprint | [Browser Fingerprinting Explained](/guides/browser-fingerprinting-explained) |
| Remove yourself from data broker sites | [Data Broker Opt-Out Guide](/guides) (coming soon) |

Remember: privacy is not a single action but an ongoing practice. Set a calendar reminder to repeat this checkup in 90 days. Settings reset, apps update defaults, and new permissions creep in. A quarterly review takes five minutes and keeps your baseline intact.

---

## Sources

- Electronic Frontier Foundation, "How to: Get to Know Android Privacy and Security Settings," Surveillance Self-Defense, 2025.
- Apple, "iPhone Privacy & Security Settings," support.apple.com, 2025.
- Google, "Privacy Checkup," myaccount.google.com, 2025.
- Wired, "The Best iPhone Privacy and Security Settings to Change," 2025.
- Fox News / CyberGuy, "11 Easy Ways to Protect Your Online Privacy in 2025," 2025.
