import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Feed from './components/Feed';
import Contacts from './components/Contacts';
import FollowersList from './components/FollowersList';
import FollowingList from './components/FollowingList';
import GroupsList from './components/GroupsList';
import VideoReels from './components/VideoReels';
import SavedPosts from './components/SavedPosts';
import Recommendations from './components/Recommendations';
import ProfilePage from './components/ProfilePage';
import UserProfile from './components/UserProfile';
import StoryViewer from './components/StoryViewer';

export default function App() {
  const [currentView, setCurrentView] = useState('feed');

  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const handleShowFollowers = () => {
    setCurrentView('followers');
  };

  const handleShowFollowing = () => {
    setCurrentView('following');
  };

  const handleShowGroups = () => {
    setCurrentView('groups');
  };

  const handleShowVideos = () => {
    setCurrentView('videos');
  };
  
  const handleShowSavedPosts = () => {
    setCurrentView('savedPosts');
  };
  
  const handleShowRecommendations = () => {
    setCurrentView('recommendations');
  };

  const handleShowFeed = () => {
    setCurrentView('feed');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onShowProfile={handleShowProfile} onShowFeed={handleShowFeed} />
      <div className="flex flex-1 bg-gray-100 overflow-hidden">
        {currentView !== 'profile' && (
          <Sidebar 
            onShowProfile={handleShowProfile}
            onShowFollowers={handleShowFollowers} 
            onShowFollowing={handleShowFollowing}
            onShowGroups={handleShowGroups}
            onShowVideos={handleShowVideos}
            onShowSavedPosts={handleShowSavedPosts}
            onShowRecommendations={handleShowRecommendations}
          />
        )}
        
        <div className="flex-1 overflow-y-auto">
          {currentView === 'profile' && <ProfilePage />}
          {currentView === 'followers' && <FollowersList />}
          {currentView === 'following' && <FollowingList />}
          {currentView === 'groups' && <GroupsList />}
          {currentView === 'videos' && <VideoReels />}
          {currentView === 'savedPosts' && <SavedPosts />}
          {currentView === 'recommendations' && <Recommendations />}
          {currentView === 'feed' && <Feed />}
        </div>
        
        {currentView !== 'profile' && currentView !== 'videos' && <Contacts />}
      </div>
    </div>
  );
}
