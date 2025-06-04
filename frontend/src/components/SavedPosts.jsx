import React, { useState } from 'react';

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([
    {
      id: 1,
      author: "Jean Dupont",
      avatar: "https://via.placeholder.com/40",
      time: "Enregistré le 15 mai 2023",
      content: "Appartement lumineux avec vue sur la Seine. Disponible à partir du 1er juin.",
      image: "https://via.placeholder.com/600x400",
      likes: 245,
      comments: 32,
      details: {
        postType: "Location",
        location: "Paris 16ème",
        durationType: "monthly",
        price: "1800",
        area: "65",
        rooms: "3",
        furnishingStatus: "furnished",
        amenities: ["Balcon", "Parking", "Ascenseur"]
      }
    },
    {
      id: 2,
      author: "Marie Lefebvre",
      avatar: "https://via.placeholder.com/40",
      time: "Enregistré le 10 mai 2023",
      content: "Studio disponible immédiatement dans le quartier du Marais. Idéal pour étudiant ou jeune actif.",
      image: "https://via.placeholder.com/600x400",
      likes: 124,
      comments: 18,
      details: {
        postType: "Location",
        location: "Paris 4ème",
        durationType: "long-term",
        price: "950",
        area: "28",
        rooms: "1",
        furnishingStatus: "equipped",
        amenities: ["Cuisine équipée", "Internet"]
      }
    },
    {
      id: 3,
      author: "Sophie Bernard",
      avatar: "https://via.placeholder.com/40",
      time: "Enregistré le 5 mai 2023",
      content: "Maison familiale avec jardin à vendre. Proche des écoles et des commerces. Quartier calme et résidentiel.",
      image: "https://via.placeholder.com/600x400",
      video: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-4704-large.mp4",
      likes: 312,
      comments: 45,
      details: {
        postType: "Vente",
        location: "Bordeaux",
        price: "450000",
        area: "120",
        rooms: "5",
        furnishingStatus: "unfurnished",
        amenities: ["Jardin", "Garage", "Cave"]
      }
    }
  ]);

  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleRemoveSavedPost = (id) => {
    console.log(`Retirer le post ${id} des enregistrements`);
    // Logique pour retirer un post des enregistrements
    setSavedPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Mettre à jour le nombre de likes dans les posts sauvegardés
      setSavedPosts(savedPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Annonces enregistrées</h1>
        
        {savedPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-500">Aucune annonce enregistrée</h3>
            <p className="text-gray-500 mt-1">Les annonces que vous enregistrez apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-6">
            {savedPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative">
                <button 
                  onClick={() => handleRemoveSavedPost(post.id)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-600 bg-white rounded-full p-1 shadow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                  </svg>
                </button>
                
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">{post.author}</div>
                      <div className="text-xs text-gray-500">{post.time}</div>
                    </div>
                  </div>
                  
                  {post.details && (
                    <div className="mt-3 mb-3 py-2 border-y border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.details.postType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {post.details.location}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {post.details.price}€{post.details.durationType === 'monthly' ? '/mois' : ''}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {post.details.area}m²
                        </span>
                      </div>
                    </div>
                  )}
                  
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
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveSavedPost(post.id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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
        )}
      </div>
    </main>
  );
}














