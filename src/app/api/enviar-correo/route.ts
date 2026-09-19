import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

/**
 * Respaldo garantizado de envío (funciona también en escritorio, a
 * diferencia del share nativo) — ver PLAN.md sección 6.1. Recibe el PDF
 * ya generado (con fotos) + el correo destino y lo envía como adjunto.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Falta configurar RESEND_API_KEY / RESEND_FROM_EMAIL. Ver .env.example." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const pdfEntry = formData.get("pdf");
    const destinatario = formData.get("destinatario");
    const alertaNumero = formData.get("alertaNumero");
    const cliente = formData.get("cliente");

    if (!(pdfEntry instanceof File) || typeof destinatario !== "string" || !destinatario) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: pdf y destinatario." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await pdfEntry.arrayBuffer());
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: destinatario,
      subject: `Alerta de Calidad ${alertaNumero ?? ""} — ${cliente ?? "DP World Panamá"}`,
      text: `Adjunto la Alerta de Calidad ${alertaNumero ?? ""} correspondiente a ${cliente ?? ""}.`,
      attachments: [
        {
          filename: pdfEntry.name || `${alertaNumero || "alerta"}.pdf`,
          content: buffer,
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado" },
      { status: 500 }
    );
  }
}
