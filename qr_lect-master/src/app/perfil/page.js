"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function PerfilPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const storedData = localStorage.getItem('userData');
    
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);
    } else {
      // Si no hay datos, redirigir al login
      window.location.href = "/login";
    }
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    window.location.href = "/login";
  };

  const handleDownloadQR = () => {
    if (userData?.qr) {
      const link = document.createElement('a');
      link.href = userData.qr;
      link.download = `qr-${userData.usuario.nombre.replace(/\s+/g, '-')}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <ProtectedRoute requiredRole="USER">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  Mi Perfil
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Semillero Devurity - USCO
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all text-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información del Usuario */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Información Personal
                </h2>
                <p className="text-sm text-slate-500">Datos de tu cuenta</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Nombre Completo
                </label>
                <p className="text-slate-800 font-medium mt-1">
                  {userData.usuario.nombre}
                </p>
              </div>

              <div className="border-b border-slate-200 pb-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Correo Institucional
                </label>
                <p className="text-slate-800 font-medium mt-1">
                  {userData.usuario.correo}
                </p>
              </div>

              <div className="border-b border-slate-200 pb-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Rol
                </label>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {userData.usuario.role === "ADMIN" ? "Administrador" : "Usuario"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  ID de Usuario
                </label>
                <p className="text-slate-800 font-medium mt-1">
                  #{userData.usuario.id}
                </p>
              </div>
            </div>
          </div>

          {/* Código QR */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Código QR
                </h2>
                <p className="text-sm text-slate-500">Tu identificación de acceso</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border-2 border-slate-200">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img 
                    src={userData.qr} 
                    alt="Código QR" 
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-800">
                      Presenta este código QR para registrar tu asistencia a las sesiones del semillero.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3 rounded-md font-medium hover:from-slate-800 hover:to-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar QR
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Instrucciones de Uso
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">Guarda tu QR</h4>
                <p className="text-xs text-slate-600">
                  Descarga o toma captura de pantalla de tu código QR.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">Asiste a las sesiones</h4>
                <p className="text-xs text-slate-600">
                  Llega puntual a las reuniones del semillero.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">Registra tu asistencia</h4>
                <p className="text-xs text-slate-600">
                  Presenta tu QR al coordinador para el registro.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Semillero Devurity - Universidad Surcolombiana © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}