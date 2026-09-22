// ============================================================
//  Interfaz (renderer) - logica + idiomas (ES/EN)
// ============================================================
const $ = (id) => document.getElementById(id);
const toast = $('toast');
const overlay = $('overlay'), overlayText = $('overlayText');

let LANG = 'es';
const t = (k, arg) => { const v = translations[LANG][k]; return typeof v === 'function' ? v(arg) : v; };

let lastConnected = false;
let connOpen = false;
let optOpen = false;

function setToast(msg, kind) { toast.textContent = msg; toast.className = 'toast' + (kind ? ' ' + kind : ''); }
function showOverlay(txt) { overlayText.textContent = txt; overlay.classList.remove('hidden'); }
function hideOverlay() { overlay.classList.add('hidden'); }

// --- Idioma ---
function applyLang(lang) {
  LANG = lang;
  const d = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => { const k = el.getAttribute('data-i18n'); if (d[k] !== undefined) el.textContent = d[k]; });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { const k = el.getAttribute('data-i18n-ph'); if (d[k] !== undefined) el.placeholder = d[k]; });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { const k = el.getAttribute('data-i18n-title'); if (d[k] !== undefined) el.title = d[k]; });
  document.documentElement.lang = lang;
  // botones de idioma
  document.querySelectorAll('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
  // dinamicos
  setStatus(lastConnected);
  $('connToggle').textContent = connOpen ? t('connHide') : t('connShow');
  const devSel = $('devices');
  if (devSel.options.length === 1 && devSel.options[0].value === '') devSel.options[0].textContent = t('devNone');
  saveConfig();
}
document.querySelectorAll('.lang button').forEach((b) => { b.onclick = () => applyLang(b.dataset.lang); });

// --- Pestanas ---
document.querySelectorAll('.tab').forEach((tb) => {
  tb.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((x) => x.classList.remove('active'));
    tb.classList.add('active');
    document.querySelector(`.panel[data-panel="${tb.dataset.tab}"]`).classList.add('active');
  });
});

// --- Plegables ---
$('connToggle').onclick = () => {
  connOpen = !connOpen;
  const m = $('connMore');
  m.classList.toggle('expanded', connOpen);
  m.classList.toggle('collapsed', !connOpen);
  $('connToggle').textContent = connOpen ? t('connHide') : t('connShow');
};
$('optToggle').onclick = () => {
  optOpen = !optOpen;
  const b = $('optBody');
  b.classList.toggle('opts-expanded', optOpen);
  b.classList.toggle('opts-collapsed', !optOpen);
  $('optArrow').textContent = optOpen ? '▾' : '▸';
};

// --- Estado ---
function setStatus(connected) {
  lastConnected = connected;
  const pill = $('status');
  pill.className = 'pill ' + (connected ? 'pill-on' : 'pill-off');
  $('statusText').textContent = connected ? t('connected') : t('disconnected');
}

async function refreshDevices() {
  const list = await window.api.listDevices();
  const sel = $('devices');
  const prev = sel.value;
  sel.innerHTML = '';
  if (list.length === 0) {
    const o = document.createElement('option'); o.textContent = t('devNone'); o.value = ''; sel.appendChild(o);
    setStatus(false);
  } else {
    for (const dv of list) { const o = document.createElement('option'); o.value = dv; o.textContent = dv; sel.appendChild(o); }
    const wifi = list.find((dv) => /:\d+$/.test(dv));
    sel.value = wifi || (list.includes(prev) ? prev : list[0]);
    setStatus(true);
  }
}

async function getDevice() {
  const sel = $('devices').value;
  if (sel) return sel;
  return await window.api.isConnected();
}

// --- Botones de conexion ---
$('btnRefresh').onclick = () => refreshDevices();

$('btnAuto').onclick = async () => {
  showOverlay(t('ovConnecting'));
  const r = await window.api.connectAuto();
  await refreshDevices();
  hideOverlay();
  setToast(r.ok ? t('tConnectedTo', r.dev) : t('tNotConnected'), r.ok ? 'ok' : 'err');
};

$('btnManual').onclick = async () => {
  showOverlay(t('ovConfiguring'));
  const r = await window.api.connectManual($('manAddr').value.trim());
  await refreshDevices();
  hideOverlay();
  setToast(r.ok ? t('tStabilized', r.dev) : t('tManFail'), r.ok ? 'ok' : 'err');
};

