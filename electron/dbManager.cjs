const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DBManager {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.db.run('PRAGMA journal_mode = WAL;', (err) => {
            if (err) console.error('Failed to set WAL journal mode:', err);
            resolve();
          });
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Initialize tables in SQLite database
async function initTables(dbManager) {
  await dbManager.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await dbManager.run(`
    CREATE TABLE IF NOT EXISTS products (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tamilName TEXT,
      product_group TEXT,
      unit TEXT,
      priceType TEXT,
      sellingPrice REAL DEFAULT 0,
      mrp REAL DEFAULT 0,
      costPrice REAL DEFAULT 0,
      openingStock REAL DEFAULT 0,
      currentStock REAL DEFAULT 0,
      disableItem INTEGER DEFAULT 0,
      slabs TEXT
    )
  `);

  await dbManager.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      invoiceNo INTEGER PRIMARY KEY,
      timestamp TEXT,
      year INTEGER,
      month INTEGER,
      day INTEGER,
      date TEXT,
      time TEXT,
      customerName TEXT,
      customerMobile TEXT,
      customerAddress TEXT,
      grossTotal REAL,
      discount REAL,
      rent REAL,
      coolie REAL,
      advance REAL,
      netTotal REAL,
      operator TEXT
    )
  `);

  await dbManager.run(`
    CREATE TABLE IF NOT EXISTS transaction_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_invoiceNo INTEGER,
      code TEXT,
      name TEXT,
      tamilName TEXT,
      qty TEXT,
      unit TEXT,
      mrp REAL,
      basePrice REAL,
      overridePrice TEXT,
      totalPrice REAL,
      priceType TEXT,
      FOREIGN KEY(transaction_invoiceNo) REFERENCES transactions(invoiceNo) ON DELETE CASCADE
    )
  `);
}

// Migrate legacy database.json if it exists
async function migrateLegacyJson(dbManager, jsonFilePath) {
  if (!fs.existsSync(jsonFilePath)) return;

  try {
    const raw = fs.readFileSync(jsonFilePath, 'utf-8');
    const legacyData = JSON.parse(raw);

    console.log('Found legacy database.json. Initiating SQLite migration...');

    // Migrate settings
    if (legacyData.settings) {
      for (const [key, val] of Object.entries(legacyData.settings)) {
        await dbManager.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, String(val)]);
      }
    }

    // Migrate products
    if (legacyData.products && Array.isArray(legacyData.products)) {
      for (const p of legacyData.products) {
        await dbManager.run(`
          INSERT OR REPLACE INTO products 
          (code, name, tamilName, product_group, unit, priceType, sellingPrice, mrp, costPrice, openingStock, currentStock, disableItem, slabs)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.code, p.name, p.tamilName || '', p.group || 'General', p.unit || 'kg', p.priceType || 'Fixed',
          p.sellingPrice || 0, p.mrp || 0, p.costPrice || 0, p.openingStock || 0, p.currentStock || 0,
          p.disableItem ? 1 : 0, JSON.stringify(p.slabs || [])
        ]);
      }
    }

    // Migrate transactions & items
    if (legacyData.transactions && Array.isArray(legacyData.transactions)) {
      for (const t of legacyData.transactions) {
        const now = t.timestamp ? new Date(t.timestamp) : new Date();
        const year = t.year || now.getFullYear();
        const month = t.month || (now.getMonth() + 1);
        const day = t.day || now.getDate();
        const timestamp = t.timestamp || now.toISOString();

        await dbManager.run(`
          INSERT OR REPLACE INTO transactions 
          (invoiceNo, timestamp, year, month, day, date, time, customerName, customerMobile, customerAddress, grossTotal, discount, rent, coolie, advance, netTotal, operator)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          t.invoiceNo, timestamp, year, month, day, t.date, t.time, t.customerName || 'CASH', t.customerMobile || '',
          t.customerAddress || '', t.grossTotal || 0, t.discount || 0, t.rent || 0, t.coolie || 0, t.advance || 0, t.netTotal || 0, t.operator || 'T'
        ]);

        if (t.items && Array.isArray(t.items)) {
          // Clear any duplicate items for this invoice before inserting
          await dbManager.run('DELETE FROM transaction_items WHERE transaction_invoiceNo = ?', [t.invoiceNo]);

          for (const item of t.items) {
            await dbManager.run(`
              INSERT INTO transaction_items 
              (transaction_invoiceNo, code, name, tamilName, qty, unit, mrp, basePrice, overridePrice, totalPrice, priceType)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              t.invoiceNo, item.code || '', item.name || '', item.tamilName || '', String(item.qty || ''), item.unit || 'kg',
              item.mrp || 0, item.basePrice || 0, String(item.overridePrice || '0.00'), item.totalPrice || 0, item.priceType || 'Fixed'
            ]);
          }
        }
      }
    }

    // Rename JSON file so we don't migrate again
    fs.renameSync(jsonFilePath, `${jsonFilePath}.migrated_to_sqlite`);
    console.log('SQLite migration completed successfully! Backed up legacy JSON database.');
  } catch (err) {
    console.error('Failed to migrate legacy JSON database to SQLite:', err);
  }
}

