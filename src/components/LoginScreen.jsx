import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Key, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('T');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Focus username field on mount and select the text
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
      usernameRef.current.select();
    }
  }, []);

  // Update progress bar during loading screen
  useEffect(() => {
    let interval;
    if (isLoading) {
      const startTime = Date.now();
      const duration = 2500; // 2.5 seconds
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          onLogin();
        }
      }, 30); // update every 30ms for smooth rendering
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, onLogin]);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    const u = username.trim().toUpperCase();
    const p = password.trim().toUpperCase();

    if (u === 'T' && p === 'T') {
      setError('');
      setIsLoading(true);
    } else {
      setError('தவறான பயனர் பெயர் / கடவுச்சொல்! (Invalid Username/Password)');
      setPassword('');
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
    }
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (passwordRef.current) {
        passwordRef.current.focus();
      }
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  // If loading, show the loading screen overlay
  if (isLoading) {
    return (
      <div className="login-screen screen-fade" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
        color: '#ffffff',
        fontFamily: 'var(--font-sans, sans-serif)'
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner-animate {
            animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #10b981);
            border-radius: 4px;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
            transition: width 0.03s linear;
          }
        `}} />
        
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
          padding: '40px 30px',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }} className="spinner-animate">
              <RefreshCw size={32} />
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
            ஸ்ரீ முருகன் துணை
          </h3>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#3b82f6', letterSpacing: '-0.02em' }}>
            SRI PERUMAL STORES
          </h2>
          
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '32px' }}>
            அமைப்பை அணுகுகிறது... / Loading system...
          </p>

          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
            <span>தயவுசெய்து காத்திருக்கவும் / Please Wait</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen screen-fade" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      width: '100vw',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      fontFamily: 'var(--font-sans, sans-serif)'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .login-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          font-size: 15px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff !important;
          outline: none;
          transition: all 0.2s ease;
        }
        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          background: rgba(15, 23, 42, 0.8);
        }
        .login-card {
          max-width: 420px;
          width: 90%;
          padding: 40px 30px;
          text-align: center;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: cardSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
      
      <div className="login-card">
        
        {/* Divine Slogan & Store Name */}
        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '4px' }}>
          ஸ்ரீ முருகன் துணை
        </div>
        
        <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          SRI PERUMAL STORES
        </h2>
        
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '32px' }}>
          வேகமான பில்லிங் மென்பொருள் / Express POS System
        </p>

        {/* Lock Icon */}
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
          border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 28px auto',
          color: error ? '#ef4444' : '#3b82f6',
          transition: 'all 0.3s ease'
        }}>
          <Key size={26} />
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '12.5px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          
          {/* Username Field */}
          <div style={{ marginBottom: '18px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: 'rgba(255, 255, 255, 0.6)', 
              marginBottom: '6px' 
            }}>
              பயனர்பெயர் / Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <User size={18} />
              </span>
              <input 
                ref={usernameRef}
                type="text" 
                className="login-input" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameKeyDown}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: 'rgba(255, 255, 255, 0.6)', 
              marginBottom: '6px' 
            }}>
              கடவுச்சொல் / Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={18} />
              </span>
              <input 
                ref={passwordRef}
                type="password" 
                className="login-input" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="btn-success" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '15px', 
              borderRadius: '10px',
              background: '#3b82f6',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
              border: 'none',
              fontWeight: '700',
              color: '#ffffff'
            }}
          >
            உள்நுழை / Login (Enter)
          </button>
        </form>

        {/* Footer info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '6px', 
          fontSize: '11px', 
          color: 'rgba(255, 255, 255, 0.4)',
          marginTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '16px'
        }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>பாதுகாப்பான ஆஃப்லைன் POS / Secured Offline POS</span>
        </div>

      </div>

    </div>
  );
}
