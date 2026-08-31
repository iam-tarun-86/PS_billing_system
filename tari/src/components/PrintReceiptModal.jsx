import React, { useRef, useEffect } from 'react';
import { isTauri, tauriAPI } from '../utils/tauriBridge';

export default function PrintReceiptModal({ invoice, settings = {}, printLanguage = 'tamil', onClose }) {
  const printAreaRef = useRef();

  const shopName = settings.shopName || 'SRI PERUMAL STORES';
  const slogan = settings.headerSlogan || 'ஸ்ரீ முருகன் துணை';
  const phones = (settings.phoneNumbers || '9942143460, 9629708861')
    .split(',')
    .map(p => p.trim())
    .filter(p => p !== '9942143460')
    .join(', ');

  const handlePrint = async () => {
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

    logInfo(`Triggering print for Invoice #${invoice.invoiceNo} (Language: ${printLanguage})`);

    if (isTauri()) {
      try {
        const startTime = Date.now();
        await tauriAPI.printSilent();
        logInfo(`Tauri silent print triggered in ${Date.now() - startTime}ms`);
        // Wait 500ms to ensure print captures layout
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err) {
        logError(`Tauri silent print failed: ${err.message || err}. Falling back to window.print()`);
        window.print();
        onClose();
      }
    } else if (window.electronAPI && window.electronAPI.printSilent) {
      try {
        const startTime = Date.now();
        await window.electronAPI.printSilent();
        logInfo(`Silent print IPC triggered in ${Date.now() - startTime}ms`);
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err) {
        logError(`Silent print IPC failed: ${err.message}. Falling back to window.print()`);
        window.print();
        onClose();
      }
    } else {
      logInfo('Native silent print API not available. Using window.print() fallback.');
      window.print();
      onClose();
    }
  };

  // Fire print immediately on mount and close when done
  useEffect(() => {
    handlePrint();
  }, []);

  // Coerce every figure: a malformed item must print 0.00, never NaN.
  const money = (v) => Number(v) || 0;
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const net = money(invoice.netTotal);
  const discount = money(invoice.discount);
  const charges = money(invoice.rent) + money(invoice.coolie);
  const paid = money(invoice.advance);
  const roundOff = money(invoice.roundOff);

  // Localization settings
  const isTamil = printLanguage === 'tamil';
  const colProduct = isTamil ? 'பொருள்' : 'Product';
  const colQty = isTamil ? 'அளவு' : 'Qty';
  const colTotal = isTamil ? 'மதிப்பு' : 'Amount';

  const labelDiscount = isTamil ? 'வாபஸ் / Discount :' : 'Discount :';
  const labelCharges = isTamil ? 'கூடுதல் கட்டணம் / Charges :' : 'Charges :';
  const labelReceived = isTamil ? 'கொடுத்தது / Received :' : 'Received :';
  const labelRoundOff = isTamil ? 'ரவுண்ட் ஆஃப் / Round Off :' : 'Round Off :';

  return (
    <div className="print-receipt-host" style={{
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }}>
      <div 
        ref={printAreaRef} 
        className="print-receipt-area" 
        style={{ 
          fontFamily: '"JetBrains Mono", Courier, monospace', 
          fontSize: '11px', 
          lineHeight: '1.4',
          color: '#000000',
          padding: '5px'
        }}
      >
        
        {/* Slogan */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '10px', 
          fontWeight: 'bold', 
          fontFamily: '"Outfit", sans-serif',
          letterSpacing: '0.05em',
          color: '#4b5563',
          marginBottom: '2px'
        }}>
          {slogan}
        </div>
        
        {/* Shop Name */}
        <div className="receipt-shop-name" style={{ 
          textAlign: 'center', 
          fontSize: '18px', 
          fontWeight: '900', 
          fontFamily: '"Outfit", sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: '#000000',
          margin: '2px 0 4px 0'
        }}>
          {shopName}
        </div>

        {/* Phone number, kept large and centred: the customer keeps this slip and
            thermal print fades, so it has to stay readable months later. */}
        {phones && (
          <div className="receipt-phone" style={{ 
            textAlign: 'center', 
            fontSize: '17px', 
            fontWeight: 'bold', 
            letterSpacing: '0.06em', 
            color: '#000000',
            marginBottom: '7px'
          }}>
            📞 {phones}
          </div>
        )}

        <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

        {/* Bill Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>BILL NO:</strong> #{invoice.invoiceNo}</span>
            <span><strong>DATE:</strong> {invoice.date}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>CUSTOMER:</strong> {invoice.customerName || 'CASH'}</span>
            <span><strong>TIME:</strong> {invoice.time}</span>
          </div>
          {invoice.customerMobile && (
            <div><strong>MOBILE:</strong> {invoice.customerMobile}</div>
          )}
        </div>

        <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

        {/* Table headers */}
        <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '11px', paddingBottom: '3px', textTransform: 'uppercase' }}>
          <span style={{ flex: '2.2', textAlign: 'left' }}>{colProduct}</span>
          <span style={{ flex: '0.8', textAlign: 'center' }}>{colQty}</span>
          <span style={{ flex: '1', textAlign: 'right' }}>{colTotal}</span>
        </div>

        <div style={{ borderTop: '1px dashed #000000', margin: '4px 0' }}></div>

        {/* Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', fontSize: '11px', alignItems: 'flex-start' }}>
              
              {/* Name column */}
              <span style={{ flex: '2.2', textAlign: 'left', wordBreak: 'break-word', paddingRight: '4px' }}>
                {isTamil ? (item.tamilName || item.name) : item.name}
              </span>
              
              {/* Qty Column */}
              <span style={{ flex: '0.8', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                {item.priceType === 'Quantity'
                  ? money(item.qty).toFixed(3)
                  : Math.round(money(item.qty))}
              </span>
              
              {/* Value Column */}
              <span style={{ flex: '1', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                ₹{money(item.totalPrice).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

        {/* Calculations block - Single Total Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', paddingLeft: '4px' }}>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{labelDiscount}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          
          {charges > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{labelCharges}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>+₹{charges.toFixed(2)}</span>
            </div>
          )}

          {roundOff !== 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{labelRoundOff}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {roundOff > 0 ? '+' : '-'}₹{Math.abs(roundOff).toFixed(2)}
              </span>
            </div>
          )}

          <div className="receipt-total-row" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline',
            fontWeight: '900', 
            fontSize: '18px', 
            borderTop: (discount > 0 || charges > 0 || roundOff !== 0) ? '1px solid #000000' : 'none', 
            paddingTop: (discount > 0 || charges > 0 || roundOff !== 0) ? '4px' : '2px',
            marginTop: '2px',
            marginBottom: '2px'
          }}>
            <span className="receipt-total-label">{isTamil ? 'மொத்தம் / Total :' : 'Total Amount :'}</span>
            <span className="receipt-total-amount" style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '900' }}>₹{net.toFixed(2)}</span>
          </div>

          {paid > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px' }}>
              <span>{labelReceived}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{paid.toFixed(2)}</span>
            </div>
          )}

        </div>

        {/* Ruled space below the total - compact 16px lines */}
        <div style={{ marginTop: '4px' }}>
          <div style={{ height: '16px', borderBottom: '1px dotted #000000' }}></div>
          <div style={{ height: '16px', borderBottom: '1px dotted #000000' }}></div>
          <div style={{ height: '16px', borderBottom: '1px dotted #000000' }}></div>
        </div>

        <div style={{ borderTop: '1px dashed #000000', margin: '5px 0' }}></div>

        {/* Details footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
          <span>ITEMS: {items.length}</span>
        </div>

        <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', margin: '4px 0 3px 0' }}>
          நன்றி! மீண்டும் வருக! / THANK YOU! VISIT AGAIN!
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563' }}>
          <span>Operator: {invoice.operator || 'PS'}</span>
          <span>PS Cash Memo</span>
        </div>

      </div>
    </div>
  );
}
