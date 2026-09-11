import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PERSONAL_INFO } from "../data/portfolioData";

interface ContactProps {
  initialService?: string;
  initialSpec?: { platform: string; pages: number; budgetEst: string } | null;
  onNotify?: (msg: string) => void;
}

export const Contact: React.FC<ContactProps> = ({
  initialService = "",
  initialSpec = null,
  onNotify,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: initialService || "",
    budget: initialSpec?.budgetEst || "",
    message: initialSpec
      ? `Hi Abhishek, I'd like to build a ${initialSpec.pages}-page website on ${initialSpec.platform}. Estimated budget: ${initialSpec.budgetEst}.`
      : "",
    website: "", // honeypot
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync when parent props change (service selector + calculator)
  useEffect(() => {
    if (initialService) {
      setForm((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (initialSpec) {
      setForm((prev) => ({
        ...prev,
        budget: initialSpec.budgetEst,
        message: prev.message || `Hi Abhishek, I'd like to build a ${initialSpec.pages}-page website on ${initialSpec.platform}. Estimated budget: ${initialSpec.budgetEst}.`,
      }));
    }
  }, [initialSpec]);

  const handleField =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (onNotify) {
      onNotify(`Copied ${type === "email" ? "Email" : "Phone"} to clipboard!`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client validation
    if (form.name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Message should be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: form.service,
          budget: form.budget,
          message: form.message,
          website: form.website, // honeypot
          platform: initialSpec?.platform,
          pages: initialSpec?.pages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setSent(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#c9a227", "#f0d060", "#ffffff"],
        });
      } catch {}

      if (onNotify) {
        onNotify("Message sent! I will reply within 24 hours.");
      }
    } catch (err: any) {
      setError(
        err.message || "Something went wrong. Please email directly at thakurabhi8925@gmail.com"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#090912] content-visibility-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#f0d060] tracking-wider mb-2">
            {"// contact.sh"}
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Let's Build Something <br />
            <span className="gold-gradient-text">Great Together</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Have a project in mind, need a WordPress/CMS redesign, or want to
            discuss a remote role? I typically reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-display font-bold text-2xl text-white">
              Get In Touch Direct
            </h3>

            {/* Email Row */}
            <div className="p-4 rounded-xl bg-[#121222] border border-white/10 flex items-center justify-between group hover:border-[#c9a227]/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Primary Email
                  </div>
                  <a
                    href={`mailto:${PERSONAL_INFO.primaryEmail}`}
                    className="text-white text-xs sm:text-sm font-mono hover:text-[#f0d060] transition-colors"
                  >
                    {PERSONAL_INFO.primaryEmail}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(PERSONAL_INFO.primaryEmail, "email")}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-400 hover:text-[#f0d060] transition-colors"
                title="Copy Email"
                aria-label="Copy email address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Phone / WhatsApp Row */}
            <div className="p-4 rounded-xl bg-[#121222] border border-white/10 flex items-center justify-between group hover:border-[#c9a227]/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Phone / WhatsApp
                  </div>
                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    className="text-white text-xs sm:text-sm font-mono hover:text-[#f0d060] transition-colors"
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(PERSONAL_INFO.phone, "phone")}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-400 hover:text-[#f0d060] transition-colors"
                title="Copy Phone"
                aria-label="Copy phone number"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Location Row */}
            <div className="p-4 rounded-xl bg-[#121222] border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-gray-400">
                  Location
                </div>
                <div className="text-white text-xs sm:text-sm">
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            {/* Availability Box */}
            <div className="p-5 rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-start gap-3 text-xs text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f0d060] animate-pulse shrink-0 mt-1" />
              <div>
                <strong className="text-white">
                  Currently accepting new projects:
                </strong>{" "}
                Web design, WordPress/Elementor builds, landing pages &amp; CMS
                redesigns. Response within 24h.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#121222] border border-[#c9a227]/35 p-6 sm:p-10 shadow-2xl shadow-black/80 corner-bracket always-active">
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot - hidden from users */}
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={handleField("website")}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-mono text-gray-300 mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleField("name")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-mono text-gray-300 mb-1.5"
                      >
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={handleField("email")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-mono text-gray-300 mb-1.5"
                      >
                        Project Type
                      </label>
                      <select
                        id="contact-service"
                        value={form.service}
                        onChange={handleField("service")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option>WordPress &amp; Elementor Build</option>
                        <option>Beaver Builder Site</option>
                        <option>GoHighLevel Funnel</option>
                        <option>Square Online Store</option>
                        <option>Responsive Redesign</option>
                        <option>Figma to Code</option>
                        <option>Maintenance &amp; Fixes</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-budget"
                        className="block text-xs font-mono text-gray-300 mb-1.5"
                      >
                        Budget Range
                      </label>
                      <select
                        id="contact-budget"
                        value={form.budget}
                        onChange={handleField("budget")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] transition-colors"
                      >
                        <option value="">Select budget range</option>
                        <option>Under $300</option>
                        <option>$300 – $600</option>
                        <option>$600 – $1,500</option>
                        <option>$1,500+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono text-gray-300 mb-1.5"
                    >
                      Project Details &amp; Goals *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Tell me about your project, target audience, preferred timeline, and any reference sites..."
                      value={form.message}
                      onChange={handleField("message")}
                      className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/50 resize-none transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/45 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-500 font-mono text-center">
                    By sending, you agree to be contacted about your project. No spam, ever.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#c9a227]/20 border border-[#c9a227]/40 flex items-center justify-center text-[#f0d060]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-white mb-2">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
                    Thank you for reaching out. I've received your inquiry and
                    will review your project details and get back to you within
                    24 hours at{" "}
                    <span className="text-[#f0d060] font-mono">
                      {form.email}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        service: "",
                        budget: "",
                        message: "",
                        website: "",
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:border-[#c9a227]/40 text-xs font-mono transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
