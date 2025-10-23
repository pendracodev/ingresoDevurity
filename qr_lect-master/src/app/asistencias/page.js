"use client";
import { useEffect, useState } from "react";

export default function AsistenciasPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/asistencia")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Asistencias</h1>
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id}>
              <td className="border p-2">{a.id}</td>
              <td className="border p-2">{a.usuario.nombre}</td>
              <td className="border p-2">{new Date(a.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
