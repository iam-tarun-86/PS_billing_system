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
      code: 'M00',
      name: 'Tata Salt',
      tamilName: 'டாடா உப்பு',
      group: 'Groceries',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 20,
      netPrice: 20,
      mrp: 22,
      costPrice: 15,
      openingStock: 100,
      currentStock: 90,
      slabs: []
    },
    {
      code: 'M03',
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
      openingStock: 500,
      currentStock: 480,
      slabs: [
        { qtyLimit: 0.100, offset: 20 },
        { qtyLimit: 0.250, offset: 20 },
        { qtyLimit: 0.500, offset: 10 }
      ]
    },
    {
      code: 'M04',
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
      openingStock: 300,
      currentStock: 280,
      slabs: [
        { qtyLimit: 0.100, offset: 20 },
        { qtyLimit: 0.250, offset: 20 },
        { qtyLimit: 0.500, offset: 10 }
      ]
    },
    {
      code: 'M05',
      name: 'Black Gram',
      tamilName: 'உளுந்தம் பருப்பு',
      group: 'Dals',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 120,
      netPrice: 120,
      mrp: 130,
      costPrice: 100,
      openingStock: 200,
      currentStock: 190,
      slabs: [
        { qtyLimit: 0.100, offset: 20 },
        { qtyLimit: 0.250, offset: 20 },
        { qtyLimit: 0.500, offset: 10 }
      ]
    },
    {
      code: 'M06',
      name: 'White Gram',
      tamilName: 'வெள்ளை உளுந்து',
      group: 'Dals',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 130,
      netPrice: 130,
      mrp: 140,
      costPrice: 110,
      openingStock: 200,
      currentStock: 185,
      slabs: [
        { qtyLimit: 0.100, offset: 20 },
        { qtyLimit: 0.250, offset: 20 },
        { qtyLimit: 0.500, offset: 10 }
      ]
    },
    {
      code: 'B01',
      name: 'Lux Soap 100g',
      tamilName: 'லக்ஸ் சோப்பு',
      group: 'Soaps',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 35,
      netPrice: 35,
      mrp: 35,
      costPrice: 28,
      openingStock: 150,
      currentStock: 140,
      slabs: []
    },
    {
      code: 'B02',
      name: 'Hamam Soap 100g',
      tamilName: 'ஹமாம் சோப்பு',
      group: 'Soaps',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 40,
      netPrice: 40,
      mrp: 40,
      costPrice: 32,
      openingStock: 150,
      currentStock: 130,
      slabs: []
    },
    {
      code: 'B03',
      name: 'Lifebuoy Soap 100g',
      tamilName: 'லைஃப்பாய் சோப்பு',
      group: 'Soaps',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 30,
      netPrice: 30,
      mrp: 30,
      costPrice: 24,
      openingStock: 200,
      currentStock: 180,
      slabs: []
    },
    {
      code: 'O01',
      name: 'Gold Winner Oil 1L',
      tamilName: 'கோல்டு வின்னர் எண்ணெய்',
      group: 'Oils',
      unit: 'litre',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 150,
      netPrice: 150,
      mrp: 160,
      costPrice: 135,
      openingStock: 100,
      currentStock: 95,
      slabs: []
    },
    {
      code: 'O02',
      name: 'Coconut Oil 1L',
      tamilName: 'தேங்காய் எண்ணெய்',
      group: 'Oils',
      unit: 'litre',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 220,
      netPrice: 220,
      mrp: 240,
      costPrice: 190,
      openingStock: 100,
      currentStock: 88,
      slabs: []
    },
    {
      code: 'K01',
      name: 'Ashirvaad Atta 1kg',
      tamilName: 'ஆசிர்வாத் கோதுமை மாவு',
      group: 'Rava / Flour',
      unit: 'packet',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 65,
      netPrice: 65,
      mrp: 70,
      costPrice: 52,
      openingStock: 100,
      currentStock: 92,
      slabs: []
    },
    {
      code: 'K02',
      name: 'Maida 1kg',
      tamilName: 'மைதா மாவு',
      group: 'Rava / Flour',
      unit: 'kg',
      priceType: 'Quantity',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 45,
      netPrice: 45,
      mrp: 50,
      costPrice: 35,
      openingStock: 200,
      currentStock: 180,
      slabs: []
    },
    {
      code: 'C01',
      name: 'Vim Bar 100g',
      tamilName: 'விம் சோப்பு',
      group: 'Cleaning Items',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 10,
      netPrice: 10,
      mrp: 10,
      costPrice: 7,
      openingStock: 300,
      currentStock: 290,
      slabs: []
    },
    {
      code: 'C02',
      name: 'Exo Touch',
      tamilName: 'எக்ஸோ சோப்பு',
      group: 'Cleaning Items',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 15,
      netPrice: 15,
      mrp: 15,
      costPrice: 11,
      openingStock: 200,
      currentStock: 195,
      slabs: []
    },
    {
      code: 'C03',
      name: 'A-One Bleaching Powder',
      tamilName: 'ஏ-ஒன் பிளீச்சிங் பவுடர்',
      group: 'Cleaning Items',
      unit: 'packet',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 45,
      netPrice: 45,
      mrp: 50,
      costPrice: 30,
      openingStock: 100,
      currentStock: 98,
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

  const loadLocalFile = () => {
    let indexPath = path.join(__dirname, '../dist/index.html');
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(__dirname, 'dist/index.html');
    }
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(app.getAppPath(), 'dist/index.html');
    }
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load index.html:', err);
    });
  };

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const devUrl = 'http://localhost:5173';
    mainWindow.loadURL(devUrl).catch(() => {
      console.log('Dev server not running at localhost:5173, loading local dist/index.html...');
      loadLocalFile();
    });
  } else {
    loadLocalFile();
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
