const API_BASE_URL = 'http://localhost/localbook/backend/api';

class CommentService {
  /**
   * Ajouter un commentaire à un post
   * @param {number} userId - ID de l'utilisateur
   * @param {number} postId - ID du post
   * @param {string} content - Contenu du commentaire
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async addComment(userId, postId, content) {
    try {
      console.log('Sending comment:', { userId, postId, content });
      
      const response = await fetch(`${API_BASE_URL}/comments/add.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          postId,
          content
        })
      });

      // Log response status for debugging
      console.log('Response status:', response.status);
      
      // Get response as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Réponse serveur invalide');
      }
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'ajout du commentaire');
      }

      return {
        success: true,
        comment: data.comment,
        message: data.message
      };
    } catch (error) {
      console.error('Add comment error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout du commentaire'
      };
    }
  }

  /**
   * Récupérer les commentaires d'un post
   * @param {number} postId - ID du post
   * @returns {Promise<Object>} Liste des commentaires
   */
  static async getComments(postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/get.php?postId=${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la récupération des commentaires');
      }

      return {
        success: true,
        comments: data.comments
      };
    } catch (error) {
      console.error('Get comments error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des commentaires'
      };
    }
  }

  /**
   * Supprimer un commentaire
   * @param {number} commentId - ID du commentaire
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async deleteComment(commentId, userId) {
    try {
      console.log('CommentService.deleteComment appelé avec:', commentId, userId);
      
      const response = await fetch(`${API_BASE_URL}/comments/delete.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          userId
        })
      });

      console.log('Réponse du serveur:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la suppression du commentaire');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Delete comment error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du commentaire'
      };
    }
  }
}

export default CommentService;
