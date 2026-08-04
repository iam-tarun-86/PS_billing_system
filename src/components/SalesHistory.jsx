import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, DollarSign, RefreshCw, Printer, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils/csv';

export default function SalesHistory({ database, onBack, onPrintReceipt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const transactions = database.transactions || [];

  const handleExportCSV = () => {
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
        <button className="btn-secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleExportCSV}>
          <FileSpreadsheet size={16} /> கோப்பு இறக்கம் / Export CSV
        </button>
      </div>

      {/* KPI summaries row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        
        <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>விற்பனைகள் / Bills Count</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{filteredTransactions.length}</span>
          </div>
          <RefreshCw size={24} style={{ color: 'var(--primary)' }} />
        </div>

        <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>மொத்த வரவு / Total Revenue</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
              ₹{calculateTotalSales().toFixed(2)}
            </span>
          </div>
          <DollarSign size={24} style={{ color: 'var(--success)' }} />
        </div>

        <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>பணம் / Cash Received</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              ₹{calculateTotalCash().toFixed(2)}
            </span>
          </div>
          <DollarSign size={24} style={{ color: 'var(--primary)' }} />
        </div>

        <div className="pos-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>கடன் / Outstanding Credit</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
              ₹{calculateTotalCredit().toFixed(2)}
            </span>
          </div>
          <DollarSign size={24} style={{ color: 'var(--warning)' }} />
        </div>

      </div>

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
        <div className="table-container" style={{ flex: 1 }}>
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
                <th style={{ textAlign: 'center' }}>செயல் / Re-print</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => {
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
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onPrintReceipt(t)}>
                        <Printer size={12} /> அச்சிடு / Print
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

    </div>
  );
}
