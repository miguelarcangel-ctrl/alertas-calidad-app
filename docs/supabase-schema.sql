-- Tabla de historial de Alertas de Calidad (docs/historial-schema.json).
-- Ejecutar en el SQL editor de Supabase. No incluye binarios de imagen,
-- solo cantidad_fotos_original y captions_fotos_original (texto) — ver
-- PLAN.md sección 6.2 y el skill alerta-calidad-schema.

create table if not exists public.alertas_calidad (
  id uuid primary key default gen_random_uuid(),
  alerta_numero text not null,
  fecha_emision date not null,
  centro_emision text,
  cliente text not null,
  sku text,
  descripcion_producto text not null,
  lote text,
  fecha_produccion text,
  fecha_vencimiento text,
  transportista text,
  orden_transporte text,
  tipo_alerta jsonb not null,
  descripcion_alerta text not null,
  cantidad_afectada jsonb not null default '[]',
  hallazgos jsonb not null default '[]',
  causa_raiz text not null,
  acciones_realizadas jsonb not null default '[]',
  cantidad_fotos_original integer not null default 0,
  captions_fotos_original jsonb not null default '[]',
  observaciones text,
  firmas jsonb not null default '{}',
  envios jsonb not null default '[]',
  fecha_guardado timestamptz not null default now()
);

create index if not exists alertas_calidad_fecha_guardado_idx
  on public.alertas_calidad (fecha_guardado desc);

create index if not exists alertas_calidad_cliente_idx
  on public.alertas_calidad (cliente);

-- RLS: todas las lecturas/escrituras pasan por las API routes de Next.js
-- usando la service role key, que ignora RLS. Se habilita igual por buena
-- práctica, sin políticas públicas — el cliente del navegador nunca habla
-- directo con Supabase (ver src/lib/supabaseServer.ts).
alter table public.alertas_calidad enable row level security;
