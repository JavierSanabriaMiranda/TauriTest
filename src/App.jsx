// src/App.jsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Import vital para hablar con Rust
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");

  // Esta función llama al backend
  async function enviarARust() {
    // 'procesar_texto' debe coincidir con el nombre de la función en main.rs
    // El objeto { texto: inputText } son los argumentos que pide la función Rust
    const resultado = await invoke("procesar_texto", { texto: inputText });
    
    setResponseText(resultado);
  }

  return (
    <div className="container" style={{ padding: "20px", textAlign: "center" }}>
      <h1>🧪 Tauri-Lab</h1>
      
      <div className="row">
        <input
          id="greet-input"
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe algo..."
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
        />
        <button 
          type="button" 
          onClick={enviarARust}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Enviar a Rust
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Respuesta del Backend:</h3>
        <p style={{ color: "#61dafb", fontSize: "20px", fontWeight: "bold" }}>
          {responseText}
        </p>
      </div>
      
      <p style={{marginTop: "50px", fontSize: "12px", color: "#888"}}>
        Si ves una ventana emergente nativa, Tauri está funcionando.
      </p>
    </div>
  );
}

export default App;