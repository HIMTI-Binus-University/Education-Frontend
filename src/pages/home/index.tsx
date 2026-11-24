import { useState } from "react";
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, BookOpen, Search, Users } from "lucide-react";
import HomeSearch from "../../components/home-search";
import { CourseIcon } from "../../components/resources";
import { useEducationData } from "../../api/education/queries";
import WatchField, { type WatchItem } from "./watch-field";
import { watchTransition } from "./watch-motion";
import "./launcher.css";

export default function HomePage() {
  const [mode, setMode] = useState<"home" | "search">("home");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState<string>();
  const [focusId, setFocusId] = useState<string>();
  const query = useEducationData();
  const reduced = useReducedMotion();
  const selectedCourse = query.data?.courses.find((course) => course.id === courseId);
  const visibleCourses = query.data?.courses.filter((course) => !semester || String(course.semester) === semester) ?? [];
  const semesters = [...new Set(query.data?.courses.map((course) => course.semester))].sort((a, b) => a - b);
  const back = () => {
    setFocusId("search");
    setMode("home");
  };
  const backItem: WatchItem = {
    id: "back", label: "Back", tone: 0,
    content: <><ArrowLeft aria-hidden="true" /><span>Back</span></>, onClick: back,
  };
  const courseContent = (course: NonNullable<typeof selectedCourse>) => (
    <><CourseIcon course={course} /><span className="watch-course-name">{course.name}</span></>
  );
  const items: WatchItem[] = mode === "home" ? [
    {
      id: "search", label: "Search", tone: 0,
      content: <><motion.span className="watch-search-icon" layoutId="search-icon" transition={reduced ? { duration: 0 } : watchTransition} aria-hidden="true"><Search /></motion.span><span>Search</span></>,
      onClick: () => { setCourseId(undefined); setFocusId(undefined); setMode("search"); },
    },
    ...visibleCourses.map((course): WatchItem => ({
      id: `course-${course.id}`, label: course.name, tone: 2,
      content: courseContent(course),
      selected: course.id === courseId,
      onClick: () => { setCourseId(courseId === course.id ? undefined : course.id); setFocusId(`course-${course.id}`); },
    })),
  ] : [backItem];

  if (mode === "home" && selectedCourse) {
    const params = new URLSearchParams({ course: selectedCourse.id, semester: String(selectedCourse.semester) });
    items.push(
      { id: "responsi", parentId: `course-${selectedCourse.id}`, label: "Materi Responsi", tone: 0, content: <><BookOpen aria-hidden="true" /><span>Responsi</span></>, to: `/responsi?${params}` },
      { id: "study-club", parentId: `course-${selectedCourse.id}`, label: "Study Club", tone: 0, content: <><Users aria-hidden="true" /><span>Study Club</span></>, to: `/study-clubs?type=Study+Club&${params}` },
    );
  }

  const status = mode !== "search" && (
    query.isPending ? "Loading academic resources…" : query.isError ? (
      <><span>Resources could not be loaded.</span><button className="button secondary" onClick={() => void query.refetch()}>Try again</button></>
    ) : mode === "home" && !visibleCourses.length ? (
      <><h2>No courses available yet</h2><p>{semester ? "Choose another semester." : "Courses will appear when they are published."}</p></>
    ) : null
  );

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="home-watch">
        <section className="home-launcher" aria-label="Learning home">
          <div className="launcher-content">
            <motion.div key={mode} className="launcher-heading" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={reduced ? { duration: 0 } : watchTransition}>
              <h1>{mode === "home" ? <>Your learning,{" "}<br /><span>all in <span className="launcher-handwritten">one place.</span></span></> : <>What are you{" "}<br /><span>learning today?</span></>}</h1>
              <p>{mode === "home" ? "Choose your course, then find materials or a Study Club." : "Search courses and materials across all semesters."}</p>
            </motion.div>
            {mode === "home" && (
              <div className="launcher-filters">
                <label className="select-field">
                  <span className="sr-only">Filter Home courses by semester</span>
                  <select value={semester} onChange={(event) => { setCourseId(undefined); setFocusId(undefined); setSemester(event.target.value); }}>
                    <option value="">All semesters</option>
                    {semesters.map((value) => <option key={value} value={value}>Semester {value}</option>)}
                  </select>
                </label>
                {!query.isPending && !query.isError && <span role="status">{visibleCourses.length} {visibleCourses.length === 1 ? "course" : "courses"}</span>}
              </div>
            )}
            <WatchField
              items={items}
              sceneId={mode === "home" ? `home-${semester}` : "search"}
              focusId={focusId}
              status={status}
              search={mode === "search" ? (
                <div className="watch-search-panel">
                  <motion.div className="watch-search-surface" layoutId="search-shape" style={{ borderRadius: 36 }} transition={reduced ? { duration: 0 } : watchTransition} />
                  <motion.span className="watch-search-icon is-bar-icon" layoutId="search-icon" transition={reduced ? { duration: 0 } : watchTransition} aria-hidden="true"><Search /></motion.span>
                  <motion.div className="watch-search-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.24, delay: 0 } }} transition={{ duration: reduced ? 0 : 0.24, delay: reduced ? 0 : 0.32 }} onAnimationComplete={() => document.querySelector<HTMLInputElement>(".is-search #home-search")?.focus({ preventScroll: true })}>
                    <HomeSearch />
                  </motion.div>
                </div>
              ) : undefined}
            />
          </div>
        </section>
      </LayoutGroup>
    </MotionConfig>
  );
}
