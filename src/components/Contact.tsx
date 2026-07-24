import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Copy
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
  onNotify
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: initialService || "",
    budget: initialSpec?.budgetEst || "",
    message: initialSpec
      ? `Hi Abhishek, I'd like to build a ${initialSpec.pages}-page website on ${initialSpec.platform}. Estimated budget: ${initialSpec.budgetEst}.`
      : "",
  });

  const [sent, setSent] = useState(false);

  const handleField = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (onNotify) {
      onNotify(`Copied ${type === "email" ? "Email" : "Phone"} to clipboard!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#c9a227", "#f0d060", "#ffffff"],
      });
    } catch {
      // safe fallback
    }

    if (onNotify) {
      onNotify("Thank you! Your message has been received.");
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#090912]">
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
            Have a project in mind, need a WordPress/CMS redesign, or want to discuss a remote role? I typically reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-display font-bold text-2xl text-white">
              Get In Touch Direct
            </h3>

            {/* Email Row */}
            <div className="p-4 rounded-xl bg-[#121222] border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-400">Primary Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.primaryEmail}`}
                    className="text-white text-xs sm:text-sm font-mono hover:text-[#f0d060]"
                  >
                    {PERSONAL_INFO.primaryEmail}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(PERSONAL_INFO.primaryEmail, "email")}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-400 hover:text-[#f0d060] transition-colors"
                title="Copy Email"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Phone / WhatsApp Row */}
            <div className="p-4 rounded-xl bg-[#121222] border border-white/10 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#f0d060] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-gray-400">Phone / WhatsApp</div>
                  <a
                    href={`tel:${PERSONAL_INFO.phone}`}
                    className="text-white text-xs sm:text-sm font-mono hover:text-[#f0d060]"
                  >
                    {PERSONAL_INFO.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(PERSONAL_INFO.phone, "phone")}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 text-gray-400 hover:text-[#f0d060] transition-colors"
                title="Copy Phone"
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
                <div className="text-[11px] font-mono text-gray-400">Location</div>
                <div className="text-white text-xs sm:text-sm">
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            {/* Availability Box */}
            <div className="p-5 rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-start gap-3 text-xs text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f0d060] animate-pulse shrink-0 mt-1" />
              <div>
                <strong className="text-white">Currently accepting new projects:</strong> Web design, WordPress/Elementor builds, landing pages &amp; CMS redesigns.
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#121222] border border-[#c9a227]/35 p-6 sm:p-10 shadow-2xl shadow-black/80 corner-bracket always-active">
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleField("name")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={handleField("email")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1.5">
                        Project Type
                      </label>
                      <select
                        value={form.service}
                        onChange={handleField("service")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c9a227]"
                      >
                        <option value="">Select a service</option>
                        <option>WordPress &amp; Elementor Build</option>
                        <option>Beaver Builder Site</option>
                        <option>GoHighLevel Funnel</option>
                        <option>Square Online Store</option>
                        <option>Responsive Redesign</option>
                        <option>Figma to Code</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1.5">
                        Budget Range
                      </label>
                      <select
                        value={form.budget}
                        onChange={handleField("budget")}
                        className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c9a227]"
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
                    <label className="block text-xs font-mono text-gray-300 mb-1.5">
                      Project Details &amp; Goals
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell me about your project, target audience, preferred timeline..."
                      value={form.message}
                      onChange={handleField("message")}
                      className="w-full px-4 py-3 rounded-xl bg-[#18182d] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#c9a227] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#f0d060] text-[#08080f] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/25 hover:shadow-[#c9a227]/45 hover:-translate-y-0.5 transition-all"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
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
                    Thank you for reaching out. I'll review your project details and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white text-xs font-mono"
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
