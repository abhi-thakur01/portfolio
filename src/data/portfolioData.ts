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
import navJson from "../../content/nav.json";
import heroJson from "../../content/hero.json";
import skillsJson from "../../content/skills.json";
import aboutJson from "../../content/about.json";
import processJson from "../../content/process.json";
import seoJson from "../../content/seo.json";

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
export const NAV_LINKS = navJson.links;
export const HERO = heroJson;
export const SKILL_BARS = skillsJson.skillBars;
export const TAG_CLOUD = skillsJson.tagCloud;
export const TOOLS_ROW_1 = skillsJson.toolsRow1;
export const TOOLS_ROW_2 = skillsJson.toolsRow2;

export const ABOUT = aboutJson;

export const ABOUT_TRAITS = aboutJson.traits.map((t) => ({
  ...t,
  icon: iconMap[t.icon] || Globe,
}));

export const PROCESS = processJson.steps;

export const SEO_FEATURES = seoJson.features.map((f) => ({
  ...f,
  icon: iconMap[f.icon] || Zap,
}));

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
