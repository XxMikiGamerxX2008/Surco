# Surco

Demostración de página de venta de discos: un e-commerce inmersivo de vinilos
construido con Next.js 16, React 19 y Tailwind v4.

Cada sección inmersiva pinta la interfaz con la paleta del álbum activo
(la home arranca en blanco y negro y morphea al color de cada álbum), con audio
ambiental en crossfade y una ficha de producto con portada + vinilo 3D girando.

## Empezando

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |

## Documentación

- [`docs/`](./docs) — arquitectura, estructura de archivos, verificación y
  convenciones del proyecto.

## Stack

Next.js 16 (App Router + Turbopack) · React 19 · TypeScript · Tailwind v4 ·
Motion · three / React Three Fiber / drei · zustand · CVA.
