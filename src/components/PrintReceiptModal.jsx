import React, { useRef, useEffect } from 'react';
import { Printer, X } from 'lucide-react';

export default function PrintReceiptModal({ invoice, settings = {}, printLanguage = 'tamil', onClose }) {
  const printAreaRef = useRef();
  const printButtonRef = useRef();

  const shopName = settings.shopName || 'SRI PERUMAL STORES';
  const slogan = settings.headerSlogan || 'ஸ்ரீ முருகன் துணை';
  const phones = (settings.phoneNumbers || '9942143460, 9629708861')
    .split(',')
    .map(p => p.trim())
    .filter(p => p !== '9942143460')
    .join(', ');

  const handlePrint = async () => {
    if (window.electronAPI && window.electronAPI.printSilent) {
      try {
        await window.electronAPI.printSilent();
        // Wait 500ms to ensure Chromium's print pipeline captures the receipt layout before unmounting the modal
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err) {
        console.error('Silent print IPC failed:', err);
        window.print();
        onClose();
      }
    } else {
      window.print();
      onClose();
    }
  };

  // Auto-focus print button on mount to steal focus from background inputs
  useEffect(() => {
    if (printButtonRef.current) {
      printButtonRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handlePrint();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    // Capture phase listener (third argument = true) to intercept keys before they bubble
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  const gross = invoice.grossTotal || 0;
  const net = invoice.netTotal || 0;
  const discount = invoice.discount || 0;
  const charges = (invoice.rent || 0) + (invoice.coolie || 0);
  const paid = invoice.advance || 0;
  const balance = Math.max(0, net - paid);

  // Localization settings
  const isTamil = printLanguage === 'tamil';
  const colProduct = isTamil ? 'பொருள்' : 'Product';
  const colQty = isTamil ? 'அளவு' : 'Qty';
  const colTotal = isTamil ? 'மதிப்பு' : 'Amount';

  const labelGross = isTamil ? 'மொத்தம் / Gross :' : 'Gross Total :';
  const labelDiscount = isTamil ? 'வாபஸ் / Discount :' : 'Discount :';
  const labelCharges = isTamil ? 'கூடுதல் கட்டணம் / Charges :' : 'Charges :';
  const labelNet = isTamil ? 'பில் தொகை / Net :' : 'Net Amount :';
  const labelReceived = isTamil ? 'கொடுத்தது / Received :' : 'Received :';
  const labelCredit = isTamil ? 'மீதி கடன் / Credit Bal :' : 'Credit Bal :';

  return (
    <div className="modal-overlay" style={{ overflowY: 'auto', padding: '20px 0' }}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        
        {/* Modal Controls (Not Printed) */}
        <div className="modal-header" style={{ borderBottom: 'none' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>பில் அச்சிடல் / Print Cash Memo</h4>
          <button className="btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* The Printable Receipt Content */}
        <div className="modal-body" style={{ background: '#ffffff', color: '#000000', padding: '15px' }}>
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
              margin: '2px 0 8px 0'
            }}>
              {shopName}
            </div>

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
              {invoice.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', fontSize: '11px', alignItems: 'flex-start' }}>
                  
                  {/* Name column */}
                  <span style={{ flex: '2.2', textAlign: 'left', wordBreak: 'break-word', paddingRight: '4px' }}>
                    {isTamil ? (item.tamilName || item.name) : item.name}
                  </span>
                  
                  {/* Qty Column */}
                  <span style={{ flex: '0.8', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {item.priceType === 'Quantity' 
                      ? parseFloat(item.qty).toFixed(3) 
                      : parseInt(item.qty)}
                  </span>
                  
                  {/* Value Column */}
                  <span style={{ flex: '1', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ₹{parseFloat(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

            {/* Calculations block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', paddingLeft: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{labelGross}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{gross.toFixed(2)}</span>
              </div>
              
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

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold', 
                fontSize: '12px', 
                marginTop: '4px', 
                borderTop: '1px solid #000000', 
                paddingTop: '4px' 
              }}>
                <span>{labelNet}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{net.toFixed(2)}</span>
              </div>

              {paid > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{labelReceived}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{paid.toFixed(2)}</span>
                </div>
              )}

            </div>

            <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

            {/* Details footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span>ITEMS: {invoice.items.length}</span>
            </div>

            {phones && (
              <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', marginTop: '6px', letterSpacing: '0.02em' }}>
                📞 {phones}
              </div>
            )}

            <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

            <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', margin: '4px 0' }}>
              நன்றி! மீண்டும் வருக! / THANK YOU! VISIT AGAIN!
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4b5563' }}>
              <span>Operator: {invoice.operator || 'PS'}</span>
              <span>PS Cash Memo</span>
            </div>

          </div>
        </div>

        {/* Modal Controls (Footer) */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
          <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={onClose}>
            மூடுக / Close
          </button>
           <button 
            ref={printButtonRef} 
            className="btn-success" 
            style={{ padding: '8px 16px' }} 
            onClick={handlePrint}
          >
            <Printer size={16} /> அச்சிடு / Print (Enter)
          </button>
        </div>

      </div>
    </div>
  );
}
