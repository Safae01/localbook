import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import UserService from '../services/UserService';

export default function AdminContacts() {
  const { admin, deleteUser } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await UserService.getAllUsers(true); // true pour admin
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !admin) return;

    try {
      const result = await deleteUser(userToDelete.ID_USER);
      if (result.success) {
        setUsers(prevUsers => prevUsers.filter(user => user.ID_USER !== userToDelete.ID_USER));
        setShowDeleteModal(false);
        setUserToDelete(null);
        alert('Utilisateur supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
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
          <h2 className="text-xl font-semibold text-red-600">Gestion des Utilisateurs</h2>
          <p className="text-gray-600 mt-1">Gérer tous les utilisateurs de la plateforme</p>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {users.map(user => (
              <div key={user.ID_USER} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.IMG_PROFIL ? `http://localhost/localbook/backend/api/Uploads/users/${user.IMG_PROFIL}` : "https://via.placeholder.com/48"}
                    alt={user.NOM}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.NOM}</h3>
                    <p className="text-sm text-gray-500">{user.EMAIL}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.STATUT === 'proprietaire' ? 'bg-blue-100 text-blue-800' :
                        user.STATUT === 'intermediaire' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.STATUT}
                      </span>
                      {user.VILLE && (
                        <span className="text-xs text-gray-500">• {user.VILLE}</span>
                      )}
                      {user.TELE && (
                        <span className="text-xs text-gray-500">• {user.TELE}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Inscrit le {new Date(user.DATE_INSCRIPTION).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => confirmDeleteUser(user)}
                    className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                    title="Supprimer cet utilisateur"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur trouvé.
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-2">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.NOM}</strong> ?
            </p>
            <p className="text-sm text-red-600 mb-6">
              Cette action supprimera définitivement l'utilisateur et toutes ses données (posts, commentaires, etc.). Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
