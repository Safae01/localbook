import React, { useState, useEffect } from 'react';
import AnnonceService from '../services/AnnonceService';
import UserService from '../services/UserService';

export default function AdminRecommendations() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalStories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger les statistiques
      const [usersResult, postsResult] = await Promise.all([
        UserService.getAllUsers(true), // true pour admin
        AnnonceService.getAnnonces()
      ]);

      setStats({
        totalUsers: usersResult.success ? usersResult.users.length : 0,
        totalPosts: postsResult.success ? postsResult.annonces.length : 0,
        totalStories: 0   // À implémenter si nécessaire
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-600">Statistiques de la Plateforme</h2>
          <p className="text-gray-600 mt-1">Vue d'ensemble des données de la plateforme</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statistique Utilisateurs */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Utilisateurs</p>
                  <p className="text-2xl font-semibold text-blue-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Statistique Posts */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Posts</p>
                  <p className="text-2xl font-semibold text-green-900">{stats.totalPosts}</p>
                </div>
              </div>
            </div>



            {/* Statistique Stories */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Stories</p>
                  <p className="text-2xl font-semibold text-purple-900">{stats.totalStories}</p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
