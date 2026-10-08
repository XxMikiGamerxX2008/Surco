"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { VinylPreview } from "@/components/product/vinyl-preview";

/**
 * Portada + vinilo 3D girando (React Three Fiber + drei) para la ficha.
 *
 * - la funda (portada real del álbum) se apoya a la izquierda;
 * - un vinilo negro con surcos gira AL LADO de la portada, como en un local;
 * - la etiqueta es un círculo de acento con agujero (el arte va en la funda);
 * - inclinación con parallax del puntero (arrastrar para mirar alrededor);
 * - respeta prefers-reduced-motion: sin giro ni parallax;
 * - DPR limitado a [1,2] y un solo Canvas: barato para gama media.
 * - Sin WebGL (o durante el probe) cae al VinylPreview CSS del mismo contrato.
 */

interface Vinyl3DProps {
  coverPath: string;
  accent: string;
  primary: string;
  surface: string;
}

type Tilt = { x: number; y: number };
type TiltRef = { current: Tilt };

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (gl) {
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    }
    return !!gl;
  } catch {
    return false;
  }
}

/** Textura procedural de surcos del vinilo (anillos concéntricos + brillo). */
function makeGroovesTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#16161a";
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let r = 36; r <= size / 2; r += 2.5) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const gloss = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gloss.addColorStop(0, "rgba(150,150,165,0.14)");
  gloss.addColorStop(0.6, "rgba(20,20,26,0)");
  gloss.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = gloss;
  ctx.fillRect(0, 0, size, size);

  // arcos asimétricos: al girar el disco, algo se mueve en la superficie
  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.32, Math.PI * 0.2, Math.PI * 0.95);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.55, Math.PI * 1.1, Math.PI * 1.8);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function VinylScene({
  coverPath,
  accent,
  tiltRef,
}: {
  coverPath: string;
  accent: string;
  tiltRef: TiltRef;
}) {
  const cover = useTexture(coverPath, (texture) => {
    // onLoad corre dentro del hook: aquí sí está permitido ajustar la textura
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  const grooves = useMemo(() => makeGroovesTexture(), []);
  const stage = useRef<THREE.Group>(null);
  const record = useRef<THREE.Group>(null);
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((_, delta) => {
    const rec = record.current;
    if (rec && !reduceMotion) {
      // 1 rev ≈ 5.7s — el vinilo gira sobre su propio eje
      rec.rotation.z += delta * 1.1;
    }
    const st = stage.current;
    if (st && !reduceMotion) {
      const k = Math.min(1, delta * 6);
      st.rotation.x += (tiltRef.current.x - st.rotation.x) * k;
      st.rotation.y += (tiltRef.current.y - st.rotation.y) * k;
    }
  });

  return (
    <group ref={stage}>
      {/* PORTADA (funda) — apoyada a la izquierda */}
      <group position={[-1.55, 0.45, 0]} rotation={[0.05, 0.28, -0.02]}>
        {/* canto oscuro */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[2.14, 2.14]} />
          <meshStandardMaterial color="#050507" roughness={0.9} />
        </mesh>
        {/* arte */}
        <mesh>
          <planeGeometry args={[2.0, 2.0]} />
          <meshStandardMaterial map={cover} roughness={0.85} />
        </mesh>
      </group>

      {/* VINILO girando al lado */}
      <group position={[1.5, 0.5, 0]} rotation={[-0.35, 0.06, 0.04]}>
        <group ref={record}>
          {/* canto del disco */}
          <mesh>
            <cylinderGeometry args={[1.05, 1.05, 0.06, 96, 1, true]} />
            <meshStandardMaterial color="#0d0d11" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* cara con surcos */}
          <mesh position={[0, 0, 0.005]}>
            <circleGeometry args={[1.05, 96]} />
            <meshStandardMaterial map={grooves} roughness={0.58} metalness={0.28} />
          </mesh>
          {/* etiqueta de acento */}
          <mesh position={[0, 0, 0.012]}>
            <circleGeometry args={[0.3, 48]} />
            <meshStandardMaterial color={accent} roughness={0.45} metalness={0.25} />
          </mesh>
          {/* anillo del agujero */}
          <mesh position={[0, 0, 0.016]}>
            <ringGeometry args={[0.07, 0.12, 32]} />
            <meshStandardMaterial color="#111114" />
          </mesh>
          {/* agujero central */}
          <mesh position={[0, 0, 0.018]}>
            <circleGeometry args={[0.07, 24]} />
            <meshStandardMaterial color="#050507" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function Vinyl3D({ coverPath, accent, primary, surface }: Vinyl3DProps) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const tiltRef = useRef<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    // probe diferido: el primer render del cliente debe coincidir con el SSR
    // (fallback CSS), así que no sondeamos sincrónicamente dentro del effect.
    // queueMicrotask y no rAF: rAF se throttlea y puede no dispararse en tabs en
    // segundo plano, dejando el fallback CSS para siempre.
    queueMicrotask(() => setWebgl(probeWebGL()));
  }, []);

  if (webgl !== true) {
    // sin WebGL (o primer render SSR/client): fallback CSS del mismo contrato
    return (
      <VinylPreview
        coverPath={coverPath}
        accent={accent}
        primary={primary}
        surface={surface}
      />
    );
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.x = ny * 0.22; // pitch
    tiltRef.current.y = nx * 0.34; // yaw
  };
  const handlePointerLeave = () => {
    tiltRef.current.x = 0;
    tiltRef.current.y = 0;
  };

  return (
    <div
      className="relative w-full select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="relative aspect-[4/3] w-full touch-none">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 8.6], fov: 34 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 6]} intensity={1.7} />
          <directionalLight position={[-5, 3, -3]} color={accent} intensity={1.1} />
          <Suspense fallback={null}>
            <VinylScene coverPath={coverPath} accent={accent} tiltRef={tiltRef} />
          </Suspense>
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.5}
            scale={13}
            blur={2.6}
            far={3.4}
            color="#000000"
          />
        </Canvas>
      </div>
      <p className="pointer-events-none mt-4 text-center font-display text-xs tracking-[0.18em] uppercase text-fg-muted">
        Portada + vinilo 3D · mové el cursor para inclinar
      </p>
    </div>
  );
}