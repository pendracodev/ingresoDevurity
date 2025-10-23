"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminPage() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(async (decodedText) => {
      await fetch("/api/asistencia", {
        method: "POST",
        body: JSON.stringify({ userId: decodedText }),
        headers: { "Content-Type": "application/json" },
      });
      alert("Asistencia registrada para usuario: " + decodedText);
      scanner.clear();
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Escaneo de QR</h1>
      <div id="reader" className="mt-4"></div>
    </div>
  );
}
