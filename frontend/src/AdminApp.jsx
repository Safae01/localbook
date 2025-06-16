import React, { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminFeed from './components/AdminFeed';
import AdminContacts from './components/AdminContacts';
import AdminRecommendations from './components/AdminRecommendations';
import AdminSidebar from './components/AdminSidebar';

function AdminApp() {
  const [currentView, setCurrentView] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const handleShowFeed = () => setCurrentView('feed');
  const handleShowFollowers = () => setCurrentView('followers');
  const handleShowRecommendations = () => setCurrentView('recommendations');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // S'assurer qu'on est sur le feed pour voir les résultats de recherche
    if (currentView !== 'feed') {
      setCurrentView('feed');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <AdminFeed searchQuery={searchQuery} />;
      case 'followers':
        return <AdminContacts />;
      case 'recommendations':
        return <AdminRecommendations />;
      default:
        return <AdminFeed searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader onShowFeed={handleShowFeed} onSearch={handleSearch} />
      <div className="flex flex-1 bg-gray-100 overflow-hidden">
        <AdminSidebar
          onShowFollowers={handleShowFollowers}
          onShowRecommendations={handleShowRecommendations}
        />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminApp;
