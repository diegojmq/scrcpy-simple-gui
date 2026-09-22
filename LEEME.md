# Compartir Pantalla — App de escritorio (Electron)

Interfaz moderna para transmitir la pantalla del teléfono a la PC por WiFi (o USB),
con audio, usando scrcpy por debajo.

## Cómo abrirla
- Doble clic en **`Compartir-Pantalla.vbs`** (sin ventana de consola), o
- **`Compartir-Pantalla.bat`**.

La primera vez instala dependencias solo si faltan.

## Uso (3 pasos)
1. **Conectar (automático)** — uso diario, entra por el puerto fijo 5555.
2. **Configurar (fija el 5555)** — si no conecta (tras reiniciar o IP nueva): pega la
   “Dirección IP y puerto” del teléfono y pulsa este botón.
3. **Vincular** — solo la primera vez (o si se desvinculó), con el código de 6 dígitos.

Luego elige opciones en las pestañas (Video / Audio / Control / Ventana / Grabar) y
pulsa **Iniciar transmisión**.

## Requisitos
- La carpeta `scrcpy` (con `adb.exe` y `scrcpy.exe`) al lado de esta carpeta.
- En el teléfono: Opciones de desarrollador + **Depuración inalámbrica** activada.

## Notas
- Comparte los archivos `dispositivo.txt` y `config.json` con la carpeta `scrcpy`.
- Audio de juegos: usa fuente **“Interno (output)”**; si un juego lo bloquea, usa **Micrófono**.
