import React, { useState, useEffect } from 'react';
import { readDatabase, writeDatabase } from './utils/db';
import LoginScreen from './components/LoginScreen';
import BillingDashboard from './components/BillingDashboard';
import ProductManager from './components/ProductManager';
import SalesHistory from './components/SalesHistory';
import PrintReceiptModal from './components/PrintReceiptModal';

function App() {
  const [database, setDatabase] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('billing'); // 'billing' | 'inventory' | 'history'
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);
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

  const handleUpdateDatabase = async (newDb) => {
    setDatabase(newDb);
    try {
      await writeDatabase(newDb);
    } catch (err) {
      console.error('Failed to save database update', err);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('billing');
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
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
          onPrintReceipt={(invoice) => setActivePrintInvoice(invoice)}
        />
      )}

      {currentPage === 'inventory' && (
        <ProductManager 
          database={database}
          onUpdateDatabase={handleUpdateDatabase}
          onBack={() => setCurrentPage('billing')}
        />
      )}

      {currentPage === 'history' && (
        <SalesHistory 
          database={database}
          onBack={() => setCurrentPage('billing')}
          onPrintReceipt={(invoice) => setActivePrintInvoice(invoice)}
        />
      )}

      {/* Popups (Print Receipt Modal) */}
      {activePrintInvoice && (
        <PrintReceiptModal 
          invoice={activePrintInvoice}
          settings={database.settings}
          onClose={() => setActivePrintInvoice(null)}
        />
      )}

    </div>
  );
}

export default App;
