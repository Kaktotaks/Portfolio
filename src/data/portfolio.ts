import avatar from '../assets/img/avatar.webp'
import iconFsfu from '../assets/img/icon-fsfu.webp'
import iconGithub from '../assets/img/icon-github.webp'
import iconGmail from '../assets/img/icon-gmail.webp'
import iconInstagram from '../assets/img/icon-instagram.webp'
import iconLinkedin from '../assets/img/icon-linkedin.webp'
import iconLifecell from '../assets/img/icon-lifecell.webp'
import iconLiven from '../assets/img/icon-liven.webp'
import iconTelquel from '../assets/img/icon-telquel.webp'
import type { HomeApp, LinkApp, Profile, Project, Screenshot, SystemApp } from './types'

// App Store screenshots live in assets/img as shot-<app>-<n>.webp
const shotFiles = import.meta.glob<string>('../assets/img/shot-*.webp', { eager: true, import: 'default' })
// width / height of each app's App Store screenshots (all 600 px wide)
const SHOT_RATIO: Record<string, number> = {
  liven: 600 / 1299,
  lifecell: 600 / 1067,
  telquel: 600 / 1067,
  fsfu: 600 / 1304,
}
const shots = (app: string, alts: string[]): Screenshot[] =>
  alts.map((alt, i) => ({ src: shotFiles[`../assets/img/shot-${app}-${i + 1}.webp`], alt, ratio: SHOT_RATIO[app] }))

/**
 * Single source of truth for the site.
 * Adding a project = adding one object to `projects`.
 * TODO markers are things Leonid still needs to fill in.
 */

export const profile: Profile = {
  name: 'Leonid Shevchenko',
  title: 'Senior Mobile (iOS) / Product Engineer',
  location: 'Ukraine',
  timeZone: 'Europe/Kyiv',
  email: 'leonidshevchenko350@gmail.com',
  photo: avatar,
  bio:
    'Mobile (iOS) and product engineer with 5+ years in UIKit and SwiftUI, plus hands-on web with Vue 3 and TypeScript. ' +
    'I like the unglamorous parts that make apps feel good: stability, debugging, attribution, paywalls ' +
    'and the tooling that lets a team ship faster.',
  languages: ['Ukrainian — native', 'English — C1'],
  skills: [
    {
      title: 'iOS',
      items: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'RxSwift', 'async/await', 'TCA', 'MVVM+C', 'SPM', 'Core Data', 'StoreKit 2'],
    },
    {
      title: 'Web',
      items: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', 'Apollo GraphQL'],
    },
    {
      title: 'Growth & analytics',
      items: ['AppsFlyer', 'Firebase', 'Amplitude', 'GrowthBook', 'A/B tests', 'Feature flags'],
    },
    {
      title: 'Quality',
      items: ['XCTest', 'XCUITest', 'Testomat.io', 'Crashlytics', 'Sentry', 'Instruments'],
    },
    {
      title: 'AI-assisted engineering',
      items: ['Claude Code skills', 'MCP', 'Multi-agent workflows', 'Git worktrees'],
    },
  ],
  experience: [
    {
      company: 'Liven (Skelar)',
      title: 'Senior Mobile (iOS) / Product Engineer',
      period: '2025 — now',
      note: 'Health & wellness product, iOS + web. Monetization, attribution, experimentation.',
    },
    {
      company: 'Intellias',
      title: 'Middle+ iOS Developer',
      period: '2023 — 2025',
      note: 'My lifecell — a top-3 Ukrainian operator app with 10M+ users.',
    },
    {
      company: 'Web Academy',
      title: 'iOS Mentor',
      period: '2023',
      note: '“iOS from scratch” course. 50+ students mentored overall.',
    },
    {
      company: "Drum'N'Code",
      title: 'iOS Developer',
      period: '2021 — 2023',
      note: 'Mainly TelQuel, a media app: WKWebView, IAP, PDFKit, legacy refactoring.',
    },
    {
      company: 'PrivatBank',
      title: 'Project Manager',
      period: '2013 — 2021',
      note: 'VIP banking and premium cards. Grew from VIP client support to project lead; retention projects and process changes.',
      highlights: [
        'Led a team of up to 5.',
        'Churn analysis and new retention logic cut VIP-client outflow by 10%.',
        'Pushed a targeted sorry-bonus pilot over a costly bank-wide program — cancel rate halved, pilot scaled.',
      ],
    },
  ],
}

