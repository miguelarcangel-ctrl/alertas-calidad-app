import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const TABLA = "alertas_calidad";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from(TABLA).select("*").eq("id", id).single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "No encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      alerta: {
        id: data.id,
        alertaNumero: data.alerta_numero,
        fechaEmision: data.fecha_emision,
        centroEmision: data.centro_emision,
        cliente: data.cliente,
        sku: data.sku,
        descripcionProducto: data.descripcion_producto,
        lote: data.lote,
        fechaProduccion: data.fecha_produccion,
        fechaVencimiento: data.fecha_vencimiento,
        transportista: data.transportista,
        ordenTransporte: data.orden_transporte,
        tipoAlerta: data.tipo_alerta,
        descripcionAlerta: data.descripcion_alerta,
        cantidadAfectada: data.cantidad_afectada,
        hallazgos: data.hallazgos,
        causaRaiz: data.causa_raiz,
        accionesRealizadas: data.acciones_realizadas,
        cantidadFotosOriginal: data.cantidad_fotos_original,
        captionsFotosOriginal: data.captions_fotos_original,
        observaciones: data.observaciones,
        firmas: data.firmas,
        envios: data.envios,
        fechaGuardado: data.fecha_guardado,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado" },
      { status: 500 }
    );
  }
}
