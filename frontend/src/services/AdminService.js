const API_BASE_URL = 'http://localhost/localbook/backend/api';

const AdminService = {
    // Authentification admin
    async adminLogin(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/admin-login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            return response.ok 
                ? { success: true, message: data.success, admin: data.admin } 
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Admin login error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    // Supprimer un post (admin)
    async deletePost(postId, adminId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/delete-post.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postId,
                    adminId: adminId
                })
            });

            const data = await response.json();
            return response.ok
                ? { success: true, message: data.message }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Admin delete post error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    // Supprimer un commentaire (admin)
    async deleteComment(commentId, adminId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/delete-comment.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentId: commentId,
                    adminId: adminId
                })
            });

            const data = await response.json();
            return response.ok
                ? { success: true, message: data.message }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Admin delete comment error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    // Supprimer une story (admin)
    async deleteStory(storyId, adminId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/delete-story.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storyId: storyId,
                    adminId: adminId
                })
            });

            const data = await response.json();
            return response.ok
                ? { success: true, message: data.message }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Admin delete story error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    // Supprimer un utilisateur (admin)
    async deleteUser(userId, adminId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/delete-user.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    adminId: adminId
                })
            });

            const data = await response.json();
            return response.ok
                ? { success: true, message: data.message }
                : { success: false, error: data.error };
        } catch (error) {
            console.error('Admin delete user error:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }
};

export default AdminService;
