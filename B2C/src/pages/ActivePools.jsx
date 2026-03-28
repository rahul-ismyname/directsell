import React from 'react';
import { useProduct } from '../context/ProductContext';
import { useUI } from '../context/UIContext';
import { Link } from 'react-router-dom';

const ActivePools = () => {
  const { deals } = useProduct();
  const { searchQuery } = useUI();

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="active-pools-page fade-in section-padding" style={{ backgroundColor: 'var(--bg-gray)', minHeight: '100vh' }}>
      <div className="container">
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '16px' }}>Manufacturing Status</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Live tracking of all ongoing community-backed manufacturing deals.</p>
        </header>

        <div className="grid-main">
          {filteredDeals.length > 0 ? filteredDeals.map((deal) => {
            const progress = Math.min(100, Math.round((deal.units_pledged / deal.total_units) * 100));
            return (
              <div key={deal.id} className="card hover-lift card-padding" style={{ backgroundColor: 'white' }}>
                <div className="responsive-grid" style={{ marginBottom: '24px' }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(0,0,0,0.05)' }}>
                    <img src={deal.image} alt={deal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>{deal.brand || 'The Collective'}</div>
                     <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px', lineHeight: 1.2 }}>{deal.title}</h3>
                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--system-green)', backgroundColor: 'rgba(52, 199, 89, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{progress}% FILLED</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status: {deal.status}</span>
                     </div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>BATCH ORDER PROGRESS</span>
                      <span>{deal.units_pledged} / {deal.total_units} Shares Claimed</span>
                   </div>
                   <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--accent-blue)', borderRadius: '6px', transition: 'width 1s cubic-bezier(0.2, 0, 0.2, 1)' }}></div>
                   </div>
                </div>

                <div className="responsive-grid" style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '16px', marginBottom: '32px' }}>
                   <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Price per Share</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>₹{deal.price_per_unit.toLocaleString('en-IN')}</div>
                   </div>
                   <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Est. Completion</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>{deal.end_date ? new Date(deal.end_date).toLocaleDateString() : 'TBD'}</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <Link to={`/product/${deal.product_id}`} className="btn btn-primary" style={{ flex: 1.5, textAlign: 'center', textDecoration: 'none', padding: '16px' }}>Buy Shares</Link>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '16px' }}>View Specs</button>
                </div>
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📦</div>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>No Active Manufacturing Pools</h2>
              <p style={{ color: 'var(--text-muted)' }}>Check back later or propose a new manufacturing batch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivePools;
