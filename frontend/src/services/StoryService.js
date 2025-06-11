const API_URL = 'http://localhost/localbook/backend/api';

class StoryService {
    static async createStory(userId, file) {
        try {
            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('story_file', file);

            const response = await fetch(`${API_URL}/stories/create.php`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating story:', error);
            return { 
                success: false, 
                error: 'Error creating story: ' + (error.message || 'Unknown error') 
            };
        }
    }

    static async getStories() {
        try {
            const response = await fetch(`${API_URL}/stories/get.php`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting stories:', error);
            return { 
                success: false, 
                error: 'Error getting stories: ' + (error.message || 'Unknown error'),
                stories: []
            };
        }
    }

    static getStoryUrl(filename) {
        if (!filename) return '';
        return `${API_URL}/Uploads/stories/${filename}`;
    }
}

export default StoryService;