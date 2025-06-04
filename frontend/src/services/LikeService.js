const API_BASE_URL = 'http://localhost/localbook/backend/api';

class LikeService {
  /**
   * Toggle like/unlike pour un post
   * @param {number} userId - ID de l'utilisateur
   * @param {number} postId - ID du post
   * @returns {Promise<Object>} Résultat de l'opération
   */
  static async toggleLike(userId, postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/toggle.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du toggle like');
      }

      return {
        success: true,
        action: data.action,
        isLiked: data.isLiked,
        totalLikes: data.totalLikes,
        message: data.message
      };
    } catch (error) {
      console.error('Erreur LikeService.toggleLike:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupérer le statut de like d'un utilisateur pour un post
   * @param {number} userId - ID de l'utilisateur
   * @param {number} postId - ID du post
   * @returns {Promise<Object>} Statut du like
   */
  static async getLikeStatus(userId, postId) {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/get.php?userId=${userId}&postId=${postId}`, {
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
        throw new Error(data.error || 'Erreur lors de la récupération du statut');
      }

      return {
        success: true,
        isLiked: data.isLiked,
        totalLikes: data.totalLikes
      };
    } catch (error) {
      console.error('Erreur LikeService.getLikeStatus:', error);
      return {
        success: false,
        error: error.message,
        isLiked: false,
        totalLikes: 0
      };
    }
  }

  /**
   * Récupérer les likes pour plusieurs posts
   * @param {number} userId - ID de l'utilisateur
   * @param {Array<number>} postIds - Array des IDs des posts
   * @returns {Promise<Object>} Statuts des likes pour tous les posts
   */
  static async getMultipleLikeStatus(userId, postIds) {
    try {
      const promises = postIds.map(postId => this.getLikeStatus(userId, postId));
      const results = await Promise.all(promises);
      
      const likesStatus = {};
      postIds.forEach((postId, index) => {
        likesStatus[postId] = {
          isLiked: results[index].isLiked,
          totalLikes: results[index].totalLikes
        };
      });

      return {
        success: true,
        likesStatus
      };
    } catch (error) {
      console.error('Erreur LikeService.getMultipleLikeStatus:', error);
      return {
        success: false,
        error: error.message,
        likesStatus: {}
      };
    }
  }
}

export default LikeService;
