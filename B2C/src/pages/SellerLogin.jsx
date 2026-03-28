import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../db/libsql';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'Seller') {
      navigate('/seller');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const res = await api.auth.login({ email, password });
      
      if (res.user.role !== 'Seller') {
        setError('This login is for verified sellers only.');
        setIsLoggingIn(false);
        return;
      }

      login(res.user, res.token);
      navigate('/seller');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="seller-login fade-in" style={{ 
      minHeight: 'calc(100vh - 100px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '40px 24px'
    }}>
      <div className="card shadow-lg" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '56px', 
        backgroundColor: 'var(--white)',
        borderRadius: '32px',
        textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: '16px', 
          background: 'var(--primary-blue)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 8px 20px rgba(0,122,255,0.3)'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </div>
        
        <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '12px', letterSpacing: '-0.03em' }}>Supplier Login</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px' }}>Access your factory management dashboard.</p>

        {error && <div style={{ marginBottom: '24px', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: 'rgb(255, 59, 48)', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Work Email</label>
            <input required type="email" placeholder="factory@partner.com" style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px' }} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input required type="password" placeholder="••••••••" style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '15px' }} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '16px', fontWeight: 600 }} disabled={isLoggingIn}>
            {isLoggingIn ? 'Verifying...' : 'Sign In as Supplier'}
          </button>
        </form>

        <p style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Interested in Becoming a Partner? <Link to="/seller-apply" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Apply Now</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
