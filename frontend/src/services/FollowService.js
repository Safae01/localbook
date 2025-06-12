const API_URL = 'http://localhost/localbook/backend/api';

class FollowService {
    static async getFollowing(userId) {
        try {
            const response = await fetch(`${API_URL}/users/get_following.php?user_id=${userId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting following list:', error);
            return {
                success: false,
                error: 'Error getting following list: ' + (error.message || 'Unknown error'),
                following: []
            };
        }
    }

    static async getFollowers(userId) {
        try {
            const response = await fetch(`${API_URL}/users/get_followers.php?user_id=${userId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting followers list:', error);
            return {
                success: false,
                error: 'Error getting followers list: ' + (error.message || 'Unknown error'),
                followers: []
            };
        }
    }

    static async unfollow(followerId, followedId) {
        try {
            const response = await fetch(`${API_URL}/users/unfollow.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    follower_id: followerId,
                    followed_id: followedId
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error unfollowing user:', error);
            return {
                success: false,
                error: 'Error unfollowing user: ' + (error.message || 'Unknown error')
            };
        }
    }

    static async follow(followerId, followedId) {
        try {
            const response = await fetch(`${API_URL}/users/follow.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    follower_id: followerId,
                    followed_id: followedId
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error following user:', error);
            return {
                success: false,
                error: 'Error following user: ' + (error.message || 'Unknown error')
            };
        }
    }

    static async checkFollowStatus(followerId, followedId) {
        try {
            const response = await fetch(`${API_URL}/users/check_follow.php?follower_id=${followerId}&followed_id=${followedId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error checking follow status:', error);
            return {
                success: false,
                error: 'Error checking follow status: ' + (error.message || 'Unknown error')
            };
        }
    }
}

export default FollowService;
