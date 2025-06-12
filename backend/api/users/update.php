<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Récupérer l'ID de l'utilisateur
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : null;

    if (!$userId) {
        throw new Exception("ID utilisateur manquant");
    }

    // Créer le dossier uploads s'il n'existe pas
    $uploadDir = __DIR__ . '/../Uploads/users/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("Impossible de créer le dossier d'upload");
        }
        chmod($uploadDir, 0777);
    }

    // Vérifier si le dossier est accessible en écriture
    if (!is_writable($uploadDir)) {
        throw new Exception("Le dossier d'upload n'est pas accessible en écriture");
    }

    // Traiter les fichiers uploadés
    $imgProfil = null;
    $imgCouvert = null;
    $cinImg = null;

    if (isset($_FILES['IMG_PROFIL']) && $_FILES['IMG_PROFIL']['error'] === UPLOAD_ERR_OK) {
        $imgProfil = uniqid() . '_' . basename($_FILES['IMG_PROFIL']['name']);
        move_uploaded_file($_FILES['IMG_PROFIL']['tmp_name'], $uploadDir . $imgProfil);
    }

    if (isset($_FILES['IMG_COUVERT']) && $_FILES['IMG_COUVERT']['error'] === UPLOAD_ERR_OK) {
        $imgCouvert = uniqid() . '_' . basename($_FILES['IMG_COUVERT']['name']);
        move_uploaded_file($_FILES['IMG_COUVERT']['tmp_name'], $uploadDir . $imgCouvert);
    }

    if (isset($_FILES['CIN_IMG']) && $_FILES['CIN_IMG']['error'] === UPLOAD_ERR_OK) {
        $cinImg = uniqid() . '_' . basename($_FILES['CIN_IMG']['name']);
        $cinUploadDir = __DIR__ . '/../Uploads/';
        if (!file_exists($cinUploadDir)) {
            mkdir($cinUploadDir, 0777, true);
        }
        move_uploaded_file($_FILES['CIN_IMG']['tmp_name'], $cinUploadDir . $cinImg);
    }

    // Préparer la requête SQL
    $updateFields = [];
    $params = [];

    // Mapper les champs du formulaire avec la base de données
    $fieldMap = [
        'NOM' => 'NOM',
        'CIN_NUM' => 'CIN_NUM',
        'EMAIL' => 'EMAIL',
        'BIO' => 'BIO',
        'STATUT' => 'STATUT',
        'VILLE' => 'VILLE',
        'AGE' => 'AGE',
        'DATE_NAISSANCE' => 'DATE_NAISSANCE',
        'TELE' => 'TELE',

    ];

    foreach ($fieldMap as $postKey => $dbField) {
        if (isset($_POST[$postKey])) {
            $updateFields[] = "$dbField = :$dbField";
            $params[":$dbField"] = $_POST[$postKey];
        }
    }

    // Ajouter les chemins des images si elles ont été uploadées
    if ($imgProfil) {
        $updateFields[] = "IMG_PROFIL = :IMG_PROFIL";
        $params[':IMG_PROFIL'] = $imgProfil;
    }

    if ($imgCouvert) {
        $updateFields[] = "IMG_COUVERT = :IMG_COUVERT";
        $params[':IMG_COUVERT'] = $imgCouvert;
    }

    if ($cinImg) {
        $updateFields[] = "CIN_IMG = :CIN_IMG";
        $params[':CIN_IMG'] = $cinImg;
    }

    if (empty($updateFields)) {
        throw new Exception("Aucune donnée à mettre à jour");
    }

    // Ajouter l'ID utilisateur aux paramètres
    $params[':ID_USER'] = $userId;

    // Construire et exécuter la requête
    $sql = "UPDATE user SET " . implode(", ", $updateFields) . " WHERE ID_USER = :ID_USER";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    // Récupérer les données mises à jour
    $sql = "SELECT * FROM user WHERE ID_USER = :ID_USER";
    $stmt = $db->prepare($sql);
    $stmt->execute([':ID_USER' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Profil mis à jour avec succès",
        "user" => $user
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}