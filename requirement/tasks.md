\# Development Tasks — HIMTI Responsi



\## Team Rules



\- Each developer owns their assigned module and feature branch.

\- Do not modify files owned by another developer without approval.

\- Agree on API contracts, shared types, and data relationships before implementation.

\- If a shared file must be modified, coordinate with its owner first.

\- Developers must not push or merge directly into `main` or `dev`.

\- Every task must pass its acceptance criteria before submitting a Pull Request.

\- All backend developers must read and follow `HIMTISKILL.md`.



\---



\## Developer 1 — Public Responsi Website



\*\*Branch:\*\* `feature/responsi-public-website`



\*\*Scope:\*\* Student-facing website at `responsi.himtibinus.or.id`.



\### Tasks



\- \[ ] Build the public homepage.

&#x20; - Current exam period and published summaries.

&#x20; - Upcoming Study Club and Responsi events.

&#x20; - Recent available recordings.

\- \[ ] Build course listing and course detail pages.

\- \[ ] Build summary listing and summary reading pages.

\- \[ ] Implement summary search by title and filtering by course.

\- \[ ] Build the public event calendar and event detail pages.

\- \[ ] Display event schedules, locations, meeting links, registration links, and informational quotas when available.

\- \[ ] Embed YouTube recordings when available.

\- \[ ] Handle loading, empty, and error states.

\- \[ ] Integrate with the agreed summary and event API contracts.



\### Boundaries



\- Own public website pages and their page-specific components.

\- Do not modify Internal Tools pages, backend services, database schemas, or shared configurations.

\- Do not implement admin authentication or management features.

\- Use mock data until the relevant API contracts and endpoints are available.



\### Acceptance Criteria



\- Public pages are accessible without student login.

\- Only summaries allowed by the publishing and archive-retention rules are displayed.

\- Search, course filtering, event details, external links, and available recordings work correctly.

\- No Internal Tools functionality is modified.



\---



\## Developer 2 — Summary Management Backend



\*\*Branch:\*\* `feature/responsi-summary-backend`



\*\*Scope:\*\* Summary domain, academic structure, lifecycle, and version history.



\### Tasks



\- \[ ] Design and implement the summary and academic data models.

&#x20; - Academic Period with `startDate` and `endDate`.

&#x20; - Semester and exam type.

&#x20; - Course relationships.

&#x20; - Summary metadata, content, PIC, and contributors.

\- \[ ] Implement summary creation, retrieval, and editing APIs.

\- \[ ] Implement the Draft → Review → Published → Archived lifecycle.

\- \[ ] Enforce the mandatory Review step before initial publication.

\- \[ ] Enforce publishing, editing, reviewing, and archiving permissions using existing RBAC.

\- \[ ] Implement published-version snapshots and version history retrieval.

\- \[ ] Implement restoration of previous published versions.

\- \[ ] Implement manual archive and unarchive operations.

\- \[ ] Implement automatic archiving based on academic period end dates.

\- \[ ] Enforce public archive-retention rules in public summary queries.

\- \[ ] Implement PIC and contributor assignment using the agreed ownership model.



\### Boundaries



\- Own summary domain services, summary APIs, and summary-specific database migrations.

\- Do not implement public website pages, Internal Tools UI, event management, or a new authentication system.

\- Coordinate the Course and Academic Period interfaces with Developer 3 before finalizing shared relationships.

\- Do not edit shared database configuration or migration infrastructure without coordination.



\### Acceptance Criteria



\- Summary lifecycle transitions follow the PRD.

\- Unauthorized users cannot perform restricted actions.

\- Publishing creates a version snapshot.

\- Previous published versions can be viewed and restored by authorized users.

\- Historical summaries remain available internally, with public visibility governed by retention rules.



\---



\## Developer 3 — Events and Academic Calendar Backend



\*\*Branch:\*\* `feature/responsi-events-backend`



\*\*Scope:\*\* Study Club events, Responsi events, and recording metadata.



\### Tasks



\- \[ ] Design and implement the event data model.

\- \[ ] Support Study Club and Responsi event types.

\- \[ ] Associate each event with exactly one course.

\- \[ ] Implement event creation, retrieval, updating, and deletion according to existing project conventions.

\- \[ ] Support title, description, start/end time, location, and optional external URLs.

\- \[ ] Support meeting URLs, registration URLs, informational participant quotas, and YouTube recording URLs.

\- \[ ] Implement event listing and calendar query APIs.

\- \[ ] Support filtering events by course and date range.

\- \[ ] Provide upcoming-event and recent-recording queries required by the public homepage.

\- \[ ] Enforce existing Internal Tools authentication and RBAC for event management.

\- \[ ] Validate event dates, URLs, and required fields.

\- \[ ] Ensure public endpoints expose only the event information intended for public access.



\### Boundaries



\- Own event domain services, event APIs, and event-specific database migrations.

