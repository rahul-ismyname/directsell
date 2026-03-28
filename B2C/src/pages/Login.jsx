import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../db/libsql';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      const res = await api.auth.login({ email, password });
      login(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page fade-in" style={{ 
      minHeight: 'calc(100vh - 52px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'rgba(0,0,0,0.02)',
      padding: '40px 24px'
    }}>
      <div className="card shadow-lg" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '48px', 
        backgroundColor: 'var(--white)',
        borderRadius: '32px',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: '12px', 
          background: 'linear-gradient(180deg, #333 0%, #000 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Welcome back</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Enter your details to access your portfolio.</p>

        {error && <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: 'rgb(255, 59, 48)', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</label>
            <input 
              required
              type="email" 
              placeholder="name@example.com" 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '15px' }}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '15px' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '15px' }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span>Don't have an account? <Link to="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link></span>
          <span style={{ opacity: 0.6 }}>Are you a supplier? <Link to="/seller-login" style={{ color: 'var(--text-main)', textDecoration: 'underline', fontWeight: 600 }}>Supplier Login</Link></span>
        </p>

      </div>
    </div>
  );
};

export default Login;
