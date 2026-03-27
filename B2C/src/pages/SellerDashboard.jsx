import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const SellerDashboard = () => {
  const { products, addNotification, user, addProduct, verifyProduct, closePool, shipProduct, getRegionalPools } = useAppContext();
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [regionalPools, setRegionalPools] = useState([]);
  const navigate = useNavigate();

  // Filter products for this supplier
  const supplierProducts = products.filter(p => p.supplier_id === user?.id);

  useEffect(() => {
    if (!user || user.role !== 'Seller') {
      navigate('/seller-login');
    } else {
      fetchRegionalData();
    }
  }, [user, navigate]);

  if (!user || user.role !== 'Seller') return null;

  const fetchRegionalData = async () => {
    try {
      const res = await getRegionalPools();
      setRegionalPools(res.rows || []);
    } catch (e) {
      console.error(e);
    }
  };

  const [newPool, setNewPool] = useState({
    title: '',
    brand: '',
    description: '',
    category: 'Electronics',
    price: '',
    msrp: '',
    minUnits: 100,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    image2: '',
    image3: '',
    isInfinite: false
  });

  const handleCreatePool = async (e) => {
    e.preventDefault();
    const result = await addProduct(newPool);
    if (result.success) {
      setIsListingModalOpen(false);
      setNewPool({
        title: '',
        brand: '',
        description: '',
        category: 'Electronics',
        price: '',
        msrp: '',
        minUnits: 100,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        image2: '',
        image3: '',
        isInfinite: false
      });
    }
  };

  return (
    <div className="seller-dashboard fade-in" style={{ padding: '80px 0' }}>
      <div className="container">
        <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Supplier Portal</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Manage your factory-direct manufacturing batches.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsListingModalOpen(true)} style={{ padding: '12px 24px' }}>
            + Create New Pool
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '64px' }}>
          {/* Active Listings */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Your Active Manufacturing Batches</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pledges</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goal Progress</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierProducts.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #BATCH-{p.id.substring(0, 8)}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                           <div style={{ fontSize: '11px', color: 'var(--accent-blue)' }}>MOQ: {p.min_qty_to_ship} units</div>
                           {p.is_infinite === 1 && (
                             <div style={{ fontSize: '10px', color: 'var(--system-green)', fontWeight: 700, textTransform: 'uppercase' }}>∞ Infinite Supply</div>
                           )}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '14px' }}>
                         ₹{(p.price * (p.progress/100) * 10).toLocaleString('en-IN')} <br />
                         <span style={{ fontSize: '11px', opacity: 0.6 }}>Secured in Escrow</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ width: '120px', height: '4px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '2px', marginBottom: '8px' }}>
                            <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '2px' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>{p.progress}% REACHED</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: p.status === 'Verified' || p.status === 'Shipped' ? 'var(--system-green)' : 'var(--accent-blue)', 
                            textTransform: 'uppercase' 
                          }}>
                              {p.status || 'OPENING BATCH'}
                            </span>
                            
                            {p.status === 'Pending Audit' && (
                               <button 
                                 onClick={() => verifyProduct(p.id)}
                                 style={{ display: 'block', marginTop: '4px', fontSize: '10px', padding: '4px 8px', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                               >
                                 [Admin Verify]
                               </button>
                             )}
                             
                             {p.status === 'Verified' && p.is_infinite === 1 && (
                               <button 
                                 onClick={() => closePool(p.id)}
                                 style={{ display: 'block', marginTop: '4px', fontSize: '10px', padding: '4px 8px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                               >
                                 Close Pool
                               </button>
                             )}
                             
                             {p.status === 'Verified' && p.is_infinite === 0 && (
                               <button 
                                 onClick={() => shipProduct(p.id)}
                                 style={{ display: 'block', marginTop: '4px', fontSize: '10px', padding: '4px 8px', backgroundColor: 'var(--system-green)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                               >
                                 Ship Batch
                               </button>
                             )}
                             
                             {p.status === 'Shipped' && (
                               <div style={{ fontSize: '10px', color: 'var(--system-green)', fontWeight: 700, marginTop: '4px' }}>✓ DISPATCHED</div>
                             )}
                      </td>
                    </tr>
                  ))}
                  {supplierProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No manufacturing batches found. Click "Create New Pool" to list your first product.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', marginTop: '48px' }}>Regional Fulfillment Hubs</h2>
          <div className="card" style={{ overflow: 'hidden', marginBottom: '48px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Region / Product</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distributor</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {regionalPools.map((pool, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{pool.city}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pool.title}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {pool.distributor_id ? (
                        <div style={{ fontSize: '13px' }}>Leader Assigned</div>
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Waiting for local leader...</div>
                      )}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-blue)' }}>{pool.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      {pool.distributor_id && !pool.status.includes('Ship') && (
                        <button 
                          onClick={async (e) => {
                            e.preventDefault();
                            await shipProduct(pool.product_id, pool.city);
                            fetchRegionalData();
                          }}
                          className="btn btn-outline" 
                          style={{ fontSize: '10px', padding: '6px 12px' }}
                        >
                          Dispatch to {pool.city}
                        </button>
                      )}
                      {pool.status.includes('Ship') && (
                        <span style={{ fontSize: '11px', color: 'var(--system-green)', fontWeight: 700 }}>✓ DISPATCHED</span>
                      )}
                    </td>
                  </tr>
                ))}
                {regionalPools.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No regional pools active yet. Once users join from specific cities, they will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stats Sidebar */}
          <aside>
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
               <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Network Verification</h4>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--system-green)' }}></div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Factory Audit Passed</div>
               </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--system-green)' }}></div>
                   <div style={{ fontSize: '13px', fontWeight: 500 }}>GST Verified</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }}></div>
                   <div style={{ fontSize: '13px', fontWeight: 500 }}>Escrow Agreement Signed</div>
                </div>
             </div>
             
             <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #1d1d1f 0%, #333 100%)', color: 'white' }}>
                <div style={{ fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', marginBottom: '8px' }}>Pending Settlement</div>
                <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>₹0</div>
                <p style={{ fontSize: '12px', opacity: 0.5 }}>Locked in active order cycles until delivery verification.</p>
             </div>
          </aside>
        </div>
      </div>

      {/* Listing Modal */}
      {isListingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '24px' }} onClick={() => setIsListingModalOpen(false)}>
          <form className="card fade-in" style={{ width: '100%', maxWidth: '600px', padding: '32px', backgroundColor: 'var(--white)', borderRadius: '24px' }} onClick={e => e.stopPropagation()} onSubmit={handleCreatePool}>
             <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>List New Batch</h2>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input required placeholder="Product Title" value={newPool.title} onChange={e => setNewPool({...newPool, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input required placeholder="Factory/Brand Name" value={newPool.brand} onChange={e => setNewPool({...newPool, brand: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <textarea placeholder="Manufacturing Specs / Description" value={newPool.description} onChange={e => setNewPool({...newPool, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '80px' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                   <input required placeholder="Main Image URL" value={newPool.image} onChange={e => setNewPool({...newPool, image: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px' }} />
                   <input placeholder="Gallery Image 2" value={newPool.image2} onChange={e => setNewPool({...newPool, image2: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px' }} />
                   <input placeholder="Gallery Image 3" value={newPool.image3} onChange={e => setNewPool({...newPool, image3: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px' }} />
                </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input required type="number" placeholder="Direct Pricing (INR)" value={newPool.price} onChange={e => setNewPool({...newPool, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <input required type="number" placeholder="MSRP (INR)" value={newPool.msrp} onChange={e => setNewPool({...newPool, msrp: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }} />
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input required type="number" placeholder="Min Qty to Ship" value={newPool.minUnits} onChange={e => setNewPool({...newPool, minUnits: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <select value={newPool.category} onChange={e => setNewPool({...newPool, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
                        <option value="Electronics">Electronics</option>
                        <option value="Home">Home</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                    <input type="checkbox" id="isInfinite" checked={newPool.isInfinite} onChange={e => setNewPool({...newPool, isInfinite: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="isInfinite" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Allow Over-subscription (Infinite Supply)</label>
                 </div>
                 <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '8px' }}>Verify & List Pool</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
