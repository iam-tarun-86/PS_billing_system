import React, { useState, useEffect } from 'react';
import { readDatabase, writeDatabase } from './utils/db';
import LoginScreen from './components/LoginScreen';
import BillingDashboard from './components/BillingDashboard';
import ProductManager from './components/ProductManager';
import SalesHistory from './components/SalesHistory';
import PrintReceiptModal from './components/PrintReceiptModal';
import { isTauri, tauriAPI } from './utils/tauriBridge';

function App() {
  const [database, setDatabase] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('billing'); // 'billing' | 'inventory' | 'history'
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);
  const [printLanguage, setPrintLanguage] = useState('tamil'); // 'tamil' | 'english'
  const [loading, setLoading] = useState(true);

  // Load database from local/file storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await readDatabase();
        setDatabase(data);
      } catch (err) {
        console.error('Failed to load database', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // A save that does not reach disk must never pass silently: the operator has to know
  // the bill is not stored before the next customer is served.
  const handleUpdateDatabase = async (newDb) => {
    setDatabase(newDb);
    try {
      const saved = await writeDatabase(newDb);
      if (!saved) throw new Error('Database write did not complete');
    } catch (err) {
      console.error('Failed to save database update', err);
      const detail = err?.message || String(err);
      if (isTauri()) {
        tauriAPI.logMessage('error', `Database save FAILED: ${detail}`);
      } else if (window.electronAPI && window.electronAPI.logMessage) {
        window.electronAPI.logMessage('error', `Database save FAILED: ${detail}`);
      }
      alert(
        [
          'சேமிப்பு தோல்வி! இந்த பில் சேமிக்கப்படவில்லை.',
          'SAVE FAILED - this bill was NOT stored.',
          '',
          detail,
          '',
          'மீண்டும் முயற்சிக்கவும் அல்லது உதவியை அணுகவும். / Try again, or get help before continuing.'
        ].join(String.fromCharCode(10))
      );
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('billing');
    if (window.electronAPI && window.electronAPI.onLoginSuccess) {
      window.electronAPI.onLoginSuccess();
    }
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    if (isTauri()) {
      tauriAPI.onLogout();
    } else if (window.electronAPI && window.electronAPI.onLogout) {
      window.electronAPI.onLogout();
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#09090b',
        color: '#fafafa',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #27272a',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <span style={{ fontSize: '14px', color: '#a1a1aa' }}>
          பக்கத்தை ஏற்றுகிறது... / Loading system...
        </span>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  // Render Login Lock screen if not authorized
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      
      {/* Route mapping based on currentPage */}
      {currentPage === 'billing' && (
        <BillingDashboard 
          database={database}
          onUpdateDatabase={handleUpdateDatabase}
          onLogOut={handleLogOut}
          onNavigateToInventory={() => setCurrentPage('inventory')}
          onNavigateToHistory={() => setCurrentPage('history')}
          onPrintReceipt={(invoice, lang) => {
            setPrintLanguage(lang);
            setActivePrintInvoice(invoice);
          }}
          isPrintModalOpen={!!activePrintInvoice}
        />
      )}

      {currentPage === 'inventory' && (
        <ProductManager 
          database={database}
          onUpdateDatabase={handleUpdateDatabase}
          onBack={() => setCurrentPage('billing')}
          isPrintModalOpen={!!activePrintInvoice}
        />
      )}

      {currentPage === 'history' && (
        <SalesHistory 
          database={database}
          onUpdateDatabase={handleUpdateDatabase}
          onBack={() => setCurrentPage('billing')}
          onPrintReceipt={(invoice, lang = 'tamil') => {
            setPrintLanguage(lang);
            setActivePrintInvoice(invoice);
          }}
          isPrintModalOpen={!!activePrintInvoice}
        />
      )}

      {/* Popups (Print Receipt Modal) */}
      {activePrintInvoice && (
        <PrintReceiptModal 
          invoice={activePrintInvoice}
          settings={database.settings}
          printLanguage={printLanguage}
          onClose={() => setActivePrintInvoice(null)}
        />
      )}

    </div>
  );
}

export default App;
