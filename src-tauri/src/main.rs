// src-tauri/src/main.rs

// 1. Definimos el comando
#[tauri::command]
fn procesar_texto(texto: String) -> String {
    // Imprimimos en TU terminal (donde corriste npm run tauri dev)
    println!("Mensaje recibido desde React: {}", texto);

    // Lógica de Rust: Invertir texto y poner en mayúsculas
    let respuesta = format!("Rust dice: {}", texto.to_uppercase().chars().rev().collect::<String>());

    return respuesta;
}

fn main() {
    tauri::Builder::default()
        // 2. Registramos el comando
        .invoke_handler(tauri::generate_handler![procesar_texto])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}