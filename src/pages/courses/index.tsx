import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, GraduationCap, Search } from "lucide-react";
import DataBoundary, { NotFound } from "../../components/data-boundary";
import { findCourses } from "../../data/education";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Video,
  SectionHeading,
  CourseCard,
  SummaryList,
  EventList,
  RecordingList,
  Breadcrumb,
  EmptyState,
  CourseIcon,
} from "../../components/resources";

export default function CoursesPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const semester = params.get("semester") ?? "";
  return (
    <DataBoundary>
      {(data) => {
        const courses = findCourses(data.courses, search).filter(
          (course) => !semester || String(course.semester) === semester,
        );
        return (
          <div className="page-content">
            <Breadcrumb items={[{ label: "Courses" }]} />
            <div className="page-heading">
              <h1>A place for every course.</h1>
              <p>
                Find your course, then bring its summaries, sessions, and
                recordings together.
              </p>
            </div>
            <div className="filter-bar">
              <div className="search-field">
                <Search size={20} aria-hidden="true" />
                <label className="sr-only" htmlFor="course-search">
                  Find a course
                </label>
                <input
                  id="course-search"
                  value={search}
                  onChange={(event) => {
                    const next = new URLSearchParams(params);
                    next.set("q", event.target.value);
                    setParams(next, { replace: true });
                  }}
                  placeholder="Find a course…"
                />
              </div>
              <label className="select-field">
                <span className="sr-only">Semester</span>
                <select
                  value={semester}
                  onChange={(event) => {
                    const next = new URLSearchParams(params);
                    next.set("semester", event.target.value);
                    setParams(next);
                  }}
                >
                  <option value="">All semesters</option>
                  {[...new Set(data.courses.map((course) => course.semester))]
                    .sort()
                    .map((value) => (
                      <option key={value} value={value}>
                        Semester {value}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <p className="results-caption" role="status">
              {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </p>
            {courses.length ? (
              <div className="course-grid directory-grid">
                {courses.map((course) => (
                  <CourseCard course={course} key={course.id} detailed />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses match your filters"
                action={
                  <button
                    className="button secondary"
                    onClick={() => setParams({})}
                  >
                    Clear filters
                  </button>
                }
              >
                Try another course name or semester.
              </EmptyState>
            )}
          </div>
        );
      }}
    </DataBoundary>
  );
}

export function CoursePage() {
  const { courseId } = useParams();
  return (
    <DataBoundary>
      {(data) => {
        const course = data.courses.find((item) => item.id === courseId);
        if (!course) return <NotFound subject="Course" />;
        const summaries = data.summaries.filter(
          (summary) => summary.courseId === course.id,
        );
        const events = data.events.filter(
          (event) => event.courseId === course.id,
        );
        return (
          <div className="page-content">
            <Breadcrumb
              items={[
                { label: "Courses", to: "/courses" },
                { label: course.name },
              ]}
            />
            <Link to="/courses" className="text-link back-link">
              <ArrowLeft size={17} />
              Back to courses
            </Link>
            <header className="course-heading">
              <CourseIcon course={course} />
              <div>
                <h1>{course.name}</h1>
                <p>{course.description}</p>
                <div className="reader-meta course-meta">
                  <span>
                    <GraduationCap size={18} />
                    Semester {course.semester} ·{" "}
                    {course.semester % 2 ? "Odd" : "Even"}
                  </span>
                </div>
              </div>
            </header>
            <section className="course-section" id="summaries">
              <SectionHeading
                icon={FileText}
                title="Responsi materials"
                description="Read the available summaries for this course."
                to={`/responsi?course=${course.id}`}
                action="Browse summaries"
              />
              {summaries.length ? (
                <SummaryList summaries={summaries} courses={data.courses} />
              ) : (
                <EmptyState title="No summaries published yet">
                  Check back when the first summary for this course is
                  published.
                </EmptyState>
              )}
            </section>
            <div className="home-bottom-grid">
              <section id="sessions">
                <SectionHeading icon={CalendarDays} title="Upcoming sessions" />
                {events.length ? (
                  <EventList events={events} />
                ) : (
                  <EmptyState icon={CalendarDays} title="No sessions scheduled">
                    New Study Club and Responsi sessions will appear here.
                  </EmptyState>
                )}
              </section>
              <section id="recordings">
                <SectionHeading icon={Video} title="Course recordings" />
                <RecordingList events={events} courses={data.courses} />
              </section>
            </div>
            <Link to="/courses" className="text-link back-directory">
              <BookOpen size={17} /> Browse other courses{" "}
              <ArrowRight size={17} />
            </Link>
          </div>
        );
      }}
    </DataBoundary>
  );
}
