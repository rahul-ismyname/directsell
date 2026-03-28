import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';


const Footer = () => {
  const { user, setIsHowItWorksOpen, setActiveModal } = useAppContext();
  
  return (
    <footer style={{ padding: '80px 0 40px', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'var(--white)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) repeat(2, 1fr)', gap: '64px', marginBottom: '64px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--primary-blue)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              The Transparent Collective
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, maxWidth: '280px', marginBottom: '24px' }}>
              Empowering communities to reclaim the supply chain through radical transparency and collective buying power.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}></div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}></div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)' }}></div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><button onClick={() => setIsHowItWorksOpen(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'none', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>How It Works</button></li>

              <li><button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('sustainability')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>Sustainability Report</button></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to={user?.role === 'Seller' ? "/seller" : "/seller-login"} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>Supplier Portal</Link></li>
              <li><button onClick={() => setActiveModal('help')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>Help Center</button></li>
              <li><button onClick={() => setActiveModal('docs')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500, textAlign: 'left' }}>Documentation</button></li>
            </ul>
          </div>

        </div>
        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
          <div>© 2024 The Transparent Collective. Direct from source.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>TERMS & CONDITIONS</Link>
            <button 
              onClick={() => setActiveModal('cookies')} 
              style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '12px', cursor: 'pointer', fontWeight: 500, padding: 0, textTransform: 'uppercase' }}
            >
              COOKIE SETTINGS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
