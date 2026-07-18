"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { type HTMLAttributes, type RefObject } from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
}

export function Reveal({ delay = 0, children, className = "", blur = false, ...props }: RevealProps) {
  const { ref, isVisible } = useScrollReveal({ delay });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : `opacity-0 translate-y-6 ${blur ? "blur-[4px]" : ""}`
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}