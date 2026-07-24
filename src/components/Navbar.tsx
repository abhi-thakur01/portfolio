import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { NAV_LINKS, PERSONAL_INFO } from "../data/portfolioData";

interface NavbarProps {
  onOpenEmail?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a13]/90 backdrop-blur-xl border-b border-[#c9a227]/20 py-3.5 shadow-xl shadow-black/40"
          : "bg-transparent py-5 border-b border-white/[0.05]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 group focus:outline-none"
          aria-label="Abhishek Thakur Portfolio Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a227]/20 to-[#c9a227]/5 border border-[#c9a227]/40 flex items-center justify-center text-[#f0d060] font-mono font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform">
            AT
          </div>
          <span className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center">
            <span className="text-gray-500 font-mono text-sm mr-0.5">&lt;</span>
            Abhishek
            <span className="text-[#f0d060]">.</span>
            <span className="text-gray-500 font-mono text-sm ml-0.5">/&gt;</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-[#f0d060] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c9a227] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/25 text-[11px] font-mono text-[#f0d060]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f0d060] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a227]"></span>
            </span>
            <span>Available for Hire</span>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#c9a227]/20 hover:shadow-[#c9a227]/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:text-[#f0d060] focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0c0c16]/98 border-b border-[#c9a227]/20 px-6 py-6 mt-3 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 text-xs font-mono text-[#f0d060] w-fit mb-2">
              <span className="w-2 h-2 rounded-full bg-[#f0d060] animate-pulse"></span>
              <span>Open to New Projects</span>
            </div>

            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-base font-medium text-gray-200 hover:text-[#f0d060] py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={closeMenu}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-sm shadow-md"
              >
                Start a Project
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.primaryEmail}`}
                className="w-full text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#f0d060]" />
                <span>{PERSONAL_INFO.primaryEmail}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
