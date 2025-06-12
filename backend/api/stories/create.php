<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Désactiver l'affichage des erreurs PHP dans la sortie
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Inclure la configuration de la base de données
require_once __DIR__ . '/../config/database.php';

try {
    // Vérifier si tous les champs requis sont présents
    if (!isset($_POST['user_id']) || !isset($_FILES['story_file'])) {
        throw new Exception('Les champs user_id et story_file sont requis');
    }

    $user_id = $_POST['user_id'];
    $file = $_FILES['story_file'];

    // Vérifier le type de fichier
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou MP4');
    }

    // Vérifier la taille du fichier (max 100MB)
    if ($file['size'] > 100 * 1024 * 1024) {
        throw new Exception('Fichier trop volumineux. Maximum: 100MB');
    }

    // Créer le dossier s'il n'existe pas
    $target_dir = __DIR__ . "/../Uploads/stories/";
    if (!file_exists($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            throw new Exception('Impossible de créer le dossier de destination');
        }
    }

    // Générer un nom de fichier unique
    $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '_' . time() . '.' . $file_extension;
    $target_file = $target_dir . $file_name;

    // Déplacer le fichier
    if (!move_uploaded_file($file['tmp_name'], $target_file)) {
        throw new Exception('Erreur lors du téléchargement du fichier');
    }

    // Récupérer les informations de l'utilisateur avant l'insertion
    $user_query = "SELECT NOM, IMG_PROFIL FROM USER WHERE ID_USER = ?";
    $user_stmt = $db->prepare($user_query);
    $user_stmt->execute([$user_id]);
    $user_data = $user_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_data) {
        throw new Exception('Utilisateur non trouvé');
    }

    // Récupérer un ID_ADMIN
    $admin_query = "SELECT ID_ADMIN FROM ADMIN LIMIT 1";
    $admin_stmt = $db->query($admin_query);
    $admin_data = $admin_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin_data) {
        throw new Exception('Aucun admin trouvé dans la base de données');
    }

    $admin_id = $admin_data['ID_ADMIN'];

    // Insérer dans la base de données
    $query = "INSERT INTO STORY (ID_USER, ID_ADMIN, CONTENT, DATE_STORY) VALUES (?, ?, ?, NOW())";
    $stmt = $db->prepare($query);

    if (!$stmt->execute([$user_id, $admin_id, $file_name])) {
        // Supprimer le fichier si l'insertion échoue
        unlink($target_file);
        throw new Exception('Erreur lors de l\'insertion dans la base de données');
    }

    echo json_encode([
        'success' => true,
        'story' => [
            'ID_STORY' => $db->lastInsertId(),
            'ID_USER' => $user_id,
            'CONTENT' => $file_name,
            'AUTHOR_NAME' => $user_data['NOM'],
            'AUTHOR_AVATAR' => $user_data['IMG_PROFIL'],
            'DATE_STORY' => date('Y-m-d H:i:s')
        ]
    ]);

} catch (Exception $e) {
    // Log l'erreur dans un fichier pour le débogage
    error_log("Story create error: " . $e->getMessage());

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}