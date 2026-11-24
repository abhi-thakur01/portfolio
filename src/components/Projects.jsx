import { useMemo, useState, useEffect, useRef } from "react";
import { ExternalLink, FolderGit2, Globe, Layout, Code2, ShoppingBag, ChevronDown, X } from "lucide-react";
import { projects, projectCategories, sections } from "../data/content";
import { TextReveal, TiltCard, Stagger, ClipReveal, MouseGlow } from "./motion";
import { resolveProjectImage } from "../utils/projectImage";

const PAGE_SIZE = 6;

const CATEGORY_META = {
  WordPress: {
    gradient: "from-blue-600/30 via-blue-500/10 to-transparent",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    accent: "text-blue-400",
    icon: Layout,
  },
  React: {
    gradient: "from-cyan-600/30 via-cyan-500/10 to-transparent",
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
    accent: "text-cyan-400",
    icon: Code2,
  },
  CMS: {
    gradient: "from-violet-600/30 via-violet-500/10 to-transparent",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    accent: "text-violet-400",
    icon: Globe,
  },
  Other: {
    gradient: "from-amber-600/30 via-amber-500/10 to-transparent",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    accent: "text-amber-400",
    icon: ShoppingBag,
  },
};

function getMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.Other;
}

function ProjectImage({ project }) {
  const source = resolveProjectImage(project.image);
  const [failedSource, setFailedSource] = useState("");
  const meta = getMeta(project.category);
  const Icon = meta.icon;

  if (source && failedSource !== source) {
    return (
      <img
        src={source}
        alt={project.imageAlt || `Project preview for ${project.title}`}
        className="w-full h-full object-cover object-center"
        loading="lazy"
        decoding="async"
        width={800}
        height={450}
        onError={() => setFailedSource(source)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className={`w-7 h-7 ${meta.accent} opacity-80`} />
      </div>
      <span className="text-[10px] font-mono text-gray-500 tracking-wide uppercase">
        {project.platform || project.category}
      </span>
    </div>
  );
}

function ProjectDetails({ project, onClose }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(document.activeElement);
  const detailsTags = project.detailTags?.length ? project.detailTags : project.tags || [];
  const metrics = project.metrics && (project.metrics.label || project.metrics.value)
    ? [project.metrics]
    : [];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Close project details" />
      <article
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#111827] border border-white/10 shadow-2xl"
      >
        <div className={"relative flex items-start justify-between gap-4 p-5 sm:p-7 border-b border-white/10 bg-gradient-to-br " + (project.previewColor || "from-blue-600/20 via-indigo-500/10 to-transparent")}>
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              {project.detailCategory || project.category}{project.platform ? ` · ${project.platform}` : ""}
            </p>
            <h2 id="project-detail-title" className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h2>
            {project.url && <p className="text-sm text-gray-300 mt-2">{project.url}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-300 hover:text-white" aria-label="Close project details">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-7">
          {resolveProjectImage(project.image) && (
            <div className={"w-full h-48 sm:h-72 flex items-center justify-center overflow-hidden rounded-xl mb-6 bg-gradient-to-br " + (project.previewColor || getMeta(project.category).gradient)}>
              <ProjectImage project={project} />
            </div>
          )}
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{project.detailDescription || project.description}</p>
          {metrics.map((metric) => (
            <div key={`${metric.label}-${metric.value}`} className="rounded-xl bg-white/5 border border-white/8 px-4 py-3 mb-6">
              <span className="text-blue-300 font-semibold">{metric.value}</span>
              {metric.label && <span className="text-sm text-gray-400 ml-2">{metric.label}</span>}
            </div>
          ))}
          {project.highlights?.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Highlights</h3>
              <ul className="space-y-2">{project.highlights.map((item) => <li key={item} className="text-sm text-gray-400">• {item}</li>)}</ul>
            </section>
          )}
          {project.features?.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Features</h3>
              <ul className="space-y-2">{project.features.map((item) => <li key={item} className="text-sm text-gray-400">• {item}</li>)}</ul>
            </section>
          )}
          {detailsTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {detailsTags.map((tag) => <span key={tag} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-400">{tag}</span>)}
            </div>
          )}
          {project.link && project.link !== "#" && (
            <a href={project.link} target={project.link.startsWith("http") ? "_blank" : undefined} rel={project.link.startsWith("http") ? "noreferrer" : undefined} className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
              Visit project <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

export function Projects() {
  const list = Array.isArray(projects) ? projects : [];
  const metaContent = sections?.work || {};
  const [active, setActive] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openProjectId, setOpenProjectId] = useState(null);

  const categories = useMemo(() => {
    const fromConfig = (Array.isArray(projectCategories) ? projectCategories : [])
      .filter((c) => c && c.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((c) => ({ key: String(c.id), label: c.label || c.id }));

    if (fromConfig.length) {
      return [{ key: "All", label: "All" }, ...fromConfig];
    }

    // Fallback: unique categories from projects
    const seen = new Set();
    const tabs = [{ key: "All", label: "All" }];
    list.forEach((p) => {
      const cat = p.category || "Other";
      if (!seen.has(cat)) {
        seen.add(cat);
        tabs.push({ key: cat, label: cat });
      }
    });
    return tabs;
  }, [list]);

  const filtered = useMemo(() => {
    if (active === "All") return list;
    return list.filter((p) => (p.category || "Other") === active);
  }, [list, active]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [active]);

  useEffect(() => {
    if (!categories.find((c) => c.key === active) && categories[0]) {
      setActive(categories[0].key);
    }
  }, [categories, active]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const remaining = filtered.length - visible;
  const activeProject = list.find((project) => project.id === openProjectId);

  return (
    <section id="projects" className="py-14 sm:py-20 bg-[#0d1220]/50 section-ambient overflow-hidden">
      <MouseGlow color="59, 130, 246" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              {metaContent.label || "My Projects"}
            </p>
            <TextReveal
              as="h2"
              className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3"
              stagger={45}
            >
              {metaContent.heading || "Featured"}{" "}
              <span className="text-blue-400">{metaContent.headingHighlight || "Projects"}</span>
            </TextReveal>
            <ClipReveal delay={120}>
              <p className="text-gray-400 max-w-lg text-sm sm:text-[15px]">
                {metaContent.description || "Live client sites and personal builds across WordPress, CMS platforms and React."}
              </p>
            </ClipReveal>
          </div>
          <ClipReveal delay={180} direction="left">
            <div className="text-right shrink-0">
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{list.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Projects</p>
              {metaContent.hireCta && (
                <a href="#contact" className="inline-flex mt-3 text-xs font-medium text-blue-400 hover:text-blue-300">
                  {metaContent.hireCta}
                </a>
              )}
            </div>
          </ClipReveal>
        </div>

        <Stagger className="flex flex-wrap gap-2 mb-8" delay={100} step={40} from="scale">
          {categories.map((cat) => {
            const isActive = active === cat.key;
            const count =
              cat.key === "All"
                ? list.length
                : list.filter((p) => (p.category || "Other") === cat.key).length;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                className={
                  "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-300 " +
                  (isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-105"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-gray-200 hover:scale-105")
                }
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </Stagger>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {shown.map((project, i) => {
            const meta = getMeta(project.category);
            const isExternal = project.link?.startsWith("http");

            return (
              <TiltCard key={project.id} max={8} className="h-full">
                <article
                  className="card-premium group h-full flex flex-col rounded-2xl bg-[#111827] border border-white/8 overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={
                      "relative h-36 sm:h-40 flex items-center justify-center border-b border-white/5 overflow-hidden bg-gradient-to-br img-mask " +
                      (project.previewColor || meta.gradient)
                    }
                  >
                    <ProjectImage project={project} />
                    <span
                      className={
                        "absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border backdrop-blur-sm " +
                        meta.badge
                      }
                    >
                      {project.category || "Other"}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base leading-snug">
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
                    {project.link && project.link !== "#" && (
                      <a
                        href={project.link}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium mt-auto transition-all duration-300 group-hover:gap-2.5"
                      >
                        {isExternal ? "View Live Site" : "View Project"}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {(project.url || project.detailCategory || project.detailDescription || project.highlights?.length || project.features?.length || project.detailTags?.length || project.tags?.length > 3 || project.metrics?.label || project.metrics?.value) && (
                      <button
                        type="button"
                        onClick={() => setOpenProjectId(project.id)}
                        aria-haspopup="dialog"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mt-3"
                      >
                        View project details
                      </button>
                    )}
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No projects in this category yet.</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              Load More
              <span className="text-xs text-gray-400">(+{remaining} more)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {activeProject && <ProjectDetails project={activeProject} onClose={() => setOpenProjectId(null)} />}
    </section>
  );
}
