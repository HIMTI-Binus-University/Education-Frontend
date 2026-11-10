# Search-first opening

The user requested a search-only first viewport, an animated scroll invitation, light snapping, smooth reveals, and the Internal Frontend loading treatment. Existing HIMTI colors, navigation, course hierarchy, and search behavior remain unchanged. ENERGY 2 / RHYTHM 2 / MOTION 2.

- Home uses a full small-viewport-height opening with only search and a scroll invitation in its content area. Navigation remains accessible above it. Academic resources begin below the fold.
- The invitation's text and arrow move subtly for three cycles, then settle; its real anchor opens `#home-resources`.
- Native proximity scroll snapping applies only to Home's opening/resource boundary, not individual cards or Reader sections. No wheel/touch handlers or forced scroll direction.
- Resource groups reveal once over 650ms with 28px movement and a strong ease-out. CSS content is visible by default; JavaScript enhances it using IntersectionObserver and Web Animations. Keyboard focus finishes a pending reveal immediately.
- Internal reference: `E:/Education-Frontend/HIMTI-Internal-Frontend/src/components/app-motion.tsx` and `src/index.css`. An opening logo rotates and moves toward the navbar in under one second, once per tab session. The overlay never intercepts input. No artificial fetch delay.
- Actual pending data displays the same 72px logo/spin treatment as Internal. It remains a live status rather than pretending that ready data is still loading.
- Reduced motion skips the opening, reveal, invitation movement, loading spin, smooth scrolling, and snapping. Changing the preference cancels active JavaScript animation. Cleanup cancels animations, disconnects observers, and removes Home's document class on navigation.
- Native APIs cover this sequence, so no new runtime dependency was added. This is a scoped motion change, not a new visual identity or three-direction redesign.

## Verification
`npm run build`, `npm run lint`, and 16 component tests pass. Headless Edge checks at 1440, 390, and 320px verify the intro/session flag, search-only first viewport, scroll invitation destination, completed reveal, proximity snap, route cleanup, and search submission. Reduced-motion checks confirm no opening/reveal animations and no snapping. No page or console errors in that run. Local screenshot evidence is in `.impeccable/review/search-first-*.png` and `reveal-*.png` (gitignored). Real Safari/touch-device animation has not been tested.

Delivery gate: PASS for the scoped change. Existing palette/assets/content retained; no new claims or visuals fabricated; search and scroll invitation exercised; loading/error/empty states retained; keyboard reveal and reduced motion implemented; no document overflow at tested widths. Motion purpose is orienting visitors from finding one summary to browsing course resources, rather than decorating every card.
# Search dot drift refinement

At the user's request, Home's search dots now drift slowly between `translate(-8px, 4px)` and `translate(8px, -4px)` over 18 seconds per direction. Only the decorative `::after` moves; the search field and suggestions do not. Focus resumes the animation, blur pauses it, and the existing focus-only opacity reveal remains. Reduced motion disables the animation. This adds gentle movement to the supplied search motif without pulsing its opacity or moving interactive content.

Browser proof: dots are initially hidden and paused, run on focus with an 18s duration, change transform without changing the search-stage bounds, and have no animation under reduced motion. Vite's watcher also excludes ZIP archives after a locked font archive caused a Windows `EBUSY` crash; font files remain untouched.
# Home return transition correction

Browser frame sampling reproduced a scroll-snap conflict on route entry: translating the route container by 8px also moved Home's snap target, and scrollY oscillated between 0 and 8 while the animation ran. Route entry now fades for 320ms without translating the layout. Shared route scroll reset and Home snap-class setup/cleanup run in layout effects, before paint, rather than exposing an intermediate scroll position. The shared header remains unanimated; reduced motion still disables the fade.

Regression proof: return to Home from the footer of Courses, Schedule, and Videos at 1440/390/320px. Every sampled Home frame stays at scrollY 0 with hero top 0 and no route transform while opacity animates. Empty-query recommendations also reopen after Escape and navigate to a course. Build, lint, and 32 component tests pass.
# Route-specific animation scope

At the user's correction, non-Home routes retain the original 240ms fade with an 8px upward entry. Only Home uses the new 320ms opacity-only transition, selected by `.home-page-transition`, so its scroll-snap target remains stationary. Pre-paint scroll reset and reduced-motion disabling are preserved.
# Session filter indicator

The Schedule's All sessions / Study Club / Responsi control now shares one pale-blue indicator that slides between three equal-width buttons over 320ms (`cubic-bezier(.22,1,.36,1)`). This makes the selected-filter change continuous without moving the calendar layout or animating focus outlines. Native buttons, URL filters, and `aria-pressed` remain; reduced motion disables the transition. Browser checks at 1440/390/320px verify indicator/button alignment, keyboard selection, filtering state, and no horizontal overflow or page errors. No animation dependency is added.
