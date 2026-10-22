# **HIMTI Responsi PRD**

Status: Draft  
Scope: Responsi public website and Responsi management features inside HIMTI Internal Tools

# 1\. Executive Summary

Responsi is a HIMTI academic program that helps Computer Science students prepare for exams through written summaries, Study Club sessions, and Responsi sessions. Today, summary content is mainly managed through Notion, while schedules and recordings are distributed separately.  
This project will turn Responsi into a dedicated academic platform. Students will use responsi.himtibinus.or.id to read current exam summaries, view upcoming Study Club and Responsi schedules, and watch available session recordings. Content management will be added as a new module inside the existing HIMTI Internal Tools and will reuse its authentication and RBAC system.  
The first version focuses on content management and access. It does not attempt to become a full LMS.

# 2\. Background and Problem

Responsi publishes academic summaries for Computer Science students before Mid Exam and Final Exam periods. A new summary is created for each relevant academic period even when the material is similar to previous years. This keeps the content aligned with the current course delivery and ensures activists actively prepare the material instead of simply copying old summaries.  
The current Notion-based workflow works for writing content, but it creates several limitations for long-term management:

* Summary content, schedules, and recordings are not presented as one connected student experience.  
* There is no dedicated academic structure for courses, exam periods, and yearly summary archives.  
* Content ownership, review, publishing, and permissions depend on manual coordination.  
* Old content needs to be preserved internally without confusing students with outdated material.  
* Responsi does not yet have a dedicated public home for current academic resources.

# 3\. Product Goals

* Provide one public website for current Responsi academic resources.  
* Provide a Notion-like editor for writing structured academic summaries.  
* Allow multiple authorized activists to edit the same summary in real time.  
* Introduce a clear Draft → Review → Published → Archived content lifecycle.  
* Organize summaries by course, academic period, semester, and exam type.  
* Provide a calendar for Study Club and Responsi sessions.  
* Connect completed sessions with their YouTube recordings when available.  
* Keep old summaries available to authorized Internal Tools users while hiding them from the public website.  
* Reuse the existing HIMTI Internal Tools user, authentication, and RBAC foundation.

# 4\. Non-Goals for the First Version

* Student accounts or student authentication.  
* Indefinite public access to all archived summaries.  
* A built-in event registration system.  
* Real-time participant count or quota tracking.  
* Recurring calendar events.  
* Automatic email, WhatsApp, LINE, or other notifications.  
* Product analytics or learning analytics.  
* Direct file or image storage for summary attachments.  
* A full LMS with assignments, grades, attendance, or student progress tracking.

# 5\. Target Users and Access

## 5.1 Students

The public Responsi website is accessible without login. The primary audience is Computer Science students, but the website itself is public.  
Public users can access current published summaries, current and upcoming event information, and recordings that have been attached to published events.  
Archived summaries may remain publicly accessible for a limited retention period. The exact retention duration is still to be confirmed; the current working suggestion is up to two previous academic years. Older archived summaries remain available only to authorized Internal Tools users.

## 5.2 HIMTI Internal Users

Activists and other authorized HIMTI users manage Responsi through the existing HIMTI Internal Tools. Access to management actions follows the existing RBAC model.  
Permissions should remain granular so different users can be allowed to create, edit, review, publish, archive, restore, or manage events without relying on hardcoded organizational positions.

# 6\. Product Structure

## 6.1 Public Responsi Website

responsi.himtibinus.or.id is the student facing application. Its purpose is content consumption and discovery, not content administration.

* Home page with current exam summaries, upcoming events, and recent available recordings.  
* Course pages that bring together summaries, event information, and recordings for a course.  
* Summary reading pages.  
* Calendar and event detail pages.  
* Recording embeds where a YouTube URL is available.  
* Search by summary title and filter by course.

## 6.2 HIMTI Internal Tools

Responsi management is implemented as an additional feature/module inside the existing HIMTI Internal Tools.

