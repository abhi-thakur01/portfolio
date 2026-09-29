import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { isSectionVisible } from "./data/content";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      <Navbar />
      <main>
        {isSectionVisible("hero") && <Hero />}
        {isSectionVisible("about") && <About />}
        {isSectionVisible("projects") && <Projects />}
        {isSectionVisible("skills") && <Skills />}
        {isSectionVisible("experience") && <Experience />}
        {isSectionVisible("contact") && <Contact />}
      </main>
      {isSectionVisible("footer") && <Footer />}
    </div>
  );
}
