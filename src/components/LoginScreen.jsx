import React, { useState, useEffect } from 'react';
import { Key, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const defaultPin = '1234';

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    
    if (pin === defaultPin) {
      setError('');
      onLogin();
    } else {
      setError('தவறான குறியீடு! / Invalid PIN!');
      setPin('');
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  // Keyboard support for lock screen (Numpad input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleUnlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="login-screen screen-fade" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      width: '100vw',
      background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)'
    }}>
      
      <div className="pos-card" style={{ 
        maxWidth: '380px', 
        width: '90%', 
        padding: '30px 20px', 
        textAlign: 'center',
        background: 'rgba(18, 18, 22, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        {/* Slogans */}
        <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '2px' }}>
          ஸ்ரீ முருகன் துணை
        </div>
        
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          SRI PERUMAL STORES
        </h2>
        
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          வேகமான பில்லிங் மென்பொருள் / Express POS System
        </p>

        {/* Lock Icon Indicator */}
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
          border: error ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: error ? 'var(--error)' : 'var(--primary)',
          transition: 'all 0.3s ease'
        }}>
          <Key size={28} />
        </div>

        {/* PIN Input Box */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginBottom: '10px' 
          }}>
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: pin.length > i ? 'var(--success)' : 'transparent',
                  border: pin.length > i ? 'none' : '2px solid var(--border-color)',
                  boxShadow: pin.length > i ? '0 0 8px var(--success)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>
          {error ? (
            <span style={{ fontSize: '12px', color: 'var(--error)', display: 'block' }}>{error}</span>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>
              PIN குறியீடு உள்ளிடவும் (Default: 1234)
            </span>
          )}
        </div>

        {/* Pin Keypad Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              className="btn-secondary" 
              style={{ height: '50px', fontSize: '18px', fontWeight: '600', borderRadius: '10px' }}
              onClick={() => handleKeyPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <button 
            className="btn-secondary" 
            style={{ height: '50px', fontSize: '12px', fontWeight: 'bold', color: 'var(--error)' }}
            onClick={handleClear}
          >
            Clear
          </button>
          <button 
            className="btn-secondary" 
            style={{ height: '50px', fontSize: '18px', fontWeight: '600' }}
            onClick={() => handleKeyPress('0')}
          >
            0
          </button>
          <button 
            className="btn-secondary" 
            style={{ height: '50px', fontSize: '12px', fontWeight: 'bold' }}
            onClick={handleBackspace}
          >
            Del
          </button>
        </div>

        {/* Unlock Action Button */}
        <button 
          className="btn-success" 
          style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '10px' }}
          onClick={handleUnlock}
        >
          அனுமதி / Unlock (Enter)
        </button>

        {/* Offline verification details */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '6px', 
          fontSize: '11px', 
          color: 'var(--text-secondary)',
          marginTop: '20px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '12px'
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
          <span>பாதுகாப்பான ஆஃப்லைன் POS / Secured Offline POS</span>
        </div>

      </div>

    </div>
  );
}
