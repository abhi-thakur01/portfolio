import { ExternalLink, FolderGit2, ArrowRight } from "lucide-react";
import { projects } from "../data/content";

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-[#0d1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              My Projects
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-lg text-[15px]">
              Here are some of my recent projects. Each project helped me learn something new and improve my skills.
            </p>
          </div>
          <a
            href={projects[0]?.link || "#contact"}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 shrink-0"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-to-br from-[#1a2234] to-[#0d1220] flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-blue-500/30">
                    <FolderGit2 className="w-14 h-14" />
                    <span className="text-[10px] font-mono text-gray-600">{project.category}</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target={project.link?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  View Project
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
