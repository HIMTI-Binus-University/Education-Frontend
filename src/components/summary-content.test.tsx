import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SummaryContent from "./summary-content";
import { summaries } from "../test/fixtures/education";

describe("Tiptap public reader", () => {
  it("renders a read-only block document with math, code, table, and anchors", async () => {
    render(<SummaryContent summary={summaries[0]} />);
    const document = await screen.findByRole("document", {
      name: "Dynamic Programming summary",
    });
    expect(document).toHaveAttribute("contenteditable", "false");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Before the exam" }),
    ).toHaveAttribute("id", "section-4");
    expect(
      screen.getByRole("region", { name: "Summary table" }),
    ).toHaveAttribute("tabindex", "0");
    expect(document.querySelector("strong")).toHaveTextContent(
      "Overlapping subproblems:",
    );
    expect(document.querySelector(".katex")).not.toBeNull();
    expect(document.querySelector("code .hljs-keyword")).not.toBeNull();
    expect(screen.getByRole("link", { name: "C++ reference" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("recreates the document when the selected summary changes", async () => {
    const view = render(<SummaryContent summary={summaries[0]} />);
    await screen.findByRole("document", {
      name: "Dynamic Programming summary",
    });
    view.rerender(<SummaryContent summary={summaries[3]} />);
    const document = await screen.findByRole("document", {
      name: "Limits & Derivatives summary",
    });
    expect(
      document.querySelector('[data-type="block-math"] .katex'),
    ).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: "The limit definition" }),
    ).toHaveAttribute("id", "section-1");
    expect(
      screen.queryByRole("heading", { name: "A Fibonacci example" }),
    ).not.toBeInTheDocument();
  });

  it("allows public image URLs without rendering unsafe link or image protocols", async () => {
    render(
      <SummaryContent
        summary={{
          ...summaries[0],
          id: "url-safety",
          title: "URL safety fixture",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Unsafe link",
                    marks: [
                      { type: "link", attrs: { href: "javascript:alert(1)" } },
                    ],
                  },
                ],
              },
              {
                type: "image",
                attrs: { src: "javascript:alert(1)", alt: "Invalid image" },
              },
              {
                type: "image",
                attrs: {
                  src: "https://example.org/fixture.png",
                  alt: "Public image fixture",
                },
              },
            ],
          },
        }}
      />,
    );
    const document = await screen.findByRole("document", {
      name: "URL safety fixture summary",
    });
    expect(document.querySelector('[href^="javascript:"]')).toBeNull();
    expect(document.querySelector('[src^="javascript:"]')).toBeNull();
    expect(
      screen.getByRole("img", { name: "Public image fixture" }),
    ).toHaveAttribute("src", "https://example.org/fixture.png");
    expect(
      screen.getByRole("img", { name: "Public image fixture" }),
    ).toHaveAttribute("loading", "lazy");
  });
});
