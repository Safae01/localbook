import React, { useState } from 'react';

export default function UserProfile({ user, onBack }) {
  const [isFollowing, setIsFollowing] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  // Vérifier si l'utilisateur existe
  if (!user) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>Utilisateur non trouvé</p>
        <button 
          onClick={onBack}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retour
        </button>
      </div>
    );
  }

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSavePost = (postId) => {
    // Logique pour sauvegarder un post
    console.log('Post sauvegardé:', postId);
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Si user.posts est un état ou une prop modifiable, mettez à jour les likes
      if (user && user.posts) {
        // Créez une copie de user pour ne pas modifier directement la prop
        const updatedUser = {
          ...user,
          posts: user.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1
              };
            }
            return post;
          })
        };
        
        // Si vous avez une fonction pour mettre à jour l'utilisateur, utilisez-la ici
        // Par exemple: setUser(updatedUser) ou onUserUpdate(updatedUser)
      }
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  const handleUserClick = (userId) => {
    // Si vous avez une fonction pour naviguer vers le profil d'un utilisateur
    // fournie par les props, utilisez-la
    if (props.onNavigateToUser) {
      props.onNavigateToUser(userId);
    } else {
      // Sinon, vous pouvez implémenter une logique par défaut
      console.log("Navigation vers le profil de l'utilisateur:", userId);
      // Par exemple, si vous utilisez React Router:
      // history.push(`/user/${userId}`);
    }
  };

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <button 
            onClick={onBack}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
            aria-label="Retour"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Profil de {user.name}</h2>
        </div>
        
        {/* Informations du profil */}
        <div className="p-4 border-b">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              {user.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.username}</p>
              <p className="mt-2 text-gray-700">{user.bio}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Message
                </button>
                <button 
                  className={`px-4 py-1 rounded-md transition-colors ${
                    isFollowing 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                  onClick={toggleFollow}
                >
                  {isFollowing ? 'Ne plus suivre' : 'Suivre'}
                </button>
              </div>
              
              <div className="mt-4 flex space-x-6 text-sm">
                <div>
                  <span className="font-semibold">{user.posts?.length || 0}</span> publications
                </div>
                <div>
                  <span className="font-semibold">{user.followers || 245}</span> abonnés
                </div>
                <div>
                  <span className="font-semibold">{user.following || 183}</span> abonnements
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Publications */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-4">Publications</h3>
          
          {user.posts && user.posts.length > 0 ? (
            <div className="space-y-4">
              {user.posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative">
                  <button 
                    onClick={() => handleSavePost(post.id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 bg-white rounded-full p-1 shadow"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                    </svg>
                  </button>
                  
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div 
                          className="font-medium cursor-pointer hover:underline text-blue-600"
                          onClick={() => handleUserClick(post.userId || user.id)}
                        >
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">{post.time}</div>
                      </div>
                    </div>
                    
                    <p className="mt-3">{post.content}</p>
                  </div>
                  
                  {post.image && (
                    <div className="relative">
                      <img src={post.image} alt="" className="w-full h-64 object-cover" />
                      {post.video && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button className="bg-white bg-opacity-75 rounded-full p-3">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <button 
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <svg 
                            className={`w-5 h-5 ${likedPosts[post.id] ? 'text-red-600 fill-current' : 'text-gray-500'}`} 
                            fill={likedPosts[post.id] ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                          </svg>
                          <span className={likedPosts[post.id] ? 'text-red-600' : ''}>{post.likes}</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                          onClick={() => toggleComments(post.id)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Section commentaires */}
                  {showComments[post.id] && (
                    <div className="bg-gray-50 p-4 border-t">
                      <div className="mb-4 space-y-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img src="https://via.placeholder.com/40?text=User1" alt="Commentateur" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                            <div className="font-medium text-xs">Utilisateur 1</div>
                            <p className="text-sm">Super photo ! J'adore le cadrage.</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img src="https://via.placeholder.com/40?text=User2" alt="Commentateur" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                            <div className="font-medium text-xs">Utilisateur 2</div>
                            <p className="text-sm">Très beau contenu, continue comme ça !</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img src="https://via.placeholder.com/40?text=You" alt="Vous" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            className="w-full border rounded-full py-1 px-3 pr-10 text-sm" 
                            placeholder="Ajouter un commentaire..." 
                          />
                          <button className="absolute right-2 top-1 text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p>Aucune publication à afficher</p>
              <p className="text-sm mt-1">Les publications apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}







