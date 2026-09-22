# Security / Seguridad

## 🇬🇧 English

This project takes supply‑chain security seriously, given recent npm attacks
where popular packages were compromised and infected machines during
`npm install`.

### How this project reduces that risk

| Measure | Why it helps |
|---|---|
| **Minimal dependencies** | Only **2 dev dependencies** (`electron`, `electron-builder`). No runtime npm dependencies at all. Smaller attack surface. |
| **Exact pinned versions** | `package.json` and `.npmrc` (`save-exact=true`) pin exact versions — no floating `^`/`~` that could pull a newly‑compromised patch. |
| **Committed lockfile** | `package-lock.json` pins the **entire** dependency tree with integrity hashes. |
| **Use `npm ci`** | Installs **strictly** from the lockfile and **verifies integrity hashes**. It never resolves or pulls anything new, which is the main protection against a maliciously‑republished version. |
| **`npm audit` = 0** | The project currently reports **0 known vulnerabilities**. |
| **Local‑only content** | The UI loads only local HTML (`renderer/`). It never loads remote/untrusted web pages, so Chromium/web vulnerabilities are not exploitable in normal use. |
| **`contextIsolation: true`, `nodeIntegration: false`** | The renderer cannot access Node directly; only a small, explicit API is exposed via `preload.js`. |

### For end users
End users of the packaged **`.exe` do NOT run `npm install`** — everything is
bundled. The npm dependencies only matter to developers building from source.

### Recommended way to install (developers)
```bash
npm ci        # strict, verified install from the lockfile (preferred)
npm audit     # should report 0 vulnerabilities
```
Avoid `npm install` for a plain build; prefer `npm ci`.

### Requirements
- Node.js 22 LTS or newer (needed for the current Electron toolchain).

### Reporting
Found a security issue? Please open a GitHub issue (or a private advisory).

---

## 🇪🇸 Español

Este proyecto se toma en serio la seguridad de la cadena de suministro, por los
ataques recientes en npm donde paquetes populares fueron comprometidos e
infectaron equipos al hacer `npm install`.

### Cómo se reduce ese riesgo

| Medida | Por qué ayuda |
|---|---|
| **Dependencias mínimas** | Solo **2 de desarrollo** (`electron`, `electron-builder`). Ninguna dependencia npm en tiempo de ejecución. Menos superficie de ataque. |
| **Versiones exactas fijadas** | `package.json` y `.npmrc` (`save-exact=true`) fijan versiones exactas — sin `^`/`~` que puedan traer un parche recién comprometido. |
| **Lockfile en el repo** | `package-lock.json` fija **todo** el árbol de dependencias con hashes de integridad. |
| **Usar `npm ci`** | Instala **estrictamente** desde el lockfile y **verifica los hashes**. Nunca resuelve ni descarga algo nuevo — es la protección principal contra una versión republicada maliciosamente. |
| **`npm audit` = 0** | El proyecto reporta **0 vulnerabilidades conocidas**. |
| **Solo contenido local** | La interfaz solo carga HTML local (`renderer/`). Nunca abre webs externas, así que las vulnerabilidades de Chromium/web no son explotables en uso normal. |
| **`contextIsolation` y sin `nodeIntegration`** | La interfaz no accede a Node directamente; solo una API pequeña y explícita vía `preload.js`. |

### Para usuarios finales
Quien use el **`.exe` NO ejecuta `npm install`** — todo va incluido. Las
dependencias npm solo importan a quien compila desde el código.

### Forma recomendada de instalar (desarrolladores)
```bash
npm ci        # instalación estricta y verificada desde el lockfile (preferida)
npm audit     # debe reportar 0 vulnerabilidades
```
Evita `npm install` para una compilación normal; prefiere `npm ci`.

### Requisitos
- Node.js 22 LTS o superior.
