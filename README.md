# Compartir Pantalla · a friendly GUI for scrcpy

Mirror your **Android screen + audio to your PC over WiFi (or USB)** — a modern,
lightweight desktop app (Electron) built on top of
[scrcpy](https://github.com/Genymobile/scrcpy). All of scrcpy's power, no command line.

Refleja la **pantalla y el audio de tu Android en la PC por WiFi (o USB)** — una app
de escritorio moderna y ligera (Electron) construida sobre scrcpy. Todo el poder de
scrcpy, sin línea de comandos.

**🌐 Read this in: [🇬🇧 English](#english) · [🇪🇸 Español](#español)**

---

<a name="english"></a>
# 🇬🇧 English

## ⬇️ Download & run

1. Go to **[Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest)**.
2. Download **`CompartirPantalla-<version>.zip`** (under *Assets*).
3. **Extract** it anywhere and run **`Compartir Pantalla.exe`** — just like scrcpy.

No installation, no Node.js, no separate scrcpy download — everything is bundled.

> ❗ Do **not** use the green **Code → Download ZIP** button. That is the *source
> code* (for developers) and will not run on its own.

There is also a single-file `CompartirPantalla-<version>.exe` (portable) if you
prefer one file instead of a folder.

## 🛡️ Is it safe? Why does Windows / antivirus warn?

**Yes, it is safe.** The app is **open source**, but it is **not code-signed**
(a signing certificate costs money). Because of that, the first time you open it:

- **Windows SmartScreen** may say *"Windows protected your PC — unknown publisher"*.
  → Click **More info → Run anyway**.
- Some **antivirus** may flag it as *potentially unwanted (PUA)*. This is a **false
  positive**, mainly because the app bundles Google's `adb.exe` (a legitimate Android
  tool). Allow it or add an exception if needed.

This is **exactly what happens with scrcpy itself** and most unsigned open-source
apps — it is **not malware**. To be sure you can:

- Read all the source code in this repository.
- Verify your download with the **SHA-256** shown on the Releases page.
- Scan the file on [VirusTotal](https://www.virustotal.com/).

The warning only disappears completely with a **paid code-signing certificate** or by
publishing through the **Microsoft Store**.

## ✅ Requirements

**On the PC (to use the app):** nothing to install — just **64-bit Windows 10/11**.
Electron, scrcpy and adb are all included in the download.

**On the phone (one-time setup, not an install):**
- Enable **Developer options** (tap *Build number* 7 times).
- For **WiFi**: **Android 11+** with **Wireless debugging** ON.
- For **USB**: any Android + a cable, with **USB debugging** ON.

## 🚀 How to use

1. Open the app.
2. **First time (WiFi):** on the phone open *Wireless debugging → Pair with code*,
   then in step **3** of the app paste the shown **IP:port + code** and click **Pair**.
   Then paste the phone's main **IP address & port** in step **2** and click
   **Configure (fix 5555)**.
3. **Every day:** just click **Connect (automatic)**.
4. **USB:** plug the cable and click **Refresh** — the phone appears in the list.
5. Choose options (video / audio / control / window / record) and click
   **Start streaming**.

Tip: audio source **"Internal (output)"** forwards game audio; if a game blocks it,
switch to **Microphone**.

## ✨ Features

- 📶 Wireless connection with a **fixed reusable port** (5555) + **auto-reconnect**.
- 🔌 USB support.
- 🔊 Audio forwarding, including game audio (`output` source).
- 🎬 Video: codec (H.264 / H.265 / AV1), resolution, FPS, bitrate, orientation.
- 🎮 Control & window options; **record** to `.mp4` / `.mkv`.
- 🌐 English / Spanish UI toggle.
- 🚫 No console windows · dark theme · live status indicator.

## 🧰 Troubleshooting

- **It won't connect after a reboot / new IP:** open *Connection options* → paste the
  phone's current *IP address & port* → **Configure (fix 5555)**.
- **Disconnects when I unlock the phone (Samsung):** turn off *Auto Blocker* and
  *"Block USB connections while locked"* in the phone's security settings.
- **No game audio:** some games block internal capture; use **Microphone** source.

## 👩‍💻 For developers (build from source)

> Normal users do **not** need this. Just use the download above.

Requires **Node.js 22 LTS or newer**.

```bash
git clone https://github.com/diegojmq/scrcpy-simple-gui.git
cd scrcpy-simple-gui
npm ci                     # strict, integrity-verified install (preferred over npm install)
```

Then download **scrcpy** (Windows build, it includes `adb.exe`) from
<https://github.com/Genymobile/scrcpy/releases> and put its contents in a `scrcpy/`
folder inside the project:

```
scrcpy-simple-gui/
  scrcpy/      <- scrcpy.exe, adb.exe, *.dll, scrcpy-server, scrcpy-noconsole.vbs, ...
  main.js
  renderer/
  ...
```

Run it, or build the distributables:

```bash
npm start                  # run from source
npm run dist               # build the .zip and portable .exe into dist/
```

See **[SECURITY.md](SECURITY.md)** for how this project protects against npm
supply-chain attacks (exact pinned versions, committed lockfile, `npm ci`,
0 known vulnerabilities, minimal dependencies).

## 🙏 Credits

This app is only a UI. All the real work is done by **scrcpy** (Apache-2.0) by
Genymobile / Romain Vimont, and **adb** by Google. See [CREDITS.md](CREDITS.md).

## 📄 License

MIT — see [LICENSE](LICENSE). scrcpy and adb keep their own licenses and are not part
of this repository.

---

<a name="español"></a>
# 🇪🇸 Español

## ⬇️ Descargar y usar

1. Entra a **[Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest)**.
2. Descarga **`CompartirPantalla-<versión>.zip`** (en *Assets*).
3. **Descomprímelo** donde quieras y ejecuta **`Compartir Pantalla.exe`** — igual que scrcpy.

Sin instalación, sin Node.js, sin descargar scrcpy aparte — todo va incluido.

> ❗ **No** uses el botón verde **Code → Download ZIP**. Eso es el *código fuente*
> (para desarrolladores) y no funciona por sí solo.

También hay un `CompartirPantalla-<versión>.exe` de un solo archivo (portable) si
prefieres un archivo en vez de una carpeta.

## 🛡️ ¿Es seguro? ¿Por qué avisa Windows / el antivirus?

**Sí, es seguro.** La app es de **código abierto**, pero **no está firmada
digitalmente** (el certificado cuesta dinero). Por eso, la primera vez que la abres:

- **Windows SmartScreen** puede decir *"Windows protegió tu PC — editor desconocido"*.
  → Pulsa **Más información → Ejecutar de todas formas**.
- Algún **antivirus** puede marcarla como *no deseada (PUA)*. Es un **falso positivo**,
  sobre todo porque incluye `adb.exe` de Google (herramienta legítima de Android).
  Permítela o agrega una excepción si hace falta.

Es **justo lo que pasa con el propio scrcpy** y casi todas las apps open-source sin
firmar — **no es un virus**. Para estar seguro puedes:

- Leer todo el código en este repositorio.
- Verificar la descarga con el **SHA-256** que aparece en el Release.
- Analizar el archivo en [VirusTotal](https://www.virustotal.com/).

El aviso solo desaparece del todo con un **certificado de firma** (pago) o
publicando en la **Microsoft Store**.

## ✅ Requisitos

**En la PC (para usar la app):** nada que instalar — solo **Windows 10/11 de 64 bits**.
Electron, scrcpy y adb ya vienen incluidos en la descarga.

**En el teléfono (configuración única, no es instalar):**
- Activa **Opciones de desarrollador** (toca *Número de compilación* 7 veces).
- Para **WiFi**: **Android 11+** con **Depuración inalámbrica** activada.
- Para **USB**: cualquier Android + un cable, con **Depuración USB** activada.

## 🚀 Cómo usar

1. Abre la app.
2. **Primera vez (WiFi):** en el teléfono entra a *Depuración inalámbrica → Vincular
   con código*, y en el paso **3** de la app pega la **IP:puerto + código**, pulsa
   **Vincular**. Luego pega la **Dirección IP y puerto** principal del teléfono en el
   paso **2** y pulsa **Configurar (fija el 5555)**.
3. **Cada día:** solo pulsa **Conectar (automático)**.
4. **USB:** conecta el cable y pulsa **Actualizar** — el teléfono aparece en la lista.
5. Elige opciones (video / audio / control / ventana / grabar) y pulsa
   **Iniciar transmisión**.

Consejo: la fuente de audio **"Interno (output)"** pasa el audio de juegos; si un
juego lo bloquea, cambia a **Micrófono**.

## ✨ Características

- 📶 Conexión inalámbrica con **puerto fijo reutilizable** (5555) + **reconexión automática**.
- 🔌 Soporte USB.
- 🔊 Audio incluido, también de juegos (fuente `output`).
- 🎬 Video: códec (H.264 / H.265 / AV1), resolución, FPS, bitrate, orientación.
- 🎮 Opciones de control y ventana; **grabar** a `.mp4` / `.mkv`.
- 🌐 Interfaz en inglés / español.
- 🚫 Sin ventanas de consola · tema oscuro · indicador de estado en vivo.

## 🧰 Solución de problemas

- **No conecta tras reiniciar / IP nueva:** abre *Opciones de conexión* → pega la
  *Dirección IP y puerto* actual del teléfono → **Configurar (fija el 5555)**.
- **Se desconecta al desbloquear el teléfono (Samsung):** apaga *Auto Blocker* y
  *"Bloquear conexiones USB cuando está bloqueado"* en los ajustes de seguridad.
- **Sin audio en un juego:** algunos juegos bloquean la captura interna; usa la fuente
  **Micrófono**.

## 👩‍💻 Para desarrolladores (compilar desde el código)

> Los usuarios normales **no** necesitan esto. Usa la descarga de arriba.

Requiere **Node.js 22 LTS o superior**.

```bash
git clone https://github.com/diegojmq/scrcpy-simple-gui.git
cd scrcpy-simple-gui
npm ci                     # instalación estricta y verificada (preferida sobre npm install)
```

Luego descarga **scrcpy** (build de Windows, incluye `adb.exe`) de
<https://github.com/Genymobile/scrcpy/releases> y pon su contenido en una carpeta
`scrcpy/` dentro del proyecto (misma estructura que arriba). Después:

```bash
npm start                  # ejecutar desde el código
npm run dist               # generar el .zip y el .exe portable en dist/
```

Consulta **[SECURITY.md](SECURITY.md)** sobre cómo el proyecto se protege de los
ataques de cadena de suministro de npm (versiones exactas, lockfile, `npm ci`,
0 vulnerabilidades, dependencias mínimas).

## 🙏 Créditos

Esta app es solo la interfaz. Todo el trabajo real lo hace **scrcpy** (Apache-2.0) de
Genymobile / Romain Vimont, y **adb** de Google. Ver [CREDITS.md](CREDITS.md).

## 📄 Licencia

MIT — ver [LICENSE](LICENSE). scrcpy y adb conservan sus propias licencias y no son
parte de este repositorio.
