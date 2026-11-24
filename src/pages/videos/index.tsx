import { useSearchParams, Link } from "react-router-dom";
import { Play, Video } from "lucide-react";
import DataBoundary from "../../components/data-boundary";
import { Breadcrumb, EmptyState } from "../../components/resources";
import { eventDate } from "../../utils/date";
import { youtubeEmbedUrl } from "../../data/education";

export default function VideosPage() {
  const [params, setParams] = useSearchParams();
  const courseId = params.get("course") ?? "";
  const eventId = params.get("event");
  return (
    <DataBoundary>
      {(data) => {
        const recordings = data.events.filter(
          (event) =>
            youtubeEmbedUrl(event.recordingUrl) &&
            (!courseId || event.courseId === courseId),
        );
        const selected = recordings.find((event) => event.id === eventId);
        return (
          <div className="page-content">
            <Breadcrumb items={[{ label: "Videos" }]} />
            <div className="page-heading">
              <h1>Missed it? Revisit it.</h1>
              <p>
                Watch available recordings from Study Clubs and Responsi,
                connected to your courses.
              </p>
            </div>
            <div className="filter-bar">
              <div className="filter-intro">
                <Video size={21} aria-hidden="true" />
                <span>Session recordings</span>
              </div>
              <label className="select-field">
                <span className="sr-only">Filter recordings by course</span>
                <select
                  value={courseId}
                  onChange={(event) => {
                    const next = new URLSearchParams();
                    if (event.target.value)
                      next.set("course", event.target.value);
                    setParams(next);
                  }}
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
            {selected && (
              <section className="recording-player panel">
                <iframe
                  src={youtubeEmbedUrl(selected.recordingUrl)!}
                  title={`${selected.title} recording`}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <div>
                  <h2>{selected.title}</h2>
                  <p>
                    {selected.type} · {eventDate(selected.startsAt)}
                  </p>
                  <div className="player-links">
                    <Link
                      className="text-link"
                      to={`/courses/${selected.courseId}`}
                    >
                      Open course
                    </Link>
                    <Link
                      className="text-link"
                      to={`/study-clubs/${selected.id}`}
                    >
                      Session details
                    </Link>
                  </div>
                </div>
              </section>
            )}
            {recordings.length ? (
              <div className="video-grid">
                {recordings.map((event) => (
                  <button
                    className="recording-card panel"
                    key={event.id}
                    aria-pressed={selected?.id === event.id}
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      next.set("event", event.id);
                      setParams(next);
                    }}
                  >
                    <span className="video-cover">
                      <Play size={36} aria-hidden="true" />
                      <span>{event.type}</span>
                    </span>
                    <span className="recording-copy">
                      <strong>{event.title}</strong>
                      <span>
                        {
                          data.courses.find(
                            (course) => course.id === event.courseId,
                          )?.name
                        }
                      </span>
                      <span>{eventDate(event.startsAt)}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Video}
                title="No recordings available yet"
                action={
                  <Link className="button secondary" to="/study-clubs">
                    Find a session
                  </Link>
                }
              >
                Recordings will appear after a session's YouTube link is
                published.
              </EmptyState>
            )}
          </div>
        );
      }}
    </DataBoundary>
  );
}
