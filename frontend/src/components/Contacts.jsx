import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';

export default function Contacts() {
  // États pour les contacts réels
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeChat, setActiveChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fonction pour charger tous les utilisateurs
  const loadAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserService.getAllUsers();
      if (result.success) {
        // Transformer les données pour correspondre au format attendu
        const transformedUsers = result.users.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || `https://via.placeholder.com/40?text=${user.name.charAt(0)}`,
          status: user.isOnline,
          email: user.email,
          city: user.city,
          userStatus: user.status,
          phone: user.phone
        }));
        setContacts(transformedUsers);
      } else {
        setError('Erreur lors du chargement des contacts');
        console.error('Erreur lors du chargement des utilisateurs:', result.error);
      }
    } catch (error) {
      setError('Erreur de connexion');
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadAllUsers();
  }, []);

  // Filtrer les contacts en fonction de la recherche
  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  


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
          <div className="flex flex-col">
            <span>Contacts ({contacts.length})</span>
            <span className="text-xs text-gray-400 font-normal">Propriétaires & Intermédiaires</span>
          </div>
          <button
            onClick={loadAllUsers}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            title="Actualiser les contacts"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </h2>
        
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <input 
            type="text" 
            className="w-full px-2 py-2 pl-10 border rounded-lg bg-gray-100" 
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Chargement des contacts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={loadAllUsers}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Réessayer
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-3 text-gray-500">
            {searchTerm ? 'Aucun contact trouvé' : 'Aucun contact disponible'}
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => openWhatsApp(contact)}
              title={`Cliquer pour contacter ${contact.name} sur WhatsApp${contact.city ? ` - ${contact.city}` : ''}${contact.userStatus ? ` (${contact.userStatus})` : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-200">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/40?text=${contact.name.charAt(0)}`;
                    }}
                  />
                </div>
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{contact.name}</div>
                {contact.city && (
                  <div className="text-xs text-gray-500 truncate">{contact.city}</div>
                )}
                {contact.userStatus && (
                  <div className="text-xs text-blue-600 truncate capitalize">{contact.userStatus}</div>
                )}
              </div>
              <div className="flex flex-col items-end">
                {/* Icône WhatsApp */}
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className={`inline-block w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {contact.phone ? 'WhatsApp' : 'Pas de tél.'}
                </span>
              </div>
            </div>
          ))
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


