import { MapPin, Mail, Clock, CheckCircle2 } from "lucide-react";
import { about, personal } from "../data/content";

export function About() {
  return (
    <section id="about" className="py-20 bg-[#0d1220]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left content */}
          <div className="lg:col-span-3">
            <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase mb-2">
              About Me
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {about.heading}
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed mb-8">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm text-gray-200">{personal.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <a href={`mailto:${personal.email}`} className="text-sm text-gray-200 hover:text-blue-400">
                    {personal.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Working Hours</div>
                  <div className="text-sm text-gray-200">{personal.workingHours}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Availability</div>
                  <div className="text-sm text-gray-200">{personal.availability}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/8">
              <h3 className="text-sm font-semibold text-white mb-4">What I Do</h3>
              <ul className="space-y-2.5">
                {about.whatIDo.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-white/8">
              <h3 className="text-sm font-semibold text-white mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
