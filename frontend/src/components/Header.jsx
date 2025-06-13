import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';
import { useNotifications } from '../hooks/useNotifications';

export default function Header({ onShowProfile, onShowFeed, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, loading: notificationsLoading, unreadCount, markNotificationsAsViewed } = useNotifications();

  // Debug: afficher les notifications dans la console
  React.useEffect(() => {
    console.log('Notifications chargées:', notifications);
  }, [notifications]);

  // Générer l'URL de l'image de profil
  const profileImageUrl = user?.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${user.IMG_PROFIL}` : "https://via.placeholder.com/40";
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Fonction pour gérer la saisie dans l'input de recherche
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Recherche en temps réel
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };



  
  const toggleNotifications = async () => {
    const wasOpen = showNotifications;
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);

    // Si on ouvre les notifications et qu'il y a des notifications non vues, les marquer comme vues
    if (!wasOpen && unreadCount > 0) {
      await markNotificationsAsViewed();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onShowFeed}>
          <img src="../favicon2.png" alt="Localbook Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-600">Localbook</h1>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              className="w-full px-4 py-2 pl-10 pr-10 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Rechercher des posts (ex: maison tanger birchifa)..."
              value={searchQuery}
              onChange={handleSearchInput}
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>

            {/* Bouton effacer à droite */}
            {searchQuery && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="Effacer la recherche"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            onClick={onShowFeed}
          >
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
          </button>
          
          {/* Bouton de notifications avec menu déroulant */}
          <div className="relative">
            <button 
              className={`p-2 ${showNotifications ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-blue-600'} rounded-full relative`}
              onClick={toggleNotifications}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
              
              {/* Badge de notifications */}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Menu déroulant des notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                <div className="p-3 border-b">
                  <h3 className="font-bold text-lg">Notifications</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Chargement des notifications...
                    </div>
                  ) : notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-start"
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={notification.avatar || "https://via.placeholder.com/40"}
                                alt={notification.user || "Utilisateur"}
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">{notification.user || "Utilisateur"}</span> {notification.action || "a effectué une action"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time || "Récemment"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucune notification
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          

          
          {/* Menu utilisateur */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={toggleUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/40"}
                />
              </div>
              <span className="font-medium text-gray-700">{user ? user.NOM : 'Utilisateur'}</span>
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>

            {/* Menu déroulant utilisateur */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                <div className="p-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        src={user?.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${user.IMG_PROFIL}` : "https://via.placeholder.com/48"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/48"}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user ? user.NOM : 'Utilisateur'}</p>
                      <p className="text-sm text-gray-600">{user ? user.EMAIL : 'email@example.com'}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                    onClick={() => {
                      onShowProfile();
                      setShowUserMenu(false);
                    }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                    <span>Voir le profil</span>
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                    onClick={() => {
                      setShowChangePasswordModal(true);
                      setShowUserMenu(false);
                    }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                    </svg>
                    <span>Mot de passe oublié</span>
                  </button>

                  <hr className="my-2" />

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 text-red-600"
                    onClick={handleLogout}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                    </svg>
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de changement de mot de passe */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

    </>
  );
}
