# Khalid Cut

A bilingual, local-first calisthenics and wellbeing app. Built with React, TypeScript, Vite, Motion and Three.js. The four routes are Today, Train, Food and Progress. The old `/approach` URL redirects to Today. Arabic is the default; language and reading direction persist across visits.

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
- A direct header button switches light/dark and saves the preference. The first visit follows the operating-system preference; the pre-paint bootstrap avoids a light flash. The 3D studio also adapts its lighting and surfaces.
- A compact shared week navigator appears in all four sections. Selecting a date carries it between client-side routes; reopening the app starts at today. Nutrition habits, sessions and check-in defaults use the selected date. Future days allow planning but cannot be marked complete. The repeating weekly training layout can be edited and is included in backups; older backups receive the default layout without losing records.
- A short 80/20 note organizes attention around foundations and optional flexibility. They are not calorie splits, rigid food quotas, adherence scores or claims about percentages of results. Daily meal ideas are flexible examples, not prescribed amounts. Each date has saved meal choices, including optional free-text meals. A shopping list deduplicates the selected ingredients and identifies custom meals whose ingredients need to be added separately. Snack ingredients are optional; shopping ticks are temporary. Future meal planning is supported without future completion records. Older version-1 backups receive an empty meal-choice map while retaining all records.
- The enhanced 3D mannequin uses smoother contours, anatomical detail, four camera presets, half-speed playback and optional illustrative muscle highlights. The renderer stays lazy-loaded and pauses activity offscreen.
- Content supports growth, regular meals, training quality and recovery. There is no calorie-deficit calculator, target weight-loss rate, BMI score or reward for weight loss. Intentional weight change for a minor is referred to a guardian and qualified clinician/dietitian. The prior gym schedule is removed from the product.

The meal guide has 15 original, bilingual preparation guides with approximate times, equipment, numbered steps, ingredient alternatives and an optional single-step cooking view. Custom meal names do not receive invented instructions. Cooking-view progress is temporary and does not mark meals or habits complete. Poultry/fish doneness references FoodSafety.gov.

The exercise guide covers setup, breathing, three stages, common errors and easier alternatives. Selecting a stage pauses the illustrative 3D model at a matching position; selecting the same position again after playback resets it. Mobile controls jump between the guide and model. The model still shows the foundation version; easier alternatives and hollow-hold entry/exit are explained in text. Movement references link to ACE and NASM.

## Browser checks

With the production preview running on port 4173:

```sh
npx playwright install chromium webkit
npm run test:e2e
npm run test:upgrade
npm run test:guides
```

Set `QA_BASE` to test another origin. The script creates isolated browser contexts and tests route/language changes, 3D controls, dated sessions, rest timer, meal selection/preparation and habits, check-in validation/editing/persistence, backup restore, deletion, PWA offline behavior, reduced motion, RTL/LTR at 360/390/768/1440/1920 px, WCAG A/AA automated checks, and a WebKit mobile flow. Reports and screenshots are written to ignored `test-results/`. Tests use synthetic local records only. Responsive/WebKit emulation is not a physical iPhone device test.

When loopback sockets are prohibited, `QA_STATIC=1` serves the production build through Playwright request fixtures. This mode checks rendered UI, storage, backup blob contents and built PWA files, but cannot verify real network/offline service-worker behavior or an OS download save. Browser executables must already be installed; set `PLAYWRIGHT_BROWSERS_PATH` if the environment uses a different cache location.

## Sources and asset credits

- Health content: [American Academy of Pediatrics](https://www.healthychildren.org/English/healthy-living/sports/Pages/Weigh-Ins-Weight-Gain-Rules-for-Teen-Athletes.aspx) and [NHS Teen Health](https://derbyshireteenhealth.nhs.uk/healthylifestyle/healthy-eating-young-people).
- Outdoor pull-up photograph: Shoham Avisrur / Unsplash, image `1704375058325-e51b6382a95d` from [the street workout collection](https://unsplash.com/s/photos/street-workout).
- Photographs are locally optimized WebP assets under the [Unsplash license](https://unsplash.com/license). No AI-generated imagery or external image requests are used at runtime.
- IBM Plex Sans Arabic, SIL Open Font License (included at `public/assets/FONT-LICENSE.txt`); Latin typography uses the device sans-serif stack. Icons: Lucide (ISC). The logo and procedural movement studies are authored for this app.

Before this rebuild, the repository baseline was `74e6c476cd2593e3b68559e125f0fe92f6733e4c`. The old static site can be retrieved from Git history.
