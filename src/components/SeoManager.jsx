import { useEffect } from "react";
import { personal, site } from "../data/content";

function setMeta(selector, attribute, value) {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const [nameKind, nameValue] = selector.startsWith('meta[name="')
      ? ["name", selector.match(/name="([^"]+)"/)?.[1]]
      : selector.startsWith('meta[property="')
        ? ["property", selector.match(/property="([^"]+)"/)?.[1]]
        : ["", ""];
    if (nameKind) element.setAttribute(nameKind, nameValue || "");
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export function SeoManager() {
  useEffect(() => {
    const title = site.metaTitle || site.websiteTitle || "Abhishek Thakur";
    const description = site.metaDescription || "";
    const canonical = site.canonicalUrl || "";
    const ogImage = site.ogImage || "";
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="author"]', "content", personal.name || "");
    setMeta('meta[name="robots"]', "content", "index, follow");
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:locale"]', "content", "en_US");
    setMeta('meta[property="og:site_name"]', "content", site.websiteName || personal.name || "");
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[property="og:image:width"]', "content", "1424");
    setMeta('meta[property="og:image:height"]', "content", "752");
    setMeta('meta[property="og:image:alt"]', "content", "Abhishek Thakur — Web Designer");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", ogImage);
    setMeta('meta[name="twitter:url"]', "content", canonical);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    if (canonical) canonicalLink.setAttribute("href", canonical);

    const favicon = site.favicon || "/favicon.svg";
    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.setAttribute("rel", "icon");
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute("href", favicon);
  }, []);

  return null;
}
