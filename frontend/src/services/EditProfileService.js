
const API_BASE_URL = 'http://localhost/localbook/backend/api';

const EditProfileService = {
  updateProfile: async (userId, profileData, avatarFile, coverPhotoFile) => {
    try {
      const formData = new FormData();
      
      // Ajouter les données du profil correspondant à la table USER
      formData.append('NOM', profileData.name);
      formData.append('USERNAME', profileData.username);
      formData.append('BIO', profileData.bio);
      formData.append('LOCALISATION', profileData.location);
      formData.append('STATUT', profileData.status);
      formData.append('VILLE', profileData.city);
      formData.append('AGE', profileData.age);
      formData.append('DATE_NAISSANCE', profileData.birthday);
      formData.append('EMAIL', profileData.email);
      formData.append('TELE', profileData.phone);

      // Ajouter les fichiers si présents
      if (avatarFile) {
        formData.append('IMG_PROFIL', avatarFile);
      }
      if (coverPhotoFile) {
        formData.append('IMG_COUVERT', coverPhotoFile);
      }

      const response = await fetch(`${API_BASE_URL}/users/update.php?userId=${userId}`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        error: error.message || 'Erreur serveur'
      };
    }
  },
  
  getUserProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/get_profile.php?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return {
        success: false,
        error: error.message || 'Erreur serveur'
      };
    }
  },
  
  // Helper pour obtenir l'URL de l'image de profil
  getProfileImageUrl(imageName) {
    if (!imageName) return 'https://via.placeholder.com/150';
    return `http://localhost/localbook/backend/api/Uploads/${imageName}`;
  },
  
  // Helper pour obtenir l'URL de l'image de couverture
  getCoverImageUrl(imageName) {
    if (!imageName) return 'https://via.placeholder.com/1200x300';
    return `http://localhost/localbook/backend/api/Uploads/${imageName}`;
  },
};

export default EditProfileService;
