import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProposePoolModal from '../components/ProposePoolModal';
import ReviewActionModal from '../components/ReviewActionModal';

const Dashboard = () => {
  const { activePools, orderHistory, addNotification, user, submitReview, submitReport } = useAppContext();
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
      <div className="dashboard-page fade-in" style={{ padding: '80px 0' }}>
        <div className="container">
          <header style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Portfolio Overview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Active manufacturing commitments and historical impact.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '64px', alignItems: 'start' }}>
            {/* Main Area */}
            <div className="main-content">
              <section style={{ marginBottom: '64px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Active Commitment Pools</h2>
                  <span style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
                </div>
                <div className="grid-main" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                  {activePools.map((pool, idx) => (
                    <div key={idx} className="card hover-lift" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.03)', color: 'var(--primary-blue)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--system-green)', textTransform: 'uppercase' }}>{pool.progress}% CAPACITY</span>
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{pool.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>Batch {pool.batch} • {pool.units ? `${pool.units} Units` : 'Locked in Oct'}</p>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                          <div style={{ height: '100%', width: `${pool.progress}%`, backgroundColor: 'var(--accent-blue)', borderRadius: '2px' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-muted)' }}>MSRP {pool.msrp}</span>
                          <span style={{ color: 'var(--system-green)' }}>SAVING {pool.saved}</span>
                        </div>
                      </div>
                      
                      <button className="btn btn-secondary" style={{ width: '100%', fontSize: '13px' }}>Track Production</button>
                    </div>
                  ))}
                  
                  <div className="card" style={{ padding: '24px', background: 'var(--accent-blue-light)', border: '1px dashed var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Open New Pool</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Request a factory-direct order.</p>
                      <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }} onClick={() => setIsProposeModalOpen(true)}>Propose Pool</button>
                  </div>
                </div>
              </section>

              <section>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>History & Settlement</h2>
                <div className="card" style={{ overflow: 'hidden' }}>
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


