import { useState, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Toast } from "./components/Toast";

// Lazy load below-fold components for performance
const About = lazy(() => import("./components/About").then(m => ({ default: m.About })));
const Skills = lazy(() => import("./components/Skills").then(m => ({ default: m.Skills })));
const Services = lazy(() => import("./components/Services").then(m => ({ default: m.Services })));
const InteractiveProjectCostCalculator = lazy(() => import("./components/InteractiveProjectCostCalculator").then(m => ({ default: m.InteractiveProjectCostCalculator })));
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
  const [selectedSpec, setSelectedSpec] = useState<{
    platform: string;
    pages: number;
    budgetEst: string;
  } | null>(null);

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

  const handleApplySpec = (spec: { platform: string; pages: number; budgetEst: string }) => {
    setSelectedSpec(spec);
    showToast(`Applied ${spec.platform} spec (${spec.pages} pages) to form!`);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      setTimeout(() => contactElem.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#f1f0ea] selection:bg-[#c9a227]/30 selection:text-[#f0d060] relative">
      {/* Navigation - eager loaded for LCP */}
      <Navbar onOpenEmail={() => showToast("Opening email composer...")} />

      <main>
        {/* 1. Hero Section - eager for LCP */}
        <Hero />

        <Suspense fallback={<SectionLoader />}>
          {/* 2. About Me Section */}
          <About onNotify={showToast} />

          {/* 3. Skills & Technologies Section */}
          <Skills />

          {/* 4. Services Section */}
          <Services onSelectService={handleSelectService} />

          {/* 5. Interactive Project Estimator */}
          <InteractiveProjectCostCalculator onApplySpec={handleApplySpec} />

          {/* 6. Process / Workflow Pipeline */}
          <Process />

          {/* 7. Selected Work & Client Projects */}
          <Work />

          {/* 8. SEO & Performance Benchmark Audit */}
          <SeoPerformance />

          {/* 9. FAQs & Client Trust */}
          <FaqSection />

          {/* 10. Contact Section */}
          <Contact
            initialService={selectedService}
            initialSpec={selectedSpec}
            onNotify={showToast}
          />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
