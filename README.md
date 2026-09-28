# Compartir Pantalla — a friendly GUI for scrcpy

A modern, lightweight desktop app (Electron) to mirror your **Android phone
screen + audio to your PC over WiFi (or USB)**, powered by
[scrcpy](https://github.com/Genymobile/scrcpy). Built for people who want
scrcpy's power without the command line.

> 🇪🇸 Interfaz gráfica moderna para transmitir la pantalla y el audio de tu
> teléfono Android a la PC por WiFi (o USB), usando scrcpy por debajo.

Bilingual UI (English / Spanish) · dark theme · one‑click connect.

## ⬇️ Download / Descargar

**[⬇️ Download from Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest)** → get **`CompartirPantalla-<version>.zip`**, extract it, and run **`Compartir Pantalla.exe`** (just like scrcpy). No install, scrcpy is included.

> 🇪🇸 **[⬇️ Descarga desde Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest)** → baja **`CompartirPantalla-<versión>.zip`**, descomprímelo y ejecuta **`Compartir Pantalla.exe`** (igual que scrcpy). Sin instalar nada.
>
> ❗ Do **not** use the green *Code → Download ZIP* button — that's source code (for developers).

## 🛡️ Is it safe? Why does Windows/antivirus warn? / ¿Es seguro? ¿Por qué avisa Windows/el antivirus?

**English** — Yes, it's safe. This app is **open source**, but it is **not
code‑signed** (a signing certificate costs money). Because of that, when you open it:

- **Windows SmartScreen** may show *"Windows protected your PC — unknown publisher"*.
  → Click **More info → Run anyway**.
- Some **antivirus** engines may flag it as *potentially unwanted (PUA)*. This is a
  **false positive**, mostly because the app bundles Google's `adb.exe` (a
  legitimate Android tool). Allow it / add an exception if needed.

This is **exactly what happens with scrcpy itself** and most unsigned open‑source
apps — it is **not malware**. To be sure, you can:
- Read all the source code in this repo.
- Verify your download with the **SHA‑256** shown on the [Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest) page.
- Scan the file on [VirusTotal](https://www.virustotal.com/).

The warning only disappears completely with a **paid code‑signing certificate** or
by publishing through the **Microsoft Store**.

**Español** — Sí, es seguro. La app es de **código abierto**, pero **no está firmada
digitalmente** (el certificado cuesta dinero). Por eso, al abrirla:

- **Windows SmartScreen** puede decir *"Windows protegió tu PC — editor desconocido"*.
  → Pulsa **Más información → Ejecutar de todas formas**.
- Algún **antivirus** puede marcarla como *no deseada (PUA)*. Es un **falso
  positivo**, sobre todo porque incluye `adb.exe` de Google (herramienta legítima de
  Android). Permítela / agrega una excepción si hace falta.

Es **justo lo que pasa con el propio scrcpy** y casi todas las apps open‑source sin
firmar — **no es un virus**. Para estar seguro puedes:
- Leer todo el código en este repositorio.
- Verificar la descarga con el **SHA‑256** que aparece en [Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest).
- Analizar el archivo en [VirusTotal](https://www.virustotal.com/).

El aviso solo desaparece del todo con un **certificado de firma** (pago) o la
**Microsoft Store**.

---

## ✨ Features

- 📶 **Wireless** connection (Android 11+ pairing) with a **fixed reusable port** so you don't chase the changing debug port.
- 🔌 **USB** too — just plug in and click *Refresh*.
- 🔊 **Audio forwarding** (game audio via scrcpy's `output` source).
- 🎬 Full options: codec (H.264/H.265/AV1), resolution, FPS, bitrate, orientation.
- 🎮 Control options, window options, and **recording** to `.mp4` / `.mkv`.
- 🔁 Live status indicator + auto‑reconnect.
- 🌐 **English / Spanish** toggle.
- 🚫 No console windows (uses scrcpy's official no‑console launcher).

## 📸 Screenshots

_Add a screenshot here (e.g. `docs/screenshot.png`)._

---

## 🚀 Run from source — FOR DEVELOPERS ONLY / SOLO PARA DESARROLLADORES

> 🇬🇧 **Normal users: skip this section.** You do **not** need Node, `npm`, or any of
> these commands. Just download the app from
> [Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest),
> extract the `.zip`, and run `Compartir Pantalla.exe`.
>
> 🇪🇸 **Usuarios normales: sáltense esta sección.** **No** necesitan Node, `npm`, ni
> estos comandos. Solo descarguen la app desde
> [Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest),
> descompriman el `.zip` y ejecuten `Compartir Pantalla.exe`.

The steps below (`npm ci`, `npm start`, `npm run dist`) are only if you want to
**modify or build the app yourself**. Requires **Node.js 22 LTS or newer**.

```bash
git clone https://github.com/diegojmq/scrcpy-simple-gui.git
cd scrcpy-simple-gui
npm ci        # strict, integrity-verified install (preferred over npm install)
```

> 🔒 See [SECURITY.md](SECURITY.md) for how this project protects against npm
> supply-chain attacks (exact pinned versions, committed lockfile, `npm ci`,
> 0 known vulnerabilities, minimal dependencies).

Then get **scrcpy** (which includes `adb.exe`) and put its contents in a
`scrcpy/` folder inside the project:

```
<repo>/
  scrcpy/           <- scrcpy.exe, adb.exe, *.dll, scrcpy-server, scrcpy-noconsole.vbs, ...
  main.js
  renderer/
  ...
```

Download scrcpy from: https://github.com/Genymobile/scrcpy/releases (Windows build).

Start the app:

```bash
npm start
```

## 📦 Build a portable .exe

```bash
npm run dist
```

Output: `dist/CompartirPantalla-portable.exe` (bundles Electron + scrcpy).

> ⚠️ The built `.exe` is **not code‑signed**, so Windows SmartScreen may warn
> ("More info → Run anyway"). Some antivirus engines may flag it as a false
> positive, partly because it bundles `adb.exe`. For public distribution,
> consider a code‑signing certificate.

---

## 🙏 Credits

This app is only a UI. All the real work is done by **scrcpy** (Apache‑2.0) by
Genymobile / Romain Vimont, and **adb** by Google. See [CREDITS.md](CREDITS.md).

## 📄 License

MIT — see [LICENSE](LICENSE). scrcpy and adb keep their own licenses and are not
part of this repository.

---

## 🇪🇸 Guía rápida

### Para USAR la app (usuarios) — sin instalar nada
1. Descarga el **`.zip`** desde [Releases](https://github.com/diegojmq/scrcpy-simple-gui/releases/latest).
2. Descomprímelo y ejecuta **`Compartir Pantalla.exe`**.
3. En el teléfono: activa **Opciones de desarrollador** + **Depuración inalámbrica**,
   **vincula** una vez con el código, y luego **Conectar (automático)** → **Iniciar transmisión**.

### Para COMPILAR desde el código (desarrolladores)
1. `npm ci`  (instala dependencias de forma segura; preferido sobre `npm install`)
2. Descarga **scrcpy** y pon su contenido en una carpeta `scrcpy/` dentro del proyecto.
3. `npm start` para ejecutar, o `npm run dist` para generar el `.zip` / `.exe`.
