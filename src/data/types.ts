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

/** Visual identity of a home-screen icon. Gradients only — no third-party logos. */
export interface IconStyle {
  glyph: GlyphName
  from: string
  to: string
  /** Glyph colour, defaults to white */
  ink?: string
}

export interface Metric {
  value: string
  label: string
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
  tagline: string
  summary: string
  highlights: string[]
  metrics: Metric[]
  stack: string[]
  links?: ProjectLink[]
}

/** Built-in "system" apps that carry the bio instead of a classic About page. */
export interface SystemApp {
  kind: 'system'
  id: 'settings' | 'notes' | 'mail' | 'about'
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
}

export interface Profile {
  name: string
  title: string
  location: string
  timeZone: string
  email: string
  bio: string
  languages: string[]
  skills: SkillGroup[]
  experience: Role[]
}
