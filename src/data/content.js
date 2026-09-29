import personalJson from "../../content/personal.json";
import aboutJson from "../../content/about.json";
import projectsJson from "../../content/projects.json";
import skillsJson from "../../content/skills.json";
import experienceJson from "../../content/experience.json";
import navJson from "../../content/nav.json";
import siteJson from "../../content/site.json";

export const site = {
  sectionVisibility: {
    hero: true,
    about: true,
    projects: true,
    skills: true,
    experience: true,
    contact: true,
    footer: true,
    ...(siteJson?.sectionVisibility || {}),
  },
  sectionOrder: Array.isArray(siteJson?.sectionOrder)
    ? siteJson.sectionOrder
    : ["hero", "about", "projects", "skills", "experience", "contact"],
  header: siteJson?.header || {},
  footer: siteJson?.footer || {},
  ...siteJson,
};

export function isSectionVisible(key) {
  return site.sectionVisibility?.[key] !== false;
}

export const personal = {
  name: "Abhishek Thakur",
  role: "Junior Web Designer",
  bio: "",
  email: "",
  phone: "",
  location: "",
  workingHours: "",
  availability: "",
  github: "#",
  linkedin: "#",
  twitter: "",
  resumeUrl: "#",
  photo: "",
  greeting: "Hi, I'm",
  photoSideText: ["Build", "Create", "Improve"],
  ctaPrimary: "View My Projects",
  ctaSecondary: "Download Resume",
  stats: [],
  ...personalJson,
  name: personalJson.displayName || personalJson.fullName || personalJson.name || "Abhishek Thakur",
  photoSideText:
    Array.isArray(personalJson.photoSideText) && personalJson.photoSideText.length
      ? personalJson.photoSideText
      : ["Build", "Create", "Improve"],
  stats: Array.isArray(personalJson.stats) ? personalJson.stats : [],
};

export const about = {
  heading: "A little about me",
  paragraphs: [],
  whatIDo: [],
  interests: [],
  ...aboutJson,
  paragraphs: Array.isArray(aboutJson.paragraphs) ? aboutJson.paragraphs : [],
  whatIDo: Array.isArray(aboutJson.whatIDo) ? aboutJson.whatIDo : [],
  interests: Array.isArray(aboutJson.interests) ? aboutJson.interests : [],
};

export const projects = (Array.isArray(projectsJson?.items) ? projectsJson.items : [])
  .filter((p) => p.active !== false)
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map((p) => ({
    id: p.id || String(Math.random()),
    title: p.title || "Untitled",
    description: p.description || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    category: p.category || "Other",
    platform: p.platform || p.category || "Web",
    image: p.image || "",
    link: p.link || "#",
  }));

export const skillIcons = (Array.isArray(skillsJson?.skillIcons) ? skillsJson.skillIcons : [])
  .filter((s) => s.active !== false)
  .map((s) => ({
    name: s.name || "",
    color: s.color || "#3b82f6",
    category: s.category || "Other",
  }));
export const otherTools = Array.isArray(skillsJson?.otherTools) ? skillsJson.otherTools : [];

export const experience = (Array.isArray(experienceJson?.items) ? experienceJson.items : [])
  .filter((e) => e.active !== false)
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map((e) => ({
    period: e.period || "",
    title: e.title || "",
    description: e.description || "",
    tags: Array.isArray(e.tags) ? e.tags : [],
  }));

export const navLinks = (Array.isArray(navJson?.links) ? navJson.links : [])
  .filter((l) => l.active !== false)
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map((l) => ({
    href: l.href || "#",
    label: l.label || "Link",
  }));

if (!navLinks.length) {
  navLinks.push(
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" }
  );
}
