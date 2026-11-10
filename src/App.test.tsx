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
  findSummaries,
  youtubeEmbedUrl,
  safeExternalUrl,
} from "./data/demo";

function mount(
  path = "/",
  data?: {
    courses: typeof courses;
    events: typeof events;
    summaries: typeof summaries;
  },
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  if (data) client.setQueryData(["education", "demo"], data);
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
    const input = screen.getByRole("combobox", {
      name: "Search courses and materials",
    });
    expect(input).toHaveAttribute("aria-expanded", "false");
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

  it("shows an honest empty recommendation state when no courses are supplied", async () => {
    const user = userEvent.setup();
    mount("/", { courses: [], summaries: [], events: [] });
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
  it("offers an introductory heading, search, and a real scroll destination", async () => {
    mount();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Your learning, all in one place/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Scroll to explore" }),
    ).toHaveAttribute("href", "#home-resources");
    await screen.findByRole("heading", { name: "Explore courses" });
    const responsi = screen.getByRole("region", { name: "Latest Responsi" });
    expect(
      within(responsi).getByRole("link", { name: /Algorithm & Programming/ }),
    ).toHaveAttribute("href", "/courses/algorithm");
    expect(
      within(responsi).queryByRole("link", { name: /Dynamic Programming/ }),
    ).not.toBeInTheDocument();
    expect(document.getElementById("home-resources")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("home-scroll");
  });
  it("searches from Home and opens a readable summary without login", async () => {
    const user = userEvent.setup();
    mount();
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
