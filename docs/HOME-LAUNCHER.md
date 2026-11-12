# Home course-first launcher

## Production data override

The application no longer imports any academic fixtures or displays demo notices/count labels. Courses/metadata/events come exclusively from the public catalog API; Reader documents are requested separately. Empty, loading and error states remain; failed requests never substitute fake records. [API-CONTRACT.md](../API-CONTRACT.md) is authoritative for integration and [README](../README.md) for deployment. Demo catalogs and old local-data claims below are historical design/test records, not current runtime behavior. Interaction geometry/motion stays as approved.

Production cleanup gate: Hard PASS (51 tests, lint/build, runtime response validation, no production fixture imports, dependency production audit reports zero vulnerabilities); Purpose PASS (only real API data, honest error/empty states, no replacement imagery or invented content); Liveliness PASS (existing palette/dials/motion retained); Craft PASS (built bundle tested at 1440/390/320px: empty Home/Search/Courses/Responsi/Schedule/Videos, 404 Reader, error/retry, invalid HTML response, metadata-only search and one on-demand Reader fetch; no page errors or overflow, mobile render inspected). API responses in browser tests are intercepted test payloads, not data shipped by the app or certification of a live backend. Actual backend/hosting remain a go-live prerequisite.

## Current: continuous Search icon morph

The bubble's magnifier and the input magnifier share `layoutId="search-icon"` and the existing 560ms transition. The icon travels/shrinks into the input and returns/grows on Back, instead of independently disappearing/reappearing. The destination icon sits outside the delayed/fading Search controls, with a matching layout slot inside the form; the returning Search bubble skips its independent initial fade/scale so it does not obscure the shared icon. Existing Back emergence, one-click return, focus and reduced motion remain.

Purpose: continuous icon identity makes the circle-to-bar relationship clear. Gate: Hard PASS (46 tests, lint/build and keyboard/reduced-motion focus); Purpose PASS (same functional icon, no added decoration); Liveliness PASS (existing 2/2/3 dials and shared easing); Craft PASS (`search-icon-morph-check.cjs` verifies continuous position/size in both directions, exact input-slot alignment, no ancestor fade, one settled icon and no page errors at 1440/768/390/320px; Back motion/interruption checks also pass).

Typography refinement: “one place.” overrides the heading's inherited negative tracking with `.015em` letter spacing and `.1em` word spacing, retaining the Bumbbled font while separating crowded strokes/words. CSS-only; other text, colors, controls and motion unchanged. Gate: Hard PASS (build and 1440/390/320px no-overflow/no-page-error checks); Purpose PASS (readability); Liveliness PASS (existing identity/dials retained); Craft PASS (rendered heading inspected, no interaction changes).

## Current: Back emerges from Search

Back now belongs to the retained Search scene, not the draggable course canvas. It starts behind the left end of the Search bar and slides/scales/fades into its existing adjacent position (480ms, 160ms entry delay, shared ease). Closing reverses toward the bar over 320ms while Search's shared-shape source remains for its reverse morph. The bar's higher layer covers the retreating control; icon/text move together. The exiting scene is immediately inert/accessibility-hidden, one-click Back and Search focus restoration remain, and reduced motion skips travel/delay. No layout or navigation change.

Purpose: the matching in/out movement makes Back feel attached to Search rather than appearing independently. Existing palette and ENERGY 2 / RHYTHM 2 / MOTION 3 remain. Delivery gate: Hard PASS (46 tests, lint/build, reduced-motion keyboard and restored focus); Purpose PASS (single control animation communicates its origin); Liveliness PASS (continuous entry/exit x/scale/opacity samples); Craft PASS (`search-back-motion-check.cjs` passes at 1440/768/390/320px, verifies unchanged final alignment, inert animated exit, single-click return, interrupted entry/reopen, no page errors/overflow; mobile capture inspected). Browser emulation, not Safari/device certification.

## Current: nearby resources and persistent edge discovery

Resource circles now stay **14–22px edge-to-edge from their selected course**, rather than searching orbits up to 80px farther away. Angular candidates are finer to find adjacent space without sending resources away from the parent. The existing local collision pushes remain.

Off-screen and strongly edge-shrunk courses are represented by four directional edge controls with live counts. Each course contributes to just one direction, so counts are not duplicated at corners. Controls stay inside the visible field, are at least 44px, and center/focus the nearest course in their direction when activated. This preserves discovery without docking many overlapping miniature course labels along the border. Hints update with two-axis drag, hide in Search and restore on Back. No synthetic courses/counts: they reflect the supplied catalog and current geometry.

