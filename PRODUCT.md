# HIMTI Education

Current production data status: no demo records, fallback seeds or preview notices are shipped. Application data comes from the public API; catalog metadata and Reader documents load separately. [API-CONTRACT.md](API-CONTRACT.md) and [README.md](README.md) supersede historical demo/integration notes below. Test fixtures remain isolated from the production import graph. Backend deployment and live integration still require verification.

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users and purpose
Computer Science students preparing for Mid and Final Exams. Public visitors discover course summaries, Study Club and Responsi sessions, and event recordings without signing in.

## Source of truth
`HIMTI Responsi Web PRD.md`, read in full. The user owns the public Education Site and approved the supplied white-and-blue homepage reference, then authorized implementation.

## Stack
Follow the existing local `origin/olan` scaffold: React, TypeScript, Vite, React Router, TanStack Query, Axios, and Tailwind. No branch merge or switch is part of this work.

## Scope
Home, course discovery/detail, summary listing/Reader, Study Club and Responsi schedule/event details, and recordings. Explicitly labeled demo data until public APIs are agreed. Internal Tools, authentication, backend, database, collaboration, and deployment changes are outside this implementation.

Home implements the user-approved course-first revision of the [Motion Apple Watch interaction reference](https://motion.dev/examples/react-apple-watch-home-screen#preview). Root `/` shows centered Search and six demo course buttons. A small native semester select above the field defaults to All semesters and filters visible courses; it is not a navigation stage. Sorted demo semesters 1, 3, and 5 derive from the catalog, including courses without materials, not availability promises. The visible course count is data-derived and explicitly labeled demo. Selecting a course stays on `/`, places its noninteractive identity circle at the center, and surrounds it with Materi Responsi and Study Club links plus circular Back. Only resource links leave Home for `/responsi?course=id&semester=N` or `/study-clubs?type=Study+Club&course=id&semester=N`. Back preserves the filter and restores the course button's focus. Search works across all semesters regardless of the filter; Search Back preserves the filter and restores Search focus. The separate Courses directory is untouched.

Required behavior includes a smooth Search circle-to-input morph, shared course satellite-to-center continuity, independent circle shrinkage near physical field edges, and a clipped field below the title/description during dragging. Initial visuals stay full-size; compact screens use a taller staggered orbit and intentional page scrolling, not a promise that every option fits the first viewport. Keyboard/resource focus, reduced motion, constrained inertial drag and Recenter remain. Root data states keep Search; an unavailable selected course keeps Back and a clear status. Motion 14.11.1 is retained with no new dependency, asset, or backend; public `motion/react` APIs independently implement the interaction, not gated premium Motion+ source. The latest increment changes no other public page. Preserve the HIMTI shell, Readers, contributors, and recording behavior. Fresh independent review disposition: SHIP, zero material fixes. See `docs/HOME-LAUNCHER.md` for attributed acceptance evidence and limits.

## Open decisions
API contracts, current exam selection, archive retention, post-publication editing, public contributor attribution, and named developer ownership remain unconfirmed. Do not invent endpoints or hardcode a retention duration.

## Brand commitments
HIMTI blue/navy, Plus Jakarta Sans, the existing HIMTI logo, and the user's supplied visual reference. Light surfaces support reading and studying. Keep the academic resource hierarchy; calendar includes both session types.

## Evidence
Local reference repository: `E:/Education-Frontend/HIMTI-Internal-Frontend`. No real academic content or recording URLs have been supplied. Mock academic content must stay visibly labeled; do not fabricate public video links, quotas, identities, or availability claims.
