import { ArrowRight, Send } from "lucide-react";
import { experience } from "../data/content";

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-[#0d1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Experience
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Work Experience
            </h2>
            <p className="text-gray-400 text-[15px] mb-10 max-w-md">
              My professional journey so far — where I've worked, what I've learned and the skills I've grown.
            </p>

            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-blue-500/30 to-transparent" />

              <div className="space-y-8">
                {experience.map((job, idx) => (
                  <div key={idx} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#0a0e1a] border-2 border-blue-500" />

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1.5">
                      <div>
                        <div className="text-xs font-mono text-blue-400 mb-1">{job.period}</div>
                        <h3 className="text-base font-semibold text-white">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="lg:col-span-2 flex items-center">
            <div className="w-full p-8 rounded-2xl bg-[#111827] border border-white/8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Send className="w-6 h-6" />
              </div>
              <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
                Let's Work Together
              </p>
              <h3 className="text-xl font-bold text-white mb-3">
                Have a project in mind?
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                I'm always open to new opportunities, collaborations or just a friendly chat.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/25"
              >
                Get In Touch
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