Purpose: near-parent resources preserve their relationship; persistent edge counts show that more courses exist even after their full bubbles leave the viewport. The white/navy controls use the existing HIMTI colors and directional arrows encode actual movement. ENERGY 2 / RHYTHM 2 / MOTION 3 retained.

Delivery gate: Hard PASS (46 tests, lint/build, 44px controls, keyboard focus and accessible labels); Purpose PASS (nearby resources and discoverable hidden courses, no unrelated UI); Liveliness PASS (existing drag/fade/morph retained); Craft PASS (mobile capture inspected, `nearby-resource-check.cjs` verifies all 18 courses at 1440/390/320px have two resources within 14–22px, hint activation centers/focuses a hidden course, drag updates edge controls, Search hides and Back restores them, no page errors). Browser emulation only, not physical-device/Safari certification. This section supersedes older larger-orbit descriptions below.

## Current: dense, balanced two-dimensional placement

The latest user direction is **compact spacing with balanced vertical and horizontal spread**, not independent random placement or a horizontal strip. `scatteredPositions` now places each circle one course-step from an existing neighbor, choosing the closest free position to Search. Deterministic angle variation avoids straight rows without introducing isolated circles or random gaps. Circle centers retain at least `size + 18px` separation. The arrangement can extend beyond the viewport in both axes; the visible field remains screen-bound with small side margins, and two-axis dragging/keyboard focus reaches the rest. This supersedes earlier horizontal-only/height-capped placement below.

Purpose: dense neighbor placement removes accidental holes; balanced growth keeps exploration equally vertical and horizontal; deterministic positions preserve spatial memory. The existing HIMTI palette, grid, Bumbbled emphasis and motion direction remain, with ENERGY 2 / RHYTHM 2 / MOTION 3. Unselected course bubbles fade to .74 opacity; hover/focus restores full opacity. Search Back stays beside the input; recommendations have an inert, accessibility-hidden exit fade.

Verification: 45 tests, lint and production build pass. Geometry tests cover 7/19/43 circles, nonoverlap, neighbor spacing, stable positions and horizontal-to-vertical extent ratios between .8 and 1.25. `free-field-check.cjs` passes at 1920/1440/1024/768/390/320px: select opens resources and fades peers, deselect restores, two-axis drag pans, Recenter restores, Search opens recommendations, Escape visibly fades/removes inert suggestions, Back returns in one click, keyboard/reduced-motion Study Club navigation preserves the course filter. No page errors or document overflow. Current desktop/mobile captures inspected: `free-field-home-{1440,390}.png`.

Delivery gate for this revision: Hard PASS (45 regression tests and six-width interactive checks, no new assets/data/routes); Purpose PASS (dense placement and stable offsets serve discovery, existing branding retained); Liveliness PASS (2/2/3 direction retained, fade/drag/Search transitions verified); Craft PASS (desktop/mobile renders inspected, lint/build clean). This is browser-emulation evidence, not physical-device or Safari certification.

## Current: larger resources and local contact pushes

This revision replaces global root shrinking with collision-driven local movement. Resource diameter is `max(80, round(courseSize * .7))`, currently 80–112px, with 12px labels and 24px icons. All root controls retain scale 1; only existing field-edge shrink still applies near clipped boundaries. The selected root is pinned. Other roots move only when a resource or a pushed neighbor contacts them, and return to their original positions on deselection. Candidate layouts prefer fewer affected circles and less movement; unrelated circles stay in place. The default field never grows on selection, and the ring-only selected indicator/behind-parent reveal remain.

Catalog fixtures now contain **18 demo courses**, up from six, with unique IDs/codes and sample semester distribution 4/6/8 across 1/3/5. Twelve additional courses have no fabricated materials/events; existing empty states represent that honestly. These are UI fixtures, not an official curriculum. Larger catalogs use the compact orbit on tablet as well as phone to avoid squeezing two full hex rings into a narrow field; pages may scroll. The field does not grow merely because a course is selected.

Geometry is memoized by catalog size, selected index and viewport size rather than recalculated during pointer movement. Edge shrink follows animated coordinates, preventing visual scale jumps before a pushed bubble reaches an edge. Resource dismissal, direct Search Back and reduced-motion semantics are retained.

