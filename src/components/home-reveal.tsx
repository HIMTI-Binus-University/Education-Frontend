import { useEffect, useRef, type ReactNode } from "react";

export default function HomeReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (
      media?.matches ||
      !window.IntersectionObserver ||
      !Element.prototype.animate
    )
      return;
    const sections = Array.from(root.current?.children ?? []) as HTMLElement[];
    const animations = new Map<HTMLElement, Animation>();
    const reveal = (section: HTMLElement) => {
      animations.get(section)?.play();
      observer.unobserve(section);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { threshold: 0.08 },
    );
    sections.forEach((section) => {
      const animation = section.animate(
        [
          { opacity: 0, transform: "translateY(28px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" },
      );
      animation.pause();
      animations.set(section, animation);
      observer.observe(section);
    });
    const focus = (event: FocusEvent) => {
      sections.forEach((section) => {
        if (section.contains(event.target as Node))
          animations.get(section)?.finish();
      });
    };
    const disable = () => {
      if (media?.matches) animations.forEach((animation) => animation.cancel());
    };
    const container = root.current;
    container?.addEventListener("focusin", focus);
    media?.addEventListener("change", disable);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      container?.removeEventListener("focusin", focus);
      media?.removeEventListener("change", disable);
    };
  }, []);
  return (
    <div className="home-content" id="home-resources" ref={root}>
      {children}
    </div>
  );
}
