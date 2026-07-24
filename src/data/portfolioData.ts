import {
  Globe,
  Smartphone,
  Zap,
  Search,
  Target,
  Palette,
  RefreshCw,
  LayoutGrid,
  PenTool
} from "lucide-react";

export const PERSONAL_INFO = {
  name: "Abhishek Thakur",
  shortName: "Abhishek",
  monogram: "AT",
  roleTitle: "Junior Web Designer & WordPress / CMS Specialist",
  tagline: "Building high-converting, mobile-perfect websites that blend visual polish with reliable CMS engineering.",
  primaryEmail: "thakurabhi8925@gmail.com",
  contactEmail: "hello@abhishekthakur.in",
  phone: "+91 82192 88267",
  location: "India — Available Worldwide (Remote)",
  timezone: "IST (UTC+5:30)",
  availability: "Available for Freelance & Full-time Roles",
  experienceYears: "1+",
  projectsDelivered: "12+",
  toolsMastered: "10+",
  clientSatisfaction: "100%",
  githubUrl: "https://github.com/abhi-thakur01",
  agency: {
    role: "Junior Web Designer",
    company: "Gigsoft Pro",
    period: "2025 – Present",
    desc: "Building responsive sites for international clients across WordPress, GoHighLevel, and Square Online — custom layouts in Elementor and Beaver Builder, mobile responsiveness, cross-browser testing, and ongoing maintenance."
  },
  education: [
    { degree: "BCA", period: "2020 – 2023", name: "Bachelor of Computer Applications", status: "Completed" },
    { degree: "MCA", period: "2023 – 2025", name: "Master of Computer Applications", status: "Pursuing" }
  ]
};

export const ROLES = [
  "Web Designer",
  "WordPress & Elementor Developer",
  "Beaver Builder Specialist",
  "Responsive Web Designer",
  "GoHighLevel & Square Online Builder",
  "Landing Page Designer",
  "CMS Website Developer"
];

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#calculator", label: "Estimator" },
  { href: "#contact", label: "Contact" },
];

export const ADDRESSES = [
  "abhishekthakur.in",
  "revivedkansas.info",
  "melaniehoggan.com"
];

export const SKILL_BARS = [
  { label: "WordPress & Elementor", pct: 92, category: "cms", desc: "Custom theme customization, dynamic templates, ACF & popups" },
  { label: "WordPress & Beaver Builder", pct: 88, category: "cms", desc: "Lightweight modular layouts, custom modules, high performance" },
  { label: "Mobile-First Responsive Design", pct: 96, category: "frontend", desc: "Pixel-perfect breakpoints across smartphones, tablets & 4K displays" },
  { label: "HTML5 / CSS3 / Tailwind / Bootstrap", pct: 89, category: "frontend", desc: "Semantic clean markup, modern utility styling, smooth CSS animations" },
  { label: "GoHighLevel & Square Online", pct: 84, category: "cms", desc: "Sales funnels, e-commerce storefronts, booking pipelines" },
  { label: "JavaScript & DOM Interactions", pct: 68, category: "frontend", desc: "Interactive UI widgets, tab filtering, sliders & form handlers" },
  { label: "Core Web Vitals & Page Speed", pct: 90, category: "performance", desc: "Image compression, caching setups, LCP/CLS score tuning" },
  { label: "Cross-Browser Compatibility", pct: 92, category: "performance", desc: "Flawless rendering on Chrome, Safari, Firefox & Edge" }
];

export const TAG_CLOUD = [
  "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Bootstrap", "WordPress",
  "Elementor Pro", "Beaver Builder", "GoHighLevel", "Square Online", "Webflow",
  "Wix Studio", "Squarespace", "Framer", "Figma to Web", "SEO Schema", "Core Web Vitals"
];

export const TOOLS_ROW_1 = [
  "WordPress", "Webflow", "Framer", "Wix", "Squarespace", "Kajabi", "GoHighLevel", "Square Online"
];

