// ============================================================
//  Compartir Pantalla - proceso principal (Electron)
//  Maneja adb/scrcpy y expone acciones al frontend por IPC.
// ============================================================
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile, spawn } = require('child_process');

// --- Localizar la carpeta de scrcpy (adb.exe + scrcpy.exe) ---
function findScrcpyDir() {
  const candidates = [
    path.join(process.resourcesPath || '', 'scrcpy'), // empaquetado (extraResources)
    path.join(__dirname, 'scrcpy'),                    // ./scrcpy dentro del proyecto
    path.join(__dirname, '..', 'scrcpy'),              // ../scrcpy (carpeta hermana)
  ];
  for (const c of candidates) {
    try { if (c && fs.existsSync(path.join(c, 'scrcpy.exe'))) return c; } catch (e) {}
  }
  return candidates[candidates.length - 1];
}
const SCRCPY_DIR = findScrcpyDir();
const ADB = path.join(SCRCPY_DIR, 'adb.exe');
const SCRCPY = path.join(SCRCPY_DIR, 'scrcpy.exe');

// Config en carpeta persistente del usuario (funciona tambien en el portable).
let USER_DIR;
try { USER_DIR = app.getPath('userData'); } catch (e) { USER_DIR = SCRCPY_DIR; }
try { if (!fs.existsSync(USER_DIR)) fs.mkdirSync(USER_DIR, { recursive: true }); } catch (e) {}
const DEV_FILE = path.join(USER_DIR, 'dispositivo.txt');
const CFG_FILE = path.join(USER_DIR, 'config.json');

// Entorno con mDNS de adb desactivado (evita el conflicto de doble transporte).
const ADB_ENV = Object.assign({}, process.env, { ADB_MDNS: '0' });

