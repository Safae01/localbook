import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import AnnonceService from '../services/AnnonceService';
import LikeService from '../services/LikeService';
import CommentService from '../services/CommentService';
import StoryService from '../services/StoryService';
import AdminStoryViewer from './AdminStoryViewer';

export default function AdminFeed({ searchQuery }) {
  const { admin, deletePost, deleteComment, deleteStory } = useAdmin();

  const [showComments, setShowComments] = useState({});
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Modals de confirmation
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [showDeleteStoryModal, setShowDeleteStoryModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadAnnonces();
    loadStories();
  }, []);

  // Effet pour filtrer les posts selon la recherche
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const keywords = searchQuery.toLowerCase().trim().split(/\s+/).filter(keyword => keyword.length > 0);
      const filtered = posts.filter(post => {
        return keywords.every(keyword => {
          if (post.author && post.author.toLowerCase().includes(keyword)) return true;
          if (post.content && post.content.toLowerCase().includes(keyword)) return true;
          if (post.details) {
            const details = post.details;
            if (details.postType && details.postType.toLowerCase().includes(keyword)) return true;
            if (details.location && details.location.toLowerCase().includes(keyword)) return true;
            if (details.quartier && details.quartier.toLowerCase().includes(keyword)) return true;
          }
          return false;
        });
      });
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

  const loadAnnonces = async () => {
    setLoading(true);
    try {
      const result = await AnnonceService.getAnnonces();
      if (result.success) {
        const transformedPosts = result.annonces.map(annonce => ({
          id: annonce.ID_ANNONCE || annonce.ID_POST,
          userId: annonce.ID_USER,
          author: annonce.AUTEUR_NOM,
          avatar: annonce.AUTEUR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${annonce.AUTEUR_AVATAR}` : "https://via.placeholder.com/40",
          time: annonce.TIME_AGO,
          content: annonce.DESCRIPTION || annonce.CONTENT_SUMMARY,
          images: annonce.IMAGES && annonce.IMAGES.length > 0
            ? annonce.IMAGES.map(img => AnnonceService.getImageUrl(img))
            : (annonce.POST_IMG ? [AnnonceService.getImageUrl(annonce.POST_IMG)] : []),
          video: annonce.POST_VID ? AnnonceService.getVideoUrl(annonce.POST_VID) : null,
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

  const loadComments = async (postId) => {
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
  };

  const toggleComments = (postId) => {
    const willShow = !showComments[postId];
    setShowComments(prev => ({
      ...prev,
      [postId]: willShow
    }));
    
    if (willShow && (!comments[postId] || comments[postId].length === 0)) {
      loadComments(postId);
    }
  };

  const openStoryViewer = (index) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  // Fonctions de suppression admin
  const confirmDeletePost = (postId) => {
    setItemToDelete({ type: 'post', id: postId });
    setShowDeletePostModal(true);
  };

  const confirmDeleteComment = (commentId, postId) => {
    setItemToDelete({ type: 'comment', id: commentId, postId });
    setShowDeleteCommentModal(true);
  };

  const confirmDeleteStory = (storyId) => {
    setItemToDelete({ type: 'story', id: storyId });
    setShowDeleteStoryModal(true);
  };

  const handleDeletePost = async () => {
    if (!itemToDelete || !admin) return;

    try {
      const result = await deletePost(itemToDelete.id);
      if (result.success) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== itemToDelete.id));
        setShowDeletePostModal(false);
        setItemToDelete(null);
        alert('Post supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const handleDeleteComment = async () => {
    if (!itemToDelete || !admin) return;

    try {
      const result = await deleteComment(itemToDelete.id);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [itemToDelete.postId]: prev[itemToDelete.postId].filter(comment => comment.ID_COMMENT !== itemToDelete.id)
        }));
        setShowDeleteCommentModal(false);
        setItemToDelete(null);
        alert('Commentaire supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const handleDeleteStory = async () => {
    if (!itemToDelete || !admin) return;

    try {
      const result = await deleteStory(itemToDelete.id);
      if (result.success) {
        setStories(prevStories => prevStories.filter(story => story.id !== itemToDelete.id));
        setShowDeleteStoryModal(false);
        setItemToDelete(null);
        alert('Story supprimée avec succès !');
      } else {
        alert('Erreur lors de la suppression : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la story:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const cancelDelete = () => {
    setShowDeletePostModal(false);
    setShowDeleteCommentModal(false);
    setShowDeleteStoryModal(false);
    setItemToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Section Stories avec boutons de suppression admin */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Stories (Mode Admin)</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {stories.map((story, index) => (
            <div key={story.id} className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 p-0.5 cursor-pointer"
                onClick={() => openStoryViewer(index)}
              >
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <img
                    src={story.avatar}
                    alt={story.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-1 truncate w-16">{story.author}</p>
              {/* Bouton de suppression admin pour story */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeleteStory(story.id);
                }}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                title="Supprimer cette story"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Posts avec boutons de suppression admin */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'Aucun post trouvé pour cette recherche.' : 'Aucun post disponible.'}
        </div>
      ) : (
        filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden relative border-l-4 border-red-500">
            {/* Bouton de suppression admin pour post */}
            <button
              onClick={() => confirmDeletePost(post.id)}
              className="absolute top-3 right-3 z-10 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 shadow-lg"
              title="Supprimer ce post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>

            {/* En-tête du post */}
            <div className="p-4 pb-2">
              <div className="flex items-center space-x-3">
                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
            </div>

            {/* Détails du post */}
            {post.details && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {post.details.postType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.details.postType}
                    </span>
                  )}
                  {post.details.location && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {post.details.location}
                    </span>
                  )}
                  {post.details.price && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {post.details.price}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contenu du post */}
            {post.content && (
              <div className="px-4 pb-2">
                <p className="text-gray-800">{post.content}</p>
              </div>
            )}

            {/* Images et vidéos - même affichage que Feed.jsx */}
            <div className="px-3">
              {/* Images en haut */}
              {post.images && post.images.length > 0 && (
                <div className="flex w-full gap-1 flex-wrap mb-3">
                  {post.images.map((image, index) => (
                    <div
                      key={"img-" + index}
                      className={`overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer h-60 ${
                        post.images.length === 1 ? 'w-full' :
                        post.images.length === 2 ? 'w-[calc(50%-2px)]' :
                        post.images.length === 3 ? 'w-[calc(33.333%-3px)]' :
                        'w-[calc(25%-3px)]'
                      }`}
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
                  <div className="overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer w-full h-80">
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

            {/* Actions et statistiques */}
            <div className="p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{post.likes} j'aime</span>
                <span>{post.comments} commentaires</span>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span>J'aime</span>
                </button>
                
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>Commenter</span>
                </button>
              </div>

              {/* Section commentaires avec boutons de suppression admin */}
              {showComments[post.id] && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments[post.id]?.map(comment => (
                      <div key={comment.ID_COMMENT} className="flex space-x-3 relative group">
                        <img
                          src={comment.AUTHOR_AVATAR ? `http://localhost/localbook/backend/api/Uploads/users/${comment.AUTHOR_AVATAR}` : "https://via.placeholder.com/32"}
                          alt={comment.AUTHOR_NAME}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 bg-gray-100 rounded-lg p-2">
                          <p className="font-medium text-sm">{comment.AUTHOR_NAME}</p>
                          <p className="text-sm">{comment.CONTENT}</p>
                          <p className="text-xs text-gray-500 mt-1">{comment.TIME_AGO}</p>
                        </div>
                        {/* Bouton de suppression admin pour commentaire */}
                        <button
                          onClick={() => confirmDeleteComment(comment.ID_COMMENT, post.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-opacity"
                          title="Supprimer ce commentaire"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Story Viewer Admin */}
      {showStoryViewer && (
        <AdminStoryViewer
          stories={stories}
          currentIndex={currentStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          onDeleteStory={confirmDeleteStory}
        />
      )}

      {/* Modals de confirmation */}
      {showDeletePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteComment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette story ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteStory}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
