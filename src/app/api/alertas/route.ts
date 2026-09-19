import { NextResponse } from "next/server";
import { nuevaAlertaHistorialSchema } from "@/lib/historialSchema";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const TABLA = "alertas_calidad";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .order("fecha_guardado", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ alertas: (data ?? []).map(filaADominio) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = nuevaAlertaHistorialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(TABLA)
      .insert(dominioAFila(parsed.data))
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ alerta: filaADominio(data) }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado" },
      { status: 500 }
    );
  }
}

/**
 * Vacía TODO el historial. Requiere ?confirm=BORRAR_TODO en la URL como
 * salvaguarda adicional (más allá de la confirmación que ya pide la UI) —
 * ver TablaHistorial/HistorialPage para el flujo de confirmación.
 */
export async function DELETE(request: Request) {
  try {
    const confirm = new URL(request.url).searchParams.get("confirm");
    if (confirm !== "BORRAR_TODO") {
      return NextResponse.json(
        { error: "Falta confirmación. Agrega ?confirm=BORRAR_TODO para vaciar el historial." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(TABLA).delete().not("id", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado" },
      { status: 500 }
    );
  }
}

// Las columnas en Supabase usan snake_case (ver docs/supabase-schema.sql);
// el dominio de la app usa camelCase (ver docs/historial-schema.json).
function dominioAFila(alerta: ReturnType<typeof nuevaAlertaHistorialSchema.parse>) {
  return {
    alerta_numero: alerta.alertaNumero,
    fecha_emision: alerta.fechaEmision,
    centro_emision: alerta.centroEmision,
    cliente: alerta.cliente,
    sku: alerta.sku,
    descripcion_producto: alerta.descripcionProducto,
    lote: alerta.lote,
    fecha_produccion: alerta.fechaProduccion,
    fecha_vencimiento: alerta.fechaVencimiento,
    transportista: alerta.transportista,
    orden_transporte: alerta.ordenTransporte,
    tipo_alerta: alerta.tipoAlerta,
    descripcion_alerta: alerta.descripcionAlerta,
    cantidad_afectada: alerta.cantidadAfectada,
    hallazgos: alerta.hallazgos,
    causa_raiz: alerta.causaRaiz,
    acciones_realizadas: alerta.accionesRealizadas,
    cantidad_fotos_original: alerta.cantidadFotosOriginal,
    captions_fotos_original: alerta.captionsFotosOriginal,
    observaciones: alerta.observaciones,
    firmas: alerta.firmas,
    envios: alerta.envios ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filaADominio(fila: any) {
  return {
    id: fila.id,
    alertaNumero: fila.alerta_numero,
    fechaEmision: fila.fecha_emision,
    centroEmision: fila.centro_emision,
    cliente: fila.cliente,
    sku: fila.sku,
    descripcionProducto: fila.descripcion_producto,
    lote: fila.lote,
    fechaProduccion: fila.fecha_produccion,
    fechaVencimiento: fila.fecha_vencimiento,
    transportista: fila.transportista,
    ordenTransporte: fila.orden_transporte,
    tipoAlerta: fila.tipo_alerta,
    descripcionAlerta: fila.descripcion_alerta,
    cantidadAfectada: fila.cantidad_afectada,
    hallazgos: fila.hallazgos,
    causaRaiz: fila.causa_raiz,
    accionesRealizadas: fila.acciones_realizadas,
    cantidadFotosOriginal: fila.cantidad_fotos_original,
    captionsFotosOriginal: fila.captions_fotos_original,
    observaciones: fila.observaciones,
    firmas: fila.firmas,
    envios: fila.envios,
    fechaGuardado: fila.fecha_guardado,
  };
}
