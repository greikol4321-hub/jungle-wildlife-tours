"use client";

import { useEffect, useState } from "react";

const messages = [
  "Searching for Sloths...",
  "Exploring the Jungle...",
  "Spotting Wildlife...",
  "Preparing your adventure...",
  "Tracking Monkeys...",
  "Listening to the Canopy...",
];

export function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1200);

    const timeout = setTimeout(() => setHidden(true), 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (hidden && typeof document !== "undefined") return null;

  return (
    <div className={`loading-screen${hidden ? " hidden" : ""}`} aria-hidden={hidden}>
      <div className="flex items-center gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <span key={i} className="loading-dot" />
        ))}
      </div>

      <p className="font-heading text-lg md:text-xl font-medium text-text-secondary/70 tracking-wide animate-pulse">
        {messages[msgIndex]}
      </p>
    </div>
  );
}