* Manage academic periods and courses needed by Responsi.  
* Create and edit summaries.  
* Collaborate on summaries in real time.  
* Move summaries through review and publishing states.  
* View version history and restore a previous published version when needed.  
* Archive and unarchive summaries.  
* Create and manage Study Club and Responsi events.  
* Add registration links, meeting links, quotas, and YouTube recording URLs.

# 7\. Academic Structure

The content model should preserve the academic context of every summary instead of treating each summary as an independent document.

* Academic Period: represents the relevant academic year/period and contains startDate and endDate.  
* Semester: represented by the student semester number, with odd-numbered semesters treated as Odd and even-numbered semesters treated as Even.  
* Course: the central academic entity used to connect summaries, events, and recordings.  
* Exam Type: Mid Exam or Final Exam.

A course can therefore have different summaries for different academic periods and exam types. Previous summaries remain separate records rather than being overwritten.

# 8\. Summary Management

## 8.1 Summary Creation

Authorized Internal Tools users can create a new summary for a course. A summary should at minimum be associated with a course, academic period, semester, exam type, title, and lifecycle status.  
A new summary should be created for each relevant academic period even when older material is similar.

## 8.2 Summary Lifecycle

The intended lifecycle is:  
Draft → Review → Published → Archived

* Draft: summary is being prepared and is not publicly visible.  
* Review: summary is ready to be reviewed before publication.  
* Published: summary is visible on the public Responsi website.  
* Archived: summary is treated as historical content. It may remain publicly accessible while it is still inside the configured public archive retention period, and remains available internally after that period ends.

Review is mandatory before the initial publication. Publishing can only be performed by a user with the required permission.

## 8.3 Archive Behavior

Summaries are archived automatically when their academic period passes its endDate. Authorized users can also archive a summary manually.  
An archived summary can be unarchived or restored if it was archived accidentally or needs to become active again. Archiving does not necessarily remove it from the public website immediately: archived summaries remain publicly accessible while they are inside the configured retention period. After that retention period, they are hidden from the public website but remain available inside Internal Tools.

# 9\. Summary Editor and Collaboration

The summary editor will use Tiptap and should provide a Notion-like writing experience suitable for technical academic content.

* Multiple authorized editors can work on the same summary in real time.  
* Editors should be able to see collaborator presence and cursors.  
* Editing access is controlled through Internal Tools permissions.  
* For the first version, any user with the required summary edit permission may edit any summary.  
* The editor should support common Markdown-style content such as headings, paragraphs, lists, links, quotes, and code blocks.  
* Syntax highlighting should be supported for code examples.  
* LaTeX/math rendering should be supported for formulas and mathematical content.  
* Images should use a public image URL rather than being uploaded to project storage in the first version.  
* General file attachments are not required in the first version.

# 10\. Publishing and Version History

Version history exists for internal recovery and audit purposes. It is not a student-facing feature.

* A version snapshot is created when a summary is explicitly published.  
* Authorized users can view previous published versions inside Internal Tools.  
* Authorized users can restore a previous version as a fallback.  
* The public website does not show version numbers, change history, restore controls, or version metadata.

Editors may continue editing a summary after it has been published. The exact behavior between live post-publication edits and the mandatory review step for a later publish should be confirmed during team review so the workflow is unambiguous.

# 11\. Summary Ownership and Contributors

Proposed decision for team confirmation:

* Each summary has one required PIC.  
* Each summary may have multiple optional contributors.  
* PIC and contributor information represents responsibility and attribution, not authorization.  
* RBAC remains the source of truth for whether a user can edit, review, publish, or manage a summary.  
* Users with the appropriate summary management permission can assign or change the PIC and contributors.

This keeps accountability separate from access control and avoids automatically granting permissions based on assignment.

# 12\. Calendar and Events

The public website includes a calendar inspired by the scheduling experience students already recognize from learning platforms. Events are created and managed through Internal Tools.  
The first version supports two event types:

* Study Club  
* Responsi

