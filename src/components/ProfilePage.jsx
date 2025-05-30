import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [showMiniHeader, setShowMiniHeader] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [activeTab, setActiveTab] = useState('publications');
  const [searchFollowers, setSearchFollowers] = useState('');
  const [searchFollowing, setSearchFollowing] = useState('');
  const [showComments, setShowComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [postType, setPostType] = useState('');
  const [location, setLocation] = useState('');
  const [durationType, setDurationType] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [furnishingStatus, setFurnishingStatus] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  
  // Données du profil utilisateur
  const [userProfile, setUserProfile] = useState({
    name: "Votre Nom",
    username: "@votrenom",
    coverPhoto: "https://via.placeholder.com/1200x300",
    avatar: "https://via.placeholder.com/150",
    bio: "Développeur web passionné | Amateur de photographie | Voyageur",
    location: "Paris, France",
    joinDate: "Membre depuis Janvier 2023",
    stats: {
      posts: 42,
      followers: 128,
      following: 97
    },
    status: "Développeur Web",
    city: "Paris",
    age: 32,
    email: "votre.email@exemple.com",
    phone: "+33 6 12 34 56 78",
    website: "www.votresite.com",
    birthday: "1990-01-01",
    followers: [
      { id: 1, name: 'Sophie Lefebvre', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 2, name: 'Lucas Bernard', avatar: 'https://via.placeholder.com/40', status: 'offline' },
      { id: 3, name: 'Emma Petit', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 4, name: 'Hugo Dubois', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 5, name: 'Léa Moreau', avatar: 'https://via.placeholder.com/40', status: 'offline' },
      { id: 6, name: 'Gabriel Roux', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 7, name: 'Camille Martin', avatar: 'https://via.placeholder.com/40', status: 'offline' },
      { id: 8, name: 'Thomas Dubois', avatar: 'https://via.placeholder.com/40', status: 'online' },
    ],
    following: [
      { id: 1, name: 'Antoine Dupont', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 2, name: 'Marie Leroy', avatar: 'https://via.placeholder.com/40', status: 'offline' },
      { id: 3, name: 'Paul Durand', avatar: 'https://via.placeholder.com/40', status: 'online' },
      { id: 4, name: 'Julie Moreau', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    ]
  });
  
  // État pour stocker les modifications temporaires
  const [editedProfile, setEditedProfile] = useState({...userProfile});
  
  // État pour stocker les fichiers d'image temporaires
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  
  // Prévisualisations des images
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(userProfile.coverPhoto);

  // Filtrer les abonnés en fonction de la recherche
  const filteredFollowers = userProfile.followers.filter(
    follower => follower.name.toLowerCase().includes(searchFollowers.toLowerCase())
  );

  // Filtrer les personnes suivies en fonction de la recherche
  const filteredFollowing = userProfile.following.filter(
    person => person.name.toLowerCase().includes(searchFollowing.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowMiniHeader(true);
      } else {
        setShowMiniHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Gérer le changement d'avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer le changement de photo de couverture
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer la soumission du formulaire de modification du profil
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Mettre à jour le profil avec les nouvelles valeurs
    setUserProfile({
      ...userProfile,
      ...editedProfile,
      avatar: avatarPreview,
      coverPhoto: coverPhotoPreview
    });
    
    // Fermer le formulaire
    setShowEditProfileForm(false);
    
    // Réinitialiser les fichiers
    setAvatarFile(null);
    setCoverPhotoFile(null);
    
    console.log("Profil mis à jour:", editedProfile);
  };
  
  // Annuler les modifications et fermer le formulaire
  const handleCancelEdit = () => {
    setEditedProfile({...userProfile});
    setAvatarPreview(userProfile.avatar);
    setCoverPhotoPreview(userProfile.coverPhoto);
    setShowEditProfileForm(false);
    setAvatarFile(null);
    setCoverPhotoFile(null);
  };
  
  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleImageUpload = (e) => {
    // Simuler l'upload d'images
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleVideoUpload = (e) => {
    // Simuler l'upload de vidéo
    if (e.target.files && e.target.files[0]) {
      setVideo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Créer une nouvelle annonce
    const newPost = {
      id: Date.now(), // Utiliser timestamp comme ID unique
      author: userProfile.name, // Nom de l'utilisateur connecté
      avatar: userProfile.avatar,
      time: 'à l\'instant',
      content: `${postType} à ${location} - ${price}€/mois - ${area}m² - ${rooms} pièces - ${furnishingStatus === 'equipped' ? 'Meublé' : 'Non meublé'}`,
      image: images.length > 0 ? images[0] : null,
      video: video,
      likes: 0,
      comments: 0,
      // Ajouter les détails spécifiques à l'annonce
      details: {
        postType,
        location,
        durationType,
        price,
        area,
        rooms,
        furnishingStatus,
        amenities
      }
    };
    
    console.log("Nouvelle annonce créée:", newPost);
    
    // Réinitialiser le formulaire
    setShowPostForm(false);
    setPostType('');
    setLocation('');
    setDurationType('');
    setPrice('');
    setArea('');
    setRooms('');
    setFurnishingStatus('');
    setAmenities([]);
    setImages([]);
    setVideo(null);
  };

  // Fonction pour afficher/masquer les commentaires
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Si vous avez un état pour les posts, mettez-le à jour ici
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 relative">
      {/* Mini header qui apparaît lors du défilement */}
      {showMiniHeader && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-md py-2 px-4 z-10 flex items-center justify-between">
          <div className="w-8"></div> {/* Espace pour équilibrer */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-medium">{userProfile.name}</h2>
          </div>
          <div className="w-8"></div> {/* Espace pour équilibrer */}
        </div>
      )}

      {/* Formulaire de modification du profil */}
      {showEditProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Modifier le profil</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
                  onClick={handleCancelEdit}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              {/* Photo de couverture */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Photo de couverture</label>
                <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={coverPhotoPreview} 
                    alt="Couverture" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="bg-white text-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <span>Changer la photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleCoverPhotoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Photo de profil */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="bg-white text-gray-800 p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Cliquez sur l'image pour changer votre photo de profil
                  </div>
                </div>
              </div>
              
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Informations de base</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.status}
                      onChange={(e) => setEditedProfile({...editedProfile, status: e.target.value})}
                    >
                      <option value="Développeur Web">Développeur Web</option>
                      <option value="Étudiant">Étudiant</option>
                      <option value="Propriétaire">Propriétaire</option>
                      <option value="Agent immobilier">Agent immobilier</option>
                      <option value="Architecte">Architecte</option>
                      <option value="Designer">Designer</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.city}
                      onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.age}
                      onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value, 10)})}
                      min="18"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.birthday}
                      onChange={(e) => setEditedProfile({...editedProfile, birthday: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              {/* Coordonnées */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Coordonnées</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Form Modal - Exactement comme dans Feed */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
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
                  <label className="block text-sm font-medium text-gray-700">Localisation (ville, quartier)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Paris 11ème, Bastille"
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
                      <span className="ml-3 text-gray-700">Courte durée</span>
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
                      <span className="ml-3 text-gray-700">Longue durée</span>
                    </label>
                  </div>
                </div>
                
                {/* Prix */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Prix (€/mois)</label>
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
                
                {/* Images */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                  </div>
                  
                  {/* Aperçu des images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden h-24 group">
                          <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                            <button 
                              type="button"
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none transition-opacity"
                              onClick={() => setImages(images.filter((_, i) => i !== index))}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Vidéo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo</label>
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
                    <div className="mt-2 relative">
                      <video src={video} controls className="w-full h-48 object-cover rounded"></video>
                      <button 
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={() => setVideo(null)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
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

      <div className="max-w-4xl mx-auto bg-white shadow-sm">
        {/* Couverture et photo de profil */}
        <div className="relative">
          <div className="h-48 bg-gray-200">
            <img src={userProfile.coverPhoto} alt="Couverture" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-8 transform translate-y-1/2 border-4 border-white rounded-full overflow-hidden">
            <div className="w-32 h-32 bg-gray-200">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="mt-16 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{userProfile.name}</h1>
              <p className="text-gray-500">{userProfile.username}</p>
            </div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowEditProfileForm(true)}
            >
              Modifier le profil
            </button>
          </div>
          
          <p className="mt-4 text-gray-700">{userProfile.bio}</p>
          
          <div className="flex items-center mt-2 text-gray-600">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            <span>{userProfile.location}</span>
            <span className="mx-2">•</span>
            <span>{userProfile.joinDate}</span>
          </div>
          
          <div className="flex space-x-6 mt-4 pt-4 border-t">
            <div>
              <span className="font-bold">{userProfile.stats.posts}</span>
              <span className="text-gray-500 ml-1">Publications</span>
            </div>
            <div>
              <span className="font-bold">{userProfile.stats.followers}</span>
              <span className="text-gray-500 ml-1">Abonnés</span>
            </div>
            <div>
              <span className="font-bold">{userProfile.stats.following}</span>
              <span className="text-gray-500 ml-1">Abonnements</span>
            </div>
          </div>
        </div>
        
        {/* Navigation du profil */}
        <div className="mt-6 border-t">
          <div className="flex px-4">
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'publications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('publications')}
            >
              Publications
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'abonnés' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('abonnés')}
            >
              Abonnés
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'suivis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('suivis')}
            >
              Suivi(e)s
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'apropos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('apropos')}
            >
              À propos
            </button>
          </div>
        </div>
        
        {/* Contenu selon l'onglet actif */}
        <div className="p-4">
          {activeTab === 'publications' && (
            <>
              {/* Contenu existant des publications */}
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="text" 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2" 
                    placeholder="Quoi de neuf ?" 
                    onClick={() => setShowPostForm(true)}
                    readOnly
                  />
                </div>
                <div className="flex justify-center mt-3 pt-3 border-t">
                  <button 
                    className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => setShowPostForm(true)}
                  >
                    <svg className="w-5 h-5 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                    </svg>
                    Photo/Vidéo
                  </button>
                </div>
              </div>
              
              {/* Publications */}
              <div className="space-y-4">
                {[1, 2, 3].map(id => (
                  <div key={id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{userProfile.name}</div>
                        <div className="text-xs text-gray-500">il y a {id} jour{id > 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    
                    {/* Tags colorés - déplacés au-dessus du contenu */}
                    <div className="mb-3 py-2 border-y border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {id === 1 && (
                          <>
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">#coding</span>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">#webdev</span>
                          </>
                        )}
                        {id === 2 && (
                          <>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">#nature</span>
                            <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">#randonnée</span>
                          </>
                        )}
                        {id === 3 && (
                          <>
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">#tech</span>
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">#meetup</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="mb-3">
                      {id === 1 && "Nouvelle mise à jour du projet ! #coding #webdev"}
                      {id === 2 && "Belle journée pour une randonnée en montagne. La vue est magnifique !"}
                      {id === 3 && "Qui est partant pour un meetup tech ce weekend ?"}
                    </p>
                    {id !== 3 && (
                      <div className="rounded-lg overflow-hidden mb-3">
                        <img src={`https://via.placeholder.com/600x400?text=Post+${id}`} alt="Post" className="w-full" />
                      </div>
                    )}
                    {/* Nouvelle section des boutons d'action */}
                      <div className="flex justify-between">
                        <div className="flex space-x-4">
                          <button 
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                            onClick={() => handleLikePost(id)}
                          >
                            <svg 
                              className={`w-5 h-5 ${likedPosts[id] ? 'text-red-600 fill-current' : 'text-gray-500'}`} 
                              fill={likedPosts[id] ? 'currentColor' : 'none'} 
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
                            <span className={likedPosts[id] ? 'text-red-600' : ''}>{10 + id * 5}</span>
                          </button>
                          <button 
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                            onClick={() => toggleComments(id)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span>{3 + id}</span>
                          </button>
                        </div>
                        <button className="text-gray-500 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                          </svg>
                        </button>
                      </div>
                    
                    {/* Section commentaires */}
                    {showComments[id] && (
                      <div className="bg-gray-50 p-4 mt-3 rounded-lg">
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
            </>
          )}
          
          {activeTab === 'abonnés' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100" 
                    placeholder="Rechercher parmi les abonnés" 
                    value={searchFollowers}
                    onChange={(e) => setSearchFollowers(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-2">
                {userProfile.followers
                  .filter(follower => follower.name.toLowerCase().includes(searchFollowers.toLowerCase()))
                  .map(follower => (
                  <div 
                    key={follower.id} 
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100">
                        <img src={follower.avatar} alt={follower.name} className="w-full h-full object-cover" />
                      </div>
                      {follower.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 truncate">{follower.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${follower.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {follower.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </div>
                    </div>
                    <button className="ml-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                      Suivre
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'suivis' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100" 
                    placeholder="Rechercher parmi les personnes suivies" 
                    value={searchFollowing}
                    onChange={(e) => setSearchFollowing(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-2">
                {filteredFollowing.map(person => (
                  <div 
                    key={person.id} 
                    className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-100">
                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      {person.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 truncate">{person.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${person.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {person.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </div>
                    </div>
                    <button className="ml-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 transition-colors">
                      Ne plus suivre
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
}



