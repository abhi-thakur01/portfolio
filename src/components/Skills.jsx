import { skillIcons, otherTools } from "../data/content";

export function Skills() {
  return (
    <section id="skills" className="py-20 bg-[#0d1220]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
          My Skills
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Technologies & Tools
        </h2>
        <p className="text-gray-400 max-w-2xl mb-12">
          These are the technologies and tools I work with to build modern and scalable
          web applications.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {skillIcons.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#111827] border border-white/8 hover:border-blue-500/40 transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{
                  background: `${skill.color}18`,
                  color: skill.color,
                  border: `1px solid ${skill.color}33`,
                }}
              >
                {skill.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors text-center">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Other Tools & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {otherTools.map((tool) => (
              <span
                key={tool}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-blue-500/30 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
