    const API_BASE_URL = 'http://localhost/localbook/backend/api/auth';

    const AuthService = {
    async register(userData, cinFile) {
        try {
        console.log('AuthService.register appelé avec:', userData, cinFile);

        const formData = new FormData();
        formData.append('NOM', userData.NOM);
        formData.append('CIN_NUM', userData.CIN_NUM);
        formData.append('STATUT', userData.STATUT);
        formData.append('EMAIL', userData.EMAIL);
        formData.append('MDPS', userData.MDPS);

        if (cinFile) {
            formData.append('cin-file-upload', cinFile);
            console.log('Fichier CIN ajouté au FormData:', cinFile.name);
        } else {
            console.error('Aucun fichier CIN fourni !');
        }

        // Log du contenu du FormData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await fetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            body: formData,
        });

        console.log('Statut de la réponse:', response.status);

        const text = await response.text(); // Get raw response for debugging
        console.log('Réponse brute du serveur:', text);

        try {
            const data = JSON.parse(text);
            console.log('Données parsées:', data);
            return response.ok ? { success: true, message: data.success } : { success: false, error: data.error };
        } catch (e) {
            console.error('Invalid JSON response:', text);
            return { success: false, error: 'Réponse serveur invalide: ' + text };
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