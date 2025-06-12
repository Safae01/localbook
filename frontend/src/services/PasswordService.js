const API_BASE_URL = 'http://localhost/localbook/backend/api';

const PasswordService = {
  async changePassword(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || `Erreur HTTP: ${response.status}` 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Mot de passe modifié avec succès' 
      };
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return { 
        success: false, 
        error: 'Erreur de connexion au serveur' 
      };
    }
  }
};

export default PasswordService;
