import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DistributorDashboard = () => {
  const { products, user, distributor, addNotification } = useAppContext();
  const [myPools, setMyPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Distributor') {
      navigate('/login');
    } else {
      fetchMyPools();
    }
  }, [user, navigate]);

  const fetchMyPools = async () => {
    try {
      const res = await distributor.getPools();
      setMyPools(res.rows || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'Distributor') return null;

  // Pools available to be claimed (Shipped by supplier but no distributor leader yet)
  // In a real app, we'd have a backend check for this. For now, we'll show Shipped products.
  const availablePools = products.filter(p => p.status === 'Shipped');

  const handleClaim = async (productId) => {
    const res = await distributor.claimPool(productId);
    if (res.success) {
      fetchMyPools();
    }
  };

  const handleMarkReceived = async (productId) => {
    const res = await distributor.markReceived(productId);
    if (res.success) {
      fetchMyPools();
    }
  };

  const handleNotifyUsers = async (productId) => {
    const res = await distributor.notifyUsers(productId);
    if (res.success) {
      fetchMyPools();
    }
  };

  return (
    <div className="distributor-dashboard fade-in" style={{ padding: '80px 0' }}>
      <div className="container">
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {user?.location} Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Coordinate local distribution for your community pools in {user?.location}.</p>
        </header>

        {user.kyc_status !== 'Verified' && (
          <div className="card fade-in" style={{ 
            padding: '24px 32px', 
            backgroundColor: 'var(--accent-blue)', 
            color: 'white', 
            borderRadius: '24px', 
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0, 122, 255, 0.2)'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Complete Distributor Verification</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>As a distribution leader, you must verify your identity to handle cargo and manage local hubs.</p>
            </div>
            <button 
              onClick={() => navigate('/kyc')}
              className="btn" 
              style={{ backgroundColor: 'white', color: 'var(--accent-blue)', padding: '12px 24px', fontWeight: 600, marginLeft: '24px' }}
            >
              Verify Identity
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '64px' }}>
          <div>
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Your Active Distributions</h2>
              <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pool / Product</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPools.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.brand}</div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-blue)' }}>{p.status}</span>
                           <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Updated: {new Date(p.last_updated).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'flex', gap: '8px' }}>
                             {p.status.includes('leader') && (
                               <button onClick={() => handleMarkReceived(p.product_id)} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                 Confirm Receipt from Factory
                               </button>
                             )}
                             {p.status.includes('received') && (
                               <button onClick={() => handleNotifyUsers(p.product_id)} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: 'var(--system-green)' }}>
                                 Notify Users for Pickup
                               </button>
                             )}
                             {p.status.includes('Ready') && (
                               <span style={{ color: 'var(--system-green)', fontSize: '12px', fontWeight: 700 }}>✓ COMPLETED</span>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                    {myPools.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No active distributions. Claim a shipped pool below.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Available Pools (Shipped from Factory)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {availablePools.map(p => {
                  const isClaimed = myPools.some(mp => mp.product_id === p.id);
                  if (isClaimed) return null;
                  
                  return (
                    <div key={p.id} className="card" style={{ padding: '24px' }}>
                      <img src={p.image} alt={p.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{p.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{p.brand} • {p.min_qty_to_ship} Units Batch</p>
                      <button onClick={() => handleClaim(p.id)} className="btn btn-outline" style={{ width: '100%' }}>
                        Claim Distribution Role
                      </button>
                    </div>
                  );
                })}
                {availablePools.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No pools are currently ready for local distribution.</p>
                )}
              </div>
            </section>
          </div>

          <aside>
             <div className="card" style={{ padding: '24px', backgroundColor: 'var(--primary-blue)', color: 'white' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Distributor Guidelines</h3>
                <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '13px', opacity: 0.9, lineHeight: 1.6 }}>
                  <li>Verify all boxes upon arrival from the freight partner.</li>
                  <li>Record any damages for insurance claims.</li>
                  <li>Store products in a secure, dry location.</li>
                  <li>Notify users only when you are ready for pickup.</li>
                  <li>Be professional during the hand-over process.</li>
                </ul>
             </div>

             <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>Your Trust Score</h3>
                <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)' }}>
                  {myPools.length > 0 ? 'Evaluating' : '---'}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                   Your score will update after your first verified distribution.
                </p>
             </div>
          </aside>
        </div>
      </div>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <p style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>Loading hub data...</p>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;
