import React, { useState } from 'react';
import StoryViewer from './StoryViewer';

export default function Feed() {
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
  const [video, setVideo] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState({});

  // Données des posts avec le même format que SavedPosts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Jean Dupont",
      avatar: "https://via.placeholder.com/40",
      time: "Il y a 2 heures",
      content: "Appartement lumineux avec vue sur la Seine. Disponible à partir du 1er juin.",
      image: "https://via.placeholder.com/600x400",
      likes: 245,
      comments: 32,
      details: {
        postType: "Appartement",
        location: "Tanger-Birchifa",
        durationType: "courte",
        price: "700",
        area: "50",
        rooms: "3",
        furnishingStatus: "meublé",
        amenities: ["Wifi", "Piscine"]
      }
    },
    {
      id: 2,
      author: "Marie Lefebvre",
      avatar: "https://via.placeholder.com/40",
      time: "Il y a 5 heures",
      content: "Studio disponible immédiatement dans le quartier du Marais. Idéal pour étudiant ou jeune actif.",
      image: "https://via.placeholder.com/600x400",
      likes: 124,
      comments: 18,
      details: {
        postType: "Location",
        location: "Paris 4ème",
        durationType: "long-term",
        price: "950",
        area: "28",
        rooms: "1",
        furnishingStatus: "equipped",
        amenities: ["Cuisine équipée", "Internet"]
      }
    },
    {
      id: 3,
      author: "Sophie Bernard",
      avatar: "https://via.placeholder.com/40",
      time: "Il y a 1 jour",
      content: "Maison familiale avec jardin à vendre. Proche des écoles et des commerces. Quartier calme et résidentiel.",
      image: "https://via.placeholder.com/600x400",
      video: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-4704-large.mp4",
      likes: 312,
      comments: 45,
      details: {
        postType: "Vente",
        location: "Bordeaux",
        price: "450000",
        area: "120",
        rooms: "5",
        furnishingStatus: "unfurnished",
        amenities: ["Jardin", "Garage", "Cave"]
      }
    }
  ]);
  
  // Données utilisateur fictives
  const userProfile = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/40"
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(item => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Création d'un nouvel objet post
    const newPost = {
      id: posts.length + 1,
      author: userProfile.name,
      avatar: userProfile.avatar,
      time: "À l'instant",
      content: e.target.description.value, // Ajout du champ description
      likes: 0,
      comments: 0,
      details: {
        postType,
        location,
        quartier,
        durationType,
        price,
        area,
        rooms,
        furnishingStatus,
        amenities
      }
    };
    
    // Ajout des images si présentes
    if (images.length > 0) {
      newPost.image = images[0]; // Première image comme principale
      newPost.images = images;   // Toutes les images
    }
    
    // Ajout de la vidéo si présente
    if (video) {
      newPost.video = video;
    }
    
    // Ajout du nouveau post à la liste
    setPosts([newPost, ...posts]);
    
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
    setVideo(null);
    
    // Fermer le formulaire après soumission
    setShowPostForm(false);
  };

  const handleSavePost = (postId) => {
    console.log('Post sauvegardé:', postId);
    // Logique pour sauvegarder un post
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const openStoryViewer = (index) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const stories = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    author: `Utilisateur ${index + 1}`,
    avatar: `https://via.placeholder.com/40?text=U${index + 1}`,
    image: `https://via.placeholder.com/400x700?text=Story${index + 1}`,
  }));

  // Ajoutez cette fonction pour gérer l'upload de story
  const handleStoryUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Créer une nouvelle story avec l'image uploadée
        const newStory = {
          id: stories.length + 1,
          author: userProfile.name || "Vous",
          avatar: userProfile.avatar || "https://via.placeholder.com/40?text=You",
          image: event.target.result,
          time: "À l'instant"
        };
        
        // Ajouter la nouvelle story au début du tableau
        setStories([newStory, ...stories]);
        
        // Ouvrir automatiquement la story viewer pour voir la story ajoutée
        setCurrentStoryIndex(0);
        setShowStoryViewer(true);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => {
      const isLiked = prev[postId];
      
      // Mettre à jour le nombre de likes dans les posts
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      }));
      
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      {/* Stories */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-4">
        {/* Option "Ajouter une story" */}
        <div className="flex-shrink-0 w-32 h-48 rounded-xl bg-gray-100 relative overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors">
          <input
            type="file"
            id="story-upload"
            className="hidden"
            accept="image/*"
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
        
        {/* Stories existantes */}
        {stories.map((story, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-32 h-48 rounded-xl bg-gray-300 relative overflow-hidden cursor-pointer"
            onClick={() => openStoryViewer(index)}
          >
            <img src={story.image} alt={`Story ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent">
              <div className="text-white text-xs font-medium truncate">{story.author}</div>
            </div>
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden">
              <img src={story.avatar} alt={`User ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {/* Create Post */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
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

      {/* Post Form Modal - Exactement comme dans ProfilePage */}
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                
                {/* Ajout du champ description après le bloc utilisateur */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors hover:border-blue-300"
                    placeholder="Décrivez votre bien immobilier..."
                    required
                  ></textarea>
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
                  <label className="block text-sm font-medium text-gray-700">Localisation (ville)</label>
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
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative w-20 h-20">
                          <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button 
                            type="button"
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            onClick={() => setImages(images.filter((_, i) => i !== index))}
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                  </div>
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

      {/* Posts avec le même format que SavedPosts */}
      <div className="space-y-6">
        {posts.map(post => (
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {post.details.location}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {post.details.durationType === 'courte' ? 'Courte durée' : 'Longue durée'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {post.details.price}dh
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {post.details.area}m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {post.details.rooms} pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      {post.details.furnishingStatus === 'equipped' ? 'Meublé' : 'Non meublé'}
                    </span>
                    {post.details.amenities && post.details.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {amenity}
                      </span>
                    ))}
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
                      <p className="text-sm">Très beau contenu, continue comme ça !</p>
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
      {showStoryViewer && (
        <StoryViewer 
          stories={stories} 
          initialIndex={currentStoryIndex} 
          onClose={() => setShowStoryViewer(false)} 
        />
      )}
    </main>
  );
  }             
