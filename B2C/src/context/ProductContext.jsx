import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../db/libsql';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within a ProductProvider');
  return context;
};

export const ProductProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useUI();
  
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [userShares, setUserShares] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      const prodRes = await api.products.getAll();
      setProducts(prodRes.rows);
      
      if (user) {
        const orderRes = await api.auth.orders();
        if (orderRes.rows) setOrderHistory(orderRes.rows);

        const shareRes = await api.deals.getUserShares();
        if (shareRes.rows) setUserShares(shareRes.rows);
      }

      const dealsRes = await api.deals.getAll();
      if (dealsRes.rows) setDeals(dealsRes.rows);
    } catch (error) {
      console.error("Data Fetch Error:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
      await fetchInitialData();
      return { success: true };
    } catch (e) {
      addNotification("Error processing order", "error");
      return { success: false, error: e.message };
    }
  };

  const verifyProduct = async (id) => {
    try {
      await api.products.verify(id);
      await fetchInitialData();
      addNotification("Listing verified!");
    } catch (e) {
      addNotification(`Verification failed: ${e.message}`, 'error');
    }
  };

  const closePool = async (id) => {
    try {
      await api.products.closeOrders(id);
      await fetchInitialData();
      addNotification("Pool closed.");
    } catch (e) {
      addNotification("Failed: " + e.message, "error");
    }
  };

  const shipProduct = async (id, city) => {
    try {
      await api.products.ship(id, city);
      await fetchInitialData();
      addNotification(`Batch shipped to ${city}!`);
    } catch (e) {
      addNotification("Shipping failed: " + e.message, "error");
    }
  };

  const purchaseShare = async (dealId, units) => {
    if (!user) {
      addNotification("Please sign in.", "error");
      return { success: false };
    }

    if (user.kyc_status !== 'Verified') {
      addNotification("KYC required.", "error");
      return { success: false, needsKYC: true };
    }

    try {
      await api.deals.purchaseShare(dealId, units);
      addNotification(`Purchased ${units} share(s)!`);
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
    <ProductContext.Provider value={{
      products,
      deals,
      orderHistory,
      userShares,
      loadingProducts,
      addProduct,
      joinPool,
      verifyProduct,
      closePool,
      shipProduct,
      purchaseShare,
      createDeal,
      fetchInitialData
    }}>
      {children}
    </ProductContext.Provider>
  );
};
