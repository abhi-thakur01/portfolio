import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs, sections } from "../data/content";
import { TextReveal, ClipReveal, Stagger, MouseGlow } from "./motion";

export function FAQ() {
  const list = Array.isArray(faqs) ? faqs : [];
  const meta = sections?.faqs || {};
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="py-14 sm:py-20 bg-[#0d1220]/50 section-ambient">
      <MouseGlow color="139, 92, 246" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-3" stagger={45}>
            {(meta.heading || "Frequently Asked") + " " + (meta.headingHighlight || "Questions")}
          </TextReveal>
          <ClipReveal delay={120}>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              {meta.description ||
                "Everything you need to know about working together, project delivery, and post-launch support."}
            </p>
          </ClipReveal>
        </div>

        <div className="space-y-3">
          {list.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <ClipReveal key={i} delay={i * 60} direction="up">
                <div
                  className={`rounded-xl border transition-all duration-400 ${
                    isOpen
                      ? "bg-[#111827] border-blue-500/35 shadow-lg shadow-blue-900/15 scale-[1.01]"
                      : "bg-[#111827]/60 border-white/8 hover:border-white/15 hover:bg-[#111827]/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-medium text-white">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-400 ease-out ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-400 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-400 leading-relaxed">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              </ClipReveal>
            );
          })}
        </div>

        {meta.trustItems?.length > 0 && (
          <Stagger className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6" delay={200} step={50} from="scale">
            {meta.trustItems.map((item) => (
              <span
                key={item}
                className="text-xs text-gray-500 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full transition-all duration-300 hover:border-blue-500/30 hover:text-gray-300 hover:scale-105"
              >
                {item}
              </span>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
