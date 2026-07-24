import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { FAQS } from "../data/portfolioData";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 relative bg-[#07070d]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{"// client.faq"}</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight mb-3">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm">
            Everything you need to know about working together, project delivery, and post-launch support.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 mb-12">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-[#121222] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:text-[#f0d060]"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#f0d060] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust Assurance Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-[#f0d060]" />
            <span>30-Day Post-Launch Support</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-[#f0d060]" />
            <span>100% Mobile Guarantee</span>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-[#f0d060]" />
            <span>Direct Developer Communication</span>
          </div>
        </div>

      </div>
    </section>
  );
};
