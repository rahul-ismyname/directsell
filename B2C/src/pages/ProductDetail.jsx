import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CheckoutModal = ({ isOpen, onClose, product, quantity, poolPrice, retailPrice, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const subtotal = quantity * poolPrice;
  const escrowFee = Math.floor(subtotal * 0.05); 
  const total = subtotal + escrowFee;

  const handleNext = () => {
    if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onConfirm(quantity);
        setStep(3);
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      backdropFilter: 'blur(10px)',
      padding: '24px'
    }} onClick={onClose}>
      <div className="card fade-in" style={{ 
        width: '100%',
        maxWidth: '440px', 
        backgroundColor: 'var(--white)', 
        padding: '32px', 
        borderRadius: '24px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)'
      }} onClick={e => e.stopPropagation()}>
        
        <header style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>
            {step === 1 && 'Confirm Selection'}
            {step === 2 && 'Secure Payment'}
            {step === 3 && 'Reserved'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
             {step === 1 && `Review your ${product.title} allocation`}
             {step === 2 && 'Protocol-level escrow settlement'}
             {step === 3 && 'Your batch allocation is secured'}
          </p>
        </header>

        <div style={{ flex: 1 }}>
          {step === 1 && (
            <div className="fade-in">
               <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Quantity</span>
                   <span style={{ fontWeight: 600, fontSize: '13px' }}>{quantity} units</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Subtotal</span>
                   <span style={{ fontWeight: 600, fontSize: '13px' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Protocol Fee</span>
                   <span style={{ fontWeight: 600, fontSize: '13px' }}>₹{escrowFee.toLocaleString('en-IN')}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
                   <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '15px' }}>Total</span>
                   <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--accent-blue)' }}>₹{total.toLocaleString('en-IN')}</span>
                 </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
               <div style={{ padding: '24px', background: 'var(--primary-blue)', color: 'white', borderRadius: '16px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>UPI Escrow Security Active</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ fontSize: '12px', fontWeight: 900 }}>UPI</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Verify UPI Transaction</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Funds held in protocol VPA</div>
                    </div>
                  </div>
               </div>
            </div>
          )}


          {step === 3 && (
            <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
               <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--system-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 12px rgba(52, 199, 89, 0.3)' }}>
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><path d="M20 6 9 17l-5-5"/></svg>
               </div>
               <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Batch Secured</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
                  A confirmation email with your batch tracking details has been sent.
               </p>
               <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}>Go to Dashboard</Link>
            </div>
          )}
        </div>

        {step < 3 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1.5 }}
              disabled={isProcessing}
              onClick={handleNext}
            >
              {isProcessing ? 'Processing...' : step === 1 ? 'Continue' : 'Pay Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deals, purchaseShare } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const product = products.find(p => p.id === id);
  // Find an active deal for this product
  const deal = deals.find(d => d.product_id === id && d.status === 'Open');

  useEffect(() => {
    if (product) setActiveImage(product.image);
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/discovery" className="btn btn-primary" style={{ marginTop: '24px' }}>Back to Discovery</Link>
      </div>
    );
  }

  const currentPrice = deal ? deal.price_per_unit : product.price;
  const savings = (product.msrp - currentPrice) * quantity;

  const handleConfirmOrder = async (q) => {
    if (deal) {
      const result = await purchaseShare(deal.id, q);
      if (result.needsKYC) {
        setIsCheckoutOpen(false);
        navigate('/kyc');
      }
    } else {
      // Legacy path for simple pools if no explicit deal exists
      alert("No active manufacturing deal found for this product.");
    }
  };

  const progress = deal 
    ? Math.min(100, Math.round((deal.units_pledged / deal.total_units) * 100))
    : product.progress;

  return (
    <>
      <div className="product-detail-page fade-in" style={{ padding: '80px 0', backgroundColor: 'var(--bg-gray)', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'start' }}>
            
            {/* Gallery */}
            <div>
              <Link to="/discovery" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '14px', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                Back to Discovery
              </Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: 'none', backgroundColor: 'white' }}>
                  <img src={activeImage || product.image} alt={product.title} style={{ width: '100%', display: 'block' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                   {[product.image, product.image2, product.image3].filter(img => img).map((img, i) => (
                     <div 
                       key={i} 
                       onClick={() => setActiveImage(img)}
                       style={{ 
                         width: '80px', 
                         height: '80px', 
                         borderRadius: '16px', 
                         overflow: 'hidden', 
                         cursor: 'pointer', 
                         border: activeImage === img ? '2.5px solid var(--accent-blue)' : '2.5px solid transparent',
                         transition: 'all 0.2s ease',
                         backgroundColor: 'white'
                       }}
                     >
                       <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                   ))}
                </div>
              </div>
              
              <div style={{ marginTop: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '20px', letterSpacing: '-0.02em', color: 'var(--primary-blue)' }}>Manufacturing Specification</h2>
                <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '40px' }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Material Grade</div>
                     <div style={{ fontSize: '16px', fontWeight: 600 }}>Industrial-T1 Standard</div>
                   </div>
                   <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Source Origin</div>
                     <div style={{ fontSize: '16px', fontWeight: 600 }}>{product.location || 'Direct from Manufacturer'}</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Selection Sidebar */}
            <div style={{ position: 'sticky', top: '100px' }}>
               <div className="card" style={{ padding: '40px', borderRadius: '32px', backgroundColor: 'white', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {deal ? `LIVE POOL #${deal.id.split('_')[1].slice(-4)}` : 'ACTIVE BATCH'} • OPEN
                  </div>
                  <h1 style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.1, marginBottom: '8px', letterSpacing: '-0.03em', color: 'var(--primary-blue)' }}>{product.title}</h1>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <p style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500 }}>{product.brand}</p>
                     <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', backgroundColor: 'var(--accent-blue-light)', padding: '4px 12px', borderRadius: '20px' }}>
                       {deal ? `CAPACITY: ${deal.total_units}` : `MOQ: ${product.min_qty_to_ship || 1}`}
                     </div>
                   </div>
                 </div>

                <div style={{ marginBottom: '40px', padding: '24px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>POOL FULFILLMENT</span>
                    <span style={{ color: 'var(--accent-blue)' }}>{progress}% SECURED</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-blue)', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.2, 0, 0.2, 1)' }}></div>
                  </div>
                  {deal && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <span>{deal.units_pledged} Claimed</span>
                      <span>{deal.total_units - deal.units_pledged} Remaining</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>Number of Shares</span>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '18px' }}>-</button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      style={{ 
                        width: 50, 
                        border: 'none', 
                        background: 'none', 
                        textAlign: 'center', 
                        fontWeight: 700, 
                        outline: 'none',
                        fontSize: '16px'
                      }} 
                    />
                    <button onClick={() => setQuantity(quantity + 1)} style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '18px' }}>+</button>
                  </div>
                </div>

                <div className="glass-dark" style={{ padding: '32px', borderRadius: '24px', color: 'white', marginBottom: '32px', backgroundColor: '#1d1d1f' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL PLEDGE</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em' }}>₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '13px', opacity: 0.5, textDecoration: 'line-through' }}>₹{(product.msrp * quantity).toLocaleString('en-IN')}</div>
                       <div style={{ fontSize: '14px', color: 'var(--system-green)', fontWeight: 700 }}>Save ₹{savings.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  disabled={!deal || (deal.units_pledged + quantity > deal.total_units)}
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    fontSize: '16px',
                    fontWeight: 600,
                    opacity: (!deal || (deal.units_pledged + quantity > deal.total_units)) ? 0.5 : 1
                  }} 
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  {!deal ? 'No Active Deal' : (deal.units_pledged + quantity > deal.total_units ? 'Batch Full' : 'Purchase Slices')}
                </button>
                
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   Escrow Security Protocol Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={product}
        quantity={quantity}
        poolPrice={currentPrice}
        retailPrice={product.msrp}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
};

export default ProductDetail;
