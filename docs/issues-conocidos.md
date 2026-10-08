# Items abiertos y pendientes

> Importante: esto NO es una lista de bugs conocidos del código. Son
> **pendientes del entorno y del flujo de trabajo** detectados durante la
> sesión. Si encontrás un error concreto en una funcionalidad, describí el
> paso a paso y lo reproducimos contra estos checklists.

| Item | Estado | Impacto | Resolución |
|------|--------|---------|------------|
| Engram MCP no expuesto en la sesión | Abierto | La memoria persistente no se guardó durante esta sesión | Reiniciar OpenCode para activar el plugin + MCP; luego `mem_search`/`mem_save` vuelven a funcionar |
| Warning de dev en `/album/[slug]` (`params`/`searchParams` fuera de `<Suspense>` con PPR) | Abierto (pre-existente, no rompe) | Ruido en consola de dev | Envolver en `<Suspense>` si se quiere silenciar; opcional |
| Screenshots del harness fallan | Abierto (limita al modelo) | No hay verificación visual automática | Pedir screenshot al usuario en un tab visible |
| `scrollTo` programático no emite scroll | Workaround documentado | Limita testing de morph por scroll | Despachar `dispatchEvent(new Event('scroll'))` manualmente |
| Descargas binarias directas a `public/` | Workaround documentado | OneDrive borra el archivo | Descargar a temp primero y copiar |
| Built de producción en puerto 3001 | Rutina | — | Verificar con `npm run build` + `npm run start` |

## Cómo dejar la experiencia de primera visita intacta

La home arranca B&N + gate cuando `localStorage['surco-audio-v1']` no existe.
Al final de cualquier prueba, borrar la key para que el próximo tab fresco
arranque como visita nueva.

## Qué NO confundir con bugs

- **Hydration mismatch en la ficha**: era artefacto de test (estado persistido
  `enabled:true` entre SSR y cliente); con localStorage limpio no aparece.
- **Morph por rampa vs estado final**: el harness no corre rAF; verificar por
  destino (timer de safety), no por la curva.