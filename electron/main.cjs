const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { DBManager, initTables, migrateLegacyJson, insertSeedDataIfEmpty, fetchFullDatabaseState, syncDatabaseState } = require('./dbManager.cjs');

let mainWindow;

// Define storage paths
const userDataPath = app.getPath('userData');
const dbFilePath = path.join(userDataPath, 'database.json');
const sqliteDbPath = path.join(userDataPath, 'billing.db');
const dbManager = new DBManager(sqliteDbPath);

// Default Seed Data
const defaultDatabase = {
  products: [
    {
      code: 'M14',
      name: 'White Rava (Rost)',
      tamilName: 'வெ.ரவை (Rost)',
      group: 'Rava / Flour',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 70,
      netPrice: 70,
      mrp: 75,
      costPrice: 55,
      openingStock: 100,
      currentStock: 95,
      slabs: [
        { qtyLimit: 0.050, offset: 0 },
        { qtyLimit: 0.100, offset: 0 },
        { qtyLimit: 0.250, offset: 10 }, // 80/kg
        { qtyLimit: 0.500, offset: 5 }   // 75/kg
      ]
    },
    {
      code: 'D02',
      name: 'Cashew 10RS',
      tamilName: 'முந்திரி 10RS',
      group: 'Spices',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 10,
      netPrice: 10,
      mrp: 10,
      costPrice: 8,
      openingStock: 500,
      currentStock: 420,
      slabs: []
    },
    {
      code: 'D06',
      name: 'Raisins 10RS',
      tamilName: 'திராட்சை 10RS',
      group: 'Spices',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 10,
      netPrice: 10,
      mrp: 10,
      costPrice: 7,
      openingStock: 400,
      currentStock: 350,
      slabs: []
    },
    {
      code: '410',
      name: 'Cardamom Packet',
      tamilName: 'ஏலக்காய்பாக்கெட்',
      group: 'Spices',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 900,
      netPrice: 900,
      mrp: 950,
      costPrice: 750,
      openingStock: 50,
      currentStock: 22,
      slabs: []
    },
    {
      code: '426',
      name: 'Kootu Sambrani',
      tamilName: 'கூட்டுசாம்பிராணி',
      group: 'Pooja Items',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 35,
      netPrice: 35,
      mrp: 40,
      costPrice: 25,
      openingStock: 200,
      currentStock: 148,
      slabs: []
    },
    {
      code: '101',
      name: 'Sugar',
      tamilName: 'சீனி / சர்க்கரை',
      group: 'Groceries',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 40,
      netPrice: 40,
      mrp: 42,
      costPrice: 34,
      openingStock: 1000,
      currentStock: 850,
      slabs: [
        { qtyLimit: 0.100, offset: 20 }, // 60 Rs/kg -> 6 Rs
        { qtyLimit: 0.250, offset: 20 }, // 60 Rs/kg -> 15 Rs
        { qtyLimit: 0.500, offset: 10 }  // 50 Rs/kg -> 25 Rs
      ]
    },
    {
      code: '102',
      name: 'Toor Dal',
      tamilName: 'துவரம் பருப்பு',
      group: 'Dals',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 140,
      netPrice: 140,
      mrp: 150,
      costPrice: 120,
      openingStock: 500,
      currentStock: 320,
      slabs: [
        { qtyLimit: 0.100, offset: 20 }, // 160 Rs/kg -> 16 Rs
        { qtyLimit: 0.250, offset: 20 }, // 160 Rs/kg -> 40 Rs
        { qtyLimit: 0.500, offset: 10 }  // 150 Rs/kg -> 75 Rs
      ]
    }
  ],
  transactions: [],
  settings: {
    shopName: 'SRI PERUMAL STORES',
    headerSlogan: 'ஸ்ரீ முருகன் துணை',
    phoneNumbers: '9942143460, 9629708861',
    defaultOperator: 'T',
    theme: 'dark'
  }
};


// IPC Handlers for database read/write using SQLite
ipcMain.handle('db-read', async () => {
  try {
    return await fetchFullDatabaseState(dbManager);
  } catch (err) {
    console.error('Read SQLite database failed:', err);
    return defaultDatabase;
  }
});

ipcMain.handle('db-write', async (event, data) => {
  try {
    await syncDatabaseState(dbManager, data);
    return { success: true };
  } catch (err) {
    console.error('Write SQLite database failed:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('window-login', () => {
  if (mainWindow) {
    mainWindow.setResizable(true);
    mainWindow.setMaximizable(true);
    mainWindow.maximize();
  }
  return { success: true };
});

ipcMain.handle('window-logout', () => {
  if (mainWindow) {
    mainWindow.unmaximize();
    mainWindow.setResizable(false);
    mainWindow.setMaximizable(false);
    mainWindow.setSize(500, 660);
    mainWindow.center();
  }
  return { success: true };
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 660,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    frame: true, // Native window frame
    title: 'Express Bill - POS System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Check if we are in dev mode
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // Retry logic to wait for Vite dev server
    const devUrl = 'http://localhost:5173';
    const loadUrlWithRetry = () => {
      mainWindow.loadURL(devUrl).catch((err) => {
        console.log('Dev server not ready yet. Retrying in 1s...');
        setTimeout(loadUrlWithRetry, 1000);
      });
    };
    loadUrlWithRetry();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html')).catch((err) => {
      console.error('Failed to load production build index.html:', err);
    });
    // Remove menu bar in production
    mainWindow.setMenu(null);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await dbManager.open();
    await initTables(dbManager);
    await migrateLegacyJson(dbManager, dbFilePath);
    await insertSeedDataIfEmpty(dbManager, defaultDatabase);
    console.log('SQLite database initialized successfully at:', sqliteDbPath);
  } catch (err) {
    console.error('SQLite initialization failed on startup:', err);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', async () => {
  try {
    await dbManager.close();
    console.log('SQLite database connection closed.');
  } catch (err) {
    console.error('Failed to close SQLite database:', err);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
