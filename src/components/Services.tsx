import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SERVICES } from "../data/portfolioData";

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-24 relative bg-[#090912]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
            {"// services()"}
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Services Built for <br />
            <span className="gold-gradient-text">Real Business Growth</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            End-to-end web design and CMS development tailored to help your brand look polished, load instantly, and turn visitors into clients.
          </p>
        </div>

        {/* Services 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="rounded-2xl bg-[#121222] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#c9a227]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/40 group corner-bracket"
              >
                <div>
                  {/* Top Bar: Icon & Starting Price */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#f0d060]">
                      {service.startingPrice}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2.5 group-hover:text-[#f0d060] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                    <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Deliverables:
                    </div>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#f0d060] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tags & Booking Button */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#c9a227]/10 text-[10px] font-mono text-[#f0d060]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    onClick={() => onSelectService && onSelectService(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#c9a227] text-gray-200 hover:text-[#08080f] font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 hover:border-[#c9a227]"
                  >
                    <span>Request This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
