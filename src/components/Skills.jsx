import { skillIcons, otherTools } from "../data/content";
import { Reveal } from "./Reveal";

export function Skills() {
  const skills = Array.isArray(skillIcons) ? skillIcons : [];
  const tools = Array.isArray(otherTools) ? otherTools : [];

  return (
    <section id="skills" className="py-14 sm:py-20 overflow-hidden relative">
      {/* subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header — centered */}
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Skills
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Technologies & Tools
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              From WordPress & CMS platforms to React and Tailwind — tools I use to build fast, responsive websites.
            </p>
          </div>
        </Reveal>

        {/* Skills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {skills.map((skill, i) => (
            <Reveal key={skill.name} from="up" delay={Math.min(i * 40, 280)}>
              <div
                className="group relative flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${skill.color}18`;
                  e.currentTarget.style.borderColor = `${skill.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "";
                }}
              >
                {/* colored top accent line */}
                <div
                  className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: skill.color }}
                />

                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${skill.color}22, ${skill.color}0a)`,
                    color: skill.color,
                    border: `1px solid ${skill.color}30`,
                    boxShadow: `0 0 20px ${skill.color}12`,
                  }}
                >
                  {skill.name.slice(0, 2).toUpperCase()}
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-white text-center leading-tight transition-colors">
                  {skill.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Other tools */}
        {tools.length > 0 && (
          <Reveal from="up" delay={200}>
            <div className="rounded-2xl border border-white/[0.06] bg-[#0d1220]/60 px-5 py-5 sm:px-8 sm:py-6">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-4 text-center">
                Also working with
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs sm:text-[13px] text-gray-400 hover:text-gray-200 hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
