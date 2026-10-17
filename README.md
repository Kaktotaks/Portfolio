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

Add a project by adding one object to `projects`. Project and contact icons use the
official App Store artwork (`src/assets/img/icon-*.webp`, set via `icon.image`); system
apps use drawn artwork (`icon.art`, see `src/components/SystemIconArt.vue`).

## Photos app

1. Put original photos (HEIC, JPG, PNG, WebP) into `photos-src/` — it's git-ignored.
2. Run `pip install pillow pillow-heif && python3 tools/add-photos.py`.
3. Commit `src/assets/photos/` and `src/data/photos.json`.

The script makes web-size images and square grid thumbnails, reads the capture date from EXIF,
and keeps any `caption` you add to `photos.json` by hand.

## Glass material

`.glass` (on app sheets) and `.glass-clear` (on the wallpaper) in `src/style.css`.
Keep `backdrop-filter` values literal and put `-webkit-backdrop-filter` first —
the CSS minifier drops the unprefixed property otherwise, which breaks the blur in Chrome.

## Gestures

Mouse, touch and pen all work (`src/composables/useDrag.ts`):

- Pull down from the left half of the status bar → Notification Center; right half → Control Center.
  Swipe up (or press Esc) to close. Tapping the status bar halves opens them too, for keyboard users.
- In an app: drag the home indicator up to shrink the app back to its icon; swipe from the left edge to go back.
- Releases are velocity-aware, so a quick flick completes a gesture early.

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
