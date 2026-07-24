import React, { useState } from "react";
import { Clock } from "lucide-react";
import { PROCESS } from "../data/portfolioData";

export const Process: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>("01");

  return (
    <section id="process" className="py-24 relative bg-[#07070d]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
            {"// build.pipeline"}
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            How I Build <span className="gold-gradient-text">Excellence</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            A battle-tested 6-step workflow shaped by real client projects — keeping you informed, on schedule, and thrilled with the final website.
          </p>
        </div>

        {/* Timeline Stream */}
        <div className="relative">
          {/* Vertical central gold gradient line (hidden on mobile, centered on desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#c9a227] via-[#f0d060]/40 to-transparent" />

          <div className="space-y-12">
            {PROCESS.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const isSelected = activePhase === step.phase;

              return (
                <div
                  key={step.phase}
                  onClick={() => setActivePhase(step.phase)}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative cursor-pointer group`}
                >
                  {/* Step Timeline Indicator Node */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-[#121222] border-2 border-[#c9a227] items-center justify-center text-[11px] font-mono font-bold text-[#f0d060] shadow-lg shadow-[#c9a227]/30 z-10 group-hover:scale-110 transition-transform">
                    {step.phase}
                  </div>

                  {/* Left Column Content */}
                  <div
                    className={`${
                      isEven ? "md:text-right md:pr-12" : "md:order-2 md:text-left md:pl-12"
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/25 text-xs font-mono text-[#f0d060] mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{step.duration}</span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-white group-hover:text-[#f0d060] transition-colors">
                      {step.title}
                    </h3>
                    <div className="font-mono text-xs text-[#c9a227] mt-0.5">
                      {step.sub}
                    </div>
                  </div>

                  {/* Right Column Card */}
                  <div
                    className={`${
                      isEven ? "md:pl-12" : "md:order-1 md:pr-12"
                    }`}
                  >
                    <div
                      className={`p-6 rounded-2xl bg-[#121222] border transition-all duration-300 ${
                        isSelected
                          ? "border-[#c9a227] shadow-xl shadow-[#c9a227]/15 scale-[1.02]"
                          : "border-white/10 group-hover:border-[#c9a227]/40"
                      }`}
                    >
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                        {step.desc}
                      </p>

                      {/* Deliverable Pill */}
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between mb-4">
                        <span className="text-[11px] text-gray-400 font-mono">Deliverable:</span>
                        <span className="text-xs font-mono font-semibold text-[#f0d060]">
                          {step.deliverable}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
