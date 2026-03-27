import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const ActivePools = () => {
  const { products, searchQuery } = useAppContext();

  const filteredPools = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="active-pools-page fade-in" style={{ padding: '80px 0' }}>
      <div className="container">
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Manufacturing Status</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Live tracking of all ongoing manufacturing batches.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
          {filteredPools.map((pool) => (
            <div key={pool.id} className="card hover-lift" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <div style={{ width: 100, height: 100, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={pool.image} alt={pool.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{pool.brand}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px' }}>{pool.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                     <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--system-green)', backgroundColor: 'rgba(52, 199, 89, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{pool.progress}% COMMITMENT</span>
                     <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ends in {pool.timeLeft}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>MANUFACTURING CAPACITY</span>
                    <span>High Demand</span>
                 </div>
                 <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pool.progress}%`, backgroundColor: 'var(--accent-blue)', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.2, 0, 0.2, 1)' }}></div>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginBottom: '24px' }}>
                 <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Current Price</div>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>₹{pool.price.toLocaleString('en-IN')}</div>
                 </div>
                 <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Est. Settlement</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--system-green)' }}>₹{(pool.price * 0.95).toLocaleString('en-IN')}</div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to={`/product/${pool.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Join Pool</Link>
                <button className="btn btn-secondary" style={{ flex: 1 }}>Full Stats</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivePools;
