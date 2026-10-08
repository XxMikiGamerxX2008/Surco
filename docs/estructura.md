# Estructura del proyecto

Mapa de archivos con la responsabilidad de cada uno. Ordenado por capa.

## Catálogo / datos

| Archivo | Rol |
|---------|-----|
| `content/sections.json` | Fuente de verdad del catálogo: 4 secciones (álbum, artista, paleta, arte, audio, géneros). |
| `src/lib/catalog.ts` | Tipado + helpers (`sections`, `getSectionBySlug`, `getAllGenres`, `formatPrice`) y `startPalette` (paleta B&N inicial). |
| `src/types/catalog.ts` | Tipos `Section`, `Palette`, `Album`, `AudioInfo`, `CatalogContent`. |

## App Router

| Archivo | Rol |
|---------|-----|
| `src/app/layout.tsx` | Root layout: paleta inicial (B&N), fonts, `Navbar`, `Footer`, `CartDrawer`, `AccessGate`, `SectionObserver`. |
| `src/app/page.tsx` | Home: hero (gradientes con `--album-*` + `.disco`) + secciones inmersivas + colección. |
| `src/app/album/[slug]/page.tsx` | Ficha de álbum: `Vinyl3D` en `ViewTransition`, info, `PlayPreviewButton`, `AddToCartButton`. |
| `src/app/catalogo/page.tsx` | Grilla del catálogo (`CatalogView`). |
| `src/app/carrito/page.tsx` | Carrito (página). |
| `src/app/globals.css` | Design system: `@property --album-*` (con `initial-value` gris), keyframes (`disco-rotate`, `eq`, `grain`), bloque `prefers-reduced-motion`. |
| `src/app/sitemap.ts`, `robots.ts`, `not-found.tsx` | SEO y 404. |

## Efectos / paleta

| Archivo | Rol |
|---------|-----|
| `src/lib/color.ts` | OKLab: `cssColorToOkLab`, `lerpOkLab`, `okLabToHex`, eases. |
| `src/lib/palette-morph.ts` | `morphPalette(target, meta?)` (lerp OKLab por rAF + safety timeout) y `setPaletteInstantly`. |
| `src/components/effects/section-observer.tsx` | Decide sección activa (home), morphea paleta y dispara crossfade de audio. Gateado por `enabled`. |
| `src/components/effects/palette-binder.tsx` | Aplica la paleta de un álbum con morph en páginas sin secciones (ficha). |

## Audio

| Archivo | Rol |
|---------|-----|
| `src/lib/audio/engine.ts` | `AmbientAudioEngine` singleton: crossfade A/B, mute global, autoplay gate, pausa en tab oculta. |
| `src/stores/audio.store.ts` | zustand persist: `enabled`, `muted`, `currentSectionId`, `currentTrack`, `transitioning` + setters. |
| `src/components/audio/access-gate.tsx` | Gate "Entrá al surco": `enterWithSound` / `enterSilent`. |
| `src/components/audio/audio-chip.tsx` | Control de estado de audio (navbar). |

## Producto (tienda)

| Archivo | Rol |
|---------|-----|
| `src/components/product/vinyl-3d.tsx` | Escena R3F: portada (funda) + vinilo girando al lado. Parallax, reduced-motion, fallback a `VinylPreview`. |
| `src/components/product/vinyl-preview.tsx` | Fallback CSS del mismo contrato (portada + vinilo rotando). |
| `src/components/product/play-preview-button.tsx` | Preview breve de la pista (loop). |
| `src/components/product/add-to-cart-button.tsx` | Agrega al carrito guest. |

## Catálogo UI

| Archivo | Rol |
|---------|-----|
| `src/components/catalog/immersive-section.tsx` | Sección full-screen: portada full-bleed, velo de paleta, datos locales `--album-*` + `data-section-id`/`data-mood`. |
| `src/components/catalog/catalog-view.tsx` | Grilla del catálogo. |
| `src/components/catalog/album-card.tsx` | Card de álbum (portada + ViewTransition). |

## Layout / UI / stores

| Archivo | Rol |
|---------|-----|
| `src/components/layout/navbar.tsx` | Navbar (con `audio-chip`, paleta raíz). |
| `src/components/layout/footer.tsx` | Footer. |
| `src/components/cart/cart-drawer.tsx`, `cart-view.tsx` | Drawer y vista del carrito. |
| `src/stores/cart.store.ts` | Carrito guest con persist. |
| `src/components/ui/*` | primitives: `button`, `badge`, `sheet`, `input`, `skeleton`. |
| `src/lib/utils.ts` | `cn()` (cva/clsx/tw-merge). |
| `src/lib/fonts.ts` | Fonts variables self-hosted (Unbounded display + Inter body). |

## Assets

| Ruta | Contenido |
|------|-----------|
| `public/covers/*.jpg` | Portadas de los 4 álbumes. |
| `public/audio/billie-eilish/chihiro.mp3` | Track ambiental completo HMHAS (5:03). |
| `public/audio/crystal-castles/`, `public/audio/malice-mizer/`, `public/audio/tyler/` | Otros tracks demo (según `sections.json`). |