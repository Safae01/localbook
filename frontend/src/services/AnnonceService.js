const API_BASE_URL = 'http://localhost/localbook/backend/api/annonces';

const AnnonceService = {
    async createAnnonce(annonceData, images, video) {
        try {
            const formData = new FormData();
            
            // Add text data
            Object.keys(annonceData).forEach(key => {
                if (annonceData[key] !== null && annonceData[key] !== undefined) {
                    if (Array.isArray(annonceData[key])) {
                        formData.append(key, JSON.stringify(annonceData[key]));
                    } else {
                        formData.append(key, annonceData[key]);
                    }
                }
            });
            
            // Add images
            if (images && images.length > 0) {
                images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            }
            
            // Add video
            if (video) {
                formData.append('video', video);
            }
            
            console.log('Sending data to API...', Object.fromEntries(formData));

            const response = await fetch(`${API_BASE_URL}/create.php`, {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const text = await response.text();
            console.log('Raw response:', text);

            try {
                const data = JSON.parse(text);
                return response.ok
                    ? { success: true, message: data.success, annonceId: data.post_id }
                    : { success: false, error: data.error };
            } catch (e) {
                console.error('Invalid JSON response:', text);
                console.error('Parse error:', e);
                return { success: false, error: 'Réponse serveur invalide: ' + text };
            }
        } catch (error) {
            console.error('Create annonce error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    async getAnnonces(userId = null, limit = 20, offset = 0) {
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });
            
            if (userId) {
                params.append('user_id', userId.toString());
            }
            
            const response = await fetch(`${API_BASE_URL}/get.php?${params}`);
            const data = await response.json();
            
            return response.ok 
                ? { success: true, annonces: data.annonces, total: data.total }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Get annonces error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    async getUserAnnonces(userId, limit = 20, offset = 0) {
        return this.getAnnonces(userId, limit, offset);
    },

    // Helper function to get image URL
    getImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/600x400?text=Pas+d\'image';
        return `http://localhost/localbook/backend/api/Uploads/posts/${imageName}`;
    },

    // Helper function to get video URL
    getVideoUrl(videoName) {
        if (!videoName) return null;
        return `http://localhost/localbook/backend/api/Uploads/posts/${videoName}`;
    }
};

export default AnnonceService;


