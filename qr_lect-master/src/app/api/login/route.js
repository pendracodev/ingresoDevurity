import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const { correo, password } = await req.json();

    // Validar que los campos no estén vacíos
    if (!correo || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar el usuario por correo y password
    // ⬇️ IMPORTANTE: Agregar select para incluir TODOS los campos necesarios
    const usuario = await prisma.usuario.findFirst({
      where: {
        correo: correo,
        password: password,
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        password: true,
        role: true,    // ⬅️ AGREGAR ESTO
        qr: true,      // ⬅️ AGREGAR ESTO
      }
    });

    // Si no existe el usuario
    if (!usuario) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Si el usuario no tiene QR, generarlo
    let qrImage = usuario.qr;
    if (!qrImage) {
      const QRCode = require("qrcode");
      qrImage = await QRCode.toDataURL(usuario.id.toString());
      
      // Actualizar el usuario con el QR
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { qr: qrImage }
      });
    }

    console.log("Usuario encontrado:", {
      id: usuario.id,
      nombre: usuario.nombre,
      role: usuario.role,
      tieneQR: !!qrImage
    });

    // Si existe, devolver el QR y los datos del usuario
    return NextResponse.json({
      qr: qrImage,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role, // Ahora sí debería estar presente
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );
  }
}