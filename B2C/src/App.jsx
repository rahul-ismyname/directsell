import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Notifications from './components/Notifications'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import ProductDetail from './pages/ProductDetail'
import ActivePools from './pages/ActivePools'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SellerLogin from './pages/SellerLogin'
import SellerRegister from './pages/SellerRegister'
import Register from './pages/Register'
import SellerDashboard from './pages/SellerDashboard'
import TermsAndConditions from './pages/TermsAndConditions'
import KYC from './pages/KYC'
import DistributorDashboard from './pages/DistributorDashboard'
import HowItWorksModal from './components/HowItWorksModal'
import GeneralModal from './components/GeneralModal'
import './index.css'
import { useUI } from './context/UIContext'

function App() {
  const { isHowItWorksOpen, setIsHowItWorksOpen } = useUI();
  
  return (
    <Router>
      <div className="app">
        <Notifications />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/active-pools" element={<ActivePools />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller-apply" element={<SellerRegister />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/distributor" element={<DistributorDashboard />} />
            <Route path="/kyc" element={<KYC />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Global Modals */}
        <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
        <GeneralModal />
      </div>
    </Router>
  )
}

export default App
