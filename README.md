# Khalid Cut

A bilingual, local-first calisthenics and wellbeing app. Built with React, TypeScript, Vite, Motion and Three.js. The five routes are Overview, Calisthenics, Approach, Nutrition and Progress. Arabic is the default; language and reading direction persist across visits.

## Run

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

The production build is `dist/`. `vercel.json` configures Vite and direct-route fallback. Capacitor uses the same build; the manual iOS workflow builds the web app before copying it into the native shell.

## Product behavior

- The movement studio loads Three.js only when opened. Four volumetric mannequin studies support play/pause, manual positioning, drag-to-orbit and side view. Reduced motion disables autoplay; unsupported WebGL has a photographic fallback and written instructions. These are illustrative studies, not motion-captured technique instruction.
- Session completion is recorded by local date and session, with a rest timer that uses wall time. It complements existing gym training rather than adding a mandatory schedule.
- Check-ins track energy, optional performance, optional weight/waist and notes. A date has one check-in; saving the same date updates it. No sample measurements are inserted. Body measurements can be hidden.
- Versioned JSON export and validated restore transfer data between browsers. Restore has a review step and replaces current records only after confirmation. Legacy `kr-logs` and `kr-lang` are read on the first visit; old undated exercise checkmarks are not assigned invented dates. An unreadable new-format store is retained under `khalid-cut-v1-recovery` before a fresh store is created.
- Data stays in localStorage on the current browser. No account, server persistence or automatic cross-device sync. Clearing browser storage can delete records; export a backup. Storage errors are surfaced.
- The PWA precaches routes, scripts, photographs, icons and fonts. Offline use is available after installation of the service worker during a complete online visit. Updates wait for the user so unsaved forms are not automatically discarded.
- Content supports growth, regular meals, training quality and recovery. There is no calorie-deficit calculator, target weight-loss rate, BMI score or reward for weight loss. Intentional weight change for a minor is referred to a guardian and qualified clinician/dietitian. The prior gym schedule is removed from the product.

## Browser checks

With the production preview running on port 4173:

```sh
npx playwright install chromium webkit
npm run test:e2e
```

Set `QA_BASE` to test another origin. The script creates isolated browser contexts and tests route/language changes, 3D controls, dated sessions, rest timer, nutrition tabs/habits, check-in validation/editing/persistence, backup restore, deletion, PWA offline behavior, reduced motion, RTL/LTR at 360/390/768/1440/1920 px, WCAG A/AA automated checks, and a WebKit mobile flow. Reports and screenshots are written to ignored `test-results/`. Tests use synthetic local records only. Responsive/WebKit emulation is not a physical iPhone device test.

## Sources and asset credits

- Health content: [American Academy of Pediatrics](https://www.healthychildren.org/English/healthy-living/sports/Pages/Weigh-Ins-Weight-Gain-Rules-for-Teen-Athletes.aspx) and [NHS Teen Health](https://derbyshireteenhealth.nhs.uk/healthylifestyle/healthy-eating-young-people).
- Rings photograph: [Edgar Chaparro / Unsplash](https://unsplash.com/photos/urEdfBdk1FE), image `1572459815294-26edc555608e`.
- Outdoor pull-up photograph: Shoham Avisrur / Unsplash, image `1704375058325-e51b6382a95d` from [the street workout collection](https://unsplash.com/s/photos/street-workout).
- Nutrition photograph: [Anna Pelzer / Unsplash](https://unsplash.com/photos/IGfIGP5ONV0), image `1511690743698-d9d85f2fbf38`.
- Photographs are locally optimized WebP assets under the [Unsplash license](https://unsplash.com/license). No AI-generated imagery or external image requests are used at runtime.
- IBM Plex Sans Arabic, SIL Open Font License (included at `public/assets/FONT-LICENSE.txt`); Latin typography uses the device sans-serif stack. Icons: Lucide (ISC). The logo and procedural movement studies are authored for this app.

Before this rebuild, the repository baseline was `74e6c476cd2593e3b68559e125f0fe92f6733e4c`. The old static site can be retrieved from Git history.
