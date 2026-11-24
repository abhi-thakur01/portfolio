import { personal, site, socialLinks } from "../data/content";
import { getSocialIcon } from "../utils/socialIcons";

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start gap-1 text-xs sm:text-sm text-gray-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1">
            <span className="text-blue-400 font-mono text-xs">&lt;/&gt;</span>
            <span>{personal.name}</span>
            <span className="text-gray-600 hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} {site.footer?.copyright || "All rights reserved."}</span>
          </div>
          {site.footer?.tagline && <span>{site.footer.tagline}</span>}
        </div>

        {site.footer?.showSocials !== false && (
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.icon);
              return (
                <a
                  key={social.id || social.platform}
                  href={social.url}
                  target={social.newTab ? "_blank" : undefined}
                  rel={social.newTab ? "noreferrer" : undefined}
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                  aria-label={social.label || social.platform}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </footer>
  );
}
