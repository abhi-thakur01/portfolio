import { Download, Github, Linkedin, Mail, Twitter, ArrowRight } from "lucide-react";
import { personal } from "../data/content";

const stats = [
  { value: "1+", label: "Years Experience" },
  { value: "12+", label: "Projects Completed" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "10+", label: "Technologies" },
];

export function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center min-h-[70vh]">
          {/* Left */}
          <div>
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Hi, I'm
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.1] mb-3">
              Abhishek <span className="text-blue-500">Thakur</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-medium mb-5">
              {personal.role}
            </p>
            <p className="text-gray-400 leading-relaxed max-w-md mb-8 text-[15px]">
              {personal.bio}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/30"
              >
                View My Projects
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={personal.resumeUrl || "#"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white font-medium text-sm transition-colors"
              >
                Download Resume
                <Download className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {[
                { href: personal.github, icon: Github, label: "GitHub" },
                { href: personal.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: "#", icon: Twitter, label: "Twitter" },
                { href: `mailto:${personal.email}`, icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Photo */}
          <div className="flex justify-center lg:justify-end relative">
            <div className="absolute -right-4 top-8 hidden lg:block text-right">
              <p className="text-blue-400/80 font-script text-lg italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                Build<br />Create<br />Improve
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -inset-2 rounded-2xl border border-blue-500/20" />
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border border-blue-500/30 bg-[#111827] shadow-2xl shadow-blue-900/40">
                {personal.photo ? (
                  <img
                    src={personal.photo}
                    alt={personal.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a2234] via-[#111827] to-[#0d1220]">
                    <div className="w-28 h-28 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-4xl font-bold text-blue-400 mb-4">
                      AT
                    </div>
                    <p className="text-xs text-gray-500">Add photo in CMS → Personal</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
