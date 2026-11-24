import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Process } from "./components/Process";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { PageLoader, ScrollProgress } from "./components/PageLoader";
import { CustomCursor } from "./components/CustomCursor";
import { isSectionVisible, site } from "./data/content";
import { getVisibleSectionOrder } from "./utils/sectionOrder";
import { lazy, Suspense } from "react";

const Services = lazy(() => import("./components/Services").then((module) => ({ default: module.Services })));
const CaseStudies = lazy(() => import("./components/CaseStudies").then((module) => ({ default: module.CaseStudies })));
const Blog = lazy(() => import("./components/Blog").then((module) => ({ default: module.Blog })));
const Testimonials = lazy(() => import("./components/Testimonials").then((module) => ({ default: module.Testimonials })));

const SECTION_COMPONENTS = {
  hero: Hero,
  about: About,
  projects: Projects,
  services: Services,
  skills: Skills,
  experience: Experience,
  "case-studies": CaseStudies,
  process: Process,
  blog: Blog,
  testimonials: Testimonials,
  faqs: FAQ,
  contact: Contact,
};

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PageLoader />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {getVisibleSectionOrder(site.sectionOrder, site.sectionVisibility).map((key) => {
          const Component = SECTION_COMPONENTS[key];
          return (
            <Suspense key={key} fallback={null}>
              <Component />
            </Suspense>
          );
        })}
      </main>
      {isSectionVisible("footer") && <Footer />}
    </div>
  );
}
