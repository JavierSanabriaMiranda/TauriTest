import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // --- FUNCIÓN PARA AZURE (NUEVA) ---
  async function enviarAAzure() {
    if (!inputText) return;
    
    setLoading(true);
    setResponseText("Enviando a Azure...");

    try {
      // SUSTITUYE esta URL por la que te dé Azure si cambiaste el nombre del App Service
      const API_URL = "https://terraform-docker-deploy-test-jsm.azurewebsites.net/api/messages";
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviamos el texto directamente (Spring Boot lo recibirá como @RequestBody String)
        body: JSON.stringify(inputText),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseText(`¡Guardado! ID en DB: ${data.id}`);
      } else {
        setResponseText(`Error: ${response.status} - No se pudo guardar`);
      }
    } catch (error) {
      setResponseText("Error de conexión. ¿Está el API online?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Tu función original de Rust
  async function enviarARust() {
    const resultado = await invoke("procesar_texto", { texto: inputText });
    setResponseText(`Rust dice: ${resultado}`);
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>

        <h1 className="text-4xl font-bold mb-10 tracking-tight">
          🧪 Tauri-to-Azure
        </h1>
        
        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            id="greet-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje para la DB..."
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={enviarAAzure}
              disabled={loading}
              className={`flex-1 px-6 py-3 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold rounded-lg shadow-md transition-all transform active:scale-95`}
            >
              {loading ? "Cocinando..." : "Guardar en Azure"}
            </button>

            <button 
              type="button" 
              onClick={enviarARust}
              className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all transform active:scale-95"
            >
              Local Rust
            </button>
          </div>
        </div>

        <div className="mt-12 text-center h-24">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Estado del Sistema:
          </h3>
          <p className={`text-2xl font-extrabold mt-2 break-all ${loading ? 'animate-pulse text-yellow-500' : 'text-blue-500'}`}>
            {responseText || "Esperando acción..."}
          </p>
        </div>
        
        <p className="mt-16 text-sm text-gray-400 dark:text-gray-600 text-center">
          Tauri enviará una petición HTTPS directa a tu App Service en North Europe.<br/>
          Asegúrate de tener CORS habilitado en el Backend.
        </p>
      </div>
    </div>
  );
}

export default App;