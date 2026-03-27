import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { isHowItWorksOpen, setIsHowItWorksOpen } = useAppContext();

  return (
    <>
      <div className="home-page fade-in">
        {/* Hero Section */}
        <section className="hero" style={{ padding: '120px 0 80px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '980px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)', fontSize: '13px', fontWeight: 600 }}>
              <span>Verified Manufacturing Network</span>
            </div>
            
            <h1 style={{ fontSize: '72px', color: 'var(--primary-blue)', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: '24px' }}>
              Buy at <span style={{ color: 'var(--accent-blue)' }}>Factory Cost.</span>
            </h1>
            
            <p style={{ fontSize: '21px', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '720px', margin: '0 auto 40px', lineHeight: 1.4 }}>
              Join collective order pools to bypass distribution markups. High-quality goods, shipped straight from verified manufacturers to your door.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/discovery" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '16px', textDecoration: 'none' }}>
                Explore Pools
              </Link>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '12px 32px', fontSize: '16px' }}
                onClick={() => setIsHowItWorksOpen(true)}
              >
                How it Works
              </button>
            </div>

            
            <div style={{ marginTop: '80px', position: 'relative' }}>
              <div style={{ 
                backgroundColor: 'var(--white)', 
                borderRadius: '24px', 
                padding: '12px',
                boxShadow: 'var(--shadow-premium)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=2400" 
                  alt="Products" 
                  style={{ width: '100%', borderRadius: '16px', display: 'block' }} 
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Card */}
        <section style={{ padding: '80px 0 120px' }}>
          <div className="container">
            <div className="card" style={{ 
              padding: '80px', 
              background: 'linear-gradient(135deg, #1d1d1f 0%, #333 100%)', 
              borderRadius: '32px',
              color: 'white', 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                 <h2 style={{ color: 'white', fontSize: '48px', marginBottom: '16px', letterSpacing: '-0.02em' }}>Ready to disrupt the supply chain?</h2>
                 <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '19px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                   Start a new collective or join thousands of smart buyers already saving billions in markups.
                 </p>
                 <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                   <Link to="/discovery" className="btn btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Get Started</Link>
                   <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', padding: '12px 32px' }}>Contact Sales</button>
                 </div>
               </div>
               <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(0,122,255,0.15), transparent)', pointerEvents: 'none' }}></div>
            </div>
          </div>
        </section>
      </div>

    </>
  );
};

export default Home;
