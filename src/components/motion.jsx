import { useEffect, useRef, useState, useCallback } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Word-by-word / line mask reveal — premium heading animation */
export function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 55,
  mode = "words", // words | lines
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setReady(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => setReady(true), delay);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const text = typeof children === "string" ? children : String(children ?? "");
  const parts = mode === "lines" ? text.split("\n") : text.split(/(\s+)/);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {parts.map((part, i) => {
        if (part.trim() === "" && mode === "words") {
          return <span key={i}>{part}</span>;
        }
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ marginRight: mode === "words" && part.endsWith(" ") ? undefined : undefined }}
          >
            <span
              className="inline-block"
              style={{
                transform: ready ? "translateY(0%)" : "translateY(110%)",
                opacity: ready ? 1 : 0,
                transition: `transform 0.85s ${EASE} ${i * stagger}ms, opacity 0.5s ${EASE} ${i * stagger}ms`,
              }}
            >
              {part}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Clip-path wipe reveal for blocks */
export function ClipReveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.clipPath = "none";
      el.style.opacity = "1";
      return;
    }

    const clips = {
      up: ["inset(100% 0 0 0)", "inset(0 0 0 0)"],
      down: ["inset(0 0 100% 0)", "inset(0 0 0 0)"],
      left: ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
      right: ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
    };
    const [from, to] = clips[direction] || clips.up;

    el.style.clipPath = from;
    el.style.opacity = "0.4";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => {
          el.style.transition = `clip-path 1.1s ${EASE}, opacity 0.7s ${EASE}`;
          el.style.clipPath = to;
          el.style.opacity = "1";
        }, delay);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  );
}

/** 3D perspective tilt on mouse move */
export function TiltCard({ children, className = "", max = 10, glare = true }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || reduced()) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * max;
        const ry = (x - 0.5) * max;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        if (glare) {
          el.style.setProperty("--gx", `${x * 100}%`);
          el.style.setProperty("--gy", `${y * 100}%`);
        }
      });
    },
    [max, glare]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", transition: `transform 0.35s ${EASE}` }}
    >
      {children}
      {glare && <div className="tilt-glare" aria-hidden />}
    </div>
  );
}

/** Magnetic pull on hover for buttons/icons */
export function Magnetic({ children, className = "", strength = 0.35 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: `transform 0.25s ${SPRING}`, display: "inline-flex" }}
    >
      {children}
    </div>
  );
}

/** Stagger children when section enters viewport */
export function Stagger({
  children,
  className = "",
  delay = 0,
  step = 70,
  from = "up",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children);
    if (reduced()) {
      kids.forEach((k) => {
        k.style.opacity = "1";
        k.style.transform = "none";
      });
      return;
    }

    const map = {
      up: "translate3d(0, 40px, 0)",
      scale: "scale(0.85)",
      fade: "translate3d(0, 12px, 0)",
    };
    const start = map[from] || map.up;

    kids.forEach((k) => {
      k.style.opacity = "0";
      k.style.transform = start;
      k.style.willChange = "opacity, transform";
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        kids.forEach((k, i) => {
          window.setTimeout(() => {
            k.style.transition = `opacity 0.75s ${EASE}, transform 0.85s ${EASE}`;
            k.style.opacity = "1";
            k.style.transform = "none";
          }, delay + i * step);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, step, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Soft mouse-following glow inside a section */
export function MouseGlow({ className = "", color = "59, 130, 246" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const parent = el.parentElement;
    if (!parent) return;

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      el.style.left = `${e.clientX - r.left}px`;
      el.style.top = `${e.clientY - r.top}px`;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-0 transition-opacity duration-500 ${className}`}
      style={{
        background: `radial-gradient(circle, rgba(${color},0.12) 0%, transparent 70%)`,
        zIndex: 0,
      }}
      aria-hidden
    />
  );
}

/** Draw-in vertical/horizontal line for timelines */
export function DrawLine({ className = "", vertical = true, delay = 200 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.transform = "scale(1)";
      el.style.opacity = "1";
      return;
    }
    el.style.transform = vertical ? "scaleY(0)" : "scaleX(0)";
    el.style.transformOrigin = vertical ? "top center" : "left center";
    el.style.opacity = "0.3";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => {
          el.style.transition = `transform 1.4s ${EASE}, opacity 0.6s ease`;
          el.style.transform = vertical ? "scaleY(1)" : "scaleX(1)";
          el.style.opacity = "1";
        }, delay);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [vertical, delay]);

  return <div ref={ref} className={className} aria-hidden />;
}

/** Counter with spring-ish ease (reuse-friendly) */
export function CountUp({ value, className = "", duration = 1600 }) {
  const str = String(value ?? "");
  const num = parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  const suffix = str.replace(/[0-9.]/g, "");
  const decimals = str.includes(".") ? (str.split(".")[1].match(/\d/) || []).length : 0;
  const [display, setDisplay] = useState(0);
  const [on, setOn] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(num * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(num);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, num, duration]);

  const text =
    decimals > 0 ? display.toFixed(Math.min(decimals, 1)) + suffix : Math.round(display) + suffix;

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}
