import { useRef } from "react";
import { ExternalLink, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../data/content";

export function Projects() {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section id="projects" className="py-20 bg-[#0d1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("prev")}
              className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
              aria-label="Previous projects"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("next")}
              className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
              aria-label="Next projects"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="group snap-start shrink-0 w-[min(100%,320px)] sm:w-[340px] rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-[#1a2234] to-[#0d1220] flex items-center justify-center border-b border-white/5 overflow-hidden">
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
