import React, { useState, useEffect } from 'react';
import FollowService from '../services/FollowService';
import UserPostService from '../services/UserPostService';
import LikeService from '../services/LikeService';
import SavedPostService from '../services/SavedPostService';
import CommentService from '../services/CommentService';
import UserService from '../services/UserService';
import { useAuth } from '../context/AuthContext';

export default function UserProfile({ user, onBack }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [mediaModal, setMediaModal] = useState({ isOpen: false, type: null, src: null });
  const [savedPosts, setSavedPosts] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    // Fonction pour formater le numéro de téléphone et ouvrir WhatsApp
    const openWhatsApp = (contact) => {
      if (!contact.phone) {
        alert(`Aucun numéro de téléphone disponible pour ${contact.name}`);
        return;
      }
  
      // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
      let cleanPhone = contact.phone.replace(/[\s\-\(\)]/g, '');
  
      // Si le numéro commence par 0, le remplacer par +212 (indicatif Maroc)
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '+212' + cleanPhone.substring(1);
      }
      // Si le numéro ne commence pas par +, ajouter +212
      else if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+212' + cleanPhone;
      }
  
      // Créer le lien WhatsApp
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=Bonjour ${contact.name}, je vous contacte depuis Localbook.`;
  
      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappUrl, '_blank');
    };

  // Vérifier l'état de follow au chargement
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser || !user || !currentUser.ID_USER || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await FollowService.checkFollowStatus(currentUser.ID_USER, user.id);
        if (response.success) {
          setIsFollowing(response.is_following);
        } else {
          console.error('Error checking follow status:', response.error);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFollowStatus();
  }, [currentUser, user]);

  // Charger les détails complets de l'utilisateur
  useEffect(() => {
    const loadUserDetails = async () => {
      if (!user || !user.id) {
        setUserDetailsLoading(false);
        return;
      }

      try {
        setUserDetailsLoading(true);
        const response = await UserService.getUserById(user.id);

        if (response.success) {
          setUserDetails(response.user);
        } else {
          console.error('Error loading user details:', response.error);
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      } finally {
        setUserDetailsLoading(false);
      }
    };

    loadUserDetails();
  }, [user]);

  // Charger les posts de l'utilisateur
  useEffect(() => {
    const loadUserPosts = async () => {
      if (!user || !user.id) {
        setPostsLoading(false);
        return;
      }

      try {
        setPostsLoading(true);
        const response = await UserPostService.getUserPosts(user.id, currentUser?.ID_USER);

        if (response.success) {
          setPosts(response.posts);

          // Initialiser l'état des likes
          const initialLikedPosts = {};
          response.posts.forEach(post => {
            initialLikedPosts[post.id] = post.isLiked;
          });
          setLikedPosts(prev => ({ ...prev, ...initialLikedPosts }));

          // Charger l'état des sauvegardes si l'utilisateur est connecté
          if (currentUser?.ID_USER) {
            const postIds = response.posts.map(post => post.id);
            const savedResponse = await SavedPostService.checkSavedPosts(currentUser.ID_USER, postIds);
            if (savedResponse.success) {
              setSavedPosts(prev => ({ ...prev, ...savedResponse.savedPosts }));
            }
          }
        } else {
          console.error('Error loading user posts:', response.error);
        }
      } catch (error) {
        console.error('Error loading user posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadUserPosts();
  }, [user, currentUser]);

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

  // Afficher un indicateur de chargement pendant la vérification du statut de follow
  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Chargement du profil...</span>
      </div>
    );
  }

  const toggleFollow = async () => {
    if (!currentUser || !user) {
      setError('Utilisateur non connecté');
      return;
    }

    setFollowLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let response;
      if (isFollowing) {
        // Unfollow
        response = await FollowService.unfollow(currentUser.ID_USER, user.id);
        if (response.success) {
          setIsFollowing(false);
          setSuccessMessage(`Vous ne suivez plus ${user.name}`);
        } else {
          setError(response.error || 'Erreur lors de la suppression du suivi');
        }
      } else {
        // Follow
        response = await FollowService.follow(currentUser.ID_USER, user.id);
        if (response.success) {
          setIsFollowing(true);
          setSuccessMessage(`Vous suivez maintenant ${user.name}`);
        } else {
          setError(response.error || 'Erreur lors du suivi');
        }
      }

      // Effacer le message de succès après 3 secondes
      if (response.success) {
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setError('Erreur de connexion');
    } finally {
      setFollowLoading(false);
    }
  };



  const handleSavePost = async (postId) => {
    if (!currentUser) return;

    try {
      const isSaved = savedPosts[postId];
      let result;

      if (isSaved) {
        // Unsave le post
        result = await SavedPostService.unsavePost(currentUser.ID_USER, postId);
        if (result.success) {
          setSavedPosts(prev => ({
            ...prev,
            [postId]: false
          }));
          console.log('Post retiré des sauvegardes');
        }
      } else {
        // Save le post
        result = await SavedPostService.savePost(currentUser.ID_USER, postId);
        if (result.success) {
          setSavedPosts(prev => ({
            ...prev,
            [postId]: true
          }));
          console.log('Post sauvegardé avec succès');
        }
      }

      if (!result.success) {
        console.error('Erreur lors de la sauvegarde:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleLikePost = async (postId) => {
    if (!currentUser) return;

    try {
      const result = await LikeService.toggleLike(currentUser.ID_USER, postId);

      if (result.success) {
        // Mettre à jour l'état local des likes
        setLikedPosts(prev => ({
          ...prev,
          [postId]: result.isLiked
        }));

        // Mettre à jour le nombre de likes dans les posts
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: result.totalLikes
            };
          }
          return post;
        }));
      } else {
        console.error('Erreur lors du like:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const toggleComments = async (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Charger les commentaires si ce n'est pas déjà fait
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
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser || !newComment[postId]?.trim()) return;

    try {
      const result = await CommentService.addComment(currentUser.ID_USER, postId, newComment[postId]);
      if (result.success) {
        // Créer un commentaire formaté pour l'affichage immédiat
        const newCommentObj = {
          ID_COMMENT: Date.now(), // ID temporaire
          AUTHOR_NAME: currentUser.NOM,
          AUTHOR_AVATAR: currentUser.IMG_PROFIL,
          CONTENT: newComment[postId],
          TIME_AGO: 'à l\'instant'
        };

        // Ajouter le nouveau commentaire à la liste
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newCommentObj]
        }));

        // Vider le champ de commentaire
        setNewComment(prev => ({
          ...prev,
          [postId]: ''
        }));

        // Mettre à jour le nombre de commentaires
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments + 1
            };
          }
          return post;
        }));
      } else {
        console.error('Erreur lors de l\'ajout du commentaire:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const openMediaModal = (type, src) => {
    setMediaModal({ isOpen: true, type, src });
  };

  const closeMediaModal = () => {
    setMediaModal({ isOpen: false, type: null, src: null });
  };

  const confirmDeleteComment = (commentId, postId) => {
    setCommentToDelete({ commentId, postId });
    setShowDeleteCommentModal(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete || !currentUser) return;
    
    const { commentId, postId } = commentToDelete;

    try {
      console.log('Suppression du commentaire:', commentId, 'par utilisateur:', currentUser.ID_USER);
      const result = await CommentService.deleteComment(commentId, currentUser.ID_USER);
      
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

        // Mettre à jour le nombre de commentaires
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: Math.max(0, post.comments - 1)
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

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      {/* Message de succès */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
              {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Afficher le bouton Contacter uniquement pour les propriétaires et intermédiaires */}
                {userDetails && (userDetails.STATUT === 'proprietaire' || userDetails.STATUT === 'intermediaire') && (
                  <button
                    onClick={() => openWhatsApp({
                      name: user.name,
                      phone: userDetails?.TELE || null
                    })}
                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Contacter
                  </button>
                )}
                <button
                  className={`px-4 py-1 rounded-md transition-colors ${
                    followLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isFollowing
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                  onClick={toggleFollow}
                  disabled={followLoading || loading}
                >
                  {followLoading
                    ? (isFollowing ? 'Suppression...' : 'Ajout...')
                    : (isFollowing ? 'Ne plus suivre' : 'Suivre')
                  }
                </button>
              </div>

              <div className="mt-4 flex space-x-6 text-sm">
                <div>
                  <span className="font-semibold">{posts.length}</span> publications
                </div>
                <div>
                  <span className="font-semibold">{user.followers || 0}</span> abonnés
                </div>
                <div>
                  <span className="font-semibold">{user.following || 0}</span> abonnements
                </div>
              </div>
            </div>
          </div>

          {/* Informations détaillées de l'utilisateur */}
          {userDetailsLoading ? (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : userDetails && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Statut */}
                {userDetails.STATUT && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">Statut :</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        userDetails.STATUT === 'proprietaire' ? 'bg-green-100 text-green-800' :
                        userDetails.STATUT === 'intermediaire' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userDetails.STATUT}
                      </span>
                    </div>
                  </div>
                )}

                {/* Ville */}
                {userDetails.VILLE && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">Ville :</span>
                      <span className="ml-2 text-gray-600">{userDetails.VILLE}</span>
                    </div>
                  </div>
                )}

                {/* Email */}
                {userDetails.EMAIL && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">Email :</span>
                      <span className="ml-2 text-gray-600">{userDetails.EMAIL}</span>
                    </div>
                  </div>
                )}

                {/* Téléphone - uniquement pour propriétaires et intermédiaires */}
                {userDetails.TELE && (userDetails.STATUT === 'proprietaire' || userDetails.STATUT === 'intermediaire') && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">Téléphone :</span>
                      <span className="ml-2 text-gray-600">{userDetails.TELE}</span>
                    </div>
                  </div>
                )}

                {/* Date d'inscription */}
                {userDetails.DATE_INSCRIPTION && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">Membre depuis :</span>
                      <span className="ml-2 text-gray-600">{new Date(userDetails.DATE_INSCRIPTION).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                )}

                {/* Numéro CIN - uniquement pour propriétaires et intermédiaires */}
                {userDetails.CIN_NUM && (userDetails.STATUT === 'proprietaire' || userDetails.STATUT === 'intermediaire') && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd"></path>
                    </svg>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">CIN :</span>
                      <span className="ml-2 text-gray-600">{userDetails.CIN_NUM}</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
        
        {/* Publications */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-4">Publications</h3>

          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
                  {/* En-tête du post */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{post.author}</div>
                        <div className="text-xs text-gray-500">{post.time}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSavePost(post.id)}
                      className={`z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all ${
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
                  </div>

                 

                  {/* Tags colorés pour les détails de l'annonce */}
                  {post.details && (
                    <div className="px-4 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {post.details.postType && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.details.postType}
                          </span>
                        )}
                        {post.details.location && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {post.details.location}
                          </span>
                        )}
                        {post.details.quartier && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {post.details.quartier}
                          </span>
                        )}
                        {post.details.price && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {Number(post.details.price).toLocaleString()}€
                          </span>
                        )}
                        {post.details.area && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {post.details.area}m²
                          </span>
                        )}
                        {post.details.rooms && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {post.details.rooms} pièces
                          </span>
                        )}
                        {post.details.furnishingStatus && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                            {post.details.furnishingStatus === 'Meublé' ? 'Meublé' : 'Non meublé'}
                          </span>
                        )}
                        {post.details.equipment && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            {post.details.equipment}
                          </span>
                        )}
                        {post.details.duration && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {post.details.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
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
                            onClick={() => openMediaModal('image', image)}
                          >
                            <img
                              src={image}
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
                          onClick={() => openMediaModal('video', post.video)}
                        >
                          <video
                            src={post.video}
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
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          className={`flex items-center space-x-2 transition-colors ${
                            likedPosts[post.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
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
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                          onClick={() => toggleComments(post.id)}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                      </div>
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
                                <div className="flex justify-between items-start">
                                  <div
                                    className="font-medium text-xs text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => handleUserClick(comment.ID_USER)}
                                  >
                                    {comment.AUTHOR_NAME}
                                  </div>
                                  {/* Bouton de suppression - visible uniquement pour les commentaires de l'utilisateur actuel */}
                                  {currentUser && comment.ID_USER === currentUser.ID_USER && (
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
                                <p className="text-xs text-gray-500 mt-1">{comment.TIME_AGO}</p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Aucun commentaire pour le moment</p>
                      )}
                      
                      {/* Formulaire d'ajout de commentaire */}
                      <div className="flex items-center space-x-2 mt-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img 
                            src={currentUser?.IMG_PROFIL || "https://via.placeholder.com/40?text=You"} 
                            alt="Vous" 
                            className="w-full h-full object-cover" 
                            onError={(e) => e.target.src = "https://via.placeholder.com/40?text=You"}
                          />
                        </div>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            className="w-full border rounded-full py-1 px-3 pr-10 text-sm" 
                            placeholder="Ajouter un commentaire..." 
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          />
                          <button 
                            className="absolute right-2 top-1 text-blue-500"
                            onClick={() => handleAddComment(post.id)}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-lg font-medium">Aucune publication</p>
              <p className="text-sm mt-1">Cet utilisateur n'a pas encore publié de contenu</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour les médias */}
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

              {mediaModal.type === 'image' ? (
                <img
                  src={mediaModal.src}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={mediaModal.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                />
              )}
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
    </main>
  );
}

