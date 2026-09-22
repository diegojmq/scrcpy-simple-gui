// Puente seguro entre la interfaz (renderer) y el proceso principal.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  listDevices:      ()          => ipcRenderer.invoke('list-devices'),
  isConnected:      ()          => ipcRenderer.invoke('is-connected'),
  connectAuto:      ()          => ipcRenderer.invoke('connect-auto'),
  reconnect:        ()          => ipcRenderer.invoke('reconnect'),
  connectManual:    (addr)      => ipcRenderer.invoke('connect-manual', addr),
  pair:             (addr,code) => ipcRenderer.invoke('pair', addr, code),
  protect:          ()          => ipcRenderer.invoke('protect'),
  startScrcpy:      (args)      => ipcRenderer.invoke('start-scrcpy', args),
  chooseRecordFile: ()          => ipcRenderer.invoke('choose-record-file'),
  loadConfig:       ()          => ipcRenderer.invoke('load-config'),
  saveConfig:       (cfg)       => ipcRenderer.invoke('save-config', cfg),
  defaultRecordPath:()          => ipcRenderer.invoke('default-record-path'),
});
