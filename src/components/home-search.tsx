import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useEducationData } from "../api/education/queries";
import { findCourses, findSummaries } from "../data/demo";

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const stage = useRef<HTMLDivElement>(null);
  const pulse = useRef<Animation | null>(null);
  const navigate = useNavigate();
  const query = useEducationData();
  const matches = query.data
    ? [
        ...findCourses(query.data.courses, search).map((course) => ({
          id: `course-${course.id}`,
          title: course.name,
          to: `/courses/${course.id}`,
          detail: `Course · Semester ${course.semester}`,
        })),
        ...(search.trim()
          ? findSummaries(query.data.summaries, search, "")
          : []
        ).map((summary) => ({
          id: summary.id,
          title: summary.title,
          to: `/responsi/${summary.id}`,
          detail: `${query.data.courses.find((course) => course.id === summary.courseId)?.name ?? "Material"} · ${summary.examType}`,
        })),
      ].slice(0, 5)
    : [];
  const expanded = open;
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (media?.matches) pulse.current?.cancel();
    };
    media?.addEventListener("change", stop);
    return () => {
      media?.removeEventListener("change", stop);
      pulse.current?.cancel();
    };
  }, []);

  function update(value: string) {
    setSearch(value);
    setActive(-1);
    setOpen(true);
    if (
      !value ||
      pulse.current?.playState === "running" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    pulse.current =
      stage.current?.animate?.(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.025)", offset: 0.5 },
          { transform: "scale(1)" },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(.45,0,.55,1)",
          composite: "add",
          pseudoElement: "::before",
        },
      ) ?? null;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setOpen(false);
    navigate(
      `/responsi${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`,
    );
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
    if (
      (event.key === "ArrowDown" || event.key === "ArrowUp") &&
      matches.length
    ) {
      event.preventDefault();
      setOpen(true);
      const next =
        event.key === "ArrowDown"
          ? (active + 1) % matches.length
          : active <= 0
            ? matches.length - 1
            : active - 1;
      setActive(next);
      document
        .getElementById(`summary-suggestion-${matches[next].id}`)
        ?.scrollIntoView?.({ block: "nearest", behavior: "instant" });
    }
    if (event.key === "Enter" && expanded && active >= 0 && matches[active]) {
      event.preventDefault();
      setOpen(false);
      navigate(matches[active].to);
    }
  }

  return (
    <div
      className="search-stage"
      ref={stage}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      }}
    >
      <form className="hero-search" role="search" onSubmit={submit}>
        <Search size={24} aria-hidden="true" />
        <label htmlFor="home-search" className="sr-only">
          Search courses and materials
        </label>
        <input
          id="home-search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? "summary-suggestions" : undefined}
          aria-activedescendant={
            expanded && active >= 0 && matches[active]
              ? `summary-suggestion-${matches[active].id}`
              : undefined
          }
          autoComplete="off"
          value={search}
          onChange={(event) => update(event.target.value)}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={keyDown}
          placeholder="Search courses or materials…"
        />
        <button type="submit" aria-label="Search resources">
          <ArrowRight size={22} />
        </button>
      </form>
      {expanded && (
        <div className="search-suggestions">
          <p className="suggestions-caption" role="status">
            {query.isPending
              ? "Loading suggestions…"
              : query.isError
                ? "Suggestions unavailable. Try the full search."
                : matches.length
                  ? search.trim()
                    ? `${matches.length} suggested ${matches.length === 1 ? "result" : "results"}`
                    : "Recommended courses"
                  : search.trim()
                    ? "No matching courses or materials. Try another keyword."
                    : "No courses available yet."}
          </p>
          <ul
            id="summary-suggestions"
            role="listbox"
            aria-label="Suggested courses and materials"
          >
            {matches.map((summary, index) => (
              <li
                id={`summary-suggestion-${summary.id}`}
                key={summary.id}
                role="option"
                aria-selected={active === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  navigate(summary.to);
                }}
              >
                <span>{summary.title}</span>
                <small>{summary.detail}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
