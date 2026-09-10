import {
  Globe,
  Smartphone,
  Zap,
  Search,
  Target,
  Palette,
  RefreshCw,
  LayoutGrid,
  PenTool,
  type LucideIcon,
} from "lucide-react";

import personalJson from "../../content/personal.json";
import rolesJson from "../../content/roles.json";
import addressesJson from "../../content/addresses.json";
import faqsJson from "../../content/faqs.json";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Zap,
  Search,
  Target,
  Palette,
  RefreshCw,
  LayoutGrid,
  PenTool,
};

export const PERSONAL_INFO = personalJson;

export const ROLES: string[] = rolesJson.roles;

export const ADDRESSES: string[] = addressesJson.addresses;

export const FAQS = faqsJson.faqs;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#calculator", label: "Estimator" },
  { href: "#contact", label: "Contact" },
];

export const SKILL_BARS = [
  { label: "WordPress & Elementor", pct: 92, category: "cms", desc: "Custom theme customization, dynamic templates, ACF & popups" },
  { label: "WordPress & Beaver Builder", pct: 88, category: "cms", desc: "Lightweight modular layouts, custom modules, high performance" },
  { label: "Mobile-First Responsive Design", pct: 96, category: "frontend", desc: "Pixel-perfect breakpoints across smartphones, tablets & 4K displays" },
  { label: "HTML5 / CSS3 / Tailwind / Bootstrap", pct: 89, category: "frontend", desc: "Semantic clean markup, modern utility styling, smooth CSS animations" },
  { label: "GoHighLevel & Square Online", pct: 84, category: "cms", desc: "Sales funnels, e-commerce storefronts, booking pipelines" },
  { label: "JavaScript & DOM Interactions", pct: 68, category: "frontend", desc: "Interactive UI widgets, tab filtering, sliders & form handlers" },
  { label: "Core Web Vitals & Page Speed", pct: 90, category: "performance", desc: "Image compression, caching setups, LCP/CLS score tuning" },
  { label: "Cross-Browser Compatibility", pct: 92, category: "performance", desc: "Flawless rendering on Chrome, Safari, Firefox & Edge" },
];

export const TAG_CLOUD = [
  "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Bootstrap", "WordPress",
  "Elementor Pro", "Beaver Builder", "GoHighLevel", "Square Online", "Webflow",
  "Wix Studio", "Squarespace", "Framer", "Figma to Web", "SEO Schema", "Core Web Vitals",
];

export const TOOLS_ROW_1 = [
  "WordPress", "Webflow", "Framer", "Wix", "Squarespace", "Kajabi", "GoHighLevel", "Square Online",
];

export const TOOLS_ROW_2 = [
  "Elementor Pro", "Beaver Builder", "Bootstrap 5", "Tailwind CSS", "Figma", "VS Code", "PageSpeed Insights", "Google Analytics",
];

export const ABOUT_TRAITS = [
  { icon: Target, label: "Conversion-Focused", desc: "Strategic CTA placement and user flow to drive real inquiries." },
  { icon: Smartphone, label: "Mobile-First Design", desc: "Tuned for thumbs, fast loading on 4G/5G mobile devices." },
  { icon: Zap, label: "Fast & Optimized", desc: "Under 1.5s load times for optimal search ranking and low bounce rates." },
  { icon: Search, label: "SEO-Friendly Builds", desc: "Semantic tags, schema markup, and meta structure built-in." },
  { icon: Palette, label: "Clean UI/UX", desc: "Modern typography, consistent spacing, and intuitive hierarchy." },
  { icon: Globe, label: "No-Code & CMS Mastery", desc: "Easy for clients to edit without breaking the layout." },
];

export interface ProjectItem {
  id: string;
  title: string;
  url: string;
  href: string;
  platform: string;
  category: "Client Work" | "Featured" | "Case Study";
  desc: string;
  image?: string;
  highlights: string[];
  tags: string[];
  metrics: { label: string; value: string };
  previewColor: string;
  features: string[];
}

const projectModules = import.meta.glob("../../content/projects/*.json", { eager: true }) as Record<
  string,
  { default: ProjectItem }
>;

export const PROJECTS: ProjectItem[] = Object.values(projectModules).map((m) => m.default);

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  startingPrice: string;
  desc: string;
  tags: string[];
  deliverables: string[];
}

