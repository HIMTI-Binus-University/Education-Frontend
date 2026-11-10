# Frontend preview verification

## Scope
Public Education frontend in the existing `dev` worktree. No branch switches, merges, commits, pushes, backend changes, or Internal Tools changes. Academic content and schedules are explicitly labeled demo. API integration and publication/retention enforcement are not implemented or claimed.

## Automated checks
- PASS: `npm run build`, TypeScript and production Vite build, with lazy Reader math/code chunks.
- PASS: `npm run lint`, no warnings/errors.
- PASS: `npm test`, 15 tests across application flows and data-boundary states.
- PASS: dependency installation audit reports zero vulnerabilities after updating KaTeX and deduplicating its transitive copies through an override.
- PASS: brand provenance scan, one raster and zero missing origins.

## Browser evidence
Headless installed Microsoft Edge, using existing Playwright tooling; no browser installation. Eight routes checked at 320, 390, 768, and 1440 CSS pixels. All 32 checks showed no document-level horizontal overflow or runtime page errors. Code, formulas, and tables retain local scrolling.

Two bounded screenshot rounds: desktop/mobile captures for Home, course directory, course detail, summary listing, Reader, calendar, event detail, and Videos. All sixteen final captures reviewed as valid. Independent review scored its three requested fixes resolved: readable mobile tables, Escape focus restoration, and 16px mobile form text. This is not a pixel-perfect comparison or a full accessibility certification.

Local evidence (gitignored): `.impeccable/review/browser-results.json`, `interaction-results.json`, and route screenshots.

## Interaction evidence
- Home search submits to title-filtered summary results; a result opens the Reader.
- Every header/footer destination opens its corresponding public route.
- Home view-all links open courses, summaries, calendar, and videos.
- Course search and semester selection combine; Clear filters restores the directory.
- All six course cards open their own hub; resource jumps reach summaries, sessions, and recordings.
- Summary course/title filters combine; Clear filters recovers from no results.
- Reader renders highlighted code and math; TOC links reach headings; Back to course returns to the matching course.
- Calendar previous/next month, event type, course, date selection, and Show month update displayed sessions.
- Event links open details; course-materials links preserve the course relationship.
- Mobile menu opens/closes, Escape from a focused navigation link returns focus to the toggle, and navigation closes the menu.
- Videos course filter updates the URL; the honest empty state links to the schedule.
- Component tests verify loading announcements, retrieval errors/retry, empty data, and unknown-resource handling.
- Fixture-only tests verify valid YouTube embed construction, event/course relationships, informational quota, optional external actions, and rejection of unsafe URLs. Live YouTube playback and external registration were not tested because no real URLs were supplied.

## Design delivery gate
- PASS, content honesty (R-17/18/23/28/36/38): existing logo with origin metadata; demo academic data clearly labeled; no invented recording URLs, testimonials, statistics, or FAQ.
- PASS, navigation and controls (R-24/26/32/35): interaction checks above; native links/buttons/selects, visible focus, Escape restoration, and a skip link.
- PASS, data states (R-27): shared loading/error/retry boundary and page-specific empty states, exercised by tests.
- PASS, reflow (R-03): 32 route/viewport checks; tables and code scroll inside their own containers rather than expanding the document.
- PASS, tested palette contrast (R-25): muted text on pale blue 5.09:1, input placeholder on white 4.72:1, primary text on pale blue 5.52:1. Rendered demo code tokens have minimum contrast 5.81:1 after darkening syntax colors. This is a tested-palette claim, not a WCAG certification.
- PASS, theme and direction (R-34/37): light-only reference-led implementation; no untested alternate theme. ENERGY 2 / RHYTHM 2 / MOTION 1.
- PASS, implementation hygiene (R-02/33): authored interface copy has no em dashes; source was edited directly, not patched by rewrite scripts. Formatting used Prettier.
- PASS, purpose and consistency: blue/navy and Plus Jakarta Sans preserve HIMTI branding; cards identify courses; rows scan resource metadata; the Reader prioritizes comprehension; the calendar connects dates to an agenda. Shadows are limited to navigation/search emphasis. No decorative motion or new illustrations.
- PASS, bounded review: two visual rounds, three independent material fixes resolved. The mechanical detector's two font warnings are acknowledged, not silently rewritten: Plus Jakarta Sans is an explicitly inherited HIMTI brand decision.

## Before production
Agree on public API contracts, current exam selection, Tiptap serialization/extensions, server-side visibility/retention, and real media/event links. Test those integrations, cache freshness, live external actions, and target Safari/Firefox devices before release.
