const API_URL = 'http://localhost/localbook/backend/api';

class UserService {
    /**
     * Récupérer tous les utilisateurs de la base de données
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async getAllUsers() {
        try {
            const response = await fetch(`${API_URL}/users/get_all_users.php`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting all users:', error);
            return {
                success: false,
                error: 'Error getting all users: ' + (error.message || 'Unknown error'),
                users: []
            };
        }
    }

    /**
     * Rechercher des utilisateurs par nom
     * @param {string} searchTerm - Terme de recherche
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async searchUsers(searchTerm) {
        try {
            const response = await fetch(`${API_URL}/users/search_users.php?search=${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching users:', error);
            return {
                success: false,
                error: 'Error searching users: ' + (error.message || 'Unknown error'),
                users: []
            };
        }
    }

    /**
     * Obtenir les informations d'un utilisateur spécifique
     * @param {number} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Résultat de l'opération
     */
    static async getUserById(userId) {
        try {
            const response = await fetch(`${API_URL}/users/get_profile.php?userId=${userId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return {
                success: false,
                error: 'Error getting user: ' + (error.message || 'Unknown error'),
                user: null
            };
        }
    }
}

export default UserService;
