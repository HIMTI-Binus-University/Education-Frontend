---
name: HIMTI Education
description: Public academic resources in the approved HIMTI white-and-blue reference.
colors:
  primary: "#0059d6"
  primary-hover: "#004cb5"
  ink: "#0b2452"
  muted: "#52678d"
  background: "#f7faff"
  surface: "#fff"
  line: "#e2ecfa"
  pale: "#eaf3ff"
  secondary-bg: "#eff6ff"
  secondary-ink: "#0055cc"
  secondary-hover: "#e1eeff"
  nav-active: "#edf5ff"
  code-bg: "#f3f6fb"
  code-keyword: "#a92539"
  code-builtin: "#9a3a00"
  code-comment: "#526078"
  code-name: "#166534"
  launcher-outline: "#d5e5fb"
  launcher-navy: "#102f62"
  launcher-hover-outline: "#8bb7f6"
  launcher-search-outline: "#a9cafa"
typography:
  display:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "clamp(40px, 5.1vw, 64px)"
    fontWeight: 800
    lineHeight: 1.13
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "clamp(30px, 3.5vw, 43px)"
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  title:
    fontSize: "26px"
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  body:
    fontSize: "15px"
    lineHeight: 1.95
  label:
    fontSize: "13px"
    fontWeight: 650
  launcher-heading:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "clamp(32px, 4.2vw, 54px)"
    fontWeight: 750
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  launcher-label:
    fontSize: "14px"
    fontWeight: 650
  launcher-numeral:
    fontSize: "48px"
    fontWeight: 650
    lineHeight: 1.2
  launcher-filter:
    fontSize: "12px"
rounded:
  inline: "4px"
  icon-button: "8px"
  control: "9px"
  nav: "10px"
  segmented: "11px"
  mobile-panel: "13px"
  panel: "16px"
  launcher-field: "36px"
  launcher-field-mobile: "24px"
  launcher-search: "36px"
  launcher-circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "40px"
  launcher-gap: "18px"
  launcher-heading-gap: "28px"
  launcher-heading-gap-mobile: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-bg}"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.control}"
    padding: "11px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  text-link:
    textColor: "{colors.primary}"
    padding: "0"
  search-field:
    textColor: "{colors.ink}"
    rounded: "{rounded.inline}"
    padding: "12px 5px"
  navigation-link:
    textColor: "{colors.primary}"
    rounded: "{rounded.nav}"
    padding: "0 19px"
  filter-selected:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.primary}"
    padding: "10px 18px"
  course-card:
    backgroundColor: "#ffffffd9"
    rounded: "{rounded.panel}"
    padding: "24px 22px"
  resource-row:
    padding: "15px 4px"
  launcher-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.launcher-label}"
    rounded: "{rounded.launcher-circle}"
    size: "112px–160px (ResizeObserver)"
  launcher-responsi:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.launcher-circle}"
  launcher-study-club:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.launcher-circle}"
  launcher-course:
    textColor: "{colors.surface}"
    rounded: "{rounded.launcher-circle}"
    size: "112px–160px (ResizeObserver)"
  launcher-course-identity:
    backgroundColor: "{colors.launcher-navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.launcher-circle}"
  launcher-semester-filter:
    typography: "{typography.launcher-filter}"
  launcher-search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.launcher-search}"
    height: "72px"
  launcher-search-back:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.launcher-circle}"
    size: "88px"
    padding: "10px"
---

# Design System: HIMTI Education

## Overview

**Creative North Star: "HIMTI resource-first reference"**

The user's pinned screenshot remains the shared-shell visual authority: HIMTI blue and navy, white panels, pale blue surroundings, and Plus Jakarta Sans. Academic directories retain denser cards, summary rows, and schedules. Home now follows the explicitly requested circular launcher, not the retired hero/resource feed.

Light mode is intentional to match that reference and support studying. Home's approved direction is ENERGY 2 / RHYTHM 2 / MOTION 3: interactive panning and finite mode reveals, without continuous animation. This Home-specific update takes precedence over older Home hero, feed, scroll-snap, reveal, and motion statements here and in `docs/MOTION.md` or the earlier education surface brief. It does not change non-Home styling rules. See `.impeccable/surfaces/home-launcher.md` and `docs/HOME-LAUNCHER.md`.

