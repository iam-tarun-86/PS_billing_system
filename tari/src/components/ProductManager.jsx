import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, ArrowLeft, Layers, Percent, Box, Save, X, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils/csv';
import { UNIT_OPTIONS, isUnresolvedUnit, isMeasuredUnit, unitLabel } from '../utils/units';
import { searchProducts } from '../utils/productSearch';
import { isTauri, tauriAPI } from '../utils/tauriBridge';

export default function ProductManager({ database, onUpdateDatabase, onBack, isPrintModalOpen }) {
  const logInfo = (msg) => {
    if (isTauri()) {
      tauriAPI.logMessage('info', msg);
    } else if (window.electronAPI && window.electronAPI.logMessage) {
      window.electronAPI.logMessage('info', msg);
    }
  };

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
    btnCancel: useRef(null),
    btnSave: useRef(null)
  };

  const slabQtyRefs = useRef([]);
  const slabOffsetRefs = useRef([]);
  const btnAddSlabRef = useRef(null);
  const btnDeleteSlabRefs = useRef([]);

  // Focus first editable input when the edit panel OPENS.
  // Depends on editOpenId (not editingProduct) so it fires exactly once per open,
  // never when the user is typing and updating editingProduct state.
  useEffect(() => {
    if (editOpenId === 0) return; // skip initial mount
    setTimeout(() => {
      // The code is the first field either way now. Editing used to skip to the
      // group because the code was locked; it no longer is.
      const target = formRefs.code.current || formRefs.group.current;
      if (!target) return;
      target.focus();
      // A <select> has no select(); only text inputs do, and group is a dropdown.
      if (typeof target.select === 'function') target.select();
    }, 100);
  }, [editOpenId]);

  const handleEditFormKeyDown = (e) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'];
    if (!keys.includes(e.key)) return;

    const active = document.activeElement;

    // ── Build Dynamic Grid and Flat Order including Slabs ──────────────────────
    const editGrid = [
      ['code', 'group'],
      ['name'],
      ['tamilName'],
      ['unit', 'priceType'],
      ['billItem', 'salableItem', 'disableItem'],
      ['sellingPrice', 'netPrice'],
      ['mrp', 'costPrice']
    ];

    const flatOrder = [
      'code', 'group',
      'name',
      'tamilName',
      'unit', 'priceType',
      'billItem', 'salableItem', 'disableItem',
      'sellingPrice', 'netPrice',
      'mrp', 'costPrice'
    ];

    if (editingProduct && editingProduct.priceType === 'Quantity') {
      editGrid.push(['btnAddSlab']);
      flatOrder.push('btnAddSlab');
      (editingProduct.slabs || []).forEach((_, sIdx) => {
        editGrid.push([`slabQty_${sIdx}`, `slabOffset_${sIdx}`, `slabDelete_${sIdx}`]);
        flatOrder.push(`slabQty_${sIdx}`, `slabOffset_${sIdx}`);
      });
    }

    editGrid.push(['btnCancel', 'btnSave']);
    flatOrder.push('btnCancel', 'btnSave');

    const focusField = (field) => {
      if (!field) return false;
      if (field === 'btnAddSlab') {
        if (btnAddSlabRef.current) {
          btnAddSlabRef.current.focus();
          return true;
        }
        return false;
      }
      if (field.startsWith('slabQty_')) {
        const idx = parseInt(field.replace('slabQty_', ''), 10);
        const el = slabQtyRefs.current[idx];
        if (el) {
          el.focus();
          if (typeof el.select === 'function') el.select();
          return true;
        }
        return false;
      }
      if (field.startsWith('slabOffset_')) {
        const idx = parseInt(field.replace('slabOffset_', ''), 10);
        const el = slabOffsetRefs.current[idx];
        if (el) {
          el.focus();
          if (typeof el.select === 'function') el.select();
          return true;
        }
        return false;
      }
      if (field.startsWith('slabDelete_')) {
        const idx = parseInt(field.replace('slabDelete_', ''), 10);
        const el = btnDeleteSlabRefs.current[idx];
        if (el) {
          el.focus();
          return true;
        }
        return false;
      }
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
          let currentField = null;
          for (const [key, ref] of Object.entries(formRefs)) {
            if (ref.current === active) { currentField = key; break; }
          }
          if (currentField) {
            const ci = flatOrder.indexOf(currentField);
            for (let i = ci + 1; i < flatOrder.length; i++) {
              if (focusField(flatOrder[i])) return;
            }
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
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
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Only protect ArrowLeft / ArrowRight inside text inputs (like name) when cursor is in the middle
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && active.tagName !== 'SELECT') {
      if (active.type === 'text') {
        const atStart = active.selectionStart === 0 && active.selectionEnd === 0;
        const atEnd = active.selectionStart === active.value.length && active.selectionEnd === active.value.length;
        if (e.key === 'ArrowLeft' && !atStart) return;
        if (e.key === 'ArrowRight' && !atEnd) return;
      }
    }

    // Find current active field
    let currentField = null;
    if (btnAddSlabRef.current === active) {
      currentField = 'btnAddSlab';
    } else {
      for (let i = 0; i < slabQtyRefs.current.length; i++) {
        if (slabQtyRefs.current[i] === active) {
          currentField = `slabQty_${i}`;
          break;
        }
        if (slabOffsetRefs.current[i] === active) {
          currentField = `slabOffset_${i}`;
          break;
        }
        if (btnDeleteSlabRefs.current[i] === active) {
          currentField = `slabDelete_${i}`;
          break;
        }
      }
    }

    if (!currentField) {
      for (const [key, ref] of Object.entries(formRefs)) {
        if (ref.current === active) {
          currentField = key;
          break;
        }
      }
    }

    if (!currentField) return;

    if (e.key === 'Enter' && active.tagName !== 'BUTTON') {
      e.preventDefault();
      const currentIndex = flatOrder.indexOf(currentField);
      if (currentIndex !== -1 && currentIndex + 1 < flatOrder.length) {
        focusField(flatOrder[currentIndex + 1]);
        return;
      }
    }

    // ── Dedicated Slab Section Navigation (Guarantees smooth traversal) ────────
    if (currentField.startsWith('slabQty_')) {
      const idx = parseInt(currentField.replace('slabQty_', ''), 10);
      const slabCount = (editingProduct?.slabs || []).length;
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        focusField(`slabOffset_${idx}`);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx + 1 < slabCount) focusField(`slabQty_${idx + 1}`);
        else focusField('btnCancel');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) focusField(`slabQty_${idx - 1}`);
        else focusField('btnAddSlab');
        return;
      }
    }

    if (currentField.startsWith('slabOffset_')) {
      const idx = parseInt(currentField.replace('slabOffset_', ''), 10);
      const slabCount = (editingProduct?.slabs || []).length;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusField(`slabQty_${idx}`);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusField(`slabDelete_${idx}`);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (idx + 1 < slabCount) focusField(`slabQty_${idx + 1}`);
        else focusField('btnSave');
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx + 1 < slabCount) focusField(`slabOffset_${idx + 1}`);
        else focusField('btnSave');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) focusField(`slabOffset_${idx - 1}`);
        else focusField('btnAddSlab');
        return;
      }
    }

    if (currentField.startsWith('slabDelete_')) {
      const idx = parseInt(currentField.replace('slabDelete_', ''), 10);
      const slabCount = (editingProduct?.slabs || []).length;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDeleteSlab(idx);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusField(`slabOffset_${idx}`);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx + 1 < slabCount) focusField(`slabDelete_${idx + 1}`);
        else focusField('btnSave');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) focusField(`slabDelete_${idx - 1}`);
        else focusField('btnAddSlab');
        return;
      }
    }

    if (currentField === 'btnAddSlab') {
      const slabCount = (editingProduct?.slabs || []).length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (slabCount > 0) focusField('slabQty_0');
        else focusField('btnCancel');
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusField('costPrice');
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSlab();
        setTimeout(() => {
          const newIdx = (editingProduct?.slabs || []).length;
          focusField(`slabQty_${newIdx}`);
        }, 60);
        return;
      }
    }

    if (currentField === 'costPrice' || currentField === 'mrp') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (editingProduct?.priceType === 'Quantity') {
          focusField('btnAddSlab');
        } else {
          focusField('btnCancel');
        }
        return;
      }
    }

    if (currentField === 'btnCancel') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const slabCount = (editingProduct?.slabs || []).length;
        if (editingProduct?.priceType === 'Quantity' && slabCount > 0) {
          focusField(`slabQty_${slabCount - 1}`);
        } else {
          focusField('costPrice');
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusField('btnSave');
        return;
      }
    }

    if (currentField === 'btnSave') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const slabCount = (editingProduct?.slabs || []).length;
        if (editingProduct?.priceType === 'Quantity' && slabCount > 0) {
          focusField(`slabOffset_${slabCount - 1}`);
        } else {
          focusField('costPrice');
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusField('btnCancel');
        return;
      }
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
      for (let prevCol = c - 1; prevCol >= 0; prevCol--) {
        const nextField = editGrid[r][prevCol];
        if (focusField(nextField)) {
          e.preventDefault();
          return;
        }
      }
    } else if (e.key === 'ArrowRight') {
      for (let nextCol = c + 1; nextCol < editGrid[r].length; nextCol++) {
        const nextField = editGrid[r][nextCol];
        if (focusField(nextField)) {
          e.preventDefault();
          return;
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

  // The groups a product can be filed under, for the edit form. 'General' is
  // always offered because a new product starts there.
  const groupOptions = useMemo(() => {
    const set = new Set(database.products.map(p => p.group || 'General'));
    set.add('General');
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [database.products]);
  
  const units = UNIT_OPTIONS;

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

  // Same rule as the billing screen: a code query jumps within the full list so
  // neighbouring codes stay reachable, a name query filters. Keeping the two
  // screens identical means one habit works everywhere.
  const search = useMemo(
    () => searchProducts(groupFilteredProducts, searchTerm),
    [groupFilteredProducts, searchTerm]
  );
  const filteredProducts = search.list;

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

  const visibleProducts = filteredProducts.slice(0, visibleCount);

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
    
    // Remembered so a renamed code can still find the row it belongs to, and so
    // the duplicate check knows which product to exclude from the comparison.
    cloned.originalCode = product.code;

    setEditingProduct(cloned);
    setIsAddingNew(false);
    setEditOpenId(prev => prev + 1); // triggers the initial-focus effect exactly once
  };

  // Ref to track the highlighted row for auto-scrolling
  const activeRowRef = useRef(null);
  // Holds the row index a query change is aiming at, so the scroll below can tell
  // a jump from an arrow key. Same approach as the billing overlay: it stores the
  // target rather than a flag, because the scroll effect also fires on the render
  // before the highlight has moved.
  const pendingJumpScrollRef = useRef(null);

  // Sync highlightedIndex on search query changes
  useEffect(() => {
    if (search.mode === 'browse' || filteredProducts.length === 0) {
      setHighlightedIndex(-1);
      setIsTableFocused(false);
      return;
    }

    const idx = search.index >= 0 ? search.index : 0;
    pendingJumpScrollRef.current = idx;
    setHighlightedIndex(idx);
    setIsTableFocused(true);

    // A code jump can land far down the catalogue - M.77 sits at index 1,059 -
    // well past the 100 rows rendered by default, so widen the window or the
    // highlighted row would not exist to scroll to.
    setVisibleCount(vc => Math.max(vc, idx + 50));
  }, [search, selectedGroup, filteredProducts]);

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
          pendingJumpScrollRef.current = null;
          setHighlightedIndex(prev => {
            const nextIdx = Math.min(filteredProducts.length - 1, prev + 1);
            if (nextIdx >= visibleCount - 10) {
              setVisibleCount(vc => Math.min(filteredProducts.length, vc + 50));
            }
            return nextIdx;
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          pendingJumpScrollRef.current = null;
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
  }, [isTableFocused, filteredProducts, highlightedIndex, editingProduct, onBack, isPrintModalOpen, visibleCount]);

  // Scroll the highlighted row into view.
  //
  // A jump - the query just changed - puts the match at the top of the table so
  // the rest of its code family fills the screen below it. Arrowing afterwards
  // stays on 'nearest', or the cursor would be re-pinned to the top on every
  // keypress and the rows above it could never be seen.
  useEffect(() => {
    if (!activeRowRef.current) return;

    const isJump = pendingJumpScrollRef.current === highlightedIndex;
    if (isJump) pendingJumpScrollRef.current = null;

    // The header is sticky, so a row scrolled to the start lands underneath it.
    // Measure how far down content must begin to clear it - from the top of the
    // scrolling box to the bottom of the header cell, which is a few pixels more
    // than the header's own height because of the table borders - and hand that
    // to the CSS. It changes with the window, so it cannot be a constant.
    const table = activeRowRef.current.closest('table');
    const headerCell = table && table.querySelector('thead th');
    let scrollBox = activeRowRef.current.parentElement;
    while (scrollBox && scrollBox.scrollHeight <= scrollBox.clientHeight + 2) {
      scrollBox = scrollBox.parentElement;
    }
    if (table && headerCell && scrollBox) {
      const clearance = Math.round(
        headerCell.getBoundingClientRect().bottom - scrollBox.getBoundingClientRect().top
      );
      if (clearance > 0) {
        table.style.setProperty('--search-header-height', clearance + 'px');
      }
    }

    activeRowRef.current.scrollIntoView({
      block: isJump ? 'start' : 'nearest',
      inline: 'nearest'
    });
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
      
      // Choosing kg or litre means the product is billed in fractions, so the price type
      // follows automatically. Leaving them out of step is what stopped weighed goods
      // from taking a decimal quantity at the counter.
      if (field === 'unit' && isMeasuredUnit(value)) {
        updated.priceType = 'Quantity';
      }

      // If priceType transitions to Quantity, ensure slabs are configured
      if (((field === 'priceType' && value === 'Quantity') ||
           (field === 'unit' && isMeasuredUnit(value))) &&
          (!updated.slabs || updated.slabs.length === 0)) {
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

  const handleDeleteSlab = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updatedSlabs = (editingProduct?.slabs || []).filter((_, i) => i !== index);
    setEditingProduct(prev => ({ ...prev, slabs: updatedSlabs }));
    setTimeout(() => {
      if (updatedSlabs.length > 0) {
        const nextIdx = Math.min(index, updatedSlabs.length - 1);
        if (slabQtyRefs.current[nextIdx]) {
          slabQtyRefs.current[nextIdx].focus();
          if (typeof slabQtyRefs.current[nextIdx].select === 'function') {
            slabQtyRefs.current[nextIdx].select();
          }
        }
      } else if (btnAddSlabRef.current) {
        btnAddSlabRef.current.focus();
      }
    }, 60);
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

    // Codes can be edited, so the duplicate check has to cover renaming as well
    // as adding. The product being edited is excluded by its ORIGINAL code, so
    // saving without changing the code is not treated as a clash with itself.
    const newCode = String(sanitizedProduct.code).trim();
    const originalCode = sanitizedProduct.originalCode;

    const clashes = database.products.some(
      p => p.code.toLowerCase() === newCode.toLowerCase() && p.code !== originalCode
    );

    if (clashes) {
      alert('⚠️ இந்த குறியீடு ஏற்கனவே உள்ளது! / This item code already exists!');
      setTimeout(() => {
        if (formRefs.code.current) {
          formRefs.code.current.focus();
          if (typeof formRefs.code.current.select === 'function') {
            formRefs.code.current.select();
          }
        }
      }, 0);
      return; // modal stays open, nothing is written
    }

    // originalCode is bookkeeping for the form, not part of the product record.
    const { originalCode: _originalCode, ...productToSave } = sanitizedProduct;

    const updatedProducts = isAddingNew
      ? [...database.products, productToSave]
      : database.products.map(p => (p.code === originalCode ? productToSave : p));

    // Bills store the item code, not a reference to the product, so renaming a
    // code would leave every bill that used it pointing at something that no
    // longer exists - reprints would lose the unit and price type, and deleting
    // such a bill would silently fail to put the stock back. Carry the rename
    // through the saved bills so the two stay in step.
    const isRename = !isAddingNew && originalCode && originalCode !== newCode;
    let updatedTransactions = database.transactions;
    let renamedLines = 0;

    if (isRename) {
      const matchesOld = (item) =>
        String((item && item.code) || '').toLowerCase() === String(originalCode).toLowerCase();

      updatedTransactions = (database.transactions || []).map(tx => {
        if (!Array.isArray(tx.items) || !tx.items.some(matchesOld)) return tx;
        return {
          ...tx,
          items: tx.items.map(item => {
            if (!matchesOld(item)) return item;
            renamedLines++;
            return { ...item, code: newCode };
          })
        };
      });

      logInfo(
        `Product code renamed ${originalCode} -> ${newCode}. ` +
        `Updated ${renamedLines} line item(s) across saved bills.`
      );
    }

    onUpdateDatabase({
      ...database,
      products: updatedProducts,
      // Only replaced when a rename actually happened, so an ordinary edit does
      // not rewrite the whole transaction array.
      ...(isRename ? { transactions: updatedTransactions } : {})
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
            <table className="pos-table product-list-table">
              <thead>
                <tr style={{ background: 'linear-gradient(180deg, #15803d 0%, #166534 100%)' }}>
                  <th style={{ width: '80px', background: '#15803d', color: '#ffffff' }}>குறியீடு / Code</th>
                  <th style={{ background: '#15803d', color: '#ffffff' }}>தமிழ் பெயர் / Tamil Name</th>
                  <th style={{ background: '#15803d', color: '#ffffff' }}>பொருள் / Product Name (Eng)</th>
                  <th style={{ width: '70px', textAlign: 'center', background: '#15803d', color: '#ffffff' }}>Unit</th>
                  <th style={{ width: '90px', textAlign: 'right', background: '#15803d', color: '#ffffff' }}>விலை / Rate</th>
                  <th style={{ width: '80px', textAlign: 'center', background: '#15803d', color: '#ffffff' }}>செயல்கள் / Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((p) => {
                  const isHighlighted = filteredProducts[highlightedIndex]?.code === p.code;
                  const isActive = editingProduct?.code === p.code;

                  return (
                    <tr 
                      key={p.code} 
                      ref={isHighlighted ? activeRowRef : null}
                      className={isHighlighted ? 'active-product-row' : isActive ? 'active-row' : ''} 
                      style={{ 
                        cursor: 'pointer',
                        background: isHighlighted ? '#1d4ed8' : isActive ? 'rgba(37, 99, 235, 0.05)' : undefined,
                        color: isHighlighted ? '#ffffff' : undefined
                      }} 
                      onClick={() => {
                        const trueIdx = filteredProducts.findIndex(x => x.code === p.code);
                        setHighlightedIndex(trueIdx);
                        setIsTableFocused(false);
                        handleEditClick(p);
                      }}
                    >
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: isHighlighted ? 'bold' : 'normal', color: isHighlighted ? '#ffffff' : undefined }}>{p.code}</td>
                      <td style={{ fontWeight: '600', color: isHighlighted ? '#ffffff' : undefined }}>{p.tamilName || '-'}</td>
                      <td style={{ color: isHighlighted ? '#ffffff' : undefined }}>{p.name}</td>
                      <td style={{ textAlign: 'center', color: isHighlighted ? '#ffffff' : undefined }}>
                        <span style={{ 
                          background: isHighlighted ? 'rgba(255,255,255,0.2)' : 'var(--border-color)', 
                          color: isHighlighted ? '#ffffff' : 'inherit',
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '12px' 
                        }}>{unitLabel(p.unit)}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: isHighlighted ? 'bold' : 'normal', color: isHighlighted ? '#ffffff' : undefined }}>₹{p.sellingPrice.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button className="btn-ghost" style={{ padding: '4px', color: isHighlighted ? '#ffffff' : 'inherit' }} onClick={() => {
                            const trueIdx = filteredProducts.findIndex(x => x.code === p.code);
                            setHighlightedIndex(trueIdx);
                            setIsTableFocused(false);
                            handleEditClick(p);
                          }}>
                            <Edit size={14} />
                          </button>
                          <button className="btn-ghost" style={{ padding: '4px', color: isHighlighted ? '#fca5a5' : 'var(--error)' }} onClick={() => handleDelete(p.code)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
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
                    ref={formRefs.code}
                    value={editingProduct.code}
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>பிரிவு / Group</span>
                    {dropdownEditMode && document.activeElement === formRefs.group.current && (
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(37,99,235,0.1)', padding: '1px 6px', borderRadius: '4px' }}>↑↓ select · ↵ confirm</span>
                    )}
                    {!dropdownEditMode && document.activeElement === formRefs.group.current && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '1px 6px', borderRadius: '4px' }}>↵ to edit</span>
                    )}
                  </span>
                  <select 
                    className="pos-input" 
                    ref={formRefs.group}
                    value={editingProduct.group || 'General'}
                    onChange={(e) => handleInputChange('group', e.target.value)}
                    onFocus={() => setDropdownEditMode(false)}
                    onBlur={() => setDropdownEditMode(false)}
                    style={{
                      outline: dropdownEditMode && document.activeElement === formRefs.group.current
                        ? '2px solid var(--primary)' : undefined,
                      pointerEvents: dropdownEditMode && document.activeElement === formRefs.group.current ? 'auto' : 'none'
                    }}
                  >
                    {/* Keep an unknown group selectable rather than silently
                        switching the product to something else. */}
                    {editingProduct.group && !groupOptions.includes(editingProduct.group) && (
                      <option value={editingProduct.group}>{editingProduct.group}</option>
                    )}
                    {groupOptions.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
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
                    {isUnresolvedUnit(editingProduct.unit) && (
                      <option value={editingProduct.unit}>{unitLabel(editingProduct.unit)}</option>
                    )}
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

              {/* Special Inline Slab Configuration (For Qty Items only) */}
              {editingProduct.priceType === 'Quantity' && (
                <div style={{ marginTop: '10px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} /> ஸ்லாப் விலை விவரம் / Slab Pricing Details
                    </h4>
                    <button 
                      ref={btnAddSlabRef}
                      type="button" 
                      className="btn-slab-add" 
                      style={{ 
                        padding: '4px 14px', 
                        fontSize: '12px', 
                        height: '28px', 
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }} 
                      onClick={handleAddSlab}
                    >
                      <Plus size={13} /> சேர்க்க / Add
                    </button>
                  </div>
                  
                  {/* Table headers for slabs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.9fr 75px', gap: '8px', marginBottom: '6px', fontSize: '10px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                    <span>அளவு / Qty (Grams)</span>
                    <span>வித்தியாசம் / Offset (₹)</span>
                    <span style={{ textAlign: 'right' }}>விலை / Price</span>
                    <span style={{ textAlign: 'center' }}>செயல் / Action</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {editingProduct.slabs.map((s, index) => (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.9fr 75px', gap: '8px', alignItems: 'center' }}>
                        {/* Grams Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input 
                            ref={el => slabQtyRefs.current[index] = el}
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
                            ref={el => slabOffsetRefs.current[index] = el}
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
                          ref={el => btnDeleteSlabRefs.current[index] = el}
                          type="button" 
                          className="btn-slab-delete" 
                          style={{ 
                            height: '30px', 
                            padding: '0 6px', 
                            fontSize: '11px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => handleDeleteSlab(index, e)}
                        >
                          <Trash2 size={12} /> நீக்கு
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
                type="button"
                className="btn-secondary btn-modal-nav" 
                style={{ 
                  flex: 1, 
                  padding: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }} 
                ref={formRefs.btnCancel}
                onClick={() => setEditingProduct(null)}
              >
                ரத்து செய் / Cancel
              </button>
              <button 
                type="button"
                className="btn-success btn-modal-nav" 
                style={{ 
                  flex: 1, 
                  padding: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }} 
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
