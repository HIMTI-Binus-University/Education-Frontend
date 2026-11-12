# HIMTI Education Frontend

Public Responsi frontend for HIMTI BINUS. Implements the approved white-and-blue reference with course discovery, summary reading, Study Club/Responsi schedules, and recording discovery.

## Development

Use Node.js 22.12+ (or a compatible newer LTS).

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` if the API prefix needs changing, then open `http://localhost:3000`. The default is same-origin `/api/public`. Vite exposes `VITE_*` values to the browser; never put secrets there.

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

Calendar month, event/course filters, and summary queries are shareable URL parameters. Event dates and times display in Asia/Jakarta (WIB).

## Production data and deployment

The app requests real public API data. There is **no bundled demo catalog, document, event, contributor, or fallback seed**. Synthetic data exists only in test fixtures and is not imported by production code. An empty catalog renders empty states; API/network/schema errors render retry states instead of fabricated content.

The implemented frontend contract is [API-CONTRACT.md](API-CONTRACT.md):

- `GET /api/public/catalog`: complete public metadata snapshot; no summary bodies.
- `GET /api/public/summaries/{id}`: read-only Tiptap document, loaded only in the Reader.
- API transport has cancellation, a 15-second timeout, bounded retries and runtime response validation. The backend must still enforce publication/retention rules and validate content before publishing.
- Frontend cache becomes stale after 60 seconds and refreshes on mount/window focus. No realtime polling is claimed.

Build with `npm run build` and deploy `dist/` to a static HTTPS host. Set the API prefix **at build time**. Configure SPA fallbacks for frontend routes, excluding `/api/*`; never return `index.html` for an API request. Revalidate HTML, cache hashed assets immutably, and configure CORS/security headers/CSP for the actual infrastructure. See the deployment checklist in the contract.

No authentication, management UI, backend, database schema, storage, or collaboration infrastructure is included. The backend is not supplied or deployed by this repository. **Go-live requires both endpoints and a real-backend smoke test**; without them the frontend correctly shows an API error. No public archive duration is assumed.

## Structure

- `src/pages`: route-level screens and supporting compositions.
- `src/components`: shared resources, public layout, data boundary, and lazy summary renderer.
- `src/api`: validated public API transport and TanStack Query retrieval.
- `src/config`: Query configuration.
- `src/data`: public domain types and search/URL helpers, no academic records.
- `src/test/fixtures`: synthetic test-only records/documents, excluded from the application import graph.
- `src/utils`: date display helpers.

Brand asset provenance is in `docs/ASSETS.md`. Product context and the approved visual direction are in `PRODUCT.md` and `.impeccable/surfaces/education.md`.
