'use client'; // Necesario para error boundaries

import { useEffect } from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podrías enviar el error a un servicio de logs
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Hubo un problema al cargar el perfil
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        A veces la conexión es lenta. Por favor, intenta recargar.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  );
}