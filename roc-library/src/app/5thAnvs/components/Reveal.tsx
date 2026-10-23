"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Slides its content up and fades it in the first time it scrolls into view. */
export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  /** seconds to wait, to stagger a row of them */
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
