import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AnnonceService from '../services/AnnonceService';
import LikeService from '../services/LikeService';
import CommentService from '../services/CommentService';
import SavedPostService from '../services/SavedPostService';
import StoryService from '../services/StoryService';
import StoryViewer from './StoryViewer';
import UserProfile from './UserProfile';

export default function Feed({ searchQuery }) {
  const { user } = useAuth();

  // Générer l'URL de l'image de profil
  const profileImageUrl = user?.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${user.IMG_PROFIL}` : "https://via.placeholder.com/40";
  const [showPostForm, setShowPostForm] = useState(false);
  const [postType, setPostType] = useState('');
  const [location, setLocation] = useState('');
  const [quartier, setQuartier] = useState('');
  const [durationType, setDurationType] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [furnishingStatus, setFurnishingStatus] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentMedia, setCurrentMedia] = useState({ type: null, src: null });
  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [savedPosts, setSavedPosts] = useState({}); // Pour suivre l'état des posts sauvegardés
  const [storyPreview, setStoryPreview] = useState(null); // Nouvel état pour l'aperçu de story
  const [stories, setStories] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  // Données des posts - chargées depuis l'API
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Charger les annonces au montage du composant
  useEffect(() => {
    loadAnnonces();
  }, []);

  // Ajouter ce nouvel useEffect pour initialiser les posts sauvegardés
  useEffect(() => {
    const initializeSavedPosts = async () => {
      if (user && posts.length > 0) {
        const postIds = posts.map(post => post.id);
        const result = await SavedPostService.checkSavedPosts(user.ID_USER, postIds);
        if (result.success) {
          setSavedPosts(result.savedPosts);
        }
      }
    };

    initializeSavedPosts();
  }, [user, posts]);

  // Charger les stories au montage du composant
  useEffect(() => {
    loadStories();
  }, []);

  // Effet pour filtrer les posts selon la recherche
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      // Diviser la requête en mots-clés individuels
      const keywords = searchQuery.toLowerCase().trim().split(/\s+/).filter(keyword => keyword.length > 0);

      const filtered = posts.filter(post => {
        // Pour qu'un post soit inclus, il doit correspondre à TOUS les mots-clés
        return keywords.every(keyword => {
          // Recherche dans le nom de l'auteur
          if (post.author && post.author.toLowerCase().includes(keyword)) {
            return true;
          }

          // Recherche dans le contenu/description
          if (post.content && post.content.toLowerCase().includes(keyword)) {
            return true;
          }

          // Recherche dans les détails du post
          if (post.details) {
            const details = post.details;

            // Type de logement
            if (details.postType && details.postType.toLowerCase().includes(keyword)) {
              return true;
            }

            // Ville
            if (details.location && details.location.toLowerCase().includes(keyword)) {
              return true;
            }

            // Quartier
            if (details.quartier && details.quartier.toLowerCase().includes(keyword)) {
              return true;
            }

            // Prix (recherche numérique)
            if (details.price && details.price.toString().includes(keyword)) {
              return true;
            }

            // Surface
            if (details.area && details.area.toString().includes(keyword)) {
              return true;
            }

            // Nombre de pièces
            if (details.rooms && details.rooms.toString().includes(keyword)) {
              return true;
            }

            // État du meuble
            if (details.furnishingStatus && details.furnishingStatus.toLowerCase().includes(keyword)) {
              return true;
            }

            // Équipements
            if (details.amenities && Array.isArray(details.amenities)) {
              const amenitiesMatch = details.amenities.some(amenity =>
                amenity && amenity.toLowerCase().includes(keyword)
              );
              if (amenitiesMatch) {
                return true;
              }
            }
          }

          // Si aucun champ ne correspond à ce mot-clé, retourner false
          return false;
        });
      });

      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

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

  // Fonction pour revenir au feed
  const backToFeed = () => {
    setSelectedUser(null);
  };

  const loadAnnonces = async () => {
    setLoading(true);
    try {
      const result = await AnnonceService.getAnnonces();
      if (result.success) {
        // Transformer les annonces en format posts pour l'affichage
        const transformedPosts = result.annonces.map(annonce => ({
          id: annonce.ID_ANNONCE || annonce.ID_POST,
          userId: annonce.ID_USER,
          author: annonce.AUTEUR_NOM,
          avatar: annonce.AUTEUR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${annonce.AUTEUR_AVATAR}` : "https://via.placeholder.com/40",
          time: annonce.TIME_AGO,
          content: annonce.DESCRIPTION || annonce.CONTENT_SUMMARY,
          // Support des images multiples
          images: annonce.IMAGES && annonce.IMAGES.length > 0
            ? annonce.IMAGES.map(img => AnnonceService.getImageUrl(img))
            : (annonce.POST_IMG ? [AnnonceService.getImageUrl(annonce.POST_IMG)] : []),
          // Garde l'image unique pour compatibilité
          image: annonce.POST_IMG ? AnnonceService.getImageUrl(annonce.POST_IMG) :
                 (annonce.IMAGES && annonce.IMAGES.length > 0 ? AnnonceService.getImageUrl(annonce.IMAGES[0]) : null),
          video: annonce.POST_VID ? AnnonceService.getVideoUrl(annonce.POST_VID) :
                 (annonce.VIDEO ? AnnonceService.getVideoUrl(annonce.VIDEO) : null),
          likes: annonce.LIKES_COUNT || 0,
          comments: annonce.COMMENTS_COUNT || 0,
          details: {
            postType: annonce.TYPE_LOC || annonce.TYPE_ANNONCE,
            location: annonce.VILLE || annonce.LOCALISATION,
            quartier: annonce.QUARTIER,
            price: annonce.PRIX,
            area: annonce.SURFACE || annonce.SUPERFICIE,
            rooms: annonce.NBRE_PIECE || annonce.NB_PIECES,
            furnishingStatus: annonce.ETAT || annonce.STATUT_MEUBLE,
            durationType: annonce.DUREE || annonce.TYPE_DUREE,
            amenities: annonce.EQUIPEMENTS ? (Array.isArray(annonce.EQUIPEMENTS) ? annonce.EQUIPEMENTS : annonce.EQUIPEMENTS.split(',')) : []
          }
        }));

        // Debug: Afficher les posts transformés
        console.log('📝 Posts transformés:', transformedPosts);
        transformedPosts.forEach((post, index) => {
          console.log(`Post ${index + 1}:`, {
            id: post.id,
            author: post.author,
            images: post.images,
            video: post.video
          });
        });

        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadStories = async () => {
    try {
      const result = await StoryService.getStories();
      if (result.success) {
        const transformedStories = result.stories.map(story => ({
          id: story.ID_STORY,
          userId: story.ID_USER,
          author: story.AUTHOR_NAME || "Utilisateur",
          avatar: story.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${story.AUTHOR_AVATAR}` : "https://via.placeholder.com/40",
          image: StoryService.getStoryUrl(story.CONTENT),
          time: story.DATE_STORY
        }));
        setStories(transformedStories);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stories:', error);
    }
  };

  // Données utilisateur réelles
  const userProfile = {
    name: user ? user.NOM : "Utilisateur",
    avatar: profileImageUrl
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Réinitialiser les erreurs quand l'utilisateur ajoute des images
    if (files.length > 0) {
      setErrors(prev => ({ ...prev, images: null }));
    }

    // Validation des fichiers
    const maxSize = 15 * 1024 * 1024; // 15MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      console.log(`Fichier ${i + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2)
      });

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: `Le fichier "${file.name}" n'est pas un type d'image valide. Types autorisés: JPG, PNG, GIF, WebP` }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, images: `Le fichier "${file.name}" est trop grand (${(file.size / 1024 / 1024).toFixed(2)}MB). Taille maximum: 15MB` }));
        return;
      }
    }

    // Sauvegarder les vrais fichiers pour l'upload
    setImageFiles([...imageFiles, ...files]);

    // Créer les prévisualisations
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageSrcs => {
      setImages([...images, ...imageSrcs]);
    });
  };

  const handleVideoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Réinitialiser les erreurs quand l'utilisateur ajoute une vidéo
      setErrors(prev => ({ ...prev, video: null }));

      // Sauvegarder le vrai fichier pour l'upload
      setVideoFile(file);

      // Créer la prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(item => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== DÉBUT VALIDATION ===');
    console.log('imageFiles:', imageFiles);
    console.log('videoFile:', videoFile);
    console.log('errors avant:', errors);

    // Réinitialiser les erreurs
    setErrors({});

    if (!user) {
      alert('Vous devez être connecté pour créer une annonce');
      return;
    }

    // Validation obligatoire : au moins une image ou une vidéo
    console.log('Validation - imageFiles.length:', imageFiles.length, 'videoFile:', videoFile);
    if (imageFiles.length === 0 && !videoFile) {
      console.log('❌ VALIDATION ÉCHOUÉE - aucun média');
      const newErrors = {
        images: 'Au moins une image est requise',
        video: 'Ou au moins une vidéo est requise'
      };
      console.log('Setting errors:', newErrors);
      setErrors(newErrors);
      console.log('=== ARRÊT - ERREURS DÉFINIES ===');
      return;
    }
    console.log('✅ VALIDATION RÉUSSIE - médias présents');

    setLoading(true);

    try {
      // Préparer les données du post
      const postData = {
        ID_USER: user.ID_USER,
        TYPE_LOC: postType,
        VILLE: location,
        QUARTIER: quartier || null,
        DESCRIPTION: description,
        PRIX: price,
        SURFACE: area || null,
        NBRE_PIECE: rooms || null,
        DUREE: durationType === 'courte' ? 'courte durée' : 'longue durée',
        ETAT: furnishingStatus === 'equipped' ? 'meuble' : 'non_meuble',
        equipements: amenities
      };

      // Créer le post via l'API
      const result = await AnnonceService.createAnnonce(postData, imageFiles, videoFile);

      if (result.success) {
        // Recharger les annonces pour afficher la nouvelle
        await loadAnnonces();

        // Réinitialisation du formulaire
        setPostType('');
        setLocation('');
        setQuartier('');
        setDurationType('');
        setPrice('');
        setArea('');
        setRooms('');
        setFurnishingStatus('');
        setAmenities([]);
        setImages([]);
        setImageFiles([]);
        setVideo(null);
        setVideoFile(null);
        setDescription('');

        // Fermer le formulaire après soumission
        setShowPostForm(false);

        alert('Annonce créée avec succès !');
      } else {
        alert('Erreur lors de la création de l\'annonce: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      alert('Erreur lors de la création de l\'annonce');
    } finally {
      setLoading(false);
    }
  };  
 const handleSavePost = async (postId) => {
    if (!user) return;
    
    try {
        const isCurrentlySaved = savedPosts[postId];
        const result = isCurrentlySaved 
            ? await SavedPostService.unsavePost(user.ID_USER, postId)
            : await SavedPostService.savePost(user.ID_USER, postId);
        
        if (result.success) {
            setSavedPosts(prev => ({
                ...prev,
                [postId]: !isCurrentlySaved
            }));
            
            // Ajouter un retour visuel
            const message = isCurrentlySaved 
                ? 'Post retiré des sauvegardes'
                : 'Post sauvegardé';
            console.log(message);
        } else {
            console.error('Toggle save error:', result.error);
        }
    } catch (error) {
        console.error('Erreur lors de la gestion de la sauvegarde:', error);
    }
};

  const toggleComments = (postId) => {
    const willShow = !showComments[postId];
    
    setShowComments(prev => ({
      ...prev,
      [postId]: willShow
    }));
    
    // Charger les commentaires si on ouvre la section
    if (willShow && (!comments[postId] || comments[postId].length === 0)) {
      loadComments(postId);
    }
  };

  const openStoryViewer = (index) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  // Fonction pour gérer le clic sur l'utilisateur dans les stories
  const handleStoryUserClick = (story) => {
    // Fermer le story viewer
    setShowStoryViewer(false);
    // Afficher le profil utilisateur
    showUserProfile(story.userId, story.author, story.avatar);
  };

  // Ajoutez cette fonction pour gérer l'upload de story
  const handleStoryUpload = async (e) => {
    if (!user) {
        alert('Vous devez être connecté pour ajouter une story');
        return;
    }

    const file = e.target.files[0];
    if (!file) return;

    try {
        const result = await StoryService.createStory(user.ID_USER, file);
        if (result.success) {
            // Ajouter directement la nouvelle story à la liste et actualiser
            const newStory = {
                id: result.story.ID_STORY,
                userId: result.story.ID_USER || user.ID_USER,
                author: result.story.AUTHOR_NAME || user.NOM,
                avatar: result.story.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${result.story.AUTHOR_AVATAR}` : profileImageUrl,
                image: StoryService.getStoryUrl(result.story.CONTENT),
                time: result.story.DATE_STORY
            };
            setStories(prevStories => [newStory, ...prevStories]);
        } else {
            alert('Erreur lors de l\'ajout de la story: ' + result.error);
        }
    } catch (error) {
        console.error('Erreur lors de l\'upload de la story:', error);
        alert('Erreur lors de l\'upload de la story');
    }
};

  const handleLikePost = async (postId) => {
    if (!user) {
      alert('Vous devez être connecté pour liker un post');
      return;
    }

    try {
      const result = await LikeService.toggleLike(user.ID_USER, postId);

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
              likes: result.totalLikes // Utiliser le nombre total de likes retourné par l'API
            };
          }
          return post;
        }));

        console.log(result.message);
      } else {
        console.error('Erreur lors du like:', result.error);
        alert('Erreur lors du like: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      alert('Erreur lors du like');
    }
  };

  // Fonction pour ouvrir le modal des médias
  const openMediaModal = (type, src) => {
    console.log('Opening media modal:', { type, src });
    setCurrentMedia({ type, src });
    setShowMediaModal(true);
  };

  // Fonction pour fermer le modal des médias
  const closeMediaModal = () => {
    console.log('Closing media modal');
    setShowMediaModal(false);
    setCurrentMedia({ type: null, src: null });
  };

  // Fonction pour charger les commentaires d'un post
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

  // Fonction pour gérer la saisie du commentaire
  const handleCommentChange = (postId, text) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  // Fonction pour envoyer un commentaire
  const handleSubmitComment = async (postId) => {
    if (!user) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const result = await CommentService.addComment(user.ID_USER, postId, text);

      if (result.success) {
        // Ajouter le nouveau commentaire à la liste
        setComments(prev => ({
          ...prev,
          [postId]: [result.comment, ...(prev[postId] || [])]
        }));

        // Réinitialiser le champ de texte
        setCommentText(prev => ({
          ...prev,
          [postId]: ''
        }));

        // Mettre à jour le nombre de commentaires dans les posts
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: (post.comments || 0) + 1
            };
          }
          return post;
        }));
      } else {
        alert('Erreur lors de l\'ajout du commentaire: ' + result.error);
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

  // Si un utilisateur est sélectionné, afficher son profil
  if (selectedUser) {
    return <UserProfile user={selectedUser} onBack={backToFeed} />;
  }

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-32 h-48 rounded-xl bg-gray-100 relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors">
            <input
              type="file"
              id="story-upload"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleStoryUpload}
            />
            <label htmlFor="story-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Ajouter une story</span>
            </label>
          </div>
        </div>
        
        {/* Existing stories */}
        {stories.map((story, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-32 h-48 rounded-xl bg-gray-300 relative overflow-hidden cursor-pointer"
            onClick={() => openStoryViewer(index)}
          >            <img src={story.image} alt={`Story ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-x-0 top-0 p-2 bg-gradient-to-b from-black to-transparent">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden">
                  <img
                    src={story.avatar}
                    alt={`User ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                  />
                </div>
                <div className="text-white text-sm font-medium truncate">{story.author}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = "https://via.placeholder.com/40"}
            />
          </div>
          <input 
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm" 
            placeholder="Ajoutez votre annonce immobilière..." 
            onClick={() => setShowPostForm(true)}
            readOnly
          />
        </div>
        <div className="border-t pt-3 flex justify-center">
          <button 
            className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => setShowPostForm(true)}
          >
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>ajouter une Annonce immobilière</span>
          </button>
        </div>
      </div>



      {/* Posts avec le même format que SavedPosts */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement des annonces...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? (
              <>
                <p className="text-lg">Aucun résultat pour "{searchQuery}"</p>
                <p className="text-sm mt-2">Essayez avec d'autres mots-clés</p>
              </>
            ) : (
              <>
                <p>Aucune annonce disponible pour le moment.</p>
                <p className="text-sm mt-2">Soyez le premier à publier une annonce !</p>
              </>
            )}
          </div>
        ) : (
          filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative">
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
            
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                  onClick={() => showUserProfile(post.userId, post.author, post.avatar)}
                >
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                  />
                </div>
                <div>
                  <div
                    className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => showUserProfile(post.userId, post.author, post.avatar)}
                  >
                    {post.author}
                  </div>
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {post.details.location}
                      </span>
                    )}
                    {post.details.quartier && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.details.quartier}
                      </span>
                    )}
                    {post.details.durationType && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {post.details.durationType}
                      </span>
                    )}
                    {post.details.price && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {post.details.price}€
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
                        {post.details.furnishingStatus === 'equipped' || post.details.furnishingStatus === 'meuble' ? 'Meublé' : 'Non meublé'}
                      </span>
                    )}
                    {post.details.amenities && post.details.amenities.length > 0 && post.details.amenities.map((amenity, index) => (
                      amenity && amenity.trim() && (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {amenity.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {post.content && (
                <div className="mt-3 mb-3 px-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>
                </div>
              )}
            </div>

            {/* Images et vidéos */}
            <div className="px-3"> {/* Padding horizontal uniquement */}
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
                    <span>{post.likes}</span>
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
                
              </div>
            </div>
            
            {/* Section commentaires */}
            {showComments[post.id] && (
              <div className="mt-2 border-t pt-2 px-2 pb-3"> {/* Ajout du padding bottom */}
                {/* Liste des commentaires */}
                {comments[post.id] && comments[post.id].length > 0 ? (
                  [...comments[post.id]]
                    .sort((a, b) => new Date(a.DATE_COMMENTS) - new Date(b.DATE_COMMENTS))
                    .map(comment => (
                      <div key={comment.ID_COMMENT} className="flex items-start space-x-2 mb-2"> {/* Ajout d'un mb-2 pour l'espacement vertical */}
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={comment.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${comment.AUTHOR_AVATAR}` : "https://via.placeholder.com/40"}
                            alt={comment.AUTHOR_NAME}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                          />
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div
                              className="font-medium text-xs text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => showUserProfile(comment.ID_USER, comment.AUTHOR_NAME, comment.AUTHOR_AVATAR)}
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
                      src={profileImageUrl}
                      alt="Vous"
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = "https://via.placeholder.com/40"}
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
      
      {/* Modal pour créer une annonce */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
          {/* En-tête */}
          <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Créer une annonce immobilière</h2>
              <button 
                className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
                onClick={() => setShowPostForm(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Contenu du formulaire */}
              <div className="space-y-6 mb-8">
                {/* Bloc utilisateur */}
                <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-blue-300">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 flex items-center">
                      {userProfile.name}
                      <svg className="w-5 h-5 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div className="text-sm text-blue-600">Compte vérifié</div>
                  </div>
                </div>
                
                {/* Type de bien */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type de bien</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-3 pr-10 py-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none transition-colors hover:border-blue-300"
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="maison">Maison</option>
                      <option value="appartement">Appartement</option>
                      <option value="chambre">Chambre</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Localisation */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">ville</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Paris, Tanger"
                    required
                  />
                </div>
                
                {/* Quartier */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quartier</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    placeholder="Ex: Bastille, Birchifa"
                    required
                  />
                </div>
                
                {/* Durée */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type de location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-3 rounded-xl border ${durationType === 'courte' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer hover:border-blue-300 transition-colors`}>
                      <input 
                        type="radio" 
                        name="durationType" 
                        value="courte" 
                        checked={durationType === 'courte'}
                        onChange={() => setDurationType('courte')}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">nuit</span>
                    </label>
                    <label className={`relative flex items-center p-3 rounded-xl border ${durationType === 'longue' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer hover:border-blue-300 transition-colors`}>
                      <input 
                        type="radio" 
                        name="durationType" 
                        value="longue" 
                        checked={durationType === 'longue'}
                        onChange={() => setDurationType('longue')}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">mois</span>
                    </label>
                  </div>
                </div>
                
                {/* Prix */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Prix (Dh)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 800"
                    required
                  />
                </div>
                
                {/* Surface */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ex: 45"
                    required
                  />
                </div>
                
                {/* Nombre de pièces */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre de pièces</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    placeholder="Ex: 3"
                    required
                  />
                </div>
                
                {/* Équipé ou non */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">État du bien</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex items-center p-4 rounded-xl border ${furnishingStatus === 'equipped' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer hover:border-blue-300 transition-colors`}>
                      <input 
                        type="radio" 
                        name="furnishingStatus" 
                        value="equipped" 
                        checked={furnishingStatus === 'equipped'}
                        onChange={() => setFurnishingStatus('equipped')}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        required
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">Équipé/Meublé</span>
                        <span className="block text-xs text-gray-500">Prêt à emménager</span>
                      </div>
                    </label>
                    <label className={`relative flex items-center p-4 rounded-xl border ${furnishingStatus === 'notEquipped' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer hover:border-blue-300 transition-colors`}>
                      <input 
                        type="radio" 
                        name="furnishingStatus" 
                        value="notEquipped" 
                        checked={furnishingStatus === 'notEquipped'}
                        onChange={() => setFurnishingStatus('notEquipped')}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-700">Non équipé/Non meublé</span>
                        <span className="block text-xs text-gray-500">À aménager</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Équipements */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Équipements</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center space-x-2 ${amenities.includes('wifi') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('wifi')}
                        onChange={() => handleAmenityToggle('wifi')}
                      />
                      <span>Wi-Fi</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${amenities.includes('parking') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('parking')}
                        onChange={() => handleAmenityToggle('parking')}
                      />
                      <span>Parking</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${amenities.includes('garage') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('garage')}
                        onChange={() => handleAmenityToggle('garage')}
                      />
                      <span>Garage</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${amenities.includes('terrasse') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('terrasse')}
                        onChange={() => handleAmenityToggle('terrasse')}
                      />
                      <span>Terrasse</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${amenities.includes('ascenseur') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('ascenseur')}
                        onChange={() => handleAmenityToggle('ascenseur')}
                      />
                      <span>Ascenseur</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${amenities.includes('salleDeSport') ? 'text-blue-600' : 'text-gray-600'}`}>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={amenities.includes('salleDeSport')}
                        onChange={() => handleAmenityToggle('salleDeSport')}
                      />
                      <span>Salle de sport</span>
                    </label>
                  </div>
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    placeholder="Décrivez votre bien immobilier..."
                    required
                  ></textarea>
                </div>
                {/* Images */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Images <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 font-normal">(Au moins une image ou une vidéo requise)</span>
                  </label>
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 justify-center -mt-1 pb-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative w-20 h-20">
                          <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            onClick={() => {
                              setImages(images.filter((_, i) => i !== index));
                              setImageFiles(imageFiles.filter((_, i) => i !== index));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Télécharger des fichiers</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            multiple
                            onChange={handleImageUpload}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP jusqu'à 15MB</p>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-1 font-bold border border-red-300 p-2 bg-red-50 rounded">
                      ❌ {errors.images}
                    </p>
                  )}
                </div>
                
                {/* Vidéo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vidéo <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 font-normal">(Ou au moins une image requise)</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed hover:border-blue-400 rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Télécharger une vidéo</span>
                          <input id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/*" onChange={handleVideoUpload} />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">MP4, MOV jusqu'à 100MB</p>
                    </div>
                  </div>
                  {video && (
                    <div className="mt-2 flex justify-center -mt-1 pb-4">
                      <div className="relative w-full max-w-md">
                        <video src={video} controls className="w-full h-48 object-cover rounded"></video>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => {
                            setVideo(null);
                            setVideoFile(null);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.video && (
                    <p className="text-red-500 text-sm mt-1 font-bold border border-red-300 p-2 bg-red-50 rounded">
                      ❌ {errors.video}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showStoryViewer && (
        <StoryViewer
          stories={stories}
          initialIndex={currentStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          onUserClick={handleStoryUserClick}
        />
      )}

      {/* Modal pour afficher les médias en grand */}
      {showMediaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeMediaModal}
        >
          <div
            className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={closeMediaModal}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenu du modal */}
            <div className="w-full h-full flex items-center justify-center">
              {currentMedia.type === 'image' && (
                <img
                  src={currentMedia.src}
                  alt="Image agrandie"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={closeMediaModal}
                />
              )}

              {currentMedia.type === 'video' && (
                <video
                  src={currentMedia.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-lg"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75">
              Cliquez n'importe où pour fermer
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
