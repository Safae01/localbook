import React, { useState } from 'react';
import UserProfile from './UserProfile';

export default function FollowingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  const following = [
    { 
      id: 1, 
      name: 'Antoine Dupont', 
      avatar: 'https://via.placeholder.com/40', 
      status: 'online',
      username: '@antoine_d',
      bio: 'Passionné de technologie et de sport',
      posts: [
        { id: 1, content: 'Belle journée pour coder !', image: 'https://via.placeholder.com/600x400?text=Post+1', likes: 24, comments: 5, time: 'il y a 2h' },
        { id: 2, content: 'Nouveau projet en cours #coding #webdev', image: 'https://via.placeholder.com/600x400?text=Post+2', likes: 18, comments: 3, time: 'il y a 2j' }
      ]
    },
    { 
      id: 2, 
      name: 'Marie Laurent', 
      avatar: 'https://via.placeholder.com/40', 
      status: 'offline',
      username: '@marie_l',
      bio: 'Designer UX/UI | Amoureuse de la nature',
      posts: [
        { id: 1, content: 'Mon dernier design pour une application mobile', image: 'https://via.placeholder.com/600x400?text=Design', likes: 45, comments: 12, time: 'il y a 1j' },
        { id: 2, content: 'Randonnée du weekend #nature', image: 'https://via.placeholder.com/600x400?text=Nature', likes: 32, comments: 8, time: 'il y a 5j' }
      ]
    },
    // Autres utilisateurs avec leurs données...
    { id: 3, name: 'Paul Mercier', avatar: 'https://via.placeholder.com/40', status: 'online', username: '@paul_m', bio: 'Développeur web', posts: [] },
    { id: 4, name: 'Claire Rousseau', avatar: 'https://via.placeholder.com/40', status: 'offline', username: '@claire_r', bio: 'Photographe amateur', posts: [] },
    { id: 5, name: 'Julien Leroy', avatar: 'https://via.placeholder.com/40', status: 'online', username: '@julien_l', bio: 'Entrepreneur', posts: [] },
    { id: 6, name: 'Émilie Girard', avatar: 'https://via.placeholder.com/40', status: 'online', username: '@emilie_g', bio: 'Marketing digital', posts: [] },
    { id: 7, name: 'Thomas Morel', avatar: 'https://via.placeholder.com/40', status: 'offline', username: '@thomas_m', bio: 'Étudiant en informatique', posts: [] },
    { id: 8, name: 'Camille Fournier', avatar: 'https://via.placeholder.com/40', status: 'online', username: '@camille_f', bio: 'Voyageuse | Blogueuse', posts: [] },
  ];

  // Filtrer les personnes suivies en fonction de la recherche
  const filteredFollowing = following.filter(
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

  if (selectedUser) {
    return <UserProfile user={selectedUser} onBack={backToList} />;
  }

  return (
    <main className="flex-1 p-4 overflow-y-auto">
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
            <div className="text-xs px-2 py-1 bg-red-50 text-red-600 font-medium rounded-full">{following.length}</div>
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
                className="ml-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                }}
              >
                Ne plus suivre
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



