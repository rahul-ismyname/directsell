import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import emailjs from '@emailjs/browser';

const SellerRegister = () => {
  const [step, setStep] = useState(1); // 1: registration, 2: verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const { register, verifyUser, login } = useAuth();
  const { addNotification } = useUI();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const res = await register(name, email, password, 'Seller');
    if (res.success) {
      // Send Email via EmailJS
      const templateParams = {
        email: email, // Matches {{email}} in your screenshot
        passcode: res.code, // Matches {{passcode}} in your screenshot
        to_name: name,
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id',
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
        );
        addNotification("Verification code sent to your email!");
        setStep(2);
      } catch (err) {
        console.error("EmailJS Error Object:", err);
        setError(`Failed to send email. Error: ${err.text || 'Unknown'}. Please check your keys or console.`);
        setStep(2);
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
    setIsProcessing(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const trimmedCode = code.trim();
      const res = await verifyUser(email, trimmedCode);
      if (res.success) {
        addNotification("Email verified! Redirecting to setup...");
        login(res.user, res.token);
        navigate('/seller');
      } else {
        setError(res.error || "Invalid verification code.");
      }
    } catch (err) {
      console.error("Verification Error:", err);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="seller-register-page fade-in" style={{ 
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
        textAlign: 'center'
      }}>
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: '16px', 
          background: 'var(--primary-blue)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 32px'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '12px', letterSpacing: '-0.03em' }}>Supplier Application</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px' }}>Register your manufacturing facility.</p>

            {error && <div style={{ marginBottom: '24px', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: 'rgb(255, 59, 48)', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Factory / Brand Name</label>
                <input required type="text" placeholder="Global Manufacturing Ltd." style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)' }} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Work Email</label>
                <input required type="email" placeholder="contact@factory.com" style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)' }} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
                <input required type="password" placeholder="••••••••" style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)' }} value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px' }} disabled={isProcessing}>
                {isProcessing ? 'Submitting...' : 'Apply for Access'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '12px', letterSpacing: '-0.03em' }}>Verify Email</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px' }}>We sent a 6-digit code to <strong>{email}</strong></p>

            {error && <div style={{ marginBottom: '24px', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: 'rgb(255, 59, 48)', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Verification Code</label>
                <input required type="text" placeholder="123456" maxLength={6} style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }} value={code} onChange={e => setCode(e.target.value)} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px' }} disabled={isProcessing}>
                {isProcessing ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Back to Registration</button>
            </form>
          </>
        )}

        <p style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/seller-login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegister;
