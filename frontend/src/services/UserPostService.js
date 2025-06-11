const API_URL = 'http://localhost/localbook/backend/api';

class UserPostService {
    static async getUserPosts(userId, currentUserId = null) {
        try {
            let url = `${API_URL}/users/get_posts.php?user_id=${userId}`;
            if (currentUserId) {
                url += `&current_user_id=${currentUserId}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting user posts:', error);
            return { 
                success: false, 
                error: 'Error getting user posts: ' + (error.message || 'Unknown error'),
                posts: []
            };
        }
    }
}

export default UserPostService;