**Key Characteristics:**
- Blue actions, navy headings, muted academic metadata.
- Rounded white panels, semantic icon tiles, and linked resource rows.
- Spacious discovery, denser reading and scheduling.

Ground truth: `src/main.tsx`, `src/index.css`, `tailwind.config.js`, and the shared components. Product commitments live in `PRODUCT.md`; surface composition lives in `.impeccable/surfaces/education.md`. The unchanged local HIMTI logo is `public/logo-himti.png`, sourced from the Internal repository with embedded provenance; see `docs/ASSETS.md`.

Home ground truth is `src/pages/home/index.tsx`, `watch-field.tsx`, `watch-geometry.ts`, and `launcher.css`. Launcher tokens are scoped additions, not a replacement palette or a repair of unrelated historical token drift.

## Colors

### Primary
Primary blue identifies actionable controls, links, focus, and selection. Its darker hover variant signals interaction; it is not a second brand accent.

Home uses white/primary for Search and Back, alternating primary/navy course buttons, and a navy selected-course identity. Both Materi Responsi and Study Club resource links use primary/white. Launcher-outline bounds white circles without adding another accent.

The native semester select filters visible courses, not a navigation stage. Launcher-hover-outline is a decorative hover boundary; launcher-search-outline bounds the morphed input. Neither introduces a new text color.

### Neutral
Ink carries headings and control text; muted carries supporting context. Surface and background separate white panels from the cool page. Line supplies restrained boundaries; pale and nav-active identify selected or supporting areas. The source also uses soft blue gradients behind the page and icon tiles to reproduce the reference, not a decorative grid.

Code colors are syntax roles, not additional brand accents. The final keyword, built-in, comment, and name overrides are recorded above against code-bg; other syntax styling comes from the imported GitHub highlight stylesheet. Sidecar tonal ramps are synthesized panel metadata, not implemented palette steps or additional theme modes.

**The Academic Context Rule.** Keep course, exam, period, and session metadata subordinate but legible; do not replace it with promotional badges.

## Typography

Plus Jakarta Sans with system-ui/sans-serif fallback is the explicit HIMTI brand commitment, not an interchangeable default. Display, headings, body, and controls share the family. Code and math use their renderer-provided typography.

The frontmatter retains the original display role alongside Home launcher roles. Home's heading changes with mode; at 640px it uses `clamp(30px, 7vw, 40px)` and circle labels (12px). Course-circle names use (12px, line-height 1.35), codes (10px, line-height 1.2); selected-course names use weight (750). The small Home semester select and data-derived demo count use (12px), with a (44px) minimum select target. Retained launcher-numeral styling is unused: there are no semester bubble controls. Search Back uses (12px, line-height 1.3), a (28px) icon, (6px) gap and (10px) padding. Shared circle content fills its height and centers multiline text. Resource titles use (15px, 650, 1.5); supporting rows use (14px, 1.7). Reader headings use (24px, 700, 1.45). Metadata generally uses (11–13px). The read-only Reader retains HIMTI typography, with local table, code, and formula scrolling; its actual provisional content contract is recorded below.

Legacy hero type rules no longer govern Home. Mobile page titles use (30px), course detail titles (26px), section titles (22px), and reader body (13px, 1.95). Mobile text inputs and non-Home selects remain (16px); the Home semester select has the scoped compact type override above.

## Layout

Paired schedule/recording sections share header and panel rows via CSS subgrid above 900px so both panel tops and heights align even when descriptions wrap differently. Stacked layouts keep their natural content heights. Browser measurements verify equal tops/heights at 1440/1024px and no overflow at 390/320px.

Main containers use `min(1160px, calc(100% - 80px))`; at 640px gutters reduce to (20px) per side. The sticky glass header caps at (1080px), offset (24px) on every desktop route and (20px) on mobile. A stable scrollbar gutter keeps its horizontal position unchanged between long and short routes. Desktop navigation aligns right; mobile retains the menu toggle. Home's Search panel caps at (770px). Anchor offsets leave room for the sticky header. Non-Home route content enters with a 240ms fade and 8px rise without moving the shared header; Home retains its scoped opacity-only route treatment. Reduced motion removes route animation.