export const projects: Project[] = [
  {
    kind: 'project',
    id: 'liven',
    name: 'Liven',
    icon: { from: '#6cc04a', to: '#2f7d1f', image: iconLiven },
    company: 'Liven (Skelar)',
    role: 'Senior Mobile (iOS) / Product Engineer',
    period: '06.2025 — present',
    platforms: ['iOS', 'Web'],
    tagline: 'Health & wellness app with 1M+ users',
    product:
      'An AI life coach that helps people build emotional skills in a few minutes a day: guided sessions, ' +
      'a personal learning path, progress streaks and practice of real-life scenarios. Available on iOS and the web.',
    summary:
      'I build product features end to end on iOS and on the web version, and own the growth stack around them: ' +
      'attribution, Apple and web monetization, and the experimentation setup that lets the team change ' +
      'onboarding and paywalls without an App Store release.',
    highlights: [
      'Build modern iOS features in Swift, UIKit and SwiftUI, plus the product’s web version in Vue 3 + TypeScript, Vite, Pinia and Apollo GraphQL.',
      'Reactive data flow with Combine on top of GraphQL APIs; TCA and MVVM + Combine in a multi-module SPM codebase.',
      'Own AppsFlyer attribution and monetization: In-App Purchases, subscriptions and Solidgate web payments.',
      'Create the app’s products in App Store Connect — in-app purchases and subscription plans — and implement them on the latest StoreKit 2, backed by deep knowledge of the iOS payment system.',
      'Ship via Firebase; run A/B tests and manage feature flags through GrowthBook.',
      'Designed Firestore-driven onboarding and paywall builders with configurable subscription flows.',
      'Built an internal ad-hoc debug tool that lets any teammate configure user flows, funnels, onboardings and paywalls on demand.',
      'Work to a “no QA” standard: engineers own quality end to end, with strict code standards and reviews, plus E2E, unit and integration tests orchestrated in Testomat.io.',
      'Author Claude Code skills and .md documentation standards adopted across the iOS, Web and Android teams.',
    ],
    impact: [
      'First product in Skelar’s portfolio to personalize content and UI by user intent from Meta / TikTok creatives (AppsFlyer, organic + paid).',
      '10+ localized onboarding variants launched without app releases, showing which UX and geo convert best.',
      'Testing and time-to-market cut ~3× with the internal configuration tool.',
      'Proposed A/B hypotheses from funnel data that tripled revenue for a target user cohort.',
      'Onboarding and paywall pages are built from server-driven configs via BaaS (Firebase / Firestore) — product and marketing launch new flows without an App Store release.',
      'Co-managed 100+ A/B tests.',
    ],
    metrics: [
      { value: '1M+', label: 'users' },
      { value: '100+', label: 'A/B tests' },
      { value: '3×', label: 'faster to market' },
    ],
    team: 'Cross-functional product team: iOS, Web, Android, design, marketing — no dedicated QA',
    domain: 'Health & wellness',
    stack: [
      'Swift',
      'SwiftUI',
      'UIKit',
      'TCA',
      'Combine',
      'GraphQL',
      'SPM',
      'StoreKit 2',
      'Firebase',
      'GrowthBook',
      'AppsFlyer',
      'Vue 3',
      'TypeScript',
      'Pinia',
      'Testomat.io',
    ],
    screenshots: shots('liven', [
      'Liven intro: build emotional skills with an AI coach',
      'AI coach for navigating emotions',
      'Feedback practice',
      'Personal learning path',
      'Daily progress and streaks',
      'Real-life practice scenarios',
    ]),
    links: [{ label: 'App Store', url: 'https://apps.apple.com/ua/app/liven-ai-life-coach/id6450840109' }],
  },
  {
    kind: 'project',
    id: 'lifecell',
    name: 'My lifecell',
    icon: { from: '#ffcc00', to: '#f2a900', image: iconLifecell },
    company: 'Intellias',
    role: 'Middle+ iOS Developer',
    period: '02.2023 — 03.2025',
    platforms: ['iOS'],
    tagline: 'Self-care app of a top-3 Ukrainian mobile operator',
    product:
      'The official app of lifecell, one of the top-3 mobile operators in Ukraine: balance and expenses, tariffs, ' +
      'managing several numbers, services and the Shake & Win rewards — used by 10M+ active subscribers.',
    summary:
      'I maintained the main app and helped build its new version inside a large team, shipping features end to end, ' +
      'setting up analytics and steadily refactoring a big codebase — while making it noticeably more stable.',
    highlights: [
      'Maintained the current main project and developed the new one.',
      'Implemented new features, set up analytics and refactored code across the app.',
      'Worked in a big tech team with designers, back-end, QA, Android and iOS developers, product owners and business analysts.',
      'Took part in hiring and onboarding: interviewed iOS candidates, ran code reviews and helped new teammates ramp up.',
      'Architecture: MVVM+C with RxSwift and Combine.',
    ],
    impact: ['Raised crash-free users from 94% to 99.9% using Firebase Crashlytics and Sentry.'],
    metrics: [
      { value: '10M+', label: 'users' },
      { value: '99.9%', label: 'crash-free' },
      { value: 'Top-3', label: 'UA operator' },
    ],
    team: 'Large team: design, back-end, QA, Android, iOS, POs and BAs',
    domain: 'Telecommunications & media',
    stack: ['Swift', 'UIKit', 'MVVM+C', 'RxSwift', 'Combine', 'Firebase', 'Crashlytics', 'Sentry'],
    screenshots: shots('lifecell', [
      'Home screen: balance and tariff at a glance',
      'Shake & Win gifts',
      'Managing multiple numbers',
      'Expense details',
      'Choosing a tariff',
    ]),
    links: [{ label: 'App Store', url: 'https://apps.apple.com/ua/app/my-lifecell/id580080545' }],
  },
  {
    kind: 'project',
    id: 'telquel',
    name: 'TelQuel',
    icon: { from: '#ef3b24', to: '#b91c1c', image: iconTelquel },
    company: "Drum'N'Code",
    role: 'iOS Developer',
    period: '10.2021 — 02.2023',
    platforms: ['iOS'],
    tagline: 'News & magazine app of TelQuel Media',
    product:
      'The app of TelQuel, a French-language news magazine from Morocco: articles, podcasts, the digital magazine ' +
      'and an archive of 1000+ past issues, with in-app subscriptions.',
    summary:
      "The app I spent most of my time on at Drum'N'Code, an outsourcing company: day-to-day feature work and fixes, " +
      'purchases, document handling and long-term care of a legacy codebase.',
    highlights: [
      'Fixed defects in WKWebView-based screens and the HTML content they render.',
      'Implemented In-App Purchases.',
      'Worked with PDFKit and FileManager for document handling.',
      'Refactored legacy code and debugged across MVVM+C, MVP and MVC with RxSwift.',
    ],
    metrics: [],
    team: "Outsourcing team at Drum'N'Code",
    domain: 'Media',
    stack: ['Swift', 'UIKit', 'RxSwift', 'MVVM+C', 'MVP', 'WKWebView', 'StoreKit', 'PDFKit', 'FileManager'],
    screenshots: shots('telquel', [
      'TelQuel news feed',
      'Magazine issues',
      'Articles and podcasts in one app',
      'Article search',
      'Subscription flow',
      'Archive of 1000+ issues',
    ]),
    links: [{ label: 'App Store', url: 'https://apps.apple.com/ua/app/telquel/id1504054422' }],
  },
  {
    kind: 'project',
    id: 'fsfu',
    name: 'FSFU',
    icon: { from: '#fdf68a', to: '#5b67c9', image: iconFsfu },
    company: 'Fishing Sport Federation of Ukraine',
    role: 'Product Owner & sole developer (volunteer)',
    period: '06.2021 — present',
    platforms: ['iOS'],
    tagline: 'Official federation app, built solo from scratch',
    product:
      'The official app of the Fishing Sport Federation of Ukraine for competitions: events, participant roles and ' +
      'catch records that judges can verify. Distributed to participants by link.',
    summary:
      'I own the app end to end — from the competition problem and requirements to development, ' +
      'App Store release and ongoing support. It solves a real pain point: proving results straight from the water.',
    highlights: [
      'Built the whole app solo from scratch in SwiftUI with Core Data.',
      'Catch photos are captured with GPS and timestamp, so competition results are verifiable.',
      'Offline-first sync queue: events and photos are cached locally and uploaded when signal returns at remote venues.',
      'MVVM on Combine with a central NavigationStack router; Moya networking, auth token kept in the Keychain.',
      'Fully localized in English and Ukrainian, with type-safe strings and assets generated by SwiftGen.',
      'Handle releases, App Store review and support for the federation.',
    ],
    impact: ['Verifiable, time- and location-stamped results straight from the water, even at venues with no signal.'],
    metrics: [
      { value: 'Solo', label: 'idea → App Store' },
      { value: 'Offline', label: 'first' },
      { value: '2021', label: 'supported since' },
    ],
    team: 'Solo, working directly with the federation',
    domain: 'Sport',
    stack: [
      'Swift',
      'SwiftUI',
      'UIKit',
      'MVVM',
      'Combine',
      'Core Data',
      'Moya',
      'Alamofire',
      'Kingfisher',
      'Lottie',
      'PopupView',
      'CoreLocation',
      'Camera',
      'Keychain',
      'SwiftGen',
      'SPM',
      'Localization (EN/UK)',
    ],
    screenshots: shots('fsfu', [
      'FSFU launch screen',
      'Competition events',
      'Catch photos with time and approval status',
      'Catch photo with GPS and timestamp overlay',
    ]),
    links: [{ label: 'App Store', url: 'https://apps.apple.com/ua/app/fsfu/id6624305618' }],
  },
]

