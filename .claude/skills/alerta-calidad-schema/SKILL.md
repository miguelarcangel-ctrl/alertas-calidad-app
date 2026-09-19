---
name: alerta-calidad-schema
description: Modelo de datos, reglas de layout/paginación, y reglas de guardado/historial (sin imágenes) del PDF de Alertas de Calidad de DP World Panamá. Usar SIEMPRE que se cree, edite o revise cualquier parte de la app: el formulario, el componente de generación de PDF, el guardado en base de datos, la vista de historial, o los fixtures de prueba. Activar también ante menciones de "alerta de calidad", "CAL-2026", "evidencia fotográfica", "historial de alertas", "compartir/enviar PDF", o los tipos AlertaCalidad / AlertaCalidadHistorial.
---

# Alerta de Calidad — modelo de datos y layout

Este skill es la fuente de verdad del **qué** (campos, estructura) para la app de Alertas de
Calidad. Para el **cómo** (detalles de implementación con `@react-pdf/renderer`), ver el skill
`react-pdf-alertas`. Para colores/tipografía/logo, ver `dpworld-panama-brand`.

## Regla de oro

**No copiar el diseño visual del PDF de ejemplo original** (`Alerta_Calidad_DP_World_Formato_Cliente.pdf`,
azul marino genérico, ícono de dos círculos). Ese PDF solo definió la *estructura de información*
y el *patrón de paginación de fotos* — el diseño real sale de `dpworld-panama-brand`.

## Campos del formulario (ver `docs/data-schema.json` para el JSON Schema completo)

- **Encabezado:** alertaNumero (`CAL-{AÑO}-{NNN}`), fechaEmision, centroEmision (default "DP WORLD
  PANAMA"), cliente, sku, descripcionProducto, lote, fechaProduccion, fechaVencimiento,
  transportista, ordenTransporte (estos últimos 4, default "N/A").
- **tipoAlerta:** `{ tipo: "Calidad" | "Seguridad" | "Otro", otroDetalle? }`.
- **descripcionAlerta:** texto libre.
- **cantidadAfectada:** array de `{ etiqueta, valor }` — deliberadamente flexible, NO forzar
  campos fijos de "paletas/cajas" porque otros clientes pueden reportar contenedores, bultos o kg.
- **hallazgos:** array de strings, mínimo 1, editable dinámicamente (agregar/quitar líneas).
- **causaRaiz:** texto libre.
- **accionesRealizadas:** array de strings, mínimo 1, dinámico.
- **evidenciaFotografica:** array de `{ imagenBase64OrUrl, caption? }`.
- **observaciones:** texto libre, default "N/A".
- **firmas:** `{ elaboradoPor, revisadoPor, aprobadoPor }`, cada uno `{ nombre, cargo }`.

## Regla de paginación de evidencia fotográfica (obligatoria, no reinterpretar)

1. 0 fotos → omitir sección o mostrar "Sin evidencia fotográfica adjunta".
2. 1–10 fotos → todas en una cuadrícula de 2 filas x 5 columnas en la página principal, cada una
   con su caption debajo.
3. 11+ fotos → las primeras 10 en la cuadrícula (punto 2). Cada foto adicional (11, 12, 13...) va
   en su **propia página completa**, con encabezado:
   ```
   ALERTA DE CALIDAD - EVIDENCIA FOTOGRÁFICA
   ALERTA N° {alertaNumero}  |  EVIDENCIA {n}
   ```
   y la foto grande centrada + caption.

Ver `docs/pdf-layout-spec.md` para el layout completo de las tablas del encabezado.

## Compresión de imágenes

Redimensionar a máx. 1600px de ancho, re-encodear JPEG calidad ~80, **en el cliente**, antes de
pasar la imagen al componente de PDF. El PDF de ejemplo tenía fotos de 400-600 KB cada una — evitar
repetir eso.

## Numeración de alertas

Formato `CAL-{AÑO}-{NNN}` (ej. `CAL-2026-018`). En Fase 1 (sin backend) el usuario la escribe
manualmente o se sugiere la siguiente basada en localStorage. En Fase 2 (con persistencia) se
genera server-side de forma correlativa por año.

## Fixture de prueba real

`sample-data/ejemplo-CAL-2026-018.json` tiene un caso real con 14 fotos (para probar el punto 3 de
la regla de paginación) — usarlo siempre al probar cambios de layout, no solo casos con 2-3 fotos.

## Enviar / compartir el PDF

El PDF generado (con fotos) se puede **compartir** vía Web Share API nativa
(`navigator.share({ files: [...] })`, con `navigator.canShare` como feature-detection obligatorio
— sin esto el botón falla silenciosamente en navegadores de escritorio) o **enviar por correo**
vía una API route de Next.js que use Resend (o similar) con el PDF como adjunto. No existe una API
pública de WhatsApp para envío directo desde una web — el share nativo es el mecanismo correcto.

## Guardado en historial — regla obligatoria: SIN imágenes

Al generar/enviar una alerta, se guarda en base de datos un registro según
`docs/historial-schema.json` — **NUNCA el binario de las fotos**, solo:
- `cantidadFotosOriginal` (número)
- `captionsFotosOriginal` (array de strings, solo texto)

**Por qué:** evita que la base de datos se infle con imágenes; el trade-off aceptado es que el PDF
regenerado desde el historial no tendrá las fotos.

## Regenerar PDF desde el historial (sin fotos)

Usar un componente de PDF distinto para esto (`AlertaCalidadDocumentHistorial.tsx`, no el mismo que
genera el PDF "en caliente" con fotos). La sección de evidencia fotográfica se reemplaza por una
nota de texto usando `cantidadFotosOriginal` y `captionsFotosOriginal`, ej.:

> Esta alerta se envió originalmente con {cantidadFotosOriginal} foto(s) de evidencia:
> {captionsFotosOriginal.join(', ')}. Las imágenes no se conservan en el historial.

No omitir esta nota — es lo que mantiene la trazabilidad de qué evidencia existió, sin tener que
guardar el binario.