const serviceModules = import.meta.glob("../../content/services/*.json", { eager: true }) as Record<
  string,
  {
    default: {
      id: string;
      icon: string;
      title: string;
      startingPrice: string;
      desc: string;
      tags: string[];
      deliverables: string[];
    };
  }
>;

export const SERVICES: ServiceItem[] = Object.values(serviceModules).map((m) => ({
  ...m.default,
  icon: iconMap[m.default.icon] || Globe,
}));

export const PROCESS = [
  {
    phase: "01",
    title: "Discovery & Strategy",
    sub: "Understanding your vision",
    duration: "Day 1–2",
    desc: "A close look at your brand, business goals, audience, and competitors — so the project scope and roadmap are crystal clear before a single pixel is placed.",
    tags: ["Brand Research", "Competitor Audit", "Goal Definition", "Site Architecture"],
    deliverable: "Project Brief & Sitemap",
  },
  {
    phase: "02",
    title: "Wireframing & Flow",
    sub: "Mapping user journeys",
    duration: "Day 2–4",
    desc: "Strategy becomes structured wireframes that map the user journey, CTA placements, and content hierarchy so everyone is aligned before visual styling.",
    tags: ["Low-Fi Wireframes", "UX Hierarchy", "Conversion Strategy", "Content Flow"],
    deliverable: "Clickable Wireframe Layout",
  },
  {
    phase: "03",
    title: "Visual Design",
    sub: "Crafting the aesthetic",
    duration: "Day 4–6",
    desc: "Pixel-perfect visual design with attention to modern typography, warm gold accents, spacious grid layouts, and consistent brand identity.",
    tags: ["Typography System", "Color Theory", "Custom UI Elements", "Interactive States"],
    deliverable: "High-Fidelity UI Design",
  },
  {
    phase: "04",
    title: "Development & Build",
    sub: "Bringing designs to life",
    duration: "Day 6–9",
    desc: "Built cleanly with Elementor Pro, Beaver Builder, GoHighLevel, Square Online, or custom HTML/CSS — speed, responsiveness, and clean structure from day one.",
    tags: ["WordPress / Elementor", "GoHighLevel / Square", "Custom CSS", "Clean HTML5"],
    deliverable: "Fully Functional Live Staging Site",
  },
  {
    phase: "05",
    title: "Testing & Speed Pass",
    sub: "Polishing every detail",
    duration: "Day 9–10",
    desc: "Cross-browser testing on mobile/tablet/desktop, Core Web Vitals checks, SEO meta audits, and form testing — verified before going live.",
    tags: ["Core Web Vitals", "Cross-Browser Audit", "SEO Meta Check", "Form QA"],
    deliverable: "Lighthouse Speed 90+ Score",
  },
  {
    phase: "06",
    title: "Launch & Support",
    sub: "Go live & grow",
    duration: "Day 11+",
    desc: "A smooth domain launch followed by live monitoring, a screen recording walkthrough of the CMS for you, and 30 days of post-launch warranty support.",
    tags: ["Domain DNS Setup", "CMS Handover Video", "30-Day Free Support", "Live Launch"],
    deliverable: "Live Website & Admin Access",
  },
];

export const SEO_FEATURES = [
  {
    icon: Zap,
    title: "Core Web Vitals Compliant",
    desc: "LCP, FID, and CLS tuned to exceed Google's strict performance benchmarks, directly boosting your organic rankings and lowering ad bounce rates.",
    badge: "95+ Lighthouse",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Indexing Ready",
    desc: "Every site is architected for mobile screens first, matching Google's mobile crawler algorithms and providing a smooth smartphone UX.",
    badge: "100% Responsive",
  },
  {
    icon: Search,
    title: "Semantic HTML5 & Structured Schema",
    desc: "Clean hierarchy (H1-H6), alt tags, OpenGraph previews, and structured JSON-LD schema so search engines index your pages accurately.",
    badge: "Rich Snippets",
  },
  {
    icon: Target,
    title: "Conversion-Focused UX Architecture",
    desc: "Clear visual hierarchy, strategic call-to-action buttons, trust signals, and rapid form submissions engineered to turn visitors into paying clients.",
    badge: "+35% Inquiries",
  },
];
