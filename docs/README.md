# SURCO — Contexto del proyecto

Todo lo que un subagente necesita para trabajar sobre esta base sin volver a
reconstruir la historia desde cero. Leé este índice primero.

**Stack**: Next.js 16.4 (App Router + Turbopack) · React 19.3 · TypeScript ·
Tailwind v4 · Motion 14 · three/R3F/drei · zustand (persist) · cva/clsx/tw-merge.

**Qué es**: tienda e-commerce inmersiva de vinilos. 4 secciones full-screen que
pintan la interfaz con la paleta del álbum activo; audio ambiental en crossfade;
carrito guest en localStorage (sin login); ficha con portada + vinilo 3D girando.

## Quick path

1. `npm run dev` → `http://localhost:3000/` (producción: `http://localhost:3001/`).
2. Primera visita: la home arranca en **blanco y negro**, el gate "Entrá al
   surco" bloquea; al pasar el gate, morph al color de HMHAS y luego a cada
   álbum al scrollear.
3. `npm run lint` + `npm run build` antes de commitear.
4. Commits: conventional en español, sin Co-Authored-By (ver `convenciones.md`).

## OpenCode en VS Code

- Extensión oficial V2 instalada: **`sst-dev.opencode-v2`** (Beta). Recomendada
  también en `.vscode/extensions.json` del repo.
- Abrí la carpeta del repo en VS Code y usá la paleta de la extensión (panel de
  OpenCode) o el terminal integrado con `opencode` (ya está en PATH:
  `C:\Users\PC\bin\opencode.cmd`).
- El CLI local es OpenCode **v2.0.24**.

## Documentos

| Documento | Contenido |
|-----------|-----------|
| [arquitectura.md](arquitectura.md) | Decisiones clave y flujos: morph de paleta, audio, gate, vinilo 3D |
| [estructura.md](estructura.md) | Mapa de archivos con responsabilidad de cada uno |
| [verificacion.md](verificacion.md) | Cómo correr y verificar: comandos, hosts, checks en browser, trampas del harness |
| [issues-conocidos.md](issues-conocidos.md) | Items abiertos y pendientes (no confundir con bugs cometidos) |
| [convenciones.md](convenciones.md) | Reglas de commits, estilo y skills del proyecto |

## Regla de oro para subagentes

- **No inventar firmas**: leer primero (`engine.ts`, `palette-morph.ts`,
  `audio.store.ts`) antes de tocar el motor de audio o el morph.
- **No romper el gate**: cualquier cambio en `access-gate.tsx` o
  `audio.store.ts` puede dejar la home sin B&N o el autoplay roto.
- **Subir archivos a temp primero** si son descargas binarias (OneDrive borra
  descargas directas a `public/`). Detalle en `verificacion.md`.