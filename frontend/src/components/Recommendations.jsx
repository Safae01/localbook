import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AnnonceService from '../services/AnnonceService';
import LikeService from '../services/LikeService';
import SavedPostService from '../services/SavedPostService';
import CommentService from '../services/CommentService';
import UserProfile from './UserProfile';

export default function Recommendations() {  const { user } = useAuth();
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  // États pour le modal des médias
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentMedia, setCurrentMedia] = useState({ type: null, src: null });

  // Fonction pour afficher le profil d'un utilisateur
  const showUserProfile = (userId, userName, userAvatar) => {
    const userObj = {
      id: userId,
      name: userName,
      username: userName,
      avatar: userAvatar,
      bio: `Profil de ${userName}`,
      status: 'offline'
    };
    setSelectedUser(userObj);
  };

  // Fonction pour revenir aux recommandations
  const backToRecommendations = () => {
    setSelectedUser(null);
  };

  // Fonctions pour gérer le modal des médias
  const openMediaModal = (type, src) => {
    setCurrentMedia({ type, src });
    setShowMediaModal(true);
  };

  const closeMediaModal = () => {
    setShowMediaModal(false);
    setCurrentMedia({ type: null, src: null });
  };

  const fetchRecommendedPosts = async () => {
    try {
      let response;
      if (user) {
        response = await AnnonceService.getRecommendedPosts(user.ID_USER);
      } else {
        response = await AnnonceService.getRecommendedPosts();
      }
      
      if (response.status === 'success') {
        console.log('📝 Posts recommandés reçus:', response.data);
        response.data.forEach((post, index) => {
          console.log(`Post ${index + 1}:`, {
            id: post.id,
            image: post.image,
            images: post.images,
            video: post.video
          });
        });

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

  // Fonctions pour la suppression de commentaires
  const confirmDeleteComment = (commentId, postId) => {
    setCommentToDelete({ commentId, postId });
    setShowDeleteCommentModal(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete || !user) return;

    const { commentId, postId } = commentToDelete;

    try {
      console.log('Suppression du commentaire:', commentId, 'par utilisateur:', user.ID_USER);
      const result = await CommentService.deleteComment(commentId, user.ID_USER);

      if (result.success) {
        console.log('Commentaire supprimé avec succès');

        // Supprimer le commentaire de l'état local
        setComments(prev => {
          const updatedComments = { ...prev };
          if (updatedComments[postId]) {
            updatedComments[postId] = updatedComments[postId].filter(
              comment => comment.ID_COMMENT !== commentId
            );
          }
          return updatedComments;
        });

        // Mettre à jour le nombre de commentaires dans les posts recommandés
        setRecommendedPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comment_count: Math.max(0, (parseInt(post.comment_count) || 0) - 1)
            };
          }
          return post;
        }));

        // Fermer le modal
        setShowDeleteCommentModal(false);
        setCommentToDelete(null);
      } else {
        console.error('Erreur lors de la suppression du commentaire:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteCommentModal(false);
    setCommentToDelete(null);
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

  // Si un utilisateur est sélectionné, afficher son profil
  if (selectedUser) {
    return <UserProfile user={selectedUser} onBack={backToRecommendations} />;
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
                    <div
                      className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                      onClick={() => showUserProfile(post.user_id, post.username, `http://localhost/localbook/backend/api/Uploads/users/${post.profile_photo}`)}
                    >
                      <img
                        src={`http://localhost/localbook/backend/api/Uploads/users/${post.profile_photo}`}
                        alt={post.username}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                      />
                    </div>
                    <div>
                      <div
                        className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => showUserProfile(post.user_id, post.username, `http://localhost/localbook/backend/api/Uploads/users/${post.profile_photo}`)}
                      >
                        {post.username}
                      </div>
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

                {/* Images et vidéos avec nouveau layout */}
                <div className="px-3">
                  {/* Images en haut */}
                  {post.images && post.images.length > 0 && (
                    <div className="flex w-full gap-1 flex-wrap mb-3"> {/* Images avec marge en bas */}
                      {post.images.map((image, index) => (
                        <div
                          key={"img-" + index}
                          className={`overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer h-60 ${
                            post.images.length === 1 ? 'w-full' :
                            post.images.length === 2 ? 'w-[calc(50%-2px)]' :
                            post.images.length === 3 ? 'w-[calc(33.333%-3px)]' :
                            'w-[calc(25%-3px)]'
                          }`}
                          onClick={() => openMediaModal('image', `http://localhost/localbook/backend/api/Uploads/posts/${image}`)}
                        >
                          <img
                            src={`http://localhost/localbook/backend/api/Uploads/posts/${image}`}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover bg-gray-100"
                            onError={(e) => {
                              console.log('❌ Erreur de chargement image:', image);
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                            }}
                            onLoad={() => {
                              console.log('✅ Image chargée avec succès:', image);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vidéo en pleine largeur en dessous */}
                  {post.video && (
                    <div className="w-full">
                      <div
                        className="overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer w-full h-80"
                        onClick={() => openMediaModal('video', `http://localhost/localbook/backend/api/Uploads/posts/${post.video}`)}
                      >
                        <video
                          src={`http://localhost/localbook/backend/api/Uploads/posts/${post.video}`}
                          className="w-full h-full object-cover bg-black"
                          controls
                          onError={() => {
                            console.log('❌ Erreur de chargement vidéo:', post.video);
                          }}
                          onLoadedData={() => {
                            console.log('✅ Vidéo chargée avec succès:', post.video);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

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
                              <div className="flex justify-between items-start">
                                <div
                                  className="font-medium text-xs text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                  onClick={() => showUserProfile(comment.ID_USER, comment.AUTHOR_NAME, comment.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${comment.AUTHOR_AVATAR}` : "https://via.placeholder.com/32")}
                                >
                                  {comment.AUTHOR_NAME}
                                </div>
                                {/* Bouton de suppression - visible uniquement pour les commentaires de l'utilisateur actuel */}
                                {user && comment.ID_USER === user.ID_USER && (
                                  <button
                                    onClick={() => confirmDeleteComment(comment.ID_COMMENT, post.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                    title="Supprimer ce commentaire"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{comment.CONTENT}</p>
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

      {/* Modal pour afficher les médias en grand */}
      {showMediaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeMediaModal}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Bouton fermer */}
            <button
              onClick={closeMediaModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenu du modal */}
            <div
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentMedia.type === 'image' ? (
                <img
                  src={currentMedia.src}
                  alt="Image agrandie"
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  onClick={closeMediaModal}
                />
              ) : currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression de commentaire */}
      {showDeleteCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Supprimer le commentaire
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={cancelDeleteComment}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="flex-1 bg-red-600 border border-transparent rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteComment}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















