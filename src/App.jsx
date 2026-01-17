import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  
  // Estado para controlar el modo oscuro
  // (true = oscuro, false = claro)
  const [darkMode, setDarkMode] = useState(false);

  async function enviarARust() {
    const resultado = await invoke("procesar_texto", { texto: inputText });
    setResponseText(resultado);
  }

  // Función para alternar el modo
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    // CONTENEDOR PRINCIPAL DEL TEMA
    // Si darkMode es true, añadimos la clase 'dark' al div padre.
    // Esto activa todas las clases 'dark:...' en los hijos.
    <div className={darkMode ? "dark" : ""}>
      
      {/* FONDO DE PANTALLA */}
      {/* min-h-screen: ocupa toda la altura */}
      {/* bg-white dark:bg-gray-900: Blanco en claro, gris muy oscuro en oscuro */}
      {/* text-gray-800 dark:text-gray-100: Texto oscuro en claro, texto claro en oscuro */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        
        {/* BOTÓN DE CAMBIO DE TEMA (Posicionado arriba a la derecha) */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>

        {/* TÍTULO */}
        {/* text-4xl: Texto muy grande */}
        {/* font-bold: Negrita */}
        {/* mb-10: Margen inferior grande */}
        <h1 className="text-4xl font-bold mb-10 tracking-tight">
          🧪 Tauri-Lab
        </h1>
        
        {/* FILA DEL INPUT Y EL BOTÓN */}
        {/* flex gap-4: Pone los elementos en fila con espacio entre ellos */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <input
            id="greet-input"
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe algo..."
            // Clases del input: Bordes, redondeado, focus ring (anillo azul al clicar)
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            type="button" 
            onClick={enviarARust}
            // Clases del botón: Color azul, texto blanco, sombra, efecto hover
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform active:scale-95"
          >
            Enviar a Rust
          </button>
        </div>

        {/* SECCIÓN DE RESPUESTA */}
        <div className="mt-12 text-center h-24">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Respuesta del Backend:
          </h3>
          {/* Si hay respuesta, la mostramos con estilo, si no, mostramos un guion */}
          <p className="text-3xl font-extrabold text-blue-500 mt-2 break-all animate-pulse">
            {responseText || "..."}
          </p>
        </div>
        
        {/* FOOTER */}
        <p className="mt-16 text-sm text-gray-400 dark:text-gray-600">
          Si ves una ventana nativa o logs en la terminal, Tauri funciona.
        </p>
      </div>
    </div>
  );
}

export default App;