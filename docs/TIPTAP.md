# Tiptap summary reader

The public Responsi Reader now uses Tiptap 3 (`@tiptap/react`), not Markdown. This implements the user's request for a Notion-like document base without introducing admin editing into the public website.

## Data and rendering

- `Summary.content` is a Tiptap `JSONContent` document loaded on demand from the public summary endpoint. Production includes no bundled documents. Synthetic regression documents live only in `src/test/fixtures/summary-documents.ts` and are not imported by application code.
- `src/components/summary-content.tsx` owns the read-only renderer, loaded only when opening a summary. No toolbar, upload, editing, saving, collaboration, or paid Tiptap service is included.
- Schema: StarterKit paragraphs, h2/h3, lists, quotes, inline marks, links, rules, and hard breaks; TableKit row/cell/header plus an accessible read-only table wrapper; Image; CodeBlockLowlight; Mathematics `inlineMath`/`blockMath` with `attrs.latex`.
- Heading IDs are rendered through schema attributes, not patched into DOM after rendering. The outline reads level-two headings from the same JSON in document order. Changing summaries recreates the editor so stale content/anchors are not reused.
- Tables render a keyboard-focusable scroll region with a readable minimum width. Public readers do not need table resizing/node views. Syntax highlighting registers C++, SQL, JavaScript, and Python; other languages retain readable plain code.
- Image URLs and links allow only absolute HTTP(S), with lazy image loading and no-referrer policy. Links announce new-tab behavior via their title and use noopener/noreferrer. Math uses KaTeX with `trust: false`; raw HTML is not a content input.

## Dependencies

Removed React Markdown, remark-gfm, remark-math, rehype-highlight, and rehype-katex. Tiptap and its document engine replace that path; KaTeX remains for equations, and lowlight/highlight.js provide code highlighting. Reader engine/math chunks remain lazy so Home does not load them.

## Reader navigation refinement

The outline resolves clicked anchors against the actual clamped scroll destination, including CSS scroll padding and heading margins. This lets the last section remain selectable even when the document is too short to place it near the sticky header. Manual scrolling to the document bottom selects the final section; upward scrolling resumes position tracking. Regression coverage includes click and Enter on the final item, earlier anchors sharing the bottom scroll limit, and manual scrolling in both directions.

Shared header offsets now match on Home and all resource routes, with a stable scrollbar gutter preventing horizontal shifts on short pages. Route content enters with a 240ms fade and 8px rise; the shared header is not animated or remounted. Reduced motion disables the transition, and route changes reset scroll instantly rather than animating through the previous page's scroll position.

Verification: 23 component tests, lint, build, and browser checks at 1440/768/390/320px. Header x/y/width/height are compared across Home, Courses, Schedule, Videos, and back to Home. Final-section click/Enter, previous-section click, bottom/up scroll, reduced-motion disabling, and content-only animation are exercised.

## Integration boundary

The frontend transport follows [API-CONTRACT.md](../API-CONTRACT.md), including metadata-only catalog responses, separate detail retrieval, validation and 404/error handling. The backend must implement that contract and validate the exact node/mark schema before publishing. Unsupported blocks and old serialized content need an explicit migration/validation policy; the public reader does not guess conversions or expose write endpoints.

## Verification and delivery gate

The following is historical demo-phase proof, not a description of production data. Current production readiness and backend requirements are in README and API-CONTRACT.md; no demo labeling/content is shipped.

PASS: build, lint, 21 tests, and 16 real-browser route/width checks (four documents at 1440/768/390/320px). Browser checks exercise read-only typing, highlighted code, inline/block math, focusable table scrolling, outline navigation clear of the sticky header, and search/course-to-Reader navigation without console/page warnings or errors. Tests also cover switching documents and rejecting unsafe link/image protocols while allowing public image URLs.

The scope preserves public-only access, demo labeling, and all existing course/event relationships. No new imagery, statistics, or author identities were invented. The flat white document improves reading hierarchy; shared palette, focus, and contrast tokens remain. Desktop/mobile screenshots were inspected; no document-level overflow. Actual API integration and cross-browser/device certification are not claimed.
