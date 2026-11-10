import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Video,
} from "lucide-react";
import DataBoundary, { NotFound } from "../../components/data-boundary";
import {
  Breadcrumb,
  EmptyState,
  EventList,
  ExternalAction,
} from "../../components/resources";
import { eventDate, eventTime } from "../../utils/date";
import { youtubeEmbedUrl } from "../../data/demo";

const monthLabel = (year: number, month: number) =>
  new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1)));

export default function SchedulePage() {
  const [params, setParams] = useSearchParams();
  const now = new Date();
  const parsedMonth = params.get("month");
  const validMonth =
    parsedMonth &&
    /^\d{4}-(0[1-9]|1[0-2])$/.test(parsedMonth) &&
    Number(parsedMonth.slice(0, 4)) >= 1900 &&
    Number(parsedMonth.slice(0, 4)) <= 2100;
  const year = validMonth ? Number(parsedMonth.slice(0, 4)) : now.getFullYear();
  const month = validMonth ? Number(parsedMonth.slice(5)) - 1 : now.getMonth();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const type = params.get("type") ?? "";
  const courseId = params.get("course") ?? "";
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const changeMonth = (delta: number) => {
    const date = new Date(Date.UTC(year, month + delta, 1));
    const next = new URLSearchParams(params);
    next.set(
      "month",
      `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
    );
    setParams(next);
    setSelectedDay(null);
  };
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
    setSelectedDay(null);
  };

  return (
    <DataBoundary>
      {(data) => {
        const filtered = data.events.filter(
          (event) =>
            event.startsAt.startsWith(monthKey) &&
            (!type || event.type === type) &&
            (!courseId || event.courseId === courseId),
        );
        const shown = filtered.filter(
          (event) =>
            !selectedDay || Number(event.startsAt.slice(8, 10)) === selectedDay,
        );
        return (
          <div className="page-content">
            <Breadcrumb items={[{ label: "Study Clubs & Responsi" }]} />
            <div className="page-heading">
              <h1>Make time to learn together.</h1>
              <p>
                Your calendar for Study Clubs and Responsi sessions. All times
                in WIB (UTC+7).
              </p>
            </div>
            <div className="schedule-toolbar">
              <div
                className="segmented"
                role="group"
                aria-label="Event type"
                data-active-index={["", "Study Club", "Responsi"].indexOf(type)}
              >
                {["", "Study Club", "Responsi"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={type === value}
                    onClick={() => update("type", value)}
                  >
                    {value || "All sessions"}
                  </button>
                ))}
              </div>
              <label className="select-field">
                <span className="sr-only">Filter events by course</span>
                <select
                  value={courseId}
                  onChange={(event) => update("course", event.target.value)}
                >
                  <option value="">All courses</option>
                  {data.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="period-caption">
              Demo schedule · Example sessions are in November 2026.
            </p>
            <div className="schedule-layout">
              <section className="calendar panel" aria-label="Session calendar">
                <div className="calendar-top">
                  <h2 aria-live="polite">{monthLabel(year, month)}</h2>
                  <div>
                    <button
                      className="icon-button"
                      aria-label="Previous month"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Next month"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <span key={day}>{day}</span>
                      ),
                    )}
                  </div>
                  <div className="calendar-days">
                    {Array.from({ length: offset }, (_, index) => (
                      <span key={`empty-${index}`} />
                    ))}
                    {Array.from({ length: days }, (_, index) => {
                      const day = index + 1;
                      const sessions = filtered.filter(
                        (event) => Number(event.startsAt.slice(8, 10)) === day,
                      );
                      return (
                        <button
                          type="button"
                          key={day}
                          className={`calendar-day${selectedDay === day ? " selected" : ""}${sessions.length ? " has-event" : ""}`}
                          aria-label={`${day} ${monthLabel(year, month)}${sessions.length ? `, ${sessions.length} sessions` : ", no sessions"}`}
                          aria-pressed={selectedDay === day}
                          onClick={() =>
                            setSelectedDay(selectedDay === day ? null : day)
                          }
                        >
                          <span>{day}</span>
                          {sessions.map((event) => (
                            <span
                              className={`calendar-event ${event.type === "Responsi" ? "responsi-event" : ""}`}
                              key={event.id}
                            >
                              {event.title}
                            </span>
                          ))}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="calendar-legend">
                  <span>
                    <i />
                    Study Club
                  </span>
                  <span>
                    <i className="responsi-dot" />
                    Responsi
                  </span>
                </div>
              </section>
              <section
                className="schedule-agenda"
                aria-labelledby="agenda-title"
              >
                <div className="agenda-heading">
                  <h2 id="agenda-title">
                    {selectedDay
                      ? `${selectedDay} ${monthLabel(year, month)}`
                      : "This month's sessions"}
                  </h2>
                  {selectedDay && (
                    <button
                      className="text-link"
                      onClick={() => setSelectedDay(null)}
                    >
                      Show month
                    </button>
                  )}
                </div>
                {shown.length ? (
                  <EventList events={shown} />
                ) : (
                  <EmptyState
                    icon={CalendarDays}
                    title="No sessions on the calendar"
                  >
                    Choose another date or month. New sessions will appear when
                    they are published.
                  </EmptyState>
                )}
              </section>
            </div>
          </div>
        );
      }}
    </DataBoundary>
  );
}

export function EventPage() {
  const { eventId } = useParams();
  return (
    <DataBoundary>
      {(data) => {
        const event = data.events.find((item) => item.id === eventId);
        if (!event) return <NotFound subject="Event" />;
        const course = data.courses.find((item) => item.id === event.courseId);
        return (
          <div className="page-content event-page">
            <Breadcrumb
              items={[
                { label: "Schedule", to: "/study-clubs" },
                { label: event.title },
              ]}
            />
            <Link
              to={`/study-clubs?month=${event.startsAt.slice(0, 7)}`}
              className="text-link back-link"
            >
              <ArrowLeft size={17} />
              Back to schedule
            </Link>
            <header className="page-heading">
              <p className="context-label">{event.type} · Demo event</p>
              <h1>{event.title}</h1>
              <Link className="text-link" to={`/courses/${event.courseId}`}>
                {course?.name}
                <ChevronRight size={16} />
              </Link>
            </header>
            <div className="event-detail-layout">
              <section className="panel event-description">
                <h2>About this session</h2>
                <p>{event.description}</p>
                <h3>Before you join</h3>
                <p>
                  Revisit the course summaries and bring the questions you would
                  like to discuss.
                </p>
                <Link
                  className="button secondary"
                  to={`/courses/${event.courseId}`}
                >
                  Read course materials
                </Link>
              </section>
              <aside className="panel event-facts">
                <h2>Session details</h2>
                <dl>
                  <div>
                    <CalendarDays size={20} aria-hidden="true" />
                    <dt>Date</dt>
                    <dd>{eventDate(event.startsAt)}</dd>
                  </div>
                  <div>
                    <Clock size={20} aria-hidden="true" />
                    <dt>Time</dt>
                    <dd>
                      {eventTime(event.startsAt)}–{eventTime(event.endsAt)} WIB
                    </dd>
                  </div>
                  <div>
                    <MapPin size={20} aria-hidden="true" />
                    <dt>Location</dt>
                    <dd>{event.location}</dd>
                  </div>
                  {event.quota !== undefined && (
                    <div>
                      <Users size={20} aria-hidden="true" />
                      <dt>Capacity</dt>
                      <dd>{event.quota} participants (informational)</dd>
                    </div>
                  )}
                </dl>
                <div className="event-actions">
                  <ExternalAction url={event.registrationUrl}>
                    Open registration
                  </ExternalAction>
                  <ExternalAction url={event.meetingUrl}>
                    Open meeting
                  </ExternalAction>
                </div>
                {!event.meetingUrl && !event.registrationUrl && (
                  <p className="helper-copy">
                    Meeting and registration links have not been supplied for
                    this demo.
                  </p>
                )}
                {youtubeEmbedUrl(event.recordingUrl) && (
                  <Link
                    to={`/videos?event=${event.id}`}
                    className="button secondary"
                  >
                    <Video size={18} />
                    Watch recording
                  </Link>
                )}
              </aside>
            </div>
          </div>
        );
      }}
    </DataBoundary>
  );
}
