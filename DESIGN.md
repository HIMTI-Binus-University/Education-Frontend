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
rounded:
  inline: "4px"
  icon-button: "8px"
  control: "9px"
  nav: "10px"
  segmented: "11px"
  mobile-panel: "13px"
  panel: "16px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "40px"
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
---

# Design System: HIMTI Education

## Overview

**Creative North Star: "HIMTI resource-first reference"**

The user's pinned screenshot is the visual authority: HIMTI blue and navy, white panels, pale blue surroundings, and Plus Jakarta Sans. The generous search-led introduction gives way to denser academic cards, summary rows, and schedules. This records the built system, not a new visual direction.

Light mode is intentional to match that reference and support studying. ENERGY 2 / RHYTHM 2 / MOTION 2: the user's subsequent search-first request adds a branded opening and scoped resource reveals. See `docs/MOTION.md` for timing, purpose, accessibility, and verification.

**Key Characteristics:**
- Blue actions, navy headings, muted academic metadata.
- Rounded white panels, semantic icon tiles, and linked resource rows.
- Spacious discovery, denser reading and scheduling.

Ground truth: `src/main.tsx`, `src/index.css`, `tailwind.config.js`, and the shared components. Product commitments live in `PRODUCT.md`; surface composition lives in `.impeccable/surfaces/education.md`. The unchanged local HIMTI logo is `public/logo-himti.png`, sourced from the Internal repository with embedded provenance; see `docs/ASSETS.md`.

## Colors

### Primary
Primary blue identifies actionable controls, links, focus, and selection. Its darker hover variant signals interaction; it is not a second brand accent.

### Neutral
Ink carries headings and control text; muted carries supporting context. Surface and background separate white panels from the cool page. Line supplies restrained boundaries; pale and nav-active identify selected or supporting areas. The source also uses soft blue gradients behind the page and icon tiles to reproduce the reference, not a decorative grid.

Code colors are syntax roles, not additional brand accents. The final keyword, built-in, comment, and name overrides are recorded above against code-bg; other syntax styling comes from the imported GitHub highlight stylesheet. Sidecar tonal ramps are synthesized panel metadata, not implemented palette steps or additional theme modes.

**The Academic Context Rule.** Keep course, exam, period, and session metadata subordinate but legible; do not replace it with promotional badges.

## Typography

Plus Jakarta Sans with system-ui/sans-serif fallback is the explicit HIMTI brand commitment, not an interchangeable default. Display, headings, body, and controls share the family. Code and math use their renderer-provided typography.

The frontmatter records the original display role, page heading, section title, reader body, and button label roles. At the user's request, Home again displays its original headline and description above search, while retaining the full-height opening. Resource titles use (15px, 650, 1.5); supporting rows use (14px, 1.7). Reader headings use (24px, 700, 1.45). Metadata generally uses (11–13px), not a new display role. The Tiptap Reader is a read-only, Notion-like block document on a flat white surface, with a persistent desktop outline; tables, code, and formulas scroll locally. It retains HIMTI typography rather than copying Notion's brand.

At 900px the hero becomes (54px); at 640px it uses `clamp(35px, 8.8vw, 52px)`. Mobile page titles use (30px), course detail titles (26px), section titles (22px), and reader body (13px, 1.95). Mobile inputs and selects remain (16px).

## Layout

Paired schedule/recording sections share header and panel rows via CSS subgrid above 900px so both panel tops and heights align even when descriptions wrap differently. Stacked layouts keep their natural content heights. Browser measurements verify equal tops/heights at 1440/1024px and no overflow at 390/320px.

Main containers use `min(1160px, calc(100% - 80px))`; at 640px gutters reduce to (20px) per side. The sticky glass header caps at (1080px), offset (24px) on every desktop route and (20px) on mobile. A stable scrollbar gutter keeps its horizontal position unchanged between long and short routes. Desktop navigation aligns right; mobile retains the menu toggle. Search caps at (770px) within Home's full-height hero. Anchor offsets leave room for the sticky header. Route content enters with a 240ms fade and 8px rise to signal navigation without moving the shared header; reduced motion removes this effect.

Home courses use four columns, two at 900px and below, including phones. Directory cards use three, then two at 900px, one at 640px. Home's schedule/recording pair stacks at 900px. Schedule calendar/agenda stacks at 1150px; event detail stacks at 900px. Video cards become one column at 640px.

The reader has a (220px) sticky outline and flexible article with (40px) gap. At 900px the outline becomes an inline panel above the article. Tables retain a (560px) minimum width inside a keyboard-focusable local scroll region. Code and display math scroll locally, never widening the page.

Spacing is contextual: desktop home sections separate by (62px), mobile by (38px); grids and controls use the smaller recorded steps. Do not force a single gap onto every composition.

## Elevation & Depth

