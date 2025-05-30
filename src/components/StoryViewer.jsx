import React, { useState, useEffect, useRef } from 'react';

export default function StoryViewer({ stories, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);
  const STORY_DURATION = 5000; // 5 secondes par story

  useEffect(() => {
    // Réinitialiser le progrès quand on change de story
    setProgress(0);
    
    // Nettoyer l'intervalle précédent
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // Créer un nouvel intervalle pour la progression
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Passer à la story suivante ou fermer si c'est la dernière
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);
    
    progressInterval.current = interval;
    
    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center">
      {/* Bouton de fermeture */}
      <button 
        className="absolute top-4 right-4 text-white z-10 bg-gray-800 rounded-full p-2 hover:bg-gray-700"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      {/* Barres de progression */}
      <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1 px-4">
        {stories.map((_, index) => (
          <div key={index} className="h-1 bg-gray-500 rounded-full flex-1 overflow-hidden">
            <div 
              className={`h-full bg-white ${index === currentIndex ? 'transition-all duration-100' : index < currentIndex ? 'w-full' : 'w-0'}`}
              style={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%' }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Story courante */}
      <div className="relative w-full h-full max-w-md max-h-[80vh]">
        <img 
          src={stories[currentIndex]?.image || `https://via.placeholder.com/400x700?text=Story${currentIndex + 1}`} 
          alt={`Story ${currentIndex + 1}`} 
          className="w-full h-full object-contain"
        />
        
        {/* Info utilisateur */}
        <div className="absolute top-12 left-0 right-0 p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden">
            <img 
              src={stories[currentIndex]?.avatar || `https://via.placeholder.com/40?text=U${currentIndex + 1}`} 
              alt={`User ${currentIndex + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-white font-medium">{stories[currentIndex]?.author || `Utilisateur ${currentIndex + 1}`}</span>
        </div>
        
        {/* Flèches de navigation visibles */}
        {currentIndex > 0 && (
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2"
            onClick={handlePrevious}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
        
        {currentIndex < stories.length - 1 && (
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2"
            onClick={handleNext}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        )}
        
        {/* Zones de clic pour navigation (maintenues pour une meilleure UX) */}
        <div className="absolute inset-y-0 left-0 w-1/3" onClick={handlePrevious}></div>
        <div className="absolute inset-y-0 right-0 w-1/3" onClick={handleNext}></div>
      </div>
    </div>
  );
}
