import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter la logique d'authentification
    // Pour l'instant, on redirige simplement vers la page d'accueil
    navigate('/home');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 ">
      {/* En-tête avec logo à gauche, style Facebook */}
      
        <div className="flex items-center space-x-2 p-4" >
          <img src="/favicon2.png" alt="Localbook Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-600">Localbook</h1>
        </div>
        <div className="flex-1"></div>
      
      
      <div className="flex flex-1">
        {/* Aperçu du site (côté gauche) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="h-96 overflow-y-auto pr-2 -mr-2">
              {/* Posts miniatures */}
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Marie Dupont</p>
                    <p className="text-xs text-gray-500">il y a 2h</p>
                  </div>
                </div>
                
                {/* Tags colorés */}
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Location
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      1200€/mois
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      75m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      3 pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Meublé
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Paris
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Wifi
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Parking
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-2">Bonjour à tous ! Voici une photo de mon dernier voyage.</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="https://via.placeholder.com/600x400" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>12 j'aime</span>
                  <span>3 commentaires</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thomas Martin</p>
                    <p className="text-xs text-gray-500">il y a 5h</p>
                  </div>
                </div>
                
                {/* Tags colorés */}
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Vente
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      3 pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      450000€
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      120m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Lyon
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Jardin
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Garage
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Neuf
                    </span>
                  </div>
                </div>
                
                <p className="text-sm">Je viens de terminer ce projet incroyable !</p>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>8 j'aime</span>
                  <span>1 commentaire</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sophie Dubois</p>
                    <p className="text-xs text-gray-500">il y a 1j</p>
                  </div>
                </div>
                
                {/* Tags colorés */}
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Location
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      850€/mois
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      60m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      2 pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Non meublé
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Marseille
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Balcon
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Vue mer
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-2">J'ai adoré cette conférence sur le développement web !</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="https://via.placeholder.com/600x400" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>24 j'aime</span>
                  <span>7 commentaires</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pierre Moreau</p>
                    <p className="text-xs text-gray-500">il y a 2j</p>
                  </div>
                </div>
                
                {/* Tags colorés */}
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Colocation
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      400€/mois
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      90m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      4 pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Toulouse
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Meublé
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Wifi
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Centre-ville
                    </span>
                  </div>
                </div>
                
                <p className="text-sm">Quelqu'un connaît un bon restaurant dans le quartier ?</p>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>3 j'aime</span>
                  <span>15 commentaires</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Julie Lambert</p>
                    <p className="text-xs text-gray-500">il y a 3j</p>
                  </div>
                </div>
                
                {/* Tags colorés */}
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Vente
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      320000€
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      140m²
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      5 pièces
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Nantes
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Jardin
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Garage
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      Rénové
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-2">Mon nouveau bureau à la maison !</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="https://via.placeholder.com/600x400" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>32 j'aime</span>
                  <span>5 commentaires</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulaire d'authentification (côté droit) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-10 md:hidden">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img src="/logo.png" alt="Localbook Logo" className="w-10 h-10" />
                <h1 className="text-3xl font-bold text-blue-600">Localbook</h1>
              </div>
              <p className="mt-2 text-gray-600">Connectez-vous avec vos amis et le monde qui vous entoure.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez votre nom complet"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cin" className="block text-sm font-medium text-gray-700">Numéro de CIN</label>
                      <input
                        type="text"
                        id="cin"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez votre numéro de CIN"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cin-image" className="block text-sm font-medium text-gray-700">Image de la carte nationale</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="cin-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Télécharger un fichier</span>
                              <input id="cin-file-upload" name="cin-file-upload" type="file" className="sr-only" accept="image/*" />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez votre email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>
                
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Pas encore de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





