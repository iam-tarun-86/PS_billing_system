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
      // Maximize window immediately to absorb the maximize layout/render lag during the loading screen
      if (window.electronAPI && window.electronAPI.onLoginSuccess) {
        window.electronAPI.onLoginSuccess();
      }
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

  const getLoadingPhaseText = () => {
    if (progress < 15) return { ta: "கடையில் விளக்குகளை ஒளிரச் செய்கிறது...", en: "Powering store lighting systems..." };
    if (progress < 35) return { ta: "பொருட்களை அடுக்குகளில் அடுக்கப்படுகிறது...", en: "Arranging retail products on shelves..." };
    if (progress < 55) return { ta: "விலைப் பட்டியலைச் சரிபார்க்கிறது...", en: "Calibrating item retail prices..." };
    if (progress < 75) return { ta: "கணக்கு விவரங்களைச் சேகரிக்கிறது...", en: "Fetching cash register logs..." };
    if (progress < 92) return { ta: "பணப்பெட்டியைத் தயார் செய்கிறது...", en: "Calibrating drawer registers..." };
    return { ta: "பயன்பாடு தயாராக உள்ளது!", en: "POS dashboard is ready!" };
  };

  // If loading, show the loading screen overlay
  if (isLoading) {
    const phase = getLoadingPhaseText();
    return (
      <div className="login-screen screen-fade" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100vw',
        position: 'relative',
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
        color: '#ffffff',
        fontFamily: 'var(--font-sans, sans-serif)',
        overflow: 'hidden'
      }}>
        {/* Blurred Shop Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("./shop.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.25)',
          zIndex: 0,
          transform: 'scale(1.05)'
        }} />

        <style dangerouslySetInnerHTML={{__html: `
          .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #10b981);
            border-radius: 4px;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
            transition: width 0.03s linear;
          }
          /* Rack arranging animation */
          .racks-animation {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 140px;
            margin: 0 auto 28px auto;
            padding: 12px;
            background: rgba(15, 23, 42, 0.45);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(5px);
          }
          .rack {
            height: 16px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.25);
            display: flex;
            gap: 6px;
            align-items: flex-end;
            padding-bottom: 2px;
            position: relative;
          }
          .rack-item {
            width: 12px;
            border-radius: 2px 2px 0 0;
            animation: arrangeRackItem 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite alternate;
            opacity: 0;
          }
          .ri-1 { height: 12px; background: #3b82f6; animation-delay: 0.1s; }
          .ri-2 { height: 16px; background: #10b981; animation-delay: 0.3s; }
          .ri-3 { height: 10px; background: #f97316; animation-delay: 0.5s; }
          
          .ri-4 { height: 15px; background: #eab308; animation-delay: 0.2s; }
          .ri-5 { height: 11px; background: #3b82f6; animation-delay: 0.4s; }
          .ri-6 { height: 14px; background: #10b981; animation-delay: 0.6s; }

          .ri-7 { height: 9px;  background: #f97316; animation-delay: 0.3s; }
          .ri-8 { height: 15px; background: #eab308; animation-delay: 0.5s; }
          .ri-9 { height: 11px; background: #3b82f6; animation-delay: 0.7s; }

          @keyframes arrangeRackItem {
            0% {
              opacity: 0;
              transform: translateY(-16px) scale(0.6);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}>
          {/* Rack Arranging Animation instead of round arrow */}
          <div className="racks-animation">
            <div className="rack">
              <div className="rack-item ri-1" />
              <div className="rack-item ri-2" />
              <div className="rack-item ri-3" />
            </div>
            <div className="rack">
              <div className="rack-item ri-4" />
              <div className="rack-item ri-5" />
              <div className="rack-item ri-6" />
            </div>
            <div className="rack">
              <div className="rack-item ri-7" />
              <div className="rack-item ri-8" />
              <div className="rack-item ri-9" />
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
            ஸ்ரீ முருகன் துணை
          </h3>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#3b82f6', letterSpacing: '-0.02em' }}>
            SRI PERUMAL STORES
          </h2>
          
          {/* Dynamic Loading Phase Text */}
          <div style={{ minHeight: '52px', marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '14.5px', color: '#ffffff', fontWeight: '600' }}>
              {phase.ta}
            </span>
            <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
              {phase.en}
            </span>
          </div>

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
      position: 'relative',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      fontFamily: 'var(--font-sans, sans-serif)',
      overflow: 'hidden'
    }}>
      {/* Blurred Shop Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("./shop.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px) brightness(0.28)',
        zIndex: 0,
        transform: 'scale(1.05)'
      }} />

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
          padding: 30px;
          text-align: center;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          animation: cardSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          z-index: 1;
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
        
        {/* logo header */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '10px 0'
        }}>
          <img 
            src="./logo.png" 
            alt="PS Logo" 
            style={{
              maxHeight: '110px',
              maxWidth: '85%',
              objectFit: 'contain',
              borderRadius: '12px',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))'
            }}
          />
        </div>

        {/* Divine Slogan & Store Name */}
        <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '4px' }}>
          ஸ்ரீ முருகன் துணை
        </div>
        
        <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          SRI PERUMAL STORES
        </h2>
        
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px' }}>
          வேகமான பில்லிங் மென்பொருள் / Express POS System
        </p>

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
              color: '#ffffff',
              cursor: 'pointer'
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
          marginTop: '24px',
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
