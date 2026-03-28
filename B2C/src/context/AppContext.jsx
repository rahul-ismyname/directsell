import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ProductProvider, useProduct } from './ProductContext';
import { UIProvider, useUI } from './UIContext';
import api from '../db/libsql';

// For backward compatibility only
export const useAppContext = () => {
  const auth = useAuth();
  const product = useProduct();
  const ui = useUI();

  return {
    ...auth,
    ...product,
    ...ui,
    // Add missing parts if any
    submitReview: async (data) => {
      try {
        await api.reviews.submit(data);
        ui.addNotification("Review submitted! Thank you.", "success");
      } catch (e) {
        ui.addNotification("Failed to submit review: " + e.message, "error");
      }
    },
    submitReport: async (data) => {
      try {
        await api.reports.submit(data);
        ui.addNotification("Report submitted! We will investigate.", "success");
      } catch (e) {
        ui.addNotification("Failed to submit report: " + e.message, "error");
      }
    },
    getRegionalPools: api.products.getRegionalPools,
    distributor: {
      getPools: api.distributors.getPools,
      claimPool: async (id) => {
         try {
           await api.distributors.claimPool(id);
           ui.addNotification("You are now the distribution leader!");
           return { success: true };
         } catch (e) {
           ui.addNotification(e.message, "error");
           return { success: false };
         }
      },
      markReceived: async (id) => {
        try {
          await api.distributors.markReceived(id);
          ui.addNotification("Updated: Batch received from supplier.");
          return { success: true };
        } catch (e) {
          ui.addNotification(e.message, "error");
          return { success: false };
        }
      },
      notifyUsers: async (id) => {
        try {
          await api.distributors.notifyUsers(id);
          ui.addNotification("Participants notified for pickup!");
          return { success: true };
        } catch (e) {
          ui.addNotification(e.message, "error");
          return { success: false };
        }
      },
      submitReview: async (data) => {
        try {
          await api.distributors.submitReview(data);
          ui.addNotification("Anomymous review submitted for distributor.");
          return { success: true };
        } catch (e) {
          ui.addNotification(e.message, "error");
          return { success: false };
        }
      }
    }
  };
};

export const AppProvider = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <ProductProvider>
          {children}
        </ProductProvider>
      </AuthProvider>
    </UIProvider>
  );
};
