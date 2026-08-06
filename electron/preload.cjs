const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readDatabase: () => ipcRenderer.invoke('db-read'),
  writeDatabase: (data) => ipcRenderer.invoke('db-write', data),
  onLoginSuccess: () => ipcRenderer.invoke('window-login'),
  onLogout: () => ipcRenderer.invoke('window-logout'),
  printSilent: () => ipcRenderer.invoke('print-silent'),
  logMessage: (level, message) => ipcRenderer.invoke('log-message', level, message)
});
