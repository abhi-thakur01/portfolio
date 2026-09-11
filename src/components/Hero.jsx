import { Download, Github, Linkedin, Mail, Twitter, ArrowRight } from "lucide-react";
import { personal } from "../data/content";

export function Hero() {
  const stats = personal.stats || [];
  const sideText = personal.photoSideText || [];

  return (
    <section id="home" className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute top-10 right-0 w-[420px] h-[420px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[68vh]">
          <div className="order-2 lg:order-1">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              {personal.greeting || "Hi, I'm"}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.1] mb-3">
              {personal.name?.split(" ")[0] || "Abhishek"}{" "}
              <span className="text-blue-500">{personal.name?.split(" ").slice(1).join(" ") || "Thakur"}</span>
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
                {personal.ctaPrimary || "View My Projects"}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={personal.resumeUrl || "#"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white font-medium text-sm transition-colors"
              >
                {personal.ctaSecondary || "Download Resume"}
                <Download className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {[
                { href: personal.github, icon: Github, label: "GitHub", show: !!personal.github },
                { href: personal.linkedin, icon: Linkedin, label: "LinkedIn", show: !!personal.linkedin },
                { href: personal.twitter || "#", icon: Twitter, label: "Twitter", show: true },
                { href: `mailto:${personal.email}`, icon: Mail, label: "Email", show: !!personal.email },
              ]
                .filter((s) => s.show)
                .map(({ href, icon: Icon, label }) => (
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

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-[260px] sm:w-[300px]">
              <div className="absolute inset-0 scale-110 bg-blue-500/25 blur-[60px] rounded-full pointer-events-none" />

              <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-blue-400/40 via-blue-600/20 to-transparent">
                <div className="rounded-2xl overflow-hidden bg-[#0d1220] border border-blue-500/20 aspect-[3/4]">
                  {personal.photo ? (
                    <img
                      src={personal.photo}
                      alt={personal.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#152033] to-[#0a0e1a]">
                      <div className="w-24 h-24 rounded-full bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-3xl font-bold text-blue-400 mb-3">
                        AT
                      </div>
                      <p className="text-[11px] text-gray-500 px-4 text-center">
                        Upload photo in CMS → Personal
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {sideText.length > 0 && (
                <div className="absolute -right-2 sm:-right-6 top-1/4 hidden sm:block pointer-events-none select-none">
                  <p
                    className="text-blue-400/70 text-sm sm:text-base leading-snug italic"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {sideText.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < sideText.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
