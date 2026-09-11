import { useState } from "react";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { projects } from "../data/content";

const filters = ["All", "React", "JavaScript", "WordPress", "Other"];

export function Projects() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active || p.tags.includes(active));

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
          My Projects
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Some of my recent work
        </h2>
        <p className="text-gray-400 max-w-2xl mb-8">
          Here are a few projects I've built to solve real problems and improve user
          experiences. Each project helped me learn and grow as a developer.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active === f
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-40 bg-gradient-to-br from-[#1a2234] to-[#0d1220] flex items-center justify-center border-b border-white/5">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FolderGit2 className="w-12 h-12 text-blue-500/40" />
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-medium text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target={project.link.startsWith("http") ? "_blank" : undefined}
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
