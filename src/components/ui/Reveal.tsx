"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { type HTMLAttributes, type RefObject } from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export function Reveal({ delay = 0, children, className = "", ...props }: RevealProps) {
  const { ref, isVisible } = useScrollReveal({ delay });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}