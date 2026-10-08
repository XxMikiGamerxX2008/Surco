# Arquitectura — decisiones y flujos

## Principio rector

La plataforma es "vinilos que pintan la interfaz": **cada sección inmersiva
lleva la paleta del álbum** y el documento raíz la morphea en vivo. El color no
es decoración: es el sistema de estado visual del sitio.

## Decisiones clave

| Tema | Decisión |
|------|----------|
| Paleta dinámica | 6 variables `--album-*` declaradas con `@property` en `globals.css` (alias `--surface`, `--fg`, `--accent`, etc. en `:root`). El morph las escribe en el `<html>` via JS. |
| Morph sin snaps | Lerp frame a frame en **OKLab cartesiano** (`src/lib/color.ts`) escribiendo variables en cada rAF (`palette-morph.ts`). Bajo `prefers-reduced-motion` usa fade corto de 350ms en vez de snap. |
| Inicio B&N (2026-10-07) | La paleta **inicial** es escala de grises (`startPalette` en `catalog.ts`, valores grises también en los `initial-value` de `@property`). El `SectionObserver` NO morphea hasta que el usuario pasa el gate (`enabled === true` en el store de audio); al entrar, morphea a la sección visible (HMHAS) y sigue a cada álbum scrolleando. |
| Audio ambiental | Un solo `AmbientAudioEngine` singleton (`src/lib/audio/engine.ts`): dos `<audio>` A/B + `GainNode` para crossfade sin cortes (fade 750ms). Respeta autoplay: `enable()` solo desde un gesto (el gate). Mute global vía `GainNode` (no la propiedad `volume`). Pausa con fade al ocultar pestaña. |
| Gate de acceso | `AccessGate` bloquea la home hasta "Entrar con sonido" / "Entrar en silencio". El silencio setea `muted=true` + `enabled=true` (sigue siendo un gesto válido para desbloquear AudioContext). |
| Carrito | Guest cart sin login: zustand con `persist` en `localStorage` (`cart.store.ts`). Checkout mock en Fase 1. |
| Vinilo 3D | `Vinyl3D` (R3F/drei): composición local de discos — **portada (funda) a la izquierda + vinilo negro con surcos girando al lado**. Parallax con el puntero; respeta `prefers-reduced-motion` (sin giro ni parallax). DPR [1,2]. Fallback CSS `VinylPreview` del mismo contrato si no hay WebGL. |
| View Transitions | `ViewTransition` de React con `share="morph"` `default="none"` en la ficha (name `album-cover-<slug>`) para morfear la portada desde las cards. En home el grid usa `AlbumCard` por separado. |

## Flujo del morph (SectionObserver)

1. `layout.tsx` monta `SectionObserver` (está en TODAS las páginas; en las fichas
   no hay `[data-section-id]` → no hace nada allí).
2. En home, observa `[data-section-id]` y calcula la activa por centro más
   cercano al centro del viewport.
3. Si `enabled === false` (gate sin pasar) **no morphea** — la home queda B&N.
4. Al pasar el gate, el store dispara `measure()` una vez → morph a la sección
   visible (HMHAS al tope).
5. En scroll, morphea a la sección activa y pide al motor de audio el crossfade
   a la pista de esa sección (`ambientAudio.setTrack`).

## Flujo del audio

- `enable()` (gesto del gate): crea `AudioContext`, 2 elementos A/B con sus
  gains conectados, `setEnabled(true)`.
- `setTrack(src, gainDb, meta)`: crossfade del elemento activo al otro;
  idempotente si la misma pista ya suena; `src === null` apaga con fade.
- `setMuted`: mute global sin destruir estado.
- Secciones sin `audio.src` registran `setActive(null, null)` (sin sonido).

## Volumen y licencias

- Ganancia objetivo por sección en `content/sections.json` (`targetGainDb`,
  típicamente `-15` — rango recomendado del spec -14 a -16 dB).
- Todo el audio local lleva `license: "local-demo"` (demos de estudio, cradle
  de OneDrive: los tracks completos son assets de demo, sin derechos).
- CHIHIRO (HMHAS): `public/audio/billie-eilish/chihiro.mp3` (5:03), track real
  descargado del upload oficial de YouTube, convertido a mp3 VBR q4.