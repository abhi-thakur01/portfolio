import { useMemo, useState } from "react";
import { skillIcons } from "../data/content";
import { Reveal } from "./Reveal";

const TABS = [
  { key: "Frontend", label: "Frontend" },
  { key: "CMS", label: "CMS & Builders" },
];

export function Skills() {
  const skills = Array.isArray(skillIcons) ? skillIcons : [];
  const [active, setActive] = useState("Frontend");

  const counts = useMemo(() => {
    const c = {};
    skills.forEach((s) => {
      const cat = s.category || "Other";
      c[cat] = (c[cat] || 0) + 1;
    });
    return c;
  }, [skills]);

  const visible = useMemo(
    () => skills.filter((s) => (s.category || "Other") === active),
    [skills, active]
  );

  return (
    <section id="skills" className="py-14 sm:py-20 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal from="up">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Skills
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Technologies & Tools
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              Frontend code and the CMS platforms I use to ship client websites.
            </p>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal from="up" delay={60}>
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {TABS.map((tab) => {
                const isActive = active === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActive(tab.key)}
                    className={`relative px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 text-[11px] tabular-nums ${
                        isActive ? "text-blue-200" : "text-gray-600"
                      }`}
                    >
                      {counts[tab.key] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div
          key={active}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 animate-[fadeIn_0.3s_ease]"
        >
          {visible.map((skill, i) => (
            <Reveal key={skill.name} from="up" delay={Math.min(i * 35, 200)}>
              <div
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
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
