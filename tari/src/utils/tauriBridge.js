import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

// Helper to identify if the app is currently running inside the Tauri environment
export const isTauri = () => {
  return typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;
};

// Abstracted API bridge that adapts Electron-like actions to Tauri commands
export const tauriAPI = {
  readDatabase: async () => {
    try {
      return await invoke('db_read');
    } catch (err) {
      console.error('Tauri db_read command failed:', err);
      throw err;
    }
  },

  writeDatabase: async (data) => {
    try {
      const res = await invoke('db_write', { data });
      return { success: res };
    } catch (err) {
      console.error('Tauri db_write command failed:', err);
      return { success: false, error: err.message || err };
    }
  },

  logMessage: async (level, message) => {
    try {
      await invoke('log_message', { level, message });
      return { success: true };
    } catch (err) {
      console.error('Tauri log_message command failed:', err);
      return { success: false };
    }
  },

  printSilent: async () => {
    try {
      const res = await invoke('print_silent');
      return { success: res };
    } catch (err) {
      console.error('Tauri print_silent command failed:', err);
      return { success: false, error: err.message || err };
    }
  },

  onLoginSuccess: async () => {
    try {
      const win = getCurrentWindow();
      await win.setResizable(true);
      await win.setMaximizable(true);
      await win.maximize();
    } catch (err) {
      console.error('Failed to maximize window inside Tauri:', err);
    }
  },

  onLogout: async () => {
    // Keep window maximized on logout to prevent dimensions shifting on the login screen
  }
};