const systemApps: SystemApp[] = [
  { kind: 'system', id: 'about', name: 'About', icon: { from: '#fbfbfd', to: '#c9c9d0', art: 'contact' } },
  { kind: 'system', id: 'notes', name: 'Experience', icon: { from: '#ffbe4d', to: '#ff7d0a', art: 'briefcase' } },
  { kind: 'system', id: 'settings', name: 'Skills', icon: { from: '#9a9aa0', to: '#4a4a50', art: 'gear' } },
  { kind: 'system', id: 'photos', name: 'Photos', icon: { from: '#ffffff', to: '#f1f1f4', art: 'photos' } },
  { kind: 'system', id: 'notes-app', name: 'Notes', icon: { from: '#fff6cc', to: '#ffd84d', art: 'notes' } },
]

/** All contact links (About, Control Center). The dock shows a subset. */
export const contacts: LinkApp[] = [
  {
    kind: 'link',
    id: 'linkedin',
    name: 'LinkedIn',
    icon: { from: '#0a66c2', to: '#004182', image: iconLinkedin },
    url: 'https://www.linkedin.com/in/leonid-shevchenko-0a4241b1/',
    badge: 1,
  },
  {
    kind: 'link',
    id: 'github',
    name: 'GitHub',
    icon: { from: '#24292f', to: '#0d1117', image: iconGithub },
    url: 'https://github.com/Kaktotaks',
  },
  {
    kind: 'link',
    id: 'mail',
    name: 'Mail',
    icon: { from: '#ea4335', to: '#c5221f', image: iconGmail },
    url: `mailto:${profile.email}`,
  },
  {
    kind: 'link',
    id: 'instagram',
    name: 'Instagram',
    icon: { from: '#f58529', to: '#c13584', image: iconInstagram },
    url: 'https://www.instagram.com/kaktotaks/',
  },
]

