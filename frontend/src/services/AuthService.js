    const API_BASE_URL = 'http://localhost/localbook/backend/api/auth';

    const AuthService = {
    async register(userData, cinFile) {
        try {
        const formData = new FormData();
        formData.append('NOM', userData.NOM);
        formData.append('CIN_NUM', userData.CIN_NUM);
        formData.append('EMAIL', userData.EMAIL);
        formData.append('MDPS', userData.MDPS);
        if (cinFile) {
            formData.append('cin-file-upload', cinFile);
        }

        const response = await fetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            
            body: formData,
        });

        const text = await response.text(); // Get raw response for debugging
        try {
            const data = JSON.parse(text);
            return response.ok ? { success: true, message: data.success } : { success: false, error: data.error };
        } catch (e) {
            console.error('Invalid JSON response:', text);
            return { success: false, error: 'Réponse serveur invalide' };
        }
        } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },

    async login(credentials) {
        try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        return response.ok ? { success: true, message: data.success, user: data.user } : { success: false, error: data.error };
        } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
        }
    },
    };

    export default AuthService;