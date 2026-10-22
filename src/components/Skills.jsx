import { useMemo, useState, useEffect } from "react";
import { skillIcons, skillCategories } from "../data/content";
import { TextReveal, Stagger, ClipReveal, MouseGlow } from "./motion";

export function Skills() {
  const skills = Array.isArray(skillIcons) ? skillIcons : [];

  const tabs = useMemo(() => {
    const fromConfig = (Array.isArray(skillCategories) ? skillCategories : [])
      .filter((c) => c && c.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((c) => ({
        key: String(c.id),
        label: c.label || c.id,
      }));

    if (fromConfig.length) return fromConfig;

    const seen = new Set();
    const list = [];
    skills.forEach((s) => {
      const cat = s.category || "Other";
      if (!seen.has(cat)) {
        seen.add(cat);
        list.push({ key: cat, label: cat });
      }
    });
    return list.length ? list : [{ key: "Other", label: "Other" }];
  }, [skills]);

  const [active, setActive] = useState(tabs[0]?.key || "Frontend");

  useEffect(() => {
    if (!tabs.find((t) => t.key === active) && tabs[0]) {
      setActive(tabs[0].key);
    }
  }, [tabs, active]);

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
    <section id="skills" className="py-14 sm:py-20 overflow-hidden relative section-ambient">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] bg-blue-600/6 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <MouseGlow color="99, 102, 241" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
            My Skills
          </p>
          <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-3" stagger={50}>
            Technologies & Tools
          </TextReveal>
          <ClipReveal delay={150}>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              Frontend code, CMS platforms, and version control tools I use daily.
            </p>
          </ClipReveal>
        </div>

        {tabs.length > 0 && (
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="inline-flex flex-wrap justify-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {tabs.map((tab) => {
                const isActive = active === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActive(tab.key)}
                    className={`relative px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
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
        )}

        <Stagger
          key={active}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3"
          delay={40}
          step={45}
          from="scale"
        >
          {visible.map((skill) => (
            <div
              key={skill.name}
              className="group relative flex flex-col items-center gap-2.5 p-3.5 sm:p-4 rounded-xl bg-[#111827]/80 border border-white/[0.06] transition-all duration-400 hover:-translate-y-2 hover:border-white/15"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 16px 32px ${skill.color}22`;
                e.currentTarget.style.borderColor = `${skill.color}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold overflow-hidden transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"
                style={{
                  background: skill.image
                    ? "rgba(255,255,255,0.06)"
                    : `linear-gradient(135deg, ${skill.color}28, ${skill.color}08)`,
                  color: skill.color,
                  border: `1px solid ${skill.color}30`,
                }}
              >
                {skill.image ? (
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector(".skill-fallback")) {
                        const span = document.createElement("span");
                        span.className = "skill-fallback";
                        span.textContent = skill.name.slice(0, 2).toUpperCase();
                        parent.appendChild(span);
                      }
                    }}
                  />
                ) : (
                  skill.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-gray-400 group-hover:text-white text-center leading-tight transition-colors duration-300">
                {skill.name}
              </span>
            </div>
          ))}
        </Stagger>

        {visible.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">No skills in this tab yet.</p>
        )}
      </div>
    </section>
  );
}
