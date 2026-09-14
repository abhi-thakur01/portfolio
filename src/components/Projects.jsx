import { useMemo, useState } from "react";
import { ExternalLink, FolderGit2, Globe, Layout, Code2, ShoppingBag } from "lucide-react";
import { projects } from "../data/content";
import { Reveal } from "./Reveal";

const CATEGORY_META = {
  WordPress: {
    label: "WordPress",
    gradient: "from-blue-600/30 via-blue-500/10 to-transparent",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    accent: "text-blue-400",
    icon: Layout,
  },
  React: {
    label: "React",
    gradient: "from-cyan-600/30 via-cyan-500/10 to-transparent",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
    accent: "text-cyan-400",
    icon: Code2,
  },
  CMS: {
    label: "CMS",
    gradient: "from-violet-600/30 via-violet-500/10 to-transparent",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    accent: "text-violet-400",
    icon: Globe,
  },
  Other: {
    label: "Other",
    gradient: "from-amber-600/30 via-amber-500/10 to-transparent",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    accent: "text-amber-400",
    icon: ShoppingBag,
  },
};

function getMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.Other;
}

export function Projects() {
  const list = Array.isArray(projects) ? projects : [];
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(list.map((p) => p.category || "Other"));
    return ["All", ...Array.from(set)];
  }, [list]);

  const filtered = useMemo(() => {
    if (active === "All") return list;
    return list.filter((p) => (p.category || "Other") === active);
  }, [list, active]);

  return (
    <section id="projects" className="py-14 sm:py-20 bg-[#0d1220]/50">
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
                {list.length}+ live client sites & personal builds across WordPress, CMS platforms and React.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{list.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Projects</p>
            </div>
          </div>
        </Reveal>

        {/* Category filters */}
        <Reveal from="up" delay={80}>
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter projects by category">
            {categories.map((cat) => {
              const isActive = active === cat;
              const meta = cat === "All" ? null : getMeta(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={
                    "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all " +
                    (isActive
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25"
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-gray-200")
                  }
                >
                  {cat === "All" ? `All (${list.length})` : `${cat} (${list.filter((p) => (p.category || "Other") === cat).length})`}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((project, i) => {
            const meta = getMeta(project.category);
            const Icon = meta.icon;
            const isExternal = project.link?.startsWith("http");

            return (
              <Reveal key={project.id} from="up" delay={Math.min(i * 50, 300)}>
                <article className="group h-full flex flex-col rounded-2xl bg-[#111827] border border-white/8 overflow-hidden hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
                  {/* Visual header */}
                  <div
                    className={
                      "relative h-36 sm:h-40 flex items-center justify-center border-b border-white/5 overflow-hidden bg-gradient-to-br " +
                      meta.gradient
                    }
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Icon className={`w-7 h-7 ${meta.accent} opacity-80`} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 tracking-wide uppercase">
                          {project.platform || project.category}
                        </span>
                      </div>
                    )}

                    {/* Category badge */}
                    <span
                      className={
                        "absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border " +
                        meta.badge
                      }
                    >
                      {project.category || "Other"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 mb-2 font-medium truncate">
                      {project.platform || project.category}
                    </p>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] sm:text-[11px] text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.link || "#"}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium mt-auto"
                    >
                      {isExternal ? "View Live Site" : "View Project"}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
