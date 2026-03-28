import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../db/libsql';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('b2c_user', JSON.stringify(userData));
    localStorage.setItem('b2c_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('b2c_user');
    localStorage.removeItem('b2c_token');
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
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      logout,
      register,
      verifyUser,
      submitKYC
    }}>
      {children}
    </AuthContext.Provider>
  );
};
