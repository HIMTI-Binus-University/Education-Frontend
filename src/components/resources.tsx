import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Box,
  CalendarDays,
  ChevronRight,
  CodeXml,
  Database,
  FileText,
  Network,
  Play,
  Sigma,
  Terminal,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  safeExternalUrl,
  youtubeEmbedUrl,
  type Course,
  type SummaryMetadata,
  type AcademicEvent,
} from "../data/education";
import { eventDay, eventMonth, eventTime } from "../utils/date";

const courseIcons: Record<Course["icon"], LucideIcon> = {
  code: CodeXml,
  database: Database,
  math: Sigma,
  box: Box,
  network: Network,
  terminal: Terminal,
};

export function CourseIcon({ course }: { course: Course }) {
  return <IconTile icon={courseIcons[course.icon]} />;
}

export function IconTile({
  icon: Icon,
  small = false,
}: {
  icon: LucideIcon;
  small?: boolean;
}) {
  return (
    <span className={`icon-tile${small ? " small" : ""}`}>
      <Icon aria-hidden="true" size={small ? 21 : 26} strokeWidth={1.8} />
    </span>
  );
}

export function SectionHeading({
  icon,
  title,
  description,
  to,
  action = "View all",
  id,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  to?: string;
  action?: string;
  id?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-title">
        <IconTile icon={icon} />
        <div>
          <h2 id={id}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {action}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function CourseCard({
  course,
  detailed = false,
}: {
  course: Course;
  detailed?: boolean;
}) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className={`course-card panel${detailed ? " detailed" : ""}`}
    >
      <IconTile icon={courseIcons[course.icon]} />
      <div>
        <h3>{course.name}</h3>
        {detailed && (
          <>
            <p>{course.description}</p>
            <span className="course-semester">
              Semester {course.semester} ·{" "}
              {course.semester % 2 ? "Odd" : "Even"}
            </span>
          </>
        )}
      </div>
      <ChevronRight className="row-chevron" size={19} aria-hidden="true" />
    </Link>
  );
}

export function SummaryList({
  summaries,
  courses,
}: {
  summaries: SummaryMetadata[];
  courses: Course[];
}) {
  return (
    <div className="panel resource-list">
      {summaries.map((summary) => (
        <Link
          className="resource-row"
          to={`/responsi/${summary.id}`}
          key={summary.id}
        >
          <IconTile icon={FileText} small />
          <div className="row-copy">
            <h3>{summary.title}</h3>
            <p>
              {courses.find((course) => course.id === summary.courseId)?.name}{" "}
              <span>·</span> {summary.academicPeriod} <span>·</span>{" "}
              {summary.examType}
            </p>
          </div>
          <ChevronRight className="row-chevron" size={19} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function SummaryCourses({
  summaries,
  courses,
}: {
  summaries: SummaryMetadata[];
  courses: Course[];
}) {
  const courseIds = [...new Set(summaries.map((summary) => summary.courseId))];
  return (
    <div className="panel resource-list">
      {courseIds.map((id) => {
        const course = courses.find((item) => item.id === id);
        if (!course) return null;
        return (
          <Link className="resource-row" to={`/courses/${id}`} key={id}>
            <CourseIcon course={course} />
            <div className="row-copy">
              <h3>{course.name}</h3>
              <p>Semester {course.semester}</p>
            </div>
            <ChevronRight
              className="row-chevron"
              size={19}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </div>
  );
}

export function EventList({ events }: { events: AcademicEvent[] }) {
  return (
    <div className="panel resource-list event-list">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/study-clubs/${event.id}`}
          className="resource-row"
        >
          <span className="date-tile">
            <strong>{eventDay(event.startsAt)}</strong>
            <span>{eventMonth(event.startsAt)}</span>
          </span>
          <div className="row-copy">
            <h3>{event.title}</h3>
            <p>
              {eventTime(event.startsAt)} WIB <span>·</span> {event.location}
            </p>
          </div>
          <ChevronRight className="row-chevron" size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  children,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state panel">
      <IconTile icon={Icon} />
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

export function RecordingList({
  events,
  courses,
}: {
  events: AcademicEvent[];
  courses: Course[];
}) {
  const recordings = events.filter((event) =>
    youtubeEmbedUrl(event.recordingUrl),
  );
  if (!recordings.length)
    return (
      <EmptyState icon={Video} title="Recordings are on their way">
        Published Study Club and Responsi recordings will appear here when available.
      </EmptyState>
    );
  return (
    <div className="panel resource-list">
      {recordings.map((event) => (
        <Link
          to={`/videos?event=${event.id}`}
          key={event.id}
          className="resource-row"
        >
          <span className="video-tile">
            <Play size={23} aria-hidden="true" />
          </span>
          <div className="row-copy">
            <h3>{event.title}</h3>
            <p>
              {courses.find((course) => course.id === event.courseId)?.name} ·{" "}
              {event.type}
            </p>
          </div>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; to?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <ChevronRight size={14} aria-hidden="true" />
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ExternalAction({
  url,
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  const safeUrl = safeExternalUrl(url);
  return safeUrl ? (
    <a
      className="button primary"
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowRight size={17} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : null;
}

export { BookOpen, CalendarDays, FileText, Video };
