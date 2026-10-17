# Leonid Shevchenko — Portfolio

An iOS-style home screen portfolio. Each app icon opens a project case study with the
iOS zoom-from-icon transition; the Dock holds contacts. Phones get an iPhone layout,
desktops get an iPad in landscape.

Built with Vue 3, TypeScript and Vite. No UI libraries.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Edit content

Everything the site shows lives in `src/data/portfolio.ts`:

- `projects` — case-study apps (metrics, highlights, stack, links)
- `profile` — bio, skills, experience timeline, languages
- `dock` — LinkedIn, GitHub, Mail, Instagram

Add a project by adding one object to `projects`. Icons are gradient + glyph
(`src/components/Glyph.vue`) — no third-party logos.

## Deep links

`/#/liven`, `/#/lifecell`, `/#/fsfu`, `/#/about`, … open an app directly — useful
for linking a single case study from a CV or cover letter.

## Structure

```
src/
  App.vue                 home screen, lock screen, routing
  components/
    AppIcon.vue           icon tile (button for apps, link for dock)
    AppWindow.vue         FLIP open/close animation, Esc + focus handling
    LockScreen.vue        tap / swipe-up to unlock
    apps/                 Project, About, Experience, Skills screens
  data/portfolio.ts       all content
```

## Deploy

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(enable Pages → Source: GitHub Actions in the repo settings once).
For a custom domain, add it in Pages settings and point DNS at GitHub.

## Accessibility

Icons are real buttons/links, the home screen becomes `inert` while an app is open,
`Esc` closes apps and focus returns to the launching icon, and
`prefers-reduced-motion` swaps the zoom for a fade. Light and dark mode follow the system.
