# Alertas de Calidad — DP World Panamá

App para generar, enviar y llevar historial de Alertas de Calidad, reemplazando el llenado manual
en PDF. Ver `PLAN.md` para el detalle completo del alcance y las decisiones de diseño.

## Setup

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear la tabla de historial en Supabase: correr `docs/supabase-schema.sql` en el SQL editor de
   tu proyecto de Supabase.

3. Copiar `.env.example` a `.env.local` y completar `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
   (de tu proyecto de Supabase, Settings → API).

4. Levantar en desarrollo:

   ```bash
   npm run dev
   ```

## Estructura

- `src/app/page.tsx` — formulario principal (genera el PDF, descargar/compartir, guarda en
  historial). El envío es vía Web Share API nativa (selector del sistema: WhatsApp, correo, Drive,
  etc.) con descarga directa como respaldo si el navegador no soporta compartir archivos — mismo
  patrón que ya usa `inspeccion_contenedores-dpworld`, sin backend de correo de por medio.
- `src/app/historial/page.tsx` — lista de alertas guardadas, con filtro por cliente/fechas y
  descarga (regenera el PDF sin fotos).
- `src/app/api/alertas` — POST guarda en historial, GET lista.
- `src/app/api/alertas/[id]` — GET un registro puntual.
- `src/components/pdf/` — documentos `@react-pdf/renderer` (`AlertaCalidadDocument` con fotos,
  `AlertaCalidadDocumentHistorial` sin fotos).
- `src/components/form/` — secciones del formulario.
- `docs/` — esquemas de datos y spec de layout del PDF (fuente de verdad, ver también
  `.claude/skills/alerta-calidad-schema`).

## Fixture de prueba

`sample-data/ejemplo-CAL-2026-018.json` trae un caso real con 14 fotos (usa placeholders, no
imágenes reales) para probar la regla de paginación de evidencia fotográfica.

## Qué se verificó y qué falta

Verificado en este entorno: `npm run build` (type-check completo, sin errores), `npm run lint`
(limpio), `npm run dev` sirviendo `/` y `/historial` con status 200, los assets de marca
(`/brand/*.png`) sirviéndose correctamente, y las clases de Tailwind (`bg-dpw-primary`, etc.)
compilando al CSS final.

**No verificado** (este entorno no tiene navegador ni un proyecto de Supabase real):

- El flujo real de generación de PDF en el navegador (`pdf().toBlob()` de `@react-pdf/renderer`
  corre en el cliente y necesita un DOM real).
- Paginación de evidencia con 0, 1, 10 y 15+ fotos reales — probar con
  `sample-data/ejemplo-CAL-2026-018.json` como referencia de textos largos (ese fixture trae
  nombres de foto placeholder, no imágenes reales).
- Guardado/lectura real en Supabase (la API route falla de forma controlada y con mensaje claro si
  faltan las variables de entorno — eso sí se probó).
- El botón "Compartir" (Web Share API) solo aparece/funciona en navegadores con soporte de
  `navigator.share` con archivos (típicamente Chrome/Safari en Android e iOS) — en escritorio se
  oculta y solo queda "Descargar", igual que en `inspeccion_contenedores-dpworld`.

Antes de dar por buena la Fase 1: completar `.env.local`, correr `npm run dev` y probar el flujo
completo (generar → descargar/compartir → aparece en historial → redescargar sin fotos) en un
navegador real, idealmente un celular para probar el share nativo.
