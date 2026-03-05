"use client";

import { useState } from "react";
import { injectMenuHacker } from "@/lib/actions";
import { Terminal, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ConsolaHackerPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInject = async () => {
    if (!jsonInput.trim()) return toast.error("El JSON está vacío");
    
    try {
      setIsLoading(true);
      // Validamos que sea un JSON bien escrito antes de enviarlo
      JSON.parse(jsonInput); 
      
      const res = await injectMenuHacker(jsonInput);
      toast.success(res.message);
      setJsonInput(""); // Limpiamos la consola tras el éxito
      
    } catch (error: any) {
      toast.error(error.message || "Error de sintaxis en el JSON");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-3xl bg-black rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Cabecera de la Consola */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <Terminal size={18} className="text-green-400" />
          <span className="text-gray-300 text-sm">LaChopin Eats // Inyector de Menús v1.0</span>
        </div>

        <div className="p-6">
          <p className="text-gray-400 mb-4 text-sm">
            Pega el JSON entregado por el equipo de marketing aquí. Asegúrate de que el email del dueño exista en la base de datos y tenga el rol de restaurante.
          </p>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-96 bg-gray-900 text-green-400 p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-sm resize-none"
            placeholder='{
  "emailDueño": "ejemplo@gmail.com",
  "platos": [ ... ]
}'
          />

          <button
            onClick={handleInject}
            disabled={isLoading}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Zap />}
            {isLoading ? "Inyectando en Base de Datos..." : "EJECUTAR INYECCIÓN"}
          </button>
        </div>
      </div>
    </div>
  );
}