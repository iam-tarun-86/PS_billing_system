import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { tauriAPI } from './utils/tauriBridge'

// Global JS error listeners
window.onerror = function (message, source, lineno, colno, error) {
  const errText = `JS Error: ${message} at ${source}:${lineno}:${colno} | Stack: ${error?.stack || ''}`;
  console.error(errText);
  try {
    tauriAPI.logMessage('error', errText);
  } catch (e) {}
};

window.addEventListener('unhandledrejection', function (event) {
  const errText = `Unhandled Rejection: ${event.reason?.message || event.reason} | Stack: ${event.reason?.stack || ''}`;
  console.error(errText);
  try {
    tauriAPI.logMessage('error', errText);
  } catch (e) {}
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    const fullErr = `React ErrorBoundary Caught: ${error?.message || error}\nStack: ${error?.stack || ''}\nComponentStack: ${errorInfo?.componentStack || ''}`;
    console.error(fullErr);
    try {
      tauriAPI.logMessage('error', fullErr);
    } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '30px',
          background: '#18181b',
          color: '#ef4444',
          minHeight: '100vh',
          fontFamily: 'monospace',
          overflow: 'auto'
        }}>
          <h2 style={{ color: '#f87171', marginBottom: '12px' }}>⚠️ System Error (பயன்பாட்டு பிழை)</h2>
          <p style={{ color: '#fafafa', marginBottom: '16px' }}>{this.state.error?.message || String(this.state.error)}</p>
          <pre style={{
            background: '#09090b',
            padding: '16px',
            borderRadius: '8px',
            color: '#a1a1aa',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error?.stack}
            {'\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 மீளேற்று / Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
