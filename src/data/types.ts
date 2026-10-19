/** Small line symbols used inside UI (not app icons). */
export type GlyphName = 'linkedin' | 'mail' | 'check'

/** Built-in iOS-style artwork for the system apps (see SystemIconArt.vue). */
export type SystemArt = 'contact' | 'briefcase' | 'gear' | 'photos' | 'notes'

/**
 * Visual identity of a home-screen icon: either official app artwork (`image`) or
 * drawn system-app artwork (`art`). `from`/`to` tint the zoom animation behind it.
 * `scale` resizes `image` inside the tile: below 1 adds margin, above 1 crops the artwork's own edge.
 */
export type IconStyle = { from: string; to: string; scale?: number } & ({ image: string; art?: never } | { art: SystemArt; image?: never })

export interface Metric {
  value: string
  label: string
}

export interface Screenshot {
  src: string
  alt: string
  /** width / height, so the skeleton has the right shape before the image loads */
  ratio: number
}

export interface ProjectLink {
  label: string
  url: string
}

/** A commercial or personal project, opened as a case-study "app". */
export interface Project {
  kind: 'project'
  id: string
  name: string
  icon: IconStyle
  company: string
  role: string
  period: string
  platforms: string[]
  tagline: string
  /** What the product is, in public-facing terms */
  product?: string
  summary: string
  /** Responsibilities and work done */
  highlights: string[]
  /** Measurable outcomes, shown as a separate "Impact" list */
  impact?: string[]
  /** Who I worked with */
  team?: string
  domain?: string
  metrics: Metric[]
  stack: string[]
  screenshots?: Screenshot[]
  links?: ProjectLink[]
}

/** Built-in "system" apps that carry the bio instead of a classic About page. */
export interface SystemApp {
  kind: 'system'
  id: 'settings' | 'notes' | 'about' | 'photos' | 'notes-app'
  name: string
  icon: IconStyle
}

/** Dock items open external profiles directly. */
export interface LinkApp {
  kind: 'link'
  id: string
  name: string
  icon: IconStyle
  url: string
  /** iOS-style red badge count; cleared for good once the visitor taps the icon */
  badge?: number
}

export type HomeApp = Project | SystemApp | LinkApp

export interface SkillGroup {
  title: string
  items: string[]
}

export interface Role {
  company: string
  title: string
  period: string
  note: string
  highlights?: string[]
}

export interface Profile {
  name: string
  title: string
  location: string
  timeZone: string
  email: string
  photo: string
  bio: string
  languages: string[]
  skills: SkillGroup[]
  experience: Role[]
}
