"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VinylPreviewProps {
  coverPath: string;
  accent: string;
  primary: string;
  surface: string;
}

/**
 * Vinilo 3D con CSS transforms (Tier B del plan de calidad):
 *  - sin WebGL → corre a 60fps en gama media
 *  - click/hover extrae el disco de la funda; el disco rota en loop
 *  (El Tier A con Three.js entra en Fase D como reemplazo del mismo contrato.)
 */
export function VinylPreview({ coverPath, accent, primary, surface }: VinylPreviewProps) {
  const [extracted, setExtracted] = useState(false);

  return (
    <div className="relative w-full max-w-md select-none" style={{ perspective: "1400px" }}>
      <button
        type="button"
        onClick={() => setExtracted((v) => !v)}
        aria-label={extracted ? "Insertar vinilo en la funda" : "Extraer vinilo de la funda"}
        className="group relative block aspect-square w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* vinilo */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            extracted ? "translate-x-[38%]" : "translate-x-[-50%]",
          )}
          style={{
            background: `radial-gradient(circle at center,
              ${accent} 0 12%,
              #1a1a1a 12.5% 13.5%,
              #0c0c0c 14% 100%),
              repeating-radial-gradient(circle at center,
              rgba(255,255,255,0.055) 0 1px,
              transparent 1px 4px)`,
            boxShadow: "0 24px 60px -18px rgba(0,0,0,0.75)",
            animation: extracted ? "spin 3.6s linear infinite" : undefined,
          }}
        >
          {/* label central */}
          <div className="absolute inset-[32%] overflow-hidden rounded-full border border-black/30" style={{ background: primary }}>
            <Image src={coverPath} alt="" fill sizes="120px" className="object-cover" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505]" />
        </div>

        {/* funda */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-md shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: extracted ? "rotateY(-14deg) translateX(-6%)" : "rotateY(0deg)",
            transformOrigin: "left center",
            background: surface,
          }}
        >
          <Image
            src={coverPath}
            alt="Portada del álbum"
            fill
            sizes="(max-width: 768px) 90vw, 448px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
        </div>
      </button>

      <p className="mt-4 text-center font-display text-xs tracking-[0.18em] uppercase text-fg-muted">
        {extracted ? "Tocá para guardar" : "Tocá para extraer el vinilo"}
      </p>

      <style>{`@keyframes spin { from { rotate: 0deg } to { rotate: 360deg } }`}</style>
    </div>
  );
}
