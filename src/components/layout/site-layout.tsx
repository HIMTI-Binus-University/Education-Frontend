import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AppOpening from "../app-opening";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/study-clubs", label: "Schedule" },
  { to: "/videos", label: "Videos" },
];

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="HIMTI Education home">
      <img
        data-himti-brand-target
        src="/logo-himti.png"
        alt=""
        width="42"
        height="46"
      />
      <span>
        <strong>HIMTI BINUS</strong>
        <span>Education</span>
      </span>
    </Link>
  );
}

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    window.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (navigationRef.current?.contains(document.activeElement)) {
          menuButtonRef.current?.focus();
        }
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`site-shell${location.pathname === "/" ? " is-home" : ""}`}>
      <AppOpening />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Brand />
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav
          ref={navigationRef}
          id="main-navigation"
          aria-label="Main navigation"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => {
                setMenuOpen(false);
                if (menuOpen) menuButtonRef.current?.focus();
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <div
          key={location.pathname}
          className={`page-transition${location.pathname === "/" ? " home-page-transition" : ""}`}
        >
          <Outlet />
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <Brand />
          <nav aria-label="Footer navigation">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="demo-notice">
          Frontend preview · All academic content and schedules are demo data,
          not official publications.
        </p>
      </footer>
    </div>
  );
}
