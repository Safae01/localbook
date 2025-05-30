import React, { useState } from 'react';

export default function Header({ onShowProfile, onShowFeed, onShowUserProfile }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  
  // Données fictives pour les notifications
  const notifications = [
    { id: 1, user: 'Marie Dupont', avatar: 'https://via.placeholder.com/40', action: 'a aimé votre publication', time: 'il y a 5 min', read: false },
    { id: 2, user: 'Thomas Martin', avatar: 'https://via.placeholder.com/40', action: 'a commenté votre photo', time: 'il y a 30 min', read: false },
    { id: 3, user: 'Julie Lefebvre', avatar: 'https://via.placeholder.com/40', action: 'vous a identifié dans une publication', time: 'il y a 2h', read: true },
    { id: 4, user: 'Pierre Moreau', avatar: 'https://via.placeholder.com/40', action: 'a partagé votre publication', time: 'il y a 1j', read: true },
    { id: 5, user: 'Sophie Bernard', avatar: 'https://via.placeholder.com/40', action: 'a rejoint Localbook', time: 'il y a 2j', read: true }
  ];
  
  // Données fictives pour les messages
  const messages = [
    { id: 1, user: 'Marie Dupont', avatar: 'https://via.placeholder.com/40', message: 'Salut, comment ça va ?', time: 'il y a 10 min', read: false },
    { id: 2, user: 'Thomas Martin', avatar: 'https://via.placeholder.com/40', message: 'Tu as vu la dernière photo ?', time: 'il y a 45 min', read: false },
    { id: 3, user: 'Julie Lefebvre', avatar: 'https://via.placeholder.com/40', message: 'Merci pour l\'invitation !', time: 'il y a 3h', read: true },
    { id: 4, user: 'Pierre Moreau', avatar: 'https://via.placeholder.com/40', message: 'On se retrouve où demain ?', time: 'il y a 1j', read: true },
    { id: 5, user: 'Sophie Bernard', avatar: 'https://via.placeholder.com/40', message: 'Félicitations pour ton nouveau poste !', time: 'il y a 3j', read: true }
  ];
  
  // Historique des conversations
  const chatHistory = {
    1: [
      { id: 1, sender: 'Marie Dupont', text: 'Salut, comment ça va ?', time: '10:30', isUser: false },
      { id: 2, sender: 'Vous', text: 'Ça va bien, merci ! Et toi ?', time: '10:32', isUser: true },
      { id: 3, sender: 'Marie Dupont', text: 'Super ! Tu fais quoi ce weekend ?', time: '10:35', isUser: false }
    ],
    2: [
      { id: 1, sender: 'Thomas Martin', text: 'Tu as vu la dernière photo ?', time: '09:15', isUser: false },
      { id: 2, sender: 'Vous', text: 'Non, pas encore', time: '09:20', isUser: true },
      { id: 3, sender: 'Thomas Martin', text: 'Je te l\'envoie tout de suite', time: '09:21', isUser: false }
    ],
    3: [
      { id: 1, sender: 'Julie Lefebvre', text: 'Merci pour l\'invitation !', time: '14:45', isUser: false },
      { id: 2, sender: 'Vous', text: 'Avec plaisir ! Tu viens ?', time: '15:00', isUser: true },
      { id: 3, sender: 'Julie Lefebvre', text: 'Oui, bien sûr !', time: '15:05', isUser: false }
    ],
    4: [
      { id: 1, sender: 'Pierre Moreau', text: 'On se retrouve où demain ?', time: '18:20', isUser: false },
      { id: 2, sender: 'Vous', text: 'Au café habituel à 14h ?', time: '18:25', isUser: true },
      { id: 3, sender: 'Pierre Moreau', text: 'Parfait, à demain !', time: '18:30', isUser: false }
    ],
    5: [
      { id: 1, sender: 'Sophie Bernard', text: 'Félicitations pour ton nouveau poste !', time: '12:10', isUser: false },
      { id: 2, sender: 'Vous', text: 'Merci beaucoup Sophie !', time: '12:15', isUser: true },
      { id: 3, sender: 'Sophie Bernard', text: 'Il faut qu\'on fête ça !', time: '12:20', isUser: false }
    ]
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showMessages) setShowMessages(false);
  };
  
  const toggleMessages = () => {
    setShowMessages(!showMessages);
    if (showNotifications) setShowNotifications(false);
  };
  
  const openChat = (messageId) => {
    setActiveChat(messageId);
    setShowMessages(false);
  };
  
  const closeChat = () => {
    setActiveChat(null);
  };

  const navigateToUserProfile = (user) => {
    console.log("Navigating to user profile:", user);
    
    // Fermer le chat
    closeChat();
    
    // Fermer les menus déroulants si ouverts
    if (showMessages) setShowMessages(false);
    if (showNotifications) setShowNotifications(false);
    
    // Si vous avez une prop pour naviguer vers le profil d'un utilisateur spécifique
    if (props.onShowUserProfile) {
      props.onShowUserProfile(user);
    } else if (onShowUserProfile) {
      onShowUserProfile(user);
    } else {
      // Fallback: utiliser la même fonction que pour le profil de l'utilisateur connecté
      onShowProfile();
    }
  };

  return (
    <>
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onShowFeed}>
          <img src="/logo.png" alt="Locabook Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-blue-600">Localbook</h1>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input className="w-full px-4 py-2 pl-10 border rounded-full bg-gray-100" placeholder="Rechercher sur Facebook" />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
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
              
              {/* Badge de notifications - gardé en rouge */}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Menu déroulant des notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <button className="text-blue-600 text-sm font-medium">Tout marquer comme lu</button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 hover:bg-gray-50 cursor-pointer flex items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img src={notification.avatar} alt={notification.user} className="w-full h-full object-cover" />
                            </div>
                            {!notification.read && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">{notification.user}</span> {notification.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
          
          {/* Bouton de messages avec menu déroulant */}
          <div className="relative">
            <button 
              className={`p-2 ${showMessages ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-blue-600'} rounded-full relative`}
              onClick={toggleMessages}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
              
              {/* Badge de messages - gardé en rouge */}
              {messages.filter(m => !m.read).length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            
            {/* Menu déroulant des messages */}
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-lg">Messages</h3>
                  <button className="text-blue-600 text-sm font-medium">Tout marquer comme lu</button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {messages.length > 0 ? (
                    <div>
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`p-3 hover:bg-gray-50 cursor-pointer flex items-start ${!message.read ? 'bg-blue-50' : ''}`}
                          onClick={() => openChat(message.id)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img src={message.avatar} alt={message.user} className="w-full h-full object-cover" />
                            </div>
                            {!message.read && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{message.user}</p>
                            <p className="text-xs text-gray-700 truncate">{message.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucun message
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onShowProfile}
          >
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
      
      {/* Fenêtre de chat */}
      {activeChat && (
        <div className="fixed bottom-0 right-64 w-80 bg-white rounded-t-lg shadow-lg z-10 overflow-hidden">
          {/* En-tête du chat */}
          <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => {
                const chatUser = messages.find(m => m.id === activeChat);
                if (chatUser) {
                  navigateToUserProfile(chatUser);
                }
              }}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img 
                  src={messages.find(m => m.id === activeChat)?.avatar} 
                  alt={messages.find(m => m.id === activeChat)?.user} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-medium hover:underline">
                {messages.find(m => m.id === activeChat)?.user}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button className="text-white hover:text-gray-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </button>
              <button className="text-white hover:text-gray-200" onClick={closeChat}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Corps du chat */}
          <div className="h-80 overflow-y-auto p-3 bg-gray-50">
            {chatHistory[activeChat]?.map(msg => (
              <div 
                key={msg.id} 
                className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img 
                      src={messages.find(m => m.id === activeChat)?.avatar} 
                      alt={msg.sender} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div 
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-right mt-1 opacity-75">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Zone de saisie */}
          <div className="p-3 border-t flex items-center">
            <div className="flex-1 relative">
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Écrivez un message..."
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <button className="ml-2 p-2 rounded-full bg-blue-600 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
