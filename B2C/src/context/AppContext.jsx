import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../db/libsql';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activePools, setActivePools] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [deals, setDeals] = useState([]);
  const [userShares, setUserShares] = useState([]);

  const fetchInitialData = useCallback(async () => {
    try {
      const prodRes = await api.products.getAll();
      setProducts(prodRes.rows);
      
      const token = localStorage.getItem('b2c_token');
      if (token && user) {
        const orderRes = await api.auth.orders();
        if (orderRes.rows) setOrderHistory(orderRes.rows);

        const shareRes = await api.deals.getUserShares();
        if (shareRes.rows) setUserShares(shareRes.rows);
      }

      const dealsRes = await api.deals.getAll();
      if (dealsRes.rows) setDeals(dealsRes.rows);
    } catch (error) {
      console.error("Data Fetch Error:", error);
    }
  }, [user]);

  // Check for existing token and restore session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('b2c_token');
      if (token) {
        try {
          const res = await api.auth.me();
          setUser(res.user);
        } catch (error) {
          console.error("Session restore failed", error);
          localStorage.removeItem('b2c_token');
          localStorage.removeItem('b2c_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('b2c_user', JSON.stringify(userData));
    localStorage.setItem('b2c_token', token);
    addNotification(`Welcome back, ${userData.name}!`);
  };

  const register = async (name, email, password, role = 'Verified Collector', location = 'Mumbai') => {
    try {
      const res = await api.auth.register({ name, email, password, role, location });
      return { success: true, user: res.id, code: res.code };
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };

  const verifyUser = async (email, code) => {
    try {
      const res = await api.auth.verify({ email, code });
      return { success: true, user: res.user, token: res.token };
    } catch (error) {
      console.error("Verification Error:", error);
      return { success: false, error: error.message };
    }
  };

  const submitKYC = async (kycData) => {
    try {
      await api.auth.submitKYC(kycData);
      const res = await api.auth.me();
      setUser(res.user);
      addNotification("KYC Documented Successfully!");
      return { success: true };
    } catch (error) {
      addNotification("KYC submission failed", "error");
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('b2c_user');
    localStorage.removeItem('b2c_token');
    addNotification('Logged out successfully');
  };

  const addProduct = async (productData) => {
    try {
      await api.products.add({
        ...productData,
        price: Number(productData.price),
        msrp: Number(productData.msrp),
        minUnits: Number(productData.minUnits)
      });
      await fetchInitialData();
      addNotification("Listing submitted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error adding product:", error);
      addNotification("Failed to list product.", "error");
      return { success: false, error: error.message };
    }
  };

  const joinPool = async (product, quantity) => {
    if (!user) {
      addNotification("Please sign in to join pools.", "error");
      return { success: false };
    }
    
    if (user.kyc_status !== 'Verified') {
      addNotification("Please complete KYC verification to join pools.", "error");
      return { success: false, needsKYC: true };
    }

    try {
      const savingsAmount = (product.msrp - product.price) * quantity;
      
      await api.pools.join({ 
        productId: product.id, 
        quantity,
        savings: `-₹${savingsAmount.toLocaleString('en-IN')}`,
        productName: product.title
      });
      
      addNotification(`Reserved ${quantity} units of ${product.title}`);
      await fetchInitialData(); // Refresh products and history
      return { success: true };
    } catch (e) {
      addNotification("Error processing order", "error");
      return { success: false, error: e.message };
    }
  };

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const modalContent = {
     help: {
      title: "Help Center",
      subtitle: "Guidance for the Collective Buying Network",
      sections: [
        { label: "Commitment Pools", text: "Join a pool by pledging funds. Orders only proceed when the minimum batch size is met." },
        { label: "Escrow Protocol", text: "Your money stays in a secure vault. It's only released to the factory after quality clearance." },
        { label: "Delivery Timelines", text: "Since batches ship direct from source, expect 4-6 weeks for international freight." }
      ]
    },
    docs: {
      title: "Documentation",
      subtitle: "Technical protocols and supplier standards",
      sections: [
        { label: "API Integration", text: "Manufacturers must sync production status via our ERP gateway." },
        { label: "Quality Standards", text: "Rigorous Tier-1 vetting for all manufacturing facilities in the network." },
        { label: "Logistics Hubs", text: "Instructions for consolidated hub delivery and smart contract triggers." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Your data is protected and decentralized.",
      sections: [
        { label: "Data Ownership", text: "We don't sell your personal procurement data to third-party advertisers." },
        { label: "Encryption", text: "All transaction details are encrypted and stored using secure protocols." }
      ]
    },
    sustainability: {
      title: "Sustainability Report",
      subtitle: "Reducing the carbon footprint of global commerce.",
      sections: [
        { label: "Direct Logistics", text: "By bypassing 3-4 middle-men, we reduce shipping legs and carbon emissions by 40%." },
        { label: "Waste Reduction", text: "Only manufacturing what is already sold prevents overproduction waste." }
      ]
    },
    cookies: {
      title: "Cookie Settings",
      subtitle: "Manage your privacy and data preferences.",
      sections: [
        { label: "Essential Cookies", text: "These are required for technical reasons such as maintaining your login session and processing orders. They cannot be disabled." },
        { label: "Analytics Cookies", text: "Help us understand how the collective uses the platform to optimize supply routes and manufacturing cycles." },
        { label: "Marketing Cookies", text: "Used to show relevant bulk-buying opportunities based on your previous interest." }
      ]
    }
  };

  const verifyProduct = async (id) => {
    try {
      await api.products.verify(id);
      await fetchInitialData();
      addNotification("Listing verified as Admin!");
    } catch (e) {
      addNotification(`Verification failed: ${e.message}`, 'error');
    }
  };

  const closePool = async (id) => {
    try {
      await api.products.closeOrders(id);
      await fetchInitialData();
      addNotification("Pool closed to new orders.", "success");
    } catch (e) {
      addNotification("Failed to close pool: " + e.message, "error");
    }
  };

  const shipProduct = async (id, city) => {
    try {
      await api.products.ship(id, city);
      await fetchInitialData();
      addNotification(`Batch shipped to ${city}! Buyers have been notified.`);
    } catch (e) {
      addNotification("Shipping failed: " + e.message, "error");
    }
  };

  const submitReview = async (data) => {
    try {
      await api.reviews.submit(data);
      addNotification("Review submitted! Thank you.", "success");
    } catch (e) {
      addNotification("Failed to submit review: " + e.message, "error");
    }
  };

  const submitReport = async (data) => {
    try {
      await api.reports.submit(data);
      addNotification("Report submitted! We will investigate.", "success");
    } catch (e) {
      addNotification("Failed to submit report: " + e.message, "error");
    }
  };

  const purchaseShare = async (dealId, units) => {
    if (!user) {
      addNotification("Please sign in to join pools.", "error");
      return { success: false };
    }

    if (user.kyc_status !== 'Verified') {
      addNotification("KYC verification required to participate in deals.", "error");
      return { success: false, needsKYC: true };
    }

    try {
      await api.deals.purchaseShare(dealId, units);
      addNotification(`Purchased ${units} share(s) successfully!`);
      await fetchInitialData();
      return { success: true };
    } catch (e) {
      addNotification(e.message, "error");
      return { success: false, error: e.message };
    }
  };

  const createDeal = async (dealData) => {
    try {
      await api.deals.create(dealData);
      addNotification("New manufacturing pool created!");
      await fetchInitialData();
      return { success: true };
    } catch (e) {
      addNotification(e.message, "error");
      return { success: false, error: e.message };
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      register,
      verifyUser,
      submitKYC,
      products,
      activePools,
      orderHistory,
      deals,
      userShares,
      joinPool,
      purchaseShare,
      createDeal,
      searchQuery,
      setSearchQuery,
      notifications,
      addNotification,
      isHowItWorksOpen,
      setIsHowItWorksOpen,
      activeModal,
      setActiveModal,
      modalContent,
      loading,
      addProduct,
      verifyProduct,
      closePool,
      shipProduct,
      getRegionalPools: api.products.getRegionalPools,
      submitReview,
      submitReport,
      distributor: {
        getPools: api.distributors.getPools,
        claimPool: async (id) => {
           try {
             await api.distributors.claimPool(id);
             addNotification("You are now the distribution leader!");
             return { success: true };
           } catch (e) {
             addNotification(e.message, "error");
             return { success: false };
           }
        },
        markReceived: async (id) => {
          try {
            await api.distributors.markReceived(id);
            addNotification("Updated: Batch received from supplier.");
            return { success: true };
          } catch (e) {
            addNotification(e.message, "error");
            return { success: false };
          }
        },
        notifyUsers: async (id) => {
          try {
            await api.distributors.notifyUsers(id);
            addNotification("Participants notified for pickup!");
            return { success: true };
          } catch (e) {
            addNotification(e.message, "error");
            return { success: false };
          }
        },
        submitReview: async (data) => {
          try {
            await api.distributors.submitReview(data);
            addNotification("Anomymous review submitted for distributor.");
            return { success: true };
          } catch (e) {
            addNotification(e.message, "error");
            return { success: false };
          }
        }
      },
      fetchInitialData
    }}>
      {children}
    </AppContext.Provider>
  );
};
