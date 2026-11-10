import { useLayoutEffect } from "react";
import { ArrowDown } from "lucide-react";
import HomeSearch from "../../components/home-search";
import HomeReveal from "../../components/home-reveal";
import DataBoundary from "../../components/data-boundary";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Video,
  SectionHeading,
  CourseCard,
  SummaryCourses,
  EventList,
  RecordingList,
} from "../../components/resources";
import { demoAcademicContext } from "../../data/demo";

export default function HomePage() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("home-scroll");
    return () => document.documentElement.classList.remove("home-scroll");
  }, []);

  return (
    <>
      <section className="hero">
        <h1>
          Your learning, <br />
          all in <span>one place.</span>
        </h1>
        <p>
          Explore Responsi materials, join Study Clubs, and watch educational
          <br className="desktop-break" /> videos from HIMTI. Find the resources
          you need for your studies.
        </p>
        <HomeSearch />
        <a className="scroll-cue" href="#home-resources">
          <span>Scroll to explore</span>
          <ArrowDown size={18} aria-hidden="true" />
        </a>
      </section>
      <DataBoundary>
        {(data) => (
          <HomeReveal>
            <p className="preview-label">
              Frontend preview · Demo academic resources
            </p>
            <section aria-labelledby="explore-courses">
              <SectionHeading
                id="explore-courses"
                icon={BookOpen}
                title="Explore courses"
                description="Browse course groups to find Responsi materials, Study Clubs, and videos."
                to="/courses"
                action="View all courses"
              />
              <div className="course-grid home-course-grid">
                {data.courses.slice(0, 4).map((course) => (
                  <CourseCard course={course} key={course.id} />
                ))}
              </div>
            </section>
            <section aria-labelledby="latest-responsi">
              <SectionHeading
                id="latest-responsi"
                icon={FileText}
                title="Latest Responsi"
                description="Choose a course, then find its exam preparation materials."
                to="/responsi"
                action="View all Responsi"
              />
              <p className="period-caption">{demoAcademicContext}</p>
              <SummaryCourses
                summaries={data.summaries}
                courses={data.courses}
              />
            </section>
            <div className="home-bottom-grid">
              <section aria-labelledby="upcoming-sessions">
                <SectionHeading
                  id="upcoming-sessions"
                  icon={CalendarDays}
                  title="Upcoming sessions"
                  description="Study Clubs and Responsi, all on your schedule."
                  to="/study-clubs"
                />
                <EventList events={data.events} />
              </section>
              <section aria-labelledby="recent-videos">
                <SectionHeading
                  id="recent-videos"
                  icon={Video}
                  title="Recent videos"
                  description="Revisit recorded Study Club and Responsi sessions."
                  to="/videos"
                />
                <RecordingList events={data.events} courses={data.courses} />
              </section>
            </div>
          </HomeReveal>
        )}
      </DataBoundary>
    </>
  );
}
