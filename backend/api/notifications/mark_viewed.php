<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Récupérer les données JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Données JSON invalides"]);
        exit;
    }
    
    $userId = $input['user_id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id est requis"]);
        exit;
    }
    
    // Marquer toutes les notifications comme vues pour cet utilisateur
    // On va utiliser le champ IS_READ pour indiquer que les notifications ont été vues
    $sql = $db->prepare("UPDATE notifications SET IS_READ = 1 WHERE ID_USER_TO = ? AND IS_READ = 0");
    $result = $sql->execute([$userId]);
    
    if ($result) {
        // Compter combien de notifications ont été marquées comme vues
        $affectedRows = $sql->rowCount();
        
        echo json_encode([
            "success" => true,
            "message" => "Notifications marquées comme vues",
            "notifications_marked" => $affectedRows
        ]);
    } else {
        throw new PDOException("Échec de la mise à jour des notifications");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
