import { useEffect, useRef, useState, useCallback } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function reduced() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Word-by-word mask reveal — always falls back to visible */
export function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 50,
  mode = "words",
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

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      window.setTimeout(() => setReady(true), delay);
    };

    // Safety: always show after 1.2s even if observer fails
    const fallback = window.setTimeout(show, 1200 + delay);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.clearTimeout(fallback);
        show();
      },
      { threshold: 0.05, rootMargin: "0px 0px 10% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay]);

  const text = typeof children === "string" ? children : String(children ?? "");
  const parts = mode === "lines" ? text.split("\n") : text.split(/(\s+)/);

  return (
    <Tag ref={ref} className={className}>
      {parts.map((part, i) => {
        if (mode === "words" && /^\s+$/.test(part)) {
          return <span key={i}>{part}</span>;
        }
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ verticalAlign: "bottom" }}
          >
            <span
              className="inline-block will-change-transform"
              style={{
                transform: ready ? "translateY(0)" : "translateY(105%)",
                // Keep opacity 1 so text is never fully invisible if anim stalls
                opacity: 1,
                transition: `transform 0.8s ${EASE} ${ready ? i * stagger : 0}ms`,
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

/** Clip-path wipe — with forced visible fallback */
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
    el.style.opacity = "1";

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      window.setTimeout(() => {
        el.style.transition = `clip-path 1s ${EASE}`;
        el.style.clipPath = to;
      }, delay);
    };

    const fallback = window.setTimeout(reveal, 1400 + delay);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.clearTimeout(fallback);
        reveal();
      },
      { threshold: 0.05, rootMargin: "0px 0px 8% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** 3D perspective tilt on mouse move (desktop only feel) */
export function TiltCard({ children, className = "", max = 10, glare = true }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || reduced()) return;
      // Skip heavy tilt on coarse pointers (mobile)
      if (window.matchMedia("(pointer: coarse)").matches) return;
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

/** Magnetic pull — desktop only */
export function Magnetic({ children, className = "", strength = 0.35 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
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

/** Stagger children — with safety fallback */
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
      up: "translate3d(0, 28px, 0)",
      scale: "scale(0.92)",
      fade: "translate3d(0, 10px, 0)",
    };
    const start = map[from] || map.up;

    kids.forEach((k) => {
      k.style.opacity = "0";
      k.style.transform = start;
    });

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      kids.forEach((k, i) => {
        window.setTimeout(() => {
          k.style.transition = `opacity 0.7s ${EASE}, transform 0.8s ${EASE}`;
          k.style.opacity = "1";
          k.style.transform = "none";
        }, delay + i * step);
      });
    };

    const fallback = window.setTimeout(run, 1500 + delay);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.clearTimeout(fallback);
        run();
      },
      { threshold: 0.05, rootMargin: "0px 0px 5% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay, step, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Soft mouse glow — desktop only */
export function MouseGlow({ className = "", color = "59, 130, 246" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
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

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      window.setTimeout(() => {
        el.style.transition = `transform 1.4s ${EASE}, opacity 0.6s ease`;
        el.style.transform = vertical ? "scaleY(1)" : "scaleX(1)";
        el.style.opacity = "1";
      }, delay);
    };

    const fallback = window.setTimeout(run, 1600 + delay);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.clearTimeout(fallback);
        run();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [vertical, delay]);

  return <div ref={ref} className={className} aria-hidden />;
}

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
      { threshold: 0.2 }
    );
    io.observe(el);
    const t = window.setTimeout(() => setOn(true), 2000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
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