Proof: expanded geometry tests cover catalog sizes 2/3/4/5/7/9/19 and widths 288/358/608/1080, larger circles, pinned parent, deterministic placement, bounded satellites and nonoverlap. `local-push-check.cjs` verifies all 18 choices at 1440px and 320px, plus representative choices at 1024/768/390px: 19 initial controls, 21 when expanded, unchanged field height, outer root scale 1, selected anchor fixed, unaffected roots unchanged, visible circle nonoverlap, 80px+ resource controls, all semester filters, new-course search, one-click Search Back and filtered destinations. Current captures: `local-push-{1440,1024,768,390,320}.png`. `local-push-access-check.cjs` exercises keyboard/reduced motion, Chromium-emulated touch selection/navigation/drag, Recenter and one-tap Search Back. No physical-device/Safari certification.

Delivery Gate: Hard PASS, explicitly demo-only catalog, no fabricated academic materials, existing states/destinations/focus and AA colors retained; Purpose PASS, larger white circles improve reading/tapping and only actual contacts cause movement; Liveliness PASS, existing 2/2/3 dials with local easing; Craft PASS, current desktop/mobile captures inspected, 43 tests/lint/build pass, no new dependency or non-Home implementation. This section supersedes older 56–80px/global-.55-shrink descriptions below.

## Current: fixed-bound adaptive orbits

This section supersedes the row-shifting, check-marker and growing-field descriptions below.

- Home keeps its default field height and every large-circle center during selection, switching and deselection. Only the selected circle stays full size; other root controls scale to `.55` about their own centers. Their transformed targets remain above 44px in the shipped layouts. Selection uses the blue ring only, not a check marker.
- White satellites are `max(56, round(courseSize * .5))` (56–80px). A deterministic course-specific angular phase varies their placement; candidate positions are checked against field edges, the selected circle, shrunken neighbors and each other. The nearest fitting orbits are preferred. Placement remains stable on rerender rather than calling random during animation.
- Resources start at their parent's center, behind all root circles (`z-index:2` versus `3`), then emerge after 100ms using the shared 560ms ease-in-out. Dismissed choices return behind the parent over 240ms, become inert/hidden to assistive technology immediately, and are removed after exit. No separate text/icon animation. Reduced-motion skips travel/delay.
- Home's top alignment no longer depends on content-height auto margins. Search glow is anchored to the 72px input region rather than the growing recommendations panel. Search and its exiting scene allow soft overflow; Home drag retains clipped paint containment when the transition is done. Radial transparency removes hard glow boundaries without expanding circle geometry.
- Search exit retains its shared-shape source long enough to morph back into the circle. Input/recommendations fade together over 140ms; the exiting scene is hidden/inert, does not capture pointer or focus, and cleans up after the morph. Back remains one activation. Recommendations do not collapse on blur inside an inert exiting scene.

Verification: 42 tests pass. Geometry tests prove stable repeatable placement, two satellites, nonoverlap and full edge clearance for every course at widths 288/358/608/1080 and catalog sizes 2/3/4/7. Browser `inline-courses-check.cjs` covers all six demo selections at 1440/1024/768/390/320px: unchanged default height and all root centers, shrink instead of translation, ring-only selection, varied resource directions, behind-parent layers, white surfaces, no clipping/overlaps, toggles/filter reset, destinations, Search Back, keyboard/reduced motion and Chromium-emulated touch. `adaptive-transition-check.cjs` samples the reverse shared-shape morph, safely retained exit scene, and stable centers during interrupted clicks at 1440/390px. Captures: `adaptive-{algorithm,networks,operating,search}-{width}.png` and `adaptive-back-{1440,390}.png`. Console/page-error and overflow checks pass. No Safari or physical-device certification.

Delivery Gate: Hard PASS, existing demo states/real destinations/native controls retained, ring exposes selection via aria-pressed, resource targets remain at least 56px and colors unchanged; Purpose PASS, local shrink keeps context within default bounds, deterministic free-space placement prevents collisions, and source retention explains Search Back; Liveliness PASS, existing 2/2/3 dials with one parent-origin reveal; Craft PASS, desktop/mobile captures inspected, click-through and interrupted-motion checks above, no new dependency/assets or non-Home implementation. Full test/lint/build results belong to this revision, not older centered-course screenshots.

