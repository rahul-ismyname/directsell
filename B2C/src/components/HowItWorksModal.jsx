import React from 'react';

const HowItWorksModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "Consolidated Demand",
      desc: "Individuals and small businesses join a shared commitment pool for a specific factory batch.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      title: "Direct Sourcing",
      desc: "Once the 'Tier-1' volume is reached, the order is placed directly with the manufacturer, bypassing all middle-men.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    },
    {
      title: "Escrow Security",
      desc: "Payments are held in a secure protocol-level escrow. Funds are only released to the supplier upon quality verification.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    },
    {
      title: "Collective Savings",
      desc: "Enjoy genuine wholesale pricing. Savings are typically 40-70% below standard retail MSRP.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    }
  ];

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
        maxWidth: '600px', 
        backgroundColor: 'var(--white)', 
        padding: '48px', 
        borderRadius: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>How it Works</h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginTop: '8px' }}>Disrupting the supply chain with transparency.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {steps.map((step, i) => (
            <div key={i} className="fade-in" style={{ animationDelay: `${i*0.1}s` }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--primary-blue)' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '40px', padding: '16px' }} onClick={onClose}>
          Got it, Explore Pools
        </button>
      </div>
    </div>
  );
};

export default HowItWorksModal;
