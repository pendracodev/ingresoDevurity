import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  const { userId } = await req.json();

  await prisma.asistencia.create({
    data: { usuarioId: Number(userId) },
  });

  return NextResponse.json({ message: "Asistencia registrada" });
}

export async function GET() {
  const asistencias = await prisma.asistencia.findMany({
    include: { usuario: true },
    orderBy: { fecha: "desc" },
  });

  return NextResponse.json(asistencias);
}