## Current: inline resource satellites

This revision supersedes the separate resource scene described in earlier sections. Selecting a course keeps the Home heading, Search, semester filter, and all course buttons. The selected navy course stays at its original anchor, with a blue ring, white check marker and `aria-pressed=true`. Clicking it again closes the choices; selecting another course switches them, and changing semester clears selection.

Two white resource circles emerge from that selected course, not from the field center. Size is `max(64, round(courseSize * .55))`, currently 64–88px. Their 560ms ease-in-out starts after 80ms; reduced motion removes travel/delay. The smaller circles show Responsi and Study Club, with existing filtered destinations. Text/icons remain inside each bubble as one visual unit.

To avoid overlap, rows below the selected course ease downward by `resourceSize + 32px`, then return on deselection. The selected course and rows above it retain their anchors. The canvas keeps its base height while the clipped field grows below it; a height-only resize no longer resets drag pan. This local expansion preserves the initial Home rather than replacing it with another view. Search Back remains one activation with recommendations open.

Latest proof: 42 tests pass (including unchanged selected anchor, collision-free expansions for every course across compact/wide geometry, toggle/switch/reset, white resources and existing destinations). Browser `inline-courses-check.cjs` checks all six demo selections at 1440/1024/768/390/320px, original selected anchors, full-size small resource circles, no overlaps, course-origin reveal, white surfaces, selection marker, toggling, filter reset, Search Back, keyboard/reduced motion, and Chromium-emulated touch. Screenshots `inline-courses-{width}.png` record the current result. Lint/build pass; no page errors or horizontal overflow.

Delivery Gate: Hard PASS, existing demo disclosures/states/navigation and focus retained, white/blue labels use existing AA colors, 64px+ resource controls exceed 44px; Purpose PASS, white satellites separate child actions from navy courses, ring/check expose selection, local expansion reserves readable space; Liveliness PASS, 2/2/3 dials retained with a single origin-based reveal; Craft PASS, no new dependency or non-Home implementation, desktop/mobile screenshots inspected and click-through covers selection → resource destination, deselection, switching, filters, Search/Back and keyboard/touch. No Safari or physical-device certification.

## Navy circles, direct Back, and resource reveal

- All course and resource circles use the existing navy `#102f62`. Search and Back retain white surfaces to distinguish utility controls. This supersedes the earlier alternating-course-color contract.
- Search Back prevents pointer-triggered input blur from collapsing recommendations and shifting the button between pointerdown and click. Keyboard focus moving to Back also keeps the list in place. One activation returns directly to the initial Home course screen with the existing semester/focus context.
- Selecting a course moves its complete bubble into the center with a restrained `1 → 1.08 → 1` zoom. Resource bubbles emerge from `(0,0)` at scale `.35`, then travel to their positions after 160ms using the shared 560ms ease-in-out. Text/icons remain part of each bubble, with no separate animation. Reduced-motion skips zoom, travel and delay.
- Delivery Gate: Hard PASS, existing controls/states/contrast retained and no new content/assets/routes; Purpose PASS, uniform navy matches the requested visual hierarchy and center-out reveal explains the parent/child relationship; Liveliness PASS, existing 2/2/3 dials with one focused reveal; Craft PASS, unit/integration assertions cover navy surfaces and browser samples prove center-out movement and zoom. Click-through covers course → choices → filtered destinations, semester filter, recommendations/results, direct Back and Recenter; keyboard/reduced motion and Chromium-emulated touch are included. Browser checks run at 1440/1024/768/390/320px with no page errors or horizontal overflow. No physical-device/Safari certification.

## Recommendation layout and typography follow-up

- Removed the Home-specific 220px recommendation cap. Search now uses normal document flow: the entire list (up to five matches) determines panel height, and Back follows it with a gap. No partially clipped last row or nested list scroll is required. One-result and empty panels shrink naturally.
- Bubble text/icons no longer fade in. Course surfaces no longer have an independent shared-layout animation: each bubble moves as a unit with its existing content. Search retains its circle-to-input shape transition.
- Only “one place.” uses the existing `/fonts/Bumbbled.otf`; other headline text retains Plus Jakarta Sans. This user-requested handwritten phrase adds emphasis without changing navigation typography.
- Heading and description enter together with the existing 560ms ease-in-out. Recommendations enter with a 360ms opacity/6px motion; reduced-motion removes both effects. The field animates its position as headings change.
- Delivery Gate scope: the existing hard/purpose/liveliness/quality passes remain applicable to unchanged content, controls, colors and states. Added browser checks at all five widths assert all five empty-query recommendations fit within the panel, Back follows without overlap, one-result panels shrink, and Bumbbled is applied only to the requested phrase. Latest captures include `course-first-recommendations-{1440,1024,768,390,320}.png`. No new assets, dependencies, claims or non-Home routes.

