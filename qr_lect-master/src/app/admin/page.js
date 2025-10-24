"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function AdminPage() {
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    });
    
    scanner.render(async (decodedText) => {
      setScanning(false);
      setError("");
      setSuccess("");
      
      try {
        const res = await fetch("/api/asistencia", {
          method: "POST",
          body: JSON.stringify({ userId: decodedText }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          setSuccess("¡Asistencia registrada exitosamente!");
          setLastScanned({
            id: data.id || decodedText,
            usuario: data.usuario?.nombre || "Usuario",
            correo: data.usuario?.correo || "",
            fecha: new Date().toLocaleString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
          
          scanner.clear();
          setTimeout(() => {
            setScanning(true);
            setSuccess("");
            setLastScanned(null);
            window.location.reload();
          }, 3000);
        } else {
          setError(data.error || "Error al registrar asistencia");
          scanner.clear();
          setTimeout(() => {
            setScanning(true);
            setError("");
            window.location.reload();
          }, 3000);
        }
      } catch (err) {
        setError("Error de conexión. Intente nuevamente.");
        scanner.clear();
        setTimeout(() => {
          setScanning(true);
          setError("");
          window.location.reload();
        }, 3000);
      }
    }, (errorMessage) => {
      // Error silencioso mientras busca QR
    });

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <ProtectedRoute requiredRole="ADMIN">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header con botón de regreso */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/asistencias"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:shadow-md text-slate-700 hover:text-slate-900 transition-all group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver a la tabla</span>
          </a>

          <div className="flex items-center text-slate-600">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Modo Administrador</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6">
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Escanear Código QR
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Valida la asistencia de los miembros del semillero
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Alerta de éxito */}
            {success && lastScanned && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">
                      {success}
                    </h3>
                    <div className="bg-white rounded-md p-4 border border-green-100">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-slate-600">Nombre:</span>
                          <span className="text-sm font-semibold text-slate-900 ml-2">{lastScanned.usuario}</span>
                        </div>
                        {lastScanned.correo && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-slate-600">Correo:</span>
                            <span className="text-sm text-slate-700 ml-2">{lastScanned.correo}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-slate-600">Hora:</span>
                          <span className="text-sm text-slate-700 ml-2">{lastScanned.fecha}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-3 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Escaneando automáticamente en 3 segundos...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Alerta de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-800">{error}</h3>
                    <p className="text-xs text-red-700 mt-2">
                      Reintentando automáticamente en 3 segundos...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instrucciones */}
            {scanning && !success && !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800 font-medium">
                      Coloca el código QR frente a la cámara
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      El escaneo y registro se realizarán automáticamente
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenedor del escáner */}
            <div className="relative">
              <div 
                id="reader" 
                className="rounded-lg overflow-hidden border-2 border-slate-200"
              ></div>
            </div>

            {/* Estado del escáner */}
            <div className="mt-6 text-center">
              {scanning && !success && !error ? (
                <div className="flex items-center justify-center text-slate-600">
                  <div className="animate-pulse flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 absolute"></div>
                    <span className="text-sm font-medium ml-3">Escáner activo - Buscando código QR...</span>
                  </div>
                </div>
              ) : success || error ? (
                <div className="flex items-center justify-center text-slate-600">
                  <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-slate-700 rounded-full mr-2"></div>
                  <span className="text-sm">Preparando siguiente escaneo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-slate-600">
                  <div className="h-2 w-2 bg-slate-400 rounded-full mr-2"></div>
                  <span className="text-sm">Procesando...</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Semillero Devurity - Universidad Surcolombiana
            </p>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}