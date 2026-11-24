import personalJson from "../../content/personal.json";
import heroJson from "../../content/hero.json";
import aboutJson from "../../content/about.json";
import projectsJson from "../../content/projects.json";
import skillsJson from "../../content/skills.json";
import experienceJson from "../../content/experience.json";
import navJson from "../../content/nav.json";
import siteJson from "../../content/site.json";
import processJson from "../../content/process.json";
import faqsJson from "../../content/faqs.json";
import sectionsJson from "../../content/sections.json";
import testimonialsJson from "../../content/testimonials.json";
import caseStudiesJson from "../../content/case-studies.json";
import blogJson from "../../content/blog.json";
import seoJson from "../../content/seo.json";
import educationJson from "../../content/education.json";
import certificationsJson from "../../content/certifications.json";
import rolesJson from "../../content/roles.json";
import addressesJson from "../../content/addresses.json";

import serviceWordpress from "../../content/services/wordpress.json";
import serviceCms from "../../content/services/cms.json";
import serviceMaintenance from "../../content/services/maintenance.json";
import serviceResponsive from "../../content/services/responsive.json";
import { resolveHeroContent, resolvePersonalName } from "./personalMapping";

export const site = {
  sectionVisibility: {
    hero: true,
    about: true,
    projects: true,
    "case-studies": false,
    skills: true,
    experience: true,
    services: false,
    process: true,
    blog: false,
    testimonials: false,
    faqs: true,
    contact: true,
    footer: true,
    ...(siteJson?.sectionVisibility || {}),
  },
  sectionOrder: Array.isArray(siteJson?.sectionOrder)
    ? siteJson.sectionOrder
    : ["hero", "about", "projects", "skills", "experience", "process", "faqs", "contact"],
  header: siteJson?.header || {},
  footer: siteJson?.footer || {},
  ...siteJson,
};

export function isSectionVisible(key) {
  return site.sectionVisibility?.[key] !== false;
}

export const personal = {
  name: "Abhishek Thakur",
  role: "Web Designer",
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
  ...resolvePersonalName(personalJson),
  photoSideText:
    Array.isArray(personalJson.photoSideText) && personalJson.photoSideText.length
      ? personalJson.photoSideText
      : ["Build", "Create", "Improve"],
  stats: Array.isArray(personalJson.stats) ? personalJson.stats : [],
};

export const hero = resolveHeroContent(heroJson, personal);

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

export const projectCategories = Array.isArray(projectsJson?.categories)
  ? projectsJson.categories
  : [];

export const projects = (Array.isArray(projectsJson?.items) ? projectsJson.items : [])
  .filter((p) => p.active !== false)
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map((p) => ({
    id: p.id || String(Math.random()),
    title: p.title || "Untitled",
    description: p.description || "",
    detailDescription: p.detailDescription || "",
    url: p.url || "",
    detailCategory: p.detailCategory || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    detailTags: Array.isArray(p.detailTags) ? p.detailTags : [],
    category: p.category || "Other",
    platform: p.platform || p.category || "Web",
    image: p.image || "",
    link: p.link || "#",
    active: p.active !== false,
    order: p.order,
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    metrics: p.metrics && typeof p.metrics === "object" ? p.metrics : { label: "", value: "" },
    previewColor: p.previewColor || "",
    features: Array.isArray(p.features) ? p.features : [],
  }));

export const skillCategories = Array.isArray(skillsJson?.categories)
  ? skillsJson.categories
  : [];

export const skillIcons = (Array.isArray(skillsJson?.skillIcons) ? skillsJson.skillIcons : [])
  .filter((s) => s.active !== false)
  .map((s) => ({
    name: s.name || "",
    color: s.color || "#3b82f6",
    category: s.category || "Other",
    image: s.image || s.icon || s.logo || "",
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

export const services = [
  serviceWordpress,
  serviceCms,
  serviceResponsive,
  serviceMaintenance,
]
  .filter(Boolean)
  .map((s) => ({
    id: s.id || "",
    icon: s.icon || "Globe",
    title: s.title || "",
    startingPrice: s.startingPrice || "",
    desc: s.desc || "",
    tags: Array.isArray(s.tags) ? s.tags : [],
    deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
  }));

export const processSteps = (Array.isArray(processJson?.steps) ? processJson.steps : []).map(
  (step, i) => ({
    phase: step.phase || String(i + 1).padStart(2, "0"),
    title: step.title || "",
    sub: step.sub || "",
    duration: step.duration || "",
    desc: step.desc || "",
    tags: Array.isArray(step.tags) ? step.tags : [],
    deliverable: step.deliverable || "",
  })
);

export const faqs = (Array.isArray(faqsJson?.faqs) ? faqsJson.faqs : []).map((f) => ({
  q: f.q || f.question || "",
  a: f.a || f.answer || "",
}));

export const testimonials = {
  sectionTitle: testimonialsJson?.sectionTitle || "What Clients Say",
  sectionSubtitle: testimonialsJson?.sectionSubtitle || "Testimonials",
  description: testimonialsJson?.description || "",
  items: (Array.isArray(testimonialsJson?.items) ? testimonialsJson.items : [])
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
};

export const caseStudies = {
  sectionTitle: caseStudiesJson?.sectionTitle || "Case Studies",
  sectionSubtitle: caseStudiesJson?.sectionSubtitle || "Deep Dives",
  description: caseStudiesJson?.description || "",
  items: (Array.isArray(caseStudiesJson?.items) ? caseStudiesJson.items : [])
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
};

export const blog = {
  sectionTitle: blogJson?.sectionTitle || "Tips & Insights",
  sectionSubtitle: blogJson?.sectionSubtitle || "Blog",
  description: blogJson?.description || "",
  posts: (Array.isArray(blogJson?.posts) ? blogJson.posts : [])
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
};

export const seo = seoJson || {};
export const sections = sectionsJson || {};

export const education = {
  items: (Array.isArray(educationJson?.items) ? educationJson.items : [])
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
};

export const certifications = {
  items: (Array.isArray(certificationsJson?.items) ? certificationsJson.items : [])
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0)),
};

export const roles = Array.isArray(rolesJson?.roles) ? rolesJson.roles : [];
export const addresses = Array.isArray(addressesJson?.addresses) ? addressesJson.addresses : [];

const SECTION_BY_HREF = {
  "#home": "hero",
  "#about": "about",
  "#projects": "projects",
  "#skills": "skills",
  "#experience": "experience",
  "#process": "process",
  "#faqs": "faqs",
  "#contact": "contact",
};

const fallbackLinks = [
  { href: "#home", label: "Home", active: true, order: 1 },
  { href: "#about", label: "About", active: true, order: 2 },
  { href: "#projects", label: "Projects", active: true, order: 3 },
  { href: "#skills", label: "Skills", active: true, order: 4 },
  { href: "#experience", label: "Experience", active: true, order: 5 },
  { href: "#process", label: "Process", active: true, order: 6 },
  { href: "#faqs", label: "FAQ", active: true, order: 7 },
  { href: "#contact", label: "Contact", active: true, order: 8 },
];

const sourceLinks = Array.isArray(navJson?.links) && navJson.links.length ? navJson.links : fallbackLinks;

export const navLinks = sourceLinks
  .filter((l) => l.active !== false)
  .filter((l) => {
    const key = SECTION_BY_HREF[l.href];
    return !key || isSectionVisible(key);
  })
  .sort((a, b) => (a.order || 0) - (b.order || 0))
  .map((l) => ({
    href: l.href || "#",
    label: l.label || "Link",
  }));
