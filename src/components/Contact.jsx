import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { personal, sections } from "../data/content";
import { TextReveal, ClipReveal, TiltCard, Magnetic, MouseGlow } from "./motion";

export function Contact() {
  const meta = sections?.contact || {};
  const submitting = useRef(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2 || name.length > 100 || /[\r\n\u0000]/.test(name)) {
      setError("Name must be between 2 and 100 characters.");
      return;
    }
    if (email.length > 254 || !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
      setError("Valid email is required.");
      return;
    }
    if (message.length < 10 || message.length > 5000) {
      setError("Message must be between 10 and 5,000 characters.");
      return;
    }

    submitting.current = true;
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message, website: form.website }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success !== true) {
        throw new Error(
          (typeof data?.error === "string" && data.error) ||
            (res.status === 429 ? "Too many messages. Please try again later." : "Could not send your message. Please try again.")
        );
      }

      setSent(true);
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setError(
        err.name === "AbortError"
          ? "The request timed out. Please try again or email me directly."
          : err.message || `Could not send. Email me at ${personal.email}`
      );
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      setLoading(false);
    }
  };

  const phoneHref = personal.phone ? `tel:${String(personal.phone).replace(/\s/g, "")}` : "#";

  return (
    <section id="contact" className="py-14 sm:py-20 relative overflow-hidden section-ambient">
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />
      <MouseGlow color="59, 130, 246" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">{meta.label || "Contact"}</p>
            <TextReveal as="h2" className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4" stagger={50}>
              {meta.heading || "Let's Connect"}{" "}
              {meta.headingHighlight && <span className="text-blue-400">{meta.headingHighlight}</span>}
            </TextReveal>
            <ClipReveal delay={100}>
              <p className="text-gray-400 text-sm sm:text-[15px] mb-6 sm:mb-8 leading-relaxed">
                {meta.description || "Open to full-time roles. Hiring managers and recruiters can reach me here."}
              </p>
            </ClipReveal>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">{meta.sidebarTitle || "Get In Touch"}</h3>
              {meta.availabilityText && <p className="text-sm text-gray-400 leading-relaxed">{meta.availabilityText}</p>}
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 break-all transition-all duration-300 hover:translate-x-1.5"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                {personal.email}
              </a>
              {personal.phone && (
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1.5"
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  {personal.phone}
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                {personal.location}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TiltCard max={5}>
              <div className="card-premium p-5 sm:p-8 rounded-2xl bg-[#111827] border border-white/8">
                {sent ? (
                  <div className="text-center py-10" role="status" aria-live="polite">
                    <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse-glow" />
                    <h3 className="text-xl font-semibold text-white mb-2">{meta.successTitle || "Message sent!"}</h3>
                    <p className="text-gray-400 text-sm mb-6">{meta.successMessage || "I'll get back to you soon."}</p>
                    <button onClick={() => setSent(false)} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4" noValidate aria-busy={loading} aria-describedby={error ? "contact-error" : undefined}>
                    <div className="hidden" aria-hidden="true">
                      <input name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" />
                    </div>
                    <div>
                      <label htmlFor="contact-name" className="block text-xs text-gray-400 mb-1.5">
                        Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        minLength={2}
                        maxLength={100}
                        value={form.name}
                        onChange={onChange}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs text-gray-400 mb-1.5">
                        Email <span className="text-blue-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={form.email}
                        onChange={onChange}
                        placeholder="Work email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-xs text-gray-400 mb-1.5">
                        Message <span className="text-gray-600">(10+ characters)</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        minLength={10}
                        maxLength={5000}
                        value={form.message}
                        onChange={onChange}
                        placeholder="Role, company, or a short note"
                        className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300 resize-none"
                      />
                    </div>
                    {error && <p id="contact-error" role="alert" className="text-xs text-red-400">{error}</p>}
                    <Magnetic strength={0.15} className="w-full">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-shine w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> {meta.submitLabel || "Send Message"}
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </form>
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
