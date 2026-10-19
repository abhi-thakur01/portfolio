import { useEffect, useState } from "react";

export function PageLoader() {
  const [show, setShow] = useState(true);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setOut(true), 700);
    const t2 = window.setTimeout(() => setShow(false), 1100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0e1a] transition-opacity duration-400 ${
        out ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-sm font-medium text-gray-400 tracking-wide">
          Abhishek <span className="text-blue-400">Thakur</span>
        </p>
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-400 transition-[width] duration-150 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
