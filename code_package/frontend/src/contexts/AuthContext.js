import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    localStorage.setItem('token', response.data.token);
    setCurrentUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    localStorage.setItem('token', response.data.token);
    setCurrentUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const response = await authAPI.updateProfile(profileData);
    setCurrentUser(response.data);
    return response.data;
  };

  const updateStylePreferences = async (preferencesData) => {
    const response = await userAPI.updateStylePreferences(preferencesData);
    setCurrentUser({
      ...currentUser,
      style_preferences: response.data
    });
    return response.data;
  };

  const updateAutomationPreferences = async (preferencesData) => {
    const response = await userAPI.updateAutomationPreferences(preferencesData);
    setCurrentUser({
      ...currentUser,
      automation_preferences: response.data
    });
    return response.data;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    updateStylePreferences,
    updateAutomationPreferences
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