Each event is created individually. Recurring event rules such as “every Friday” are not required in the first version.

## 12.1 Event Information

An event should support the following information:

* Title  
* Event type  
* Related course  
* Description  
* Start date and time  
* End date and time  
* Location  
* Online meeting URL when available  
* Registration URL when registration is required  
* Participant quota when relevant  
* YouTube recording URL when available after the session

Events are course-specific. General multi-course exam preparation events are not part of the current requirement.

## 12.2 Registration and Quota

Responsi will not manage registrations internally in the first version.

* If registration is required, the event can contain an external registration URL such as a Google Form.  
* The public website displays a registration action that redirects the student to that external URL.  
* Participant quota is informational only, for example “Capacity: 50 participants”.  
* There is no real-time registered participant count or quota enforcement.

# 13\. Recordings

Recordings are normally created from completed Study Club or Responsi sessions, such as a Zoom recording that is later uploaded to YouTube.

* Internal Tools stores only the YouTube URL; the platform does not upload or host the video file.  
* When a YouTube URL is available, the recording is embedded on the public Responsi website.  
* Recordings should remain connected to the event and its related course.  
* An event may exist without a recording.

# 14\. Homepage and Discovery

The homepage should prioritize what is useful to students now rather than exposing the entire content archive.  
Recommended content order:

* Current exam period and currently available summaries.  
* Upcoming Study Club and Responsi events.  
* Recent recordings that are available to watch.

Students should be able to search summaries by title and filter results by course. Full-text search inside summary content is not required in the first version.

# 15\. Course Experience

Course should be treated as the main connection point between academic resources.  
A course page may surface:

* The current Mid Exam or Final Exam summary when published.  
* Upcoming Study Club and Responsi sessions for that course.  
* Previous session recordings that are still relevant and public.

Archived summaries that are still inside the public retention period may be accessible from the public course experience. Older archived summaries outside that period are excluded from the public website.

# 16\. Internal Tools Integration and RBAC

Responsi management must reuse the existing HIMTI Internal Tools authentication, users, and RBAC implementation rather than introducing a second admin authentication system.  
Permissions should be granular and aligned with the existing RBAC conventions. Exact permission keys are a technical design decision, but the product needs separate control over actions such as:

* Create summary  
* Edit summary  
* Review summary  
* Publish summary  
* Archive and unarchive summary  
* View and restore summary versions  
* Assign summary PIC/contributors  
* Create and edit events  
* Manage event recording and external links

The exact backend service boundaries, database design, permission key names, collaboration transport, and deployment architecture belong in a separate technical design document.

# 17\. Core User Flows

## 17.1 Student Reads a Summary

Open Responsi → view current summaries or choose a course → open a published summary → read the content without login.

## 17.2 Student Finds an Event

Open Responsi → open calendar or course page → select a Study Club or Responsi event → view schedule, location, meeting link, registration link, and quota when available.

## 17.3 Student Watches a Recording

Open a course or completed event → choose an available recording → watch the embedded YouTube video.

## 17.4 Activist Creates and Publishes a Summary

Open Internal Tools → Responsi Management → create summary → select academic context and course → assign PIC/contributors when applicable → collaborate in the editor → move to Review → review the content → publish → summary becomes publicly visible.

## 17.5 Authorized User Creates an Event

Open Internal Tools → Responsi Management → create event → select event type and course → enter schedule and location → optionally add meeting URL, registration URL, and quota → save → event appears on the public calendar.

## 17.6 Authorized User Adds a Recording

Open the completed event in Internal Tools → add the YouTube URL → save → the public event/course page exposes the embedded recording.

# 18\. Functional Acceptance Criteria

## 18.1 Public Website

* A visitor can open the website and read a current published summary without logging in.  
* A visitor can access archived summaries that are still inside the configured public retention period, but cannot access older archived summaries after that retention period ends.  
* A visitor can view upcoming Study Club and Responsi events.  
* A visitor can open external meeting and registration links when provided.  
* A visitor can see informational participant quota when provided.  
* A visitor can watch an embedded YouTube recording when an event has a recording URL.  
* A visitor can search summaries by title and filter them by course.

