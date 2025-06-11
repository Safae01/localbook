import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AnnonceService from '../services/AnnonceService';
import LikeService from '../services/LikeService';
import SavedPostService from '../services/SavedPostService';
import CommentService from '../services/CommentService';

export default function Recommendations() {  const { user } = useAuth();
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const fetchRecommendedPosts = async () => {
    try {
      let response;
      if (user) {
        response = await AnnonceService.getRecommendedPosts(user.ID_USER);
      } else {
        response = await AnnonceService.getRecommendedPosts();
      }
      
      if (response.status === 'success') {
        setRecommendedPosts(response.data);
        // Initialiser l'état des posts sauvegardés à partir des données reçues
        const savedStates = {};
        response.data.forEach(post => {
          savedStates[post.id] = post.is_saved === '1' || post.is_saved === true;
        });
        setSavedPosts(savedStates);
      } else {
        setError('Erreur lors du chargement des recommandations');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des recommandations');
    } finally {
      setLoading(false);
    }
  };

  // Charger les posts au montage et quand l'utilisateur change
  useEffect(() => {
    fetchRecommendedPosts();
  }, [user]);

  const handleSavePost = async (postId) => {
    if (!user) return;
    
    try {
      const isCurrentlySaved = savedPosts[postId];
      
      // Mettre à jour l'UI immédiatement
      setSavedPosts(prev => ({
        ...prev,
        [postId]: !isCurrentlySaved
      }));
      
      // Appeler l'API
      const result = isCurrentlySaved 
        ? await SavedPostService.unsavePost(user.ID_USER, postId)
        : await SavedPostService.savePost(user.ID_USER, postId);
      
      if (!result.success) {
        // Restaurer l'état précédent en cas d'erreur
        setSavedPosts(prev => ({
          ...prev,
          [postId]: isCurrentlySaved
        }));
        console.error('Save error:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Restaurer l'état précédent en cas d'erreur
      setSavedPosts(prev => ({
        ...prev,
        [postId]: savedPosts[postId]
      }));
    }
  };
  const toggleComments = (postId) => {
    const willShow = !showComments[postId];
    setShowComments(prev => ({
      ...prev,
      [postId]: willShow
    }));

    // Charger les commentaires si on ouvre la section et qu'ils ne sont pas déjà chargés
    if (willShow && (!comments[postId] || comments[postId].length === 0)) {
      loadComments(postId);
    }
  };
  const loadComments = async (postId) => {
    if (!user) {
      alert('Vous devez être connecté pour voir les commentaires');
      return;
    }
    
    try {
      const result = await CommentService.getComments(postId);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [postId]: result.comments
        }));
      } else {
        console.error('Erreur lors du chargement des commentaires:', result.error);
        alert('Erreur lors du chargement des commentaires');
        // Close the comments section if loading failed
        setShowComments(prev => ({
          ...prev,
          [postId]: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      alert('Erreur lors du chargement des commentaires');
      // Close the comments section if loading failed
      setShowComments(prev => ({
        ...prev,
        [postId]: false
      }));
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

    if (!commentText[postId]) return;

    const text = commentText[postId].trim();
    if (!text) return;

    try {
      const result = await CommentService.addComment(user.ID_USER, postId, text);
      
      if (result.success) {
        // Ajouter le nouveau commentaire à la liste
        const newComment = {
          ...result.comment,
          AUTHOR_NAME: user.NOM,
          AUTHOR_AVATAR: user.IMG_PROFIL,
          TIME_AGO: "à l'instant"
        };
        
        setComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }));
        
        // Réinitialiser le champ de texte
        setCommentText(prev => ({
          ...prev,
          [postId]: ''
        }));
        
        // Mettre à jour le nombre de commentaires dans les posts
        setRecommendedPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comment_count: (parseInt(post.comment_count) || 0) + 1
            };
          }
          return post;
        }));
      } else {
        console.error('Erreur lors de l\'ajout du commentaire:', result.error);
        alert('Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire');
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) return;

    try {
      const result = await LikeService.toggleLike(user.ID_USER, postId);
      if (result.success) {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        
        setRecommendedPosts(posts => 
          posts.map(post => {
            if (post.id === postId) {
              const newLikeCount = likedPosts[postId] 
                ? parseInt(post.like_count) - 1 
                : parseInt(post.like_count) + 1;
              return { ...post, like_count: newLikeCount };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  // Removed duplicate handleAddComment function since we're using handleSubmitComment

  if (loading) {
    return <div className="p-4">Chargement des recommandations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto"> {/* Augmenté de max-w-2xl à max-w-3xl */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Posts Recommandés</h1>
        
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des recommandations...</span>
            </div>
          ) : (
            recommendedPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden relative"> {/* Ajouté shadow-lg */}
                {/* Bouton de sauvegarde */}
                <button 
                  onClick={() => handleSavePost(post.id)}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all ${
                      savedPosts[post.id] ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <svg 
                      className="w-5 h-5" 
                      fill={savedPosts[post.id] ? "currentColor" : "none"}
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 18V5z">
                      </path>
                  </svg>
                </button>

                {/* En-tête et informations de profil */}
                <div className="p-4">
                  {/* En-tête avec infos utilisateur */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <img 
                        src={`http://localhost/localbook/backend/api/Uploads/users/${post.profile_photo}`}
                        alt={post.username}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{post.username}</div>
                      <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Description */}
                  {post.content && (
                    <p className="text-gray-700 mb-3">{post.content}</p>
                  )}

                  {/* Tags des détails */}
                  <div className="flex flex-wrap gap-2">
                    {post.type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.type}
                      </span>
                    )}
                    {post.city && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {post.city}
                      </span>
                    )}
                    {post.neighborhood && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.neighborhood}
                      </span>
                    )}
                    {post.duration && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {post.duration}
                      </span>
                    )}
                    {post.price && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.price}€
                      </span>
                    )}
                    {post.surface && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {post.surface}m²
                      </span>
                    )}
                    {post.rooms && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {post.rooms} pièces
                      </span>
                    )}
                    {post.state && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {post.state === 'equipped' || post.state === 'meuble' ? 'Meublé' : 'Non meublé'}
                      </span>
                    )}
                    {post.equipment && post.equipment.split(',').map((item, index) => (
                      item && item.trim() && (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {item.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                {/* Images et vidéos en pleine largeur */}
                {(post.image || post.video) && (
                  <div className="flex">
                    {post.image && (
                      <div className="flex-1 h-[400px]"> {/* Hauteur fixe plus grande */}
                        <img
                          src={`http://localhost/localbook/backend/api/Uploads/posts/${post.image}`}
                          alt="Post"
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "https://via.placeholder.com/600x400"}
                        />
                      </div>
                    )}
                    {post.video && (
                      <div className="flex-1 h-[400px]"> {/* Hauteur fixe plus grande */}
                        <video 
                          className="w-full h-full object-cover"
                          src={`http://localhost/localbook/backend/api/Uploads/posts/${post.video}`}
                          controls
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <button 
                        className={`flex items-center space-x-1 ${likedPosts[post.id] ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}
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
                        <span>{post.like_count || 0}</span>
                      </button>
                      <button 
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                        onClick={() => toggleComments(post.id)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span>{post.comment_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>                {/* Section commentaires */}
                {showComments[post.id] && (
                  <div className="mt-2 border-t pt-2 px-2 pb-3">
                    {/* Liste des commentaires */}
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      [...comments[post.id]]
                        .sort((a, b) => new Date(a.DATE_COMMENTS) - new Date(b.DATE_COMMENTS))
                        .map(comment => (
                          <div key={comment.ID_COMMENT} className="flex items-start space-x-2 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={comment.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${comment.AUTHOR_AVATAR}` : "https://via.placeholder.com/32"} 
                                alt={comment.AUTHOR_NAME} 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = "https://via.placeholder.com/32"}
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
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={user?.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${user.IMG_PROFIL}` : "https://via.placeholder.com/32"} 
                          alt="Vous" 
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "https://via.placeholder.com/32"}
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
    </div>
  );
}















