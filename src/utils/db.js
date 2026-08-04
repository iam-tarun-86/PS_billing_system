// Database access abstraction with fallback to localStorage for web/browser environment

const DEFAULT_SETTINGS = {
  shopName: 'SRI PERUMAL STORES',
  headerSlogan: 'ஸ்ரீ முருகன் துணை',
  phoneNumbers: '9942143460, 9629708861',
  defaultOperator: 'T',
  theme: 'dark'
};

export const readDatabase = async () => {
  if (window.electronAPI && typeof window.electronAPI.readDatabase === 'function') {
    try {
      const db = await window.electronAPI.readDatabase();
      return db;
    } catch (err) {
      console.error('Electron db-read failed, fallback to local', err);
    }
  }

  // Fallback to localStorage
  const localData = localStorage.getItem('express_bill_db');
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error('Local JSON parse error', e);
    }
  }

  // If nothing exists, return basic seed structure
  const seed = {
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
          { qtyLimit: 0.250, offset: 10 },
          { qtyLimit: 0.500, offset: 5 }
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
          { qtyLimit: 0.100, offset: 20 },
          { qtyLimit: 0.250, offset: 20 },
          { qtyLimit: 0.500, offset: 10 }
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
          { qtyLimit: 0.100, offset: 20 },
          { qtyLimit: 0.250, offset: 20 },
          { qtyLimit: 0.500, offset: 10 }
        ]
      }
    ],
    transactions: [],
    settings: DEFAULT_SETTINGS
  };

  localStorage.setItem('express_bill_db', JSON.stringify(seed));
  return seed;
};

export const writeDatabase = async (data) => {
  if (window.electronAPI && typeof window.electronAPI.writeDatabase === 'function') {
    try {
      const res = await window.electronAPI.writeDatabase(data);
      if (res.success) return true;
    } catch (err) {
      console.error('Electron db-write failed, fallback to local', err);
    }
  }

  // Fallback to localStorage
  try {
    localStorage.setItem('express_bill_db', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Local db-write failed', err);
    return false;
  }
};
