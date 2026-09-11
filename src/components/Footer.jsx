import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { personal } from "../data/content";

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-blue-400 font-mono text-xs">&lt;/&gt;</span>
          <span>Abhishek Thakur</span>
          <span className="text-gray-600">·</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-3">
          <a href={personal.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="GitHub">
            <Github className="w-4 h-4" />
          </a>
          <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Twitter">
            <Twitter className="w-4 h-4" />
          </a>
          <a href={`mailto:${personal.email}`} className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Email">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