Home has no directory grid or schedule/recording feed. Search is position 0 at the center, with six demo course buttons around it in the unfiltered catalog. A native All semesters select above the field filters those courses without a semester navigation stage. Content caps at (1080px); padding is (158px 24px 24px), becoming (136px 16px 22px) at 640px. The field clips paint with `overflow: hidden` and `contain: paint`; its (28px) top margin, (24px) mobile, protects title/copy space during drag. ResizeObserver sizes circles to (112–160px); center spacing is size plus the launcher gap. Normal layout uses hexagonal rings; compact layout activates when field width is less than `size * 3 + 60` and uses a staggered two-column orbit. Item 0 always stays at (0,0). Inline runtime height overrides CSS fallback heights: `max(420, ceil(2 * (max(abs(y)) + size * .6 + 14)))`; Search is fixed at (520px). The six-course compact field is roughly (614–640px) tall so all initial visuals remain scale 1. Phone pages intentionally scroll: not all choices are promised in the first viewport. Visual edge shrinkage remains independent of full-size native hitboxes. Back stays inside the field; instructions stack at 640px. Directory cards use three columns, then two at 900px, one at 640px. Schedule calendar/agenda stacks at 1150px; event detail stacks at 900px. Video cards become one column at 640px. The latest Home increment changes none of those other pages.

The reader has a (220px) sticky outline and flexible article with (40px) gap. At 900px the outline becomes an inline panel above the article. Tables retain a (560px) minimum width inside a keyboard-focusable local scroll region. Code and display math scroll locally, never widening the page.

Spacing is contextual: the launcher separates heading, interactive field, and helper controls; the old Home section gaps no longer apply. Other grids and controls retain their existing steps.

## Elevation & Depth

The user's supplied grid reference supersedes the earlier no-grid direction: a static 48px grid in low-opacity HIMTI blue adds a graph-paper academic motif behind the shared shell. The reader stays solid white to protect readability. The outline uses pale blue and bold primary text to identify the section nearest the upper reading area, with `aria-current="location"` exposing the same state. Reader direction remains ENERGY 1 / RHYTHM 2 / MOTION 2; Home's separately approved motion is scoped above.

Borders and pale tonal surfaces carry ordinary hierarchy; cards do not float on shadows. The header uses `0 8px 30px -16px #173c742b`; hero search uses `0 9px 25px -15px #244f8c45`; the expanded mobile navigation uses `0 14px 24px -15px #173c7433`. These distinguish navigation and search from resource content. The selected calendar day uses an inset selection stroke, not ambient elevation.

Home circles are an intentional tactile exception: rest shadow `0 12px 24px -18px #0b245261`, hover shadow `inset 0 0 0 2px #8bb7f6, 0 14px 28px -18px #0b245280`. Search uses `inset 0 0 0 1px #a9cafa, 0 8px 28px -16px #0059d66b`. Elevation identifies manipulation and the active input, not floating resource cards.

## Shapes

Panels use the panel radius; controls are tighter, with separate navigation and segmented-control corners. Mobile header/search corners tighten to mobile-panel. Icon tiles vary with context (10–15px corners), dates use (14px). Home adds fully circular controls including Back, a rounded clipping field, and a white Search capsule whose radius preserves the circle-to-input transition. These are Home-specific, not a pill treatment for all components. Borders are generally (1px).

## Components

**Home launcher.** Course-first on `/`: centered Search plus course buttons, including courses without materials. The native semester filter defaults to All semesters and derives sorted values from courses. Its caption derives the visible count and labels it demo. A course button reveals a centered, noninteractive selected-course identity (`role="group"`), Materi Responsi and Study Club links, and Back at nonoverlapping positions. Only resource links navigate: `/responsi?course=id&semester=N` and `/study-clubs?type=Study+Club&course=id&semester=N`. Back preserves the filter and restores the course button's focus. Search ignores that filter, morphs into the all-semester combobox, and returns with Search focus and the filter intact. Shared `course-<id>` layout identities preserve satellite-to-center continuity; the identity is not a dead button. Motion dragControls uses an (8px) threshold, constrained inertia, and pointer-click suppression after drag. Recenter returns to origin and is disabled there. Each circle's `useTransform` scale responds independently to physical field-edge clearance, clamped to (0–1). Keyboard focus pans a control into view except restored focus and fixed Search Back; initial resource focus is Materi Responsi. CourseIcon is reused; focus uses a (3px) primary outline offset (5px). Search Back is (88px); suggestions cap at (220px) with separate space above Back.

