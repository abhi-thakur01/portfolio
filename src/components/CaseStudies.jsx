import { useMemo, useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, ExternalLink, X } from "lucide-react";
import { caseStudies } from "../data/content";
import { TextReveal, ClipReveal, TiltCard, Stagger, MouseGlow } from "./motion";

function Detail({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#111827] border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {item.category} · {item.year}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{item.title}</h2>
          <p className="text-sm text-gray-400 mb-6">
            {item.client} · {item.role}
          </p>

          {item.coverImage ? (
            <img src={item.coverImage} alt="" className="w-full rounded-xl mb-6 border border-white/10" />
          ) : (
            <div className="h-40 rounded-xl mb-6 bg-gradient-to-br from-blue-600/20 to-indigo-900/20 border border-white/10 flex items-center justify-center text-gray-500 text-sm">
              Cover image (add in CMS)
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {(item.metrics || []).map((m) => (
              <div key={m.label} className="rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-center">
                <div className="text-lg font-bold text-blue-400">{m.value}</div>
                <div className="text-[11px] text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>

          <section className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Problem</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.problem}</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Solution</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.solution}</p>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Process</h3>
            <ol className="space-y-2">
              {(item.process || []).map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-400">
                  <span className="text-blue-400 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Results</h3>
            <ul className="space-y-1.5">
              {(item.results || []).map((r, i) => (
                <li key={i} className="text-sm text-gray-400 flex gap-2">
                  <span className="text-blue-400">✓</span> {r}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-2 mb-6">
            {(item.tags || []).map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-400">
                {t}
              </span>
            ))}
          </div>

          {item.liveUrl && item.liveUrl !== "#" && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              View live <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const meta = caseStudies;
  const items = useMemo(
    () => (meta.items || []).filter((i) => i.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0)),
    [meta.items]
  );
  const [openId, setOpenId] = useState(null);
  const active = items.find((i) => i.id === openId);

  return (
    <section id="case-studies" className="py-14 sm:py-20 section-ambient overflow-hidden">
      <MouseGlow color="99, 102, 241" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {meta.sectionSubtitle || "Deep Dives"}
          </p>
          <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-3" stagger={45}>
            {meta.sectionTitle || "Case Studies"}
          </TextReveal>
          <ClipReveal delay={100}>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-[15px]">{meta.description}</p>
          </ClipReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <TiltCard key={item.id} max={7}>
              <article className="card-premium h-full flex flex-col rounded-2xl bg-[#111827] border border-white/8 overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent border-b border-white/5 flex items-end p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] text-gray-500 mb-1">{item.client} · {item.year}</p>
                  <h3 className="font-semibold text-white mb-2 text-base">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1">{item.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => setOpenId(item.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium mt-auto"
                  >
                    View case study <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>

      {active && <Detail item={active} onClose={() => setOpenId(null)} />}
    </section>
  );
}