// Initialize seed data if database is brand new
async function insertSeedDataIfEmpty(dbManager, defaultDatabase) {
  const productCountRow = await dbManager.get('SELECT COUNT(*) as count FROM products');
  if (productCountRow.count === 0) {
    console.log('Products table empty. Seeding default inventory...');
    for (const p of defaultDatabase.products) {
      await dbManager.run(`
        INSERT INTO products 
        (code, name, tamilName, product_group, unit, priceType, sellingPrice, mrp, costPrice, openingStock, currentStock, disableItem, slabs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.code, p.name, p.tamilName || '', p.group || 'General', p.unit || 'kg', p.priceType || 'Fixed',
        p.sellingPrice || 0, p.mrp || 0, p.costPrice || 0, p.openingStock || 0, p.currentStock || 0,
        p.disableItem ? 1 : 0, JSON.stringify(p.slabs || [])
      ]);
    }
  }

  const settingsCountRow = await dbManager.get('SELECT COUNT(*) as count FROM settings');
  if (settingsCountRow.count === 0) {
    console.log('Settings table empty. Seeding default configurations...');
    for (const [key, val] of Object.entries(defaultDatabase.settings)) {
      await dbManager.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(val)]);
    }
  }
}

// Assemble full compatible DB JSON state from SQLite tables
async function fetchFullDatabaseState(dbManager) {
  // 1. Fetch settings
  const settingsRows = await dbManager.all('SELECT * FROM settings');
  const settings = {};
  settingsRows.forEach(row => {
    // Attempt parsing to restore original boolean/number values
    if (row.value === 'true') settings[row.key] = true;
    else if (row.value === 'false') settings[row.key] = false;
    else if (!isNaN(row.value) && row.value !== '') settings[row.key] = Number(row.value);
    else settings[row.key] = row.value;
  });

  // 2. Fetch products
  const productRows = await dbManager.all('SELECT * FROM products');
  const products = productRows.map(row => ({
    code: row.code,
    name: row.name,
    tamilName: row.tamilName || '',
    group: row.product_group || 'General',
    unit: row.unit || 'kg',
    priceType: row.priceType || 'Fixed',
    sellingPrice: row.sellingPrice,
    netPrice: row.sellingPrice, // mapping compatibility
    mrp: row.mrp,
    costPrice: row.costPrice,
    openingStock: row.openingStock,
    currentStock: row.currentStock,
    disableItem: row.disableItem === 1,
    billItem: true, // compat
    salableItem: true, // compat
    slabs: row.slabs ? JSON.parse(row.slabs) : []
  }));

  // 3. Fetch transactions & inner items
  const transactionRows = await dbManager.all('SELECT * FROM transactions ORDER BY invoiceNo ASC');
  const itemRows = await dbManager.all('SELECT * FROM transaction_items ORDER BY id ASC');

  // Map items to their parent transactions efficiently
  const itemsByTx = {};
  itemRows.forEach(item => {
    const txId = item.transaction_invoiceNo;
    if (!itemsByTx[txId]) itemsByTx[txId] = [];
    itemsByTx[txId].push({
      code: item.code,
      name: item.name,
      tamilName: item.tamilName || '',
      qty: item.qty,
      unit: item.unit,
      mrp: item.mrp,
      basePrice: item.basePrice,
      overridePrice: item.overridePrice,
      totalPrice: item.totalPrice,
      priceType: item.priceType
    });
  });

  const transactions = transactionRows.map(tx => ({
    invoiceNo: tx.invoiceNo,
    timestamp: tx.timestamp,
    year: tx.year,
    month: tx.month,
    day: tx.day,
    date: tx.date,
    time: tx.time,
    customerName: tx.customerName || 'CASH',
    customerMobile: tx.customerMobile || '',
    customerAddress: tx.customerAddress || '',
    grossTotal: tx.grossTotal,
    discount: tx.discount || 0,
    rent: tx.rent || 0,
    coolie: tx.coolie || 0,
    advance: tx.advance || 0,
    netTotal: tx.netTotal,
    operator: tx.operator || 'T',
    items: itemsByTx[tx.invoiceNo] || []
  }));

  return {
    products,
    transactions,
    settings
  };
}

// Sync complete JSON state back into SQLite
async function syncDatabaseState(dbManager, data) {
  // Sync Settings
  if (data.settings) {
    for (const [key, val] of Object.entries(data.settings)) {
      await dbManager.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, String(val)]);
    }
  }

  // Sync Products
  if (data.products && Array.isArray(data.products)) {
    // Delete any products that were deleted in the UI
    const existingProducts = await dbManager.all('SELECT code FROM products');
    const incomingCodes = new Set(data.products.map(p => p.code));
    for (const ep of existingProducts) {
      if (!incomingCodes.has(ep.code)) {
        await dbManager.run('DELETE FROM products WHERE code = ?', [ep.code]);
      }
    }

    // Insert or replace updated products
    for (const p of data.products) {
      await dbManager.run(`
        INSERT OR REPLACE INTO products 
        (code, name, tamilName, product_group, unit, priceType, sellingPrice, mrp, costPrice, openingStock, currentStock, disableItem, slabs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.code, p.name, p.tamilName || '', p.group || 'General', p.unit || 'kg', p.priceType || 'Fixed',
        p.sellingPrice || 0, p.mrp || 0, p.costPrice || 0, p.openingStock || 0, p.currentStock || 0,
        p.disableItem ? 1 : 0, JSON.stringify(p.slabs || [])
      ]);
    }
  }

  // Sync Transactions & items
  if (data.transactions && Array.isArray(data.transactions)) {
    // Insert new transactions (we only insert/replace to prevent deleting existing ones)
    for (const t of data.transactions) {
      const now = t.timestamp ? new Date(t.timestamp) : new Date();
      const year = t.year || now.getFullYear();
      const month = t.month || (now.getMonth() + 1);
      const day = t.day || now.getDate();
      const timestamp = t.timestamp || now.toISOString();

      await dbManager.run(`
        INSERT OR REPLACE INTO transactions 
        (invoiceNo, timestamp, year, month, day, date, time, customerName, customerMobile, customerAddress, grossTotal, discount, rent, coolie, advance, netTotal, operator)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        t.invoiceNo, timestamp, year, month, day, t.date, t.time, t.customerName || 'CASH', t.customerMobile || '',
        t.customerAddress || '', t.grossTotal || 0, t.discount || 0, t.rent || 0, t.coolie || 0, t.advance || 0, t.netTotal || 0, t.operator || 'T'
      ]);

      if (t.items && Array.isArray(t.items)) {
        // Clear previous transaction items before syncing to prevent duplicate rows on reprints/resaves
        await dbManager.run('DELETE FROM transaction_items WHERE transaction_invoiceNo = ?', [t.invoiceNo]);

        for (const item of t.items) {
          await dbManager.run(`
            INSERT INTO transaction_items 
            (transaction_invoiceNo, code, name, tamilName, qty, unit, mrp, basePrice, overridePrice, totalPrice, priceType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            t.invoiceNo, item.code || '', item.name || '', item.tamilName || '', String(item.qty || ''), item.unit || 'kg',
            item.mrp || 0, item.basePrice || 0, String(item.overridePrice || '0.00'), item.totalPrice || 0, item.priceType || 'Fixed'
          ]);
        }
      }
    }
  }
}

module.exports = {
  DBManager,
  initTables,
  migrateLegacyJson,
  insertSeedDataIfEmpty,
  fetchFullDatabaseState,
  syncDatabaseState
};