The user's supplied grid reference supersedes the earlier no-grid direction: a static 48px grid in low-opacity HIMTI blue adds a graph-paper academic motif behind the shared shell. The reader stays solid white to protect readability. The outline uses pale blue and bold primary text to identify the section nearest the upper reading area, with `aria-current="location"` exposing the same state. No new motion is introduced; existing ENERGY 1 / RHYTHM 2 / MOTION 2 direction is retained.

Borders and pale tonal surfaces carry ordinary hierarchy; cards do not float on shadows. The header uses `0 8px 30px -16px #173c742b`; hero search uses `0 9px 25px -15px #244f8c45`; the expanded mobile navigation uses `0 14px 24px -15px #173c7433`. These distinguish navigation and search from resource content. The selected calendar day uses an inset selection stroke, not ambient elevation.

## Shapes

Panels use the panel radius; controls are tighter, with separate navigation and segmented-control corners. Mobile header/search corners tighten to mobile-panel. Icon tiles vary with context (10–15px corners), dates use (14px), and circular forms are reserved for search submission and selected calendar dates. Borders are generally (1px).

## Components

Reader metadata uses user-requested pills to group period/exam and semester as distinct academic context, not decorative status badges. Contributor credits sit beneath that metadata in wrapping white pills with a profile icon identifying attribution; demo names are explicitly labeled placeholders. Back links use white pills to separate navigation from the background grid. Filter selects use a white surface, consistent chevron and 46px minimum height; supporting browsers also receive a styled native picker with selected-state highlighting and 44px options. Other browsers retain their native picker and the styled closed control. Search labels and suggestions distinguish courses from materials, routing course results to hubs and material results to Readers. Existing color, type, spacing, and motion dials remain unchanged.

**Buttons and links.** Solid primary marks the main available action; pale secondary supports clearing filters, navigation, and calendar actions. Both buttons have a (46px) minimum height. Text links are lighter section/back navigation with (44px) minimum height and underline on hover. Whole cards and rows are links, not collections of nested buttons. Chevrons indicate opening a resource; arrows indicate search submission, section navigation, or an external action, not decorative emphasis.

**Cards and rows.** Compact course cards establish subjects; directory variants add descriptions and semester context. Summary rows share a single bordered panel with separators; event rows substitute a date tile. Hover uses a cool near-white surface and blue border where a border exists. Empty states reuse the panel, semantic icon, explanation, and optional recovery action. Loading skeletons and retryable errors are handled by `DataBoundary`.

**Fields and filters.** Search is a labeled input within a white containing surface; directory filters pair it with a native select and stack on phones. The schedule's segmented buttons are real filters with `aria-pressed`, not status badges. Focus uses a blue (3px) outline offset (4px); the hero input intentionally replaces its own outline with the containing field's border feedback. Disabled buttons use (0.5) opacity and not-allowed cursor.

**Navigation.** Four real destinations: Home, Courses, Study Clubs, Videos. Active/hover links use the pale nav surface. At 640px the labeled toggle exposes a dropdown; Escape closes it and returns focus to the toggle when focus was inside navigation. Selecting a mobile destination also closes it and restores toggle focus. Preserve the skip link and wrapping breadcrumbs.

**Semantic icons.** BookOpen groups courses; FileText marks summaries; CalendarDays marks sessions/periods; Video and Play mark recordings/playback. CodeXml, Database, Sigma, Box, Network, and Terminal distinguish programming, databases, mathematics, computer architecture, networks, and operating systems. Search, chevrons, arrows, Menu/X, clock, location, and graduation icons describe their adjacent controls or facts. Lucide strokes (usually 1.8 for tiles) support scanning; they are not decorative feature art. Icon-only controls have accessible labels; redundant resource icons are hidden from assistive technology.

**Reader and recordings.** The reader currently renders provisional Markdown through GFM, math/KaTeX, and syntax highlighting, with headings linked from its outline. This is not the future Tiptap document schema or an authoring contract. External content is URL-checked; tables, code, and formulas preserve readable local scrolling. Recording cards/player are conditional on supplied supported YouTube URLs. No recording URL has been supplied, so the shipped recording view is an honest empty state, not an invented video gallery.

State feedback stays at (150–160ms, ease-out). Home additionally uses native one-time group reveals, proximity snap at the resource boundary, and a finite scroll invitation. The opening logo follows the Internal Frontend movement; pending data uses its loading spin. Reduced motion removes these effects and snapping, and uses automatic scrolling. `docs/MOTION.md` records the updated contract.

## Do's and Don'ts

### Do:
- Do preserve the approved light HIMTI reference, existing logo, and Plus Jakarta Sans commitment.
- Do keep demo academic content visibly labeled and show useful empty, loading, and error states.
- Do preserve keyboard focus, mobile 16px fields, and local reader overflow containment.

### Don't:
- Don't invent academic claims, identities, availability, or recording links to fill panels.
- Don't turn the provisional Markdown renderer into a promised Tiptap schema.
- Don't let the user-requested background grid compete with reading surfaces; keep the requested reveals scoped to Home resource groups.
