const API_BASE_URL = 'http://localhost/localbook/backend/api/saves';

const SavedPostService = {
    async savePost(userId, postId) {
        try {
            console.log('Attempting to save post:', { userId, postId });            const response = await fetch(`${API_BASE_URL}/save.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, post_id: postId })
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Save post response:', data);
            
            if (!response.ok) {
                console.error('Save post failed:', data.error);
            }
            return response.ok 
                ? { success: true, message: data.message }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Save post error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    async unsavePost(userId, postId) {
        try {
            console.log('Attempting to unsave post:', { userId, postId });
            const response = await fetch(`${API_BASE_URL}/unsave.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, post_id: postId })
            });
            
            const data = await response.json();
            console.log('Unsave response:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to unsave post');
            }
            
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Unsave error:', error);
            return { success: false, error: error.message || 'Erreur de connexion au serveur' };
        }
    },    async getSavedPosts(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/get.php?user_id=${userId}`);
            const data = await response.json();
            
            const transformedPosts = data.posts.map(post => ({
                id: post.ID_POST,
                author: post.AUTEUR_NOM,
                avatar: post.AUTEUR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${post.AUTEUR_AVATAR}` : null,
                time: post.TIME_AGO,
                content: post.DESCRIPTION,
                images: post.POST_IMG ? [`http://localhost/localbook/backend/api/Uploads/posts/${post.POST_IMG}`] : [],
                video: post.POST_VID ? `http://localhost/localbook/backend/api/Uploads/posts/${post.POST_VID}` : null,
                likes: parseInt(post.LIKES_COUNT) || 0,
                comments: parseInt(post.COMMENTS_COUNT) || 0,
                isLiked: post.IS_LIKED === '1',
                details: {
                    postType: post.TYPE_LOC,
                    location: post.VILLE,
                    quartier: post.QUARTIER,
                    price: post.PRIX,
                    area: post.SURFACE,
                    rooms: post.NBRE_PIECE,
                    furnishingStatus: post.ETAT,
                    durationType: post.DUREE,
                    amenities: post.EQUIPEMENT ? post.EQUIPEMENT.split(',').map(item => item.trim()) : []
                }
            }));
            
            return { success: true, posts: transformedPosts };
        } catch (error) {
            console.error('getSavedPosts error:', error);
            return { success: false, error: 'Erreur lors du chargement' };
        }
    },

    async checkIfSaved(userId, postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/check_single.php?user_id=${userId}&post_id=${postId}`);
            const data = await response.json();

            return response.ok
                ? { success: true, isSaved: data.is_saved }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Check saved status error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    async checkSavedPosts(userId, postIds) {
        try {
            const results = {};
            for (const postId of postIds) {
                const response = await this.checkIfSaved(userId, postId);
                if (response.success) {
                    results[postId] = response.isSaved;
                }
            }
            return { success: true, savedPosts: results };
        } catch (error) {
            console.error('Check saved posts error:', error);
            return { success: false, error: 'Erreur lors de la vérification des posts sauvegardés' };
        }
    },
}

export default SavedPostService;
