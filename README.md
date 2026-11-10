# HIMTI Education Frontend

Public Responsi frontend for HIMTI BINUS. Implements the approved white-and-blue reference with course discovery, summary reading, Study Club/Responsi schedules, and recording discovery.

## Development

Use Node.js 22.12+ (or a compatible newer LTS).

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The work is in the existing `dev` worktree; no branches were switched or merged.

```sh
npm run build
npm run lint
npm test
```

## Public routes

| Route | Experience |
| --- | --- |
| `/` | Home and summary-title search |
| `/courses` | Course directory with search and semester filtering |
| `/courses/:courseId` | Course summaries, sessions, and recordings |
| `/responsi` | Summary-title search and course filtering |
| `/responsi/:summaryId` | Read-only summary with code, math, and table of contents |
| `/study-clubs` | Calendar for both Study Club and Responsi events |
| `/study-clubs/:eventId` | Event details and optional external actions |
| `/videos` | Recording discovery and YouTube embed when a URL exists |

Calendar month, event/course filters, and summary queries are shareable URL parameters. Event times display in Asia/Jakarta (WIB). Try `/study-clubs?month=2026-11` for the demonstration schedule.

## Demo data and integration boundary

This is a frontend preview, not a connected publication system. All academic content and schedules are explicitly labeled demo. No real recording, registration, or meeting URLs were provided, so those controls are omitted rather than fabricated. Valid recording and external-link wiring is covered by fixture-based tests.

`src/api/education/queries.ts` is the replacement point for the demo retrieval; fixtures and provisional display types are in `src/data/demo.ts`. Public API endpoints and response formats are deliberately not invented. Before integration, agree on:

- Course/academic-period identifiers, current exam context, pagination and query contracts.
- Public summary visibility, direct-resource access, publication freshness, and archive retention enforced by the backend.
- Match the backend's Tiptap JSON and extension schema to the public reader. The current reader uses Tiptap 3 with read-only StarterKit blocks, tables, public images, highlighted code, and inline/block math. See `docs/TIPTAP.md`; there is no public authoring or save workflow.
- Public event visibility, recording availability, and optional external-link fields.

No authentication, management UI, backend, database schema, storage, or collaboration infrastructure is included. No fixed public archive duration is assumed.

## Structure

- `src/pages`: route-level screens and supporting compositions.
- `src/components`: shared resources, public layout, data boundary, and lazy summary renderer.
- `src/api`: TanStack Query data retrieval.
- `src/config`: Query configuration.
- `src/data`: labeled demo fixtures and provisional types.
- `src/utils`: date display helpers.

Brand asset provenance is in `docs/ASSETS.md`. Product context and the approved visual direction are in `PRODUCT.md` and `.impeccable/surfaces/education.md`.
