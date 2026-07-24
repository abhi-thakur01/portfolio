import React, { useState, useEffect } from "react";
import { Mail, ArrowUp, Phone, Globe, ExternalLink } from "lucide-react";
import { NAV_LINKS, PERSONAL_INFO } from "../data/portfolioData";

export const Footer: React.FC = () => {
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setIstTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-16 bg-[#07070d] border-t border-white/10 text-gray-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/5">
          <div>
            <a href="#home" className="flex items-center gap-2 mb-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#c9a227]/20 border border-[#c9a227]/40 flex items-center justify-center text-[#f0d060] font-mono font-bold text-xs">
                AT
              </div>
              <span className="font-display font-bold text-lg text-white">
                Abhishek Thakur
              </span>
            </a>
            <p className="text-gray-400 text-xs max-w-sm">
              Junior Web Designer · WordPress &amp; CMS Specialist · Agency Client Delivery at Gigsoft Pro.
            </p>
          </div>

          {/* Live India Standard Time Card */}
          <div className="p-3.5 rounded-xl bg-[#121222] border border-white/10 flex items-center gap-3 font-mono text-[11px]">
            <Globe className="w-4 h-4 text-[#f0d060] shrink-0" />
            <div>
              <div className="text-gray-400">India Time (IST):</div>
              <div className="text-white font-bold">{istTime || "Loading..."}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-wrap gap-4 sm:gap-6 list-none p-0 m-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-[#f0d060] transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px]">
          <div>
            © {new Date().getFullYear()} Abhishek Thakur. All rights reserved. Built with React &amp; Tailwind.
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-300 hover:text-[#f0d060] transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`mailto:${PERSONAL_INFO.primaryEmail}`}
              className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-300 hover:text-[#f0d060] transition-colors"
              aria-label="Send Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>

            <a
              href={`tel:${PERSONAL_INFO.phone}`}
              className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-300 hover:text-[#f0d060] transition-colors"
              aria-label="Call Phone"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#f0d060] hover:bg-[#c9a227] hover:text-[#08080f] transition-all ml-2"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
