---
name: dpworld-panama-brand
description: >
  Sistema de diseño e identidad visual corporativa de DP World Panamá. Usar SIEMPRE que se
  cree o edite cualquier output con marca DP World: presentaciones, apps web internas, reportes,
  SOPs, tablas, HTML, componentes UI, slides, o cualquier documento corporativo de DAL Colón
  Logistics Park. Activar también cuando el usuario mencione: colores DP World, paleta, tipografía,
  diseño de slide, formato de reporte, branding, layout, estilo corporativo, o header/footer
  de documentos internos. No asumir colores ni fuentes sin consultar este skill primero.
---

# DP World — Sistema de Diseño Corporativo

Guía de identidad visual extraída directamente de **dpworld.com** (sitio corporativo global, mayo 2026)
y los logos oficiales en ambas versiones. Fuente de verdad para todos los outputs de DP World Panamá.

---

## 1. COLOR — Paleta Oficial

### Color Primario (dominante)
| Token | Hex | Uso |
|---|---|---|
| `--dpw-primary` | `#3E3C90` | Theme color oficial del sitio · fondos de hero · headers · botones primarios · secciones destacadas |

Este morado-índigo es el **color estructural del sitio web corporativo**. Aparece como `meta-theme-color` en todas las páginas de dpworld.com de forma consistente. Es el color de mayor jerarquía visual.

### Color Secundario (acento verde)
| Token | Hex | Uso |
|---|---|---|
| `--dpw-green` | `#00C389` | Acento del logo (arco verde) · CTAs · highlights · indicadores positivos |

### Color Terciario (acento rojo/coral)
| Token | Hex | Uso |
|---|---|---|
| `--dpw-red` | `#E8003D` | Arco rojo/magenta del logo · alertas · énfasis secundario |

### Neutros
| Token | Hex | Uso |
|---|---|---|
| `--dpw-dark` | `#1A1A2E` | Texto principal · fondos oscuros (casi negro con tinte azul) |
| `--dpw-black` | `#000000` | Wordmark "DP WORLD" en logo sobre fondo blanco |
| `--dpw-white` | `#FFFFFF` | Fondo base · texto sobre primario · logo versión clara |
| `--dpw-gray-light` | `#F5F5F5` | Fondos alternos de sección · zebra en tablas |
| `--dpw-gray-mid` | `#E0E0E0` | Bordes de tablas · separadores |
| `--dpw-gray-text` | `#666666` | Texto secundario · subtítulos · metadatos |

---

## 2. PROPORCIONES DE COLOR — Regla 60-30-10

Extraído del análisis del sitio dpworld.com:

| Proporción | Color | Aplicación típica |
|---|---|---|
| **~60%** | Blanco `#FFFFFF` | Fondo de página · espacios en blanco · áreas de contenido |
| **~30%** | Primario `#3E3C90` | Headers · hero sections · fondos de secciones clave · nav |
| **~10%** | Verde `#00C389` + Rojo `#E8003D` | Logo · CTAs · bullets de énfasis · íconos de acción |

**Patrón observado en dpworld.com:** el sitio es predominantemente blanco con bloques de color en secciones alternadas. El primario `#3E3C90` aparece en fondos de secciones de alto impacto (hero banners, headers de página, nav hover states). El verde y rojo son casi exclusivos del logo y elementos de acción puntual.

---

## 3. TIPOGRAFÍA

### Estilo observado en dpworld.com
- **Títulos de sección:** ALL CAPS, sans-serif bold, tracking amplio — ej: `SUSTAINABILITY`, `OUR PEOPLE`, `WE MAKE TRADE FLOW`
- **Cuerpo:** sentence case, sans-serif regular
- **Labels/nav:** ALL CAPS, tamaño pequeño, tracking moderado

### Fuente corporativa
La familia tipográfica del sitio es sans-serif geométrica moderna. Para outputs internos usar:
- **Producción propia (HTML/web):** `'Inter', 'Barlow Condensed', sans-serif`
- **Documentos (PPTX/Word):** Calibri o Arial como fallback universal
- **Nunca usar:** tipografías serif, decorativas, o con exceso de personalidad

### Jerarquía tipográfica
```
H1 / Hero:     ALL CAPS · bold · 48–72px · tracking: 0.05em
H2 / Sección:  ALL CAPS · bold · 28–36px · tracking: 0.04em  
H3 / Subtítulo: Sentence case · semibold · 18–22px
Cuerpo:        Regular · 14–16px · line-height: 1.6
Label/Tag:     ALL CAPS · medium · 11–12px · tracking: 0.08em
```

---

## 4. LOGO — Uso Correcto

### Versiones disponibles
| Versión | Fondo | Uso |
|---|---|---|
| Logo color + texto negro | Blanco o claro | Documentos internos, presentaciones sobre blanco, formularios |
| Logo color + texto blanco | Oscuro (`#3E3C90`, negro, foto) | Headers oscuros, footer, pantallas TV, hero banners |

### Elementos del logo
- **Ícono:** tres arcos entrelazados (verde `#00C389`, blanco, rojo-magenta `#E8003D`) representando "flow"
- **Wordmark:** "DP WORLD" en sans-serif bold, negro o blanco según fondo
- **Zona de respeto:** mínimo igual a la altura de la letra "D" a cada lado del logo
- **Nunca:** recolorear el ícono, separar ícono del wordmark, usar sobre fondos que no den suficiente contraste

