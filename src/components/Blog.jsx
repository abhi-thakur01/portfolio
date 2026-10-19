import { useMemo, useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, X, Clock } from "lucide-react";
import { blog } from "../data/content";
import { TextReveal, ClipReveal, Stagger, MouseGlow } from "./motion";

function PostDetail({ post, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const paragraphs = String(post.content || "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#111827] border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#111827]/95 backdrop-blur">
          <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <article className="p-5 sm:p-8">
          <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">{post.category}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{post.title}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-6">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
          </div>
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-8">
            {(post.tags || []).map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-400">
                {t}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export function Blog() {
  const meta = blog;
  const posts = useMemo(
    () => (meta.posts || []).filter((p) => p.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0)),
    [meta.posts]
  );
  const [openId, setOpenId] = useState(null);
  const active = posts.find((p) => p.id === openId);

  return (
    <section id="blog" className="py-14 sm:py-20 bg-[#0d1220]/50 section-ambient overflow-hidden">
      <MouseGlow color="59, 130, 246" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {meta.sectionSubtitle || "Blog"}
          </p>
          <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-3" stagger={45}>
            {meta.sectionTitle || "Tips & Insights"}
          </TextReveal>
          <ClipReveal delay={100}>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-[15px]">{meta.description}</p>
          </ClipReveal>
        </div>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" delay={80} step={70}>
          {posts.map((post) => (
            <article
              key={post.id}
              className="card-premium group flex flex-col rounded-2xl bg-[#111827] border border-white/8 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-blue-600/15 to-transparent border-b border-white/5 flex items-start justify-between p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-md">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="text-[10px] text-amber-300/90">Featured</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2 text-base group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                <button
                  type="button"
                  onClick={() => setOpenId(post.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium mt-auto"
                >
                  Read post <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </Stagger>
      </div>

      {active && <PostDetail post={active} onClose={() => setOpenId(null)} />}
    </section>
  );
}
