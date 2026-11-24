import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2020",
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "canonical-admin-routes",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || "").split("?")[0];
          if (
            pathname === "/admin" ||
            pathname === "/admin.html" ||
            pathname === "/admin-v2.html" ||
            pathname === "/admin-v2" ||
            pathname === "/cms2.js" ||
            pathname === "/admin-a.js" ||
            pathname === "/admin-skills-image.js"
          ) {
            res.statusCode = 308;
            res.setHeader("Location", "/admin/");
            res.end();
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || "").split("?")[0];
          if (
            pathname === "/admin" ||
            pathname === "/admin.html" ||
            pathname === "/admin-v2.html" ||
            pathname === "/admin-v2" ||
            pathname === "/cms2.js" ||
            pathname === "/admin-a.js" ||
            pathname === "/admin-skills-image.js"
          ) {
            res.statusCode = 308;
            res.setHeader("Location", "/admin/");
            res.end();
            return;
          }
          next();
        });
      },
    },
    {
      name: "portfolio-cms-seo",
      transformIndexHtml(html) {
        const site = JSON.parse(readFileSync(path.resolve(__dirname, "content/site.json"), "utf8"));
        const personal = JSON.parse(readFileSync(path.resolve(__dirname, "content/personal.json"), "utf8"));
        const projects = JSON.parse(readFileSync(path.resolve(__dirname, "content/projects.json"), "utf8"));
        const socials = JSON.parse(readFileSync(path.resolve(__dirname, "content/socials.json"), "utf8"));
        const escapeHtml = (value) => String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
        const absoluteUrl = (value, fallbackOrigin) => {
          if (!value) return "";
          try {
            return new URL(value, fallbackOrigin).href;
          } catch {
            return "";
          }
        };
        const title = site.metaTitle || site.websiteTitle || personal.displayName || personal.fullName || personal.name || "Portfolio";
        const description = site.metaDescription || "";
        const configuredCanonical = site.canonicalUrl || personal.websiteUrl || "";
        const canonicalCandidate = absoluteUrl(configuredCanonical, "https://abhi-thakur-web.vercel.app");
        const canonical = /^(https?):\/\//i.test(canonicalCandidate) &&
          !/localhost|127\.0\.0\.1/i.test(canonicalCandidate)
          ? canonicalCandidate
          : "https://abhi-thakur-web.vercel.app/";
        const ogImageCandidate = absoluteUrl(site.ogImage || "", canonical);
        const ogImage = ogImageCandidate &&
          /^(https?):\/\//i.test(ogImageCandidate) &&
          !/localhost|127\.0\.0\.1/i.test(ogImageCandidate)
          ? ogImageCandidate
          : "https://abhi-thakur-web.vercel.app/og-image.png";
        const author = personal.displayName || personal.fullName || personal.name || "";

        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
        html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
        html = html.replace(/<meta name="author"[^>]*>/i, author ? `<meta name="author" content="${escapeHtml(author)}" />` : "");
        if (canonical) html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
        html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
        html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
        html = html.replace(/<meta property="og:url"[^>]*>/i, canonical ? `<meta property="og:url" content="${canonical}" />` : "");
        if (ogImage) html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${ogImage}" />`);
        html = html.replace(/<meta property="og:image:width"[^>]*>/gi, '<meta property="og:image:width" content="1424" />');
        html = html.replace(/<meta property="og:image:height"[^>]*>/gi, '<meta property="og:image:height" content="752" />');
        html = html.replace(/<meta property="og:image:alt"[^>]*>/gi, '<meta property="og:image:alt" content="Abhishek Thakur — Web Designer" />');

        const twitter = [
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
          `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
          ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : "",
        ].filter(Boolean).join("\n");

        const personId = `${canonical}#person`;
        const websiteId = `${canonical}#website`;
        const profileId = `${canonical}#profile`;
        const person = {
          "@type": "Person",
          "@id": personId,
          name: author,
          url: canonical,
          jobTitle: personal.role || "",
          email: personal.email || "",
          sameAs: (Array.isArray(socials.items) ? socials.items : [])
            .filter((item) => item.active !== false && typeof item.url === "string" && /^https?:/i.test(item.url))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => item.url),
        };
        const website = {
          "@type": "WebSite",
          "@id": websiteId,
          url: canonical,
          name: site.websiteName || author,
          inLanguage: "en",
          publisher: { "@id": personId },
        };
        const profilePage = {
          "@type": "ProfilePage",
          "@id": profileId,
          url: canonical,
          name: title,
          description,
          inLanguage: "en",
          mainEntity: { "@id": personId },
        };
        const creativeWorks = (Array.isArray(projects.items) ? projects.items : [])
          .filter((project) => project.active !== false)
          .map((project) => {
            const projectUrl = typeof project.link === "string" && /^https?:\/\//i.test(project.link)
              ? project.link
              : canonical;
            const work = {
              "@type": "CreativeWork",
              "@id": `${canonical}#project-${project.id || ""}`,
              name: project.title || "Project",
              description: project.description || "",
              url: projectUrl,
              inLanguage: "en",
            };
            if (Array.isArray(project.tags) && project.tags.length) work.keywords = project.tags.join(", ");
            if (typeof project.platform === "string" && project.platform) work.about = project.platform;
            if (typeof project.image === "string" && project.image) {
              work.image = absoluteUrl(project.image, canonical);
            }
            return work;
          });
        const jsonLd = {
          "@context": "https://schema.org",
          "@graph": [person, website, profilePage, ...creativeWorks],
        };
        html = html.replace(/<meta property="og:locale"[^>]*>/gi, "");
        html = html.replace(/<meta property="og:site_name"[^>]*>/gi, "");
        html = html.replace(/<meta name="twitter:[^>]*>/gi, "");
        html = html.replace(/<\/head>/i,
          `<meta property="og:locale" content="en_US" />\n` +
          `<meta property="og:site_name" content="${escapeHtml(site.websiteName || author)}" />\n` +
          `${twitter}\n</head>`
        );
        html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");
        const script = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
        html = html.replace(/<\/head>/i, `${script}\n</head>`);
        return html;
      },
    },
  ],
});