## Bubble polish revision

- Course colors now use their original catalog index, both in the orbit and selected state, including filtered views. Bubble labels omit course codes to prioritize readable names.
- Home transitions use a shared 560ms cubic-bezier `(0.42, 0, 0.18, 1)` ease-in-out instead of springs. The retained canvas lets the selected bubble and its content move into the center rather than remounting the entire field. Drag inertia remains direct manipulation.
- Edge shrink anchors toward the field interior: a bubble at the right edge shrinks toward its left side, and one at the top shrinks toward its bottom side. Hitboxes remain unchanged.
- A scoped blue dot field and soft blue aura connect the launcher with Search. Their height and opacity morph into the Search region using the same timing; they are noninteractive CSS layers, not new image assets. This requested motif marks the learning interaction area without changing the shared page grid.
- Verification: 40 unit/integration tests, lint and production build passed. Browser script `course-first-check.cjs` covers 1440/1024/768/390/320px, resource destinations, Back/filter/focus, Search morph, drag, keyboard/reduced motion and Chromium-emulated touch; no page errors or horizontal overflow. Latest captures show the new labels and dot/aura treatment. No physical-device or Safari certification.

Delivery Gate for this revision (supersedes earlier spring/code-label descriptions below):
- Hard Gate PASS: existing demo disclosures and loading/error/empty states retained; no new assets, claims, routes or theme. Native controls and focus remain; 40 tests cover route behavior, color consistency, missing initials and inward anchors. Browser click-through: course → resource choices; Responsi → course-filtered materials; Study Club → filtered schedule; Back → saved filter/focus; Search → recommendations/results; semester select → filtered circles; Recenter → origin. No console errors or mobile overflow at the five tested widths. Existing solid white/blue/navy text colors are unchanged.
- Purpose Gate PASS: user-requested dots/aura identify only the launcher/Search region; shared ease-in-out preserves spatial context, inward anchoring keeps shrinking circles away from clipped edges. Existing subject icons remain relevant to each course.
- Liveliness PASS: ENERGY 2 / RHYTHM 2 / MOTION 3 retained, with one scoped interaction field and continuous Search/course navigation.
- Craft/Quality PASS: no new dependencies or non-Home changes; initial full-size geometry, native controls, reduced-motion behavior and brand typography retained. Desktop and mobile screenshots inspected after the browser run.

## Shipped contract

The latest user-approved plan replaces feature → semester → course with **course → resource** on `/`. Root shows **Search at the center plus six demo course buttons**. A small native semester select above the field defaults to All semesters and filters visible courses; it is not a stage. Options derive from course metadata (currently demo 1/3/5), including courses without materials. The visible count is derived from data and labeled demo.

Selecting a course keeps `/` and moves its identity to the center as a **noninteractive `role="group"`**, not a dead button. Materi Responsi and Study Club links plus a Back button occupy separate positions around it. Only the resource links navigate to `/responsi?course=id&semester=N` or `/study-clubs?type=Study+Club&course=id&semester=N`. Back retains the semester filter and restores course-button focus. Search remains truly cross-semester despite that filter; Search Back preserves the filter and restores Search focus. There are no semester bubble choices.

