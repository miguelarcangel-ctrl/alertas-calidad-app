# Spec de layout del PDF — Alerta de Calidad

Tamaño de página: A4 horizontal (841.89 x 595.28 pt / 297 x 210 mm), igual al PDF de ejemplo.
El diseño visual (colores, tipografía) debe seguir `dpworld-panama-brand`, **no** el azul marino
del PDF de ejemplo — lo que se conserva de ahí es solo la estructura de información y el patrón
de paginación de evidencia fotográfica descrito abajo.

## Página 1 — Encabezado y cuerpo

```
┌─────────────────────────────┬───────────────────────────────────┬───────────────┬───────────────┐
│  [logo DP World real]        │        ALERTA DE CALIDAD           │ ALERTA N°:    │ FECHA EMISIÓN │
│  DP WORLD PANAMA             │   (franja color primario #3E3C90,  │ {alertaNumero}│ {fechaEmision}│
│                               │    texto blanco bold ALL CAPS)     │               │               │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CENTRO DE EMISIÓN     │ CLIENTE                  │ SKU        │ DESCRIPCIÓN DEL PRODUCTO           │
│ {centroEmision}       │ {cliente}                │ {sku}      │ {descripcionProducto}               │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ LOTE │ FECHA PRODUCCIÓN │ FECHA VENCIMIENTO │ TRANSPORTISTA │ ORDEN DE TRANSPORTE                   │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TIPO DE ALERTA          │ DESCRIPCIÓN DE LA ALERTA          │ CANTIDAD AFECTADA                     │
│ [ ] Calidad             │ {descripcionAlerta}                │ {cantidadAfectada[].etiqueta: valor}  │
│ [ ] Seguridad           │                                     │ (una línea por elemento del array)     │
│ [ ] Otro: ___           │                                     │                                        │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HALLAZGOS                    │ CAUSA RAÍZ                  │ ACCIONES REALIZADAS                    │
│ • {hallazgos[0]}             │ {causaRaiz}                 │ • {accionesRealizadas[0]}               │
│ • {hallazgos[1]}             │                              │ • {accionesRealizadas[1]}               │
│ ...                           │                              │ ...                                      │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ EVIDENCIA FOTOGRÁFICA (cuadrícula, ver regla abajo)                                                  │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OBSERVACIONES          │ ELABORADO POR          │ REVISADO POR          │ APROBADO POR              │
│ {observaciones}         │ {nombre} / {cargo}      │ {nombre} / {cargo}    │ {nombre} / {cargo}         │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Header de las 3 tablas de datos: fondo negro `#000000`, texto blanco, bold, ALL CAPS
(patrón ya usado en el PDF de ejemplo — conservar). Filas de contenido: fondo blanco, texto negro
regular. Bordes `#E0E0E0` 1px.

## Regla de paginación de evidencia fotográfica

Esta es la regla que **sí** se conserva literal del PDF de ejemplo:

1. **Si `evidenciaFotografica.length === 0`:** omitir la sección o mostrar "Sin evidencia
   fotográfica adjunta".
2. **Si `evidenciaFotografica.length <= 10`:** todas las fotos van en una cuadrícula de 2 filas x
   5 columnas dentro de la página 1, cada celda con la foto + su caption debajo en texto pequeño.
   Si hay menos de 10, la cuadrícula simplemente tiene menos celdas llenas (no dejar huecos vacíos
   con borde, achicar el grid a las filas necesarias).
3. **Si `evidenciaFotografica.length > 10`:** las primeras 10 van en la cuadrícula de la página 1
   (igual que el punto 2). A partir de la foto 11, **cada foto adicional va en su propia página
   completa**, con este encabezado simple en la parte superior:
   ```
   ALERTA DE CALIDAD - EVIDENCIA FOTOGRÁFICA
   ALERTA N° {alertaNumero}  |  EVIDENCIA {n}
   ```
   seguido de la foto centrada, grande (ocupando la mayor parte de la página, manteniendo el
   aspect ratio), y el caption debajo si existe.
   Esto es exactamente lo que hace el PDF de ejemplo con sus evidencias 11 a 14.

## Compresión de imágenes (antes de insertar en el PDF)

- Redimensionar a un ancho máximo de 1600px (manteniendo aspect ratio).
- Re-encodear a JPEG calidad ~80.
- Hacer esto en el cliente (navegador) antes de pasar la imagen a `@react-pdf/renderer`, para que
  el PDF final no pese lo que pesaba el PDF de ejemplo (fotos de 400-600 KB cada una eran
  excesivas para el propósito).

## Variante "historial" (sin fotos)

Cuando el PDF se regenera desde el historial (ver `historial-schema.json` y el skill
`alerta-calidad-schema`), la sección "EVIDENCIA FOTOGRÁFICA" completa (cuadrícula + páginas
individuales) se reemplaza por un solo bloque de texto:

```
EVIDENCIA FOTOGRÁFICA

Esta alerta se envió originalmente con {cantidadFotosOriginal} foto(s) de evidencia:
{captionsFotosOriginal.join(', ')}.
Las imágenes no se conservan en el historial — el PDF con fotos fue el que se envió
por WhatsApp/correo en su momento.
```

Todo lo demás del layout (header, tablas, firmas) es idéntico entre la variante "en caliente" (con
fotos) y la variante "historial" (sin fotos).

## Tipografía

- Título "ALERTA DE CALIDAD": ALL CAPS, bold, sobre franja `#3E3C90`, texto blanco.
- Labels de tabla (CENTRO DE EMISIÓN, CLIENTE, etc.): ALL CAPS, bold, pequeño, sobre fondo negro,
  texto blanco.
- Contenido de tabla: sentence case, regular, negro.
- Usar Inter si `@react-pdf/renderer` permite embeber la fuente (`Font.register`); si da problemas
  de build, usar Helvetica (fuente por defecto del motor) como fallback — nunca usar una fuente
  serif.
