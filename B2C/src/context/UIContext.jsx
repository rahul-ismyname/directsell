import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};

export const UIProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

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

  return (
    <UIContext.Provider value={{
      notifications,
      addNotification,
      isHowItWorksOpen,
      setIsHowItWorksOpen,
      activeModal,
      setActiveModal,
      modalContent,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </UIContext.Provider>
  );
};
