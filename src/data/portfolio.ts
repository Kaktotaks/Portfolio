import avatar from '../assets/img/avatar.webp'
import lifecell1 from '../assets/img/lifecell-1.webp'
import type { HomeApp, LinkApp, Profile, Project, SystemApp } from './types'

/**
 * Single source of truth for the site.
 * Adding a project = adding one object to `projects`.
 * TODO markers are things Leonid still needs to fill in.
 */

export const profile: Profile = {
  name: 'Leonid Shevchenko',
  title: 'Senior Mobile Engineer · iOS',
  location: 'Dnipro, Ukraine',
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
      note: 'Client products: WKWebView, IAP, PDFKit, legacy refactoring.',
    },
    {
      company: 'Web Academy',
      title: 'iOS Mentor',
      period: '2023',
      note: '“iOS from scratch” course. 50+ students mentored overall.',
    },
  ],
}

export const projects: Project[] = [
  {
    kind: 'project',
    id: 'liven',
    name: 'Liven',
    icon: { glyph: 'leaf', from: '#34d399', to: '#0f766e' },
    company: 'Liven (Skelar)',
    role: 'iOS / Product Engineer',
    period: '06.2025 — present',
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
    // TODO: add the App Store link if you're allowed to share it
  },
  {
    kind: 'project',
    id: 'lifecell',
    name: 'My lifecell',
    icon: { glyph: 'signal', from: '#60a5fa', to: '#1e3a8a' },
    company: 'Intellias',
    role: 'Middle+ iOS Developer',
    period: '02.2023 — 03.2025',
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
    screenshots: [{ src: lifecell1, alt: 'My lifecell home screen with tariff promo and account menu' }],
  },
  {
    kind: 'project',
    id: 'fsfu',
    name: 'FSFU',
    icon: { glyph: 'fish', from: '#38bdf8', to: '#0c4a6e' },
    company: 'Fishing Sport Federation of Ukraine',
    role: 'Sole developer (volunteer)',
    period: '06.2021 — present',
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
    // TODO: paste the App Store URL here
    links: [],
  },
  {
    kind: 'project',
    id: 'drumncode',
    name: 'Client Apps',
    icon: { glyph: 'doc', from: '#f472b6', to: '#7c2d12' },
    company: "Drum'N'Code",
    role: 'iOS Developer',
    period: '10.2021 — 02.2023',
    tagline: 'Outsourcing products for several clients',
    summary: 'Worked directly with clients on several apps, from new features to legacy rescue.',
    highlights: [
      'WKWebView-based hybrid flows and In-App Purchases.',
      'Document handling with PDFKit and FileManager.',
      'Refactored legacy code across MVC, MVP and MVVM+C codebases.',
    ],
    metrics: [],
    stack: ['Swift', 'UIKit', 'RxSwift', 'WKWebView', 'StoreKit', 'PDFKit'],
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
