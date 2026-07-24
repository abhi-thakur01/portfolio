import React from "react";
import { Globe, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";
import { PROJECTS, PERSONAL_INFO } from "../data/portfolioData";

export const Work: React.FC = () => {
  return (
    <section id="work" className="py-24 relative bg-[#090912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
            {"// selected-work"}
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Work That <span className="gold-gradient-text">Converts &amp; Delights</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Real client projects shipped for businesses worldwide — tuned for speed, polished on mobile, and built on reliable CMS foundations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-[#121222] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#c9a227]/50 hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-black/60 group corner-bracket"
            >
              <div>
                {/* Top Badge & Metric */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                      {project.platform}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#c9a227]/15 border border-[#c9a227]/30 text-xs font-mono font-bold text-[#f0d060]">
                    {project.metrics.value}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-[#f0d060] transition-colors">
                  {project.title}
                </h3>

                {/* Direct Live URL Link */}
                <a
                  href={project.href}
                  target={project.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f0d060] hover:underline mb-4"
                >
                  <span>{project.url}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {project.desc}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f0d060] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Agency Banner: Gigsoft Pro Experience */}
        <div className="rounded-2xl bg-gradient-to-r from-[#121222] via-[#15152a] to-[#121222] border border-[#c9a227]/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c9a227]/15 border border-[#c9a227]/40 flex items-center justify-center text-[#f0d060] shrink-0 mt-1">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-bold text-lg text-white">
                  {PERSONAL_INFO.agency.role} · {PERSONAL_INFO.agency.company}
                </h4>
                <span className="px-2 py-0.5 rounded bg-[#c9a227]/20 text-[11px] font-mono text-[#f0d060]">
                  {PERSONAL_INFO.agency.period}
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {PERSONAL_INFO.agency.desc}
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-[#c9a227] text-white hover:text-[#08080f] text-xs font-bold font-mono transition-all border border-white/10 hover:border-[#c9a227] whitespace-nowrap"
          >
            Hire for Your Team
          </a>
        </div>

      </div>
    </section>
  );
};
