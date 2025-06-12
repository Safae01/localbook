import React, { useState, useEffect } from 'react';
import VideoPostService from '../services/VideoPostService';
import LikeService from '../services/LikeService';
import SavedPostService from '../services/SavedPostService';
import CommentService from '../services/CommentService';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';

export default function VideoFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [mediaModal, setMediaModal] = useState({ isOpen: false, type: null, src: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useAuth();

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

  // Fonction pour revenir au feed vidéos
  const backToVideoFeed = () => {
    setSelectedUser(null);
  };

  // Charger les posts vidéos
  useEffect(() => {
    const loadVideoPosts = async () => {
      try {
        setLoading(true);
        const response = await VideoPostService.getVideoPosts(currentUser?.ID_USER);
        
        if (response.success) {
          setPosts(response.posts);
          
          // Initialiser l'état des likes
          const initialLikedPosts = {};
          response.posts.forEach(post => {
            initialLikedPosts[post.id] = post.isLiked;
          });
          setLikedPosts(initialLikedPosts);

          // Charger l'état des sauvegardes si l'utilisateur est connecté
          if (currentUser?.ID_USER) {
            const postIds = response.posts.map(post => post.id);
            const savedResponse = await SavedPostService.checkSavedPosts(currentUser.ID_USER, postIds);
            if (savedResponse.success) {
              setSavedPosts(savedResponse.savedPosts);
            }
          }
        } else {
          setError(response.error || 'Erreur lors du chargement des vidéos');
        }
      } catch (error) {
        console.error('Error loading video posts:', error);
        setError('Erreur lors du chargement des vidéos');
      } finally {
        setLoading(false);
      }
    };

    loadVideoPosts();
  }, [currentUser]);

  // Fonction pour gérer les likes
  const handleLikePost = async (postId) => {
    if (!currentUser) return;

    try {
      const result = await LikeService.toggleLike(currentUser.ID_USER, postId);

      if (result.success) {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: result.isLiked
        }));

        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: result.totalLikes
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Fonction pour gérer les sauvegardes
  const handleSavePost = async (postId) => {
    if (!currentUser) return;

    try {
      const isSaved = savedPosts[postId];
      let result;

      if (isSaved) {
        result = await SavedPostService.unsavePost(currentUser.ID_USER, postId);
        if (result.success) {
          setSavedPosts(prev => ({
            ...prev,
            [postId]: false
          }));
        }
      } else {
        result = await SavedPostService.savePost(currentUser.ID_USER, postId);
        if (result.success) {
          setSavedPosts(prev => ({
            ...prev,
            [postId]: true
          }));
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // Fonction pour gérer les commentaires
  const toggleComments = async (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    if (!comments[postId] && !showComments[postId]) {
      try {
        const result = await CommentService.getComments(postId);
        if (result.success) {
          setComments(prev => ({
            ...prev,
            [postId]: result.comments
          }));
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
  };

  // Fonction pour ajouter un commentaire
  const handleAddComment = async (postId) => {
    if (!currentUser || !newComment[postId]?.trim()) return;

    try {
      const result = await CommentService.addComment(currentUser.ID_USER, postId, newComment[postId]);
      if (result.success) {
        const newCommentObj = {
          ID_COMMENT: Date.now(),
          AUTHOR_NAME: currentUser.NOM,
          AUTHOR_AVATAR: currentUser.IMG_PROFIL,
          CONTENT: newComment[postId],
          TIME_AGO: 'à l\'instant'
        };

        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newCommentObj]
        }));

        setNewComment(prev => ({
          ...prev,
          [postId]: ''
        }));

        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments + 1
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Fonction pour ouvrir la modal vidéo
  const openMediaModal = (type, src) => {
    setMediaModal({ isOpen: true, type, src });
  };

  // Fonction pour fermer la modal
  const closeMediaModal = () => {
    setMediaModal({ isOpen: false, type: null, src: null });
  };

  if (loading) {
    return (
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="text-center text-red-600 p-8">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  // Si un utilisateur est sélectionné, afficher son profil
  if (selectedUser) {
    return <UserProfile user={selectedUser} onBack={backToVideoFeed} />;
  }

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <p className="text-lg font-medium">Aucune vidéo disponible</p>
            <p className="text-sm mt-1">Les vidéos partagées apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="relative">
                {/* Vidéo en plein écran */}
                <div className="relative">
                  {post.video && (
                    <video
                      src={post.video}
                      className="w-full h-96 object-cover bg-black"
                      controls
                      autoPlay
                      muted
                      loop
                      onClick={() => openMediaModal('video', post.video)}
                    />
                  )}

                  {/* Overlay avec informations du profil */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => showUserProfile(post.userId, post.author, post.avatar)}
                      >
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div
                          className="font-medium text-white cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() => showUserProfile(post.userId, post.author, post.avatar)}
                        >
                          {post.author}
                        </div>
                        <div className="text-xs text-gray-200">{post.time}</div>
                      </div>
                    </div>

                    {/* Description simple */}
                    {post.content && (
                      <p className="text-white text-sm mb-2">{post.content}</p>
                    )}

                    {/* Tags colorés compacts avec tous les détails */}
                    {post.details && (
                      <div className="flex flex-wrap gap-1">
                        {post.details.postType && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/80 text-white">
                            {post.details.postType}
                          </span>
                        )}
                        {post.details.location && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/80 text-white">
                            {post.details.location}
                          </span>
                        )}
                        {post.details.quartier && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/80 text-white">
                            {post.details.quartier}
                          </span>
                        )}
                        {post.details.price && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/80 text-white">
                            {Number(post.details.price).toLocaleString()}€
                          </span>
                        )}
                        {post.details.area && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/80 text-white">
                            {post.details.area}m²
                          </span>
                        )}
                        {post.details.rooms && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/80 text-white">
                            {post.details.rooms} pièces
                          </span>
                        )}
                        {post.details.furnishingStatus && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-pink-500/80 text-white">
                            {post.details.furnishingStatus === 'Meublé' ? 'Meublé' : 'Non meublé'}
                          </span>
                        )}
                        {post.details.equipment && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-teal-500/80 text-white">
                            {post.details.equipment}
                          </span>
                        )}
                        {post.details.duration && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-500/80 text-white">
                            {post.details.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bouton save en overlay */}
                  <button
                    onClick={() => handleSavePost(post.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all ${
                      savedPosts[post.id] ? 'text-blue-400' : 'text-white'
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

                  {/* Actions en overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                    <button
                      className={`flex items-center space-x-1 transition-colors ${
                        likedPosts[post.id] ? 'text-red-400' : 'text-white hover:text-red-400'
                      }`}
                      onClick={() => handleLikePost(post.id)}
                    >
                      <svg
                        className="w-6 h-6"
                        fill={likedPosts[post.id] ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    <button
                      className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors"
                      onClick={() => toggleComments(post.id)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                  </div>
                </div>

                {/* Section commentaires (si ouverte) */}
                {showComments[post.id] && (
                  <div className="bg-white p-4 border-l-4 border-blue-500">
                    {/* Liste des commentaires */}
                    {comments[post.id] && comments[post.id].length > 0 && (
                      <div className="mb-4 space-y-3">
                        {comments[post.id].map((comment, index) => (
                          <div key={comment.ID_COMMENT || index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={comment.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${comment.AUTHOR_AVATAR}` : "https://via.placeholder.com/32"}
                                alt={comment.AUTHOR_NAME}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div
                                className="font-medium text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => showUserProfile(comment.ID_USER, comment.AUTHOR_NAME, comment.AUTHOR_AVATAR)}
                              >
                                {comment.AUTHOR_NAME}
                              </div>
                              <p className="text-sm text-gray-700 mt-1">{comment.CONTENT}</p>
                              <div className="text-xs text-gray-500 mt-1">{comment.TIME_AGO}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulaire d'ajout de commentaire */}
                    {currentUser && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={currentUser.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${currentUser.IMG_PROFIL}` : "https://via.placeholder.com/32"}
                            alt="Vous"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            className="w-full border border-gray-200 rounded-full py-2 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ajouter un commentaire..."
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({
                              ...prev,
                              [post.id]: e.target.value
                            }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                          />
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                            onClick={() => handleAddComment(post.id)}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pour les vidéos */}
      {mediaModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeMediaModal}>
          <div className="max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button 
                onClick={closeMediaModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <video 
                src={mediaModal.src} 
                controls 
                autoPlay
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
