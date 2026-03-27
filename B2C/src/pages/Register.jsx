import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Verified Collector');
  const [location, setLocation] = useState('Mumbai');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');

    const res = await register(name, email, password, role, location);
    if (res.success) {
      navigate('/login'); 
    } else {
      setError(res.error || 'Registration failed. Use a different email.');
      setIsRegistering(false);
    }
  };

  return (
    <div className="login-page fade-in" style={{ 
      minHeight: 'calc(100vh - 100px)', 
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
          margin: '0 auto 24px'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Join the Network</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Start buying factory-direct today.</p>

        {error && <div style={{ marginBottom: '20px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: 'rgb(255, 59, 48)', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
            <input required type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Email address</label>
            <input required type="email" placeholder="name@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Account Type</label>
              <select 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} 
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="Verified Collector">Buyer</option>
                <option value="Distributor">Distribution Leader</option>
              </select>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>City Hub</label>
              <select 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} 
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input required type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }} disabled={isRegistering}>
            {isRegistering ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
