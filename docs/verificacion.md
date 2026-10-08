# Cómo correr y verificar

## Comandos

| Comando | Qué hace | Cuándo |
|---------|----------|--------|
| `npm run dev` | Dev server en `http://localhost:3000/` | Riesgo de puerto ocupado: producir FS de OneDrive puede estar en uso |
| `npm run build` | Build de producción | Antes de cada commit |
| `npm run start` | Sirve el build en `http://localhost:3001/` | Verificar build real |
| `npm run lint` | ESLint | Antes de cada commit |

### Notas de entorno (Windows + OneDrive)

- Usar `npm.cmd` / `npx.cmd` si el shell no resuelve el binario.
- El repo vive en OneDrive (`C:\Users\PC\OneDrive\Documentos\Proyecto predeterminado`).
  **Descargar binarios a `C:\Users\PC\AppData\Local\Temp\opencode` primero** y
  copiarlos a destino: OneDrive borra descargas directas a `public/`.
- `$env:Path = [Machine] + ";" + [User]` si un comando no aparece (tools del
  sistema, `git.exe`, `code`).

## Hosts útiles

| URL | Contenido |
|-----|-----------|
| `http://localhost:3000/` | Home: gate → B&N → morph HMHAS → álbumes al scrollear |
| `http://localhost:3000/album/chihiro` | Ficha CHIHIRO con vinilo 3D |
| `http://localhost:3000/catalogo` | Grilla del catálogo |
| `http://localhost:3000/carrito` | Carrito guest |

## Checklist de la home (gate + morph)

Estrategia: con el harness no hay rAF ni scroll real; verificar por **estado
final / timers**, no por rampa visual.

1. **Tab fresco, localStorage limpio** (`surco-audio-v1` borrado):
   - `accent` = gris (#e4e6ea / rgb(228,230,234)), `primary` = #26282c → home B&N.
   - `data-section` en `<html>` = `null` (SSR inline = `startPalette`).
   - Gate visible ("Entrá al surco").
2. Pasar el gate ("Entrar en silencio"):
   - `enabled=true` → `accent` #22d3ee, `primary` #0b1e3a, `data-section=hit-me-hard-and-soft`.
3. Scroll sintético hacia abajo:
   - `window.scrollTo(0, y)` luego `dispatchEvent(new Event('scroll'))`.
   - Debe morphear a `merveilles` (#e8c97a/#7a1220) y luego `crystal-castles-iii`
     (#ffffff/#0a0a0a).
   - **Trampa del harness**: `scrollTo` programático NO emite `scroll` por sí
     solo; hay que despachar el evento manualmente. `scrollIntoView` con
     `behavior:'instant'` tampoco sirve.

## Checklist de la ficha (vinilo 3D al lado)

1. `http://localhost:3000/album/chihiro` con localStorage limpio → 0 errores de
   consola (el hydration mismatch reportado antes era artefacto de test con
   estado persistido, no del código).
2. `canvas` presente con caption "Portada + vinilo 3D · mové el cursor para
   inclinar", sin "asset pendiente".
3. Si `prefers-reduced-motion: true`, no gira (por diseño).
4. Fallback CSS: `VinylPreview` replica el mismo contrato si no hay WebGL.

## Trampas del harness de testing

| Trampa | Consecuencia | Solución |
|--------|--------------|----------|
| rAF nunca dispara | El morph por rampa no avanza | Verificar estado final (timer de safety 350ms/`duration+240`) |
| `prefers-reduced-motion: true` en harness | Morph corto, sin rampa | No testear la curva, testear el destino |
| Scroll programático sin evento | `SectionObserver` no reacciona | `window.scrollTo` + `dispatchEvent(new Event('scroll'))` |
| WebGL existe | — | Probe vía `queueMicrotask` |
| Screenshots no disponibles | No hay verificación visual del modelo | Pedir screenshot al usuario |
| Tab recargado con estado persistido | Muestra HMHAS con gate (artefacto) | Usar siempre tab fresco + localStorage limpio |

## Lo verificado (2026-10-07)

- Lint + `next build` sin errores antes de los últimos commits.
- Home: B&N → HMHAS → morph por scroll encadenado OK (estado final).
- Ficha: escena compuesta portada + vinilo girando en canvas, 0 errores de
  consola con estado limpio.