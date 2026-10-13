"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="btn btn-primary btn-circle fixed bottom-6 right-6 z-40 shadow-lg"
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
