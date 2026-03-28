import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProposePoolModal from '../components/ProposePoolModal';
import ReviewActionModal from '../components/ReviewActionModal';

const Dashboard = () => {
  const { activePools, orderHistory, addNotification, user, submitReview, submitReport, userShares, deals } = useAppContext();
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [activeOrderForReview, setActiveOrderForReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'Seller') {
      navigate('/seller');
    } else if (user.role === 'Distributor') {
      navigate('/distributor');
    }
  }, [user, navigate]);

  if (!user) return null;


  const totalSavings = orderHistory.reduce((acc, curr) => {
    const val = parseInt(curr.savings.replace(/[^0-9]/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const handleProposeSubmit = (data) => {
    addNotification(`Proposal for ${data.product} submitted. Vetting in progress.`, 'info');
  };

  return (
    <>
      <div className="dashboard-page fade-in section-padding">
        <div className="container">
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Portfolio Overview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Active manufacturing commitments and historical impact.</p>
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
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Complete Your Account Verification</h3>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>Verify your identity to participate in manufacturing pools and secure settlements.</p>
              </div>
              <button 
                onClick={() => navigate('/kyc')}
                className="btn" 
                style={{ backgroundColor: 'white', color: 'var(--accent-blue)', padding: '12px 24px', fontWeight: 600, marginLeft: '24px' }}
              >
                Verify Now
              </button>
            </div>
          )}

          <div className="responsive-dash-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px', alignItems: 'start' }}>
            {/* Main Area */}
            <div className="main-content">
              <section style={{ marginBottom: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--primary-blue)' }}>Manufacturing Shares Portfolio</h2>
                  <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }}>Manage →</span>
                </div>
                <div className="grid-main" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {userShares.map((share, idx) => {
                    const deal = deals.find(d => d.id === share.deal_id);
                    const progress = deal ? Math.min(100, Math.round((deal.units_pledged / deal.total_units) * 100)) : 0;
                    
                    return (
                      <div key={idx} className="card hover-lift" style={{ padding: '24px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{progress}% FILLED</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', color: 'var(--primary-blue)' }}>{share.product_title}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 500 }}>
                          Share Holding: {share.units} Slices • ₹{share.pledged_amount.toLocaleString('en-IN')}
                        </p>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--accent-blue)', borderRadius: '3px', transition: 'width 1.5s ease' }}></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                            <span style={{ color: 'var(--text-muted)' }}>BATCH STATUS</span>
                            <span style={{ color: 'var(--accent-blue)' }}>{deal?.status || 'Active'}</span>
                          </div>
                        </div>
                        
                        <button className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', fontWeight: 600 }} onClick={() => navigate(`/product/${deal?.product_id}`)}>Track Production</button>
                      </div>
                    );
                  })}
                  
                  <div className="card" style={{ padding: '24px', background: 'var(--accent-blue-light)', border: '1px dashed var(--accent-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.8 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(0, 122, 255, 0.2)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: 'var(--primary-blue)' }}>New Commitment</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.4 }}>Request a specific factory-direct batch lot.</p>
                      <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '12px', fontWeight: 600 }} onClick={() => setIsProposeModalOpen(true)}>Propose Pool</button>
                  </div>
                </div>
              </section>

               <section>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>History & Settlement</h2>
                <div className="card mobile-scroll-x" style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <tr>
                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settlement</th>
                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</th>
                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yield Gap</th>
                        <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order, i) => (
                        <tr key={i} style={{ borderBottom: i < orderHistory.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{order.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Closed on {order.date}</div>
                          </td>
                          <td style={{ padding: '20px 24px', fontSize: '14px' }}>{order.units} Units</td>
                          <td style={{ padding: '20px 24px', color: 'var(--system-green)', fontWeight: 600, fontSize: '14px' }}>{order.savings} Saved</td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: order.status === 'Delivered' ? 'var(--system-green)' : (order.status === 'Secured' ? 'var(--accent-blue)' : 'var(--text-muted)'), backgroundColor: order.status === 'Delivered' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 122, 255, 0.1)', padding: '4px 10px', borderRadius: '10px' }}>{order.status}</span>
                              <button 
                                onClick={() => setActiveOrderForReview(order)}
                                style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline' }}
                              >
                                Rate/Report
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="sidebar" style={{ position: 'sticky', top: '100px' }}>
              <div className="card" style={{ padding: '32px', background: 'linear-gradient(135deg, #1d1d1f 0%, #333 100%)', color: 'white', position: 'relative', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.6, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total Savings</div>
                    <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px', letterSpacing: '-0.02em' }}>₹{totalSavings.toLocaleString('en-IN')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ color: 'var(--system-green)' }}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                       </div>
                       <div style={{ fontSize: '11px', fontWeight: 500, lineHeight: 1.4 }}>12.4% Carbon Reduction <br /><span style={{ opacity: 0.6 }}>via direct logistics</span></div>
                    </div>
                  </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ProposePoolModal 
        isOpen={isProposeModalOpen} 
        onClose={() => setIsProposeModalOpen(false)} 
        onSubmit={handleProposeSubmit} 
      />

      {activeOrderForReview && (
        <ReviewActionModal 
          isOpen={!!activeOrderForReview} 
          onClose={() => setActiveOrderForReview(null)} 
          order={activeOrderForReview} 
        />
      )}
    </>
  );
};


export default Dashboard;


