import React from "react";
import { ArrowRight } from "lucide-react";
import { SEO_FEATURES } from "../data/portfolioData";

export const SeoPerformance: React.FC = () => {
  return (
    <section id="seo" className="py-24 relative bg-[#090912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
              {"// performance.md"}
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
              Built to Rank High <br />
              <span className="gold-gradient-text">&amp; Convert Traffic</span>
            </h2>

            <div className="space-y-4 text-gray-300 text-base leading-relaxed mb-8">
              <p>
                As a web designer who understands technical SEO, I treat speed and search rankings as core requirements, not an afterthought.
              </p>
              <p>
                Every website I construct is tuned to satisfy Google's <strong className="text-white">Core Web Vitals (LCP, FID, CLS)</strong>, with semantic HTML5 markup, optimized responsive assets, and fast hosting configurations.
              </p>
            </div>

            {/* Quick Lighthouse Score Visualizer Card */}
            <div className="p-5 rounded-2xl bg-[#121222] border border-[#c9a227]/30 w-full mb-8 shadow-xl">
              <div className="text-xs font-mono text-gray-400 mb-3 flex items-center justify-between">
                <span>Lighthouse Benchmark Audit</span>
                <span className="text-[#f0d060] font-bold">Google Verified</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="font-display font-extrabold text-lg text-emerald-400">98</div>
                  <div className="text-[10px] text-gray-300 font-mono">Performance</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="font-display font-extrabold text-lg text-emerald-400">100</div>
                  <div className="text-[10px] text-gray-300 font-mono">Accessibility</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="font-display font-extrabold text-lg text-emerald-400">100</div>
                  <div className="text-[10px] text-gray-300 font-mono">Best Practices</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="font-display font-extrabold text-lg text-emerald-400">100</div>
                  <div className="text-[10px] text-gray-300 font-mono">SEO</div>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-sm shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/45 transition-all"
            >
              <span>Build a High-Speed Site</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right SEO Feature Cards */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {SEO_FEATURES.map((feat) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-5 rounded-2xl bg-[#121222] border border-white/10 hover:border-[#c9a227]/40 flex items-start gap-4 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-bold text-base text-white group-hover:text-[#f0d060] transition-colors">
                        {feat.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#c9a227]/15 text-[10px] font-mono text-[#f0d060]">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