---

## 5. LAYOUT Y COMPOSICIÓN

### Patrón de página web dpworld.com
```
┌─────────────────────────────────────┐
│  NAV: fondo blanco / #3E3C90 activo  │  altura: ~64px
├─────────────────────────────────────┤
│  HERO: foto full-width + overlay     │  fondo: foto · texto: blanco
│  Título ALL CAPS · subtítulo · CTA   │
├─────────────────────────────────────┤
│  SECCIÓN 1: fondo blanco            │  padding: ~80px vertical
│  Eyebrow label (caps pequeño)        │
│  H2 ALL CAPS bold                    │
│  Párrafo · botón outline             │
├─────────────────────────────────────┤
│  SECCIÓN 2: fondo #3E3C90 (oscuro)  │  alternancia de color
│  Texto blanco                        │
├─────────────────────────────────────┤
│  SECCIÓN 3: fondo blanco            │  retorno a blanco
│  ...                                 │
├─────────────────────────────────────┤
│  FOOTER: fondo oscuro (#1A1A2E)     │  logo blanco · links grises
└─────────────────────────────────────┘
```

**Principio clave:** alternancia de secciones blancas y oscuras. Nunca dos secciones oscuras consecutivas sin separación blanca.

### Para presentaciones (slides)
- Slide de portada: fondo `#3E3C90` o foto oscura · logo blanco · título blanco ALL CAPS
- Slides de contenido: fondo blanco · título negro ALL CAPS arriba izquierda · cuerpo en negro
- Slide de cierre/resumen: vuelve a `#3E3C90` · texto blanco

### Para tablas de datos (patrón documentos internos)
```
Header: fondo negro (#000000) · texto blanco · bold · ALL CAPS
Fila impar: fondo blanco
Fila par: fondo #F5F5F5 (gris muy suave)
Bordes: #E0E0E0 (1px)
Texto celda: negro · regular
Celda destacada: texto en #3E3C90 bold (para zonas/categorías)
```

---

## 6. BOTONES Y CTAs

| Tipo | Fondo | Texto | Border |
|---|---|---|---|
| Primario | `#3E3C90` | Blanco | — |
| Secundario / outline | Transparente | `#3E3C90` | `#3E3C90` 2px |
| Hover primario | `#2D2B6B` (oscurecer 15%) | Blanco | — |
| Destructivo / alerta | `#E8003D` | Blanco | — |

Texto de botón: **ALL CAPS · semibold · tracking 0.05em**

---

## 7. TONO DE VOZ Y REDACCIÓN

Extraído de los headlines de dpworld.com:

- **Directo y declarativo:** "WE MAKE TRADE FLOW" — no descriptivo, sino orientado al impacto
- **Verbos de acción:** "connecting", "driving", "powering", "enabling"
- **Escala global + propósito humano:** siempre ancla el mensaje en personas y comunidades, no solo en toneladas o estadísticas
- **Títulos:** nunca preguntas, siempre afirmaciones bold
- Para documentos internos de Panamá: mantener el mismo tono profesional y directo, en español formal

---

## 8. APLICACIÓN EN APPS WEB INTERNAS (HTML/CSS)

```css
:root {
  /* Primarios */
  --dpw-primary:     #3E3C90;
  --dpw-primary-dk:  #2D2B6B;  /* hover / activo */
  --dpw-green:       #00C389;
  --dpw-red:         #E8003D;

  /* Neutros */
  --dpw-dark:        #1A1A2E;
  --dpw-white:       #FFFFFF;
  --dpw-gray-light:  #F5F5F5;
  --dpw-gray-mid:    #E0E0E0;
  --dpw-gray-text:   #666666;

  /* Tipografía */
  --dpw-font:        'Inter', 'Barlow Condensed', sans-serif;
  --dpw-tracking-h:  0.05em;
}
```

### Componentes mínimos requeridos
- **Header de app:** fondo `#3E3C90` · logo blanco · nav links blancos
- **Cards de métricas:** fondo blanco · borde izquierdo 4px `#3E3C90` · número en bold grande
- **Tablas:** header negro · alternancia blanco/`#F5F5F5` · bordes `#E0E0E0`
- **Toasts / alertas:** success en `#00C389` · error en `#E8003D` · info en `#3E3C90`
- **Sidebar:** fondo `#1A1A2E` · íconos y texto blanco · item activo con acento `#00C389`

---

## 9. NOTAS DE CONTEXTO LOCAL — DP World Panamá

Las apps internas (Control de Horas, Cotizador, Inspección de Contenedores) y el Hub siguen
esta paleta global pero pueden usar variantes de apoyo previamente establecidas:

| Color local | Hex | Relación con global |
|---|---|---|
| Indigo apps | `#2D2B6B` | Versión oscura de `--dpw-primary` — consistente |
| Verde apps | `#00C389` | **Idéntico** al verde corporativo global |
| Purple apps | `#7C5CBF` | Variante local de apoyo — no usar en portadas ni como primario |
| Navy apps | `#1A1060` | Versión más oscura del dark corporativo — aceptable para fondos |

El color `#00C389` es exactamente el mismo verde del logo corporativo de DP World. Es el puente
directo entre la identidad global y las apps internas.
