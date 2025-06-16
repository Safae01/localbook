import React, { useState, useEffect } from 'react';

export default function AdminStoryViewer({ stories, currentIndex, onClose, onDeleteStory }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex);

  useEffect(() => {
    setCurrentStoryIndex(currentIndex);
  }, [currentIndex]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleDeleteStory = () => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory) {
      onDeleteStory(currentStory.id);
      onClose();
    }
  };

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-md w-full h-full flex flex-col">
        {/* Header avec info utilisateur et bouton de suppression admin */}
        <div className="flex items-center justify-between p-4 text-white">
          <div className="flex items-center space-x-3">
            <img
              src={currentStory.avatar}
              alt={currentStory.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{currentStory.author}</p>
              <p className="text-sm text-gray-300">{currentStory.time}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Bouton de suppression admin */}
            <button
              onClick={handleDeleteStory}
              className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
              title="Supprimer cette story"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            
            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="flex space-x-1 px-4 pb-2">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded ${
                index === currentStoryIndex ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Contenu de la story */}
        <div className="flex-1 flex items-center justify-center relative">
          <img
            src={currentStory.image}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />

          {/* Boutons de navigation */}
          {currentStoryIndex > 0 && (
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          )}

          {currentStoryIndex < stories.length - 1 && (
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          )}

          {/* Zone cliquable pour navigation */}
          <div className="absolute inset-0 flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={prevStory}
            />
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={nextStory}
            />
          </div>
        </div>

        {/* Footer avec badge admin */}
        <div className="p-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm text-center">
            Mode Administrateur - Cliquez sur l'icône de suppression pour supprimer cette story
          </div>
        </div>
      </div>
    </div>
  );
}
