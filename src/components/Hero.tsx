import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Lock,
  ExternalLink,
  Zap,
  Globe
} from "lucide-react";
import { ROLES, ADDRESSES } from "../data/portfolioData";

interface HeroProps {
  onSelectProject?: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeAddressIdx, setActiveAddressIdx] = useState(0);

  // Typewriter effect
  useEffect(() => {
    const currentWord = ROLES[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 75);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#c9a227_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#c9a227]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-[400px] h-[400px] bg-[#e8a020]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#131322] border border-[#c9a227]/30 text-xs font-mono text-[#f0d060] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#f0d060] animate-ping" />
              <span>Available for Freelance &amp; Agency Projects</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-4">
              Hi, I'm <br />
              <span className="gold-gradient-text">Abhishek Thakur</span>
            </h1>

            {/* Typewriter Role Line */}
            <div className="flex items-center gap-3 mb-6 min-h-[36px]">
              <span className="w-8 h-[2px] bg-[#c9a227]" />
              <span className="font-mono text-base sm:text-lg text-[#f0d060] font-medium tracking-wide">
                {displayText}
                <span className="inline-block w-2 h-4 bg-[#f0d060] ml-1 animate-pulse" />
              </span>
            </div>

            {/* Bio Paragraph */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              A <strong className="text-white font-semibold">Junior Web Designer</strong> with 1+ year of hands-on experience crafting fast, pixel-perfect, and mobile-friendly websites with <span className="text-[#f0d060]">WordPress, Elementor, Beaver Builder, GoHighLevel</span>, and clean modern code.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-sm shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/45 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#141424] border border-[#c9a227]/30 text-gray-200 hover:text-white hover:border-[#c9a227] hover:bg-[#19192e] font-medium text-sm transition-all duration-200"
              >
                <span>Get In Touch</span>
              </a>

              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 hover:text-[#f0d060] hover:border-[#c9a227]/40 text-xs font-mono transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f0d060]" />
                <span>Price Estimator</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10 w-full max-w-xl">
              <div>
                <div className="font-display font-extrabold text-2xl text-[#f0d060]">1+</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">Years Experience</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-white">12+</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">Projects Built</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-[#f0d060]">10+</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">CMS &amp; Tools</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-white">100%</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">Client Focus</div>
              </div>
            </div>
          </div>

          {/* Right Interactive Browser Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-[#121222] border border-[#c9a227]/30 shadow-2xl shadow-black/80 overflow-hidden corner-bracket always-active">
              
              {/* Browser Address Bar Header */}
              <div className="bg-[#18182d] px-4 py-3 border-b border-white/10 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                <div className="flex-1 flex items-center gap-2 bg-[#0b0b14] border border-white/10 rounded-lg px-3 py-1 text-[11px] font-mono text-gray-300 overflow-hidden">
                  <Lock className="w-3 h-3 text-[#f0d060] shrink-0" />
                  <span className="truncate text-gray-200">https://{ADDRESSES[activeAddressIdx]}</span>
                </div>
              </div>

              {/* Browser Address Tabs */}
              <div className="flex items-center bg-[#0e0e1a] border-b border-white/5 px-2 pt-1 gap-1 overflow-x-auto text-[11px] font-mono">
                {ADDRESSES.map((addr, idx) => (
                  <button
                    key={addr}
                    onClick={() => setActiveAddressIdx(idx)}
                    className={`px-3 py-1.5 rounded-t-lg transition-all flex items-center gap-1.5 ${
                      activeAddressIdx === idx
                        ? "bg-[#121222] text-[#f0d060] border-t border-x border-[#c9a227]/40 font-semibold"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>{addr.split(".")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Interactive Wireframe Canvas */}
              <div className="p-6 relative bg-gradient-to-b from-[#121222] to-[#0d0d18] min-h-[300px] flex flex-col justify-between">
                
                {/* Simulated Wireframe Navigation */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#c9a227] flex items-center justify-center text-[#08080f] font-bold text-[10px]">
                      AT
                    </div>
                    <div className="w-16 h-2 rounded bg-white/10" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-2 rounded bg-white/10" />
                    <div className="w-8 h-2 rounded bg-white/10" />
                    <div className="w-12 h-4 rounded-md bg-[#c9a227]/20 border border-[#c9a227]/40" />
                  </div>
                </div>

                {/* Simulated Hero Wireframe Body */}
                <div className="my-4 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#c9a227]/10 text-[10px] font-mono text-[#f0d060]">
                    <Zap className="w-3 h-3" />
                    <span>
                      {activeAddressIdx === 0
                        ? "Personal Portfolio & Services"
                        : activeAddressIdx === 1
                        ? "Live Client Work: Square Online"
                        : "Live Client Work: WordPress & Beaver"}
                    </span>
                  </div>

                  <div className="h-4 rounded bg-white/20 w-3/4" />
                  <div className="h-3 rounded bg-white/10 w-full" />
                  <div className="h-3 rounded bg-white/10 w-5/6" />

                  {/* Wireframe Mini Cards */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] font-mono text-[#f0d060]">100%</div>
                      <div className="text-[9px] text-gray-400">Responsive</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] font-mono text-white">&lt;1.2s</div>
                      <div className="text-[9px] text-gray-400">Load Time</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] font-mono text-[#f0d060]">Clean</div>
                      <div className="text-[9px] text-gray-400">Layout</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Action Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono text-[10px]">
                    Status: <span className="text-emerald-400">Live &amp; Secure</span>
                  </span>
                  <a
                    href={
                      activeAddressIdx === 1
                        ? "https://www.revivedkansas.info/"
                        : activeAddressIdx === 2
                        ? "https://melaniehoggan.com/"
                        : "#work"
                    }
                    target={activeAddressIdx > 0 ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#f0d060] hover:underline font-mono text-[11px]"
                  >
                    <span>Visit Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
