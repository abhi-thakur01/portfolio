import { useState, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Toast } from "./components/Toast";

// Lazy load below-fold components for performance
const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const Skills = lazy(() => import("./components/Skills").then(m => ({ default: m.Skills })));
const Services = lazy(() => import("./components/Services").then(m => ({ default: m.Services })));
const Process = lazy(() => import("./components/Process").then(m => ({ default: m.Process })));
const Work = lazy(() => import("./components/Work").then(m => ({ default: m.Work })));
const SeoPerformance = lazy(() => import("./components/SeoPerformance").then(m => ({ default: m.SeoPerformance })));
const FaqSection = lazy(() => import("./components/FaqSection").then(m => ({ default: m.FaqSection })));
const Contact = lazy(() => import("./components/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));

const SectionLoader = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#c9a227]/30 border-t-[#c9a227] animate-spin" />
  </div>
);

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    showToast(`Selected "${serviceName}". Scrolling to contact form...`);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#f1f0ea] selection:bg-[#c9a227]/30 selection:text-[#f0d060] relative">
      <Navbar onOpenEmail={() => showToast("Opening email composer...")} />

      <main>
        <Hero />

        <Suspense fallback={<SectionLoader />}>
          <About onNotify={showToast} />
          <Skills />
          <Services onSelectService={handleSelectService} />
          <Process />
          <Work />
          <SeoPerformance />
          <FaqSection />
          <Contact
            initialService={selectedService}
            onNotify={showToast}
          />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
