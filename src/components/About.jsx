import { MapPin, Mail, Clock, Calendar, ArrowRight } from "lucide-react";
import { about, personal } from "../data/content";
import { TextReveal, ClipReveal, TiltCard, Magnetic, Stagger, MouseGlow } from "./motion";

export function About() {
  const info = [
    { icon: MapPin, label: "Location", value: personal.location },
    { icon: Mail, label: "Email", value: personal.email, href: `mailto:${personal.email}` },
    { icon: Clock, label: "Working Hours", value: personal.workingHours },
    { icon: Calendar, label: "Availability", value: personal.availability },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 overflow-hidden section-ambient">
      <MouseGlow color="59, 130, 246" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              About Me
            </p>
            <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-5" stagger={40}>
              {about.heading || "A little about me"}
            </TextReveal>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm sm:text-[15px] mb-6 sm:mb-8">
              {(about.paragraphs || []).map((p, i) => (
                <ClipReveal key={i} delay={120 + i * 80} direction="up">
                  <p>{p}</p>
                </ClipReveal>
              ))}
            </div>
            <Magnetic strength={0.2}>
              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/5"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </Magnetic>
          </div>

          <TiltCard max={8} className="flex items-center justify-center lg:justify-end">
            <div className="card-premium w-full max-w-md p-5 sm:p-6 rounded-2xl bg-[#111827]/80 border border-white/8">
              <Stagger className="space-y-4 sm:space-y-5" delay={100} step={70}>
                {info.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3 group/item">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 transition-transform duration-400 group-hover/item:scale-125 group-hover/item:rotate-6">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-500 mb-0.5">{label}</div>
                      {href ? (
                        <a href={href} className="text-sm text-gray-200 hover:text-blue-400 break-all transition-colors">
                          {value}
                        </a>
                      ) : (
                        <div className="text-sm text-gray-200">{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </Stagger>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
