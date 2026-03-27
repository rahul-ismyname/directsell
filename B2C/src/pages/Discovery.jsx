import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ title, brand, description, progress, discount, timeLeft, image, id, category, price, msrp, min_qty_to_ship }) => (
  <div className="card product-card fade-in hover-lift" style={{ display: 'flex', flexDirection: 'column' }}>
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'var(--system-green)', color: 'white', fontSize: '12px', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {discount} OFF
        </div>
        <div className="glass" style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--system-blue)' }}></div>
          {category}
        </div>
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>{brand}</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.01em' }}>{title}</h3>
          <div style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '4px' }}>MOQ: {min_qty_to_ship || 1} units</div>
        </div>
        
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
           <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--primary-blue)' }}>₹{price.toLocaleString('en-IN')}</span>
           <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{msrp.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ marginBottom: '20px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>POOL PROGRESS</span>
            <span style={{ color: 'var(--accent-blue)' }}>{progress}% REACHED</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--accent-blue)', borderRadius: '2px', transition: 'width 1s cubic-bezier(0.2, 0, 0.2, 1)' }}></div>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--system-red)', fontSize: '11px', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {timeLeft}
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>View Detail</button>
        </div>
      </div>
    </Link>
  </div>
);

const Discovery = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Audio', 'Furniture', 'Sport', 'Energy', 'Food & Bev'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      // NEW: Hide full pools UNLESS they are infinite supply
      const isVisible = p.is_infinite === 1 || p.progress < 100;

      return matchesCategory && matchesSearch && isVisible;
    });
  }, [activeCategory, searchQuery, products]);

  return (
    <div className="discovery-page fade-in" style={{ padding: '80px 0' }}>
      <div className="container">
        <header style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '4px 12px', borderRadius: '12px', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Direct from Source to {user?.location || 'Your Hub'}</span>
              </div>
              <h1 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', color: 'var(--primary-blue)' }}>
                {user?.location || 'Regional'} Marketplace.
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '520px', lineHeight: 1.4 }}>
                Join local pools in {user?.location || 'your area'}. Demand is aggregated by city to ensure efficient local distribution and minimum travel.
              </p>
            </div>
            
            <div style={{ width: '320px' }}>
               <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Filter pools..." 
                  style={{ 
                    width: '100%', 
                    padding: '12px 12px 12px 40px', 
                    backgroundColor: 'rgba(0,0,0,0.05)', 
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'var(--white)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '40px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className="btn" 
                style={{ 
                  borderRadius: '10px',
                  backgroundColor: activeCategory === cat ? 'var(--primary-blue)' : 'rgba(0,0,0,0.03)',
                  color: activeCategory === cat ? 'white' : 'var(--text-main)',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {filteredProducts.length > 0 ? (
          <div className="grid-main" style={{ marginBottom: '80px' }}>
            {filteredProducts.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        ) : (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px' }}>No pools found</div>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
            <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>Reset filters</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Discovery;
