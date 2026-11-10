import { lazy, Suspense } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  UserRound,
} from "lucide-react";
import DataBoundary, { NotFound } from "../../components/data-boundary";
import ReaderOutline from "../../components/reader-outline";
import {
  Breadcrumb,
  EmptyState,
  SummaryList,
  SummaryCourses,
  CourseCard,
} from "../../components/resources";
import {
  findCourses,
  findSummaries,
  demoAcademicContext,
} from "../../data/demo";

const SummaryContent = lazy(() => import("../../components/summary-content"));

export default function SummariesPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const course = params.get("course") ?? "";
  return (
    <DataBoundary>
      {(data) => {
        const results = findSummaries(data.summaries, search, course);
        const matchingCourses = search.trim()
          ? findCourses(data.courses, search).filter(
              (item) => !course || item.id === course,
            )
          : [];
        const showMaterials = Boolean(search.trim() || course);
        const count = showMaterials
          ? results.length
          : new Set(results.map((summary) => summary.courseId)).size;
        const update = (key: string, value: string) => {
          const next = new URLSearchParams(params);
          if (value) next.set(key, value);
          else next.delete(key);
          setParams(next, { replace: true });
        };
        return (
          <div className="page-content">
            <Breadcrumb items={[{ label: "Responsi" }]} />
            <div className="page-heading">
              <h1>A little clarity before your exam.</h1>
              <p>
                Choose a course to browse its materials, or search for a topic.
              </p>
            </div>
            <div className="filter-bar">
              <div className="search-field">
                <Search size={20} aria-hidden="true" />
                <label htmlFor="summary-search" className="sr-only">
                  Search courses and materials
                </label>
                <input
                  id="summary-search"
                  placeholder="Search courses or materials…"
                  value={search}
                  onChange={(event) => update("q", event.target.value)}
                />
              </div>
              <label className="select-field">
                <span className="sr-only">Filter by course</span>
                <select
                  value={course}
                  onChange={(event) => update("course", event.target.value)}
                >
                  <option value="">All courses</option>
                  {data.courses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="listing-context">
              <span>{demoAcademicContext}</span>
              <span role="status">
                {matchingCourses.length > 0 &&
                  `${matchingCourses.length} ${matchingCourses.length === 1 ? "course" : "courses"} · `}
                {count}{" "}
                {showMaterials
                  ? count === 1
                    ? "summary"
                    : "summaries"
                  : count === 1
                    ? "course"
                    : "courses"}
              </span>
            </div>
            {matchingCourses.length > 0 && (
              <div className="course-grid directory-grid search-course-results">
                {matchingCourses.map((item) => (
                  <CourseCard key={item.id} course={item} />
                ))}
              </div>
            )}
            {results.length ? (
              showMaterials ? (
                <SummaryList summaries={results} courses={data.courses} />
              ) : (
                <SummaryCourses summaries={results} courses={data.courses} />
              )
            ) : matchingCourses.length ? null : (
              <EmptyState
                title="No summaries found"
                action={
                  <button
                    className="button secondary"
                    onClick={() => setParams({})}
                  >
                    Clear filters
                  </button>
                }
              >
                Try a different title or choose another course.
              </EmptyState>
            )}
          </div>
        );
      }}
    </DataBoundary>
  );
}

export function ReaderPage() {
  const { summaryId } = useParams();
  return (
    <DataBoundary>
      {(data) => {
        const summary = data.summaries.find((item) => item.id === summaryId);
        if (!summary) return <NotFound subject="Summary" />;
        const course = data.courses.find(
          (item) => item.id === summary.courseId,
        );
        const headings = (summary.content.content ?? [])
          .filter((node) => node.type === "heading" && node.attrs?.level === 2)
          .map((node) =>
            (node.content ?? []).map((child) => child.text ?? "").join(""),
          );
        return (
          <div className="page-content reader-page">
            <Breadcrumb
              items={[
                { label: "Courses", to: "/courses" },
                {
                  label: course?.name ?? "Course",
                  to: `/courses/${summary.courseId}`,
                },
                { label: summary.title },
              ]}
            />
            <Link
              to={`/courses/${summary.courseId}`}
              className="text-link back-link"
            >
              <ArrowLeft size={17} />
              Back to {course?.name ?? "course"}
            </Link>
            <header className="reader-heading">
              <p className="context-label">Demo summary · {course?.name}</p>
              <h1>{summary.title}</h1>
              <div className="reader-details">
                <div className="reader-meta">
                  <span>
                    <CalendarDays size={16} />
                    {summary.academicPeriod} · {summary.examType}
                  </span>
                  <span>
                    <GraduationCap size={18} />
                    Semester {summary.semester}
                  </span>
                </div>
                <div className="reader-contributors" aria-label="Contributors">
                  <span className="sr-only">Contributors</span>
                  {summary.contributors.length ? (
                    <ul>
                      {summary.contributors.map((contributor) => (
                        <li key={contributor.id}>
                          <UserRound size={15} aria-hidden="true" />
                          <span>{contributor.displayName}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Contributor information is not available yet.</p>
                  )}
                </div>
              </div>
            </header>
            <div className="reader-layout">
              <ReaderOutline key={summary.id} headings={headings} />
              <article
                className="reader-content notion-document"
                aria-label="Summary content"
              >
                <div className="reader-article">
                  <Suspense fallback={<p role="status">Loading summary…</p>}>
                    <SummaryContent summary={summary} />
                  </Suspense>
                </div>
              </article>
            </div>
          </div>
        );
      }}
    </DataBoundary>
  );
}
