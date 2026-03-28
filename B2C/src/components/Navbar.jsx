import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, user, logout } = useAppContext();
  const [searchFocused, setSearchFocused] = useState(false);
  
  const navLinks = [
    { name: 'Discovery', path: '/discovery' },
    { name: 'Active Pools', path: '/active-pools' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (location.pathname !== '/discovery') {
        navigate('/discovery');
      }
    }
  };

  return (
    <nav className="glass" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: '7px', 
              background: 'linear-gradient(180deg, #333 0%, #000 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="logo" style={{ fontWeight: 600, fontSize: '16px', color: 'var(--primary-blue)' }}>
              B2C
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="hover-lift"
                style={{ 
                  textDecoration: 'none', 
                  color: location.pathname === link.path ? 'var(--accent-blue)' : 'var(--text-main)', 
                  fontSize: '13px',
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  opacity: location.pathname === link.path ? 1 : 0.8
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          {/* Search Bar */}
          <div style={{ 
            width: '100%',
            maxWidth: '240px', 
            position: 'relative',
            transition: 'var(--transition-smooth)'
          }}>
            <div style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              zIndex: 1
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              style={{ 
                width: '100%', 
                padding: '6px 12px 6px 30px', 
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                transition: 'var(--transition-smooth)'
              }}
              onFocus={(e) => {
                setSearchFocused(true);
                e.target.style.backgroundColor = 'var(--white)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.2)';
              }}
              onBlur={(e) => {
                setSearchFocused(false);
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', opacity: 0.8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to={user.role === 'Seller' ? "/seller" : (user.role === 'Distributor' ? "/distributor" : "/dashboard")} style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-blue)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '11px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Link>
                <button 
                  onClick={logout}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/login" style={{ fontSize: '12px', textDecoration: 'none', color: 'var(--text-main)', padding: '6px 14px', fontWeight: 500 }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
