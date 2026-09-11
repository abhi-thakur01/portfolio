import { experience } from "../data/content";

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
          Work Experience
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          My professional journey
        </h2>
        <p className="text-gray-400 max-w-2xl mb-12">
          Here's a quick look at my work experience and the skills I've gained along the way.
        </p>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-blue-500/40 to-transparent" />

          <div className="space-y-10">
            {experience.map((job, idx) => (
              <div key={idx} className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#0a0e1a] border-2 border-blue-500 shadow-lg shadow-blue-500/30" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div>
                    <div className="text-xs font-mono text-blue-400 mb-1">{job.period}</div>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
