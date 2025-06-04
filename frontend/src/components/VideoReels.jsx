import React, { useState, useRef, useEffect } from 'react';

export default function VideoReels() {
  const [currentReel, setCurrentReel] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  
  const reels = [
    {
      id: 1,
      author: "Sophie Martin",
      avatar: "https://via.placeholder.com/40",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-4704-large.mp4",
      description: "Visite de mon nouvel appartement ! #immobilier #deco",
      likes: 245,
      comments: 37
    },
    {
      id: 2,
      author: "Thomas Dubois",
      avatar: "https://via.placeholder.com/40",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-living-room-interior-4711-large.mp4",
      description: "Rénovation complète de ce studio parisien #renovation #immobilier",
      likes: 189,
      comments: 24
    },
    {
      id: 3,
      author: "Julie Leroy",
      avatar: "https://via.placeholder.com/40",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-real-estate-agent-showing-a-house-to-a-couple-32747-large.mp4",
      description: "Visite guidée avec mes clients #agentimmobilier #visite",
      likes: 312,
      comments: 45
    },
    {
      id: 4,
      author: "Marc Bernard",
      avatar: "https://via.placeholder.com/40",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-white-bedroom-4525-large.mp4",
      description: "Chambre minimaliste dans notre nouvelle maison #deco #minimalisme",
      likes: 156,
      comments: 19
    }
  ];

  // Initialiser les références pour chaque vidéo
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, reels.length);
  }, [reels.length]);

  // Gérer la lecture/pause des vidéos lors du changement de reel
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReel) {
          video.play().catch(e => console.log("Erreur de lecture auto:", e));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentReel]);

  const handleScroll = (e) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollPosition = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);
      
      if (newIndex !== currentReel) {
        setCurrentReel(newIndex);
      }
    }
  };

  const scrollToReel = (index) => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: 'smooth'
      });
      setCurrentReel(index);
    }
  };

  return (
    <main className="flex-1 bg-black overflow-hidden relative">
      {/* Container horizontal pour les reels */}
      <div 
        ref={containerRef}
        className="flex overflow-x-scroll snap-x snap-mandatory h-full scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="min-w-full h-full flex-shrink-0 snap-start relative"
          >
            <video 
              ref={el => videoRefs.current[index] = el}
              src={reel.videoUrl} 
              className="h-full w-full object-contain"
              loop 
              muted
              playsInline
              onClick={() => scrollToReel((index + 1) % reels.length)}
            />
            
            {/* Overlay d'informations */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <img src={reel.avatar} alt={reel.author} className="w-full h-full object-cover" />
                </div>
                <span className="font-medium">{reel.author}</span>
                <button className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700">
                  Suivre
                </button>
              </div>
              
              <p className="mb-3">{reel.description}</p>
              
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                  <span>{reel.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>
                  <span>{reel.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                  <span>Partager</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicateur de progression */}
      <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1 px-4 z-10">
        {reels.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 rounded-full cursor-pointer ${index === currentReel ? 'bg-white w-8' : 'bg-white/40 w-6'}`}
            onClick={() => scrollToReel(index)}
          ></div>
        ))}
      </div>
      
      {/* Boutons de navigation */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-2 text-white hover:bg-white/30 z-10"
        onClick={() => scrollToReel((currentReel - 1 + reels.length) % reels.length)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-2 text-white hover:bg-white/30 z-10"
        onClick={() => scrollToReel((currentReel + 1) % reels.length)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Style pour cacher la scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}