// --- Utilidades adb ---
function adb(args, timeout = 15000) {
  return new Promise((resolve) => {
    execFile(ADB, args, { env: ADB_ENV, timeout, windowsHide: true }, (err, stdout, stderr) => {
      resolve({ ok: !err, out: ((stdout || '') + (stderr || '')).trim() });
    });
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Devuelve el serial del telefono conectado (prefiere WiFi) o null; revive "offline".
async function getConnectedDevice() {
  let r = await adb(['devices']);
  for (const line of r.out.split(/\r?\n/)) {
    const m = line.match(/^(\S+)\s+offline$/);
    if (m && !m[1].includes('_adb-tls')) { await adb(['disconnect', m[1]]); await adb(['connect', m[1]]); }
  }
  r = await adb(['devices']);
  let fallback = null;
  for (const line of r.out.split(/\r?\n/)) {
    const m = line.match(/^(\S+)\s+device$/);
    if (m && !m[1].includes('_adb-tls')) {
      if (/:\d+$/.test(m[1])) return m[1];
      if (!fallback) fallback = m[1];
    }
  }
  return fallback;
}

async function listDevices() {
  const r = await adb(['devices']);
  const out = [];
  for (const line of r.out.split(/\r?\n/)) {
    const m = line.match(/^(\S+)\s+device$/);
    if (m && !m[1].includes('_adb-tls')) out.push(m[1]);
  }
  return out;
}

// Conecta a una direccion y la estabiliza en el puerto fijo 5555.
async function connectStable(addr) {
  await adb(['connect', addr]);
  await sleep(500);
  let dev = await getConnectedDevice();
  if (!dev) return null;
  if (!/:5555$/.test(dev)) {
    await adb(['-s', dev, 'tcpip', '5555']);
    await sleep(2000);
    const ip = addr.split(':')[0];
    await adb(['connect', `${ip}:5555`]);
    await sleep(600);
    const d2 = await getConnectedDevice();
    if (d2) dev = d2;
  }
  if (/:\d+$/.test(dev)) { try { fs.writeFileSync(DEV_FILE, dev, 'utf8'); } catch (e) {} }
  return dev;
}

function readDeviceFile() {
  try { return fs.readFileSync(DEV_FILE, 'utf8').trim(); } catch (e) { return ''; }
}

// --- Ventana ---
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 640,
    height: 760,
    resizable: true,
    minWidth: 560,
    minHeight: 680,
    backgroundColor: '#1e1f22',
    autoHideMenuBar: true,
    title: 'Compartir Pantalla',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// ============================================================
//  IPC (acciones que pide el frontend)
// ============================================================
ipcMain.handle('list-devices', async () => await listDevices());

ipcMain.handle('is-connected', async () => {
  const r = await adb(['devices']);
  for (const line of r.out.split(/\r?\n/)) {
    const m = line.match(/^(\S+)\s+device$/);
    if (m && !m[1].includes('_adb-tls')) return m[1];
  }
  return null;
});

ipcMain.handle('connect-auto', async () => {
  const saved = readDeviceFile();
  if (/:\d+/.test(saved)) {
    await adb(['connect', saved]); await sleep(500);
    const d = await getConnectedDevice();
    if (d) return { ok: true, dev: d };
  }
  // Fallback mDNS puntual
  const svc = await adb(['mdns', 'services']);
  for (const line of svc.out.split(/\r?\n/)) {
    const m = line.match(/_adb-tls-connect\._tcp\s+(\S+:\d+)/);
    if (m) { const d = await connectStable(m[1]); if (d) return { ok: true, dev: d }; }
  }
  return { ok: false };
});

ipcMain.handle('reconnect', async () => {
  const saved = readDeviceFile();
  if (/:\d+/.test(saved)) await adb(['connect', saved]);
  await sleep(400);
  return await getConnectedDevice();
});

ipcMain.handle('connect-manual', async (e, addr) => {
  if (!/:\d+/.test(addr)) return { ok: false, msg: 'Escribe IP:puerto' };
  const d = await connectStable(addr);
  return d ? { ok: true, dev: d } : { ok: false, msg: 'No conecto. Verifica o vincula primero.' };
});

ipcMain.handle('pair', async (e, addr, code) => {
  if (!/:\d+/.test(addr) || !/^\d{6}$/.test(code)) return { ok: false, msg: 'IP:puerto + codigo de 6 digitos.' };
  const r = await adb(['pair', addr, code]);
  return /Successfully paired/.test(r.out)
    ? { ok: true }
    : { ok: false, msg: 'Fallo (codigo caducado?). Reintenta con datos frescos.' };
});

ipcMain.handle('protect', async () => {
  const dev = await getConnectedDevice();
  if (dev) await adb(['-s', dev, 'usb']);
  await adb(['disconnect']);
  return true;
});

ipcMain.handle('start-scrcpy', async (e, args) => {
  try {
    // Lanzar scrcpy SIN consola usando su lanzador oficial (scrcpy-noconsole.vbs)
    // ejecutado por wscript (que no tiene ventana de consola). Asi no aparecen CMDs.
    const vbs = path.join(SCRCPY_DIR, 'scrcpy-noconsole.vbs');
    if (fs.existsSync(vbs)) {
      const p = spawn('wscript.exe', [vbs, ...args], { cwd: SCRCPY_DIR, env: ADB_ENV, detached: true, stdio: 'ignore', windowsHide: true });
      p.unref();
    } else {
      const p = spawn(SCRCPY, args, { cwd: SCRCPY_DIR, env: ADB_ENV, detached: true, stdio: 'ignore', windowsHide: true });
      p.unref();
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: err.message };
  }
});

ipcMain.handle('choose-record-file', async () => {
  const r = await dialog.showSaveDialog(win, {
    title: 'Guardar grabacion',
    defaultPath: path.join(app.getPath('videos'), 'grabacion.mp4'),
    filters: [{ name: 'Video MP4', extensions: ['mp4'] }, { name: 'Video MKV', extensions: ['mkv'] }],
  });
  return r.canceled ? null : r.filePath;
});

ipcMain.handle('load-config', async () => {
  try { return JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')); } catch (e) { return {}; }
});
ipcMain.handle('save-config', async (e, cfg) => {
  try { fs.writeFileSync(CFG_FILE, JSON.stringify(cfg, null, 2), 'utf8'); } catch (e) {}
  return true;
});
ipcMain.handle('default-record-path', async () => path.join(app.getPath('videos'), 'grabacion.mp4'));