export const TOOLS_ROW_2 = [
  "Elementor Pro", "Beaver Builder", "Bootstrap 5", "Tailwind CSS", "Figma", "VS Code", "PageSpeed Insights", "Google Analytics"
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
  highlights: string[];
  tags: string[];
  metrics: { label: string; value: string };
  previewColor: string;
  features: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: "revived-kansas",
    title: "Revived Kansas",
    url: "revivedkansas.info",
    href: "https://www.revivedkansas.info/",
    platform: "Square Online",
    category: "Client Work",
    desc: "A clean, responsive business site built on Square Online, with the layout tuned for mobile users so the experience holds up on any device. Delivered as client work at Gigsoft Pro.",
    highlights: ["Square Online Storefront", "Mobile-Optimized UX", "Fast Load Speed"],
    tags: ["Square Online", "Responsive Design", "Mobile Optimised", "Client Project"],
    metrics: { label: "Mobile Score", value: "98/100" },
    previewColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
    features: [
      "Custom product showcase grid with fluid filters",
      "Seamless mobile checkout experience via Square",
      "Adaptive typography calibrated for readability",
      "Zero layout shift (CLS < 0.02)"
    ]
  },
  {
    id: "melanie-hoggan",
    title: "Melanie Hoggan",
    url: "melaniehoggan.com",
    href: "https://melaniehoggan.com/",
    platform: "WordPress",
    category: "Client Work",
    desc: "A fully responsive WordPress site built with Beaver Builder, with custom sections and layouts aimed at better engagement — a polished result for an international client.",
    highlights: ["WordPress & Beaver Builder", "Bespoke Section Designs", "High Conversion CTAs"],
    tags: ["WordPress", "Beaver Builder", "Custom Layouts", "International Client"],
    metrics: { label: "Client Rating", value: "5.0 ★" },
    previewColor: "from-yellow-500/20 via-amber-600/10 to-transparent",
    features: [
      "Custom Beaver Builder modular section library",
      "Streamlined contact capture with instant validation",
      "Cross-browser testing across Safari, Chrome, and iOS",
      "SEO-ready permalink & schema structure"
    ]
  },
  {
    id: "gohighlevel-funnels",
    title: "High-Converting CMS Funnels",
    url: "abhishekthakur.in/demos",
    href: "#contact",
    platform: "GoHighLevel & Elementor",
    category: "Featured",
    desc: "Custom landing pages and sales funnels engineered on GoHighLevel and WordPress Elementor with multi-step lead capture and crisp visual hierarchy.",
    highlights: ["High Conversion Rates", "Multi-Step Forms", "Fast CDN Delivery"],
    tags: ["GoHighLevel", "Elementor Pro", "Landing Page", "Lead Capture"],
    metrics: { label: "Avg Conversion", value: "+34%" },
    previewColor: "from-orange-500/20 via-amber-500/10 to-transparent",
    features: [
      "Multi-step lead qualification forms",
      "Automated webhook integrations",
      "Lightning fast mobile viewport rendering",
      "A/B test ready hero layouts"
    ]
  }
];

export const SERVICES = [
  {
    id: "wordpress",
    icon: Globe,
    title: "WordPress Development",
    startingPrice: "$299",
    desc: "Custom WordPress websites built with Elementor Pro or Beaver Builder — responsive, modern layouts with ongoing maintenance, plugin security, and client handoff.",
    tags: ["WordPress", "Elementor", "Beaver Builder", "WooCommerce"],
    deliverables: [
      "Custom layout design from scratch",
      "Full mobile & tablet responsiveness",
      "Easy CMS visual editor setup for clients",
      "Speed caching & security hardening"
    ]
  },
  {
    id: "responsive",
    icon: Smartphone,
    title: "Responsive Web Design",
    startingPrice: "$249",
    desc: "Mobile-first websites that hold up beautifully across every screen size and browser — clean, fast, and easy to use on iPhone, Android, tablets, and 4K desktops.",
    tags: ["Mobile-First", "Cross-Browser", "Pixel-Perfect", "Tailwind/CSS"],
    deliverables: [
      "Fluid grid layouts with flexible typography",
      "Touch-friendly tap targets and sticky nav",
      "Zero horizontal scrolling or broken elements",
      "Cross-browser tested (Chrome, Safari, Firefox)"
    ]
  },
  {
    id: "cms",
    icon: LayoutGrid,
    title: "CMS Website Building",
    startingPrice: "$279",
    desc: "Professional sites built on GoHighLevel, Square Online, Wix, Squarespace, Webflow, and other leading platforms — matched to your business needs.",
    tags: ["GoHighLevel", "Square Online", "Webflow", "Wix / Squarespace"],
    deliverables: [
      "No-code platform setup & DNS connection",
      "Custom branded styling & font integration",
      "E-commerce or booking pipeline integration",
      "1-on-1 video walkthrough for client handover"
    ]
  },
  {
    id: "maintenance",
    icon: RefreshCw,
    title: "Website Maintenance & Fixes",
    startingPrice: "$149",
    desc: "Ongoing updates, responsive bug fixes, speed tune-ups, and layout refreshes so your website stays secure, fast, and modern.",
    tags: ["Updates", "Bug Fixes", "Performance Tuning", "Backups"],
    deliverables: [
      "Plugin & core system updates without downtime",
      "Fix broken layouts or mobile display bugs",
      "Image optimization & script cleanup",
      "Monthly health check & speed verification"
    ]
  },
  {
    id: "design-to-code",
    icon: PenTool,
    title: "Figma to Live Website",
    startingPrice: "$299",
    desc: "Turning Figma mockups, wireframes, or rough brand ideas into pixel-perfect, fully functional responsive web pages with clean code or visual builders.",
    tags: ["HTML5", "CSS3 / Bootstrap", "Figma to Code", "Interactive UI"],
    deliverables: [
      "Exact match to Figma spacing and typography",
      "Custom interactive hover effects and animations",
      "Clean semantic code structure",
      "Form validation and webhook connections"
    ]
  }
];

