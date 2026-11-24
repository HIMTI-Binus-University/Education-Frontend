import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReaderOutline from "./reader-outline";

describe("Reader outline scroll tracking", () => {
  it("keeps the clicked section active during scrolling, then resumes tracking on user interruption", async () => {
    const geometry = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: this.id === "section-1" ? 1200 : 100,
          bottom: 1400,
        } as DOMRect;
      });
    const contentHeight = vi
      .spyOn(document.documentElement, "scrollHeight", "get")
      .mockReturnValue(3000);
    try {
      render(
        <div className="reader-layout">
          <ReaderOutline headings={["Opening section", "Target section"]} />
          <article className="reader-article">
            <h2 id="section-0">Opening section</h2>
            <h2 id="section-1">Target section</h2>
          </article>
        </div>,
      );
      const target = screen.getByRole("link", { name: "Target section" });
      fireEvent.click(target);
      await waitFor(() => expect(window.location.hash).toBe("#section-1"));
      act(() => window.dispatchEvent(new Event("scroll")));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(target).toHaveAttribute("aria-current", "location");
      fireEvent.wheel(window);
      await waitFor(() =>
        expect(
          screen.getByRole("link", { name: "Opening section" }),
        ).toHaveAttribute("aria-current", "location"),
      );
    } finally {
      window.history.replaceState(null, "", "/");
      geometry.mockRestore();
      contentHeight.mockRestore();
    }
  });
  it("highlights the final section at the scroll limit and respects a clicked clamped anchor", async () => {
    const geometry = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: this.id === "section-1" ? 500 : 200,
          bottom: 600,
        } as DOMRect;
      });
    vi.stubGlobal("scrollY", 200);
    vi.stubGlobal("innerHeight", 1000);
    const contentHeight = vi
      .spyOn(document.documentElement, "scrollHeight", "get")
      .mockReturnValue(1200);
    try {
      render(
        <div className="reader-layout">
          <ReaderOutline headings={["Earlier section", "Before the exam"]} />
          <article className="reader-article">
            <h2 id="section-0">Earlier section</h2>
            <h2 id="section-1">Before the exam</h2>
          </article>
        </div>,
      );
      const last = screen.getByRole("link", { name: "Before the exam" });
      await waitFor(() =>
        expect(last).toHaveAttribute("aria-current", "location"),
      );
      window.history.replaceState(null, "", "#section-0");
      act(() => window.dispatchEvent(new Event("hashchange")));
      const first = screen.getByRole("link", { name: "Earlier section" });
      await waitFor(() =>
        expect(first).toHaveAttribute("aria-current", "location"),
      );
      fireEvent.click(last);
      expect(last).toHaveAttribute("aria-current", "location");
      await waitFor(() => expect(window.location.hash).toBe("#section-1"));
    } finally {
      window.history.replaceState(null, "", "/");
      geometry.mockRestore();
      vi.unstubAllGlobals();
      contentHeight.mockRestore();
    }
  });
  it("updates the active section on downward and upward scrolling without requiring a click", async () => {
    let top = 500;
    const geometry = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        return {
          top: this.id === "section-1" ? top : 100,
          bottom: 120,
        } as DOMRect;
      });
    try {
      render(
        <div className="reader-layout">
          <ReaderOutline headings={["First section", "Second section"]} />
          <article className="reader-article">
            <h2 id="section-0">First section</h2>
            <h2 id="section-1">Second section</h2>
          </article>
        </div>,
      );
      const first = screen.getByRole("link", { name: "First section" });
      const second = screen.getByRole("link", { name: "Second section" });
      await waitFor(() =>
        expect(first).toHaveAttribute("aria-current", "location"),
      );
      top = 140;
      act(() => window.dispatchEvent(new Event("scroll")));
      await waitFor(() =>
        expect(second).toHaveAttribute("aria-current", "location"),
      );
      expect(first).not.toHaveAttribute("aria-current");
      top = 500;
      act(() => window.dispatchEvent(new Event("scroll")));
      await waitFor(() =>
        expect(first).toHaveAttribute("aria-current", "location"),
      );
      expect(second).not.toHaveAttribute("aria-current");
    } finally {
      geometry.mockRestore();
    }
  });
});
