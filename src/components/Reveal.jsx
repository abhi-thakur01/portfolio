import { useEffect, useRef } from "react";

const FROM = {
  up: { transform: "translate3d(0, 56px, 0) scale(0.96)", filter: "blur(8px)" },
  down: { transform: "translate3d(0, -40px, 0) scale(0.96)", filter: "blur(6px)" },
  left: { transform: "translate3d(-64px, 0, 0) scale(0.97)", filter: "blur(6px)" },
  right: { transform: "translate3d(64px, 0, 0) scale(0.97)", filter: "blur(6px)" },
  scale: { transform: "translate3d(0, 24px, 0) scale(0.88)", filter: "blur(10px)" },
  fade: { transform: "translate3d(0, 12px, 0) scale(1)", filter: "blur(4px)" },
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.9,
  className = "",
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      return;
    }

    const start = FROM[from] || FROM.up;
    el.style.opacity = "0";
    el.style.transform = start.transform;
    el.style.filter = start.filter;
    el.style.willChange = "opacity, transform, filter";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (once) io.disconnect();

        window.setTimeout(() => {
          el.style.transition = [
            `opacity ${duration}s ${EASE} ${delay}ms`,
            `transform ${duration}s ${EASE} ${delay}ms`,
            `filter ${duration * 0.85}s ${EASE} ${delay}ms`,
          ].join(", ");
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0) scale(1)";
          el.style.filter = "blur(0)";

          // cleanup will-change after animation
          window.setTimeout(() => {
            el.style.willChange = "auto";
          }, (duration * 1000) + delay + 100);
        }, 40);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [from, delay, duration, once]);

  const start = FROM[from] || FROM.up;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: start.transform,
        filter: start.filter,
      }}
    >
      {children}
    </div>
  );
}