$('btnPair').onclick = async () => {
  const r = await window.api.pair($('pairAddr').value.trim(), $('pairCode').value.trim());
  setToast(r.ok ? t('tPairOk') : (r.msg === 'IP:puerto + codigo de 6 digitos.' ? t('tPairBad') : t('tPairFail')), r.ok ? 'ok' : 'err');
};

$('btnSec').onclick = async () => {
  await window.api.protect();
  await refreshDevices();
  setToast(t('tProtect'), 'warn');
};

$('btnBrowse').onclick = async () => { const f = await window.api.chooseRecordFile(); if (f) $('recFile').value = f; };

// --- Argumentos de scrcpy ---
function buildArgs(dev) {
  const a = ['-s', dev];
  if (!$('noVideo').checked) {
    const codec = $('codec').value; if (codec !== 'h264') a.push(`--video-codec=${codec}`);
    const res = $('res').value; if (res !== 'Nativa' && /^\d+$/.test(res)) a.push(`--max-size=${res}`);
    const fps = $('fps').value.trim(); if (/^\d+$/.test(fps)) a.push(`--max-fps=${fps}`);
    const br = $('bitrate').value.trim(); if (parseFloat(br)) a.push(`--video-bit-rate=${br}M`);
    const or = $('orient').value; if (or !== 'Automática') a.push(`--orientation=${or}`);
  } else { a.push('--no-video'); }
  if (!$('audio').checked) { a.push('--no-audio'); }
  else {
    a.push(`--audio-source=${$('audioSrc').value}`);
    a.push(`--audio-codec=${$('audioCodec').value}`);
    const ab = $('audioBr').value.trim(); if (/^\d+$/.test(ab)) a.push(`--audio-bit-rate=${ab}K`);
  }
  if ($('noControl').checked) a.push('--no-control');
  if ($('screenOff').checked) a.push('--turn-screen-off');
  if ($('awake').checked) a.push('--stay-awake');
  if ($('touches').checked) a.push('--show-touches');
  if ($('powerOff').checked) a.push('--power-off-on-close');
  if ($('fullscreen').checked) a.push('--fullscreen');
  if ($('alwaysTop').checked) a.push('--always-on-top');
  if ($('borderless').checked) a.push('--window-borderless');
  if ($('noScreensaver').checked) a.push('--disable-screensaver');
  const wt = $('winTitle').value.trim(); if (wt) a.push(`--window-title=${wt}`);
  if ($('record').checked && $('recFile').value.trim()) a.push(`--record=${$('recFile').value.trim()}`);
  return a;
}

$('btnStart').onclick = async () => {
  const dev = await getDevice();
  if (!dev) { setToast(t('tNoDevice'), 'err'); return; }
  const args = buildArgs(dev);
  saveConfig();
  showOverlay(t('ovStarting'));
  const r = await window.api.startScrcpy(args);
  setToast(r.ok ? t('tStarted') : t('tStartErr', r.msg), r.ok ? 'ok' : 'err');
  if (r.ok) setTimeout(hideOverlay, 2600); else hideOverlay();
};

// --- Config (recordar ajustes + idioma) ---
const FIELDS = ['codec','res','fps','bitrate','orient','audioSrc','audioCodec','audioBr','winTitle','recFile'];
const CHECKS = ['noVideo','audio','noControl','screenOff','awake','touches','powerOff','fullscreen','alwaysTop','borderless','noScreensaver','record','autoReconnect'];
function saveConfig() {
  const cfg = { lang: LANG };
  FIELDS.forEach((f) => cfg[f] = $(f).value);
  CHECKS.forEach((c) => cfg[c] = $(c).checked);
  window.api.saveConfig(cfg);
}
async function loadConfig() {
  const cfg = await window.api.loadConfig();
  FIELDS.forEach((f) => { if (cfg[f] !== undefined) $(f).value = cfg[f]; });
  CHECKS.forEach((c) => { if (cfg[c] !== undefined) $(c).checked = cfg[c]; });
  if (!$('recFile').value) $('recFile').value = await window.api.defaultRecordPath();
  return cfg.lang || 'es';
}

// --- Sondeo de estado ---
async function poll() {
  const dev = await window.api.isConnected();
  setStatus(!!dev);
  if (!dev && $('autoReconnect').checked) window.api.reconnect();
}

// --- Inicio ---
(async function init() {
  const lang = await loadConfig();
  applyLang(lang);
  await refreshDevices();
  await poll();
  setInterval(poll, 5000);
})();
