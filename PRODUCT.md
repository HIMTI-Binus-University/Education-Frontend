# HIMTI Education

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

## Open decisions
API contracts, current exam selection, archive retention, post-publication editing, public contributor attribution, and named developer ownership remain unconfirmed. Do not invent endpoints or hardcode a retention duration.

## Brand commitments
HIMTI blue/navy, Plus Jakarta Sans, the existing HIMTI logo, and the user's supplied visual reference. Light surfaces support reading and studying. Keep the academic resource hierarchy; calendar includes both session types.

## Evidence
Local reference repository: `E:/Education-Frontend/HIMTI-Internal-Frontend`. No real academic content or recording URLs have been supplied. Mock academic content must stay visibly labeled; do not fabricate public video links, quotas, identities, or availability claims.
