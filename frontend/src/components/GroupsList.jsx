import React, { useState } from 'react';

export default function GroupsList() {
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const groups = [
    {
      id: 1,
      name: "Amateurs d'immobilier",
      members: 1250,
      image: "https://via.placeholder.com/100",
      posts: [
        {
          id: 101,
          author: "Marie Dupont",
          avatar: "https://via.placeholder.com/40",
          time: "il y a 3h",
          content: "Je viens de visiter un appartement incroyable dans le 6ème arrondissement !",
          image: "https://via.placeholder.com/600x400",
          likes: 24,
          comments: 7,
          details: {
            postType: "Appartement",
            location: "Paris 6ème",
            price: "1450",
            area: "65",
            durationType: "monthly"
          }
        },
        {
          id: 102,
          author: "Thomas Martin",
          avatar: "https://via.placeholder.com/40",
          time: "il y a 1j",
          content: "Quelqu'un connaît un bon agent immobilier sur Lyon ?",
          likes: 5,
          comments: 12,
          details: {
            postType: "Recherche",
            location: "Lyon",
            price: "",
            area: "",
            durationType: ""
          }
        }
      ]
    },
    {
      id: 2,
      name: "Propriétaires et locataires",
      members: 3420,
      image: "https://via.placeholder.com/100",
      posts: [
        {
          id: 201,
          author: "Sophie Dubois",
          avatar: "https://via.placeholder.com/40",
          time: "il y a 5h",
          content: "Conseils pour réduire sa facture d'électricité pendant l'hiver",
          image: "https://via.placeholder.com/600x400",
          likes: 45,
          comments: 18,
          details: {
            postType: "Conseil",
            location: "",
            price: "",
            area: "",
            durationType: ""
          }
        },
        {
          id: 202,
          author: "Lucas Bernard",
          avatar: "https://via.placeholder.com/40",
          time: "il y a 2j",
          content: "Problème d'humidité dans mon appartement, comment le résoudre ?",
          likes: 12,
          comments: 23,
          details: {
            postType: "Question",
            location: "Nantes",
            price: "",
            area: "42",
            durationType: ""
          }
        }
      ]
    },
    {
      id: 3,
      name: "Investisseurs immobiliers",
      members: 890,
      image: "https://via.placeholder.com/100",
      posts: [
        {
          id: 301,
          author: "Pierre Moreau",
          avatar: "https://via.placeholder.com/40",
          time: "il y a 1j",
          content: "Rendement locatif moyen dans le centre de Paris en 2023",
          image: "https://via.placeholder.com/600x400",
          likes: 32,
          comments: 15,
          details: {
            postType: "Investissement",
            location: "Paris Centre",
            price: "",
            area: "",
            durationType: ""
          }
        }
      ]
    }
  ];

  // Créer une liste plate de tous les posts avec leur groupe associé
  const allPosts = groups.flatMap(group => 
    group.posts.map(post => ({
      ...post,
      groupName: group.name,
      groupImage: group.image,
      groupMembers: group.members
    }))
  );

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Mettre à jour le nombre de likes dans les posts
      const updatedGroups = groups.map(group => ({
        ...group,
        posts: group.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isLiked ? post.likes - 1 : post.likes + 1
            };
          }
          return post;
        })
      }));
      
      // Mettre à jour les groupes
      // Note: Si vous avez un état pour les groupes, utilisez setGroups(updatedGroups)
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Groupes</h1>
        <div className="space-y-6">
          {allPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative">
              <button 
                className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 bg-white rounded-full p-1 shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                </svg>
              </button>
              
              <div className="p-4">
                {/* Informations du groupe */}
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-gray-300 overflow-hidden">
                    <img src={post.groupImage} alt={post.groupName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-blue-600">{post.groupName}</div>
                    <div className="text-xs text-gray-500">{post.groupMembers} membres</div>
                  </div>
                </div>
                
                {/* Informations de l'auteur */}
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
                      {post.details.postType && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.details.postType}
                        </span>
                      )}
                      {post.details.location && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {post.details.location}
                        </span>
                      )}
                      {post.details.price && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {post.details.price}€{post.details.durationType === "monthly" ? "/mois" : ""}
                        </span>
                      )}
                      {post.details.area && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {post.details.area}m²
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="mt-3">{post.content}</p>
              </div>
              
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-4 border-t border-gray-100">
              
              
              {/* Boutons d'action */}
              
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















