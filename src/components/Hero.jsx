import { Download, Github, Linkedin, Mail, Twitter, ArrowRight } from "lucide-react";
import { personal } from "../data/content";
import { TextReveal, Magnetic, ClipReveal, MouseGlow, CountUp, Stagger } from "./motion";

export function Hero() {
  const stats = personal.stats || [];
  const initials = (personal.name || "AT")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const first = personal.name?.split(" ")[0] || "Abhishek";
  const rest = personal.name?.split(" ").slice(1).join(" ") || "Thakur";

  return (
    <section id="home" className="relative pt-20 sm:pt-24 pb-8 overflow-hidden">
      <div className="absolute top-10 right-0 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] bg-blue-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-16 left-[-60px] w-[240px] h-[240px] bg-indigo-500/12 rounded-full blur-[90px] pointer-events-none animate-float" />
      <div className="absolute top-1/3 left-1/3 w-[160px] h-[160px] bg-blue-400/10 rounded-full blur-[70px] pointer-events-none animate-float-delayed" />
      <MouseGlow color="59, 130, 246" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-0 lg:min-h-[68vh]">
          <div className="order-2 lg:order-1">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.22em] uppercase mb-3 sm:mb-4 overflow-hidden">
              <span className="inline-block animate-[pop-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                {personal.greeting || "Hi, I'm"}
              </span>
            </p>

            <TextReveal
              as="h1"
              className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.15] mb-1"
              delay={80}
              stagger={70}
            >
              {first}
            </TextReveal>
            <TextReveal
              as="div"
              className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] mb-3 text-gradient"
              delay={180}
              stagger={60}
            >
              {rest}
            </TextReveal>

            <ClipReveal delay={280} direction="up">
              <p className="text-base sm:text-xl text-gray-300 font-medium mb-4 sm:mb-5">
                {personal.role}
              </p>
            </ClipReveal>

            <ClipReveal delay={360} direction="up">
              <p className="text-gray-400 leading-relaxed max-w-md mb-6 sm:mb-8 text-sm sm:text-[15px]">
                {personal.bio}
              </p>
            </ClipReveal>

            <Stagger className="flex flex-row flex-wrap items-center gap-3 mb-6 sm:mb-8" delay={420} step={90}>
              <Magnetic strength={0.25}>
                <a
                  href="#projects"
                  className="btn-shine inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/45 transition-shadow"
                >
                  {personal.ctaPrimary || "View My Projects"}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href={personal.resumeUrl || "#"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  {personal.ctaSecondary || "Download Resume"}
                  <Download className="w-4 h-4" />
                </a>
              </Magnetic>
            </Stagger>

            <Stagger className="flex items-center gap-3" delay={520} step={60} from="scale">
              {[
                { href: personal.github, icon: Github, label: "GitHub", show: !!personal.github },
                { href: personal.linkedin, icon: Linkedin, label: "LinkedIn", show: !!personal.linkedin },
                { href: personal.twitter || "#", icon: Twitter, label: "Twitter", show: !!personal.twitter },
                { href: `mailto:${personal.email}`, icon: Mail, label: "Email", show: !!personal.email },
              ]
                .filter((s) => s.show)
                .map(({ href, icon: Icon, label }) => (
                  <Magnetic key={label} strength={0.4}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="icon-lift w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  </Magnetic>
                ))}
            </Stagger>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <ClipReveal delay={120} direction="right" className="relative w-[200px] sm:w-[260px] md:w-[300px]">
              <div className="absolute inset-0 scale-110 bg-blue-500/25 blur-[60px] rounded-full pointer-events-none animate-pulse-glow" />
              <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-blue-400/50 via-blue-600/25 to-transparent group">
                <div className="rounded-2xl overflow-hidden bg-[#0d1220] border border-blue-500/25 aspect-[3/4] img-mask transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/25">
                  {personal.photo ? (
                    <img
                      src={personal.photo}
                      alt={personal.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#152033] to-[#0a0e1a] relative">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.14),transparent_70%)]" />
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-400/35 flex items-center justify-center text-3xl sm:text-4xl font-bold text-blue-300 shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {initials}
                      </div>
                      <p className="relative mt-4 text-sm font-medium text-gray-300">
                        {first}
                      </p>
                      <p className="relative text-xs text-gray-500 mt-1">{personal.role}</p>
                    </div>
                  )}
                </div>
              </div>
            </ClipReveal>
          </div>
        </div>

        {stats.length > 0 && (
          <Stagger
            className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8 border-y border-white/5"
            delay={200}
            step={80}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <CountUp
                  value={s.value}
                  className="text-xl sm:text-3xl font-extrabold text-blue-400 mb-1 tabular-nums transition-transform duration-300 group-hover:scale-110"
                />
                <div className="text-[10px] sm:text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
