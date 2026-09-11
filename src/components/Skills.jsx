import { skillIcons, otherTools } from "../data/content";

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Skills
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Technologies & Tools
            </h2>
            <p className="text-gray-400 leading-relaxed text-[15px] mb-6">
              I work with modern technologies to build scalable and performant web applications — from WordPress & CMS platforms to React and Tailwind.
            </p>
            <div className="flex flex-wrap gap-2">
              {otherTools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {skillIcons.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#111827] border border-white/8 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `${skill.color}18`,
                    color: skill.color,
                    border: `1px solid ${skill.color}30`,
                  }}
                >
                  {skill.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-white text-center leading-tight">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
