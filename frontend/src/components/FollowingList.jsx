import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import FollowService from '../services/FollowService';
import { useAuth } from '../context/AuthContext';

export default function FollowingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [unfollowingIds, setUnfollowingIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        // Vérifiez que user.ID_USER est bien défini
        if (!user || !user.ID_USER) {
          setError('Utilisateur non identifié');
          setLoading(false);
          return;
        }

        console.log('Fetching following for user ID:', user.ID_USER);
        const response = await FollowService.getFollowing(user.ID_USER);
        console.log('API response:', response);
        
        if (response.success) {
          setFollowing(response.following);
        } else {
          setError(response.error || 'Erreur lors du chargement');
        }
      } catch (err) {
        console.error('Error fetching following:', err);
        setError('Échec du chargement de la liste');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.ID_USER) {
      fetchFollowing();
    } else {
      setLoading(false); // Arrêter le chargement si pas d'utilisateur
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }



  // Use the actual following data from the API
  const following_data = following;

  // Filtrer les personnes suivies en fonction de la recherche
  const filteredFollowing = (following_data || []).filter(
    person => person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour afficher le profil d'un utilisateur
  const showUserProfile = (user) => {
    setSelectedUser(user);
  };

  // Fonction pour revenir à la liste des personnes suivies
  const backToList = () => {
    setSelectedUser(null);
  };

  // Fonction pour ne plus suivre un utilisateur
  const handleUnfollow = async (followedUser) => {
    try {
      console.log('Unfollowing user:', followedUser);

      // Réinitialiser les messages
      setError(null);
      setSuccessMessage(null);

      // Ajouter l'ID à la liste des utilisateurs en cours de suppression
      setUnfollowingIds(prev => new Set([...prev, followedUser.id]));

      const response = await FollowService.unfollow(user.ID_USER, followedUser.id);

      if (response.success) {
        // Supprimer l'utilisateur de la liste locale
        setFollowing(prevFollowing =>
          prevFollowing.filter(person => person.id !== followedUser.id)
        );

        // Afficher un message de succès
        setSuccessMessage(`Vous ne suivez plus ${followedUser.name}`);

        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccessMessage(null), 3000);

        console.log('Successfully unfollowed user');
      } else {
        setError(response.error || 'Erreur lors de la suppression');
        console.error('Failed to unfollow:', response.error);
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      setError('Échec de la suppression');
    } finally {
      // Retirer l'ID de la liste des utilisateurs en cours de suppression
      setUnfollowingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(followedUser.id);
        return newSet;
      });
    }
  };

  if (selectedUser) {
    return <UserProfile user={selectedUser} onBack={backToList} />;
  }

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      {/* Message de succès */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Personnes que je suis</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                className="w-40 px-3 py-1 pl-8 text-sm border rounded-full bg-gray-50"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-2 top-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="text-xs px-2 py-1 bg-red-50 text-red-600 font-medium rounded-full">{(following || []).length}</div>
          </div>
        </div>
        
        <div className="p-2">
          {filteredFollowing.map(person => (
            <div 
              key={person.id} 
              className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => showUserProfile(person)}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-100">
                  <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                </div>
                {person.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{person.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${person.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {person.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </div>
              </div>
              <button
                className={`ml-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  unfollowingIds.has(person.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                  if (!unfollowingIds.has(person.id)) {
                    handleUnfollow(person);
                  }
                }}
                disabled={unfollowingIds.has(person.id)}
              >
                {unfollowingIds.has(person.id) ? 'Suppression...' : 'Ne plus suivre'}
              </button>
            </div>
          ))}
          
          {filteredFollowing.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Aucune personne trouvée
            </div>
          )}
        </div>
      </div>
    </main>
  );
}