## 18.2 Summary Management

* An authorized user can create and edit a summary from Internal Tools.  
* Multiple authorized users can collaborate on the same summary in real time.  
* A summary cannot be initially published before entering Review.  
* Only a user with publishing permission can publish.  
* Publishing creates an internal version snapshot.  
* An authorized user can view and restore a previous published version.  
* A summary can be archived automatically after the academic period endDate.  
* An authorized user can archive and unarchive a summary manually.

## 18.3 Editor

* The editor supports structured text, links, code blocks, syntax highlighting, and math content.  
* The editor supports public image URLs.  
* The first version does not require direct file or image uploads.  
* Collaborators can see real-time collaborator presence/cursors.

## 18.4 Events

* An authorized user can create a Study Club or Responsi event.  
* Each event is associated with one course.  
* Events support start/end time, location, description, and optional external URLs.  
* Events are created individually and do not support recurring schedules in the first version.  
* An event can exist without registration, quota, online meeting URL, or recording.

# 19\. Out of Scope / Future Considerations

* Student accounts, bookmarks, reading progress, or personalization.  
* Full-text search inside summary content.  
* Internal event registration and registration database.  
* Real-time quota availability.  
* Recurring events.  
* Push/email/chat notifications.  
* Analytics dashboards.  
* Direct media/file uploads.  
* Unlimited public archive browsing beyond the configured retention period.  
* Quiz, assignment, grading, or other LMS capabilities.

# 20\. Items for Team Review

The core product scope is considered defined. The following items should still be explicitly confirmed during the next team review:

* Confirm the proposed one PIC plus multiple-contributor ownership model.  
* Confirm who operationally moves a summary into Review, even though permissions will ultimately be enforced through RBAC.  
* Clarify the exact behavior of edits made after a summary is already public: whether those edits appear immediately and how the mandatory Review step applies before a later publish/version checkpoint.  
* Confirm whether the recommended homepage ordering matches the Academic Division workflow.

Technical details such as exact RBAC keys, database schema, API endpoints, real-time collaboration infrastructure, and deployment topology should be handled in technical design after the product requirements are approved.

# 21\. Confirmed Decisions

* Responsi will have a dedicated public website at responsi.himtibinus.or.id.  
* The public website does not require student login.  
* Responsi management is added to the existing HIMTI Internal Tools.  
* The existing Internal Tools authentication and RBAC system will be reused.  
* The summary editor will use Tiptap and support real-time collaboration.  
* A new summary is created for each relevant academic period instead of reusing the old summary as the current document.  
* Old summaries are archived. Archived summaries remain publicly accessible only within a limited retention period; the exact duration is still to be confirmed.  
* The summary lifecycle includes Draft, Review, Published, and Archived.  
* Review is required before initial publication.  
* A version snapshot is created on publish and version history is internal only.  
* Academic periods use startDate and endDate to support automatic archiving.  
* Archived summaries can also be manually archived and unarchived.  
* The public website includes a calendar for Study Club and Responsi events.  
* Events are single-instance rather than recurring.  
* Registration uses an external URL for the first version.  
* Participant quota is display-only and has no real-time count.  
* YouTube URLs are stored and embedded for available session recordings.  
* Search in the first version is limited to summary title plus course filtering.  
* Notifications and analytics are not required for the first version.

# 22\. Review Checklist

* Does the academic structure match how Responsi prepares content each semester?  
* Are the public website and Internal Tools responsibilities separated correctly?  
* Does the summary workflow match how activists actually write, review, and publish content?  
* Is the proposed PIC/contributor model acceptable?  
* Are all required event fields covered?  
* Is external link registration sufficient for the first version? (probably yea)  
* What should the public archive retention period be? Current working suggestion: up to two previous academic years.  
* Are there any first-version requirements missing before technical design starts?

