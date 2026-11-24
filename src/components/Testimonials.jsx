import { Reveal } from "./Reveal";
import { testimonials } from "../data/content";

export function Testimonials() {
  const items = Array.isArray(testimonials.items) ? testimonials.items : [];

  return (
    <section id="testimonials" className="py-14 sm:py-20 bg-[#0d1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              {testimonials.sectionSubtitle || "Testimonials"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {testimonials.sectionTitle || "What Clients Say"}
            </h2>
            {testimonials.description && (
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-[15px] leading-relaxed">
                {testimonials.description}
              </p>
            )}
          </div>
        </Reveal>
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <Reveal key={item.id || i} from="up" delay={Math.min(i * 60, 240)}>
                <article className="h-full rounded-2xl bg-[#111827] border border-white/8 p-5 sm:p-6">
                  {item.quote && <blockquote className="text-sm text-gray-300 leading-relaxed mb-5">"{item.quote}"</blockquote>}
                  <div className="mt-auto flex items-center gap-3">
                    {item.image && <img src={item.image} alt={`${item.name || "Client"} portrait`} className="w-10 h-10 rounded-full object-cover" loading="lazy" decoding="async" width={40} height={40} />}
                    <div>
                      {item.name && <p className="text-sm font-semibold text-white">{item.name}</p>}
                      {(item.role || item.company) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {[item.role, item.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
