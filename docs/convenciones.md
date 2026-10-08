# Convenciones del proyecto

## Commits

- Conventional Commits. Tipos usados en la base (español, sin Co-Authored-By):
  `feat(product)`, `feat(palette)`, `feat(content)`, `feat(ui)`, `feat(fonts)`,
  `docs(...)`.
- Formato de alcance: `tipo(scope): resumen en español`.
- Un solo comportamiento por commit, tests/docs junto al código.
- JAMÁS agregar atribución de IA (`Co-Authored-By`).

## Estilo

- TypeScript estricto, componentes en `src/components/`, lógica en `src/lib/`,
  estado en `src/stores/`.
- `cn()` de `@/lib/utils` para clases condicionales.
- UI copy y comentarios en español (existente en la base); identificadores de
  código en inglés.
- Atributos `aria-*` y `prefers-reduced-motion` respetados en componentes
  visuales (accesibilidad de primera).

## Skills y reglas de agente (Agent Teams)

- El registro de skills vive en `.atl/skill-registry.md` (fallback) o engram
  (`mem_search`); la caché de reglas compactas se resuelve UNA vez por sesión.
- Subagentes reciben reglas compactadas en el prompt — NO leen SKILL.md.
- Fases SDD: proposal → specs → design → tasks → apply → verify → archive; cada
  artefacto se guarda con topic key `sdd/{cambio}/...`.
- Model assignments por fase: orchestrator=opus, explore/spec/tasks/apply/
  verify=sonnet, propose/design=opus, archive=haiku; `default`=sonnet.
- Si el resultado de una delegación reporta `skill_resolution: none|fallback-*`,
  re-leer el registro y reinyectar reglas compactas.

## Guardas de integridad

- No romper el **gate de acceso**: `access-gate.tsx` + `audio.store.ts` son el
  origen del desbloqueo de audio y del arranque B&N.
- No inventar firmas: leer `engine.ts`, `palette-morph.ts`, `color.ts` antes de
  tocar el morph o el motor de audio.
- Fuentes y assets: self-hosted en `src/lib/fonts.ts` / `public/`; no depender
  de CDNs externos.