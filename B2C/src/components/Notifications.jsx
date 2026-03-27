import React from 'react';
import { useAppContext } from '../context/AppContext';

const Notifications = () => {
  const { notifications } = useAppContext();

  return (
    <div style={{
      position: 'fixed',
      top: '72px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none'
    }}>
      {notifications.map(n => (
        <div key={n.id} className="card fade-in" style={{
          padding: '16px 24px',
          backgroundColor: 'var(--white)',
          borderLeft: `4px solid ${n.type === 'success' ? 'var(--system-green)' : 'var(--accent-blue)'}`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
          pointerEvents: 'auto',
          minWidth: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            backgroundColor: n.type === 'success' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 122, 255, 0.1)',
            color: n.type === 'success' ? 'var(--system-green)' : 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {n.type === 'success' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            )}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>{n.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
