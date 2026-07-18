"use client";

import { useMotionValue, useSpring, useTransform, MotionValue } from "motion/react";
import { useRef, useCallback } from "react";

const defaultConfig = { stiffness: 80, damping: 20 };

export function useParallaxMouse(
  springConfig: { stiffness?: number; damping?: number; mass?: number } = {}
) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const config = { ...defaultConfig, ...springConfig };
  const springX = useSpring(mouseX, config);
  const springY = useSpring(mouseY, config);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, []);

  return { ref, springX, springY, handleMouse };
}

export function useParallaxTransform(
  springX: MotionValue<number>,
  springY: MotionValue<number>,
  rangeX = 12,
  rangeY = 8
) {
  const x = useTransform(springX, [0, 1], [-rangeX, rangeX]);
  const y = useTransform(springY, [0, 1], [-rangeY, rangeY]);
  return { x, y };
}
