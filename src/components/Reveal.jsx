import { useEffect, useRef } from "react";

const FROM = {
  up: "translate3d(0, 72px, 0)",
  down: "translate3d(0, -48px, 0)",
  left: "translate3d(-80px, 0, 0)",
  right: "translate3d(80px, 0, 0)",
};

export function Reveal({ children, from = "up", delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = FROM[from] || FROM.up;
    el.style.willChange = "opacity, transform";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        window.setTimeout(() => {
          el.style.transition = [
            `opacity 1.15s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            `transform 1.15s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          ].join(", ");
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0)";
        }, 60);
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [from, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transform: FROM[from] || FROM.up }}
    >
      {children}
    </div>
  );
}
