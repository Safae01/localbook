const API_BASE_URL = 'http://localhost/localbook/backend/api';

class NotificationService {
  /**
   * Récupérer les notifications d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} limit - Nombre de notifications à récupérer (défaut: 20)
   * @param {number} offset - Décalage pour la pagination (défaut: 0)
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async getNotifications(userId, limit = 20, offset = 0) {
    try {
      const url = `${API_BASE_URL}/notifications/get.php?user_id=${userId}&limit=${limit}&offset=${offset}`;
      console.log('Fetching notifications from:', url);

      const response = await fetch(url);
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Notifications data received:', data);
      return data;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return {
        success: false,
        error: 'Error getting notifications: ' + (error.message || 'Unknown error'),
        notifications: []
      };
    }
  }

  /**
   * Créer une nouvelle notification
   * @param {number} userFrom - ID de l'utilisateur qui fait l'action
   * @param {number} userTo - ID de l'utilisateur qui reçoit la notification
   * @param {number} postId - ID du post concerné (optionnel)
   * @param {string} type - Type de notification ('like', 'comment', 'follow', 'mention')
   * @param {string} message - Message de la notification
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async createNotification(userFrom, userTo, postId, type, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_from: userFrom,
          user_to: userTo,
          post_id: postId,
          type: type,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: 'Error creating notification: ' + (error.message || 'Unknown error')
      };
    }
  }

  /**
   * Marquer les notifications comme vues
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async markNotificationsAsViewed(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark_viewed.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking notifications as viewed:', error);
      return {
        success: false,
        error: 'Error marking notifications as viewed: ' + (error.message || 'Unknown error')
      };
    }
  }

  /**
   * Formater le temps écoulé depuis une date
   * @param {string} dateString - Date au format ISO
   * @returns {string} Temps écoulé formaté
   */
  static formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'à l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes}min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days}j`;
    }
  }
}

export default NotificationService;
