// app/api/asistencia/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(userId) },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener fecha actual (inicio y fin del día en hora local de Colombia)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    // Verificar si ya existe un registro de asistencia hoy
    const asistenciaExistente = await prisma.asistencia.findFirst({
      where: {
        usuarioId: Number(userId),
        fecha: {
          gte: hoy,
          lt: mañana,
        },
      },
      include: {
        usuario: true,
      },
    });

    if (asistenciaExistente) {
      const horaRegistro = asistenciaExistente.fecha.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return NextResponse.json(
        { 
          error: `${usuario.nombre} ya registró asistencia hoy`,
          mensaje: `Registrado a las ${horaRegistro}`,
          usuario: usuario,
          asistencia: asistenciaExistente
        },
        { status: 409 }
      );
    }

    // Crear nueva asistencia
    const nuevaAsistencia = await prisma.asistencia.create({
      data: { 
        usuarioId: Number(userId),
        fecha: new Date()
      },
      include: {
        usuario: true,
      },
    });

    return NextResponse.json({
      message: "Asistencia registrada",
      id: nuevaAsistencia.id,
      usuario: nuevaAsistencia.usuario,
      fecha: nuevaAsistencia.fecha
    });

  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const asistencias = await prisma.asistencia.findMany({
      include: { usuario: true },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(asistencias);
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return NextResponse.json(
      { error: "Error al obtener asistencias" },
      { status: 500 }
    );
  }
}



