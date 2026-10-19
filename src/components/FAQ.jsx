import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs, sections } from "../data/content";
import { Reveal } from "./Reveal";

export function FAQ() {
  const list = Array.isArray(faqs) ? faqs : [];
  const meta = sections?.faqs || {};
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="py-14 sm:py-20 bg-[#0d1220]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              {meta.label || "// faq"}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {meta.heading || "Frequently Asked"}{" "}
              <span className="text-blue-400">{meta.headingHighlight || "Questions"}</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              {meta.description ||
                "Everything you need to know about working together, project delivery, and post-launch support."}
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {list.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={i} from="up" delay={Math.min(i * 40, 160)}>
                <div
                  className={`rounded-xl border transition-colors ${
                    isOpen
                      ? "bg-[#111827] border-blue-500/30"
                      : "bg-[#111827]/60 border-white/8 hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-medium text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-400 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {meta.trustItems?.length > 0 && (
          <Reveal from="up" delay={200}>
            <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
              {meta.trustItems.map((item) => (
                <span
                  key={item}
                  className="text-xs text-gray-500 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
