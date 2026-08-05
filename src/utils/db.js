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
      },
      {
        code: 'M00',
        name: 'Tata Salt',
        tamilName: 'டாடா உப்பு M00',
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
        name: 'Sugar M03',
        tamilName: 'சீனி M03',
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
        name: 'Toor Dhaal',
        tamilName: 'துவரம் பருப்பு M04',
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
        tamilName: 'உளுந்தம் பருப்பு M05',
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
        tamilName: 'வெள்ளை உளுந்து M06',
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
        tamilName: 'லக்ஸ் சோப்பு B01',
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
        tamilName: 'ஹமாம் சோப்பு B02',
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
        tamilName: 'லைஃப்பாய் சோப்பு B03',
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
        tamilName: 'கோல்டு வின்னர் எண்ணெய் O01',
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
        tamilName: 'தேங்காய் எண்ணெய் O02',
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
        tamilName: 'ஆசிர்வாத் கோதுமை மாவு K01',
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
        tamilName: 'மைதா மாவு K02',
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
        tamilName: 'விம் சோப்பு C01',
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
        tamilName: 'எக்ஸோ சோப்பு C02',
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
        tamilName: 'ஏ-ஒன் பிளீச்சிங் பவுடர் C03',
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
        slabs: []
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
