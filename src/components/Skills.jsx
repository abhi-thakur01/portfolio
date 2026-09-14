import { skillIcons } from "../data/content";
import { Reveal } from "./Reveal";

export function Skills() {
  const skills = Array.isArray(skillIcons) ? skillIcons : [];

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
              From WordPress & CMS platforms to React and Tailwind — tools I use to build fast, responsive websites.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {skills.map((skill, i) => (
            <Reveal key={skill.name} from="up" delay={Math.min(i * 40, 280)}>
              <div
                className="group relative flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl bg-[#111827]/80 border border-white/[0.06] hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ boxShadow: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${skill.color}18`;
                  e.currentTarget.style.borderColor = `${skill.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "";
                }}
              >
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
      </div>
    </section>
  );
}
