const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readDatabase: () => ipcRenderer.invoke('db-read'),
  writeDatabase: (data) => ipcRenderer.invoke('db-write', data),
  onLoginSuccess: () => ipcRenderer.invoke('window-login'),
  onLogout: () => ipcRenderer.invoke('window-logout')
});
