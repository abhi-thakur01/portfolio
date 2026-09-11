import personalJson from "../../content/personal.json";
import aboutJson from "../../content/about.json";
import projectsJson from "../../content/projects.json";
import skillsJson from "../../content/skills.json";
import experienceJson from "../../content/experience.json";
import navJson from "../../content/nav.json";

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
  photoSideText:
    Array.isArray(personalJson.photoSideText) && personalJson.photoSideText.length
      ? personalJson.photoSideText
      : ["Build", "Create", "Improve"],
  stats: Array.isArray(personalJson.stats) ? personalJson.stats : [],
};

export const about = {
  heading: "A little about me",
  paragraphs: [],
  ...aboutJson,
  paragraphs: Array.isArray(aboutJson.paragraphs) ? aboutJson.paragraphs : [],
};

export const projects = (Array.isArray(projectsJson?.items) ? projectsJson.items : []).map((p) => ({
  id: p.id || String(Math.random()),
  title: p.title || "Untitled",
  description: p.description || "",
  tags: Array.isArray(p.tags) ? p.tags : [],
  category: p.category || "Other",
  image: p.image || "",
  link: p.link || "#",
}));

export const skillIcons = Array.isArray(skillsJson?.skillIcons) ? skillsJson.skillIcons : [];
export const otherTools = Array.isArray(skillsJson?.otherTools) ? skillsJson.otherTools : [];

export const experience = (Array.isArray(experienceJson?.items) ? experienceJson.items : []).map((e) => ({
  period: e.period || "",
  title: e.title || "",
  description: e.description || "",
  tags: Array.isArray(e.tags) ? e.tags : [],
}));

export const navLinks = Array.isArray(navJson?.links) ? navJson.links : [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];
