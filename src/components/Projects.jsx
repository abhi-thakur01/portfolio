import { useRef, useState, useEffect } from "react";
import { ExternalLink, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../data/content";
import { Reveal } from "./Reveal";

export function Projects() {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const list = Array.isArray(projects) ? projects : [];

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-project-card]");
    const amount = (card?.offsetWidth || 300) + 20;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const onMouseUp = () => {
    const el = trackRef.current;
    drag.current.active = false;
    if (el) {
      el.style.cursor = "grab";
      el.style.userSelect = "";
    }
  };

  return (
    <section id="projects" className="py-14 sm:py-20 bg-[#0d1220]/50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal from="up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
                My Projects
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">
                Featured Projects
              </h2>
              <p className="text-gray-400 max-w-lg text-sm sm:text-[15px]">
                Here are some of my recent projects. Each project helped me learn something new and improve my skills.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal from="up" delay={140}>
          <div
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 cursor-grab scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          >
            {list.map((project) => (
              <article
                key={project.id}
                data-project-card
                className="group snap-start shrink-0 w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-40 sm:h-44 bg-gradient-to-br from-[#1a2234] to-[#0d1220] flex items-center justify-center border-b border-white/5 overflow-hidden pointer-events-none">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-blue-500/30">
                      <FolderGit2 className="w-12 h-12 sm:w-14 sm:h-14" />
                      <span className="text-[10px] font-mono text-gray-600">{project.category}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors text-sm sm:text-base">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.link || "#"}
                    target={project.link?.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={(e) => {
                      if (drag.current.moved) {
                        e.preventDefault();
                        drag.current.moved = false;
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View Project
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
