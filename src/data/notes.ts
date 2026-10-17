/**
 * Notes app content. Work folders are based on facts from Leonid's CV — the humour is in the tone,
 * not in the numbers. Edit freely: a note is a title plus blocks.
 */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'li'; text: string }
  | { t: 'check'; text: string; done?: boolean }

export interface Note {
  id: string
  title: string
  /** ISO date shown in the list and at the top of the note */
  date: string
  pinned?: boolean
  blocks: Block[]
}

export interface Folder {
  id: string
  name: string
  notes: Note[]
}

export const folders: Folder[] = [
  {
    id: 'liven',
    name: 'Liven 🌱',
    notes: [
      {
        id: 'liven-builder',
        title: 'Onboarding builder: before / after',
        date: '2026-03-12T18:40:00',
        pinned: true,
        blocks: [
          { t: 'h', text: 'Before' },
          { t: 'li', text: '"Can we move this button?" → wait for the next App Store release' },
          { t: 'h', text: 'After' },
          { t: 'li', text: 'Onboardings and paywalls are configured in Firestore — UI changes ship without a release' },
          { t: 'li', text: '10+ localized onboarding variants live' },
          { t: 'li', text: 'Marketing now knows which UX and geo convert best (and so do I)' },
          { t: 'p', text: 'Moral: build the tool once, stop shipping the same screen twice.' },
        ],
      },
      {
        id: 'liven-ab',
        title: '100+ A/B tests later — lessons',
        date: '2026-06-02T09:15:00',
        blocks: [
          { t: 'li', text: 'Your favourite variant will lose. Run the test anyway.' },
          { t: 'li', text: 'A hypothesis from funnel data beats a hypothesis from vibes.' },
          { t: 'li', text: 'GrowthBook flag first, opinion second.' },
          { t: 'li', text: 'Teach the team to run experiments themselves — then go and build the next thing.' },
        ],
      },
      {
        id: 'liven-debug',
        title: 'Debug tool — README (abridged)',
        date: '2025-11-20T14:05:00',
        blocks: [
          { t: 'p', text: 'Any teammate can configure user flows, funnels, onboardings and paywalls on demand.' },
          { t: 'check', text: 'No custom builds for every test case', done: true },
          { t: 'check', text: 'Testing and time-to-market ~3× faster', done: true },
          { t: 'check', text: 'Stop being "the person who makes the special build"', done: true },
        ],
      },
      {
        id: 'liven-attribution',
        title: 'AppsFlyer: who came from where',
        date: '2025-09-30T11:20:00',
        blocks: [
          { t: 'p', text: 'Organic + paid attribution, Meta and TikTok creatives → content and UI personalized by user intent.' },
          { t: 'p', text: 'First product in Skelar’s portfolio to ship it. Achievement unlocked 🏆' },
        ],
      },
    ],
  },
  {
    id: 'lifecell',
    name: 'My lifecell 📶',
    notes: [
      {
        id: 'lifecell-crash',
        title: 'Crash-free: 94% → 99.9%',
        date: '2024-11-08T17:30:00',
        pinned: true,
        blocks: [
          { t: 'check', text: 'Open Crashlytics', done: true },
          { t: 'check', text: 'Open Sentry', done: true },
          { t: 'check', text: 'Fix the top crash', done: true },
          { t: 'check', text: 'Repeat until the chart is boring', done: true },
          { t: 'p', text: 'Remaining 0.1%: cosmic rays. Probably.' },
        ],
      },
      {
        id: 'lifecell-team',
        title: 'Big team, big app',
        date: '2024-03-14T10:00:00',
        blocks: [
          { t: 'p', text: '10M+ users. Designers, back-end, QA, Android, iOS, POs and BAs — all in one standup.' },
          { t: 'li', text: 'Maintain the main app, build the new one' },
          { t: 'li', text: 'Features + analytics + refactoring, at the same time' },
          { t: 'li', text: 'MVVM+C with RxSwift and Combine living together peacefully' },
        ],
      },
      {
        id: 'lifecell-interviews',
        title: 'Interviewing iOS candidates',
        date: '2023-10-05T16:45:00',
        blocks: [
          { t: 'p', text: 'Part of hiring and onboarding new teammates.' },
          { t: 'li', text: 'Ask how they debug, not just how they code' },
          { t: 'li', text: 'A good question beats a perfect answer' },
          { t: 'li', text: 'Be the interviewer you wanted to have' },
        ],
      },
    ],
  },
  {
    id: 'telquel',
    name: 'TelQuel 📰',
    notes: [
      {
        id: 'telquel-webview',
        title: 'WKWebView survival guide',
        date: '2022-09-21T13:10:00',
        blocks: [
          { t: 'check', text: 'The HTML is fine', done: false },
          { t: 'check', text: 'The CSS is fine', done: false },
          { t: 'check', text: 'It works on my device', done: true },
          { t: 'p', text: 'Fixed defects in WKWebView screens and the HTML they render. Respect the web view.' },
        ],
      },
      {
        id: 'telquel-iap',
        title: 'Shipped: In-App Purchases',
        date: '2022-05-17T19:00:00',
        blocks: [
          { t: 'li', text: 'StoreKit In-App Purchases' },
          { t: 'li', text: 'PDFKit + FileManager for documents' },
          { t: 'li', text: 'Legacy refactoring across MVVM+C, MVP and MVC' },
          { t: 'p', text: 'Outsourcing at Drum’N’Code: the app I spent most of my time on.' },
        ],
      },
    ],
  },
  {
    id: 'fsfu',
    name: 'FSFU 🎣',
    notes: [
      {
        id: 'fsfu-rule',
        title: 'Fish photo or it didn’t happen',
        date: '2025-06-20T06:30:00',
        pinned: true,
        blocks: [
          { t: 'p', text: 'Catch photos are stamped with GPS and time, so competition results are verifiable straight from the water.' },
          { t: 'p', text: 'Every angler’s story now comes with evidence. 🐟' },
        ],
      },
      {
        id: 'fsfu-offline',
        title: 'No signal on the lake',
        date: '2024-08-03T07:45:00',
        blocks: [
          { t: 'p', text: 'Offline-first sync queue: events and photos are cached and uploaded when signal returns.' },
          { t: 'check', text: 'SwiftUI', done: true },
          { t: 'check', text: 'Core Data', done: true },
          { t: 'check', text: 'Patience', done: true },
        ],
      },
      {
        id: 'fsfu-solo',
        title: 'Team meeting',
        date: '2021-06-01T09:00:00',
        blocks: [
          { t: 'p', text: 'Attendees: me.' },
          { t: 'p', text: 'Volunteer project since 2021 — idea, requirements, development, App Store release and support. Solo.' },
        ],
      },
    ],
  },
  {
    id: 'privatbank',
    name: 'PrivatBank 🏦',
    notes: [
      {
        id: 'pb-retention',
        title: 'Retention playbook',
        date: '2020-11-12T15:20:00',
        blocks: [
          { t: 'li', text: 'Analyse why VIP clients leave' },
          { t: 'li', text: 'New retention logic → client outflow −10%' },
          { t: 'li', text: 'Targeted sorry-bonus pilot instead of a costly bank-wide program → cancel rate halved, pilot scaled' },
          { t: 'p', text: 'The cheapest bonus is the one you only give to the right people.' },
        ],
      },
      {
        id: 'pb-path',
        title: 'Career speedrun',
        date: '2021-05-28T18:00:00',
        blocks: [
          { t: 'p', text: '8 years: from VIP client support to project lead — premium cards, VIP contact center, a team of up to 5.' },
          { t: 'p', text: 'Next level: iOS. 📱' },
        ],
      },
    ],
  },
  {
    id: 'todo',
    name: 'To Do ✅',
    notes: [
      {
        id: 'todo-now',
        title: 'This week',
        date: '2026-10-17T20:30:00',
        pinned: true,
        blocks: [
          { t: 'check', text: 'Build my portfolio as an iPhone', done: true },
          { t: 'check', text: 'Make it buttery smooth on phones', done: true },
          { t: 'check', text: 'Add more photos to Photos', done: false },
          { t: 'check', text: 'Answer that recruiter (you know the one)', done: false },
          { t: 'check', text: 'Drink water', done: false },
        ],
      },
    ],
  },
  {
    id: 'plans',
    name: 'Plans 2027 🚀',
    notes: [
      {
        id: 'plans-2027',
        title: '2027',
        date: '2026-10-01T22:10:00',
        blocks: [
          { t: 'check', text: 'Ship something people open every day', done: false },
          { t: 'check', text: 'Fewer meetings, more releases', done: false },
          { t: 'check', text: 'Read more books than I have open tabs', done: false },
          { t: 'check', text: 'Catch a bigger fish than the FSFU icon', done: false },
        ],
      },
    ],
  },
]