\- Do not implement public website pages, summary lifecycle services, or Internal Tools UI.

\- Reuse Developer 2's agreed Course model instead of creating a duplicate Course entity.

\- Coordinate public API response contracts with Developer 1 and management requirements with Developer 4.

\- Do not implement recurring events, registration processing, quota enforcement, or notifications.



\### Acceptance Criteria



\- Authorized users can manage individual Study Club and Responsi events.

\- Events are associated with one course.

\- Public users can view event details and available recordings without logging in.

\- External links and quotas are optional and informational where specified.

\- No recurring-event or internal registration functionality is introduced.



\---



\## Developer 4 — Internal Tools UI and Summary Editor



\*\*Branch:\*\* `feature/responsi-internal-ui`



\*\*Scope:\*\* Responsi management interface inside the existing HIMTI Internal Tools.



\### Tasks



\- \[ ] Integrate Responsi Management into the existing Internal Tools navigation and layout.

\- \[ ] Reuse existing authentication, user context, and RBAC conventions.

\- \[ ] Build summary listing, filtering, and detail views.

\- \[ ] Build summary creation and metadata editing forms.

\- \[ ] Integrate the Tiptap editor for structured summary content.

\- \[ ] Support headings, paragraphs, lists, links, quotes, code blocks, syntax highlighting, math rendering, and public image URLs.

\- \[ ] Integrate real-time collaboration, collaborator presence, and cursors using the agreed collaboration infrastructure.

\- \[ ] Build summary lifecycle controls for Draft, Review, Published, and Archived states.

\- \[ ] Build published-version history and restoration interfaces.

\- \[ ] Build PIC and contributor assignment interfaces.

\- \[ ] Build event listing, creation, and editing interfaces using Developer 3's API contracts.

\- \[ ] Integrate recording URLs, registration URLs, meeting URLs, and quota fields.

\- \[ ] Display permission-aware controls and handle API validation errors.



\### Boundaries



\- Own Responsi-specific Internal Tools pages and page-specific components.

\- Do not modify shared navigation, authentication, RBAC infrastructure, or global layouts without approval.

\- Do not implement backend services or database schemas.

\- Reuse existing shared components and templates instead of overwriting them.

\- Use mock data while waiting for APIs, then replace mocks with real integrations.

\- Do not independently invent a real-time collaboration backend; coordinate its integration requirements with Developer 2.



\### Acceptance Criteria



\- Responsi management is accessible through the existing Internal Tools.

\- Management controls respect the existing RBAC permissions.

\- Summary editing, lifecycle actions, version history, and event management are integrated with their respective APIs.

\- The Tiptap editor supports the required content types.

\- Collaboration works with the agreed backend infrastructure.



\---



\## Integration and Dependency Plan



\### Phase 1 — Before Coding



\- \[ ] Inspect the existing repository structure and `BACKEND-HIMTI.md`.

\- \[ ] Agree on the Course and Academic Period data contracts.

\- \[ ] Agree on API endpoints, request/response formats, and error conventions.

\- \[ ] Identify existing shared components and files that must not be changed.

\- \[ ] Confirm the real-time collaboration infrastructure and its ownership.

\- \[ ] Confirm the integration branch and Pull Request review process.



\### Phase 2 — Parallel Development



\- \[ ] Developer 1 builds public pages using mock data.

\- \[ ] Developer 2 builds summary APIs and summary-specific migrations.

\- \[ ] Developer 3 builds event APIs and event-specific migrations.

\- \[ ] Developer 4 builds Internal Tools pages using mock data.



\### Phase 3 — Integration



\- \[ ] Developer 1 integrates summary and event APIs.

\- \[ ] Developer 4 integrates summary management and event APIs.

\- \[ ] Test RBAC, publishing rules, archive retention, and version restoration.

\- \[ ] Test public access without login.

\- \[ ] Test real-time collaboration and editor features.

\- \[ ] Run regression tests to ensure existing Internal Tools features remain functional.



\### Phase 4 — Pull Requests



\- \[ ] Each developer pushes only to their own feature branch.

\- \[ ] Each developer opens a Pull Request against the designated integration branch.

\- \[ ] Review code quality, scope compliance, acceptance criteria, and test results.

\- \[ ] Resolve conflicts with the affected file owner.

\- \[ ] The designated maintainer reviews and merges approved Pull Requests.

\- \[ ] No developer pushes directly to `main` or `dev`.



\---



\## Important Scope Notes



\- Student authentication, internal event registration, recurring events, notifications, analytics, and direct media uploads are out of scope.

\- Exact RBAC keys, database schema, API contracts, and collaboration infrastructure must follow the existing project architecture and agreed technical design.

\- Public archive retention duration remains a team decision; do not hardcode the proposed two-academic-year duration until confirmed.

\- Post-publication editing and subsequent review behavior must follow the team's confirmed workflow.

\- Do not silently change the PRD or implement unapproved features.

