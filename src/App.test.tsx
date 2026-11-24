import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import App from "./App";
import {
  courses,
  events,
  summaries,
} from "./test/fixtures/education";
import { findSummaries, youtubeEmbedUrl, safeExternalUrl } from "./data/education";
import { educationKey, summaryKey } from "./api/education/queries";

function mount(
  path = "/",
  data: {
    courses: typeof courses;
    events: typeof events;
    summaries: typeof summaries;
  } = { courses, events, summaries },
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(educationKey, data);
  data.summaries.forEach(summary => client.setQueryData(summaryKey(summary.id), summary));
  const readerId = path.match(/^\/responsi\/([^/?]+)/)?.[1];
  if (readerId && !data.summaries.some(summary => summary.id === readerId)) client.setQueryData(summaryKey(readerId), null);
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("public Education Site", () => {
  it("recommends courses on empty search focus, reopens after Escape, and supports keyboard selection", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByRole("combobox", {
      name: "Search courses and materials",
    });
    await user.click(input);
    expect(await screen.findByText("Recommended courses")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(5);
    expect(
      screen.getByRole("option", { name: /Algorithm & Programming/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Dynamic Programming/ }),
    ).not.toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algorithm & Programming",
      }),
    ).toBeInTheDocument();
  });

  it("opens an empty-query course recommendation by pointer", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.click(
      screen.getByRole("combobox", { name: "Search courses and materials" }),
    );
    await user.click(
      await screen.findByRole("option", { name: /Database Systems/ }),
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Database Systems",
      }),
    ).toBeInTheDocument();
  });

  it("includes the expanded demo catalog and finds new courses by code", async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByRole("button", { name: "Distributed Systems" });
    expect(courses).toHaveLength(18);
    expect(new Set(courses.map(course => course.id)).size).toBe(18);
    expect(new Set(courses.map(course => course.code)).size).toBe(18);
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(screen.getByRole("combobox", { name: "Search courses and materials" }), "DIST");
    await user.click(await screen.findByRole("option", { name: /Distributed Systems/ }));
    expect(await screen.findByRole("heading", { level: 1, name: "Distributed Systems" })).toBeInTheDocument();
  });

  it("shows an honest empty recommendation state when no courses are supplied", async () => {
    const user = userEvent.setup();
    mount("/", { courses: [], summaries: [], events: [] });
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.click(
      screen.getByRole("combobox", { name: "Search courses and materials" }),
    );
    expect(
      await screen.findByText("No courses available yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
  it("suggests and opens courses even when they have no published materials", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByRole("combobox", {
      name: "Search courses and materials",
    });
    await user.type(input, "operating");
    expect(
      await screen.findByRole("option", { name: /Operating Systems/ }),
    ).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Operating Systems",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No summaries published yet" }),
    ).toBeInTheDocument();
  });

  it("searches courses by name or code from the full search", async () => {
    const user = userEvent.setup();
    mount("/responsi?q=net");
    const course = await screen.findByRole("link", {
      name: /Computer Networks/,
    });
    expect(course).toHaveAttribute("href", "/courses/networks");
    expect(
      screen.queryByRole("heading", { name: "No summaries found" }),
    ).not.toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by course" }),
      "database",
    );
    expect(
      await screen.findByRole("heading", { name: "No summaries found" }),
    ).toBeInTheDocument();
    await user.clear(
      screen.getByRole("textbox", { name: "Search courses and materials" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Search courses and materials" }),
      "db",
    );
    expect(
      await screen.findByRole("link", { name: /Database Systems/ }),
    ).toHaveAttribute("href", "/courses/database");
  });

  it("shows all contributor credits below the material title and pill metadata", async () => {
    mount("/responsi/derivatives");
    const title = await screen.findByRole("heading", {
      level: 1,
      name: "Limits & Derivatives",
    });
    const header = title.closest("header")!;
    const credits = within(header).getByLabelText("Contributors");
    expect(within(credits).getAllByRole("listitem")).toHaveLength(2);
    expect(credits).toHaveTextContent("[Contributor demo: Calculus]");
    expect(credits).toHaveTextContent("[Contributor demo: Reviewer]");
    expect(header.querySelector(".reader-meta")?.nextElementSibling).toBe(
      credits,
    );
    expect(credits.querySelectorAll("li svg")).toHaveLength(2);
    expect(header.querySelectorAll(".reader-meta > span")).toHaveLength(2);
    expect(header.querySelector(".reader-meta")).toHaveTextContent(
      "2026/2027 · Mid Exam",
    );
  });

  it("does not invent a contributor when no credit is supplied", async () => {
    mount("/responsi/dynamic-programming", {
      courses,
      events,
      summaries: [{ ...summaries[0], contributors: [] }],
    });
    expect(
      await screen.findByText("Contributor information is not available yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Contributors").querySelector("li"),
    ).toBeNull();
  });
  it("groups Responsi by course and lists material titles only inside the course", async () => {
    const user = userEvent.setup();
    mount("/responsi", {
      courses,
      events,
      summaries: [
        ...summaries,
        {
          ...summaries[0],
          id: "another-topic",
          title: "Another algorithm topic",
        },
      ],
    });
    const course = await screen.findByRole("link", {
      name: /Algorithm & Programming/,
    });
    expect(
      screen.getAllByRole("link", { name: /Algorithm & Programming/ }),
    ).toHaveLength(1);
    expect(
      screen.queryByRole("link", { name: /Dynamic Programming/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Another algorithm topic/ }),
    ).not.toBeInTheDocument();
    await user.click(course);
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algorithm & Programming",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Dynamic Programming/ }),
    ).toHaveAttribute("href", "/responsi/dynamic-programming");
    expect(
      screen.getByRole("link", { name: /Another algorithm topic/ }),
    ).toHaveAttribute("href", "/responsi/another-topic");
  });
  it("suggests matching titles and opens a keyboard-selected result", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByRole("combobox", {
      name: "Search courses and materials",
    });
    await user.click(input);
    await user.paste("dynamic");
    expect(
      await screen.findByRole("option", { name: /Dynamic Programming/ }),
    ).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "summary-suggestion-dynamic-programming",
    );
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Dynamic Programming",
      }),
    ).toBeInTheDocument();
  });

  it("opens a clicked suggestion, handles no matches, and labels the schedule", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(
      within(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).getByRole("link", { name: "Schedule" }),
    ).toHaveAttribute("href", "/study-clubs");
    const input = screen.getByRole("combobox", {
      name: "Search courses and materials",
    });
    await user.type(input, "no-match");
    expect(
      await screen.findByText(
        "No matching courses or materials. Try another keyword.",
      ),
    ).toBeInTheDocument();
    await user.clear(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Recommended courses")).toBeInTheDocument();
    await user.paste("normalization");
    await user.click(
      await screen.findByRole("option", { name: /Database Normalization/ }),
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Database Normalization",
      }),
    ).toBeInTheDocument();
  });
  it("starts with Search and course buttons, then opens resources for the selected course", async () => {
    const user = userEvent.setup();
    mount();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Your learning, all in one place/,
      }),
    ).toBeInTheDocument();
    const launcher = screen.getByRole("group", { name: "Draggable learning launcher" });
    await screen.findByRole("button", { name: "Algorithm & Programming" });
    expect(launcher.querySelectorAll(".watch-bubble button")).toHaveLength(courses.length + 1);
    expect(within(launcher).getAllByRole("button", { name: /^Show \d+ courses? (left|right|above|below)$/ }).length).toBeGreaterThan(0);
    expect(launcher.querySelectorAll('[data-bubble-id^="course-"] .bubble-tone-2')).toHaveLength(courses.length);
    expect(screen.getByRole("combobox", { name: "Filter Home courses by semester" })).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Semester 1" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Responsi" })).not.toBeInTheDocument();
    const initialCourse = screen.getByRole("button", { name: "Algorithm & Programming" });
    const initialTone = initialCourse.querySelector(".watch-bubble-surface")?.className;
    expect(within(initialCourse).queryByText("ALGO")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Algorithm & Programming" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your learning");
    expect(initialCourse).toHaveAttribute("aria-pressed", "true");
    expect(initialCourse.querySelector(".watch-bubble-surface")?.className).toBe(initialTone);
    expect(launcher.querySelectorAll(".watch-bubble button")).toHaveLength(courses.length + 1);
    const material = screen.getByRole("link", { name: "Materi Responsi" });
    expect(material.querySelector(".bubble-tone-0")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study Club" }).querySelector(".bubble-tone-0")).toBeInTheDocument();
    expect(material).toHaveAttribute("href", "/responsi?course=algorithm&semester=1");
    expect(launcher).toContainElement(material);
    await user.click(material);
    await screen.findByRole("link", { name: /Dynamic Programming/ });
    expect(screen.queryByRole("link", { name: /Database Systems/ })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Filter summaries by semester" })).toHaveValue("1");
  });
  it("toggles inline resources without leaving Home and preserves Search filter/focus", async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByRole("button", { name: "Database Systems" });
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter Home courses by semester" }), "3");
    expect(screen.queryByRole("button", { name: "Algorithm & Programming" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Database Systems" }));
    expect(screen.getByRole("link", { name: "Study Club" })).toHaveAttribute("href", "/study-clubs?type=Study+Club&course=database&semester=3");
    await user.click(screen.getByRole("button", { name: "Database Systems" }));
    expect(screen.queryByRole("link", { name: "Study Club" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Database Systems" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Database Systems" })).toHaveFocus();
    expect(screen.getByRole("combobox", { name: "Filter Home courses by semester" })).toHaveValue("3");
    expect(screen.queryByRole("button", { name: "Algorithm & Programming" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Search" }));
    const input = screen.getByRole("combobox", { name: "Search courses and materials" });
    await user.type(input, "algorithm");
    expect(await screen.findByRole("option", { name: /Algorithm & Programming/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("combobox", { name: "Filter Home courses by semester" })).toHaveValue("3");
    expect(screen.getByRole("button", { name: "Search" })).toHaveFocus();
  });
  it("switches the selected course and clears the inline choices when changing semesters", async () => {
    const user = userEvent.setup();
    mount();
    const algorithm = await screen.findByRole("button", { name: "Algorithm & Programming" });
    await user.click(algorithm);
    const database = screen.getByRole("button", { name: "Database Systems" });
    await user.click(database);
    expect(algorithm).toHaveAttribute("aria-pressed", "false");
    expect(database).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "Materi Responsi" })).toHaveAttribute("href", "/responsi?course=database&semester=3");
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter Home courses by semester" }), "1");
    expect(screen.queryByRole("link", { name: "Materi Responsi" })).not.toBeInTheDocument();
  });
  it("opens a course's Study Club sessions without a semester navigation step", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(await screen.findByRole("button", { name: "Database Systems" }));
    await user.click(screen.getByRole("link", { name: "Study Club" }));
    expect(await screen.findByRole("combobox", { name: "Filter events by course" })).toHaveValue("database");
    expect(screen.getByRole("combobox", { name: "Filter events by semester" })).toHaveValue("3");
    expect(screen.getByRole("button", { name: "Study Club" })).toHaveAttribute("aria-pressed", "true");
  });
  it("keeps semester filtering when switching schedule types", async () => {
    const user = userEvent.setup();
    mount("/study-clubs?type=Study+Club&semester=1&month=2026-11");
    await screen.findByRole("heading", { name: "November 2026" });
    const agenda = screen.getByRole("region", { name: "This month's sessions" });
    expect(within(agenda).getByRole("link", { name: /Algorithm Study Club/ })).toBeInTheDocument();
    expect(within(agenda).queryByRole("link", { name: /Database Study Club/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Responsi" }));
    expect(within(agenda).queryByRole("link", { name: /Computer Architecture Responsi/ })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Filter events by semester" })).toHaveValue("1");
  });
  it("keeps Search available without inventing courses in an empty catalog", async () => {
    const user = userEvent.setup();
    mount("/", { courses: [], summaries: [], events: [] });
    expect(await screen.findByRole("heading", { name: "No courses available yet" })).toBeInTheDocument();
    const launcher = screen.getByRole("group", { name: "Draggable learning launcher" });
    expect(within(launcher).getAllByRole("button")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("combobox", { name: "Search courses and materials" })).toBeInTheDocument();
  });
  it("searches from Home and opens a readable summary without login", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.click(
      screen.getByRole("combobox", { name: "Search courses and materials" }),
    );
    await user.paste("normalization");
    await user.click(screen.getByRole("button", { name: "Search resources" }));
    await user.click(
      await screen.findByRole("link", { name: /Database Normalization/ }),
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Database Normalization",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole(
        "heading",
        { name: "Normal forms" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });

  it("combines summary-title search with course filtering and clears an empty result", async () => {
    const user = userEvent.setup();
    mount("/responsi?q=dynamic&course=database");
    expect(
      await screen.findByRole("heading", { name: "No summaries found" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(
      await screen.findByRole("link", { name: /Algorithm & Programming/ }),
    ).toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by course" }),
      "calculus",
    );
    expect(
      screen.getByRole("link", { name: /Limits & Derivatives/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Dynamic Programming/ }),
    ).not.toBeInTheDocument();
  });

  it("shows both session types, filters, and opens event details", async () => {
    const user = userEvent.setup();
    mount("/study-clubs?month=2026-11");
    await screen.findByRole("heading", { name: "November 2026" });
    await user.click(screen.getByRole("button", { name: "Responsi" }));
    expect(screen.getByRole("group", { name: "Event type" })).toHaveAttribute("data-active-index", "2");
    const agenda = screen.getByRole("region", {
      name: "This month's sessions",
    });
    expect(
      within(agenda).queryByRole("link", { name: /Algorithm Study Club/ }),
    ).not.toBeInTheDocument();
    await user.click(
      within(agenda).getByRole("link", {
        name: /Computer Architecture Responsi/,
      }),
    );
    expect(
      await screen.findByRole("heading", { name: "Session details" }),
    ).toBeInTheDocument();
    expect(screen.getByText("19:00–21:00 WIB")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Open registration/ }),
    ).not.toBeInTheDocument();
  });

  it("shows no invented videos and handles missing resources", async () => {
    mount("/videos");
    expect(
      await screen.findByRole("heading", {
        name: "No recordings available yet",
      }),
    ).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("embeds a valid supplied recording and preserves its course relationship", async () => {
    mount("/videos?event=algorithm-study-club", {
      courses,
      summaries,
      events: [
        {
          ...events[0],
          recordingUrl: "https://www.youtube.com/watch?v=abcdefghijk",
        },
      ],
    });
    const player = await screen.findByTitle("Algorithm Study Club recording");
    expect(player).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/abcdefghijk",
    );
    expect(screen.getByRole("link", { name: "Open course" })).toHaveAttribute(
      "href",
      "/courses/algorithm",
    );
  });

  it("does not expose a nonexistent summary", async () => {
    mount("/responsi/private-or-expired");
    expect(
      await screen.findByRole("heading", { name: "Summary not available" }),
    ).toBeInTheDocument();
  });

  it("opens and closes mobile navigation with Escape", async () => {
    const user = userEvent.setup();
    mount();
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    within(screen.getByRole("navigation", { name: "Main navigation" }))
      .getByRole("link", { name: "Videos" })
      .focus();
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("renders mathematical content and highlighted code", async () => {
    mount("/responsi/dynamic-programming");
    await screen.findByRole("heading", { name: "A Fibonacci example" });
    expect(document.querySelector(".katex")).not.toBeNull();
    expect(document.querySelector("code.hljs")).not.toBeNull();
  });

  it("shows only supplied external actions and informational quota", async () => {
    mount("/study-clubs/algorithm-study-club", {
      courses,
      summaries,
      events: [
        {
          ...events[0],
          quota: 50,
          registrationUrl: "https://example.org/register",
          meetingUrl: "https://example.org/meeting",
        },
      ],
    });
    expect(
      await screen.findByText("50 participants (informational)"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open registration/ }),
    ).toHaveAttribute("href", "https://example.org/register");
    expect(screen.getByRole("link", { name: /Open meeting/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("keeps unpublished course resources empty instead of borrowing another course's data", async () => {
    mount("/courses/networks");
    expect(
      await screen.findByRole("heading", {
        name: "No summaries published yet",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No sessions scheduled" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Dynamic Programming/ }),
    ).not.toBeInTheDocument();
  });
});

describe("public input helpers", () => {
  it("searches titles, not summary bodies", () => {
    expect(findSummaries(summaries, "Fibonacci", "")).toHaveLength(0);
    expect(findSummaries(summaries, " DYNAMIC ", "algorithm")).toHaveLength(1);
  });
  it("rejects untrusted embeds and unsafe external links", () => {
    expect(
      youtubeEmbedUrl("https://youtube.com.evil.test/watch?v=abcdefghijk"),
    ).toBeNull();
    expect(youtubeEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(youtubeEmbedUrl("https://youtu.be/abcdefghijk")).toBe(
      "https://www.youtube-nocookie.com/embed/abcdefghijk",
    );
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(safeExternalUrl("https://example.org/meeting")).toBe(
      "https://example.org/meeting",
    );
  });
});
