import React, { useState, useEffect, useRef } from 'react';
import { Search, Save, Trash2, Moon, Sun, ShoppingCart, User, Key, Database, Archive, Folder, LogOut } from 'lucide-react';

export default function BillingDashboard({ 
  database, 
  onUpdateDatabase, 
  onLogOut, 
  onNavigateToInventory, 
  onNavigateToHistory,
  onPrintReceipt
}) {
  const [billItems, setBillItems] = useState([createEmptyRow()]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [activeColumn, setActiveColumn] = useState('code'); // 'code' | 'qty' | 'rate'
  
  const getNextBillNumber = () => {
    if (!database || !database.transactions) return 1;
    const todayStr = new Date().toLocaleDateString();
    const todayTx = database.transactions.filter(t => t.date === todayStr);
    return todayTx.length + 1;
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
  const [draftBill, setDraftBill] = useState(null);

  // Menu bar dropdown visibility
  const [activeMenu, setActiveMenu] = useState(null);

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Refs for focusing inputs
  const codeRefs = useRef([]);
  const qtyRefs = useRef([]);
  const rateRefs = useRef([]);
  const searchInputRef = useRef(null);

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

  // Sync customerSlNo when database transactions length changes
  useEffect(() => {
    if (database && database.transactions) {
      setCustomerSlNo(getNextBillNumber().toString());
    }
  }, [database?.transactions?.length]);

  // Sync refs array length
  useEffect(() => {
    codeRefs.current = codeRefs.current.slice(0, billItems.length);
    qtyRefs.current = qtyRefs.current.slice(0, billItems.length);
    rateRefs.current = rateRefs.current.slice(0, billItems.length);
  }, [billItems]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Avoid shortcuts when typing in search overlay query
      if (showSearchOverlay) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
        }
        return;
      }

      // F10: Save Bill (without printing)
      if (e.key === 'F10') {
        e.preventDefault();
        handleSettleBill('save');
      }

      // F11: Settle & Print in Tamil
      if (e.key === 'F11') {
        e.preventDefault();
        handleSettleBill('tamil');
      }

      // F12: Settle & Print in English
      if (e.key === 'F12') {
        e.preventDefault();
        handleSettleBill('english');
      }

      // F9: Clear current bill contents
      if (e.key === 'F9') {
        e.preventDefault();
        if (confirm('நிச்சயமாக இந்த பில்லை அழிக்க வேண்டுமா? / Clear current bill?')) {
          setViewingTxIndex(null);
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
      
      // F2: Open search overlay on active row (only if not viewing history)
      if (e.key === 'F2') {
        e.preventDefault();
        if (viewingTxIndex === null) {
          openSearch('');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [billItems, activeRowIndex, activeColumn, showSearchOverlay, customerName, customerMobile, discount, rent, coolie, advance, viewingTxIndex, draftBill]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Focus management based on row/column updates
  useEffect(() => {
    if (showSearchOverlay) {
      if (searchInputRef.current) searchInputRef.current.focus();
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
  }, [activeRowIndex, activeColumn, showSearchOverlay]);

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

  // Add Item to Bill row
  const addProductToRow = (product, rowIndex) => {
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

  // Handle cell inputs
  const handleCellChange = (rowIndex, column, value) => {
    const updated = [...billItems];
    const row = updated[rowIndex];

    if (column === 'code') {
      row.code = value;
      // Check if code matches a product instantly
      const match = database.products.find(p => p.code.toLowerCase() === value.toLowerCase() && !p.disableItem);
      if (match) {
        addProductToRow(match, rowIndex);
        return;
      }
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
        const codeValue = billItems[rowIndex].code;
        if (!codeValue) {
          openSearch('');
        } else {
          const match = database.products.find(p => p.code.toLowerCase() === codeValue.toLowerCase() && !p.disableItem);
          if (match) {
            addProductToRow(match, rowIndex);
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

  const getFilteredSearchResults = () => {
    if (!searchQuery) return database.products.filter(p => !p.disableItem).slice(0, 8);
    
    return database.products.filter(p => 
      !p.disableItem && (
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tamilName && p.tamilName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.group && p.group.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    ).slice(0, 8);
  };

  const handleSearchOverlayKeyDown = (e) => {
    const results = getFilteredSearchResults();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedSearchIndex(prev => Math.min(results.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedSearchIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightedSearchIndex]) {
        addProductToRow(results[highlightedSearchIndex], activeRowIndex);
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

  const calculateNetTotal = () => {
    const gross = calculateGrossTotal();
    const discVal = parseFloat(discount) || 0;
    const rentVal = parseFloat(rent) || 0;
    const coolieVal = parseFloat(coolie) || 0;
    
    return Math.max(0, gross - discVal + rentVal + coolieVal);
  };

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

  const viewPreviousBill = () => {
    if (!database.transactions || database.transactions.length === 0) return;
    
    let nextIndex;
    if (viewingTxIndex === null) {
      // Backup current active screen draft
      setDraftBill({
        billItems,
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
        setDraftBill(null);
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
  };

  const handleSettleBill = (action = 'save') => {
    // If viewing a past bill, only allow re-printing, not re-saving
    if (viewingTxIndex !== null) {
      if (action !== 'save') {
        onPrintReceipt(database.transactions[viewingTxIndex], action);
      }
      return;
    }

    const itemsToSave = billItems.filter(item => item.code !== '');
    if (itemsToSave.length === 0) {
      alert('பில்லில் பொருட்கள் இல்லை! / No items in the bill!');
      return;
    }

    const invoice = {
      invoiceNo: getNextBillNumber(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      customerName,
      customerMobile,
      customerAddress: `${addressLine1} ${addressLine2} ${addressLine3}`.trim(),
      items: itemsToSave,
      grossTotal: calculateGrossTotal(),
      discount: parseFloat(discount) || 0,
      rent: parseFloat(rent) || 0,
      coolie: parseFloat(coolie) || 0,
      advance: parseFloat(advance) || 0,
      netTotal: calculateNetTotal(),
      operator: database.settings.defaultOperator || 'T'
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

    onUpdateDatabase({
      ...database,
      products: updatedProducts,
      transactions: updatedTransactions
    });

    if (action === 'save') {
      alert('பில் வெற்றிகரமாக சேமிக்கப்பட்டது! / Bill saved successfully!');
    } else {
      onPrintReceipt(invoice, action); // action is 'tamil' or 'english'
    }

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

  const results = getFilteredSearchResults();

  return (
    <div className="billing-dashboard-screen screen-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      


      {/* Title & Time Header Row */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px', 
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 'bold' }}>
            {database.settings.headerSlogan}
          </span>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#15803d' }}>
            {database.settings.shopName}
          </h1>
        </div>

        {/* Digital Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

      {/* Main Screen Panels split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '12px', gap: '12px' }}>
        
        {/* Left billing core */}
        <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          
          {/* Metadata Section: Divided split panels to match original screen */}
          <div className="pos-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 0.8fr', gap: '15px', padding: '12px' }}>
            
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
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>{getTodayDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>வகை / Type</span>
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ width: '80px', height: '28px', padding: '2px 8px' }} 
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  readOnly={viewingTxIndex !== null}
                />
              </div>
            </div>

            {/* Panel 2: Customer Name, Address lines, Mobile */}
            <div style={{ display: 'flex', gap: '15px', borderRight: '1px solid var(--border-color)', paddingRight: '12px' }}>
              
              <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="input-group">
                  <span className="input-label" style={{ fontSize: '10px' }}>வாடிக்கையாளர் / CUSTOMER NAME</span>
                  <input 
                    type="text" 
                    className="pos-input" 
                    style={{ height: '28px', padding: '2px 8px' }}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    readOnly={viewingTxIndex !== null}
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
                    readOnly={viewingTxIndex !== null}
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
                  readOnly={viewingTxIndex !== null}
                />
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ height: '24px', padding: '2px 8px', fontSize: '12px' }}
                  placeholder="Village / Town"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  readOnly={viewingTxIndex !== null}
                />
                <input 
                  type="text" 
                  className="pos-input" 
                  style={{ height: '24px', padding: '2px 8px', fontSize: '12px' }}
                  placeholder="District"
                  value={addressLine3}
                  onChange={(e) => setAddressLine3(e.target.value)}
                  readOnly={viewingTxIndex !== null}
                />
              </div>

            </div>

            {/* Panel 3: R/W Mode, Pricing mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>R / W</span>
                <input 
                  type="text" 
                  className="pos-input mono" 
                  style={{ width: '40px', height: '28px', padding: '2px 4px', textAlign: 'center', fontWeight: 'bold' }} 
                  value={rwMode}
                  onChange={(e) => setRwMode(e.target.value)}
                  readOnly={viewingTxIndex !== null}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="input-label" style={{ fontSize: '10px' }}>Pricing</span>
                <input 
                  type="text" 
                  className="pos-input mono" 
                  style={{ width: '40px', height: '28px', padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', color: 'var(--error) !important' }} 
                  value={pricingMode}
                  onChange={(e) => setPricingMode(e.target.value)}
                  readOnly={viewingTxIndex !== null}
                />
              </div>
            </div>

          </div>

          {/* Main Billing Grid with BLUE headers */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }} onClick={handleBillingAreaClick}>
            
            <div className="table-container" style={{ flex: 1 }}>
              <table className="pos-table">
                <thead>
                  <tr style={{ background: 'linear-gradient(180deg, #1e3a8a 0%, #172554 100%)' }}>
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
                          style={{ border: activeRowIndex === index && activeColumn === 'code' ? '1.5px solid var(--border-focus)' : 'none', background: 'transparent', padding: '2px' }}
                          value={item.code}
                          onChange={(e) => handleCellChange(index, 'code', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'code')}
                          onFocus={() => { setActiveRowIndex(index); setActiveColumn('code'); }}
                          readOnly={viewingTxIndex !== null}
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
                            {item.unit === 'kg' ? 'கிலோ' : item.unit === 'piece' ? 'NO' : item.unit}
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
                            border: activeRowIndex === index && activeColumn === 'qty' ? '1.5px solid var(--border-focus)' : 'none', 
                            background: 'transparent', 
                            padding: '2px',
                            fontWeight: 'bold'
                          }}
                          value={item.qty}
                          onChange={(e) => handleCellChange(index, 'qty', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'qty')}
                          onFocus={() => { setActiveRowIndex(index); setActiveColumn('qty'); }}
                          readOnly={viewingTxIndex !== null}
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
                            border: activeRowIndex === index && activeColumn === 'rate' ? '1.5px solid var(--border-focus)' : 'none', 
                            background: 'transparent', 
                            padding: '2px' 
                          }}
                          value={item.overridePrice}
                          onChange={(e) => handleCellChange(index, 'rate', e.target.value)}
                          onKeyDown={(e) => handleCellKeyDown(e, index, 'rate')}
                          onFocus={() => { setActiveRowIndex(index); setActiveColumn('rate'); }}
                          readOnly={viewingTxIndex !== null}
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
                        <button className="btn-ghost" style={{ padding: '2px', color: 'var(--error)' }} onClick={() => removeRow(index)} disabled={viewingTxIndex !== null}>
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
                      onChange={(e) => { setSearchQuery(e.target.value); setHighlightedSearchIndex(0); }}
                      onKeyDown={handleSearchOverlayKeyDown}
                    />
                  </div>
                  <button className="btn-secondary" style={{ padding: '4px 12px', height: '32px', fontSize: '12px' }} onClick={closeSearch}>
                    மூடுக / Close (Esc)
                  </button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  <table className="pos-table">
                    <thead>
                      <tr>
                        <th>குறியீடு / Code</th>
                        <th>பொருள் / Product Name (Eng)</th>
                        <th>தமிழ் பெயர் / Tamil Name</th>
                        <th>Unit</th>
                        <th style={{ textAlign: 'right' }}>விற்பனை விலை / Selling Rate</th>
                        <th>விலை டைப் / Price Type</th>
                        <th>இருப்பு / Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((p, i) => (
                        <tr 
                          key={p.code} 
                          className={highlightedSearchIndex === i ? 'active-row' : ''}
                          style={{ cursor: 'pointer' }}
                          onClick={() => addProductToRow(p, activeRowIndex)}
                        >
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{p.code}</td>
                          <td style={{ fontWeight: '600' }}>{p.name}</td>
                          <td>{p.tamilName}</td>
                          <td>{p.unit}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{p.sellingPrice.toFixed(2)}</td>
                          <td>{p.priceType === 'Quantity' ? 'Qty Based' : 'Fixed'}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{p.currentStock.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Left Buttons Panel (Search & Exit) */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-secondary" style={{ padding: '8px 24px' }} onClick={() => openSearch('')}>
              Search
            </button>
            <button className="btn-secondary" style={{ padding: '8px 24px' }} onClick={onLogOut}>
              Exit
            </button>
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

            {/* discount - Red box */}
            <div className="summary-box-red" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>வாபஸ் / Discount</span>
              <input 
                type="number" 
                className="mono" 
                style={{ width: '100px', height: '28px', border: 'none', background: 'transparent', padding: '2px 8px', textAlign: 'right', fontWeight: 'bold' }}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                readOnly={viewingTxIndex !== null}
              />
            </div>

            {/* rent - Purple box */}
            <div className="summary-box-purple" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>வாடகை / Rent</span>
              <input 
                type="number" 
                className="mono" 
                style={{ width: '100px', height: '28px', border: 'none', background: 'transparent', padding: '2px 8px', textAlign: 'right', fontWeight: 'bold' }}
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                readOnly={viewingTxIndex !== null}
              />
            </div>

            {/* coolie - Blue box */}
            <div className="summary-box-blue" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>கூலி / Labor</span>
              <input 
                type="number" 
                className="mono" 
                style={{ width: '100px', height: '28px', border: 'none', background: 'transparent', padding: '2px 8px', textAlign: 'right', fontWeight: 'bold' }}
                value={coolie}
                onChange={(e) => setCoolie(e.target.value)}
                readOnly={viewingTxIndex !== null}
              />
            </div>

            {/* advance - Orange box */}
            <div className="summary-box-orange" style={{ display: 'flex', alignItems: 'center', borderRadius: '6px', overflow: 'hidden' }}>
              <span className="input-label" style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}>வரவு / Advance</span>
              <input 
                type="number" 
                className="mono" 
                style={{ width: '100px', height: '28px', border: 'none', background: 'transparent', padding: '2px 8px', textAlign: 'right', fontWeight: 'bold' }}
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                readOnly={viewingTxIndex !== null}
              />
            </div>

          </div>

          {/* Large Net Total display box - White card with large blue text */}
          <div className="pos-card" style={{ 
            background: '#ffffff', 
            border: '2px solid var(--border-color)', 
            textAlign: 'center', 
            padding: '16px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '6px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#09090b', letterSpacing: '0.05em' }}>
              பில் தொகை :
            </span>
            <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#1d4ed8', fontFamily: 'var(--font-mono)' }}>
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

          {/* Hotkeys sidebar - Light Mode styled */}
          <div className="pos-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minHeight: '160px', border: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
            <span className="input-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--primary)' }}>விசை வழிகாட்டி / Shortcuts</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
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

    </div>
  );
}
