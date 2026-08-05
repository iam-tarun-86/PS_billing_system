import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, ArrowLeft, Layers, Percent, Box, Save, X, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils/csv';

export default function ProductManager({ database, onUpdateDatabase, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isTableFocused, setIsTableFocused] = useState(false);

  const searchInputRef = useRef(null);


  const handleExportCSV = () => {
    const headers = [
      'Code', 'Product Name (English)', 'Tamil Name', 'Group', 'Unit', 
      'Price Type', 'Selling Price (Rate)', 'MRP', 'Cost Price', 
      'Opening Stock', 'Current Stock', 'Status'
    ];
    const rows = database.products.map(p => [
      p.code,
      p.name,
      p.tamilName || '',
      p.group || 'General',
      p.unit || 'kg',
      p.priceType || 'Fixed',
      p.sellingPrice,
      p.mrp,
      p.costPrice || 0,
      p.openingStock || 0,
      p.currentStock || 0,
      p.disableItem ? 'Disabled' : 'Active'
    ]);
    exportToCSV('products_inventory.csv', headers, rows);
  };

  // Group list extracted from products
  const groups = ['All', ...new Set(database.products.map(p => p.group || 'General'))];
  const units = ['kg', 'litre', 'piece', 'nos', 'packet', 'box', 'bag'];

  // Alphanumeric natural sorting comparator
  const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };

  const sortedProducts = [...database.products].sort((a, b) => naturalCompare(a.code, b.code));
  const groupFilteredProducts = sortedProducts.filter(p => selectedGroup === 'All' || (p.group || 'General') === selectedGroup);

  // Custom prioritised search results
  const getFilteredProducts = () => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return groupFilteredProducts;
    }

    // Check if there is an exact code match
    const hasExactMatch = groupFilteredProducts.some(p => p.code.toLowerCase() === query);
    if (hasExactMatch) {
      // If there is an exact code match, show the full list (groupFilteredProducts)
      // so surrounding items are visible in the table.
      return groupFilteredProducts;
    }

    // Prioritized search:
    // 1. Code starts with query
    // 2. Code contains query (but not starts with)
    // 3. Name or TamilName or Group contains query
    const startsWithCode = [];
    const containsCode = [];
    const containsName = [];

    groupFilteredProducts.forEach(p => {
      const codeLower = p.code.toLowerCase();
      const nameLower = p.name.toLowerCase();
      const tamilLower = (p.tamilName || '').toLowerCase();
      const groupLower = (p.group || 'General').toLowerCase();

      if (codeLower.startsWith(query)) {
        startsWithCode.push(p);
      } else if (codeLower.includes(query)) {
        containsCode.push(p);
      } else if (nameLower.includes(query) || tamilLower.includes(query) || groupLower.includes(query)) {
        containsName.push(p);
      }
    });

    return [...startsWithCode, ...containsCode, ...containsName];
  };

  const filteredProducts = getFilteredProducts();

  const handleEditClick = (product) => {
    // Deep clone product to avoid mutation before save
    const cloned = JSON.parse(JSON.stringify(product));
    
    // Ensure slabs exist with default slots if empty for Qty items
    if (cloned.priceType === 'Quantity' && (!cloned.slabs || cloned.slabs.length === 0)) {
      cloned.slabs = [
        { qtyLimit: 0.050, offset: 0 },
        { qtyLimit: 0.100, offset: 0 },
        { qtyLimit: 0.250, offset: 0 },
        { qtyLimit: 0.500, offset: 0 }
      ];
    }
    
    setEditingProduct(cloned);
    setIsAddingNew(false);
  };

  // Ref to track the highlighted row for auto-scrolling
  const activeRowRef = useRef(null);

  // Sync highlightedIndex and isTableFocused on search query changes
  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      setHighlightedIndex(-1);
      setIsTableFocused(false);
      return;
    }

    // Check for exact code match in the current filtered view
    const exactIdx = filteredProducts.findIndex(p => p.code.toLowerCase() === query);
    if (exactIdx !== -1) {
      setHighlightedIndex(exactIdx);
      setIsTableFocused(true);
    } else {
      setHighlightedIndex(-1);
      setIsTableFocused(false);
    }
  }, [searchTerm, selectedGroup]);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Global keydown handler
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Escape key behavior
      if (e.key === 'Escape') {
        e.preventDefault();
        if (editingProduct) {
          setEditingProduct(null);
          setIsTableFocused(false);
          setHighlightedIndex(-1);
          setTimeout(() => {
            if (searchInputRef.current) searchInputRef.current.focus();
          }, 50);
        } else if (isTableFocused) {
          setIsTableFocused(false);
          setHighlightedIndex(-1);
          setTimeout(() => {
            if (searchInputRef.current) searchInputRef.current.focus();
          }, 50);
        } else {
          onBack();
        }
        return;
      }

      // Table keyboard navigation when focused
      if (isTableFocused && filteredProducts.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(filteredProducts.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selectedProduct = filteredProducts[highlightedIndex];
          if (selectedProduct) {
            setIsTableFocused(false);
            handleEditClick(selectedProduct);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTableFocused, filteredProducts, highlightedIndex, editingProduct, onBack]);

  // Auto-scroll the highlighted row into view
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  const handleAddNewClick = () => {
    setEditingProduct({
      code: '',
      name: '',
      tamilName: '',
      group: 'General',
      unit: 'piece',
      priceType: 'Fixed',
      billItem: true,
      salableItem: true,
      disableItem: false,
      sellingPrice: 0,
      netPrice: 0,
      mrp: 0,
      costPrice: 0,
      openingStock: 0,
      currentStock: 0,
      slabs: [
        { qtyLimit: 0.050, offset: 0 },
        { qtyLimit: 0.100, offset: 0 },
        { qtyLimit: 0.250, offset: 0 },
        { qtyLimit: 0.500, offset: 0 }
      ]
    });
    setIsAddingNew(true);
  };

  const handleInputChange = (field, value) => {
    setEditingProduct(prev => {
      const updated = { ...prev, [field]: value };
      
      // Keep sellingPrice and netPrice synchronized by default
      if (field === 'sellingPrice') {
        updated.netPrice = value;
      }
      
      // If priceType transitions to Quantity, ensure slabs are configured
      if (field === 'priceType' && value === 'Quantity' && (!updated.slabs || updated.slabs.length === 0)) {
        updated.slabs = [
          { qtyLimit: 0.050, offset: 0 },
          { qtyLimit: 0.100, offset: 0 },
          { qtyLimit: 0.250, offset: 0 },
          { qtyLimit: 0.500, offset: 0 }
        ];
      }
      return updated;
    });
  };

  const handleSlabOffsetChange = (index, value) => {
    setEditingProduct(prev => {
      const updatedSlabs = [...prev.slabs];
      updatedSlabs[index] = { ...updatedSlabs[index], offset: parseFloat(value) || 0 };
      return { ...prev, slabs: updatedSlabs };
    });
  };

  const handleSlabQtyChange = (index, gramsValue) => {
    const floatGrams = parseFloat(gramsValue) || 0;
    setEditingProduct(prev => {
      const updatedSlabs = [...prev.slabs];
      updatedSlabs[index] = { ...updatedSlabs[index], qtyLimit: floatGrams / 1000 };
      return { ...prev, slabs: updatedSlabs };
    });
  };

  const handleAddSlab = () => {
    setEditingProduct(prev => {
      const currentSlabs = prev.slabs ? [...prev.slabs] : [];
      return {
        ...prev,
        slabs: [...currentSlabs, { qtyLimit: 0.100, offset: 0 }]
      };
    });
  };

  const handleDeleteSlab = (index) => {
    setEditingProduct(prev => {
      const updatedSlabs = prev.slabs.filter((_, i) => i !== index);
      return { ...prev, slabs: updatedSlabs };
    });
  };


  const handleSave = () => {
    if (!editingProduct.code || !editingProduct.name) {
      alert('குறியீடு மற்றும் பொருள் பெயர் கட்டாயம்! / Code and Product Name are required!');
      return;
    }

    let updatedProducts = [...database.products];
    
    if (isAddingNew) {
      // Check for duplicate code
      if (database.products.some(p => p.code.toLowerCase() === editingProduct.code.toLowerCase())) {
        alert('இந்த குறியீடு ஏற்கனவே உள்ளது! / This item code already exists!');
        return;
      }
      updatedProducts.push(editingProduct);
    } else {
      updatedProducts = updatedProducts.map(p => p.code === editingProduct.code ? editingProduct : p);
    }

    onUpdateDatabase({
      ...database,
      products: updatedProducts
    });

    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDelete = (code) => {
    if (confirm('நிச்சயமாக இந்த பொருளை நீக்க வேண்டுமா? / Are you sure you want to delete this product?')) {
      const updatedProducts = database.products.filter(p => p.code !== code);
      onUpdateDatabase({
        ...database,
        products: updatedProducts
      });
    }
  };

  // Helper to calculate live slab price preview
  const calculateSlabPricePreview = (basePrice, qty, offset) => {
    const effectiveRate = basePrice + offset;
    return (effectiveRate * qty).toFixed(2);
  };

  return (
    <div className="product-manager-screen screen-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={onBack}>
            <ArrowLeft size={16} /> பின்னே / Back
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>பொருட்கள் மேலாண்மை / Product Inventory Manager</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> கோப்பு இறக்கம் / Export CSV
          </button>
          <button className="btn-success" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleAddNewClick}>
            <Plus size={18} /> புதிய பொருள் / Add Product
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Product Table list */}
        <div className="pos-card" style={{ 
          flex: editingProduct ? '2' : '1', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          transition: 'all 0.3s ease',
          border: isTableFocused ? '1.5px solid var(--border-focus)' : '1px solid var(--border-color)',
          boxShadow: isTableFocused ? '0 0 8px var(--primary-glow)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>
                <Search size={16} />
              </span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="தேடுக (குறியீடு, பெயர்)... / Search by code, name..." 
                className="pos-input" 
                style={{ paddingLeft: '36px' }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                  setIsTableFocused(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'ArrowDown') {
                    if (filteredProducts.length > 0) {
                      e.preventDefault();
                      setHighlightedIndex(0);
                      setIsTableFocused(true);
                      if (searchInputRef.current) searchInputRef.current.blur();
                    }
                  }
                }}
              />
            </div>
            
            <select 
              className="pos-input" 
              style={{ width: '180px' }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {groups.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'அனைத்து பிரிவும் / All Groups' : g}</option>
              ))}
            </select>
          </div>

          {/* Table Container */}
          <div className="table-container" style={{ flex: 1 }}>
            <table className="pos-table">
              <thead>
                <tr>
                  <th>குறியீடு / Code</th>
                  <th>பொருள் / English Name</th>
                  <th>தமிழ் பெயர் / Tamil Name</th>
                  <th>குரூப் / Group</th>
                  <th>Unit / அலகு</th>
                  <th style={{ textAlign: 'right' }}>விலை / Retail Rate</th>
                  <th>விலை வகை / Price Type</th>
                  <th>இருப்பு / Stock</th>
                  <th style={{ textAlign: 'center' }}>செயல்கள் / Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => {
                  const isHighlighted = highlightedIndex === i;
                  const isActive = editingProduct?.code === p.code;

                  return (
                    <tr 
                      key={p.code} 
                      ref={isHighlighted ? activeRowRef : null}
                      className={`${isActive ? 'active-row' : ''} ${isHighlighted ? 'highlighted-row' : ''}`} 
                      style={{ 
                        cursor: 'pointer',
                        background: isHighlighted ? 'rgba(37, 99, 235, 0.1)' : isActive ? 'rgba(37, 99, 235, 0.05)' : '',
                        borderLeft: isHighlighted ? '4px solid var(--primary)' : isActive ? '4px solid var(--primary)' : ''
                      }} 
                      onClick={() => {
                        setHighlightedIndex(i);
                        setIsTableFocused(false);
                        handleEditClick(p);
                      }}
                    >
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{p.code}</td>
                      <td style={{ fontWeight: '500' }}>{p.name}</td>
                      <td>{p.tamilName || '-'}</td>
                      <td>{p.group || 'General'}</td>
                      <td><span style={{ background: 'var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{p.unit}</span></td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{p.sellingPrice.toFixed(2)}</td>
                      <td>
                        <span style={{ 
                          fontSize: '12px', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          background: p.priceType === 'Quantity' ? 'var(--success-bg)' : 'var(--border-color)',
                          color: p.priceType === 'Quantity' ? 'var(--success)' : 'var(--text-primary)'
                        }}>
                          {p.priceType === 'Quantity' ? 'Qty Based' : 'Fixed'}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: p.currentStock <= 0 ? 'var(--error)' : 'var(--text-primary)' }}>
                        {p.currentStock.toFixed(1)}
                      </td>
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => {
                            setHighlightedIndex(i);
                            setIsTableFocused(false);
                            handleEditClick(p);
                          }}>
                            <Edit size={14} />
                          </button>
                          <button className="btn-ghost" style={{ padding: '6px', color: 'var(--error)' }} onClick={() => handleDelete(p.code)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      பொருட்கள் எதுவும் கிடைக்கவில்லை. / No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Inline Sliding edit card */}
        {editingProduct && (
          <div className="pos-card screen-fade" style={{ flex: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: '3px solid var(--primary)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {isAddingNew ? '새 புதிய பொருள் சேர்க்க / Add New Product' : 'விவரம் திருத்து / Edit Product Details'}
              </h3>
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
              
              {/* Row 1: Code and Group */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">குறியீடு / Code</span>
                  <input 
                    type="text" 
                    className="pos-input mono" 
                    disabled={!isAddingNew}
                    value={editingProduct.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">பிரிவு / Group</span>
                  <input 
                    type="text" 
                    className="pos-input" 
                    value={editingProduct.group}
                    onChange={(e) => handleInputChange('group', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: English & Tamil Name */}
              <div className="input-group">
                <span className="input-label">பொருள் (ஆங்கிலம்) / English Name</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-label">பொருள் (தமிழ்) / Tamil Name</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  value={editingProduct.tamilName}
                  onChange={(e) => handleInputChange('tamilName', e.target.value)}
                />
              </div>

              {/* Row 3: Unit and Price Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">அலகு / Unit</span>
                  <select 
                    className="pos-input" 
                    value={editingProduct.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <span className="input-label">விலை வகை / Price Type</span>
                  <select 
                    className="pos-input" 
                    value={editingProduct.priceType}
                    onChange={(e) => handleInputChange('priceType', e.target.value)}
                  >
                    <option value="Fixed">Fixed (நிலையானது)</option>
                    <option value="Quantity">Quantity (அளவு சார்ந்தது)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Toggles */}
              <div style={{ display: 'flex', gap: '15px', padding: '8px 0', borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={editingProduct.billItem} 
                    onChange={(e) => handleInputChange('billItem', e.target.checked)}
                  />
                  Bill Item
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={editingProduct.salableItem} 
                    onChange={(e) => handleInputChange('salableItem', e.target.checked)}
                  />
                  Salable Item
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: editingProduct.disableItem ? 'var(--error)' : 'inherit' }}>
                  <input 
                    type="checkbox" 
                    checked={editingProduct.disableItem} 
                    onChange={(e) => handleInputChange('disableItem', e.target.checked)}
                  />
                  Disable Item
                </label>
              </div>

              {/* Row 5: Pricing details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">விற்பனை விலை / Retail Price</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    value={editingProduct.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">நிகர விலை / Net Price</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    value={editingProduct.netPrice}
                    onChange={(e) => handleInputChange('netPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">எம்.ஆர்.பி / M.R.P</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    value={editingProduct.mrp}
                    onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">அசல் விலை / Cost Price</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    value={editingProduct.costPrice}
                    onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Row 6: Stock details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label">முன் இருப்பு / Opening Stock</span>
                  <input 
                    type="number" 
                    className="pos-input mono" 
                    value={editingProduct.openingStock}
                    onChange={(e) => handleInputChange('openingStock', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">தற்போதைய இருப்பு / Current Stock</span>
                  <input 
                    type="number" 
                    className="pos-input mono" 
                    value={editingProduct.currentStock}
                    onChange={(e) => handleInputChange('currentStock', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Special Inline Slab Configuration (For Qty Items only) */}
              {editingProduct.priceType === 'Quantity' && (
                <div style={{ marginTop: '10px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} /> ஸ்லாப் விலை விவரம் / Slab Pricing Details
                    </h4>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      style={{ padding: '4px 10px', fontSize: '11px', height: '24px' }} 
                      onClick={handleAddSlab}
                    >
                      <Plus size={12} /> சேர்க்க / Add
                    </button>
                  </div>
                  
                  {/* Table headers for slabs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: '8px', marginBottom: '6px', fontSize: '10px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                    <span>அளவு / Qty (Grams)</span>
                    <span>வித்தியாசம் / Offset (₹)</span>
                    <span style={{ textAlign: 'right' }}>விலை / Price</span>
                    <span></span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editingProduct.slabs.map((s, index) => (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                        {/* Grams Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            type="number" 
                            className="pos-input mono" 
                            style={{ height: '32px', fontSize: '12px', padding: '4px' }}
                            value={Math.round(s.qtyLimit * 1000)}
                            onChange={(e) => handleSlabQtyChange(index, e.target.value)}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>g</span>
                        </div>
                        
                        {/* Offset Input */}
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="number" 
                            className="pos-input mono" 
                            style={{ paddingRight: '14px', paddingLeft: '6px', height: '32px', fontSize: '12px' }}
                            value={s.offset}
                            onChange={(e) => handleSlabOffsetChange(index, e.target.value)}
                          />
                          <span style={{ position: 'absolute', right: '4px', top: '7px', fontSize: '10px', color: 'var(--text-secondary)' }}>₹</span>
                        </div>

                        {/* Calculated Price */}
                        <span style={{ fontSize: '11px', textAlign: 'right', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                          ₹{calculateSlabPricePreview(editingProduct.sellingPrice, s.qtyLimit, s.offset)}
                        </span>

                        {/* Delete Row Button */}
                        <button 
                          type="button" 
                          className="btn-ghost" 
                          style={{ padding: '4px', color: 'var(--error)', width: '32px', height: '32px' }}
                          onClick={() => handleDeleteSlab(index)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                    * offset மதிப்பு கூட்டப்படும் / Offset value is added/subtracted (e.g. +20 or -110) directly to the 1kg rate before fractioning.
                  </div>
                </div>
              )}

            </div>

            {/* Save/Cancel Panel */}
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '20px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setEditingProduct(null)}>
                ரத்து செய் / Cancel
              </button>
              <button className="btn-success" style={{ flex: 1, padding: '10px' }} onClick={handleSave}>
                <Save size={16} /> சேமி / Save
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
