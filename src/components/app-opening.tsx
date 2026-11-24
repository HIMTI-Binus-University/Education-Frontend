import { useEffect, useRef } from "react";

const sessionKey = "himti-education-intro-seen";

export default function AppOpening() {
  const overlay = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const surface = overlay.current;
    const logo = mark.current;
    const target = document.querySelector<HTMLElement>(
      "[data-himti-brand-target]",
    );
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!surface || !logo || !target || !logo.animate || media?.matches) return;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
    } catch {
      /* Storage restrictions must not block the opening. */
    }

    const bounds = target.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2 - window.innerWidth / 2;
    const y = bounds.top + bounds.height / 2 - window.innerHeight / 2;
    surface.style.visibility = "visible";
    const movement = logo.animate(
      [
        { transform: "rotate(0deg)", offset: 0 },
        { transform: "rotate(360deg)", offset: 0.5 },
        {
          transform: `translate(${x}px, ${y}px) rotate(360deg) scale(${bounds.width / 92})`,
          offset: 1,
        },
      ],
      { duration: 920, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
    );
    const fade = surface.animate([{ opacity: 1 }, { opacity: 0 }], {
      delay: 800,
      duration: 180,
      fill: "forwards",
      easing: "ease-out",
    });
    let active = true;
    const dismiss = () => {
      surface.style.visibility = "hidden";
      movement.cancel();
      fade.cancel();
    };
    const reduce = () => {
      if (media?.matches) dismiss();
    };
    media?.addEventListener("change", reduce);
    fade.finished
      .then(() => {
        if (!active) return;
        surface.style.visibility = "hidden";
        try {
          sessionStorage.setItem(sessionKey, "1");
        } catch {
          /* Optional session preference. */
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      media?.removeEventListener("change", reduce);
      dismiss();
    };
  }, []);

  return (
    <div className="brand-intro" ref={overlay} aria-hidden="true">
      <img ref={mark} src="/logo-himti.png" width="92" height="92" alt="" />
    </div>
  );
}
