import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SavedPostService from '../services/SavedPostService';
import LikeService from '../services/LikeService';
import CommentService from '../services/CommentService';

export default function SavedPosts() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [savedPostsMap, setSavedPostsMap] = useState({});

  useEffect(() => {
    const loadSavedPosts = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const result = await SavedPostService.getSavedPosts(user.ID_USER);
        if (result.success) {
          setSavedPosts(result.posts);
          
          // Initialiser les états likedPosts et savedPostsMap
          const likedMap = {};
          const savedMap = {};
          result.posts.forEach(post => {
            likedMap[post.id] = post.isLiked;
            savedMap[post.id] = true;
          });
          setLikedPosts(likedMap);
          setSavedPostsMap(savedMap);
        }
      } catch (error) {
        console.error('Error loading saved posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedPosts();
  }, [user]);

  const handleRemoveSavedPost = async (id) => {
    try {
      const result = await SavedPostService.unsavePost(user.ID_USER, id);
      if (result.success) {
        setSavedPosts(prevPosts => prevPosts.filter(post => post.ID_POST !== id));
        setSavedPostsMap(prev => ({
          ...prev,
          [id]: false
        }));
        alert('Post retiré des sauvegardes');
      } else {
        alert('Erreur lors du retrait du post: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors du retrait du post:', error);
      alert('Erreur lors du retrait du post');
    }
  };

  const handleToggleSave = async (id) => {
    try {
      if (savedPostsMap[id]) {
        // Désauvegarder
        const result = await SavedPostService.unsavePost(user.ID_USER, id);
        if (result.success) {
          setSavedPosts(prevPosts => prevPosts.filter(post => post.ID_POST !== id));
          setSavedPostsMap(prev => ({
            ...prev,
            [id]: false
          }));
        }
      } else {
        // Sauvegarder
        const result = await SavedPostService.savePost(user.ID_USER, id);
        if (result.success) {
          setSavedPostsMap(prev => ({
            ...prev,
            [id]: true
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) {
        alert('Vous devez être connecté pour aimer un post');
        return;
    }

    try {
        const result = await LikeService.toggleLike(user.ID_USER, postId);
        if (result.success) {
            // Mettre à jour l'état des likes
            setLikedPosts(prev => ({
                ...prev,
                [postId]: !prev[postId]
            }));

            // Mettre à jour le compteur de likes dans la liste des posts
            setSavedPosts(prevPosts => prevPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likes: post.likes + (likedPosts[postId] ? -1 : 1)
                    };
                }
                return post;
            }));
        }
    } catch (error) {
        console.error('Erreur lors du like:', error);
    }
};

  const toggleComments = async (postId) => {
    const willShow = !showComments[postId];
    
    setShowComments(prev => ({
      ...prev,
      [postId]: willShow
    }));
    
    if (willShow && (!comments[postId] || comments[postId].length === 0)) {
      await loadComments(postId);
    }
  };

  const loadComments = async (postId) => {
    try {
      const result = await CommentService.getComments(postId);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [postId]: result.comments
        }));
      } else {
        console.error('Erreur lors du chargement des commentaires:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handleSubmitComment = async (postId) => {
    if (!user) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    const text = commentText[postId];
    if (!text || text.trim() === '') return;

    try {
      const result = await CommentService.addComment(user.ID_USER, postId, text);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), result.comment]
        }));
        setCommentText(prev => ({
          ...prev,
          [postId]: ''
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Annonces enregistrées</h1>
        
        {/* Copier exactement la même structure que Feed.jsx pour l'affichage des posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des annonces...</span>
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 18V5z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-500">Aucune annonce sauvegardée</h3>
              <p className="text-gray-500 mt-1">Les annonces que vous enregistrez apparaîtront ici</p>
            </div>
          ) : (
            // Copier la structure exacte d'un post de Feed.jsx
            savedPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative">
                {/* En-tête avec avatar et nom */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        <img 
                          src={post.avatar} 
                          alt={post.author} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="font-medium">{post.author}</div>
                        <div className="text-xs text-gray-500">{post.time}</div>
                      </div>
                    </div>

                    <button onClick={() => handleToggleSave(post.id)}
                      className={`p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all ${
                        savedPostsMap[post.id] ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={savedPostsMap[post.id] ? "currentColor" : "none"}
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 18V5z" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-2 text-gray-700">{post.content}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.details.postType && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.details.postType}
                      </span>
                    )}
                    {post.details.location && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {post.details.location} {post.details.quartier && `- ${post.details.quartier}`}
                      </span>
                    )}
                    {post.details.price && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.details.price}€
                      </span>
                    )}
                    {post.details.area && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {post.details.area}m²
                      </span>
                    )}
                    {post.details.rooms && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {post.details.rooms} pièces
                      </span>
                    )}
                    {post.details.furnishingStatus && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {post.details.furnishingStatus === 'equipped' ? 'Meublé' : 'Non meublé'}
                      </span>
                    )}
                    {post.details.amenities && post.details.amenities.map((amenity, index) => (
                      amenity && (
                        <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {amenity}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                {/* Images et vidéos en miniature */}
                <div className="px-3">
                  {((post.images && post.images.length > 0) || post.video) && (
                    <div className="flex w-full gap-0">
                      {post.images && post.images.map((image, index) => (
                        <div
                          key={"img-" + index}
                          className="overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer w-72 h-60"
                          onClick={() => openMediaModal('image', image)}
                        >
                          <img
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover bg-gray-100"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                      {post.video && (
                        <div className="overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer w-72 h-60">
                          <video
                            src={post.video}
                            className="w-full h-full object-cover bg-black"
                            controls
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions - Supprimer le bouton save du bas et garder uniquement like et commentaires */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 ${
                        likedPosts[post.id] ? 'text-red-600' : 'text-gray-500'
                      } hover:text-red-600`}
                    >
                      <svg 
                          className="w-5 h-5" 
                          fill={likedPosts[post.id] ? "currentColor" : "none"} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                      >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                      </svg>
                      <span>{post.likes}</span>
                    </button>

                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>

                {/* Section commentaires */}
                {showComments[post.id] && (
                  <div className="mt-2 border-t pt-2 px-2 pb-3">
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      [...comments[post.id]]
                        .sort((a, b) => new Date(a.DATE_COMMENTS) - new Date(b.DATE_COMMENTS))
                        .map(comment => (
                          <div key={comment.ID_COMMENT} className="flex items-start space-x-2 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={comment.AUTHOR_AVATAR || "https://via.placeholder.com/40?text=User"} 
                                alt={comment.AUTHOR_NAME} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                              <div className="font-medium text-xs text-gray-800">{comment.AUTHOR_NAME}</div>
                              <p className="text-sm text-gray-700">{comment.CONTENT}</p>
                              <div className="text-xs text-gray-500 mt-1">{comment.TIME_AGO}</div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500 my-2">Aucun commentaire pour le moment</p>
                    )}
                    
                    {/* Formulaire d'ajout de commentaire */}
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={user?.IMG_PROFIL || "https://via.placeholder.com/40?text=You"} 
                          alt="Vous" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          className="w-full border rounded-full py-1 px-3 pr-10 text-sm" 
                          placeholder="Ajouter un commentaire..." 
                          value={commentText[post.id] || ''}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                        />
                        <button 
                          className="absolute right-2 top-1 text-blue-500"
                          onClick={() => handleSubmitComment(post.id)}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}














