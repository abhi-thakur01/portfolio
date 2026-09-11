import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { personal } from "../data/content";

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span className="text-blue-400 font-mono text-xs">&lt;/&gt;</span>
          <span>Abhishek Thakur</span>
          <span className="text-gray-600 hidden sm:inline">·</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-3">
          {personal.github && (
            <a href={personal.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {personal.twitter && (
            <a href={personal.twitter} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
