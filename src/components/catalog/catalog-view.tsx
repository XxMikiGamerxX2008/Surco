"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Section } from "@/types/catalog";
import { AlbumCard } from "@/components/catalog/album-card";
import { cn } from "@/lib/utils";

interface CatalogViewProps {
  sections: Section[];
  genres: string[];
}

export function CatalogView({ sections, genres }: CatalogViewProps) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? sections.filter((s) => s.genres.includes(active)) : sections),
    [sections, active],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-2.5">
        <FilterChip active={active === null} onClick={() => setActive(null)}>
          Todo
        </FilterChip>
        {genres.map((g) => (
          <FilterChip key={g} active={active === g} onClick={() => setActive(g)}>
            {g}
          </FilterChip>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((section, i) => (
          <motion.div
            key={section.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <AlbumCard section={section} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-fg-muted">
          No hay discos de ese género todavía.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 font-display text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer",
        active
          ? "border-accent bg-accent text-brand-ink"
          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
