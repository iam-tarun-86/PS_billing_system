import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, DollarSign, RefreshCw, Printer, FileSpreadsheet, BarChart2, TrendingUp, X } from 'lucide-react';
import { exportToCSV } from '../utils/csv';
import { isTauri, tauriAPI } from '../utils/tauriBridge';

export default function SalesHistory({ database, onUpdateDatabase, onBack, onPrintReceipt, isPrintModalOpen }) {
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

  useEffect(() => {
    logInfo('SalesHistory mounted');
  }, []);

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTodayDbDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy}`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(getTodayDateString());
  const [visibleCount, setVisibleCount] = useState(100);
  
  // Sales Visualizer states
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerTab, setVisualizerTab] = useState('days'); // 'days' | 'weeks' | 'months' | 'years'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const [viewingBillDetails, setViewingBillDetails] = useState(null);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(100);
  }, [searchTerm, filterDate]);

  // Handle lazy loading scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 120) {
      setVisibleCount(prev => Math.min(filteredTransactions.length, prev + 100));
    }
  };

  // Escape key handling: closes visualizer or details modal if open, otherwise goes back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPrintModalOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isVisualizerOpen) {
          setIsVisualizerOpen(false);
          setHoveredIndex(null);
        } else if (viewingBillDetails) {
          setViewingBillDetails(null);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, isPrintModalOpen, isVisualizerOpen, viewingBillDetails]);

  const parseTxDate = (t) => {
    if (t.timestamp) {
      return new Date(t.timestamp);
    }
    if (t.date) {
      const parts = t.date.split('/');
      if (parts.length === 3) {
        const dd = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const yyyy = parseInt(parts[2], 10);
        return new Date(yyyy, mm, dd);
      }
    }
    return new Date();
  };

  const getVisualizerData = () => {
    const allTxs = database.transactions || [];

    if (visualizerTab === 'days') {
      const dailyData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        const dateStr = `${dd}/${mm}/${yyyy}`;
        
        const total = allTxs
          .filter(t => t.date === dateStr)
          .reduce((sum, t) => sum + t.netTotal, 0);
          
        dailyData.push({
          label: `${dd}/${mm}`,
          fullLabel: `${dd}/${mm}/${yyyy}`,
          value: total
        });
      }
      return dailyData;
    }

    if (visualizerTab === 'weeks') {
      const weeklyData = [];
      const oneDayMs = 24 * 60 * 60 * 1000;
      for (let i = 3; i >= 0; i--) {
        const now = new Date();
        const endOfWeek = new Date(now.getTime() - i * 7 * oneDayMs);
        const startOfWeek = new Date(endOfWeek.getTime() - 6 * oneDayMs);
        startOfWeek.setHours(0,0,0,0);
        endOfWeek.setHours(23,59,59,999);
        
        const total = allTxs.filter(t => {
          const txDate = parseTxDate(t);
          return txDate >= startOfWeek && txDate <= endOfWeek;
        }).reduce((sum, t) => sum + t.netTotal, 0);
        
        const startDd = String(startOfWeek.getDate()).padStart(2, '0');
        const startMm = String(startOfWeek.getMonth() + 1).padStart(2, '0');
        const endDd = String(endOfWeek.getDate()).padStart(2, '0');
        const endMm = String(endOfWeek.getMonth() + 1).padStart(2, '0');
        
        weeklyData.push({
          label: `W${4 - i}`,
          fullLabel: `${startDd}/${startMm} - ${endDd}/${endMm}`,
          value: total
        });
      }
      return weeklyData;
    }

    if (visualizerTab === 'months') {
      const monthlyData = [];
      const monthNamesTamil = [
        'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
        'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
      ];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const targetMonth = d.getMonth();
        const targetYear = d.getFullYear();
        
        const total = allTxs.filter(t => {
          const txDate = parseTxDate(t);
          return txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear;
        }).reduce((sum, t) => sum + t.netTotal, 0);
        
        monthlyData.push({
          label: `${monthNamesTamil[targetMonth].slice(0, 3)}`,
          fullLabel: `${monthNamesTamil[targetMonth]} ${targetYear}`,
          value: total
        });
      }
      return monthlyData;
    }

    if (visualizerTab === 'years') {
      const yearlyData = [];
      const currentYear = new Date().getFullYear();
      for (let i = 2; i >= 0; i--) {
        const targetYear = currentYear - i;
        const total = allTxs.filter(t => {
          const txDate = parseTxDate(t);
          return txDate.getFullYear() === targetYear;
        }).reduce((sum, t) => sum + t.netTotal, 0);
        
        yearlyData.push({
          label: `${targetYear}`,
          fullLabel: `${targetYear} Sales`,
          value: total
        });
      }
      return yearlyData;
    }

    return [];
  };

  const transactions = database.transactions || [];

  // Deletes exactly one bill, identified by its immutable id.
  //
  // This used to match on invoiceNo, which is not unique: the 1,850 imported bills share
  // only 138 distinct numbers, so confirming one dialog removed every bill carrying that
  // number - up to 120 at once - while restoring stock for only one of them.
  const handleDeleteTransaction = (tx) => {
    const invoiceNo = tx.invoiceNo;
    if (confirm(`நிச்சயமாக இந்த பில்லை நீக்க வேண்டுமா?\nAre you sure you want to delete Bill No ${invoiceNo}?`)) {
      const txToDelete = transactions.find(t => t.id === tx.id);
      if (!txToDelete) return;

      // Restore inventory stocks
      const updatedProducts = database.products.map(p => {
        const soldItem = txToDelete.items.find(item => item.code === p.code);
        if (soldItem) {
          return {
            ...p,
            currentStock: p.currentStock + (parseFloat(soldItem.qty) || 0)
          };
        }
        return p;
      });

      const updatedTransactions = transactions.filter(t => t.id !== tx.id);

      logInfo(`Deleting bill id ${tx.id} (No #${invoiceNo}, ${txToDelete.date}), netTotal: ₹${(Number(txToDelete.netTotal) || 0).toFixed(2)}. Rows removed: ${transactions.length - updatedTransactions.length}.`);

      onUpdateDatabase({
        ...database,
        products: updatedProducts,
        transactions: updatedTransactions
      });
    }
  };

  const handleExportCSV = () => {
    logInfo(`Exporting ${filteredTransactions.length} transactions to CSV`);
    const headers = [
      'Invoice No', 'Timestamp', 'Year', 'Month', 'Day', 'Date', 'Time',
      'Customer Name', 'Mobile', 'Address', 'Gross Total', 'Discount',
      'Rent', 'Labor/Coolie', 'Advance Paid', 'Net Total', 'Operator', 'Items Summary'
    ];
    const rows = filteredTransactions.map(t => {
      const itemsSummary = t.items.map(item => `${item.name} (${item.qty} ${item.unit})`).join(' | ');
      return [
        t.invoiceNo,
        t.timestamp || '',
        t.year || '',
        t.month || '',
        t.day || '',
        t.date || '',
        t.time || '',
        t.customerName || 'CASH',
        t.customerMobile || '',
        t.customerAddress || '',
        t.grossTotal,
        t.discount || 0,
        t.rent || 0,
        t.coolie || 0,
        t.advance || 0,
        t.netTotal,
        t.operator || 'T',
        itemsSummary
      ];
    });
    exportToCSV('sales_transactions.csv', headers, rows);
  };

  // Filtered lists
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.invoiceNo.toString().includes(searchTerm) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.customerMobile && t.customerMobile.includes(searchTerm));
    
    let matchesDate = true;
    if (filterDate) {
      const parts = filterDate.split('-');
      if (parts.length === 3) {
        const formattedFilterDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        matchesDate = t.date === formattedFilterDate;
      }
    }

    return matchesSearch && matchesDate;
  }).reverse(); // Latest transaction first

  // Summary Metrics
  const calculateTotalSales = () => {
    return filteredTransactions.reduce((sum, t) => sum + t.netTotal, 0);
  };

  const calculateTotalCash = () => {
    // Items settled with advance representing cash received
    return filteredTransactions.reduce((sum, t) => sum + (t.advance || t.netTotal), 0);
  };

  const calculateTotalCredit = () => {
    // Unpaid portions
    return filteredTransactions.reduce((sum, t) => {
      const cred = t.netTotal - t.advance;
      return sum + (cred > 0 ? cred : 0);
    }, 0);
  };

  return (
    <div className="sales-history-screen screen-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={onBack}>
            <ArrowLeft size={16} /> பின்னே / Back
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>விற்பனை சரித்திரம் / Sales Transaction Logs</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-success" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }} onClick={() => { logInfo('Opened Sales Trend Visualizer'); setIsVisualizerOpen(true); }}>
            <BarChart2 size={16} /> வரைபடம் / Visualize Sales
          </button>
          <button className="btn-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleExportCSV}>
            <FileSpreadsheet size={16} /> கோப்பு இறக்கம் / Export CSV
          </button>
        </div>
      </div>

      {/* KPI summaries row */}
      {(() => {
        const todayDbFormatted = getTodayDbDate();
        const todayTransactions = transactions.filter(t => t.date === todayDbFormatted);
        const todayBillsCount = todayTransactions.length;
        const todayTotalRevenue = todayTransactions.reduce((sum, t) => sum + t.netTotal, 0);

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            
            <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>இன்றைய விற்பனைகள் / Today's Bills Count</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{todayBillsCount}</span>
              </div>
              <RefreshCw size={24} style={{ color: 'var(--primary)' }} />
            </div>

            <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>இன்றைய மொத்த வரவு / Today's Total Revenue</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                  ₹{todayTotalRevenue.toFixed(2)}
                </span>
              </div>
              <DollarSign size={24} style={{ color: 'var(--success)' }} />
            </div>

          </div>
        );
      })()}

      {/* Filter and Table container */}
      <div className="pos-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="பில் எண் அல்லது வாடிக்கையாளர் தேடுக... / Search by bill number, customer..." 
              className="pos-input" 
              style={{ paddingLeft: '36px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="date" 
              className="pos-input" 
              style={{ width: '180px' }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => setFilterDate('')}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Sales Table */}
        <div className="table-container" style={{ flex: 1 }} onScroll={handleScroll}>
          <table className="pos-table">
            <thead>
              <tr>
                <th>பில் எண் / Bill No</th>
                <th>தேதி & நேரம் / Date & Time</th>
                <th>வாடிக்கையாளர் / Customer</th>
                <th>பொருட்கள் எண்ணிக்கை / Items</th>
                <th style={{ textAlign: 'right' }}>மொத்தம் / Gross Total</th>
                <th style={{ textAlign: 'right' }}>கழிவு / Disc</th>
                <th style={{ textAlign: 'right' }}>கூடுதல் கட்டணம் / Charges</th>
                <th style={{ textAlign: 'right' }}>நிகர தொகை / Net Total</th>
                <th style={{ textAlign: 'right' }}>கொடுத்தது / Paid (Cash)</th>
                <th style={{ textAlign: 'right' }}>நிலுவை கடன் / Balance</th>
                <th style={{ textAlign: 'center' }}>செயல் / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, visibleCount).map(t => {
                const cred = t.netTotal - t.advance;
                const totalCharges = (t.rent || 0) + (t.coolie || 0);
                
                return (
                  <tr key={t.invoiceNo}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{t.invoiceNo}</td>
                    <td>{t.date} | {t.time}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500' }}>{t.customerName}</span>
                        {t.customerMobile && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>📞 {t.customerMobile}</span>}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{t.items.length}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{t.grossTotal.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--error)' }}>₹{(t.discount || 0).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>₹{totalCharges.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{t.netTotal.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>₹{(t.advance || t.netTotal).toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: cred > 0 ? 'var(--warning)' : 'inherit' }}>
                      ₹{cred > 0 ? cred.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setViewingBillDetails(t)}>
                        பார்க்க / View
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onPrintReceipt(t, 'tamil')}>
                        <Printer size={12} /> அச்சிடு / Print
                      </button>
                      <button className="btn-error" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteTransaction(t)}>
                        நீக்கு / Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    விற்பனை பதிவுகள் எதுவும் இல்லை / No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Sales Trend Visualizer Modal */}
      {isVisualizerOpen && (() => {
        const chartData = getVisualizerData();
        const periodTotal = chartData.reduce((sum, d) => sum + d.value, 0);
        const periodAvg = chartData.length > 0 ? (periodTotal / chartData.length) : 0;
        const periodPeak = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
        
        const getGrowthMetric = () => {
          const data = chartData;
          if (data.length < 2) return null;
          
          if (visualizerTab === 'days') {
            const todayVal = data[data.length - 1].value;
            const yesterdayVal = data[data.length - 2].value;
            if (yesterdayVal === 0) return todayVal > 0 ? { percent: 100, isUp: true } : { percent: 0, isUp: true };
            const percent = ((todayVal - yesterdayVal) / yesterdayVal) * 100;
            return { percent: Math.abs(percent), isUp: percent >= 0 };
          }
          
          if (visualizerTab === 'weeks') {
            const thisWeekVal = data[data.length - 1].value;
            const lastWeekVal = data[data.length - 2].value;
            if (lastWeekVal === 0) return thisWeekVal > 0 ? { percent: 100, isUp: true } : { percent: 0, isUp: true };
            const percent = ((thisWeekVal - lastWeekVal) / lastWeekVal) * 100;
            return { percent: Math.abs(percent), isUp: percent >= 0 };
          }
          
          if (visualizerTab === 'months') {
            const thisMonthVal = data[data.length - 1].value;
            const lastMonthVal = data[data.length - 2].value;
            if (lastMonthVal === 0) return thisMonthVal > 0 ? { percent: 100, isUp: true } : { percent: 0, isUp: true };
            const percent = ((thisMonthVal - lastMonthVal) / lastMonthVal) * 100;
            return { percent: Math.abs(percent), isUp: percent >= 0 };
          }

          if (visualizerTab === 'years') {
            const thisYearVal = data[data.length - 1].value;
            const lastYearVal = data[data.length - 2].value;
            if (lastYearVal === 0) return thisYearVal > 0 ? { percent: 100, isUp: true } : { percent: 0, isUp: true };
            const percent = ((thisYearVal - lastYearVal) / lastYearVal) * 100;
            return { percent: Math.abs(percent), isUp: percent >= 0 };
          }
          
          return null;
        };

        const growth = getGrowthMetric();
        
        // Chart dimensions
        const svgWidth = 500;
        const svgHeight = 240;
        const paddingTop = 25;
        const paddingBottom = 35;
        const paddingLeft = 50;
        const paddingRight = 20;
        const chartWidth = svgWidth - paddingLeft - paddingRight;
        const chartHeight = svgHeight - paddingTop - paddingBottom;
        
        const maxVal = Math.max(periodPeak, 1000);
        const maxValRounded = Math.ceil(maxVal / 100) * 100;
        
        // subdivisions for gridlines
        const subdivisions = 4;
        const gridLines = [];
        for (let i = 0; i <= subdivisions; i++) {
          const val = (maxValRounded / subdivisions) * i;
          const y = paddingTop + chartHeight - (val / maxValRounded) * chartHeight;
          gridLines.push({ val, y });
        }

        // Calculate coordinates for bars
        const numItems = chartData.length;
        const colWidth = chartWidth / numItems;
        const barWidth = colWidth * 0.55;
        const barSpacing = colWidth - barWidth;

        return (
          <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ maxWidth: '650px', width: '90%', padding: '20px', background: '#09090b', color: '#f8fafc', border: '1px solid #27272a' }}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>விற்பனை வரைபடம் / Sales Trend Visualizer</h3>
                </div>
                <button className="btn-ghost" style={{ padding: '6px', color: '#a1a1aa' }} onClick={() => { setIsVisualizerOpen(false); setHoveredIndex(null); }}>
                  <X size={20} />
                </button>
              </div>

              {/* Tab Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#18181b', padding: '4px', borderRadius: '8px' }}>
                {[
                  { key: 'days', label: 'தினசரி / Daily' },
                  { key: 'weeks', label: 'வாரவாரம் / Weekly' },
                  { key: 'months', label: 'மாதாந்திர / Monthly' },
                  { key: 'years', label: 'வருடாந்திர / Yearly' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      border: 'none',
                      background: visualizerTab === tab.key ? 'var(--primary)' : 'transparent',
                      color: visualizerTab === tab.key ? '#ffffff' : '#a1a1aa',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      logInfo(`Sales Visualizer tab switched to: ${tab.key}`);
                      setVisualizerTab(tab.key);
                      setHoveredIndex(null);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Chart Window (SVG) */}
              <div style={{ position: 'relative', background: '#18181b', padding: '10px', borderRadius: '8px', border: '1px solid #27272a', marginBottom: '20px' }}>
                
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="hoverGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>

                  {/* Gridlines */}
                  {gridLines.map((line, idx) => (
                    <g key={idx}>
                      <line
                        x1={paddingLeft}
                        y1={line.y}
                        x2={svgWidth - paddingRight}
                        y2={line.y}
                        stroke="#27272a"
                        strokeWidth="1"
                        strokeDasharray={idx === 0 ? "none" : "3,3"}
                      />
                      <text
                        x={paddingLeft - 8}
                        y={line.y + 4}
                        fill="#71717a"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        textAnchor="end"
                      >
                        ₹{line.val.toFixed(0)}
                      </text>
                    </g>
                  ))}

                  {/* Bars */}
                  {chartData.map((d, index) => {
                    const x = paddingLeft + index * colWidth + barSpacing / 2;
                    const h = maxValRounded > 0 ? (d.value / maxValRounded) * chartHeight : 0;
                    const y = paddingTop + chartHeight - h;

                    return (
                      <g key={index}>
                        {/* Invisible broad hover sensor area */}
                        <rect
                          x={paddingLeft + index * colWidth}
                          y={paddingTop}
                          width={colWidth}
                          height={chartHeight}
                          fill="transparent"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            setHoveredIndex(index);
                            const container = e.currentTarget.closest('.modal-content');
                            const svgElement = e.currentTarget.closest('svg');
                            const svgRect = svgElement.getBoundingClientRect();
                            const containerRect = container.getBoundingClientRect();
                            
                            const barRectX = paddingLeft + index * colWidth + colWidth / 2;
                            const barRectY = y;
                            
                            const scaleX = svgRect.width / svgWidth;
                            const scaleY = svgRect.height / svgHeight;
                            
                            setHoveredPosition({
                              x: (svgRect.left - containerRect.left) + barRectX * scaleX,
                              y: (svgRect.top - containerRect.top) + barRectY * scaleY
                            });
                          }}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />

                        {/* Rendered Bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(h, 2)}
                          rx={3}
                          fill={hoveredIndex === index ? "url(#hoverGrad)" : "url(#barGrad)"}
                          style={{ transition: 'all 0.2s ease-out' }}
                          pointerEvents="none"
                        />

                        {/* X-axis labels */}
                        <text
                          x={x + barWidth / 2}
                          y={paddingTop + chartHeight + 16}
                          fill={hoveredIndex === index ? "#60a5fa" : "#71717a"}
                          fontSize="9"
                          fontWeight={hoveredIndex === index ? "bold" : "normal"}
                          textAnchor="middle"
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Absolute HTML Tooltip */}
                {hoveredIndex !== null && chartData[hoveredIndex] && (
                  <div style={{
                    position: 'absolute',
                    left: hoveredPosition.x,
                    top: hoveredPosition.y,
                    transform: 'translate(-50%, -115%)',
                    background: '#1e293b',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none',
                    border: '1px solid #475569',
                    zIndex: 1010,
                    whiteSpace: 'nowrap',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: '9px', marginBottom: '2px', textTransform: 'uppercase' }}>{chartData[hoveredIndex].fullLabel}</div>
                    <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                      ₹{chartData[hoveredIndex].value.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#18181b', padding: '10px 14px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '10px', color: '#71717a' }}>மொத்த விற்பனை / Total Sales</span>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    ₹{periodTotal.toFixed(2)}
                  </div>
                </div>

                <div style={{ background: '#18181b', padding: '10px 14px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '10px', color: '#71717a' }}>சராசரி / Average Sales</span>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    ₹{periodAvg.toFixed(2)}
                  </div>
                </div>

                <div style={{ background: '#18181b', padding: '10px 14px', borderRadius: '8px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '10px', color: '#71717a' }}>அதிகபட்சம் / Peak Sales</span>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '4px', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                    ₹{periodPeak.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Growth Compare Alert */}
              {growth && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: growth.isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  border: `1px solid ${growth.isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, 
                  marginBottom: '20px',
                  fontSize: '12px'
                }}>
                  <span style={{ color: '#a1a1aa' }}>
                    {visualizerTab === 'days' && 'நேற்றைய ஒப்பீடு / Compared to Yesterday:'}
                    {visualizerTab === 'weeks' && 'முந்தைய வார ஒப்பீடு / Compared to Last Week:'}
                    {visualizerTab === 'months' && 'முந்தைய மாத ஒப்பீடு / Compared to Last Month:'}
                    {visualizerTab === 'years' && 'முந்தைய வருட ஒப்பீடு / Compared to Last Year:'}
                  </span>
                  <span style={{ fontWeight: 'bold', color: growth.isUp ? 'var(--success)' : 'var(--error)' }}>
                    {growth.isUp ? '▲' : '▼'} {growth.percent.toFixed(1)}% {growth.isUp ? 'வளர்ச்சி / Growth' : 'சரிவு / Decline'}
                  </span>
                </div>
              )}

              {/* Close Button / Esc */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => { setIsVisualizerOpen(false); setHoveredIndex(null); }}>
                  மூடுக / Close (Esc)
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Complete Bill Details Inspector Modal */}
      {viewingBillDetails && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '650px', width: '90%', padding: '20px', background: '#ffffff', color: '#09090b', border: '1px solid var(--border-color)', borderRadius: '8px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>பில் விவரங்கள் / Bill Details - #{viewingBillDetails.invoiceNo}</h3>
              </div>
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setViewingBillDetails(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable bill preview) */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
              
              {/* Customer Metadata Card */}
              <div className="pos-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', marginBottom: '12px', fontSize: '12px', background: '#f8fafc' }}>
                <div>
                  <div><strong>பில் எண் / Bill No:</strong> #{viewingBillDetails.invoiceNo}</div>
                  <div><strong>தேதி / Date:</strong> {viewingBillDetails.date}</div>
                  <div><strong>நேரம் / Time:</strong> {viewingBillDetails.time}</div>
                </div>
                <div>
                  <div><strong>வாடிக்கையாளர் / Customer:</strong> {viewingBillDetails.customerName || 'CASH'}</div>
                  {viewingBillDetails.customerMobile && (
                    <div><strong>தொலைபேசி / Mobile:</strong> {viewingBillDetails.customerMobile}</div>
                  )}
                  {viewingBillDetails.customerAddress && (
                    <div><strong>முகவரி / Address:</strong> {viewingBillDetails.customerAddress}</div>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <table className="pos-table" style={{ width: '100%', marginBottom: '12px' }}>
                <thead>
                  <tr style={{ background: 'var(--primary)', color: '#ffffff' }}>
                    <th style={{ width: '50px', color: '#ffffff', padding: '6px' }}>S.No</th>
                    <th style={{ width: '80px', color: '#ffffff', padding: '6px' }}>Code</th>
                    <th style={{ color: '#ffffff', padding: '6px' }}>Product Item</th>
                    <th style={{ width: '100px', textAlign: 'right', color: '#ffffff', padding: '6px' }}>Qty</th>
                    <th style={{ width: '100px', textAlign: 'right', color: '#ffffff', padding: '6px' }}>Rate</th>
                    <th style={{ width: '110px', textAlign: 'right', color: '#ffffff', padding: '6px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingBillDetails.items.map((item, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ textAlign: 'center', padding: '6px' }}>{idx + 1}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', padding: '6px' }}>{item.code}</td>
                      <td style={{ padding: '6px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.tamilName}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', padding: '6px' }}>
                        {item.priceType === 'Quantity' ? parseFloat(item.qty).toFixed(3) : parseInt(item.qty)} {item.unit === 'kg' ? 'கிலோ' : item.unit === 'piece' ? 'NO' : item.unit}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', padding: '6px' }}>
                        ₹{parseFloat(item.overridePrice || item.sellingRate || 0).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 'bold', padding: '6px' }}>
                        ₹{parseFloat(item.totalPrice || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations Block */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Gross Total:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>₹{viewingBillDetails.grossTotal.toFixed(2)}</span>
                  </div>
                  {viewingBillDetails.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--error)' }}>
                      <span>Discount (-):</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{viewingBillDetails.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {((viewingBillDetails.rent || 0) + (viewingBillDetails.coolie || 0)) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                      <span>Charges (+):</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>+₹{((viewingBillDetails.rent || 0) + (viewingBillDetails.coolie || 0)).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '4px', marginTop: '4px' }}>
                    <span>Net Amount:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>₹{viewingBillDetails.netTotal.toFixed(2)}</span>
                  </div>
                  {viewingBillDetails.advance > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>Received:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>₹{viewingBillDetails.advance.toFixed(2)}</span>
                    </div>
                  )}
                  {(viewingBillDetails.netTotal - viewingBillDetails.advance) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)', fontWeight: 'bold' }}>
                      <span>Credit Bal:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>₹{(viewingBillDetails.netTotal - viewingBillDetails.advance).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 16px', background: 'var(--success)', color: '#ffffff', fontWeight: 'bold' }}
                onClick={() => {
                  onPrintReceipt(viewingBillDetails, 'tamil');
                }}
              >
                தமிழ் அச்சிடு / Tamil Print
              </button>
              <button 
                className="btn-primary" 
                style={{ padding: '8px 16px', background: 'var(--primary)', color: '#ffffff', fontWeight: 'bold' }}
                onClick={() => {
                  onPrintReceipt(viewingBillDetails, 'english');
                }}
              >
                English Print
              </button>
              <button 
                className="btn-secondary" 
                style={{ padding: '8px 16px' }}
                onClick={() => setViewingBillDetails(null)}
              >
                மூடுக / Close (Esc)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
