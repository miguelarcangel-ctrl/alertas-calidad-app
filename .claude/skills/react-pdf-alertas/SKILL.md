---
name: react-pdf-alertas
description: Convenciones y soluciones concretas para generar el PDF de Alertas de Calidad con @react-pdf/renderer (fuentes, saltos de página entre la cuadrícula de fotos y las páginas individuales, embebido de imágenes comprimidas). Usar al tocar cualquier componente bajo src/components/pdf/ o al depurar problemas de layout/paginación del PDF generado.
---

# react-pdf-alertas — convenciones de implementación

**Estado: actualizado tras la primera implementación** (proyecto `alertas-calidad-app`, ver sección
"Lo que funcionó" más abajo). Sigue siendo un punto de partida, no verdad absoluta — si algo de aquí
resulta incorrecto tras usarlo con datos/fotos reales, corregir este archivo en el mismo commit.

## Por qué `@react-pdf/renderer` y no Puppeteer (de entrada)

Genera el PDF con componentes React sin necesitar un navegador headless — más liviano y más fácil
de desplegar en Vercel/serverless. Si el layout de la cuadrícula de evidencia fotográfica resulta
demasiado rígido con este motor, la alternativa documentada en `PLAN.md` (sección 6) es migrar a
Puppeteer/Playwright con HTML+CSS real. No migrar sin antes intentar resolverlo aquí.

## Puntos que típicamente requieren atención con este motor

- **Fuentes:** `@react-pdf/renderer` no incluye Inter por defecto — hay que `Font.register()` con
  los archivos `.ttf`/`.otf` de Inter, o usar Helvetica (fuente por defecto del motor) como
  fallback si el registro de fuente da problemas de build. Nunca dejar una fuente serif por
  defecto.
- **Saltos de página forzados:** para separar la cuadrícula de la página 1 de las páginas
  individuales de evidencia (foto 11+), cada `<Page>` extra se genera con un `.map()` sobre el
  array de fotos 11+ — no intentar forzar un salto de página dentro de un mismo `<Page>` con CSS,
  el motor no soporta `page-break` como CSS web; cada página nueva es un componente `<Page>`
  explícito.
- **Imágenes:** el componente `<Image>` de `@react-pdf/renderer` acepta base64 o URL. Las imágenes
  ya deben venir comprimidas (ver regla de compresión en `alerta-calidad-schema`) — este motor no
  comprime nada por sí mismo, y una imagen sin comprimir puede hacer que la generación del PDF sea
  notablemente más lenta o que el archivo final pese demasiado.
- **Grid de 2x5:** no hay `display: grid` nativo — armar la cuadrícula con `<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>` y cada celda con un ancho fijo (`width: '20%'` para 5 columnas).
- **Texto largo en celdas de tabla:** el motor no hace ajuste de texto automático dentro de anchos
  fijos tan bien como HTML/CSS real — probar con los textos largos reales de
  `sample-data/ejemplo-CAL-2026-018.json` (la causa raíz y los hallazgos son párrafos largos), no
  solo con texto de prueba corto.

## Lo que funcionó en la primera implementación (alertas-calidad-app)

- **Fuente:** se quedó en **Helvetica** (fallback del motor), a propósito — no se intentó
  `Font.register` con Inter. Cargar una fuente remota (Google Fonts / gstatic) habría hecho que la
  generación del PDF dependa de una petición de red en cada render, lo cual es frágil para un flujo
  que corre en el navegador del usuario. Helvetica es sans-serif y cumple la regla de marca ("nunca
  serif"); si más adelante se quiere Inter, embeber el `.ttf` como archivo local en
  `public/fonts/` y usar `Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' })` en
  vez de una URL remota.
- **Grid 2x5 (real):** ver `src/components/pdf/styles.ts` (`evidenciaGrid`, `evidenciaCelda`) y
  `src/components/pdf/EvidenciaGridPDF.tsx`. `evidenciaGrid` es
  `{ flexDirection: 'row', flexWrap: 'wrap' }` y cada `evidenciaCelda` tiene `width: '20%'` — con
  menos de 10 fotos, el `.slice(0, 10).map()` simplemente genera menos celdas, sin huecos.
- **Texto largo:** no hizo falta nada especial — `<Text>` dentro de una columna con
  `flexGrow: 1, flexBasis: 0` (ver `pdfStyles.tableCol` en `styles.ts`) hace wrap automático al
  ancho calculado de la columna. Se dejó así de entrada; probar igual con los textos largos reales
  de `sample-data/ejemplo-CAL-2026-018.json` (causa raíz y hallazgos) antes de dar por bueno el
  layout en producción.
- **Páginas individuales (foto 11+):** `AlertaCalidadDocument.tsx` hace
  `alerta.evidenciaFotografica.slice(10).map((foto, i) => <EvidenciaPaginaCompletaPDF ... />)`
  como hermanos de la `<Page>` principal dentro del mismo `<Document>` — confirma que "cada página
  nueva es un componente `<Page>` explícito" es el patrón correcto.
- **Pendiente de medir con datos reales:** el tiempo de generación y el tamaño final del PDF con
  las 14 fotos de `sample-data/ejemplo-CAL-2026-018.json` NO se midieron todavía — ese fixture usa
  nombres de archivo placeholder (`placeholder-01.jpg`, etc.), no imágenes reales, y este entorno no
  tiene navegador para correr el flujo completo (compresión → `pdf().toBlob()`). Medir esto la
  primera vez que se pruebe con fotos reales en un navegador.
