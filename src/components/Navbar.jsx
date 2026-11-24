import { useState, useEffect, useRef } from "react";
import { Menu, X, Download, Sun, Moon } from "lucide-react";
import { navLinks, personal, site } from "../data/content";
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const { theme, toggle } = useTheme();
  const menuButtonRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        const sections = navLinks.map((l) => l.href.replace("#", ""));
        for (const id of [...sections].reverse()) {
          const el = document.getElementById(id);
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActive(`#${id}`);
            break;
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-1.5 font-bold text-lg text-[var(--text-strong)] tracking-tight">
          <span className="text-blue-400 font-mono text-base">&lt;/&gt;</span>
          <span>
            {(() => {
              const nameParts = String(personal.name || "Abhishek Thakur").trim().split(/\s+/);
              if (nameParts.length < 2) return personal.name;
              return <>{nameParts[0]}<span className="text-blue-400">{nameParts.slice(1).join(" ")}</span></>;
            })()}
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors relative py-1 ${
                active === link.href
                  ? "text-blue-400 font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
              }`}
              aria-current={active === link.href ? "page" : undefined}
            >
              {link.label}
              {active === link.href && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            className="p-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-blue-400 hover:border-blue-500/40 transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href={personal.resumeUrl || "#"}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/50 text-blue-400 text-sm font-medium hover:bg-blue-500/10 transition-colors"
          >
            {site.header?.ctaText || "Resume"}
            <Download className="w-3.5 h-3.5" />
          </a>

          <button
            ref={menuButtonRef}
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            type="button"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          className="lg:hidden bg-[var(--panel)] border-b border-[var(--border)] px-4 py-4 space-y-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[var(--text-muted)] hover:text-blue-400 text-sm"
              aria-current={active === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
          <a
            href={personal.resumeUrl || "#"}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full border border-blue-500/50 text-blue-400 text-sm"
          >
            {site.header?.ctaText || "Download Resume"} <Download className="w-3.5 h-3.5" />
          </a>
        </nav>
      )}
    </header>
  );
}
