import { useMemo } from "react";
import { skillIcons } from "../data/content";
import { Reveal } from "./Reveal";

const CATEGORY_ORDER = ["Frontend", "CMS", "Design", "Tools", "Other"];

const CATEGORY_META = {
  Frontend: {
    label: "Frontend",
    desc: "Languages, frameworks & UI libraries",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  CMS: {
    label: "CMS & Builders",
    desc: "Platforms I ship client sites on",
    accent: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  Design: {
    label: "Design",
    desc: "UI design & prototyping",
    accent: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
  },
  Tools: {
    label: "Tools",
    desc: "Dev workflow & tooling",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
  },
  Other: {
    label: "Other",
    desc: "",
    accent: "text-gray-400",
    border: "border-white/10",
    bg: "bg-white/5",
  },
};

export function Skills() {
  const skills = Array.isArray(skillIcons) ? skillIcons : [];

  const groups = useMemo(() => {
    const map = {};
    skills.forEach((s) => {
      const cat = s.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return CATEGORY_ORDER.filter((c) => map[c]?.length).map((c) => ({
      key: c,
      meta: CATEGORY_META[c] || CATEGORY_META.Other,
      items: map[c],
    }));
  }, [skills]);

  return (
    <section id="skills" className="py-14 sm:py-20 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Skills
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Technologies & Tools
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              Grouped by what I use them for — frontend code, CMS platforms, design and tooling.
            </p>
          </div>
        </Reveal>

        <div className="space-y-8 sm:space-y-10">
          {groups.map((group, gi) => (
            <Reveal key={group.key} from="up" delay={gi * 80}>
              <div>
                <div className="flex items-end justify-between gap-3 mb-4">
                  <div>
                    <h3 className={`text-sm sm:text-base font-semibold ${group.meta.accent}`}>
                      {group.meta.label}
                    </h3>
                    {group.meta.desc && (
                      <p className="text-xs text-gray-500 mt-0.5">{group.meta.desc}</p>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600 tabular-nums">
                    {group.items.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                  {group.items.map((skill) => (
                    <div
                      key={skill.name}
                      className="group relative flex flex-col items-center gap-2.5 p-3.5 sm:p-4 rounded-xl bg-[#111827]/80 border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 24px ${skill.color}15`;
                        e.currentTarget.style.borderColor = `${skill.color}35`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "";
                      }}
                    >
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${skill.color}22, ${skill.color}08)`,
                          color: skill.color,
                          border: `1px solid ${skill.color}28`,
                        }}
                      >
                        {skill.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-400 group-hover:text-white text-center leading-tight transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