Reader metadata uses user-requested pills to group period/exam and semester as distinct academic context, not decorative status badges. Contributor credits sit beneath that metadata in wrapping white pills with a profile icon identifying attribution; demo names are explicitly labeled placeholders. Back links use white pills to separate navigation from the background grid. Non-Home filter selects use a white surface, consistent chevron and 46px minimum height; supporting browsers also receive a styled native picker with selected-state highlighting and 44px options. Other browsers retain their native picker and the styled closed control. Home overrides select minimum height to 44px and block padding to 10px. Search labels and suggestions distinguish courses from materials, routing course results to hubs and material results to Readers. Existing non-Home color, type, spacing, and motion dials remain unchanged.

**Buttons and links.** Solid primary marks the main available action; pale secondary supports clearing filters, navigation, and calendar actions. Both buttons have a (46px) minimum height. Text links are lighter section/back navigation with (44px) minimum height and underline on hover. Whole cards and rows are links, not collections of nested buttons. Chevrons indicate opening a resource; arrows indicate search submission, section navigation, or an external action, not decorative emphasis.

**Cards and rows.** Compact course cards establish subjects; directory variants add descriptions and semester context. Summary rows share a single bordered panel with separators; event rows substitute a date tile. Hover uses a cool near-white surface and blue border where a border exists. Empty states reuse the panel, semantic icon, explanation, and optional recovery action. Loading skeletons and retryable errors elsewhere use `DataBoundary`; Home instead renders `useEducationData` pending/error/refetch/empty states inside the field. Root retains Search; a missing selected course retains Back and an explicit unavailable status.

**Fields and filters.** Search is a labeled input within a white containing surface; directory filters pair it with a native select and stack on phones. Home's small semester filter is a separate scoped native select, not a bubble. The schedule's segmented buttons are real filters with `aria-pressed`, not status badges. Focus uses a blue (3px) outline offset (4px); the hero input intentionally replaces its own outline with the containing field's border feedback. Disabled buttons use (0.5) opacity and not-allowed cursor.

**Navigation.** Four real destinations: Home, Courses, Study Clubs, Videos. Active/hover links use the pale nav surface. At 640px the labeled toggle exposes a dropdown; Escape closes it and returns focus to the toggle when focus was inside navigation. Selecting a mobile destination also closes it and restores toggle focus. Preserve the skip link and wrapping breadcrumbs.

**Semantic icons.** BookOpen groups courses; FileText marks summaries; CalendarDays marks sessions/periods; Video and Play mark recordings/playback. CodeXml, Database, Sigma, Box, Network, and Terminal distinguish programming, databases, mathematics, computer architecture, networks, and operating systems. Search, chevrons, arrows, Menu/X, clock, location, and graduation icons describe their adjacent controls or facts. Lucide strokes (usually 1.8 for tiles) support scanning; they are not decorative feature art. Icon-only controls have accessible labels; redundant resource icons are hidden from assistive technology.

**Reader and recordings.** The reader currently renders provisional Markdown through GFM, math/KaTeX, and syntax highlighting, with headings linked from its outline. This is not the future Tiptap document schema or an authoring contract. External content is URL-checked; tables, code, and formulas preserve readable local scrolling. Recording cards/player are conditional on supplied supported YouTube URLs. No recording URL has been supplied, so the shipped recording view is an honest empty state, not an invented video gallery.

Shared state feedback stays at (150–160ms, ease-out). Home uses public `motion/react` springs: Search shared-layout morph (stiffness 260, damping 32), focus pan (320/34), and recenter (300/34). Circle entry fades over (240ms); Search content fades over (180ms) after (220ms), then focuses the input. Reduced motion disables inertia and animated shared morph/fades; direct drag-driven edge scaling remains. The old Home resource reveals, boundary snapping, and scroll invitation are retired; shell logo/loading behavior is unchanged. See `docs/HOME-LAUNCHER.md` for scoped evidence and Motion+ provenance limits.

## Do's and Don'ts

### Do:
- Do preserve the approved light HIMTI reference, existing logo, and Plus Jakarta Sans commitment.
- Do keep demo academic content visibly labeled and show useful empty, loading, and error states.
- Do preserve keyboard focus, mobile 16px text inputs, the scoped Home select, and local reader overflow containment.

### Don't:
- Don't invent academic claims, identities, availability, or recording links to fill panels.
- Don't turn the provisional Markdown renderer into a promised Tiptap schema.
- Don't let the user-requested background grid compete with reading surfaces; Home motion stays scoped to launcher interactions, not retired resource groups.
