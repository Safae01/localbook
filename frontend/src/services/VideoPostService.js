const API_URL = 'http://localhost/localbook/backend/api';

class VideoPostService {
    static async getVideoPosts(currentUserId = null, limit = 20, offset = 0) {
        try {
            let url = `${API_URL}/videos/get_video_posts.php?limit=${limit}&offset=${offset}`;
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
            console.error('Error getting video posts:', error);
            return { 
                success: false, 
                error: 'Error getting video posts: ' + (error.message || 'Unknown error'),
                posts: [],
                total: 0,
                has_more: false
            };
        }
    }
}

export default VideoPostService;
