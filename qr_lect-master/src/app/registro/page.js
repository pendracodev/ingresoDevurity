"use client";
import { useState } from "react";

export default function RegistroPage() {
  const [qr, setQr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      nombre: form.get("nombre"),
      correo: form.get("correo"),
      password: form.get("password"),
    };

    const res = await fetch("/api/usuarios", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    setQr(json.qr);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registro de Usuario</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="nombre" placeholder="Nombre" className="border p-2" />
        <input name="correo" placeholder="Correo" className="border p-2" />
        <input type="password" name="password" placeholder="Contraseña" className="border p-2" />
        <button className="bg-blue-500 text-white p-2 rounded">Registrar</button>
      </form>

      {qr && (
        <div className="mt-4">
          <p>Tu código QR:</p>
          <img src={qr} alt="qr" />
        </div>
      )}
    </div>
  );
}
