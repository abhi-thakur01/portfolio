import React, { useState } from "react";
import { MapPin, Mail, Copy, ExternalLink, GraduationCap, Clock } from "lucide-react";
import { PERSONAL_INFO, ABOUT_TRAITS } from "../data/portfolioData";

interface AboutProps {
  onNotify?: (msg: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNotify }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.primaryEmail);
    setCopied(true);
    if (onNotify) {
      onNotify("Email copied to clipboard: " + PERSONAL_INFO.primaryEmail);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="about" className="py-24 relative bg-[#090912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Developer ID Card & Quick Spec Info */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-2xl bg-[#121222] border border-[#c9a227]/30 p-6 sm:p-8 text-center relative corner-bracket always-active shadow-xl shadow-black/60">
              
              {/* Monogram Avatar */}
              <div className="w-28 h-28 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#c9a227]/20 to-[#c9a227]/5 border-2 border-[#c9a227]/40 flex items-center justify-center font-display font-extrabold text-4xl text-[#f0d060] shadow-lg shadow-[#c9a227]/10">
                {PERSONAL_INFO.monogram}
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-1">
                {PERSONAL_INFO.name}
              </h3>
              <p className="font-mono text-sm text-[#f0d060] mb-4">
                {PERSONAL_INFO.agency.role}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300 mb-5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#f0d060]" />
                <span>{PERSONAL_INFO.location}</span>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 text-xs font-mono text-[#f0d060]">
                <span className="w-2 h-2 rounded-full bg-[#f0d060] animate-pulse" />
                <span>Open for Client Projects</span>
              </div>
            </div>

            {/* Sub-cards Grid: Education & Response */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/30 transition-all">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#f0d060]" />
                  <span>Education</span>
                </div>
                <div className="text-white font-bold text-sm">BCA · 2020–23</div>
                <div className="text-gray-400 text-[11px]">Computer Applications</div>
              </div>

              <div className="p-4 rounded-xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/30 transition-all">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#f0d060]" />
                  <span>Pursuing</span>
                </div>
                <div className="text-white font-bold text-sm">MCA · 2023–25</div>
                <div className="text-gray-400 text-[11px]">Master of Computer Apps</div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-4 rounded-xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#f0d060]" />
                    <span>Quick Email</span>
                  </span>
                  <Copy className="w-3 h-3 text-gray-500 group-hover:text-[#f0d060]" />
                </div>
                <div className="text-[#f0d060] font-mono text-xs truncate">
                  {copied ? "Copied to Clipboard!" : PERSONAL_INFO.primaryEmail}
                </div>
              </button>

              <div className="p-4 rounded-xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/30 transition-all">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#f0d060]" />
                  <span>Response Time</span>
                </div>
                <div className="text-white font-bold text-sm text-[#f0d060]">Within 24 Hours</div>
                <div className="text-gray-400 text-[11px]">Email &amp; WhatsApp</div>
              </div>
            </div>
          </div>

          {/* Right Narrative & Interactive Traits */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
              {"// about.me"}
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
              Designing with Purpose, <br />
              <span className="gold-gradient-text">Building with Passion.</span>
            </h2>

            <div className="space-y-4 text-gray-300 text-base leading-relaxed mb-8">
              <p>
                I'm <strong className="text-white font-semibold">Abhishek Thakur</strong>, a Junior Web Designer with 1+ year of hands-on experience building responsive, user-friendly websites. I pair a solid academic foundation in computer applications (BCA completed, MCA in progress) with real-world agency project delivery.
              </p>
              <p>
                I work predominantly with <strong className="text-white font-semibold">WordPress (Elementor &amp; Beaver Builder)</strong>, <strong className="text-white font-semibold">GoHighLevel</strong>, and <strong className="text-white font-semibold">Square Online</strong> — building custom layouts, tuning mobile responsiveness, and shipping cross-browser sites for international clients at <span className="text-[#f0d060]">Gigsoft Pro</span>.
              </p>
              <p>
                My focus is on <span className="text-[#f0d060] font-medium">clean, fast, well-built websites</span> that turn a visual mockup into a high-converting digital experience that actually works on real devices.
              </p>
            </div>

            {/* Trait Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
              {ABOUT_TRAITS.map((trait) => {
                const IconComponent = trait.icon;
                return (
                  <div
                    key={trait.label}
                    className="p-3.5 rounded-xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/40 flex items-start gap-3 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#c9a227]/10 border border-[#c9a227]/25 flex items-center justify-center text-[#f0d060] shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{trait.label}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{trait.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Languages & Social Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 text-xs font-mono text-[#f0d060]">
                English — Professional
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 text-xs font-mono text-[#f0d060]">
                Hindi — Native
              </span>
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c9a227]/40 text-xs font-mono text-gray-300 hover:text-white transition-colors"
              >
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-[#f0d060]" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
