import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const { nombre, correo, password } = await req.json();

    // Validaciones
    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (existente) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Crear el usuario sin QR primero
    const usuario = await prisma.usuario.create({
      data: { 
        nombre, 
        correo, 
        password 
      },
    });

    // Generar QR con el id del usuario
    const qrImage = await QRCode.toDataURL(usuario.id.toString());

    // Actualizar el usuario con el QR generado
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: { qr: qrImage }
    });

    // Retornar en el formato que espera el frontend
    return NextResponse.json({
      qr: usuarioActualizado.qr,
      usuario: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        role: usuarioActualizado.role,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}