<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Activer le rapport d'erreurs pour le débogage
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Définir l'en-tête JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

// Récupérer les données JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Vérifier que les données requises sont présentes
if (empty($data['userId']) || empty($data['currentPassword']) || empty($data['newPassword'])) {
    http_response_code(400);
    echo json_encode(["error" => "Tous les champs sont requis"]);
    exit;
}

$userId = $data['userId'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// Validation du nouveau mot de passe
if (strlen($newPassword) < 7) {
    http_response_code(400);
    echo json_encode(["error" => "Le nouveau mot de passe doit contenir au moins 7 caractères"]);
    exit;
}

try {
    // Récupérer l'utilisateur et son mot de passe actuel
    $sql = "SELECT ID_USER, MDPS FROM user WHERE ID_USER = :userId";
    $stmt = $db->prepare($sql);
    $stmt->execute([':userId' => $userId]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "Utilisateur non trouvé"]);
        exit;
    }
    
    // Vérifier le mot de passe actuel
    if (!password_verify($currentPassword, $user['MDPS'])) {
        http_response_code(401);
        echo json_encode(["error" => "Mot de passe actuel incorrect"]);
        exit;
    }
    
    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (password_verify($newPassword, $user['MDPS'])) {
        http_response_code(400);
        echo json_encode(["error" => "Le nouveau mot de passe doit être différent de l'ancien"]);
        exit;
    }
    
    // Hasher le nouveau mot de passe
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Mettre à jour le mot de passe dans la base de données
    $updateSql = "UPDATE user SET MDPS = :newPassword WHERE ID_USER = :userId";
    $updateStmt = $db->prepare($updateSql);
    $updateResult = $updateStmt->execute([
        ':newPassword' => $hashedNewPassword,
        ':userId' => $userId
    ]);
    
    if ($updateResult) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Mot de passe modifié avec succès"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la mise à jour du mot de passe"]);
    }
    
} catch (PDOException $e) {
    error_log("Erreur de base de données lors du changement de mot de passe: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur lors du changement de mot de passe"]);
} catch (Exception $e) {
    error_log("Erreur générale lors du changement de mot de passe: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur"]);
}
?>
