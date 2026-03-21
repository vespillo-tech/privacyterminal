---
title: Who Wants Your Data and Why
description: Advertisers, data brokers, governments, hackers, and your own apps — understand who collects your data, what they do with it, and why it matters.
category: foundations
order: 2
publishedDate: '2026-03-17'
updatedDate: '2026-03-20'
tags:
- data-brokers
- surveillance
- advertising
- privacy-rights
- data-economy
relatedTools:
- fingerprint-analyzer
- threat-profiler
relatedGuides:
- how-youre-being-tracked
- what-is-a-threat-model
- data-broker-opt-out
difficulty: 1
tldr:
- Ad networks, data brokers, governments, and hackers all want your data for different reasons
- Your data is bought and sold on a massive market you never consented to
- Understanding who wants your data helps you decide what to protect
faq:
- question: Who are data brokers and how do they get my data?
  answer: Data brokers are companies like Spokeo, Whitepages, and Acxiom that collect personal information from public records, social media, purchase history, and app data. They compile detailed profiles
    and sell them to advertisers, employers, landlords, and anyone willing to pay.
- question: Is my data really worth money?
  answer: Yes. Individual data records sell for fractions of a cent, but a complete profile with demographics, interests, purchase history, and location data can be worth $0.50 to $2.00. The global data
    broker market is worth over $250 billion annually.
- question: Can the government access my online data?
  answer: Yes. Governments can access your data through legal processes (subpoenas, warrants), bulk surveillance programs, or by purchasing it from data brokers — which requires no warrant. The legal threshold
    varies by country and data type.
draft: false
---

# Who Wants Your Data and Why

Your personal data is the raw material of one of the largest industries on earth. The global data broker market was valued at approximately $268 billion in 2023, and analysts project it will exceed $450 billion before the end of this decade. The market exists because your data — where you go, what you buy, who you know, what you read, what you fear, what you want — is genuinely valuable to a remarkable variety of people and organizations.

Most people have a vague sense that "companies track you to show you ads." That is true, but it is a narrow slice of a much larger picture. This guide maps the complete landscape of who collects your data, what they actually collect, what they do with it, and what the real-world consequences look like.

Understanding the full cast of actors in the data economy is not an exercise in paranoia. It is the foundation of making informed decisions about your own privacy.

---

## The Concept of Data Exhaust

Before examining specific actors, it helps to understand the nature of the data itself.

In the industrial age, factories produced goods as primary output and pollution as a byproduct. The pollution was not valuable — it was waste.

