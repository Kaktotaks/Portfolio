import avatar from '../assets/img/avatar.webp'
import iconFsfu from '../assets/img/icon-fsfu.webp'
import iconLifecell from '../assets/img/icon-lifecell.webp'
import iconLiven from '../assets/img/icon-liven.webp'
import iconTelquel from '../assets/img/icon-telquel.webp'
import type { HomeApp, LinkApp, Profile, Project, Screenshot, SystemApp } from './types'

// App Store screenshots live in assets/img as shot-<app>-<n>.webp
const shotFiles = import.meta.glob<string>('../assets/img/shot-*.webp', { eager: true, import: 'default' })
const shots = (app: string, alts: string[]): Screenshot[] =>
  alts.map((alt, i) => ({ src: shotFiles[`../assets/img/shot-${app}-${i + 1}.webp`], alt }))

/**
 * Single source of truth for the site.
 * Adding a project = adding one object to `projects`.
 * TODO markers are things Leonid still needs to fill in.
 */

export const profile: Profile = {
  name: 'Leonid Shevchenko',
  title: 'Senior Mobile Engineer · iOS',
  location: 'Ukraine',
  timeZone: 'Europe/Kyiv',
  email: 'leonidshevchenko350@gmail.com',
  photo: avatar,
  bio:
    'iOS engineer with 5+ years in UIKit and SwiftUI, plus hands-on web with Vue 3 and TypeScript. ' +
    'I like the unglamorous parts that make apps feel good: stability, debugging, attribution, paywalls ' +
    'and the tooling that lets a team ship faster.',
  languages: ['Ukrainian — native', 'English — C1'],
  skills: [
    {
      title: 'iOS',
      items: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'RxSwift', 'async/await', 'TCA', 'MVVM+C', 'SPM', 'Core Data', 'StoreKit'],
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
      title: 'iOS / Product Engineer',
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
      company: "Drum'N'Code",
      title: 'iOS Developer',
      period: '2021 — 2023',
      note: 'Mainly TelQuel, a media app: WKWebView, IAP, PDFKit, legacy refactoring.',
    },
    {
      company: 'Web Academy',
      title: 'iOS Mentor',
      period: '2023',
      note: '“iOS from scratch” course. 50+ students mentored overall.',
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
    icon: { glyph: 'leaf', from: '#6cc04a', to: '#2f7d1f', image: iconLiven },
    company: 'Liven (Skelar)',
    role: 'iOS / Product Engineer',
    period: '06.2025 — present',
    platforms: ['iOS', 'Web'],
    tagline: 'Health & wellness app with 1M+ users',
    summary:
      'Product engineering across iOS and the web version: monetization, attribution and the experimentation ' +
      'infrastructure that lets the team change onboarding and paywalls without a release.',
    highlights: [
      'Owned AppsFlyer attribution (organic + paid) enabling intent-based personalization — a first in the Skelar portfolio.',
      'Designed Firestore-driven onboarding and paywall builders: 10+ localized variants, UI changes without app releases.',
      'Built an internal ad-hoc debug tool for configuring flows, onboardings and paywalls — testing and time-to-market ~3× faster.',
      'StoreKit, IAP and subscriptions; web payments via Solidgate.',
    ],
    metrics: [
      { value: '1M+', label: 'users' },
      { value: '3×', label: 'faster QA' },
      { value: '10+', label: 'paywall variants' },
    ],
    stack: ['Swift', 'SwiftUI', 'UIKit', 'TCA', 'Combine', 'GraphQL', 'GrowthBook', 'AppsFlyer', 'Vue 3', 'TypeScript'],
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
    icon: { glyph: 'signal', from: '#ffcc00', to: '#f2a900', image: iconLifecell },
    company: 'Intellias',
    role: 'Middle+ iOS Developer',
    period: '02.2023 — 03.2025',
    platforms: ['iOS'],
    tagline: 'Self-care app of a top-3 Ukrainian mobile operator',
    summary:
      'Feature work, analytics and large-scale refactoring on an app used by millions. Also took part in hiring ' +
      'and onboarding new engineers.',
    highlights: [
      'Raised crash-free users from 94% to 99.9% using Crashlytics and Sentry.',
      'Shipped features and analytics across a large MVVM+C codebase.',
      'Interviewed candidates and onboarded new team members.',
    ],
    metrics: [
      { value: '10M+', label: 'users' },
      { value: '99.9%', label: 'crash-free' },
    ],
    stack: ['Swift', 'UIKit', 'MVVM+C', 'RxSwift', 'Combine', 'Crashlytics', 'Sentry'],
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
    icon: { glyph: 'doc', from: '#ef3b24', to: '#b91c1c', image: iconTelquel },
    company: "Drum'N'Code",
    role: 'iOS Developer',
    period: '10.2021 — 02.2023',
    platforms: ['iOS'],
    tagline: 'News & magazine app of TelQuel Media',
    summary:
      "The app I spent most of my time on at Drum'N'Code: day-to-day feature work, purchases and stability " +
      'for a media product with web-based content.',
    highlights: [
      'Fixed defects in WKWebView-based screens and the HTML content they render.',
      'Implemented In-App Purchases.',
      'Worked with PDFKit and FileManager for document content.',
      'Refactored legacy code and debugged across MVVM+C, MVP and MVC.',
    ],
    metrics: [],
    stack: ['Swift', 'UIKit', 'RxSwift', 'MVVM+C', 'WKWebView', 'StoreKit', 'PDFKit'],
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
    icon: { glyph: 'fish', from: '#fdf68a', to: '#5b67c9', image: iconFsfu },
    company: 'Fishing Sport Federation of Ukraine',
    role: 'Sole developer (volunteer)',
    period: '06.2021 — present',
    platforms: ['iOS'],
    tagline: 'Official federation app, built solo from scratch',
    summary:
      'Designed, built and shipped the federation’s official iOS app on my own — from the first screen to App Store review.',
    highlights: [
      'Catch photos stamped with GPS and time, so competition results are verifiable.',
      'Offline-first sync queue that uploads results when signal returns on the water.',
    ],
    metrics: [
      { value: 'Solo', label: 'design → App Store' },
      { value: 'Offline', label: 'first' },
    ],
    stack: ['Swift', 'SwiftUI', 'Core Data'],
    screenshots: shots('fsfu', [
      'FSFU launch screen',
      'Competition events',
      'Catch photos with time and approval status',
      'Catch photo with GPS and timestamp overlay',
    ]),
    links: [{ label: 'App Store', url: 'https://apps.apple.com/ua/app/%D1%84%D1%80%D1%81%D1%83/id6624305618' }],
  },
]

