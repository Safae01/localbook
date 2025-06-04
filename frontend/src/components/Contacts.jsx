import React, { useState } from 'react';

export default function Contacts() {
  const contacts = [
    { id: 1, name: 'Sophie Lefebvre', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 2, name: 'Lucas Bernard', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 3, name: 'Emma Petit', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 4, name: 'Hugo Dubois', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: 5, name: 'Léa Moreau', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 6, name: 'Gabriel Roux', avatar: 'https://via.placeholder.com/40', status: 'online' },
  ];
  
  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les contacts en fonction de la recherche
  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Historique des conversations
  const chatHistory = {
    1: [
      { id: 1, sender: 'Sophie Lefebvre', text: 'Bonjour, comment vas-tu ?', time: '10:30', isUser: false },
      { id: 2, sender: 'Vous', text: 'Très bien merci, et toi ?', time: '10:32', isUser: true },
      { id: 3, sender: 'Sophie Lefebvre', text: 'Super ! Tu as des plans pour le weekend ?', time: '10:35', isUser: false }
    ],
    2: [
      { id: 1, sender: 'Lucas Bernard', text: 'As-tu vu l\'annonce ?', time: '09:15', isUser: false },
      { id: 2, sender: 'Vous', text: 'Oui, très intéressante !', time: '09:20', isUser: true },
      { id: 3, sender: 'Lucas Bernard', text: 'Merci, je peux te donner plus de détails', time: '09:21', isUser: false }
    ],
    3: [
      { id: 1, sender: 'Emma Petit', text: 'Salut, j\'ai une question', time: '14:45', isUser: false },
      { id: 2, sender: 'Vous', text: 'Bien sûr, je t\'écoute', time: '15:00', isUser: true },
      { id: 3, sender: 'Emma Petit', text: 'Est-ce qu\'il y a un parking ?', time: '15:05', isUser: false }
    ],
    4: [
      { id: 1, sender: 'Hugo Dubois', text: 'On se retrouve où demain ?', time: '18:20', isUser: false },
      { id: 2, sender: 'Vous', text: 'Au café près de la gare à 14h ?', time: '18:25', isUser: true },
      { id: 3, sender: 'Hugo Dubois', text: 'Parfait, à demain !', time: '18:30', isUser: false }
    ],
    5: [
      { id: 1, sender: 'Léa Moreau', text: 'J\'ai trouvé un super appartement !', time: '12:10', isUser: false },
      { id: 2, sender: 'Vous', text: 'Génial ! Tu peux m\'envoyer des photos ?', time: '12:15', isUser: true },
      { id: 3, sender: 'Léa Moreau', text: 'Bien sûr, je t\'envoie ça', time: '12:20', isUser: false }
    ],
    6: [
      { id: 1, sender: 'Gabriel Roux', text: 'Bonjour, je suis intéressé', time: '11:05', isUser: false },
      { id: 2, sender: 'Vous', text: 'Bonjour, merci pour votre intérêt !', time: '11:10', isUser: true },
      { id: 3, sender: 'Gabriel Roux', text: 'Est-ce toujours disponible ?', time: '11:15', isUser: false }
    ]
  };
  
  const openChat = (contactId) => {
    setActiveChat(contactId);
  };
  
  const closeChat = () => {
    setActiveChat(null);
  };

  return (
    <div className="w-1/5 p-4 bg-white shadow hidden lg:block overflow-y-auto h-screen sticky top-16">
      <div className="mb-4">
        <h2 className="text-gray-500 font-semibold mb-2 flex justify-between items-center">
          <span>Contacts</span>
          <div className="flex space-x-1">
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
            </button>
          </div>
        </h2>
        
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <input 
            type="text" 
            className="w-full px-4 py-2 pl-10 border rounded-lg bg-gray-100" 
            placeholder="Rechercher un contact" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id} 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => openChat(contact.id)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
              </div>
              {contact.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>
            <span className="font-medium">{contact.name}</span>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="text-center py-3 text-gray-500">
            Aucun contact trouvé
          </div>
        )}
      </div>
      
      {/* Fenêtre de chat */}
      {activeChat && (
        <div className="fixed bottom-0 right-64 w-80 bg-white rounded-t-lg shadow-lg z-10 overflow-hidden">
          {/* En-tête du chat */}
          <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img 
                  src={contacts.find(c => c.id === activeChat)?.avatar} 
                  alt={contacts.find(c => c.id === activeChat)?.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-medium">{contacts.find(c => c.id === activeChat)?.name}</h3>
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
                      src={contacts.find(c => c.id === activeChat)?.avatar} 
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
    </div>
  );
}


