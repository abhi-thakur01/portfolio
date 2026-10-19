import { processSteps, sections } from "../data/content";
import { Reveal } from "./Reveal";

export function Process() {
  const steps = Array.isArray(processSteps) ? processSteps : [];
  const meta = sections?.process || {};

  return (
    <section id="process" className="py-14 sm:py-20 overflow-hidden section-ambient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <Reveal from="up">
          <div className="text-center mb-10 sm:mb-14">
            {meta.label ? (
              <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
                {meta.label}
              </p>
            ) : null}
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {meta.heading || "How I Build"}{" "}
              <span className="text-gradient">{meta.headingHighlight || "Excellence"}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-[15px] leading-relaxed">
              {meta.description ||
                "A battle-tested workflow shaped by real client projects — keeping you informed, on schedule, and thrilled with the final website."}
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal key={step.phase} from={isEven ? "left" : "right"} delay={Math.min(i * 70, 280)}>
                  <div
                    className={`relative flex flex-col lg:flex-row items-start gap-6 lg:gap-10 ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className="flex-1 lg:w-[calc(50%-2rem)]">
                      <div className="card-premium rounded-2xl bg-[#111827] border border-white/8 p-5 sm:p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl sm:text-3xl font-bold text-blue-500/80 tabular-nums">
                            {step.phase}
                          </span>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">
                              {step.title}
                            </h3>
                            <p className="text-xs text-gray-500">{step.sub}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                          {step.desc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(step.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{step.duration}</span>
                          {step.deliverable && (
                            <span className="text-blue-400 font-medium">
                              → {step.deliverable}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#0a0e1a] shadow-lg shadow-blue-500/30 z-10 animate-pulse-glow" />

                    <div className="hidden lg:block flex-1 lg:w-[calc(50%-2rem)]" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
