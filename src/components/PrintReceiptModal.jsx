import React, { useRef, useEffect } from 'react';
import { Printer, X } from 'lucide-react';

export default function PrintReceiptModal({ invoice, settings = {}, printLanguage = 'tamil', onClose }) {
  const printAreaRef = useRef();

  const shopName = settings.shopName || 'SRI PERUMAL STORES';
  const slogan = settings.headerSlogan || 'ஸ்ரீ முருகன் துணை';
  const phones = settings.phoneNumbers || '9942143460, 9629708861';

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePrint();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
              fontSize: '12px', 
              lineHeight: '1.4',
              color: '#000000',
              padding: '5px'
            }}
          >
            
            {/* Slogan */}
            <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: '500', marginBottom: '2px' }}>
              {slogan}
            </div>
            
            {/* Shop Name */}
            <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {shopName}
            </div>

            <div style={{ margin: '4px 0' }}>================================</div>

            {/* Bill Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>No : {invoice.invoiceNo}</span>
              <span>{invoice.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>To : {invoice.customerName || 'CASH'}</span>
              <span>Page 1 / 1</span>
            </div>
            {invoice.customerMobile && (
              <div style={{ fontSize: '11px' }}>
                Mob : {invoice.customerMobile}
              </div>
            )}

            <div style={{ margin: '4px 0' }}>================================</div>

            {/* Table headers */}
            <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '11px', paddingBottom: '3px' }}>
              <span style={{ flex: '2', textAlign: 'left' }}>{colProduct}</span>
              <span style={{ flex: '1', textAlign: 'center' }}>{colQty}</span>
              <span style={{ flex: '1.2', textAlign: 'right' }}>{colTotal}</span>
            </div>

            <div style={{ borderTop: '1px dashed #000000', margin: '4px 0' }}></div>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {invoice.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', fontSize: '11px', alignItems: 'flex-start' }}>
                  
                  {/* Name column: Prefer Tamil/English based on printLanguage */}
                  <span style={{ flex: '2', textAlign: 'left', wordBreak: 'break-word', paddingRight: '4px' }}>
                    {isTamil ? (item.tamilName || item.name) : item.name}
                  </span>
                  
                  {/* Qty Column */}
                  <span style={{ flex: '1', textAlign: 'center' }}>
                    {item.priceType === 'Quantity' 
                      ? parseFloat(item.qty).toFixed(3) 
                      : parseInt(item.qty)}
                  </span>
                  
                  {/* Value Column */}
                  <span style={{ flex: '1.2', textAlign: 'right' }}>
                    {parseFloat(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

            {/* Calculations block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', paddingLeft: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{labelGross}</span>
                <span>{gross.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000000' }}>
                  <span>{labelDiscount}</span>
                  <span>-{discount.toFixed(2)}</span>
                </div>
              )}
              
              {charges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{labelCharges}</span>
                  <span>+{charges.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px', marginTop: '2px', borderTop: '1px solid #000000', paddingTop: '2px' }}>
                <span>{labelNet}</span>
                <span>₹{net.toFixed(2)}</span>
              </div>

              {paid > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{labelReceived}</span>
                  <span>{paid.toFixed(2)}</span>
                </div>
              )}

            </div>

            <div style={{ borderTop: '1px dashed #000000', margin: '6px 0' }}></div>

            {/* Details footer */}
            <div style={{ fontSize: '11px' }}>
              <div>Items : {invoice.items.length}</div>
              <div>📞 {phones}</div>
            </div>

            <div style={{ margin: '4px 0' }}>================================</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span>Operator : {invoice.operator || 'T'}</span>
              <span>Time : {invoice.time}</span>
            </div>

          </div>
        </div>

        {/* Modal Controls (Footer) */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
          <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={onClose}>
            மூடுக / Close
          </button>
          <button className="btn-success" style={{ padding: '8px 16px' }} onClick={handlePrint}>
            <Printer size={16} /> அச்சிடு / Print (Enter)
          </button>
        </div>

      </div>
    </div>
  );
}
