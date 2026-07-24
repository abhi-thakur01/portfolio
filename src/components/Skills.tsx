import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  SKILL_BARS,
  TAG_CLOUD,
  TOOLS_ROW_1,
  TOOLS_ROW_2
} from "../data/portfolioData";

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Skills" },
    { id: "cms", label: "WordPress & CMS" },
    { id: "frontend", label: "Frontend & Code" },
    { id: "performance", label: "Speed & Performance" },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? SKILL_BARS
      : SKILL_BARS.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative bg-[#07070d]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
            {"// skills.json"}
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            My Design &amp; <span className="gold-gradient-text">Build Arsenal</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            From core web fundamentals to no-code CMS builders — the full toolkit for shipping fast, modern, and conversion-optimized websites.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-[#c9a227] text-[#08080f] font-bold shadow-md shadow-[#c9a227]/30"
                    : "bg-[#141424] text-gray-300 hover:text-white border border-white/10 hover:border-[#c9a227]/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-16">
          {filteredSkills.map((skill) => (
            <div
              key={skill.label}
              className="p-4 rounded-xl bg-[#121222]/80 border border-white/5 hover:border-[#c9a227]/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-[#f0d060] transition-colors">
                  {skill.label}
                </span>
                <span className="font-mono text-xs font-bold text-[#f0d060]">
                  {skill.pct}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a227] via-[#f0d060] to-[#e8a020] transition-all duration-1000 ease-out"
                  style={{ width: `${skill.pct}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400 font-mono">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Tag Cloud */}
        <div className="mb-16">
          <div className="text-center font-mono text-xs text-gray-400 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#f0d060]" />
            <span>Interactive Tech Tags (Click to Highlight)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {TAG_CLOUD.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    isSelected
                      ? "bg-[#c9a227] text-[#08080f] font-bold scale-105 shadow-md shadow-[#c9a227]/40"
                      : "bg-[#141424] text-gray-300 hover:text-white border border-white/10 hover:border-[#c9a227]/40 hover:-translate-y-0.5"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Infinite Tool Marquee Rails */}
        <div className="rounded-2xl bg-[#10101f] border border-white/10 p-6 overflow-hidden">
          <div className="text-center font-mono text-xs text-gray-400 uppercase tracking-widest mb-6">
            Platforms &amp; Technologies I Build On
          </div>

          {/* Marquee Row 1 */}
          <div className="overflow-hidden mb-3.5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-left gap-3">
              {[...TOOLS_ROW_1, ...TOOLS_ROW_1, ...TOOLS_ROW_1].map((tool, idx) => (
                <div
                  key={tool + idx}
                  className="px-5 py-2.5 rounded-xl bg-[#18182d] border border-white/10 text-xs font-mono text-gray-200 whitespace-nowrap hover:border-[#c9a227]/50 hover:text-[#f0d060] transition-colors"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 2 */}
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-right gap-3">
              {[...TOOLS_ROW_2, ...TOOLS_ROW_2, ...TOOLS_ROW_2].map((tool, idx) => (
                <div
                  key={tool + idx}
                  className="px-5 py-2.5 rounded-xl bg-[#18182d] border border-white/10 text-xs font-mono text-gray-200 whitespace-nowrap hover:border-[#c9a227]/50 hover:text-[#f0d060] transition-colors"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