const ON_HOME_SCREEN = ['instagram']

/** Dock: contacts except those that live on the home screen as regular apps. */
export const dock: LinkApp[] = contacts.filter((c) => !ON_HOME_SCREEN.includes(c.id))

export const homeApps: HomeApp[] = [...projects, ...systemApps, ...contacts.filter((c) => ON_HOME_SCREEN.includes(c.id))]

/** Notification Center cards. Each one opens the app it belongs to. */
export interface Notice {
  appId: string
  title: string
  body: string
  when: string
}

export const notices: Notice[] = [
  { appId: 'about', title: 'Open to new roles', body: 'Senior Mobile (iOS) / Product Engineer · Remote. Tap for contacts.', when: 'now' },
  { appId: 'liven', title: '1M+ users', body: 'Owned attribution and paywalls; co-managed 100+ A/B tests.', when: '2025' },
  { appId: 'lifecell', title: 'Crash-free 99.9%', body: 'Up from 94% on an app with 10M+ users.', when: '2024' },
  { appId: 'fsfu', title: 'Shipped solo', body: 'Offline-first SwiftUI app, from first screen to App Store.', when: 'ongoing' },
  { appId: 'telquel', title: 'Media app', body: 'In-App Purchases, WKWebView and PDFKit at Drum’N’Code.', when: '2022' },
]

/** LinkedIn-style "Highlights" widget on the home screen. */
export const linkedinWidget = {
  summary: 'Senior Mobile (iOS) / Product Engineer, 5+ years. Apps for 1M+ and 10M+ users: monetization, growth, stability.',
  footer: 'Open to work',
}
