import React, { useState } from 'react';

export default function Recommendations() {
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  
  // Fonction pour afficher/masquer les commentaires
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Fonction pour gérer les likes
  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Mettre à jour le nombre de likes dans les posts
      const updatedPosts = recommendedPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      });
      
      // Si recommendedPosts est un état, utilisez setRecommendedPosts(updatedPosts)
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  const recommendedPosts = [
    {
      id: 1,
      author: "Jean Dupuis",
      avatar: "https://via.placeholder.com/40",
      time: "il y a 3h",
      content: "Magnifique loft à louer dans le quartier des Batignolles. Entièrement rénové avec matériaux de qualité.",
      image: "https://via.placeholder.com/600x400",
      likes: 87,
      comments: 14,
      details: {
        postType: "Location",
        location: "Paris 17ème",
        durationType: "long-term",
        price: "2200",
        area: "85",
        rooms: "3",
        furnishingStatus: "equipped",
        amenities: ["Terrasse", "Parking", "Climatisation"]
      }
    },
    {
      id: 2,
      author: "Camille Lefort",
      avatar: "https://via.placeholder.com/40",
      time: "il y a 1j",
      content: "Studio étudiant disponible pour la rentrée universitaire. Proche de toutes commodités et des transports.",
      image: "https://via.placeholder.com/600x400",
      likes: 45,
      comments: 8,
      details: {
        postType: "Location",
        location: "Lyon 7ème",
        durationType: "long-term",
        price: "580",
        area: "22",
        rooms: "1",
        furnishingStatus: "equipped",
        amenities: ["Internet", "Laverie"]
      }
    },
    {
      id: 3,
      author: "Alexandre Martin",
      avatar: "https://via.placeholder.com/40",
      time: "il y a 2j",
      content: "Appartement familial avec vue mer exceptionnelle. Résidence sécurisée avec piscine et jardin.",
      image: "https://via.placeholder.com/600x400",
      video: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-4704-large.mp4",
      likes: 132,
      comments: 27,
      details: {
        postType: "Vente",
        location: "Nice",
        price: "520000",
        area: "110",
        rooms: "4",
        furnishingStatus: "unfurnished",
        amenities: ["Piscine", "Vue mer", "Balcon"]
      }
    },
    {
      id: 4,
      author: "Émilie Rousseau",
      avatar: "https://via.placeholder.com/40",
      time: "il y a 3j",
      content: "Maison de campagne rénovée à 1h de Paris. Idéal pour télétravailleurs cherchant le calme.",
      image: "https://via.placeholder.com/600x400",
      likes: 76,
      comments: 19,
      details: {
        postType: "Vente",
        location: "Eure-et-Loir",
        price: "320000",
        area: "140",
        rooms: "5",
        furnishingStatus: "unfurnished",
        amenities: ["Jardin", "Dépendance", "Fibre optique"]
      }
    }
  ];

  const handleSavePost = (id) => {
    console.log(`Enregistrer le post ${id}`);
    // Logique pour enregistrer un post
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Recommandations pour vous</h1>
        
        <div className="space-y-6">
          
          {recommendedPosts.map(post => (
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
                        <p className="text-sm">Très intéressant, merci du partage !</p>
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
      </div>
    </main>
  );
}















