import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/NotificationService';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.ID_USER) return;

    setLoading(true);
    setError(null);

    try {
      const result = await NotificationService.getNotifications(user.ID_USER);

      if (result.success) {
        setNotifications(result.notifications || []);
        setUnreadCount(result.unread_count || 0);
      } else {
        setError(result.error || 'Erreur lors du chargement des notifications');
      }
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.ID_USER]);

  // Charger les notifications au montage du composant
  useEffect(() => {
    if (user?.ID_USER) {
      loadNotifications();
    }
  }, [loadNotifications, user]);

  // Fonction pour rafraîchir les notifications
  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Fonction pour marquer les notifications comme vues
  const markNotificationsAsViewed = useCallback(async () => {
    if (!user?.ID_USER) return;

    try {
      const result = await NotificationService.markNotificationsAsViewed(user.ID_USER);

      if (result.success) {
        setUnreadCount(0); // Réinitialiser le compteur
      }

      return result;
    } catch (err) {
      console.error('Error marking notifications as viewed:', err);
      return { success: false, error: 'Erreur lors du marquage des notifications' };
    }
  }, [user?.ID_USER]);

  // Fonction pour créer une nouvelle notification
  const createNotification = useCallback(async (userTo, postId, type, message) => {
    if (!user?.ID_USER) return;

    try {
      const result = await NotificationService.createNotification(
        user.ID_USER,
        userTo,
        postId,
        type,
        message
      );

      if (result.success) {
        // Optionnel : rafraîchir les notifications après création
        // refreshNotifications();
      }

      return result;
    } catch (err) {
      console.error('Error creating notification:', err);
      return { success: false, error: 'Erreur lors de la création de la notification' };
    }
  }, [user?.ID_USER]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refreshNotifications,
    markNotificationsAsViewed,
    createNotification
  };
};
