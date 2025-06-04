import React from 'react';

export default function FollowersList() {
  const followers = [
    { id: 1, name: 'Sophie Lefebvre', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 2, name: 'Lucas Bernard', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 3, name: 'Emma Petit', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 4, name: 'Hugo Dubois', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 5, name: 'Léa Moreau', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 6, name: 'Gabriel Roux', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 7, name: 'Camille Martin', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 8, name: 'Thomas Dubois', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 9, name: 'Julie Lambert', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 10, name: 'Nicolas Fournier', avatar: 'https://via.placeholder.com/40', status: 'offline' },
  ];

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Mes abonnés</h2>
          <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 font-medium rounded-full">{followers.length}</div>
        </div>
        
        <div className="p-2">
          {followers.map(follower => (
            <div 
              key={follower.id} 
              className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100">
                  <img src={follower.avatar} alt={follower.name} className="w-full h-full object-cover" />
                </div>
                {follower.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">{follower.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${follower.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {follower.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </div>
              </div>
              <button className="ml-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                Suivre
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

