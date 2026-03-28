import React from 'react';
import { useUI } from '../context/UIContext';

const GeneralModal = () => {
  const { activeModal, setActiveModal, modalContent } = useUI();

  if (!activeModal) return null;

  const content = modalContent[activeModal];
  if (!content) return null;

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
    }} onClick={() => setActiveModal(null)}>
      <div className="card fade-in" style={{ 
        width: '100%',
        maxWidth: '550px', 
        backgroundColor: 'var(--white)', 
        padding: '48px', 
        borderRadius: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <header style={{ marginBottom: '32px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)', letterSpacing: '-0.02em', marginBottom: '8px' }}>{content.title}</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>{content.subtitle}</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {content.sections.map((section, i) => (
            <div key={i} className="fade-in" style={{ animationDelay: `${i*0.1}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section.label}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-muted)' }}>{section.text}</p>
              </div>
              {activeModal === 'cookies' && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '24px', 
                    borderRadius: '12px', 
                    backgroundColor: i === 0 ? 'var(--accent-blue)' : '#cbd5e1', 
                    position: 'relative',
                    cursor: i === 0 ? 'not-allowed' : 'pointer'
                  }}>
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      backgroundColor: 'white', 
                      position: 'absolute', 
                      top: '3px', 
                      right: i === 0 ? '3px' : 'auto',
                      left: i === 0 ? 'auto' : '3px',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '40px', padding: '16px' }} onClick={() => setActiveModal(null)}>
          {activeModal === 'cookies' ? 'Save Preferences' : 'Understood'}
        </button>
      </div>
    </div>
  );
};

export default GeneralModal;
