import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Save, Trash2, Moon, Sun, ShoppingCart, User, Key, Database, Archive, Folder, LogOut } from 'lucide-react';
import { isTauri, tauriAPI } from '../utils/tauriBridge';
import { round2 } from '../utils/normalize';
import { billingUnitLabel, unitLabel } from '../utils/units';
import { searchProducts } from '../utils/productSearch';

export default function BillingDashboard({ 
  database, 
  onUpdateDatabase, 
  onLogOut, 
  onNavigateToInventory, 
  onNavigateToHistory,
  onPrintReceipt,
  isPrintModalOpen
}) {
  const logInfo = (msg) => {
    if (isTauri()) {
      tauriAPI.logMessage('info', msg);
    } else if (window.electronAPI && window.electronAPI.logMessage) {
      window.electronAPI.logMessage('info', msg);
    }
  };
  const logError = (msg) => {
    if (isTauri()) {
      tauriAPI.logMessage('error', msg);
    } else if (window.electronAPI && window.electronAPI.logMessage) {
      window.electronAPI.logMessage('error', msg);
    }
  };

  const [billItems, setBillItems] = useState([createEmptyRow()]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [activeColumn, setActiveColumn] = useState('code'); // 'code' | 'qty' | 'rate'
  const [duplicateState, setDuplicateState] = useState({
    isOpen: false,
    product: null,
    rowIndex: null,
    existingRowIndex: null,
    selectedOption: 0
  });

  useEffect(() => {
    logInfo('BillingDashboard mounted');
  }, []);
  
  const getTodayStats = () => {
    if (!database || !database.transactions) return { total: 0, count: 0 };
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const todayStr = `${dd}/${mm}/${yyyy}`;
    const todayTx = database.transactions.filter(t => t.date === todayStr);
    const total = todayTx.reduce((acc, t) => acc + (parseFloat(t.netTotal) || 0), 0);
    return {
      total,
      count: todayTx.length
    };
  };

  // The next number comes from a stored counter, never from how many bills exist today.
  // Counting rows meant a deleted bill handed its number straight to the next customer,
  // which is how 1,817 of the 1,850 imported bills ended up sharing a number.
  const getNextBillNumber = () => {
    if (!database) return 1;
    const todayStr = getTodayDateString();
    const counter = database.settings?.billCounter;

    if (counter && counter.date === todayStr) {
      return counter.next;
    }

    // First bill of the day, or a database that predates the counter. Start after the
    // highest number already printed today so a live number is never reissued.
    const todayTx = (database.transactions || []).filter(t => t.date === todayStr);
    if (todayTx.length === 0) return 1;
    return Math.max(...todayTx.map(t => Number(t.invoiceNo) || 0)) + 1;
  };

  const getTodayDateString = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Header clock state
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Customer details
  const [customerSlNo, setCustomerSlNo] = useState(() => {
    return getNextBillNumber().toString();
  });
  const [customerType, setCustomerType] = useState('CASH');
  const [customerName, setCustomerName] = useState('CASH');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  
  // Controls
  const [rwMode, setRwMode] = useState('R');
  const [pricingMode, setPricingMode] = useState('R');

  // Other Charges
  const [discount, setDiscount] = useState('');
  const [rent, setRent] = useState('');
  const [coolie, setCoolie] = useState('');
  const [advance, setAdvance] = useState('');

  // Item Search Overlay State
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(0);

  // Billing Hold Bins
  const [heldBills, setHeldBills] = useState([]);

  // Viewing past bills
  const [viewingTxIndex, setViewingTxIndex] = useState(null);
  const [isEditingSavedBill, setIsEditingSavedBill] = useState(false);
  const [draftBill, setDraftBill] = useState(null);

  // Saved bill button navigation: 0 = Tamil Print, 1 = English Print, 2 = Edit/Save
  const [activeBottomBtnIndex, setActiveBottomBtnIndex] = useState(2);
  const bottomBtnRefs = {
    tamilPrint: useRef(null),
    englishPrint: useRef(null),
    editSave: useRef(null)
  };

  // Menu bar dropdown visibility
  const [activeMenu, setActiveMenu] = useState(null);

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Refs for focusing inputs
  const codeRefs = useRef([]);
  const qtyRefs = useRef([]);
  const rateRefs = useRef([]);
  const searchInputRef = useRef(null);
  const activeSearchRowRef = useRef(null);
  const overlayTableContainerRef = useRef(null);
  // Used to trigger a save+print after async draft-restore completes
  const pendingPrintRef = useRef(null);
  // Blocks a second save while one is in flight (held key, double tap, fast repeat)
  const isSavingRef = useRef(false);

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'P.M' : 'A.M';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      const strTime = hours + ':' + minutes + ampm;
      setCurrentTime(strTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep the on-screen bill number in step with the stored counter. Skipped while a
  // saved bill is on screen, so viewing history never overwrites its printed number.
  useEffect(() => {
    if (!database) return;
    if (viewingTxIndex !== null) return;
    setCustomerSlNo(getNextBillNumber().toString());
  }, [
    database?.settings?.billCounter?.date,
    database?.settings?.billCounter?.next,
    database?.transactions?.length,
    viewingTxIndex
  ]);

  // Sync refs array length
  useEffect(() => {
    codeRefs.current = codeRefs.current.slice(0, billItems.length);
    qtyRefs.current = qtyRefs.current.slice(0, billItems.length);
    rateRefs.current = rateRefs.current.slice(0, billItems.length);
  }, [billItems]);

  // Auto-focus active bottom button when viewing a saved bill in read-only mode
  useEffect(() => {
    if (viewingTxIndex !== null && !isEditingSavedBill) {
      const btnRef = activeBottomBtnIndex === 0 
        ? bottomBtnRefs.tamilPrint.current 
        : activeBottomBtnIndex === 1 
          ? bottomBtnRefs.englishPrint.current 
          : bottomBtnRefs.editSave.current;
      if (btnRef) {
        btnRef.focus();
      }
    }
  }, [viewingTxIndex, isEditingSavedBill, activeBottomBtnIndex]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isPrintModalOpen || duplicateState.isOpen) return;

      // A held or auto-repeating settle key must never start a second bill.
      if (e.repeat && (e.key === 'F10' || e.key === 'F11' || e.key === 'F12')) return;

      // Avoid shortcuts when typing in search overlay query
      if (showSearchOverlay) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
        }
        return;
      }

      // When viewing a saved bill in read-only mode, capture arrow keys and Enter to navigate and trigger the bottom action buttons
      if (viewingTxIndex !== null && !isEditingSavedBill) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setActiveBottomBtnIndex(prev => Math.max(0, prev - 1));
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setActiveBottomBtnIndex(prev => Math.min(2, prev + 1));
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (activeBottomBtnIndex === 0) {
            onPrintReceipt(database.transactions[viewingTxIndex], 'tamil');
          } else if (activeBottomBtnIndex === 1) {
            onPrintReceipt(database.transactions[viewingTxIndex], 'english');
          } else if (activeBottomBtnIndex === 2) {
            handleStartEditSavedBill();
          }
          return;
        }
      }

      // F10: Save Bill (without printing)
      if (e.key === 'F10') {
        e.preventDefault();
        // A saved bill on screen is read-only until Edit is pressed, exactly as F11/F12
        // already treat it. Without this, PageUp then F10 silently rewrote the bill.
        if (viewingTxIndex !== null && !isEditingSavedBill) return;
        handleSettleBill('save');
      }

      // F11: Settle & Print in Tamil
      if (e.key === 'F11') {
        e.preventDefault();
        if (viewingTxIndex !== null && !isEditingSavedBill) {
          onPrintReceipt(database.transactions[viewingTxIndex], 'tamil');
        } else {
          handleSettleBill('tamil');
        }
      }

      // F12: Settle & Print in English
      if (e.key === 'F12') {
        e.preventDefault();
        if (viewingTxIndex !== null && !isEditingSavedBill) {
          onPrintReceipt(database.transactions[viewingTxIndex], 'english');
        } else {
          handleSettleBill('english');
        }
      }

      // F9: Clear / restore draft
      if (e.key === 'F9') {
        e.preventDefault();
        if (viewingTxIndex !== null && draftBill) {
          // In viewing mode with a saved draft — restore it
          restoreDraft(draftBill);
        } else {
          if (confirm('நிச்சயமாக இந்த பில்லை அழிக்க வேண்டுமா? / Clear current bill?')) {
            setViewingTxIndex(null);
            setDraftBill(null);
            handleClearBill();
          }
        }
      }

      // Escape: Exit edit/view mode and start a new fresh bill
      if (e.key === 'Escape') {
        if (viewingTxIndex !== null) {
          e.preventDefault();
          if (isEditingSavedBill) {
            if (!confirm('திருத்தங்களை ரத்து செய்துவிட்டு புதிய பில் தொடங்க வேண்டுமா? / Discard edits and start a new bill?')) {
              return;
            }
          }
          setViewingTxIndex(null);
          setIsEditingSavedBill(false);
          setDraftBill(null);
          handleClearBill();
        }
      }

      // PageUp: View previous settled bill
      if (e.key === 'PageUp') {
        e.preventDefault();
        viewPreviousBill();
      }

      // PageDown: View next settled bill
      if (e.key === 'PageDown') {
        e.preventDefault();
        viewNextBill();
      }
      
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [billItems, activeRowIndex, activeColumn, showSearchOverlay, customerName, customerMobile, discount, rent, coolie, advance, viewingTxIndex, draftBill, isPrintModalOpen, activeBottomBtnIndex, isEditingSavedBill, duplicateState.isOpen]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Focus management based on row/column navigation and modal state
  // NOTE: billItems is intentionally NOT in this dependency array.
  // Including it caused .select() to fire on every keystroke (since typing updates billItems),
  // which selected all text so each new character replaced what was typed before.
  useEffect(() => {
    if (isPrintModalOpen || duplicateState.isOpen) return;

    if (showSearchOverlay) {
      if (searchInputRef.current) searchInputRef.current.focus();
      return;
    }

    const timer = setTimeout(() => {
      if (activeRowIndex >= 0) {
        if (activeColumn === 'code' && codeRefs.current[activeRowIndex]) {
          codeRefs.current[activeRowIndex].focus();
        } else if (activeColumn === 'qty' && qtyRefs.current[activeRowIndex]) {
          qtyRefs.current[activeRowIndex].focus();
          if (qtyRefs.current[activeRowIndex].select) qtyRefs.current[activeRowIndex].select();
        } else if (activeColumn === 'rate' && rateRefs.current[activeRowIndex]) {
          rateRefs.current[activeRowIndex].focus();
          if (rateRefs.current[activeRowIndex].select) rateRefs.current[activeRowIndex].select();
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [activeRowIndex, activeColumn, showSearchOverlay, isPrintModalOpen, duplicateState.isOpen]);

  function createEmptyRow() {
    return {
      code: '',
      name: '',
      tamilName: '',
      qty: '',
      unit: '',
      mrp: 0,
      basePrice: 0,
      overridePrice: '',
      totalPrice: 0,
      priceType: 'Fixed',
      slabs: []
    };
  }

  // Calculate matching slab price
  const getCalculatedPrice = (product, quantity) => {
    if (product.priceType !== 'Quantity' || !product.slabs || product.slabs.length === 0) {
      return product.sellingPrice;
    }
    
    // Sort slabs by ascending qty limit
    const sortedSlabs = [...product.slabs].sort((a, b) => a.qtyLimit - b.qtyLimit);
    
    // Find first slab where qty <= limit
    const matchedSlab = sortedSlabs.find(s => quantity <= s.qtyLimit);
    
    if (matchedSlab) {
      return product.sellingPrice + matchedSlab.offset;
    }
    
    return product.sellingPrice; // Default fallback
  };

  // Keyboard listener for duplicate item selection modal
  useEffect(() => {
    if (!duplicateState.isOpen) return;

    const handleDuplicateKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setDuplicateState(prev => ({
          ...prev,
          selectedOption: prev.selectedOption === 0 ? 1 : 0
        }));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setDuplicateState(prev => ({
          ...prev,
          selectedOption: prev.selectedOption === 0 ? 1 : 0
        }));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectDuplicateOption();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelDuplicate();
      }
    };

    window.addEventListener('keydown', handleDuplicateKeyDown, true);
    return () => window.removeEventListener('keydown', handleDuplicateKeyDown, true);
  }, [duplicateState]);

  const handleSelectDuplicateOption = () => {
    const { product, rowIndex, existingRowIndex, selectedOption } = duplicateState;
    if (!product) return;

    if (selectedOption === 0) {
      // Option 0: Edit Existing Item
      // 1. Focus the existing row's quantity column
      setActiveRowIndex(existingRowIndex);
      setActiveColumn('qty');
      
      // 2. Clear the current typing row's partial code input if it's the row we just entered it in
      setBillItems(prev => {
        const updated = [...prev];
        if (updated[rowIndex] && updated[rowIndex].code === product.code && !updated[rowIndex].name) {
          updated[rowIndex] = createEmptyRow();
        }
        return updated;
      });
      
      if (window.electronAPI && window.electronAPI.logMessage) {
        window.electronAPI.logMessage('info', `Duplicate product choice: Edit existing row at index ${existingRowIndex} for code ${product.code}`);
      }
    } else {
      // Option 1: Add as New Item (proceed with execution)
      executeAddProductToRow(product, rowIndex);
      
      if (window.electronAPI && window.electronAPI.logMessage) {
        window.electronAPI.logMessage('info', `Duplicate product choice: Add new line at index ${rowIndex} for code ${product.code}`);
      }
    }

    setDuplicateState({
      isOpen: false,
      product: null,
      rowIndex: null,
      existingRowIndex: null,
      selectedOption: 0
    });
  };

  const handleCancelDuplicate = () => {
    setDuplicateState({
      isOpen: false,
      product: null,
      rowIndex: null,
      existingRowIndex: null,
      selectedOption: 0
    });
  };

  // Add Item to Bill row - actual execution
  const executeAddProductToRow = (product, rowIndex) => {
    const updated = [...billItems];
    const defaultQty = product.priceType === 'Quantity' ? 1.000 : 1;
    const price = getCalculatedPrice(product, defaultQty);

    updated[rowIndex] = {
      code: product.code,
      name: product.name,
      tamilName: product.tamilName,
      qty: defaultQty,
      unit: product.unit,
      mrp: product.mrp || 0,
      basePrice: product.sellingPrice,
      overridePrice: price.toFixed(2),
      totalPrice: price * defaultQty,
      priceType: product.priceType,
      slabs: product.slabs || []
    };

    setBillItems(updated);
    
    // Transition to Qty column
    setActiveRowIndex(rowIndex);
    setActiveColumn('qty');
    closeSearch();
  };

  // Add Item to Bill row - with duplicate verification check
  const addProductToRow = (product, rowIndex) => {
    // Check if the product code already exists in another row in the bill items
    const existingRowIndex = billItems.findIndex((item, idx) => 
      idx !== rowIndex && 
      item.code && 
      item.code.trim().toUpperCase() === product.code.trim().toUpperCase()
    );

    if (existingRowIndex !== -1) {
      // Show the duplicate options dialog
      setDuplicateState({
        isOpen: true,
        product: product,
        rowIndex: rowIndex,
        existingRowIndex: existingRowIndex,
        selectedOption: 0
      });
      if (window.electronAPI && window.electronAPI.logMessage) {
        window.electronAPI.logMessage('info', `Duplicate item detected for code ${product.code} at row ${rowIndex} compared to existing row ${existingRowIndex}. Opening options modal.`);
      }
    } else {
      executeAddProductToRow(product, rowIndex);
    }
  };

  // Handle cell inputs
  const handleCellChange = (rowIndex, column, value) => {
    const updated = [...billItems];
    const row = updated[rowIndex];

    if (column === 'code') {
      // Always store code in uppercase
      row.code = value.toUpperCase();
      // NOTE: Do NOT auto-fill on every keypress — user must press Enter to confirm.
      // This prevents partial codes (e.g. typing 'M') from instantly matching wrong items.
    } else if (column === 'qty') {
      row.qty = value;
      
      // Re-calculate price based on quantity slabs
      const floatQty = parseFloat(value) || 0;
      const productMatch = database.products.find(p => p.code.toLowerCase() === row.code.toLowerCase());
      
      if (productMatch) {
        const slabPrice = getCalculatedPrice(productMatch, floatQty);
        row.overridePrice = slabPrice.toFixed(2);
        row.totalPrice = slabPrice * floatQty;
      }
    } else if (column === 'rate') {
      row.overridePrice = value;
      const floatQty = parseFloat(row.qty) || 0;
      const floatRate = parseFloat(value) || 0;
      row.totalPrice = floatRate * floatQty;
    }

    setBillItems(updated);
  };

  // Keyboard navigation on billing table cells
  const handleCellKeyDown = (e, rowIndex, column) => {
    if (isPrintModalOpen || duplicateState.isOpen) return;

    // Alt + D: Delete current active row
    if (e.altKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      removeRow(rowIndex);
      return;
    }

    // ArrowRight navigation between columns
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (column === 'code') {
        setActiveColumn('qty');
      } else if (column === 'qty') {
        setActiveColumn('rate');
      }
      return;
    }

    // ArrowLeft navigation between columns
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (column === 'qty') {
        setActiveColumn('code');
      } else if (column === 'rate') {
        setActiveColumn('qty');
      }
      return;
    }

    // Intercept Numpad decimal point to guarantee standard dot typing
    if ((e.keyCode === 110 || e.key === 'Decimal') && (column === 'qty' || column === 'rate')) {
      e.preventDefault();
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      const newVal = val.slice(0, start) + '.' + val.slice(end);
      
      handleCellChange(rowIndex, column, newVal);
      
      setTimeout(() => {
        if (input) input.setSelectionRange(start + 1, start + 1);
      }, 0);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (column === 'code') {
        const codeValue = (billItems[rowIndex].code || '').trim();
        if (!codeValue) {
          openSearch('');
        } else {
          // Only a complete code bills an item outright. A partial one used to
          // fall through to a startsWith match and add whatever it found first,
          // so typing "12" put 120 MUTTON MASALA on the bill. Anything short of
          // an exact code now opens the picker instead, pre-filled and filtered.
          const match = database.products.find(
            p => p.code.toLowerCase() === codeValue.toLowerCase() && !p.disableItem
          );

          if (match) {
            // If the row already holds this product, Enter is the operator
            // stepping back through a line he has already filled in - move him
            // on to the quantity and touch nothing else. Reloading the product
            // here reset qty to 1 and threw away the slab rate, so a 50g jeera
            // line at Rs24.50 silently became 1kg at Rs380.
            const current = billItems[rowIndex];
            const alreadyLoaded =
              current &&
              current.name &&
              String(current.code).toLowerCase() === String(match.code).toLowerCase();

            if (alreadyLoaded) {
              setActiveColumn('qty');
            } else {
              addProductToRow(match, rowIndex);
            }
          } else {
            openSearch(codeValue);
          }
        }
      } else if (column === 'qty') {
        const updated = [...billItems];
        const row = updated[rowIndex];
        const floatQty = parseFloat(row.qty) || 0;
        if (row.priceType === 'Quantity') {
          row.qty = floatQty.toFixed(3);
        } else {
          row.qty = Math.round(floatQty).toString();
        }
        setBillItems(updated);
        setActiveColumn('rate');
      } else if (column === 'rate') {
        if (rowIndex === billItems.length - 1) {
          setBillItems([...billItems, createEmptyRow()]);
          setActiveRowIndex(rowIndex + 1);
          setActiveColumn('code');
        } else {
          setActiveRowIndex(rowIndex + 1);
          setActiveColumn('code');
        }
      }
    }
    
    // Up / Down arrow cell navigation
    if (e.key === 'ArrowUp' && rowIndex > 0) {
      e.preventDefault();
      setActiveRowIndex(rowIndex - 1);
    }
    if (e.key === 'ArrowDown' && rowIndex < billItems.length - 1) {
      e.preventDefault();
      setActiveRowIndex(rowIndex + 1);
    }
  };

  // Remove row
  const removeRow = (index) => {
    if (billItems.length === 1) {
      setBillItems([createEmptyRow()]);
      setActiveRowIndex(0);
      setActiveColumn('code');
      return;
    }

    const updated = billItems.filter((_, i) => i !== index);
    setBillItems(updated);
    setActiveRowIndex(Math.max(0, index - 1));
    setActiveColumn('code');
  };

  // Search Overlay Functions
  const openSearch = (initialQuery) => {
    setSearchQuery(initialQuery);
    setHighlightedSearchIndex(0);
    setShowSearchOverlay(true);
  };

  const closeSearch = () => {
    setShowSearchOverlay(false);
    setSearchQuery('');
  };

  // Master sorted list of all active products for continuous overlay navigation
  const sortedActiveProducts = useMemo(() => {
    const active = database.products.filter(p => !p.disableItem);
    return [...active].sort((a, b) => 
      a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [database.products]);

  // A code query jumps within the whole catalogue so the neighbouring codes stay
  // reachable; a name query filters. See utils/productSearch.js.
  const search = useMemo(
    () => searchProducts(sortedActiveProducts, searchQuery),
    [sortedActiveProducts, searchQuery]
  );
  const searchResults = search.list;

  // Park the highlight where the search says it belongs.
  useEffect(() => {
    if (!showSearchOverlay || sortedActiveProducts.length === 0) return;

    if (search.mode !== 'browse') {
      setHighlightedSearchIndex(search.index);
      return;
    }

    // Nothing typed: keep the long-standing default of opening on the first
    // numeric code >= 100, which is where the counter items start.
    const idx100 = sortedActiveProducts.findIndex(p => {
      const num = parseInt(p.code, 10);
      return !isNaN(num) && num >= 100;
    });
    setHighlightedSearchIndex(idx100 !== -1 ? idx100 : 0);
  }, [search, showSearchOverlay, sortedActiveProducts]);

  // Scroll active search row smoothly into view without destabilizing list
  useEffect(() => {
    if (showSearchOverlay && activeSearchRowRef.current) {
      activeSearchRowRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [highlightedSearchIndex, showSearchOverlay]);

  const handleSearchOverlayKeyDown = (e) => {
    if (isPrintModalOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedSearchIndex(prev => Math.min(searchResults.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedSearchIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedProduct = searchResults[highlightedSearchIndex];
      if (selectedProduct) {
        addProductToRow(selectedProduct, activeRowIndex);
      }
    }
  };

  // Totals calculations
  const calculateGrossTotal = () => {
    return billItems.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
  };

  const calculateTotalWeight = () => {
    return billItems.reduce((sum, item) => {
      if (item.priceType === 'Quantity') {
        return sum + (parseFloat(item.qty) || 0);
      }
      return sum;
    }, 0);
  };

  const calculateTotalItemsCount = () => {
    return billItems.filter(item => item.code !== '').length;
  };

  // Amount before the shop's rounding.
  const calculateRawNetTotal = () => {
    const gross = calculateGrossTotal();
    const discVal = parseFloat(discount) || 0;
    const rentVal = parseFloat(rent) || 0;
    const coolieVal = parseFloat(coolie) || 0;

    return Math.max(0, gross - discVal + rentVal + coolieVal);
  };

  // The shop bills in whole rupees and always has: all 1,850 imported bills satisfy
  // netTotal === round(gross - discount + rent + coolie), and 752 of them carry an
  // explicit roundOff from the old FoxPro system. Matching that keeps paise off the
  // receipt and off the cash drawer, and stops an edited old bill drifting by 50 paise.
  const calculateNetTotal = () => Math.round(calculateRawNetTotal());

  const calculateRoundOff = () => round2(calculateNetTotal() - calculateRawNetTotal());

  const calculateCreditBalance = () => {
    const net = calculateNetTotal();
    const advVal = parseFloat(advance) || 0;
    return Math.max(0, net - advVal);
  };

  // HOLD / RESUME BILLS
  const handleHoldBill = () => {
    const itemsToHold = billItems.filter(item => item.code !== '');
    if (itemsToHold.length === 0) {
      alert('காலியான பில்லை நிறுத்தி வைக்க முடியாது! / Cannot hold an empty bill!');
      return;
    }

    const newHold = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      items: itemsToHold,
      customer: {
        slNo: customerSlNo,
        type: customerType,
        name: customerName,
        address1: addressLine1,
        address2: addressLine2,
        address3: addressLine3,
        mobile: customerMobile
      },
      charges: { discount, rent, coolie, advance },
      rwMode,
      pricingMode
    };

    setHeldBills([...heldBills, newHold]);
    handleClearBill();
    alert('பில் நிறுத்தி வைக்கப்பட்டது! / Bill placed on hold!');
  };

  const handleResumeBill = (hold) => {
    setBillItems([...hold.items, createEmptyRow()]);
    setCustomerSlNo(hold.customer.slNo);
    setCustomerType(hold.customer.type);
    setCustomerName(hold.customer.name);
    setAddressLine1(hold.customer.address1);
    setAddressLine2(hold.customer.address2);
    setAddressLine3(hold.customer.address3);
    setCustomerMobile(hold.customer.mobile);
    setDiscount(hold.charges.discount);
    setRent(hold.charges.rent);
    setCoolie(hold.charges.coolie);
    setAdvance(hold.charges.advance);
    setRwMode(hold.rwMode);
    setPricingMode(hold.pricingMode);
    
    setHeldBills(heldBills.filter(h => h.id !== hold.id));
    setActiveRowIndex(hold.items.length);
    setActiveColumn('code');
  };

  const loadTransactionToView = (tx) => {
    setIsEditingSavedBill(false);
    setActiveBottomBtnIndex(2); // focus edit button by default!
    const rows = tx.items.map(item => ({
      code: item.code || '',
      name: item.name || '',
      tamilName: item.tamilName || '',
      unit: item.unit || 'kg',
      qty: item.qty || '',
      mrp: item.mrp || 0,
      basePrice: item.basePrice || 0,
      sellingRate: item.sellingRate || item.overridePrice || '0.00',
      overridePrice: item.overridePrice || '0.00',
      totalPrice: item.totalPrice || 0,
      priceType: item.priceType || 'Quantity',
      slabs: item.slabs || []
    }));
    
    setBillItems(rows);
    setCustomerSlNo(tx.invoiceNo.toString());
    setCustomerType('CASH');
    setCustomerName(tx.customerName || 'CASH');
    setAddressLine1(tx.customerAddress || '');
    setAddressLine2('');
    setAddressLine3('');
    setCustomerMobile(tx.customerMobile || '');
    setDiscount(tx.discount ? tx.discount.toString() : '');
    setRent(tx.rent ? tx.rent.toString() : '');
    setCoolie(tx.coolie ? tx.coolie.toString() : '');
    setAdvance(tx.advance ? tx.advance.toString() : '');
    setRwMode('R');
    setPricingMode('R');
  };

  const handleStartEditSavedBill = () => {
    setIsEditingSavedBill(true);
    setBillItems(prev => {
      const updated = [...prev];
      // If there are no empty rows, add one so they can edit/add items!
      if (updated.length === 0 || updated[updated.length - 1].code !== '') {
        updated.push(createEmptyRow());
      }
      
      setTimeout(() => {
        const firstEmptyIndex = updated.findIndex(item => item.code === '');
        const focusIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
        setActiveRowIndex(focusIndex);
        setActiveColumn('code');
        if (codeRefs.current[focusIndex]) {
          codeRefs.current[focusIndex].focus();
          codeRefs.current[focusIndex].select();
        }
      }, 100);
      
      return updated;
    });
  };

  const viewPreviousBill = () => {
    if (!database.transactions || database.transactions.length === 0) return;
    
    let nextIndex;
    if (viewingTxIndex === null) {
      // Backup current active screen draft
      setDraftBill({
        billItems,
        activeRowIndex,
        activeColumn,
        customerType,
        customerName,
        addressLine1,
        addressLine2,
        addressLine3,
        customerMobile,
        discount,
        rent,
        coolie,
        advance,
        rwMode,
        pricingMode
      });
      nextIndex = database.transactions.length - 1;
    } else {
      if (viewingTxIndex === 0) return; // limit at oldest
      nextIndex = viewingTxIndex - 1;
    }
    
    setViewingTxIndex(nextIndex);
    loadTransactionToView(database.transactions[nextIndex]);
  };

  const viewNextBill = () => {
    if (viewingTxIndex === null) return;
    
    if (viewingTxIndex === database.transactions.length - 1) {
      // Return to active draft
      setViewingTxIndex(null);
      if (draftBill) {
        setBillItems(draftBill.billItems);
        setCustomerType(draftBill.customerType);
        setCustomerName(draftBill.customerName);
        setAddressLine1(draftBill.addressLine1 || '');
        setAddressLine2(draftBill.addressLine2 || '');
        setAddressLine3(draftBill.addressLine3 || '');
        setCustomerMobile(draftBill.customerMobile);
        setDiscount(draftBill.discount);
        setRent(draftBill.rent);
        setCoolie(draftBill.coolie);
        setAdvance(draftBill.advance);
        setRwMode(draftBill.rwMode);
        setPricingMode(draftBill.pricingMode);
        const cursor = draftCursor(draftBill);
        setActiveRowIndex(cursor.row);
        setActiveColumn(cursor.column);
        setDraftBill(null);
        focusBillCell(cursor.row, cursor.column);
      } else {
        handleClearBill();
      }
    } else {
      const nextIndex = viewingTxIndex + 1;
      setViewingTxIndex(nextIndex);
      loadTransactionToView(database.transactions[nextIndex]);
    }
  };

  const handleClearBill = () => {
    // IMPORTANT: reset history-viewing state so subsequent F10/F11/F12
    // operate on the new draft, not on the previously viewed saved transaction.
    setViewingTxIndex(null);
    setIsEditingSavedBill(false);
    setDraftBill(null);

    setBillItems([createEmptyRow()]);
    setCustomerSlNo(getNextBillNumber().toString());
    setCustomerType('CASH');
    setCustomerName('CASH');
    setAddressLine1('');
    setAddressLine2('');
    setAddressLine3('');
    setCustomerMobile('');
    setDiscount('');
    setRent('');
    setCoolie('');
    setAdvance('');
    setRwMode('R');
    setPricingMode('R');
    setActiveRowIndex(0);
    setActiveColumn('code');
    setTimeout(() => {
      if (codeRefs.current[0]) {
        codeRefs.current[0].focus();
        if (codeRefs.current[0].select) codeRefs.current[0].select();
      }
    }, 50);
  };

  // Put the cursor back into a specific grid cell. Returning from a past bill
  // restored every field but left focus on nothing, so the next keystroke went
  // nowhere and the counter had to reach for the mouse. The 50ms delay matches
  // handleClearBill: the refs only exist once the restored rows have rendered.
  const focusBillCell = (rowIndex, column) => {
    setTimeout(() => {
      const refs = column === 'qty' ? qtyRefs : column === 'rate' ? rateRefs : codeRefs;
      const el = refs.current[rowIndex];
      if (el) {
        el.focus();
        if (typeof el.select === 'function') el.select();
      }
    }, 50);
  };

  // Where the cursor was when the draft was parked, clamped in case the row is
  // no longer there.
  const draftCursor = (draft) => {
    const rows = Array.isArray(draft.billItems) ? draft.billItems.length : 0;
    return {
      row: Math.min(Math.max(0, draft.activeRowIndex ?? 0), Math.max(0, rows - 1)),
      column: draft.activeColumn || 'code'
    };
  };

  // Helper: restore a saved draft back to the billing screen
  const restoreDraft = (draft) => {
    setViewingTxIndex(null);
    setIsEditingSavedBill(false);
    setBillItems(draft.billItems);
    setCustomerType(draft.customerType);
    setCustomerName(draft.customerName);
    setAddressLine1(draft.addressLine1 || '');
    setAddressLine2(draft.addressLine2 || '');
    setAddressLine3(draft.addressLine3 || '');
    setCustomerMobile(draft.customerMobile);
    setDiscount(draft.discount);
    setRent(draft.rent);
    setCoolie(draft.coolie);
    setAdvance(draft.advance);
    setRwMode(draft.rwMode);
    setPricingMode(draft.pricingMode);
    const cursor = draftCursor(draft);
    setActiveRowIndex(cursor.row);
    setActiveColumn(cursor.column);
    setDraftBill(null);
    focusBillCell(cursor.row, cursor.column);
  };

  // After draft-restore completes, fire the pending save+print action
  useEffect(() => {
    if (pendingPrintRef.current && viewingTxIndex === null && !draftBill) {
      const action = pendingPrintRef.current;
      pendingPrintRef.current = null;
      // Give React one tick to settle state, then trigger
      setTimeout(() => handleSettleBill(action), 0);
    }
  }, [viewingTxIndex, draftBill]);

  const handleSettleBill = (action = 'save') => {
    // One save at a time. Without this a fast double-press could commit two bills.
    if (isSavingRef.current) return;

    const itemsToSave = billItems.filter(item => item.code !== '');
    if (itemsToSave.length === 0) {
      alert('பில்லில் பொருட்கள் இல்லை! / No items in the bill!');
      return;
    }

    isSavingRef.current = true;
    const releaseSaveLock = () => setTimeout(() => { isSavingRef.current = false; }, 500);

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;
    const formattedTime = now.toLocaleTimeString('en-US', { hour12: false });

    if (viewingTxIndex !== null) {
      // EDIT MODE: Update existing transaction in database & adjust stock
      const originalTx = database.transactions[viewingTxIndex];
      
      const updatedProducts = database.products.map(p => {
        let stock = p.currentStock;
        
        // 1. Revert old stock deduction
        const oldItem = originalTx.items.find(item => item.code === p.code);
        if (oldItem) {
          stock += (parseFloat(oldItem.qty) || 0);
        }
        
        // 2. Deduct new stock
        const newItem = itemsToSave.find(item => item.code === p.code);
        if (newItem) {
          stock -= (parseFloat(newItem.qty) || 0);
        }
        
        return { ...p, currentStock: stock };
      });

      const updatedInvoice = {
        ...originalTx,
        customerName,
        customerMobile,
        customerAddress: `${addressLine1} ${addressLine2} ${addressLine3}`.trim(),
        items: itemsToSave,
        grossTotal: round2(calculateGrossTotal()),
        discount: round2(discount),
        rent: round2(rent),
        coolie: round2(coolie),
        advance: round2(advance),
        roundOff: calculateRoundOff(),
        netTotal: round2(calculateNetTotal())
      };

      const updatedTransactions = [...database.transactions];
      updatedTransactions[viewingTxIndex] = updatedInvoice;

      logInfo(`Saving bill edits for Invoice #${updatedInvoice.invoiceNo}. Items: ${updatedInvoice.items.length}, Net Total: ₹${updatedInvoice.netTotal.toFixed(2)}, Customer: ${updatedInvoice.customerName || 'CASH'}`);

      onUpdateDatabase({
        ...database,
        products: updatedProducts,
        transactions: updatedTransactions
      });

      releaseSaveLock();

      if (action === 'save') {
        alert('பில் திருத்தம் சேமிக்கப்பட்டது! / Bill edits saved successfully!');
      } else {
        onPrintReceipt(updatedInvoice, action);
      }
      
      // IMPORTANT: Keep the edited bill on screen (do not clear it)
      return;
    }

    // NEW BILL MODE: Save new transaction & deduct stock
    const nextBillNo = getNextBillNumber();
    const invoice = {
      // Immutable identity, separate from the number printed on paper. Delete and edit
      // match on this; invoiceNo is display only and is not guaranteed unique across days.
      id: `b_${now.getTime()}_${nextBillNo}`,
      invoiceNo: nextBillNo,
      timestamp: now.toISOString(),
      year: yyyy,
      month: now.getMonth() + 1,
      day: now.getDate(),
      date: formattedDate,
      time: formattedTime,
      customerName,
      customerMobile,
      customerAddress: `${addressLine1} ${addressLine2} ${addressLine3}`.trim(),
      items: itemsToSave,
      grossTotal: round2(calculateGrossTotal()),
      discount: round2(discount),
      rent: round2(rent),
      coolie: round2(coolie),
      advance: round2(advance),
      roundOff: calculateRoundOff(),
      netTotal: round2(calculateNetTotal()),
      operator: 'PS'
    };

    const updatedTransactions = [...database.transactions, invoice];
    const updatedProducts = database.products.map(p => {
      const soldItem = itemsToSave.find(item => item.code === p.code);
      if (soldItem) {
        return {
          ...p,
          currentStock: p.currentStock - (parseFloat(soldItem.qty) || 0)
        };
      }
      return p;
    });

    logInfo(`Saving new bill: Invoice #${invoice.invoiceNo}. Items: ${invoice.items.length}, Net Total: ₹${invoice.netTotal.toFixed(2)}, Customer: ${invoice.customerName || 'CASH'}`);

    // The counter advances in the same write as the bill, so a number can never be
    // handed out twice even if the app is closed the instant after saving.
    onUpdateDatabase({
      ...database,
      products: updatedProducts,
      transactions: updatedTransactions,
      settings: {
        ...database.settings,
        billCounter: { date: formattedDate, next: nextBillNo + 1 }
      }
    });

    releaseSaveLock();

    if (action === 'save') {
      alert('பில் வெற்றிகரமாக சேமிக்கப்பட்டது! / Bill saved successfully!');
    } else {
      onPrintReceipt(invoice, action); // action is 'tamil' or 'english'
    }

    // Automatically clear screen and start next new bill
    handleClearBill();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  const handleMenuClick = (e, menuName) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleBillingAreaClick = (e) => {
    // Only refocus if they didn't click inside another input, select, button, or search modal
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'button' || tagName === 'select' || tagName === 'textarea' || e.target.closest('button')) {
      return;
    }

    if (activeRowIndex >= 0 && activeRowIndex < billItems.length) {
      if (activeColumn === 'code' && codeRefs.current[activeRowIndex]) {
        codeRefs.current[activeRowIndex].focus();
        codeRefs.current[activeRowIndex].select();
      } else if (activeColumn === 'qty' && qtyRefs.current[activeRowIndex]) {
        qtyRefs.current[activeRowIndex].focus();
        qtyRefs.current[activeRowIndex].select();
      } else if (activeColumn === 'rate' && rateRefs.current[activeRowIndex]) {
        rateRefs.current[activeRowIndex].focus();
        rateRefs.current[activeRowIndex].select();
      }
    }
  };

  return (
    <div className="billing-dashboard-screen screen-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      


      {/* Title & Time Header Row */}
      <header style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center', 
        padding: '10px 20px', 
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Left column placeholder */}
        <div></div>

        {/* Center column: Shop name & slogan */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 'bold', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.05em' }}>
            {database?.settings?.headerSlogan || 'ஸ்ரீ முருகன் துணை'}
          </span>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            color: '#15803d', 
            fontFamily: '"Outfit", sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '4px 0 0 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            {database?.settings?.shopName || 'SRI PERUMAL STORES'}
          </h1>
        </div>

        {/* Right column: Digital Clock & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString()}</span>
            <span style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentTime}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onNavigateToInventory}>
              <Database size={13} /> Products
            </button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onNavigateToHistory}>
              <Archive size={13} /> History
            </button>
            <button className="btn-error" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={onLogOut}>
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* ⚠️ VIEWING OLD BILL BANNER - removed as requested */}

      {/* Main Screen Panels split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '12px', gap: '12px' }}>
        
        {/* Left billing core */}
        <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          
          {/* Metadata Section: Divided split panels to match original screen */}
          <div className="pos-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 3.3fr', gap: '15px', padding: '12px' }}>
            
            {/* Panel 1: S.No, Date, CASH selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>பில் எண் / BILL NO</span>
                <input 
                  type="text" 
                  className="pos-input mono" 
                  style={{ width: '80px', height: '28px', padding: '2px 8px', color: 'var(--success) !important', fontWeight: 'bold' }} 
                  value={customerSlNo}
                  onChange={(e) => setCustomerSlNo(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>தேதி / Date</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {viewingTxIndex !== null ? database.transactions[viewingTxIndex].date : getTodayDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>வகை / Type</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ width: '80px', height: '28px', padding: '2px 8px' }} 
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                />
              </div>
            </div>

            {/* Panel 2: Customer Name, Address lines, Mobile */}
            <div style={{ display: 'flex', gap: '15px' }}>
              
              <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="input-group">
                  <span className="input-label" style={{ fontSize: '10px' }}>வாடிக்கையாளர் / CUSTOMER NAME</span>
                  <input 
                    type="text" 
                    className="pos-input" 
                    style={{ height: '28px', padding: '2px 8px' }}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                  />
                </div>
                <div className="input-group">
                  <span className="input-label" style={{ fontSize: '10px' }}>கைபேசி / MOBILE NO</span>
                  <input 
                    type="text" 
                    className="pos-input mono" 
                    style={{ height: '28px', padding: '2px 8px' }}
                    placeholder="994214XXXX"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                  />
                </div>
              </div>

              {/* Stacked multi-line Address boxes */}
              <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>முகவரி / ADDRESS</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ height: '24px', padding: '2px 8px', fontSize: '12px' }}
                  placeholder="Street / Line 1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                />
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ height: '24px', padding: '2px 8px', fontSize: '12px' }}
                  placeholder="Village / Town"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                />
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ height: '24px', padding: '2px 8px', fontSize: '12px' }}
                  placeholder="District"
                  value={addressLine3}
                  onChange={(e) => setAddressLine3(e.target.value)}
                  readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                />
              </div>

            </div>

          </div>

          {/* Main Billing Grid with BLUE headers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }} onClick={handleBillingAreaClick}>
            
            <div className="table-container" style={{ flex: 1 }}>
              <table className="pos-table">
                <thead>
                  <tr style={{ background: 'linear-gradient(180deg, #15803d 0%, #166534 100%)' }}>
                    <th style={{ width: '60px', color: '#ffffff' }}>எண் / S.No</th>
                    <th style={{ width: '120px', color: '#ffffff' }}>குறியீடு / Code</th>
                    <th style={{ color: '#ffffff' }}>பொருள் / Product Item (Eng & Tamil)</th>
                    <th style={{ width: '100px', textAlign: 'center', color: '#ffffff' }}>Unit / அலகு</th>
                    <th style={{ width: '120px', textAlign: 'right', color: '#ffffff' }}>அளவு / Qty</th>
                    <th style={{ width: '120px', textAlign: 'right', color: '#ffffff' }}>M.R.P</th>
                    <th style={{ width: '120px', textAlign: 'right', color: '#ffffff' }}>விற்பனை விலை / Rate</th>
                    <th style={{ width: '150px', textAlign: 'right', color: '#ffffff' }}>மொத்தம் / Total</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item, index) => (
                    <tr key={index} className={activeRowIndex === index ? 'active-row' : ''}>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{index + 1}</td>
                      <td>
                        <input 
                          type="text" 
                          ref={el => codeRefs.current[index] = el}
                          className="pos-input mono" 
                          style={{ border: (activeRowIndex === index && activeColumn === 'code' && (viewingTxIndex === null || isEditingSavedBill)) ? '1.5px solid var(--border-focus)' : 'none', background: 'transparent', padding: '2px', textTransform: 'uppercase' }}
                          value={item.code}
                          onChange={(e) => handleCellChange(index, 'code', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'code')}
                          onFocus={() => { if (viewingTxIndex === null || isEditingSavedBill) { setActiveRowIndex(index); setActiveColumn('code'); } }}
                          readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                          tabIndex={viewingTxIndex !== null && !isEditingSavedBill ? -1 : undefined}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700' }}>{item.name || '-'}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.tamilName || ''}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.unit && (
                          <span style={{ background: 'var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                            {billingUnitLabel(item.unit)}
                          </span>
                        )}
                      </td>
                      <td>
                        <input 
                          type="text" 
                          ref={el => qtyRefs.current[index] = el}
                          className="pos-input mono" 
                          style={{ 
                            textAlign: 'right', 
                            border: (activeRowIndex === index && activeColumn === 'qty' && (viewingTxIndex === null || isEditingSavedBill)) ? '1.5px solid var(--border-focus)' : 'none', 
                            background: 'transparent', 
                            padding: '2px',
                            fontWeight: 'bold'
                          }}
                          value={item.qty}
                          onChange={(e) => handleCellChange(index, 'qty', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'qty')}
                          onFocus={() => { if (viewingTxIndex === null || isEditingSavedBill) { setActiveRowIndex(index); setActiveColumn('qty'); } }}
                          readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                          tabIndex={viewingTxIndex !== null && !isEditingSavedBill ? -1 : undefined}
                          onBlur={() => {
                            const updated = [...billItems];
                            const row = updated[index];
                            if (row.qty) {
                              const floatQty = parseFloat(row.qty) || 0;
                              if (row.priceType === 'Quantity') {
                                row.qty = floatQty.toFixed(3);
                              } else {
                                row.qty = Math.round(floatQty).toString();
                              }
                              setBillItems(updated);
                            }
                          }}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {item.code ? (item.mrp || 0).toFixed(2) : '0.00'}
                      </td>
                      <td>
                        <input 
                          type="text" 
                          ref={el => rateRefs.current[index] = el}
                          className="pos-input mono" 
                          style={{ 
                            textAlign: 'right', 
                            border: (activeRowIndex === index && activeColumn === 'rate' && (viewingTxIndex === null || isEditingSavedBill)) ? '1.5px solid var(--border-focus)' : 'none', 
                            background: 'transparent', 
                            padding: '2px' 
                          }}
                          value={item.overridePrice}
                          onChange={(e) => handleCellChange(index, 'rate', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'rate')}
                          onFocus={() => { if (viewingTxIndex === null || isEditingSavedBill) { setActiveRowIndex(index); setActiveColumn('rate'); } }}
                          readOnly={viewingTxIndex !== null && !isEditingSavedBill}
                          tabIndex={viewingTxIndex !== null && !isEditingSavedBill ? -1 : undefined}
                          onBlur={() => {
                            const updated = [...billItems];
                            const row = updated[index];
                            if (row.overridePrice) {
                              const floatRate = parseFloat(row.overridePrice) || 0;
                              row.overridePrice = floatRate.toFixed(2);
                              row.totalPrice = floatRate * (parseFloat(row.qty) || 0);
                              setBillItems(updated);
                            }
                          }}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                        ₹{(item.totalPrice || 0).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-ghost" style={{ padding: '2px', color: 'var(--error)' }} onClick={() => removeRow(index)} disabled={viewingTxIndex !== null && !isEditingSavedBill}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>



            </div>

            {/* Billing Area ONLY Search Overlay */}
            {showSearchOverlay && (
              <div className="pos-card screen-fade" style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 100, 
                background: 'var(--card-bg)', 
                display: 'flex', 
                flexDirection: 'column', 
                border: '2px solid var(--border-focus)'
              }}>
                <div style={{ display: 'flex', justifyItems: 'center', padding: '10px', borderBottom: '1px solid var(--border-color)', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '8px', color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      ref={searchInputRef}
                      placeholder="பொருள் குறியீடு அல்லது பெயர் தேடுக... / Search by code, name..." 
                      className="pos-input" 
                      style={{ paddingLeft: '32px', height: '32px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                      onKeyDown={handleSearchOverlayKeyDown}
                    />
                  </div>
                  <button className="btn-secondary" style={{ padding: '4px 12px', height: '32px', fontSize: '12px' }} onClick={closeSearch}>
                    மூடுக / Close (Esc)
                  </button>
                </div>
                
                <div ref={overlayTableContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  <table className="pos-table search-overlay-table">
                    <thead>
                      <tr style={{ background: 'linear-gradient(180deg, #15803d 0%, #166534 100%)' }}>
                        <th style={{ width: '80px', background: '#15803d', color: '#ffffff' }}>குறியீடு / Code</th>
                        <th style={{ background: '#15803d', color: '#ffffff' }}>தமிழ் பெயர் / Tamil Name</th>
                        <th style={{ background: '#15803d', color: '#ffffff' }}>பொருள் / Product Name (Eng)</th>
                        <th style={{ width: '70px', textAlign: 'center', background: '#15803d', color: '#ffffff' }}>Unit</th>
                        <th style={{ width: '90px', textAlign: 'right', background: '#15803d', color: '#ffffff' }}>விலை / Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((p, pIdx) => {
                        const isHighlighted = highlightedSearchIndex === pIdx;
                        return (
                          <tr 
                            key={p.code} 
                            ref={isHighlighted ? activeSearchRowRef : null}
                            className={isHighlighted ? 'active-search-row' : ''}
                            style={{ 
                              cursor: 'pointer',
                              background: isHighlighted ? '#1d4ed8' : undefined,
                              color: isHighlighted ? '#ffffff' : undefined
                            }}
                            onClick={() => addProductToRow(p, activeRowIndex)}
                          >
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: isHighlighted ? 'bold' : 'normal', color: isHighlighted ? '#ffffff' : undefined }}>{p.code}</td>
                            <td style={{ fontWeight: '600', color: isHighlighted ? '#ffffff' : undefined }}>{p.tamilName || '-'}</td>
                            <td style={{ color: isHighlighted ? '#ffffff' : undefined }}>{p.name}</td>
                            <td style={{ textAlign: 'center', color: isHighlighted ? '#ffffff' : undefined }}>{unitLabel(p.unit)}</td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: isHighlighted ? 'bold' : 'normal', color: isHighlighted ? '#ffffff' : undefined }}>₹{p.sellingPrice.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                      {searchResults.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                            பொருள் எதுவும் கிடைக்கவில்லை / No matching item — check the code, or press Esc to close
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Left Buttons Panel (Search & Exit & View/Edit controls) */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {viewingTxIndex === null ? (
              <>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 24px' }} 
                  onClick={() => openSearch('')}
                >
                  Search
                </button>
                <button className="btn-secondary" style={{ padding: '8px 24px' }} onClick={onLogOut}>
                  Exit
                </button>
              </>
            ) : (
              <>
                <button 
                  ref={bottomBtnRefs.tamilPrint}
                  className="btn-primary" 
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '15px', 
                    fontWeight: 'bold', 
                    background: 'var(--primary)',
                    outline: activeBottomBtnIndex === 0 ? '3px solid var(--border-focus)' : 'none',
                    outlineOffset: '2px'
                  }} 
                  onClick={() => {
                    if (isEditingSavedBill) {
                      handleSettleBill('tamil');
                    } else {
                      onPrintReceipt(database.transactions[viewingTxIndex], 'tamil');
                    }
                  }}
                >
                  தமிழ் அச்சிடு / Tamil Print
                </button>
                <button 
                  ref={bottomBtnRefs.englishPrint}
                  className="btn-primary" 
                  style={{ 
                    padding: '12px 32px', 
                    fontSize: '15px', 
                    fontWeight: 'bold', 
                    background: 'var(--primary)',
                    outline: activeBottomBtnIndex === 1 ? '3px solid var(--border-focus)' : 'none',
                    outlineOffset: '2px'
                  }} 
                  onClick={() => {
                    if (isEditingSavedBill) {
                      handleSettleBill('english');
                    } else {
                      onPrintReceipt(database.transactions[viewingTxIndex], 'english');
                    }
                  }}
                >
                  English Print
                </button>
                
                {isEditingSavedBill ? (
                  <button 
                    ref={bottomBtnRefs.editSave}
                    className="btn-success" 
                    style={{ 
                      padding: '12px 32px', 
                      fontSize: '15px', 
                      fontWeight: 'bold',
                      outline: activeBottomBtnIndex === 2 ? '3px solid var(--border-focus)' : 'none',
                      outlineOffset: '2px'
                    }} 
                    onClick={() => handleSettleBill('save')}
                  >
                    சேமி / Save
                  </button>
                ) : (
                  <button 
                    ref={bottomBtnRefs.editSave}
                    className="btn-warning" 
                    style={{ 
                      padding: '12px 32px', 
                      fontSize: '15px', 
                      fontWeight: 'bold',
                      outline: activeBottomBtnIndex === 2 ? '3px solid var(--border-focus)' : 'none',
                      outlineOffset: '2px'
                    }} 
                    onClick={handleStartEditSavedBill}
                  >
                    திருத்து / Edit
                  </button>
                )}
              </>
            )}
          </div>

        </div>

        {/* Right side: Summary Colored blocks & Shortcuts sidebar */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Summary colored grids to match original screen */}
          <div className="pos-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
            
            {/* items count - Green box */}
            <div className="summary-box-green" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>எண் / Count</span>
              <div style={{ padding: '6px 14px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', minWidth: '70px', textAlign: 'right' }}>
                {calculateTotalItemsCount()}
              </div>
            </div>

            {/* subtotal - Green box */}
            <div className="summary-box-green" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>மொத்தம் / Gross</span>
              <div style={{ padding: '6px 14px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', minWidth: '100px', textAlign: 'right' }}>
                {calculateGrossTotal().toFixed(2)}
              </div>
            </div>

          </div>

          {/* Large Net Total display box - White card with large blue text */}
          <div className="pos-card" style={{ 
            background: '#ffffff', 
            border: '2px solid var(--border-color)', 
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            gap: '4px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              பில் தொகை / BILL TOTAL
            </span>
            <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#1d4ed8', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.1 }}>
              {calculateNetTotal().toFixed(2)}
            </h2>
          </div>

          {/* Held Bills display */}
          {heldBills.length > 0 && (
            <div className="pos-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '110px', overflowY: 'auto' }}>
              <span className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                <Folder size={12} /> நிறுத்தி வைத்தவை / Held Bills ({heldBills.length})
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {heldBills.map(h => (
                  <div 
                    key={h.id} 
                    className="btn-secondary" 
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleResumeBill(h)}
                  >
                    <span>{h.customer.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Sales Stats Card */}
          {(() => {
            const stats = getTodayStats();
            return (
              <div className="pos-card" style={{ 
                background: 'rgba(30, 41, 59, 0.45)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShoppingCart size={13} style={{ color: '#10b981' }} /> இன்றைய விவரம் / TODAY'S OVERVIEW
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                      display: 'inline-block'
                    }} />
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase' }}>Live</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                      இன்றைய விற்பனை / Sales
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      ₹{stats.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div style={{ flex: 0.8, background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                      பில்கள் / Bills
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
                      {stats.count}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '9.5px', 
                  color: 'rgba(255, 255, 255, 0.45)', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                  paddingTop: '6px' 
                }}>
                  <span>விற்பனையாளர் / Operator: <strong style={{ color: '#ffffff' }}>PS</strong></span>
                  <span>முறை / Mode: <strong style={{ color: '#ffffff' }}>பில்லிங் (Billing)</strong></span>
                </div>
              </div>
            );
          })()}


          {/* Hotkeys sidebar - Light Mode styled */}
          <div className="pos-card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            padding: '8px 12px',
            border: '1px solid var(--border-color)', 
            background: 'var(--card-bg)',
            marginTop: 'auto'
          }}>
            <span className="input-label" style={{ 
              borderBottom: '1px solid var(--border-color)', 
              paddingBottom: '2px', 
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: 'bold'
            }}>விசை வழிகாட்டி / Shortcuts</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>F10</span> <span>பில் சேமிக்க / Save Bill</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>F11</span> <span>தமிழ் அச்சிடல் / Print (Tamil)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>F12</span> <span>ஆங்கில அச்சிடல் / Print (English)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>F9</span> <span>பில் அழிக்க / Clear Bill</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Page Up</span> <span>முந்தைய பில் / Previous Bill</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Page Down</span> <span>அடுத்த பில் / Next Bill</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Alt + D</span> <span>வரிசை நீக்க / Delete Row</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>F2</span> <span>பொருள் தேட / Search Items</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Esc</span> <span>தேடல் மூடுக / Close Search</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Duplicate Product Alert Dialog Modal */}
      {duplicateState.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            width: '460px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ நகல் பொருள் / Duplicate Item
            </h3>
            
            <p style={{
              fontSize: '13.5px',
              lineHeight: '1.5',
              marginBottom: '20px',
              color: 'var(--text-secondary)'
            }}>
              <strong>{duplicateState.product?.name} ({duplicateState.product?.code})</strong> ஏற்கனவே இந்த பில்லில் சேர்க்கப்பட்டுள்ளது!
              <br />
              already exists in this bill! Please select an option:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {/* Option 0: Edit Existing */}
              <div 
                onClick={() => setDuplicateState(prev => ({ ...prev, selectedOption: 0 }))}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: duplicateState.selectedOption === 0 
                    ? '2px solid var(--primary)' 
                    : '2px solid var(--border-color)',
                  background: duplicateState.selectedOption === 0 
                    ? 'var(--primary-glow)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid ' + (duplicateState.selectedOption === 0 ? 'var(--primary)' : 'var(--border-color)'),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  background: duplicateState.selectedOption === 0 ? 'var(--primary)' : 'transparent'
                }}>
                  {duplicateState.selectedOption === 0 && '✓'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13.5px', color: duplicateState.selectedOption === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                    நிலவும் பொருளின் அளவை மாற்றவும் (பரிந்துரைக்கப்படுகிறது)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Edit existing item quantity (Recommended)
                  </div>
                </div>
              </div>

              {/* Option 1: Add New Line */}
              <div 
                onClick={() => setDuplicateState(prev => ({ ...prev, selectedOption: 1 }))}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: duplicateState.selectedOption === 1 
                    ? '2px solid var(--primary)' 
                    : '2px solid var(--border-color)',
                  background: duplicateState.selectedOption === 1 
                    ? 'var(--primary-glow)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid ' + (duplicateState.selectedOption === 1 ? 'var(--primary)' : 'var(--border-color)'),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  background: duplicateState.selectedOption === 1 ? 'var(--primary)' : 'transparent'
                }}>
                  {duplicateState.selectedOption === 1 && '✓'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13.5px', color: duplicateState.selectedOption === 1 ? 'var(--primary)' : 'var(--text-primary)' }}>
                    புதிய வரியாக சேர்க்கவும்
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Add as a new row (new weight/qty)
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={handleCancelDuplicate}
                className="btn-secondary" 
                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}
              >
                ரத்து செய் / Cancel (Esc)
              </button>
              <button 
                onClick={handleSelectDuplicateOption}
                className="btn-primary" 
                style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}
              >
                சரி / Confirm (Enter)
              </button>
            </div>
            
            <div style={{ 
              marginTop: '15px', 
              fontSize: '10px', 
              color: 'var(--text-muted)', 
              textAlign: 'center',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '8px'
            }}>
              நகர ↑/↓ அம்புக்குறி விசைகளைப் பயன்படுத்தவும் / Use ↑/↓ Arrow Keys to navigate
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
