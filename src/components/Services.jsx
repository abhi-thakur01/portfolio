import { Globe, LayoutGrid, PenTool, Smartphone, RefreshCw, Check, ArrowRight } from "lucide-react";
import { services, sections } from "../data/content";
import { Reveal } from "./Reveal";

const ICON_MAP = {
  Globe,
  LayoutGrid,
  PenTool,
  Smartphone,
  RefreshCw,
};

export function Services() {
  const list = Array.isArray(services) ? services : [];
  const meta = sections?.services || {};

  return (
    <section id="services" className="py-14 sm:py-20 bg-[#0d1220]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              {meta.label || "// services"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {meta.heading || "Services Built for"}{" "}
              <span className="text-blue-400">{meta.headingHighlight || "Real Business Growth"}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              {meta.description ||
                "End-to-end web design and CMS development tailored to help your brand look polished, load instantly, and turn visitors into clients."}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Globe;
            return (
              <Reveal key={service.id} from="up" delay={Math.min(i * 60, 240)}>
                <article className="group h-full flex flex-col rounded-2xl bg-[#111827] border border-white/8 p-5 sm:p-6 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {service.startingPrice && (
                      <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                        from {service.startingPrice}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                    {service.desc}
                  </p>

                  {service.deliverables?.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {service.deliverables.slice(0, 4).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(service.tags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium mt-auto"
                  >
                    {meta.ctaLabel || "Request This Service"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
