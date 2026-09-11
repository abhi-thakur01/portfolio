import { Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { personal } from "../data/content";

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-blue-400 text-sm font-medium mb-3">Hi, I'm</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
              Abhishek <span className="text-blue-400">Thakur</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium mb-5">{personal.role}</p>
            <p className="text-gray-400 leading-relaxed max-w-lg mb-8">
              {personal.bio}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/25"
              >
                View My Projects
              </a>
              <a
                href={personal.resumeUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-blue-500/50 hover:text-white font-medium text-sm transition-colors"
              >
                Download Resume
                <Download className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personal.email}`}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right - Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />
              <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#111827] shadow-2xl shadow-black/50">
                {personal.photo ? (
                  <img
                    src={personal.photo}
                    alt={personal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2234] to-[#0d1220]">
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center text-3xl font-bold text-blue-400 mb-3">
                      AT
                    </div>
                    <p className="text-xs text-gray-500 font-mono">Add photo in content.js</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <a href="#about" className="text-gray-500 hover:text-blue-400 transition-colors">
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-blue-400 animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
