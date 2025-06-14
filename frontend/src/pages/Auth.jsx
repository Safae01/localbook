import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Updated import

export default function Auth() {
  const { register, login, error, success } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ NOM: '', CIN_NUM: '', STATUT: '', TELE: '', EMAIL: '', MDPS: '', confirmPassword: '' });
  const [cinFile, setCinFile] = useState(null);
  const [cinPreview, setCinPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validation en temps réel pour le mot de passe
    if (name === 'MDPS') {
      if (value.length < 7) {
        setValidationErrors(prev => ({ ...prev, MDPS: 'Le mot de passe doit contenir au moins 7 caractères' }));
      } else {
        setValidationErrors(prev => ({ ...prev, MDPS: '' }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({ ...prev, cinFile: 'Seuls les fichiers image (JPG, PNG, GIF) sont autorisés' }));
        return;
      }

      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors(prev => ({ ...prev, cinFile: 'Le fichier ne doit pas dépasser 10MB' }));
        return;
      }

      setCinFile(file);
      console.log('Fichier CIN sélectionné:', file.name, file.size, file.type);

      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCinPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Effacer l'erreur de validation si une image est sélectionnée
      setValidationErrors(prev => ({ ...prev, cinFile: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les erreurs
    setValidationErrors({});

    // Validations pour l'inscription
    if (!isLogin) {
      const errors = {};

      // Validation des champs obligatoires
      if (!form.NOM.trim()) {
        errors.NOM = 'Le nom complet est requis';
      }

      if (!form.CIN_NUM.trim()) {
        errors.CIN_NUM = 'Le numéro de CIN est requis';
      }

      if (!form.STATUT.trim()) {
        errors.STATUT = 'Le statut est requis';
      }

      if (!form.TELE.trim()) {
        errors.TELE = 'Le numéro de téléphone est requis';
      }

      if (!form.EMAIL.trim()) {
        errors.EMAIL = 'L\'email est requis';
      }

      // Validation du mot de passe (minimum 7 caractères)
      if (!form.MDPS || form.MDPS.length < 7) {
        errors.MDPS = 'Le mot de passe doit contenir au moins 7 caractères';
      }

      // Validation de la confirmation du mot de passe
      if (!form.confirmPassword) {
        errors.confirmPassword = 'La confirmation du mot de passe est requise';
      } else if (form.MDPS !== form.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      // Validation de l'image CIN (obligatoire)
      if (!cinFile) {
        errors.cinFile = 'L\'image de la carte nationale est obligatoire';
      }

      // Si il y a des erreurs, les afficher et arrêter
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        console.log('Erreurs de validation:', errors);
        console.log('Fichier CIN:', cinFile);
        return;
      }
    }

    const body = isLogin
      ? { EMAIL: form.EMAIL, MDPS: form.MDPS }
      : { NOM: form.NOM, CIN_NUM: form.CIN_NUM, STATUT: form.STATUT, TELE: form.TELE, EMAIL: form.EMAIL, MDPS: form.MDPS };

    console.log('Données à envoyer:', body);
    console.log('Fichier CIN à envoyer:', cinFile);

    const result = isLogin ? await login(body) : await register(body, cinFile);
    if (result.success) {
      if (isLogin) {
        setTimeout(() => navigate('/home'), 1500);
      } else {
        // Après inscription réussie, basculer vers le mode login
        setTimeout(() => {
          setIsLogin(true);
          setForm({ NOM: '', CIN_NUM: '', STATUT: '', TELE: '', EMAIL: '', MDPS: '', confirmPassword: '' });
          setCinFile(null);
          setCinPreview(null);
          setValidationErrors({});
        }, 2000);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex items-center space-x-2 p-4">
        <img src="../favicon2.png" alt="Localbook Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-blue-600">Localbook</h1>
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-1">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="h-96 overflow-y-auto pr-2 -mr-2">
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="http://localhost/localbook/backend/api/Uploads/users/684b4af677c51_WhatsApp Image 2024-04-15 à 02.57.52_7d11936d.jpg" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">hamid slaoui</p>
                    <p className="text-xs text-gray-500">il y a 2h</p>
                  </div>
                </div>
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">chambre</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">tanger/birchifa</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">75m²</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">3 pièces</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Meublé</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">250dh/nuit</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Wifi</span>
                  </div>
                </div>
                <p className="text-sm mb-2">recherche pour des locataires de familles</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="http://localhost/localbook/backend/api/Uploads/posts/684b462e08cae_salon-Maroua-Ihrai2.jpg" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>120 j'aime</span>
                  <span>3 commentaires</span>
                </div>
              </div>

              {/* Post 2 */}
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="http://localhost/localbook/backend/api/Uploads/users/684b4b1971e84_téléchargement.jpg" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ahmed Benali</p>
                    <p className="text-xs text-gray-500">il y a 4h</p>
                  </div>
                </div>
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Vente</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">850000€</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">120m²</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">4 pièces</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Casablanca</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Garage</span>
                  </div>
                </div>
                <p className="text-sm mb-2">Magnifique appartement avec vue sur mer, proche de toutes commodités.</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="http://localhost/localbook/backend/api/Uploads/posts/684b462e09170_images.jpg" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>8 j'aime</span>
                  <span>2 commentaires</span>
                </div>
              </div>

              {/* Post 3 */}
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="http://localhost/localbook/backend/api/Uploads/users/684c88d7b25a5_549d374_2015-05-24T140743Z_01_TOR903_RTRIDSP_3_PEOPLE-NASH.jpg" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sarah Martin</p>
                    <p className="text-xs text-gray-500">il y a 6h</p>
                  </div>
                </div>
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Colocation</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">600€/mois</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">25m²</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">1 chambre</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Lyon</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">Wifi</span>
                  </div>
                </div>
                <p className="text-sm mb-2">Chambre dans colocation sympa, ambiance étudiante garantie !</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="http://localhost/localbook/backend/api/Uploads/posts/684b533443bc6_salon-Maroua-Ihrai2.jpg" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>15 j'aime</span>
                  <span>7 commentaires</span>
                </div>
              </div>

              {/* Post 4 */}
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img src="http://localhost/localbook/backend/api/Uploads/users/6841efae7f295_1600w-VwJMC37j5jQ.webp" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Karim Alaoui</p>
                    <p className="text-xs text-gray-500">il y a 1j</p>
                  </div>
                </div>
                <div className="mb-2 py-2 border-y border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Location</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">2500€/mois</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">200m²</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">5 pièces</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Rabat</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Jardin</span>
                  </div>
                </div>
                <p className="text-sm mb-2">Villa spacieuse avec jardin, parfaite pour une famille.</p>
                <div className="rounded-lg overflow-hidden h-32 bg-gray-200">
                  <img src="http://localhost/localbook/backend/api/Uploads/posts/6841cb3c6df93_5183000.jpg" alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>20 j'aime</span>
                  <span>5 commentaires</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-10 md:hidden">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img src="../favicon2.png" alt="Localbook Logo" className="w-10 h-10" />
                <h1 className="text-3xl font-bold text-blue-600">Localbook</h1>
              </div>
              <p className="mt-2 text-gray-600">Connectez-vous avec vos amis et le monde qui vous entoure.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Connexion' : 'Inscription'}</h2>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {success && <p className="text-green-500 text-center mb-4">{success}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <input
                        type="text"
                        id="name"
                        name="NOM"
                        value={form.NOM}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez votre nom complet"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cin" className="block text-sm font-medium text-gray-700">Numéro de CIN</label>
                      <input
                        type="text"
                        id="cin"
                        name="CIN_NUM"
                        value={form.CIN_NUM}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Entrez votre numéro de CIN"
                        required
                      />
                      {validationErrors.CIN_NUM && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.CIN_NUM}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="statut"
                        name="STATUT"
                        value={form.STATUT}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.STATUT ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Sélectionnez votre statut</option>
                        <option value="Étudiant">Propriétaire</option>
                        <option value="Employé">client</option>
                        <option value="Entrepreneur">intermédiaire</option>
                        
                      </select>
                      {validationErrors.STATUT && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.STATUT}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="TELE"
                        value={form.TELE}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          validationErrors.TELE ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 06 12 34 56 78"
                        required
                      />
                      {validationErrors.TELE && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.TELE}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cin-image" className="block text-sm font-medium text-gray-700">
                        Image de la carte nationale <span className="text-red-500">*</span>
                      </label>
                      {cinPreview ? (
                        <div className="mt-1 relative">
                          <img
                            src={cinPreview}
                            alt="Prévisualisation CIN"
                            className="w-full h-48 object-cover rounded-md border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCinPreview(null);
                              setCinFile(null);
                              // Réinitialiser les deux inputs de fichier
                              const input1 = document.getElementById('cin-file-upload');
                              const input2 = document.getElementById('cin-file-upload-change');
                              if (input1) input1.value = '';
                              if (input2) input2.value = '';
                              // Effacer l'erreur de validation
                              setValidationErrors(prev => ({ ...prev, cinFile: '' }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="mt-2 text-center">
                            <label htmlFor="cin-file-upload-change" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
                              Changer l'image
                              <input id="cin-file-upload-change" name="cin-file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="cin-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Télécharger un fichier</span>
                                <input id="cin-file-upload" name="cin-file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                              </label>
                              <p className="pl-1">ou glisser-déposer</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                          </div>
                        </div>
                      )}
                      {validationErrors.cinFile && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.cinFile}</p>
                      )}
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="EMAIL"
                    value={form.EMAIL}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez votre email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe {!isLogin && <span className="text-red-500">*</span>}
                    {!isLogin && <span className="text-sm text-gray-500">(minimum 7 caractères)</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="MDPS"
                    value={form.MDPS}
                    onChange={handleChange}
                    minLength={!isLogin ? 7 : undefined}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.MDPS ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  {validationErrors.MDPS && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.MDPS}</p>
                  )}
                </div>
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirmez votre mot de passe"
                      required
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  
                </div>
                
              </div>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Pas encore de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






