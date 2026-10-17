export type GlyphName =
  | 'leaf'
  | 'signal'
  | 'fish'
  | 'doc'
  | 'settings'
  | 'notes'
  | 'mail'
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'person'
  | 'graduation'
  | 'check'

/** Built-in iOS-style artwork for the system apps (see SystemIconArt.vue). */
export type SystemArt = 'contact' | 'briefcase' | 'gear' | 'photos' | 'notes'

/** Visual identity of a home-screen icon. */
export interface IconStyle {
  glyph: GlyphName
  from: string
  to: string
  /** Glyph colour, defaults to white */
  ink?: string
  /** Real app icon artwork; when set it replaces the gradient + glyph */
  image?: string
  /** iOS-style drawn artwork for system apps; replaces the gradient + glyph */
  art?: SystemArt
}

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
  /** Case study not written yet — the app opens to a "coming soon" screen */
  draft?: boolean
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
  id: 'settings' | 'notes' | 'mail' | 'about' | 'photos' | 'notes-app'
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
