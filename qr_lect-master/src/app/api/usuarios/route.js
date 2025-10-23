import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";

export async function POST(req) {
  const { nombre, correo, password } = await req.json();

  const usuario = await prisma.usuario.create({
    data: { nombre, correo, password },
  });

  // Generar QR con el id del usuario
  const qr = await QRCode.toDataURL(usuario.id.toString());

  return NextResponse.json({ id: usuario.id, qr });
}