Visual authority is the approved plan and brief, with the explicit [Motion Apple Watch reference](https://motion.dev/examples/react-apple-watch-home-screen#preview). No separate comp or QualityBar was supplied. Antislop mode is **DURING**. Direction is **ENERGY 2 / RHYTHM 2 / MOTION 3**, Home only. HIMTI palette, Plus Jakarta Sans, grid, logo, header, and shell remain. The separate Courses directory and all non-Home pages are unchanged in this increment. No new dependency, assets, or backend; Motion **14.11.1** is retained. Public `motion/react` APIs independently implement the interaction; gated Motion+ demo source was not copied.

Sources: `src/pages/home/{index.tsx,watch-field.tsx,watch-geometry.ts,launcher.css}`, reused `HomeSearch` and `CourseIcon`.

## Decisions and purpose

- **Palette/type:** inherited blue/navy/white and Plus Jakarta Sans keep Home recognizably HIMTI; course buttons alternate blue/navy, selected identity is navy, both resource links blue, Search/Back white with blue text.
- **Course-first hierarchy:** students identify a subject before choosing materials or sessions; the small native select narrows the catalog without another navigation level.
- **Center and orbit:** item 0 is always (0,0). Desktop uses hexagonal rings; compact mode (`width < size * 3 + 60`) uses a staggered two-column orbit. Selected-course mode has a central identity and three nonoverlapping actions.
- **Initial legibility:** native size is `min(160,max(112,(width-64)/2.5))`; spacing is size+18px. Runtime field height is `max(420,ceil(2*(max(abs(y))+size*.6+14)))`, overriding CSS fallback heights. Compact six-course fields are roughly 614–640px tall, keeping all initial visuals at scale 1. **Phone pages intentionally scroll; not all options fit the first viewport.** Search stays 520px tall.
- **Containment:** field top margin 28px (24px mobile), `overflow:hidden`, and `contain:paint` keep dragged circles out of heading/copy space. Root's filter sits above the field.
- **Shape/depth:** tactile shadows distinguish circle surfaces, not every content panel. Search morphs into a 72px-high, 36px-radius white capsule. Field radius is 36px/24px mobile; circles are not a sitewide pill rule.
- **Icons:** CourseIcon identifies subjects; Search/BookOpen/Users identify search/materials/sessions; Move/RotateCcw/ArrowLeft explain drag/Recenter/Back. No new icon artwork.
- **Continuity:** shared `search-shape` springs at 260/32; Search content fades 180ms after 220ms and receives focus. Shared `course-<id>` surfaces spring at 320/34 from satellite to static center. This communicates retained course context rather than another route.
- **Text and targets:** shared content has height 100% and `text-align:center` for multiline centering. Native hitboxes stay 112–160px while visuals scale. The native Home select uses 12px type with a 44px minimum target; caption uses 12px. Search Back is 88px, with 28px icon, 6px gap, 10px padding and 12px/1.3 label; suggestions cap at 220px and remain separate.
- **Direct manipulation:** per-circle scale is `clamp(0,1,min(width/2-abs(x)-10,height/2-abs(y)-10)/(size*.6))`, unchanged. Drag starts after 8px, with constraints, elasticity .06, inertia power .16/timeConstant 220/bounce 400/35, and post-drag pointer-click suppression. Recenter uses 300/34 and disables at origin; scene/resize resets pan.
- **Access:** keyboard focus pans controls into view at 320/34 except restored focus/fixed Search Back. Materi Responsi receives initial resource focus. Reduced motion disables inertia and animated shared morph/fades; direct edge scaling, keyboard, taps, and focus restoration remain.

## Interaction and click-through ledger

Execution evidence below is supplied by the parent session, not rerun by this documenter. Additional paths are explicitly source-inspected, not extra claimed clicks.

| Control/action | Result and evidence |
| --- | --- |
| Root Search and course buttons | Search centered plus six course buttons, seven initial visuals at scale 1, >10px clearance; browser script at five widths. |
| Semester select | All semesters default; selecting 3 actually filters visible course buttons, no semester buttons/stage; browser checked. Count is visibly demo and data-derived; source inspected. |
| Course button | Stays on `/`; centered static course identity at scale 1 plus three actions; browser checked. Identity is a group, never an actionable button; source inspected. |
| Materi Responsi link | `/responsi?course=id&semester=N`; href and destination course/semester filters browser checked. |
| Study Club link | `/study-clubs?type=Study+Club&course=id&semester=N`; href and destination type/course/semester filters browser checked. |
| Back from selected course | Root, same semester filter, originating course focus restored; browser checked. |
| Search circle | Shared shape morph with measured intermediate widths, focused all-semester input; browser checked. |
| Search typing | ALGO remains discoverable across semesters despite root filter 3; browser checked. |
| Search Back | Root filter retained, Search focus restored; browser checked. |
| Search keyboard/escape | Keyboard path and reduced motion browser checked. ArrowUp/Down selects suggestions; Enter activates selected course/material; Escape closes suggestions rather than Home mode; source inspected. |
| Suggestion pointer click | Opens course hub or material Reader; source-inspected handler, not separately claimed runtime coverage. |
| Search submit/unselected Enter | `/responsi?q=<encoded query>`, blank submits `/responsi`; source inspected. Blur closes recommendations; source inspected. |
| Drag, touch tap, Recenter | Course scale changes without activation; bounded drag, reset, Chromium-emulated touch drag/tap browser checked. Keyboard does not require dragging. |
| Root data states/retry | Pending/error/refetch/empty field keeps Search; Try again calls `query.refetch()`. Source inspected. |
| Missing selected course | Back survives; clear unavailable status and recovery copy. Source inspected, not backend failure injection. |
| Shared navigation/non-Home controls | Existing destinations, directory, filters, Readers, schedules and recordings unchanged; arrival filters checked, not a renewed whole-site click audit. |

## Acceptance evidence and limits

**Fresh independent review: SHIP, zero material fixes.** The reviewer checked all ten required current captures from top after settling and explicitly accepted the taller-phone-scroll adaptation and scoped behavior. Motion assessment used source plus parent runtime proof, **not direct browser review**. This documentation pass makes no independent runtime/visual certification claim.

Parent-supplied `.impeccable/review/course-first-check.cjs`: **PASS at 1440/1024/768/390/320px**. Checks include centered Search, seven full-size initial visuals and >10px clearance, no semester buttons, course drag/edge scaling without activation, Recenter, actual filter-3 course filtering, centered static selected identity and three actions, resource href/destination filters, Back filter/focus, intermediate Search morph widths, cross-semester ALGO despite filter 3, Search Back filter/focus, keyboard/reduced motion, and Chromium-emulated touch drag/tap. **No errors or overflow.**

**39 tests PASS**: three geometry tests cover counts 1..30 in both layouts with item 0 centered and minimum spacing, initial full size at field widths 288/358/608/1080, and edgeScale; 27 App tests plus remaining suites. **Lint PASS.** One post-inspection CSS-only `text-align:center` fix followed the test run; **build/browser reran PASS afterward**, with no JavaScript changes since the 39-test run. Diff check PASS before docs. No browser, tests, detector, formatter, or build runs occurred in this documentation-only pass.

Current reviewed captures under `.impeccable/review/`:
- `course-first-home-{1440,1024,768,390,320}.png` (five)
- `course-first-resource-{1440,390,320}.png` (three)
- `course-first-search-{1440,390}.png` (two)

Previously calculated text contrast is unchanged: blue/white **6.18:1**, white/navy **13.08:1**, muted/page **5.45:1**, ink/page **14.46:1**. No new text-color pair. Detector ran **once only**: advisory incumbent font steps 10/11/12/18/38, no hard errors. Do not repair unrelated drift or treat advisory values as a new global type scale. Unused semester-numeral styles remain, but do not describe live controls.

Latest build: index **343.39kB (gzip 108.17kB)**; retained explicit Motion chunk **167.92kB**. Static imports still load Motion, so chunk separation is **not lazy loading**. No npm install/audit ran this increment. Older seven-moderate TypeScript ESLint/minimatch tooling findings are historical, not a fresh audit result or Motion advisory.

Limits: demo catalog only; no data API/backend proof, no real Safari or physical-device certification, touch is Chromium emulation. Courses can lack materials/sessions; destination schedules still honor selected/current month. Unexercised Search submission paths are source-inspected above. Checkpoint `00b97f6` is untouched; latest changes remain uncommitted/unpushed per parent handoff. No separate comp, QualityBar result, or exact premium-source parity is claimed.

## Antislop DURING Delivery Gate

This updates the latest Home-only implementation gate using attributed parent execution/review and source inspection above. It is not a new gate run by this documenter, nor a re-audit of inherited pages or broader device certification.

### Hard gates

- R-02 PASS: changed Home/report copy has no em-dash copy.
- R-03 PASS: five-width proof shows full-size initial visuals, >10px clearance and no overflow; taller compact field intentionally scrolls. Circle targets 112–160px, Search Back 88px, select/Recenter minimum 44px.
- R-17 PASS: semesters and visible demo count derive from catalog data, not invented statistics.
- R-18 PASS: no new testimonials, avatars or endorsements.
- R-23 PASS: course-first navigation explicitly approved; logo unchanged, no new assets.
- R-24 PASS: resource links reach existing filtered routes; course selection stays on Home; shared navigation preserved.
- R-25 PASS: unchanged calculated text pairs 5.45:1 to 14.46:1 meet AA normal-text requirements.
- R-26 PASS: ledger accounts for real controls; selected identity is a noninteractive group, not a dead button; origin-disabled Recenter is intentional.
- R-27 PASS: inspected root pending/error/refetch/empty states keep Search; missing selected course keeps Back/status; Search has loading/error/no-results feedback.
- R-28 PASS: no FAQ added.
- R-32 PASS: native buttons, resource links, select and combobox, visible focus, resource focus and restored focus; supplied keyboard/reduced-motion checks pass.
- R-33 PASS: implementation is React/CSS source, not a source-rewriting runtime script; check script verifies only.
- R-34 PASS: approved light-only theme retained; no alternate-theme toggle introduced.
- R-35 PASS: parent build/test/lint/browser proof and element ledger supplied; runtime versus inspection distinguished, no doc-pass execution claimed.
- R-36 PASS: no invented security/customer/performance claims; evidence is attributed and scoped.
- R-37 PASS: user-approved plan/brief and incumbent HIMTI visual direction govern; no separate comp or QualityBar invented.
- R-38 PASS: visible demo labeling, data-derived count/semesters, and courses without materials avoid fabricated availability.

### Purpose gates

- R-01 PASS: inherited blue/navy identifies academic actions/context; no new decorative gradient/glow.
- R-04 PASS: subject and task icons describe adjacent content; helper icons explain actual actions.
- R-06 PASS: Plus Jakarta Sans preserves established HIMTI identity; compact filter type is locally scoped.
- R-07 PASS: user-requested academic grid remains inherited shell context.
- R-08 PASS: Back arrow means return and submit arrow means search submission, not every-circle decoration.
- R-09 PASS: no new status capsule or heading eyebrow; demo count is factual context.
- R-10 PASS: no new glass layer; existing header remains shell accent.
- R-12 PASS: circle shadows support tactile navigation/identity continuity, not floating content cards.
- R-13 PASS: no new glow treatment.
- R-14 PASS: equal circles represent catalog peers, not generic marketing features.
- R-19 PASS: Search/course continuity, bounded drag and edge scale orient navigation; reduced motion disables animated morph/fades/inertia.
- R-22 PASS: no illustration or invented product-shot asset.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 2 / MOTION 3 recorded in approved Home contract.
- Dial fidelity PASS: course-first orbit, resource scene, morph and bounded pan match the direction, no continuous idle animation.
- Focal point PASS: centered Search, selected-course identity or active Search organizes each scene.
- Whitespace PASS: title/filter, clipped field and helper zones remain distinct; compact height protects initial legibility.
- Accent PASS: blue actions/focus with navy/white supporting hierarchy.
- Motif PASS: circular subject orbit and satellite-to-center continuity make context persistent.
- Design Read PASS: experience-led academic navigation with HIMTI identity, not an unapproved Apple-brand clone.

### Craftsmanship and quality locks

- C-1 PASS: color/type/layout/spacing/icon/depth/motion purposes recorded above.
- C-2 PASS: Home controls have real behavior; static identity is honestly noninteractive; ledger labels inspection-only paths.
- C-3 PASS: course → resource follows approved content hierarchy without filler sections.
- C-4 PASS: five widths, keyboard/reduced motion/emulated touch and inspected failure states support scoped resilience, not universal certification.
- C-5 PASS: demo labels and attributed execution/review keep claims verifiable.
- R-05 PASS: course orbit and resource selection follow user tasks, not hero-plus-feature-card scaffolding.
- R-11 PASS: circles and Search capsule are signature shapes; field uses 36px/24px corners; other components retain existing radii.
- R-15 PASS: Search, Materi Responsi, Study Club, Back and Recenter name actual actions.
- R-16 PASS: no new marketing buzzwords or unsupported benefit claims.
- R-20 PASS: academic subject labels/icons and HIMTI palette/type support a specific identity beyond the logo.
- R-21 PASS: approved light reading reference retained; no unrequested dark default or deferred theme toggle.
- R-29 PASS: blue/navy with neutral white/pale surfaces, no new category rainbow.
- R-30 PASS: Watch interaction explicitly requested; HIMTI brand/shell retained.
- R-31 PASS: major decision rationales recorded in Decisions and purpose.
