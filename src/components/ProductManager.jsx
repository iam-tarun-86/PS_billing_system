import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, ArrowLeft, Layers, Percent, Box, Save, X, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils/csv';

export default function ProductManager({ database, onUpdateDatabase, onBack, isPrintModalOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isTableFocused, setIsTableFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);
  // Two-mode dropdown: false = navigation mode (arrows skip past), true = edit mode (arrows change option)
  const [dropdownEditMode, setDropdownEditMode] = useState(false);
  // Increments only when a product edit panel is opened — NOT on every field change.
  // This prevents the initial-focus useEffect from re-firing on every keystroke.
  const [editOpenId, setEditOpenId] = useState(0);
  const searchInputRef = useRef(null);
  const tableContainerRef = useRef(null);

  const formRefs = {
    code: useRef(null),
    group: useRef(null),
    name: useRef(null),
    tamilName: useRef(null),
    unit: useRef(null),
    priceType: useRef(null),
    billItem: useRef(null),
    salableItem: useRef(null),
    disableItem: useRef(null),
    sellingPrice: useRef(null),
    netPrice: useRef(null),
    mrp: useRef(null),
    costPrice: useRef(null),
    openingStock: useRef(null),
    currentStock: useRef(null),
    btnCancel: useRef(null),
    btnSave: useRef(null)
  };

  // Focus first editable input when the edit panel OPENS.
  // Depends on editOpenId (not editingProduct) so it fires exactly once per open,
  // never when the user is typing and updating editingProduct state.
  useEffect(() => {
    if (editOpenId === 0) return; // skip initial mount
    setTimeout(() => {
      if (isAddingNew && formRefs.code.current) {
        formRefs.code.current.focus();
        formRefs.code.current.select();
      } else if (formRefs.group.current) {
        formRefs.group.current.focus();
        formRefs.group.current.select();
      }
    }, 100);
  }, [editOpenId]);

  const handleEditFormKeyDown = (e) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'];
    if (!keys.includes(e.key)) return;

    const active = document.activeElement;

    // ── Two-mode SELECT handling ──────────────────────────────────────────────
    if (active.tagName === 'SELECT') {
      if (dropdownEditMode) {
        // EDIT MODE: up/down change the option value; Enter confirms + moves on; Escape cancels
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          return; // let browser change option naturally
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          setDropdownEditMode(false);
          // advance to the next field in flat order
          const flatOrder = [
            'code', 'group', 'name', 'tamilName',
            'unit', 'priceType',
            'billItem', 'salableItem', 'disableItem',
            'sellingPrice', 'netPrice', 'mrp', 'costPrice',
            'openingStock', 'currentStock', 'btnSave'
          ];
          let currentField = null;
          for (const [key, ref] of Object.entries(formRefs)) {
            if (ref.current === active) { currentField = key; break; }
          }
          if (currentField) {
            const ci = flatOrder.indexOf(currentField);
            for (let i = ci + 1; i < flatOrder.length; i++) {
              const ref = formRefs[flatOrder[i]];
              if (ref?.current && !ref.current.disabled) {
                ref.current.focus();
                if (typeof ref.current.select === 'function') ref.current.select();
                return;
              }
            }
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation(); // don't close the whole edit panel
          setDropdownEditMode(false);
          return;
        }
        e.preventDefault();
        return;
      } else {
        // NAVIGATION MODE: Enter activates edit mode; arrows navigate between fields
        if (e.key === 'Enter') {
          e.preventDefault();
          setDropdownEditMode(true);
          return;
        }
        // Fall through to grid navigation below — arrow keys will call preventDefault
        // there, stopping the browser from changing the option.
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Do NOT intercept ArrowLeft / ArrowRight inside text or number inputs
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && active.tagName !== 'SELECT' &&
        (active.type === 'text' || active.type === 'number')) return;

    const editGrid = [
      ['code', 'group'],
      ['name'],
      ['tamilName'],
      ['unit', 'priceType'],
      ['billItem', 'salableItem', 'disableItem'],
      ['sellingPrice', 'netPrice'],
      ['mrp', 'costPrice'],
      ['openingStock', 'currentStock'],
      ['btnCancel', 'btnSave']
    ];

    const flatOrder = [
      'code', 'group',
      'name',
      'tamilName',
      'unit', 'priceType',
      'billItem', 'salableItem', 'disableItem',
      'sellingPrice', 'netPrice',
      'mrp', 'costPrice',
      'openingStock', 'currentStock',
      'btnSave'
    ];

    // Find current active field
    let currentField = null;
    for (const [key, ref] of Object.entries(formRefs)) {
      if (ref.current === document.activeElement) {
        currentField = key;
        break;
      }
    }

    if (!currentField) return;

    const focusField = (field) => {
      const ref = formRefs[field];
      if (ref && ref.current && !ref.current.disabled) {
        ref.current.focus();
        if (typeof ref.current.select === 'function') {
          ref.current.select();
        }
        return true;
      }
      return false;
    };

    if (e.key === 'Enter') {
      if (document.activeElement.tagName === 'BUTTON') return;
      
      e.preventDefault();
      const currentIndex = flatOrder.indexOf(currentField);
      
      if (e.shiftKey) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (focusField(flatOrder[i])) return;
        }
      } else {
        for (let i = currentIndex + 1; i < flatOrder.length; i++) {
          if (focusField(flatOrder[i])) return;
        }
      }
      return;
    }

    let r = -1;
    let c = -1;
    for (let i = 0; i < editGrid.length; i++) {
      const colIndex = editGrid[i].indexOf(currentField);
      if (colIndex !== -1) {
        r = i;
        c = colIndex;
        break;
      }
    }

    if (r === -1 || c === -1) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      for (let prevRow = r - 1; prevRow >= 0; prevRow--) {
        const nextCol = Math.min(c, editGrid[prevRow].length - 1);
        const nextField = editGrid[prevRow][nextCol];
        if (focusField(nextField)) return;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      for (let nextRow = r + 1; nextRow < editGrid.length; nextRow++) {
        const nextCol = Math.min(c, editGrid[nextRow].length - 1);
        const nextField = editGrid[nextRow][nextCol];
        if (focusField(nextField)) return;
      }
    } else if (e.key === 'ArrowLeft') {
      const cursorAtStart = active.tagName === 'SELECT' || active.selectionStart === 0 || active.selectionStart === undefined;
      if (cursorAtStart) {
        for (let prevCol = c - 1; prevCol >= 0; prevCol--) {
          const nextField = editGrid[r][prevCol];
          if (focusField(nextField)) {
            e.preventDefault();
            return;
          }
        }
      }
    } else if (e.key === 'ArrowRight') {
      const valLength = active.tagName === 'SELECT' ? 999 : (active.value ? active.value.length : 0);
      const cursorAtEnd = active.tagName === 'SELECT' || active.selectionEnd === valLength || active.selectionEnd === undefined;
      if (cursorAtEnd) {
        for (let nextCol = c + 1; nextCol < editGrid[r].length; nextCol++) {
          const nextField = editGrid[r][nextCol];
          if (focusField(nextField)) {
            e.preventDefault();
            return;
          }
        }
      }
    }
  };

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
  const groups = useMemo(() => {
    return ['All', ...new Set(database.products.map(p => p.group || 'General'))];
  }, [database.products]);
  
  const units = ['kg', 'litre', 'piece', 'nos', 'packet', 'box', 'bag'];

  // Alphanumeric natural sorting comparator
  const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };

  const sortedProducts = useMemo(() => {
    return [...database.products].sort((a, b) => naturalCompare(a.code, b.code));
  }, [database.products]);

  const groupFilteredProducts = useMemo(() => {
    return sortedProducts.filter(p => selectedGroup === 'All' || (p.group || 'General') === selectedGroup);
  }, [sortedProducts, selectedGroup]);

  // Billing-tab style: keep the full sorted list, just find the best match index.
  // visibleProducts = a window of 40 items starting from highlightedIndex.
  // The matched item is always at the top, followed by items in sorted order.
  const filteredProducts = groupFilteredProducts; // full list, never shrinks

  const WINDOW_SIZE = 40;
  const query = searchTerm.trim().toLowerCase();
  // Reset visibleCount on search/group changes
  useEffect(() => {
    setVisibleCount(100);
  }, [searchTerm, selectedGroup]);

  // Handle lazy loading scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 120) {
      setVisibleCount(prev => Math.min(filteredProducts.length, prev + 100));
    }
  };

  const visibleProducts = (highlightedIndex >= 0)
    ? filteredProducts.slice(highlightedIndex, Math.min(filteredProducts.length, highlightedIndex + WINDOW_SIZE))
    : filteredProducts.slice(0, visibleCount);

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
    setEditOpenId(prev => prev + 1); // triggers the initial-focus effect exactly once
  };

  // Ref to track the highlighted row for auto-scrolling
  const activeRowRef = useRef(null);

  // Sync highlightedIndex on search query changes (billing-tab style)
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      setHighlightedIndex(-1);
      setIsTableFocused(false);
      return;
    }

    // Find best match index in the full list
    let idx = filteredProducts.findIndex(p => p.code.toLowerCase() === q);
    if (idx === -1) idx = filteredProducts.findIndex(p => p.code.toLowerCase().startsWith(q));
    if (idx === -1) idx = filteredProducts.findIndex(p => p.code.toLowerCase().includes(q));
    if (idx === -1) idx = filteredProducts.findIndex(p =>
      p.name.toLowerCase().includes(q) ||
      (p.tamilName || '').toLowerCase().includes(q) ||
      (p.group || 'General').toLowerCase().includes(q)
    );

    if (idx !== -1) {
      setHighlightedIndex(idx);
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
      if (isPrintModalOpen) return;
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

      // Table keyboard navigation when focused (navigates the full filteredProducts list)
      if (isTableFocused && filteredProducts.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(filteredProducts.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // highlightedIndex is an index into the full filteredProducts list
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
  }, [isTableFocused, filteredProducts, highlightedIndex, editingProduct, onBack, isPrintModalOpen]);

  // Keep table scrolled to top of sliced window — same as billing tab.
  // Since the highlighted item is always visibleProducts[0], scrollTop=0 always shows it.
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
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
    setEditOpenId(prev => prev + 1); // triggers the initial-focus effect exactly once
  };

  const handleInputChange = (field, value) => {
    setEditingProduct(prev => {
      // Force code always uppercase
      const finalValue = field === 'code' ? (typeof value === 'string' ? value.toUpperCase() : value) : value;
      const updated = { ...prev, [field]: finalValue };
      
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
      updatedSlabs[index] = { ...updatedSlabs[index], offset: value };
      return { ...prev, slabs: updatedSlabs };
    });
  };

  const handleSlabQtyChange = (index, gramsValue) => {
    setEditingProduct(prev => {
      const updatedSlabs = [...prev.slabs];
      const qtyVal = gramsValue === '' ? '' : (parseFloat(gramsValue) / 1000 || 0);
      updatedSlabs[index] = { ...updatedSlabs[index], qtyLimit: qtyVal };
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

    let sanitizedProduct = { ...editingProduct };

    if (sanitizedProduct.priceType === 'Quantity' && sanitizedProduct.slabs && sanitizedProduct.slabs.length > 0) {
      const seenWeights = new Set();
      const duplicateWeights = new Set();
      let hasInvalidSlab = false;

      const sanitizedSlabs = sanitizedProduct.slabs.map(s => {
        const qtyVal = s.qtyLimit === '' ? 0 : parseFloat(s.qtyLimit) || 0;
        const offsetVal = s.offset === '' ? 0 : parseFloat(s.offset) || 0;
        
        const grams = Math.round(qtyVal * 1000);
        if (grams <= 0) {
          hasInvalidSlab = true;
        }
        if (seenWeights.has(grams)) {
          duplicateWeights.add(grams);
        }
        seenWeights.add(grams);

        return { qtyLimit: qtyVal, offset: offsetVal };
      });

      if (hasInvalidSlab) {
        alert('ஸ்லாப் அளவு பூஜ்ஜியத்தை விட அதிகமாக இருக்க வேண்டும்! / Slab quantity must be greater than 0g!');
        return;
      }

      if (duplicateWeights.size > 0) {
        const dupList = Array.from(duplicateWeights).map(g => `${g}g`).join(', ');
        alert(`ஒரே எடையுள்ள பல ஸ்லாப்கள் உள்ளன (${dupList})! நகல்களை நீக்கவும் அல்லது மாற்றவும். / Duplicate slab weights detected (${dupList})! Please remove or change duplicate weights.`);
        return;
      }

      sanitizedProduct.slabs = sanitizedSlabs;
    }

    let updatedProducts = [...database.products];
    
    if (isAddingNew) {
      // Check for duplicate code
      if (database.products.some(p => p.code.toLowerCase() === sanitizedProduct.code.toLowerCase())) {
        alert('இந்த குறியீடு ஏற்கனவே உள்ளது! / This item code already exists!');
        return;
      }
      updatedProducts.push(sanitizedProduct);
    } else {
      updatedProducts = updatedProducts.map(p => p.code === sanitizedProduct.code ? sanitizedProduct : p);
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
    const parsedQty = qty === '' ? 0 : parseFloat(qty) || 0;
    const parsedOffset = offset === '' ? 0 : parseFloat(offset) || 0;
    const effectiveRate = basePrice + parsedOffset;
    return (effectiveRate * parsedQty).toFixed(2);
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
                  setSearchTerm(e.target.value.toUpperCase());
                  setHighlightedIndex(-1);
                  setIsTableFocused(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'ArrowDown') {
                    if (filteredProducts.length > 0) {
                      e.preventDefault();
                      // highlightedIndex is already set correctly by the useEffect;
                      // just activate table focus so Enter/arrows work on the table.
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
          <div ref={tableContainerRef} className="table-container" style={{ flex: 1 }} onScroll={handleScroll}>
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
                {visibleProducts.map((p) => {
                  // isHighlighted: compare by code against the item at highlightedIndex in the full list
                  const isHighlighted = filteredProducts[highlightedIndex]?.code === p.code;
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
                        // Find true index in full list and open edit
                        const trueIdx = filteredProducts.findIndex(x => x.code === p.code);
                        setHighlightedIndex(trueIdx);
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
                            const trueIdx = filteredProducts.findIndex(x => x.code === p.code);
                            setHighlightedIndex(trueIdx);
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
                {visibleProducts.length === 0 && (
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
          <div 
            className="pos-card screen-fade" 
            style={{ flex: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: '3px solid var(--primary)' }}
            onKeyDown={handleEditFormKeyDown}
          >
            
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
                    ref={formRefs.code}
                    value={editingProduct.code}
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">பிரிவு / Group</span>
                  <input 
                    type="text" 
                    className="pos-input" 
                    ref={formRefs.group}
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
                  ref={formRefs.name}
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-label">பொருள் (தமிழ்) / Tamil Name</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  ref={formRefs.tamilName}
                  value={editingProduct.tamilName}
                  onChange={(e) => handleInputChange('tamilName', e.target.value)}
                />
              </div>

              {/* Row 3: Unit and Price Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <span className="input-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>அலகு / Unit</span>
                    {dropdownEditMode && document.activeElement === formRefs.unit.current && (
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(37,99,235,0.1)', padding: '1px 6px', borderRadius: '4px' }}>↑↓ select · ↵ confirm</span>
                    )}
                    {!dropdownEditMode && document.activeElement === formRefs.unit.current && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '1px 6px', borderRadius: '4px' }}>↵ to edit</span>
                    )}
                  </span>
                  <select 
                    className="pos-input" 
                    ref={formRefs.unit}
                    value={editingProduct.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    onFocus={() => setDropdownEditMode(false)}
                    onBlur={() => setDropdownEditMode(false)}
                    style={{
                      outline: dropdownEditMode && document.activeElement === formRefs.unit.current
                        ? '2px solid var(--primary)' : undefined,
                      pointerEvents: dropdownEditMode && document.activeElement === formRefs.unit.current ? 'auto' : 'none'
                    }}
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <span className="input-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>விலை வகை / Price Type</span>
                    {dropdownEditMode && document.activeElement === formRefs.priceType.current && (
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(37,99,235,0.1)', padding: '1px 6px', borderRadius: '4px' }}>↑↓ select · ↵ confirm</span>
                    )}
                    {!dropdownEditMode && document.activeElement === formRefs.priceType.current && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '1px 6px', borderRadius: '4px' }}>↵ to edit</span>
                    )}
                  </span>
                  <select 
                    className="pos-input" 
                    ref={formRefs.priceType}
                    value={editingProduct.priceType}
                    onChange={(e) => handleInputChange('priceType', e.target.value)}
                    onFocus={() => setDropdownEditMode(false)}
                    onBlur={() => setDropdownEditMode(false)}
                    style={{
                      outline: dropdownEditMode && document.activeElement === formRefs.priceType.current
                        ? '2px solid var(--primary)' : undefined,
                      pointerEvents: dropdownEditMode && document.activeElement === formRefs.priceType.current ? 'auto' : 'none'
                    }}
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
                    ref={formRefs.billItem}
                    checked={editingProduct.billItem} 
                    onChange={(e) => handleInputChange('billItem', e.target.checked)}
                  />
                  Bill Item
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    ref={formRefs.salableItem}
                    checked={editingProduct.salableItem} 
                    onChange={(e) => handleInputChange('salableItem', e.target.checked)}
                  />
                  Salable Item
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: editingProduct.disableItem ? 'var(--error)' : 'inherit' }}>
                  <input 
                    type="checkbox" 
                    ref={formRefs.disableItem}
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
                    ref={formRefs.sellingPrice}
                    value={editingProduct.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">நிகர விலை / Net Price</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    ref={formRefs.netPrice}
                    value={editingProduct.netPrice}
                    onChange={(e) => handleInputChange('netPrice', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
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
                    ref={formRefs.mrp}
                    value={editingProduct.mrp}
                    onChange={(e) => handleInputChange('mrp', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">அசல் விலை / Cost Price</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="pos-input mono" 
                    ref={formRefs.costPrice}
                    value={editingProduct.costPrice}
                    onChange={(e) => handleInputChange('costPrice', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
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
                    ref={formRefs.openingStock}
                    value={editingProduct.openingStock}
                    onChange={(e) => handleInputChange('openingStock', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label">தற்போதைய இருப்பு / Current Stock</span>
                  <input 
                    type="number" 
                    className="pos-input mono" 
                    ref={formRefs.currentStock}
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
                            value={s.qtyLimit === '' ? '' : Math.round(s.qtyLimit * 1000)}
                            onChange={(e) => handleSlabQtyChange(index, e.target.value)}
                            onFocus={(e) => e.target.select()}
                          />
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>g</span>
                        </div>
                        
                        {/* Offset Input */}
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="number" 
                            className="pos-input mono" 
                            style={{ paddingRight: '14px', paddingLeft: '6px', height: '32px', fontSize: '12px' }}
                            value={s.offset === '' ? '' : s.offset}
                            onChange={(e) => handleSlabOffsetChange(index, e.target.value)}
                            onFocus={(e) => e.target.select()}
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
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '10px' }} 
                ref={formRefs.btnCancel}
                onClick={() => setEditingProduct(null)}
              >
                ரத்து செய் / Cancel
              </button>
              <button 
                className="btn-success" 
                style={{ flex: 1, padding: '10px' }} 
                ref={formRefs.btnSave}
                onClick={handleSave}
              >
                <Save size={16} /> சேமி / Save
              </button>
            </div>

          </div>
        )}


      </div>
    </div>
  );
}
