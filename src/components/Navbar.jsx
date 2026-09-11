import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { navLinks, personal } from "../data/content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-1.5 font-bold text-lg text-white tracking-tight">
          <span className="text-blue-400 font-mono text-base">&lt;/&gt;</span>
          <span>Abhishek<span className="text-blue-400">Thakur</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors relative py-1 ${
                active === link.href
                  ? "text-blue-400 font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
              {active === link.href && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={personal.resumeUrl || "#"}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/50 text-blue-400 text-sm font-medium hover:bg-blue-500/10 transition-colors"
          >
            Download Resume
            <Download className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0d1220] border-b border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-gray-300 hover:text-blue-400 text-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href={personal.resumeUrl || "#"}
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full border border-blue-500/50 text-blue-400 text-sm"
          >
            Download Resume <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
}
