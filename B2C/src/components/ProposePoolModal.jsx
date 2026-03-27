import React, { useState } from 'react';

const ProposePoolModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ product: '', targetPrice: '', volume: '500-1000' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(formData);
      onClose();
    }, 2000);
  };

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
      <form className="card fade-in" style={{ 
        width: '100%',
        maxWidth: '440px', 
        backgroundColor: 'var(--white)', 
        padding: '32px', 
        borderRadius: '24px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)'
      }} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        
        <header style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>Propose a New Pool</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Submit a factory-direct order request.</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Product or Component Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. GaN Charger 140W" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
              value={formData.product}
              onChange={e => setFormData({ ...formData, product: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Target Batch Price (INR)</label>
            <input 
              required
              type="number" 
              placeholder="e.g. 4500" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
              value={formData.targetPrice}
              onChange={e => setFormData({ ...formData, targetPrice: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Est. Volume Batch</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}
              value={formData.volume}
              onChange={e => setFormData({ ...formData, volume: e.target.value })}
            >
              <option value="100-500">100 - 500 units</option>
              <option value="500-1000">500 - 1000 units</option>
              <option value="1000+">1000+ units (Tier 1)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }} disabled={isSubmitting}>
             {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposePoolModal;
