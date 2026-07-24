import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Services } from "./components/Services";
import { InteractiveProjectCostCalculator } from "./components/InteractiveProjectCostCalculator";
import { Process } from "./components/Process";
import { Work } from "./components/Work";
import { SeoPerformance } from "./components/SeoPerformance";
import { FaqSection } from "./components/FaqSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toast } from "./components/Toast";

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
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#f1f0ea] selection:bg-[#c9a227]/30 selection:text-[#f0d060] relative">
      {/* Navigation */}
      <Navbar onOpenEmail={() => showToast("Opening email composer...")} />

      <main>
        {/* 1. Hero Section */}
        <Hero />

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
      </main>

      {/* Footer */}
      <Footer />

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
