# Compartir Pantalla — a friendly GUI for scrcpy

A modern, lightweight desktop app (Electron) to mirror your **Android phone
screen + audio to your PC over WiFi (or USB)**, powered by
[scrcpy](https://github.com/Genymobile/scrcpy). Built for people who want
scrcpy's power without the command line.

> 🇪🇸 Interfaz gráfica moderna para transmitir la pantalla y el audio de tu
> teléfono Android a la PC por WiFi (o USB), usando scrcpy por debajo.

Bilingual UI (English / Spanish) · dark theme · one‑click connect.

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

## 🚀 Run from source

Requires **Node.js 22 LTS or newer**.

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

## 🇪🇸 Guía rápida (español)

1. `npm ci`  (instala las dependencias de forma segura; se prefiere sobre `npm install`)
2. Descarga **scrcpy** y pon su contenido en una carpeta `scrcpy/` dentro del proyecto.
3. `npm start` para ejecutar, o `npm run dist` para generar el `.exe` portable.
4. En el teléfono: activa **Opciones de desarrollador** + **Depuración inalámbrica**,
   **vincula** una vez con el código, y luego **Conectar (automático)** → **Iniciar transmisión**.
