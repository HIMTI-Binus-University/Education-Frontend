import { useEffect, useRef, useState } from "react";

export default function ReaderOutline({ headings }: { headings: string[] }) {
  const outline = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const navigating = useRef<number | null>(null);

  useEffect(() => {
    const article = outline.current
      ?.closest(".reader-layout")
      ?.querySelector(".reader-article");
    if (!article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(
        article.querySelectorAll<HTMLElement>("h2[id]"),
      );
      if (!sections.length) return;
      const headerBottom =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .bottom ?? 0;
      const readingLine = Math.max(192, headerBottom + 80);
      let current = 0;
      let distance = Infinity;
      sections.forEach((section, index) => {
        const top = section.getBoundingClientRect().top;
        const gap = Math.abs(top - readingLine);
        if (top <= readingLine + 96 && gap < distance) {
          current = index;
          distance = gap;
        }
      });
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > 0 && window.scrollY >= maxScroll - 2) {
        current = sections.length - 1;
      }
      const targetIndex =
        navigating.current ??
        sections.findIndex(
          (section) => `#${section.id}` === window.location.hash,
        );
      if (targetIndex !== -1) {
        const target = sections[targetIndex];
        const offset =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) || 0;
        const margin =
          parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const destination = Math.max(
          0,
          Math.min(
            maxScroll,
            target.getBoundingClientRect().top +
              window.scrollY -
              offset -
              margin,
          ),
        );
        if (navigating.current !== null) current = targetIndex;
        if (Math.abs(window.scrollY - destination) <= 2) {
          current = targetIndex;
          navigating.current = null;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const release = () => {
      navigating.current = null;
      schedule();
    };
    const interrupt = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        release();
    };
    // The lazy Tiptap document can arrive after the outline mounts.
    const observer = new MutationObserver(schedule);
    observer.observe(article, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("scrollend", release);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("pointerdown", release, { passive: true });
    window.addEventListener("keydown", interrupt);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("scrollend", release);
      window.removeEventListener("wheel", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", interrupt);
    };
  }, []);

  return (
    <aside
      className="reader-outline"
      ref={outline}
      aria-label="In this summary"
    >
      <h2>In this summary</h2>
      <ol>
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#section-${index}`}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                navigating.current = index;
                setActive(index);
              }}
              aria-current={active === index ? "location" : undefined}
            >
              {heading}
            </a>
          </li>
        ))}
      </ol>
      <p>Demo content. No student login needed.</p>
    </aside>
  );
}
