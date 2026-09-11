import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { personal } from "../data/content";

export function Contact() {
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
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 10) {
      setError("Please fill all fields (message min 10 characters).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Email me directly.");
    } finally {
      setLoading(false);
    }
  };

  const phoneHref = personal.phone ? `tel:${String(personal.phone).replace(/\s/g, "")}` : "#";

  return (
    <section id="contact" className="py-14 sm:py-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              Contact
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Let's Connect</h2>
            <p className="text-gray-400 text-sm sm:text-[15px] mb-6 sm:mb-8 leading-relaxed">
              Feel free to reach out if you have a project in mind or just want to say hello!
            </p>

            <div className="space-y-4">
              <a href={`mailto:${personal.email}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 break-all">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                {personal.email}
              </a>
              {personal.phone && (
                <a href={phoneHref} className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400">
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
            <div className="p-5 sm:p-8 rounded-2xl bg-[#111827] border border-white/8">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message sent!</h3>
                  <p className="text-gray-400 text-sm mb-6">I'll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="text-sm text-blue-400 hover:text-blue-300">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                  <div className="hidden" aria-hidden="true">
                    <input name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={onChange}
                      placeholder="Your message..."
                      className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
