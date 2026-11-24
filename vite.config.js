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
      name: "portfolio-cms-seo",
      transformIndexHtml(html) {
        const site = JSON.parse(readFileSync(path.resolve(__dirname, "content/site.json"), "utf8"));
        const personal = JSON.parse(readFileSync(path.resolve(__dirname, "content/personal.json"), "utf8"));
        const title = site.metaTitle || site.websiteTitle || personal.fullName || personal.name || "Portfolio";
        const description = site.metaDescription || "";
        const canonical = site.canonicalUrl || "";
        const ogImage = site.ogImage || "";
        const author = personal.displayName || personal.fullName || personal.name || "";

        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
        html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${description.replace(/"/g, "&quot;")}" />`);
        html = html.replace(/<meta name="author"[^>]*>/i, author ? `<meta name="author" content="${author.replace(/"/g, "&quot;")}" />` : "");
        if (canonical) html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
        html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />`);
        html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />`);
        html = html.replace(/<meta property="og:url"[^>]*>/i, canonical ? `<meta property="og:url" content="${canonical}" />` : "");
        if (ogImage) html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${ogImage}" />`);

        const twitter = [
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />`,
          `<meta name="twitter:description" content="${description.replace(/"/g, "&quot;")}" />`,
          ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : "",
        ].filter(Boolean).join("\n");

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: author,
          url: canonical,
          jobTitle: personal.role || "",
          email: personal.email || "",
          sameAs: [personal.github, personal.linkedin].filter((value) => typeof value === "string" && /^https?:/.test(value)),
        };
        const script = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
        html = html.replace(/<\/head>/i, `${twitter}\n${script}\n</head>`);
        return html;
      },
    },
  ],
});
