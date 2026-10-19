import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Process } from "./components/Process";
import { CaseStudies } from "./components/CaseStudies";
import { Blog } from "./components/Blog";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { PageLoader, ScrollProgress } from "./components/PageLoader";
import { CustomCursor } from "./components/CustomCursor";
import { isSectionVisible } from "./data/content";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <PageLoader />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        {isSectionVisible("hero") && <Hero />}
        {isSectionVisible("about") && <About />}
        {isSectionVisible("projects") && <Projects />}
        {isSectionVisible("case-studies") && <CaseStudies />}
        {isSectionVisible("skills") && <Skills />}
        {isSectionVisible("experience") && <Experience />}
        {isSectionVisible("process") && <Process />}
        {isSectionVisible("blog") && <Blog />}
        {isSectionVisible("faqs") && <FAQ />}
        {isSectionVisible("contact") && <Contact />}
      </main>
      {isSectionVisible("footer") && <Footer />}
    </div>
  );
}
