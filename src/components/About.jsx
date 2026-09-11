import { MapPin, Mail, Clock, Calendar, ArrowRight } from "lucide-react";
import { about, personal } from "../data/content";
import { Reveal } from "./Reveal";

export function About() {
  const info = [
    { icon: MapPin, label: "Location", value: personal.location },
    { icon: Mail, label: "Email", value: personal.email, href: `mailto:${personal.email}` },
    { icon: Clock, label: "Working Hours", value: personal.workingHours },
    { icon: Calendar, label: "Availability", value: personal.availability },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <Reveal from="left" className="flex flex-col justify-center">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              About Me
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-5">
              {about.heading}
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed text-sm sm:text-[15px] mb-6 sm:mb-8">
              {(about.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div>
              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white text-sm font-medium transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <Reveal from="right" delay={120} className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md p-5 sm:p-6 rounded-2xl bg-[#111827]/80 border border-white/8 space-y-4 sm:space-y-5">
              {info.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-gray-500 mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm text-gray-200 hover:text-blue-400 break-all">
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-200">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
