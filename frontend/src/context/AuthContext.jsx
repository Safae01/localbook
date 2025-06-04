import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté au chargement de l'application
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const register = async (userData, cinFile) => {
    setError(null);
    setSuccess(null);
    const result = await AuthService.register(userData, cinFile);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.error);
    }
    return result;
  };

  const login = async (credentials) => {
    setError(null);
    setSuccess(null);
    try {
      const result = await AuthService.login(credentials);
      if (result.success) {
        setSuccess(result.message);
        setUser(result.user);
        setIsAuthenticated(true);

        // Sauvegarder les données utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
      } else {
        setError(result.error);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      setError('Erreur de connexion');
      return { success: false, error: 'Erreur inconnue' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setSuccess(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      register,
      login,
      logout,
      error,
      success,
      user,
      isAuthenticated,
      setError,
      setSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
