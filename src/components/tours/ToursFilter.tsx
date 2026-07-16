"use client";

import { motion } from "motion/react";

interface ToursFilterProps {
  categories: { key: string; label: string }[];
  active: string | null;
  onSelect: (key: string | null) => void;
}

export function ToursFilter({ categories, active, onSelect }: ToursFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        onClick={() => onSelect(null)}
        className={`relative px-4 py-2 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
          active === null
            ? "bg-emerald text-bg"
            : "bg-surface text-text-secondary border border-border hover:border-emerald/30 hover:text-text"
        }`}
        whileTap={{ scale: 0.97 }}
      >
        {active === null && (
          <motion.span
            layoutId="filter-bg"
            className="absolute inset-0 rounded-full bg-emerald"
            aria-hidden="true"
          />
        )}
        <span className="relative z-[1]">
          {active === null ? "Todos" : "Todos"}
        </span>
      </motion.button>

      {categories.map((cat) => (
        <motion.button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`relative px-4 py-2 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
            active === cat.key
              ? "bg-emerald text-bg"
              : "bg-surface text-text-secondary border border-border hover:border-emerald/30 hover:text-text"
          }`}
          whileTap={{ scale: 0.97 }}
        >
          {active === cat.key && (
            <motion.span
              layoutId="filter-bg"
              className="absolute inset-0 rounded-full bg-emerald"
              aria-hidden="true"
            />
          )}
          <span className="relative z-[1]">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
