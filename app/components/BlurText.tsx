"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

type BlurTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  children?: React.ReactNode;
};

export default function BlurText({
  text,
  className = "",
  as: Tag = "p",
  animateBy = "words",
  direction = "top",
  delay = 100,
  stepDuration = 0.35,
  threshold = 0.2,
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView) setHasAnimated(true);
  }, [isInView]);

  const segments = useMemo(() => {
    if (animateBy === "letters") {
      return text.split("").map((ch) => (ch === " " ? "\u00A0" : ch));
    }
    return text.split(" ");
  }, [text, animateBy]);

  const yOffset = direction === "top" ? -20 : 20;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={`${className} flex flex-wrap`}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={`${segment}-${i}`}
          initial={{ opacity: 0, y: yOffset, filter: "blur(12px)" }}
          animate={
            hasAnimated
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: yOffset, filter: "blur(12px)" }
          }
          transition={{
            duration: stepDuration,
            delay: i * (delay / 1000),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
