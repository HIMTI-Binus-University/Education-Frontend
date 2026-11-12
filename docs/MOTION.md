# Motion

## Current Home contract

Home uses the approved **course-first** revision of the [Motion Apple Watch reference](https://motion.dev/examples/react-apple-watch-home-screen#preview), retaining HIMTI palette, grid, type, logo and shared header. Direction: **ENERGY 2 / RHYTHM 2 / MOTION 3**. This supersedes feature → semester → course and older hero/feed/reveal/snap motion descriptions. The separate Courses directory and all non-Home pages are unchanged in this increment.

- Root `/`: item 0 is centered Search, with six demo course buttons around it. Native semester select above the field defaults to All semesters and filters courses, never adds a navigation stage. Courses without materials remain visible.
- Selecting a course stays on `/`: a static, noninteractive identity (`role="group"`) is centered, with Materi Responsi/Study Club links and Back around it. Shared `course-<id>` surfaces preserve satellite-to-center continuity using a 320/34 spring. Only resource links navigate to existing course/semester-filtered routes. Back retains filter and restores course focus.
- Motion **14.11.1** public `motion/react` APIs are retained; no dependency added. Exact premium Motion+ source is gated and was not copied.
- `useDragControls` starts after 8px; constrained drag uses elasticity .06 and inertia power .16, timeConstant 220, bounce stiffness 400/damping 35. Post-drag pointer activation is suppressed. Recenter uses 300/34 and disables at origin; scene/resize changes reset pan.
- Independent per-circle `useTransform` edge scale stays 0–1, never above native size. ResizeObserver sizes native circles 112–160px; spacing is size+18px. Scaling visuals does not shrink hitboxes.
- Item 0 always stays (0,0). Desktop uses hexagonal rings; compact mode (`width < size * 3 + 60`) uses a staggered two-column orbit. Runtime height `max(420,ceil(2*(max(abs(y))+size*.6+14)))` overrides CSS fallback heights. Compact six-course fields are roughly 614–640px tall: all initial visuals are scale 1. Phone pages intentionally scroll; no all-options-first-viewport claim. Search remains fixed at 520px.
- `overflow:hidden`, `contain:paint`, and 28px field top margin (24px mobile) prevent dragged circle paint entering title/copy space.
- Search ignores root semester filter and shares `search-shape` between circle and 72px-high, radius-36px input surface, spring 260/32. Content fades 180ms after 220ms, then focuses input. Parent runtime proof measured intermediate widths, not merely a fade. Back preserves filter and restores Search focus.
- Suggestions cap at 220px, separate from fixed 88px Search Back (28px icon, 6px gap, 10px padding, 12px/1.3 label). Shared circle content height 100% and text-align center keep multiline labels centered.
- Circle entry fades 240ms. Keyboard focus pans controls at 320/34 except restored focus/fixed Search Back; resource mode initially focuses Materi Responsi. Reduced motion disables inertia and animated shared morph/fades, preserving direct drag edge scaling and keyboard operation.
- Home directly uses `useEducationData` pending/error/refetch/empty states: root retains Search; missing selected course retains Back and clear status. No DataBoundary wrapper or artificial fetch delay.

## Retained non-Home behavior

Shared shell logo/loading behavior is unchanged: opening logo treatment runs once per tab session without intercepting input; actual pending data uses live loading status. Reduced motion skips opening/loading spin. Non-Home route entry retains its original 240ms fade/8px rise; Home retains scoped opacity-only route treatment and pre-paint scroll reset. Header stays unanimated.

Schedule's existing All sessions / Study Club / Responsi indicator slides between equal-width buttons over 320ms (`cubic-bezier(.22,1,.36,1)`), without moving calendar layout or focus outlines. Native buttons, URL filters and aria-pressed remain; reduced motion disables the transition. These are retained behaviors, not freshly certified by Home checks.

## Attributed evidence and limits

Parent `.impeccable/review/course-first-check.cjs` **PASS at 1440/1024/768/390/320px**: centered root Search and seven scale-1 visuals, >10px clearance, no semester buttons, drag scaling/no activation/Recenter, actual semester-3 filtering, centered static identity plus three actions, resource destination filters, Back filter/focus, measured Search morph and cross-semester ALGO despite filter 3, Search Back filter/focus, keyboard/reduced motion and Chromium-emulated touch drag/tap. No errors/overflow.

39 tests PASS: three geometry tests (counts 1..30, both layouts, centered item 0/minimum spacing; initial full size at field widths 288/358/608/1080; edgeScale), 27 App tests plus other suites. Lint PASS. One subsequent CSS-only text-centering fix; build/browser reran PASS after it, no JavaScript changes since tests. Diff check PASS before docs.

Fresh independent review **SHIP, zero material fixes**, after reviewing ten settled, top-position captures under `.impeccable/review/`: `course-first-home-{1440,1024,768,390,320}.png`, `course-first-resource-{1440,390,320}.png`, `course-first-search-{1440,390}.png`. Tall-phone scrolling accepted. Motion review was source plus parent runtime proof, not direct browser review. No separate comp or QualityBar supplied. No reruns or recapture in this doc-only pass. Full click ledger and per-rule Antislop DURING Delivery Gate: `docs/HOME-LAUNCHER.md`.

Build index 343.39kB (gzip 108.17kB); retained Motion chunk 167.92kB. Static imports still load Motion: **not lazy loading**. No npm install/audit this increment; older seven-moderate TypeScript ESLint/minimatch tooling findings are historical only. Detector ran once with advisory incumbent font steps 10/11/12/18/38, no hard errors; unrelated drift is not repaired or canonized. Demo data only, no data API/backend or real Safari/physical-device certification. Checkpoint `00b97f6` untouched; changes uncommitted/unpushed per parent handoff.
