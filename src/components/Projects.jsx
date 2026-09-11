import { useRef, useState, useCallback } from "react";
import { ExternalLink, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../data/content";

export function Projects() {
  const trackRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const moved = useRef(false);
  const [dragging, setDragging] = useState(false);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-project-card]");
    const gap = 20;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  const onPointerDown = useCallback((e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    moved.current = false;
    setDragging(true);
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDown.current) return;
    const el = trackRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.15;
    if (Math.abs(walk) > 4) moved.current = true;
    el.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onPointerUp = useCallback((e) => {
    isDown.current = false;
    setDragging(false);
    const el = trackRef.current;
    if (el) el.releasePointerCapture?.(e.pointerId);
  }, []);

  const onWheel = useCallback((e) => {
    const el = trackRef.current;
    if (!el) return;
    // Trackpad / shift+wheel horizontal feel
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);

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
              type="button"
              onClick={() => scrollByCard("prev")}
              className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
              aria-label="Previous projects"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className="w-10 h-10 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-blue-500/50 flex items-center justify-center transition-colors"
              aria-label="Next projects"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
          className={`flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory select-none touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            dragging ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              data-project-card
              className="group snap-start shrink-0 w-[min(100%,300px)] sm:w-[320px] md:w-[340px] rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 transition-colors duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-[#1a2234] to-[#0d1220] flex items-center justify-center border-b border-white/5 overflow-hidden pointer-events-none">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    draggable={false}
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
                  onClick={(e) => {
                    // Prevent click after drag
                    if (moved.current) {
                      e.preventDefault();
                      moved.current = false;
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

        <p className="text-[11px] text-gray-600 mt-3 text-center sm:text-left">
          Drag · swipe · scroll · or use arrows
        </p>
      </div>
    </section>
  );
}
