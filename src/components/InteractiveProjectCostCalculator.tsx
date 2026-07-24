import React, { useState } from "react";
import { Calculator, ArrowRight, CheckCircle2 } from "lucide-react";

interface CostCalculatorProps {
  onApplySpec?: (spec: { platform: string; pages: number; budgetEst: string }) => void;
}

export const InteractiveProjectCostCalculator: React.FC<CostCalculatorProps> = ({ onApplySpec }) => {
  const [platform, setPlatform] = useState<string>("WordPress (Elementor)");
  const [pages, setPages] = useState<number>(3);
  const [speedAddon, setSpeedAddon] = useState<boolean>(true);
  const [seoAddon, setSeoAddon] = useState<boolean>(true);
  const [animAddon, setAnimAddon] = useState<boolean>(false);

  // Simple dynamic estimator calculation
  const basePrices: Record<string, number> = {
    "WordPress (Elementor)": 249,
    "Beaver Builder": 239,
    "GoHighLevel Funnel": 279,
    "Square Online": 219,
    "Custom HTML/CSS": 299,
  };

  const basePrice = basePrices[platform] || 249;
  const pageMultiplier = pages * 35;
  const addonsTotal =
    (speedAddon ? 45 : 0) + (seoAddon ? 45 : 0) + (animAddon ? 40 : 0);
  const totalEstimate = basePrice + pageMultiplier + addonsTotal;
  const estimatedDays = Math.max(3, Math.min(14, Math.round(pages * 1.5 + (speedAddon ? 1 : 0))));

  const handleApply = () => {
    if (onApplySpec) {
      onApplySpec({
        platform,
        pages,
        budgetEst: `$${totalEstimate - 30} – $${totalEstimate + 50}`,
      });
    }
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="calculator" className="py-20 relative bg-[#07070d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#121222] to-[#0c0c16] border border-[#c9a227]/35 p-6 sm:p-10 shadow-2xl shadow-black/80 corner-bracket always-active">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f0d060] mb-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Project Scope Estimator</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Estimate Your Project in 10 Seconds
              </h3>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 text-xs font-mono text-[#f0d060] w-fit">
              Instant Pricing Insight
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Config Controls */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-2">
                  1. Choose CMS / Technology:
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-[#c9a227]"
                >
                  <option>WordPress (Elementor)</option>
                  <option>Beaver Builder</option>
                  <option>GoHighLevel Funnel</option>
                  <option>Square Online</option>
                  <option>Custom HTML/CSS</option>
                </select>
              </div>

              {/* Page Count Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-gray-300 mb-2">
                  <span>2. Number of Pages:</span>
                  <span className="text-[#f0d060] font-bold text-sm">{pages} Pages</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full accent-[#c9a227] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                  <span>1 Page (Landing)</span>
                  <span>5 Pages (Business)</span>
                  <span>10 Pages (Full Site)</span>
                </div>
              </div>

              {/* Add-on Checkboxes */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-2">
                  3. Key Add-on Features:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#c9a227]/30">
                    <input
                      type="checkbox"
                      checked={speedAddon}
                      onChange={(e) => setSpeedAddon(e.target.checked)}
                      className="accent-[#c9a227]"
                    />
                    <span>Core Web Vitals &amp; PageSpeed 90+ Pass</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#c9a227]/30">
                    <input
                      type="checkbox"
                      checked={seoAddon}
                      onChange={(e) => setSeoAddon(e.target.checked)}
                      className="accent-[#c9a227]"
                    />
                    <span>Semantic SEO Schema &amp; Meta Structure</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#c9a227]/30">
                    <input
                      type="checkbox"
                      checked={animAddon}
                      onChange={(e) => setAnimAddon(e.target.checked)}
                      className="accent-[#c9a227]"
                    />
                    <span>Custom Micro-Interactions &amp; Hover Effects</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Live Estimate Output Card */}
            <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#16162b] border border-[#c9a227]/40 shadow-xl">
              <div>
                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Estimated Investment
                </div>
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#f0d060] mb-1">
                  ${totalEstimate - 25} – ${totalEstimate + 35}
                </div>
                <div className="text-xs text-gray-400 font-mono mb-6">
                  Estimated Delivery: <strong className="text-white">{estimatedDays} Business Days</strong>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f0d060]" />
                    <span>Includes 100% Mobile Responsive Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f0d060]" />
                    <span>Includes Video Walkthrough Handover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f0d060]" />
                    <span>30-Day Free Post-Launch Warranty</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/45 transition-all"
              >
                <span>Apply Spec to Contact Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