export const PROCESS = [
  {
    phase: "01",
    title: "Discovery & Strategy",
    sub: "Understanding your vision",
    duration: "Day 1–2",
    desc: "A close look at your brand, business goals, audience, and competitors — so the project scope and roadmap are crystal clear before a single pixel is placed.",
    tags: ["Brand Research", "Competitor Audit", "Goal Definition", "Site Architecture"],
    deliverable: "Project Brief & Sitemap"
  },
  {
    phase: "02",
    title: "Wireframing & Flow",
    sub: "Mapping user journeys",
    duration: "Day 2–4",
    desc: "Strategy becomes structured wireframes that map the user journey, CTA placements, and content hierarchy so everyone is aligned before visual styling.",
    tags: ["Low-Fi Wireframes", "UX Hierarchy", "Conversion Strategy", "Content Flow"],
    deliverable: "Clickable Wireframe Layout"
  },
  {
    phase: "03",
    title: "Visual Design",
    sub: "Crafting the aesthetic",
    duration: "Day 4–6",
    desc: "Pixel-perfect visual design with attention to modern typography, warm gold accents, spacious grid layouts, and consistent brand identity.",
    tags: ["Typography System", "Color Theory", "Custom UI Elements", "Interactive States"],
    deliverable: "High-Fidelity UI Design"
  },
  {
    phase: "04",
    title: "Development & Build",
    sub: "Bringing designs to life",
    duration: "Day 6–9",
    desc: "Built cleanly with Elementor Pro, Beaver Builder, GoHighLevel, Square Online, or custom HTML/CSS — speed, responsiveness, and clean structure from day one.",
    tags: ["WordPress / Elementor", "GoHighLevel / Square", "Custom CSS", "Clean HTML5"],
    deliverable: "Fully Functional Live Staging Site"
  },
  {
    phase: "05",
    title: "Testing & Speed Pass",
    sub: "Polishing every detail",
    duration: "Day 9–10",
    desc: "Cross-browser testing on mobile/tablet/desktop, Core Web Vitals checks, SEO meta audits, and form testing — verified before going live.",
    tags: ["Core Web Vitals", "Cross-Browser Audit", "SEO Meta Check", "Form QA"],
    deliverable: "Lighthouse Speed 90+ Score"
  },
  {
    phase: "06",
    title: "Launch & Support",
    sub: "Go live & grow",
    duration: "Day 11+",
    desc: "A smooth domain launch followed by live monitoring, a screen recording walkthrough of the CMS for you, and 30 days of post-launch warranty support.",
    tags: ["Domain DNS Setup", "CMS Handover Video", "30-Day Free Support", "Live Launch"],
    deliverable: "Live Website & Admin Access"
  },
];

export const SEO_FEATURES = [
  {
    icon: Zap,
    title: "Core Web Vitals Compliant",
    desc: "LCP, FID, and CLS tuned to exceed Google's strict performance benchmarks, directly boosting your organic rankings and lowering ad bounce rates.",
    badge: "95+ Lighthouse"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Indexing Ready",
    desc: "Every site is architected for mobile screens first, matching Google's mobile crawler algorithms and providing a smooth smartphone UX.",
    badge: "100% Responsive"
  },
  {
    icon: Search,
    title: "Semantic HTML5 & Structured Schema",
    desc: "Clean hierarchy (H1-H6), alt tags, OpenGraph previews, and structured JSON-LD schema so search engines index your pages accurately.",
    badge: "Rich Snippets"
  },
  {
    icon: Target,
    title: "Conversion-Focused UX Architecture",
    desc: "Clear visual hierarchy, strategic call-to-action buttons, trust signals, and rapid form submissions engineered to turn visitors into paying clients.",
    badge: "+35% Inquiries"
  },
];

export const FAQS = [
  {
    q: "What platforms do you specialize in?",
    a: "I specialize primarily in WordPress (Elementor Pro & Beaver Builder), GoHighLevel funnels, and Square Online storefronts. I also work with custom HTML5/CSS3/Bootstrap/Tailwind, Webflow, Wix, and Squarespace."
  },
  {
    q: "Will my website be easy for me to edit later?",
    a: "Yes, 100%! I build with clean CMS structures so you can easily update text, change images, or add new blog posts/products without touching any code. I also include a quick video walkthrough showing you how."
  },
  {
    q: "How long does a typical website project take?",
    a: "A single landing page or simple business site usually takes 4 to 7 business days. A multi-page custom WordPress or CMS website takes about 10 to 14 business days from kickoff to launch."
  },
  {
    q: "How do we get started?",
    a: "Send me a message via the contact form or email (thakurabhi8925@gmail.com) with a brief idea of what you need. I'll get back to you within 24 hours with recommendations and a clear timeline."
  }
];