In the digital age, the equivalent of industrial exhaust is **data exhaust**: the trail of information you generate passively, simply by existing in digitally-connected environments. You are not *trying* to produce data. But every app you open, every route you drive (captured by your phone's GPS), every item you linger over while shopping online, every payment you make with a card, every time your phone connects to a cell tower — all of it generates a continuous stream of data about you.

This data exhaust was originally considered a byproduct. Over the past two decades, it has become the primary product. The app is often the exhaust collector. The service you use for free is the mechanism for capturing it. As the aphorism goes: if you are not paying for the product, you are the product. More precisely: the data exhaust you generate *is* the product.

The critical thing to understand about data exhaust is its **passive nature**. You do not have to do anything unusual or careless to generate it. Driving to a medical appointment, attending a religious service, visiting a political rally, spending the night somewhere unexpected — all of these generate location data that is collected, sold, and retained with no expiration date and no mechanism for you to recall it.

---

## Advertisers and Ad Networks

**What they collect**: Browsing history, purchase intent signals, demographic inferences, location data, device identifiers, behavioral patterns, inferred interests, political leanings, health concerns, and financial status signals.

**How they collect it**: Through the vast network of tracking pixels, third-party cookies, and fingerprinting scripts embedded on websites across the internet. The ad-tech ecosystem operates as a real-time marketplace. When you load a webpage, an auction for your attention runs in milliseconds: your profile is broadcast to hundreds of potential advertisers, bids are submitted, and the winning ad is served — all before the page finishes loading. This is called **programmatic advertising** and **real-time bidding (RTB)**.

**What they do with it**: Target advertisements with extraordinary precision. An advertiser can purchase audience segments like: women aged 25–34 within 10 miles of a specific zip code, who have searched for fertility treatments in the past 30 days, have a household income above $75,000, and visited competitor websites this week. Each additional data attribute enables more precise targeting and commands higher prices.

**The scale**: Google's advertising revenue exceeded $230 billion in 2023. Meta's exceeded $131 billion. These are not technology companies that happen to run ads — they are advertising companies whose technology products are optimized to maximize data collection and targeting capability.

**The RTB privacy problem**: The real-time bidding process itself constitutes a continuous, structural privacy breach. When your profile is broadcast to hundreds of potential advertisers during an ad auction, each of those parties receives your data — including the losing bidders who never serve you an ad. The Irish Council for Civil Liberties has documented this as the largest data breach in history, happening continuously, through the ordinary operation of the online advertising system. There is no consent mechanism. There is no audit trail. Your profile leaves dozens of servers you have never heard of every time you load a webpage.

---

## Data Brokers

Data brokers are companies whose primary business is collecting, aggregating, and reselling personal information. They operate largely outside public awareness, have no direct relationship with most of the people in their databases, and face minimal regulatory scrutiny in most jurisdictions.

**What they collect**: Everything available from every source: public records (birth certificates, voter registrations, property records, court filings, bankruptcy records, marriage and divorce records), commercial sources (purchase histories from retailers, catalog subscriptions, credit applications), online tracking data (purchased from app developers, ad networks, and ISPs), social media profiles, location data purchased from mobile data brokers, and data traded with peer brokers. The resulting profiles include thousands of attributes per individual.

**The major players**:

**Acxiom** (now part of LiveRamp) maintains profiles on approximately 2.5 billion people globally, with more than 10,000 data attributes per consumer. Their products include purchase behavior histories, life event predictions (who is likely to have a baby, get married, retire), political affiliation inferences, health interest segments, and net worth estimates. Their clients include financial institutions, insurance companies, healthcare organizations, retailers, and political campaigns. Most people whose data Acxiom holds have never heard of the company.

**Oracle Data Cloud** absorbed BlueKai, Datalogix, and AddThis to build one of the largest data marketplaces in the world. Their database covers over 700 million people globally, combining purchase-based targeting, online behavioral data, and the tracking network inherited from AddThis — a social sharing widget that appeared on millions of websites and reported every page view back to Oracle. In 2022, a breach exposed Oracle's BlueKai tracking data, revealing the extraordinary granularity of the profiles maintained on ordinary people.

**LexisNexis Risk Solutions** draws primarily from public records, court documents, property filings, and financial records, maintaining tens of billions of records. Unlike advertising-focused brokers, LexisNexis serves a significant government and law enforcement market. Their Accurint product is used by police departments, federal agencies, and immigration enforcement to locate individuals, establish associations, and build surveillance profiles — without a warrant, using data acquired commercially.

**Experian, Equifax, and TransUnion** — the credit bureaus — are also data brokers. They hold extraordinarily sensitive financial histories and sell pre-screened marketing lists to financial institutions: lists of people who meet certain credit criteria assembled without those people's direct knowledge or consent. The 2017 Equifax breach, which exposed the Social Security numbers, birth dates, and addresses of 147 million Americans, demonstrated that concentrating this data creates catastrophic systemic risk.

**Consumer-facing brokers**: Spokeo, BeenVerified, Whitepages, Intelius, and dozens of similar services sell individual dossiers directly to anyone willing to pay a few dollars: current and former addresses, phone numbers, email addresses, family relationships, estimated income, and more. These services aggregate data that originated in public records, social media, and other brokers, making it instantly accessible to anyone — including stalkers, abusers, and scammers.

**What regulators say**: The FTC's 2014 report on data brokers found that the industry operates with almost no transparency or consumer control. Most brokers have no mechanism for individuals to correct inaccurate data, and virtually none allow people to opt out of collection entirely. The 2022 FTC commercial surveillance rulemaking proceeding received public comments documenting systematic harms: women fleeing domestic violence re-located through people-search sites, discrimination enabled by proxy variables, and minors' data sold despite nominal protections.

---

## Social Media Companies

**What they collect**: Everything you post, like, share, comment on, or react to. Every person you connect with and how often you interact with them. The content of messages (on most platforms). How long you linger on each piece of content. Your location, your devices, your contacts (when permission is granted). Behavioral patterns across billions of daily sessions, trained into models sophisticated enough to infer attributes you never directly disclosed — political views, pregnancy status, mental health, sexual orientation.

**How they collect it**: Through their own platforms, through the Facebook Pixel (a tracking script present on millions of third-party websites), through mobile SDKs embedded in other apps, and through data purchases and partnerships.

**Cambridge Analytica**: In 2018, reporting by The Guardian and The New York Times revealed that political consultancy Cambridge Analytica had obtained Facebook data on approximately 87 million people through a personality quiz app. The app legitimately collected data from users who consented, then exploited a then-permitted API feature to also harvest data from all of those users' friends — who had consented to nothing. The data was used to build psychographic profiles: personality models based on Facebook activity, used to micro-target political messages during the 2016 US presidential election and the Brexit referendum. Facebook paid a $5 billion FTC settlement — the largest ever imposed on a technology company at the time. The episode established that social platforms cannot reliably control how third parties use their data once API access is granted, and that data collected for one purpose will be repurposed in ways users cannot anticipate.

**The engagement optimization problem**: Internal Facebook research disclosed by whistleblower Frances Haugen in 2021 showed that the platform's recommendation algorithms amplified divisive, anger-inducing content because it generated higher engagement metrics. The data collected was not just used to serve ads — it was used to understand and exploit psychological vulnerabilities to maximize time-on-platform. The data collection, the profiling, and the recommendation systems form a closed loop designed to capture attention at any cost.

---

## Governments and State Surveillance

Government surveillance operates on fundamentally different footing than commercial surveillance: it is backed by legal authority, intelligence resources, classified capabilities, and in some cases, coercive power.

**What they collect**: Communications metadata (who contacted whom, when, for how long, from where), message content (under warrant, or under bulk collection programs), location data, financial transaction records, travel history, biometric data, social media activity — and increasingly, all of the above purchased from commercial data brokers, bypassing warrant requirements entirely.

**The Snowden disclosures**: In 2013, NSA contractor Edward Snowden disclosed documents revealing the extraordinary scope of US and allied intelligence collection programs. PRISM provided the NSA with access to data stored by nine major US internet companies — including Google, Facebook, Apple, and Microsoft — under legal orders the companies could not disclose. XKeyscore allowed analysts to search through vast collections of internet communications and metadata. The MUSCULAR program secretly tapped the fiber optic cables connecting Google's and Yahoo's data centers — collecting data not covered by the companies' cooperation with PRISM. The Five Eyes alliance (US, UK, Canada, Australia, New Zealand) divided global surveillance responsibilities and shared intelligence to route around domestic legal restrictions on spying on citizens.

**The NSO Group and commercial spyware**: Pegasus, developed by Israeli firm NSO Group, represents surveillance capability formerly exclusive to major intelligence agencies, sold as a commercial product to government clients. Pegasus exploits zero-day vulnerabilities — previously unknown security flaws — to silently compromise smartphones with no action required from the target. Once installed, it accesses messages (including encrypted apps like Signal and WhatsApp), calls, camera, microphone, and location data continuously. Forensic investigations by Amnesty International's Security Lab and the University of Toronto's Citizen Lab identified Pegasus on the phones of journalists, human rights attorneys, opposition politicians, and heads of state across dozens of countries — demonstrating that surveillance tools sold for "lawful intercept" purposes are routinely turned against civil society. NSO Group is not unique: dozens of firms sell similar capabilities to governments globally.

**Commercial data as a surveillance workaround**: US law enforcement and intelligence agencies have increasingly purchased commercial data rather than seeking warrants. Location data, social media data, and financial data purchased from brokers has been used by the FBI, DHS, and military intelligence — legally, under current interpretations, because the data was "voluntarily" shared with commercial companies. Senator Ron Wyden's 2021 investigation found that multiple federal agencies had purchased location data from commercial brokers, circumventing the constitutional protections that would apply to direct collection.

---

## Internet Service Providers

Your ISP occupies a uniquely privileged position: it sees every connection you make. Even when websites use HTTPS (which encrypts content), your ISP observes the destination — every domain you visit, the timing and volume of your connections, and all unencrypted DNS queries.

**What they collect**: IP address logs, DNS query history (every domain name you resolve), connection timing, data volumes by destination, and under some legal regimes, full content under lawful intercept obligations.

**What they do with it**: In the United States, a 2017 Congressional vote — passed along party lines — nullified FCC rules that would have required ISPs to obtain opt-in consent before selling customer browsing data to third parties. This opened the door for ISPs to monetize the surveillance position their infrastructure gives them. Verizon's "supercookie" (a Unique Identifier Header, or UIDH) inserted a persistent tracking identifier into every HTTP request made by Verizon mobile customers — invisible to users, impossible to remove by clearing browser cookies, and shared with any website that wanted to use it for tracking. Verizon received an FCC fine of $1.35 million for operating this system for years without customer notification or opt-out. AT&T's "Internet Preferences" program in 2015 charged customers $29–$44 per month extra if they wanted to opt out of having their browsing data analyzed for advertising.

---

## App Developers and the Mobile Data Economy

The free app economy is substantially funded by data collection and sale. A 2021 study by Oxford researchers found that more than 88% of Android apps could share data with Alphabet, and 43% could share data with Facebook — regardless of whether those apps had any connection to either company. The mechanism is advertising SDKs: libraries of code that app developers embed to monetize through ads, and which collect data on behalf of the SDK provider.

**The location data ecosystem**: A single location data broker — X-Mode (rebranded as Outlogic), Foursquare, SafeGraph, or Veraset — may receive location pings from hundreds of thousands of apps simultaneously. These pings arrive continuously as long as apps run in the background. The aggregated result is a mobility profile: a complete record of where you went, when, for how long, and in what sequence. This data has been sold to military contractors (a Vice investigation documented X-Mode selling to US Army and Navy contractors), immigration enforcement, hedge funds performing foot traffic analysis, and retail competitors analyzing store visits.

**Clearview AI**: Founded around 2017, Clearview AI scraped more than 30 billion facial images from social media platforms, news sites, and the open web — without the consent of any of the photographed individuals — and built a facial recognition database. They sold search access to law enforcement agencies globally, enabling officers to photograph an unknown person and identify them by matching against the database. Courts in Canada, Australia, the UK, France, Italy, and other countries found Clearview's practices violated privacy laws and ordered data deletion. In the United States, a settlement with the ACLU prevented Clearview from selling to most private entities but left law enforcement use intact. The case established that any photo you post publicly becomes potential material for a biometric surveillance system you have no control over.

---

## Employers

**What they collect**: Email and internal messaging content (nearly all enterprise email and Slack/Teams content is accessible to employers), productivity metrics (keystrokes, mouse movement, application time, screenshots), web browsing on work devices and networks, location during work hours (through device management software), and data from workplace wellness programs.

**Employee monitoring software** — sometimes called "bossware" — expanded dramatically during the 2020–2022 remote work period. Products like Teramind, InterGuard, ActivTrak, and Hubstaff can capture screenshots every few minutes, log every keystroke, flag time on non-approved sites, record video through webcams, and generate productivity scores. This surveillance is largely lawful in most US states with minimal disclosure requirements. Workers who need the job have limited ability to refuse. A 2022 study by the Electronic Frontier Foundation found significant evidence that workplace monitoring data is used in termination decisions, disciplinary actions, and management assessments — without the transparency or appeal mechanisms that equivalent criminal surveillance would require.

---

## Hackers and Criminal Actors

**What they collect**: Whatever they can obtain through data breaches, phishing attacks, credential stuffing (using breached password lists against other services), malware, or purchase on dark web markets where breached databases are sold in bulk.

**The breach economy at scale**: The 2017 Equifax breach exposed Social Security numbers, birth dates, and addresses of 147 million Americans. The 2019 Capital One breach exposed 100 million credit applications. The 2021 Facebook breach exposed phone numbers and account details of 533 million users — this data was posted freely online. The 2024 National Public Data breach allegedly exposed the compiled personal records of nearly 3 billion people, assembled through data broker aggregation, including Social Security numbers. A stolen full identity package (name, address, SSN, date of birth, credit history) sells on dark markets for $10–30. Medical records command $10–50 each — more than financial records — because they enable insurance fraud and prescription fraud that is slower to detect. Stolen credit card numbers sell for $1–10 each, in bulk.

**What criminals do with it**: Identity theft, financial fraud, account takeover, synthetic identity fraud (creating new fraudulent identities from components of real ones), extortion (ransomware against individuals and organizations), corporate espionage, and resale into the broader data economy — including, in some documented cases, eventual purchase by legitimate data brokers or advertising platforms that do not audit data provenance.

---

## Insurance Companies

**What they collect**: Traditional underwriting data (credit scores, claims history, medical records through the Medical Information Bureau), and increasingly non-traditional data purchased from brokers: driving behavior via telematics, social media posts, consumer purchasing patterns, health metrics from wearables.

**What they do with it**: Price discrimination at increasing granularity. Progressive's Snapshot program, State Farm's Drive Safe & Save, and similar telematics programs instrument your driving in real time — speed, braking force, time of day, mileage — in exchange for potential premium discounts. Travelers Insurance made headlines for reportedly considering social media post analysis as an underwriting input. A 2020 Texas Tribune/ProPublica investigation documented how US property insurers used credit scores as underwriting variables, resulting in lower-income and minority neighborhoods paying systematically higher premiums for identical properties — a proxy discrimination effect from data use that no individual algorithm designer explicitly intended.

---

## Why "I Have Nothing to Hide" Misses the Point

When confronted with the scope of surveillance described in this guide, a common response is: *"I have nothing to hide, so I have nothing to fear."* This reasoning deserves careful examination, because it contains several compounding errors.

**It assumes your assessment of harm is complete and final**. Data that seems harmless today may not be harmless in a future you cannot predict. Health data collected now might affect insurability under different regulations. Political associations recorded today might be prosecuted under a different government. Location data from years ago might be subpoenaed in a lawsuit you cannot anticipate. You are not making a decision about the present — you are making a decision about data with an indefinite shelf life.

**It assumes you are the judge of what harms you**. Many consequential decisions are made using your data without your knowledge. A loan application rejected because of a score derived from your browsing history. A job offer not extended because of data broker inferences. An insurance premium set based on your ZIP code's mobility patterns. You never see these decisions. You cannot contest them. You may not even know they happened.

**It creates a chilling effect even for the innocent**. Mass surveillance changes behavior regardless of guilt. A 2016 study by Elizabeth Stoycheff found that Wikipedia traffic to terrorism-related topics dropped measurably after the Snowden revelations — not because those readers were terrorists, but because the awareness of surveillance made them self-censor their research. When people know they are watched, they avoid associations, searches, and expressions that might look suspicious — even when those activities are entirely lawful. A society where people modify their behavior based on surveillance is not a free society, regardless of whether anyone is ever prosecuted.

**It trusts the watcher permanently**. Privacy scholar Daniel Solove's foundational critique of the nothing-to-hide argument is that it implicitly grants unlimited, permanent trust to whoever holds the data — a trust that may be warranted today but cannot be guaranteed indefinitely. Data collected by a legitimate business can be breached by criminals, subpoenaed by hostile governments, acquired by adversarial owners in a corporate sale, or used in ways not yet invented. You cannot consent to uses that do not yet exist.

**It mistakes privacy for secrecy**. Solove argues that privacy is not primarily about hiding wrongdoing — it is about power, autonomy, and the ability to control your own narrative. The asymmetry of surveillance is itself a form of power: those who are watched are subject to the judgment of those who watch, even when nothing wrong has been done.

As journalist and author Barton Gellman has observed: "We are building the infrastructure for a police state. Whether it ever becomes one is a political question. The infrastructure doesn't care."

---

## The Stakes Are Personal — and Collective

Every actor in this landscape has different motivations, different data appetites, and different potential consequences for you. Advertisers want to predict and influence your purchases. Data brokers want to sell your profile to whoever pays. Governments want security and control. Hackers want your money. Employers want productivity. Insurers want accurate risk pricing. None of them ask permission for most of what they collect.

The individual stakes — identity theft, discriminatory pricing, political manipulation, stalking enabled by people-search sites — are serious. But the collective stakes are equally important. A society in which every person's movements, associations, communications, and thoughts are recorded, retained, and accessible to powerful actors is a society with fundamentally altered power dynamics. History offers ample evidence of what happens when surveillance infrastructure precedes accountability failures.

The good news is real: privacy is not binary. You are not choosing between total surveillance and perfect anonymity. Every step you take reduces your exposure, narrows your profile, and makes the data portrait of you less complete. Understanding who wants your data — and why — is the prerequisite for deciding what you are willing to give them.

The guides that follow this one show you where to begin.

---

## Sources and Further Reading

- Federal Trade Commission. (2014). *Data Brokers: A Call for Transparency and Accountability.* ftc.gov
- Federal Trade Commission. (2022). *Commercial Surveillance and Data Security Rulemaking.* ftc.gov
- Irish Council for Civil Liberties. (2021). *RTB: The Biggest Data Breach Ever Recorded.* iccl.ie
- Solove, D. (2007). *"I've Got Nothing to Hide" and Other Misunderstandings of Privacy.* San Diego Law Review, 44, 745.
- Amnesty International & Citizen Lab. (2021). *The Pegasus Project.* amnesty.org / citizenlab.ca
- Cadwalladr, C., & Graham-Harrison, E. (2018). *Revealed: 50 million Facebook profiles harvested for Cambridge Analytica in major data breach.* The Guardian.
- Gellman, B. (2020). *Dark Mirror: Edward Snowden and the American Surveillance State.* Penguin Press.
- Stoycheff, E. (2016). *Under Surveillance: Examining Facebook's Spiral of Silence Effects in the Wake of NSA Internet Monitoring.* Journalism & Mass Communication Quarterly, 93(2).
- Cox, J. (2020). *How the U.S. Military Buys Location Data from Ordinary Apps.* Vice / Motherboard.
- Electronic Frontier Foundation. *Street-Level Surveillance: Data Brokers and Law Enforcement.* eff.org
- Privacy International. *The Data Broker Industry.* privacyinternational.org
- Merrill, J.B., & Tobin, A. (2021). *Facebook Has Been Showing Military Gear Ads Next to Insurrection Content.* ProPublica.
- Gilad Edelman. (2021). *The $1 Billion Plan to Sell Ads Without Tracking You.* WIRED.
