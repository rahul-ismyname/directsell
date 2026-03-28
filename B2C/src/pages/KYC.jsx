import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  LayoutGrid, 
  CreditCard, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Info, 
  Loader2, 
  BadgeCheck,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const KYC = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    category: '',
    gstin: '',
    idNumber: '', // Aadhaar or PAN
    upiId: '',
    enableAutopay: false
  });

  const [isVerifyingGST, setIsVerifyingGST] = useState(false);
  const [isGSTVerified, setIsGSTVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const categories = ['Grocery', 'Electronics', 'Pharma', 'Fashion', 'Automotive', 'Other'];
  const { submitKYC, user } = useAppContext();
  const navigate = useNavigate();

  const isCollector = user?.role === 'Verified Collector';
  const roleTitle = isCollector ? 'Account Verification' : 'Business Verification';
  const roleSubtitle = isCollector ? 'Complete your KYC to join larger manufacturing deals and secure your orders.' : 'Complete your KYC to unlock settlements and full manufacturing features.';

  const handleVerifyGST = () => {
    setIsVerifyingGST(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifyingGST(false);
      setIsGSTVerified(true);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // GST is optional for collectors
    if (!isCollector && !isGSTVerified && formData.gstin) {
      alert("Please verify your GSTIN first");
      return;
    }
    
    const result = await submitKYC({
      shopName: formData.shopName || (isCollector ? formData.ownerName : ''),
      ownerName: formData.ownerName,
      category: formData.category,
      gstin: formData.gstin,
      upiId: formData.upiId
    });

    if (result.success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--bg-gray)] flex items-center justify-center p-4 fade-in">
        <div className="card" style={{ padding: '64px', maxWidth: '500px', width: '100%', textCenter: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            backgroundColor: 'var(--accent-blue-light)', 
            borderRadius: '50%', 
            display: 'flex', 
            itemsCenter: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px',
            alignItems: 'center' 
          }}>
            <BadgeCheck size={40} color="var(--accent-blue)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Verified Successfully</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            {isCollector 
              ? 'Your account has been verified. You can now participate in community manufacturing batches.'
              : 'Your business profile has been updated and you are now a verified supplier.'}
          </p>
          
          <button 
            onClick={() => navigate(isCollector ? '/' : '/seller')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            {isCollector ? 'Start Shopping' : 'Go to Seller Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-page fade-in section-padding" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-gray)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
           <h1 style={{ fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>{roleTitle}</h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{roleSubtitle}</p>
        </header>

        {/* Simplified Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', backgroundColor: 'rgba(0,0,0,0.05)', zIndex: 0 }}></div>
          {[1,2,3,4].map(step => (
            <div key={step} style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-gray)', padding: '0 10px', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '8px' }}>
               <div style={{ 
                 width: 32, 
                 height: 32, 
                 borderRadius: '50%', 
                 backgroundColor: step <= activeStep ? 'var(--accent-blue)' : 'white', 
                 color: step <= activeStep ? 'white' : 'var(--text-muted)',
                 border: step <= activeStep ? 'none' : '1px solid rgba(0,0,0,0.1)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontWeight: 600,
                 fontSize: '12px'
               }}>
                 {step < activeStep ? <CheckCircle2 size={16} /> : step}
               </div>
               <span className="kyc-step-label" style={{ fontSize: '10px', fontWeight: 700, color: step === activeStep ? 'var(--accent-blue)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 {['Identity', 'Tax Info', 'Payment', 'Docs'][step-1]}
               </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section 1: Business Details */}
          <div className="card card-padding">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isCollector ? <User size={20} color="var(--accent-blue)" /> : <Building2 size={20} color="var(--accent-blue)" />} 
              {isCollector ? 'Personal / Business Details' : 'Business Details'}
            </h2>
            
            <div className="responsive-grid">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {isCollector ? 'Shop / Account Name (Optional)' : 'Legal Shop Name'}
                  </label>
                  <input 
                    required={!isCollector}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px' }}
                    placeholder={isCollector ? "Account identifier" : "e.g. Modern Mart"}
                    value={formData.shopName}
                    onChange={(e) => {
                      setFormData({...formData, shopName: e.target.value});
                      if(e.target.value) setActiveStep(1);
                    }}
                  />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Owner Name</label>
                  <input 
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px' }}
                    placeholder="Full legal name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Business Category</label>
                  <select 
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', backgroundColor: 'white' }}
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>
            </div>
          </div>

          {/* Section 2: Tax & Identity */}
          <div className="card card-padding">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={20} color="var(--accent-blue)" /> Tax & Identity
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                    GSTIN Number {isCollector && '(Optional)'}
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px', fontFamily: 'monospace' }}
                      placeholder="15-digit GSTIN"
                      value={formData.gstin}
                      onChange={(e) => {
                        setFormData({...formData, gstin: e.target.value});
                        if(e.target.value) setActiveStep(2);
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={handleVerifyGST}
                      disabled={isGSTVerified || isVerifyingGST || !formData.gstin}
                      className="btn" 
                      style={{ backgroundColor: isGSTVerified ? 'var(--system-green)' : 'var(--accent-blue)', color: 'white', padding: '0 20px', fontSize: '12px' }}
                    >
                      {isVerifyingGST ? 'Checking...' : (isGSTVerified ? 'Verified' : 'Verify')}
                    </button>
                  </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Owner ID (Aadhaar / PAN)</label>
                  <input 
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px' }}
                    placeholder="Enter ID number"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  />
               </div>
            </div>
          </div>

          {/* Section 3: Payments */}
           <div className="card card-padding">
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Wallet size={20} color="var(--accent-blue)" /> {isCollector ? 'Payment Info' : 'Settlement Info'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Primary UPI ID</label>
                  <input 
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '14px' }}
                    placeholder="shop@upi"
                    value={formData.upiId}
                    onChange={(e) => {
                      setFormData({...formData, upiId: e.target.value});
                      if(e.target.value) setActiveStep(3);
                    }}
                  />
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                  <input 
                    type="checkbox" 
                    id="autopay" 
                    checked={formData.enableAutopay} 
                    onChange={e => {
                      setFormData({...formData, enableAutopay: e.target.checked});
                      if(e.target.checked) setActiveStep(4);
                    }}
                    style={{ width: '18px', height: '18px' }} 
                  />
                  <div>
                    <label htmlFor="autopay" style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Enable UPI Autopay for Shares <Info size={14} color="var(--text-muted)" />
                    </label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Uses block-and-debit mechanism. Funds are only debited upon successful batch verification.</p>
                  </div>
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '16px', fontSize: '16px', fontWeight: 600, marginTop: '16px' }}
          >
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYC;
