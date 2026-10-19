import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);

    let x = 0, y = 0, rx = 0, ry = 0;
    let raf;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const over = (e) => {
      const t = e.target;
      const clickable =
        t.closest("a, button, [role='button'], input, textarea, .cursor-grow");
      document.body.classList.toggle("cursor-hover", !!clickable);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(tick);
    document.body.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor", "cursor-hover");
    };
  }, []);

  if (!on) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
