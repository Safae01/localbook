import React, { createContext, useContext, useState, useEffect } from 'react';
import AdminService from '../services/AdminService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Vérifier si un admin est déjà connecté au chargement
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        if (adminData && adminData.isAdmin) {
          setAdmin(adminData);
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('admin');
      }
    }
  }, []);

  const adminLogin = async (credentials) => {
    setError(null);
    setSuccess(null);
    try {
      const result = await AdminService.adminLogin(credentials);
      if (result.success) {
        setSuccess(result.message);
        setAdmin(result.admin);
        setIsAdminAuthenticated(true);

        // Sauvegarder les données admin dans localStorage
        localStorage.setItem('admin', JSON.stringify(result.admin));
      } else {
        setError(result.error);
      }
      return result;
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Erreur de connexion');
      return { success: false, error: 'Erreur inconnue' };
    }
  };

  const adminLogout = () => {
    setAdmin(null);
    setIsAdminAuthenticated(false);
    setError(null);
    setSuccess(null);
    localStorage.removeItem('admin');
  };

  const deletePost = async (postId) => {
    if (!admin) return { success: false, error: 'Non authentifié' };
    
    try {
      const result = await AdminService.deletePost(postId, admin.ID_ADMIN);
      return result;
    } catch (error) {
      console.error('Delete post error:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };

  const deleteComment = async (commentId) => {
    if (!admin) return { success: false, error: 'Non authentifié' };
    
    try {
      const result = await AdminService.deleteComment(commentId, admin.ID_ADMIN);
      return result;
    } catch (error) {
      console.error('Delete comment error:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };

  const deleteStory = async (storyId) => {
    if (!admin) return { success: false, error: 'Non authentifié' };
    
    try {
      const result = await AdminService.deleteStory(storyId, admin.ID_ADMIN);
      return result;
    } catch (error) {
      console.error('Delete story error:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };

  const deleteUser = async (userId) => {
    if (!admin) return { success: false, error: 'Non authentifié' };
    
    try {
      const result = await AdminService.deleteUser(userId, admin.ID_ADMIN);
      return result;
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  };

  const value = {
    admin,
    isAdminAuthenticated,
    error,
    success,
    adminLogin,
    adminLogout,
    deletePost,
    deleteComment,
    deleteStory,
    deleteUser,
    setError,
    setSuccess
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