const systemApps: SystemApp[] = [
  { kind: 'system', id: 'about', name: 'About', icon: { glyph: 'person', from: '#fbbf24', to: '#c2410c' } },
  { kind: 'system', id: 'notes', name: 'Experience', icon: { glyph: 'notes', from: '#fde68a', to: '#f59e0b', ink: '#78350f' } },
  { kind: 'system', id: 'settings', name: 'Skills', icon: { glyph: 'settings', from: '#9ca3af', to: '#374151' } },
]

export const dock: LinkApp[] = [
  {
    kind: 'link',
    id: 'linkedin',
    name: 'LinkedIn',
    icon: { glyph: 'linkedin', from: '#3b82f6', to: '#1d4ed8' },
    url: 'https://www.linkedin.com/in/leonid-shevchenko-0a4241b1/',
  },
  {
    kind: 'link',
    id: 'github',
    name: 'GitHub',
    icon: { glyph: 'github', from: '#4b5563', to: '#111827' },
    url: 'https://github.com/Kaktotaks',
  },
  {
    kind: 'link',
    id: 'mail',
    name: 'Mail',
    icon: { glyph: 'mail', from: '#7dd3fc', to: '#2563eb' },
    url: `mailto:${profile.email}`,
  },
  {
    kind: 'link',
    id: 'instagram',
    name: 'Instagram',
    icon: { glyph: 'instagram', from: '#f59e0b', to: '#be185d' },
    url: 'https://www.instagram.com/kaktotaks/',
  },
]

export const homeApps: HomeApp[] = [...projects, ...systemApps]

/** Notification Center cards. Each one opens the app it belongs to. */
export interface Notice {
  appId: string
  title: string
  body: string
  when: string
}

export const notices: Notice[] = [
  { appId: 'about', title: 'Open to new roles', body: 'Senior iOS · Remote. Tap for contacts.', when: 'now' },
  { appId: 'liven', title: '1M+ users', body: 'Owned attribution, paywalls and the A/B experimentation stack.', when: '2025' },
  { appId: 'lifecell', title: 'Crash-free 99.9%', body: 'Up from 94% on an app with 10M+ users.', when: '2024' },
  { appId: 'fsfu', title: 'Shipped solo', body: 'Offline-first SwiftUI app, from first screen to App Store.', when: 'ongoing' },
  { appId: 'telquel', title: 'Media app', body: 'In-App Purchases, WKWebView and PDFKit at Drum’N’Code.', when: '2022' },
]
