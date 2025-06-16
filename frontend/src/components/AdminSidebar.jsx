import React from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminSidebar({ onShowFollowers, onShowRecommendations }) {
  const { admin } = useAdmin();

  return (
    <div className="w-1/5 p-4 bg-white shadow hidden md:block overflow-y-auto h-screen sticky top-16">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 border border-red-200">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <span className="font-medium text-red-800">Mode Admin</span>
            <p className="text-xs text-red-600">Gestion du contenu</p>
          </div>
        </div>

        <div 
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={onShowFollowers}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
            </svg>
          </div>
          <span>Gestion Utilisateurs</span>
        </div>


        
        <div 
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={onShowRecommendations}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <span>Statistiques</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-red-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Actions Admin</h3>
            <p className="text-xs text-red-600">
              Vous pouvez supprimer tout contenu en cliquant sur les icônes de suppression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
