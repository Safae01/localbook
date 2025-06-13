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
    
    $userFrom = $input['user_from'] ?? null;
    $userTo = $input['user_to'] ?? null;
    $postId = $input['post_id'] ?? null;
    $type = $input['type'] ?? null;
    $message = $input['message'] ?? null;
    
    // Validation des données requises
    if (!$userFrom || !$userTo || !$type || !$message) {
        http_response_code(400);
        echo json_encode(["error" => "user_from, user_to, type et message sont requis"]);
        exit;
    }
    
    // Vérifier que les types de notification sont valides
    $validTypes = ['like', 'comment', 'follow', 'mention'];
    if (!in_array($type, $validTypes)) {
        http_response_code(400);
        echo json_encode(["error" => "Type de notification invalide"]);
        exit;
    }
    
    // Ne pas créer de notification si l'utilisateur se notifie lui-même
    if ($userFrom == $userTo) {
        echo json_encode([
            "success" => true,
            "message" => "Notification ignorée (auto-notification)"
        ]);
        exit;
    }
    
    // Vérifier si une notification similaire existe déjà récemment (éviter les doublons)
    if ($postId) {
        $checkSql = $db->prepare("
            SELECT COUNT(*) as count 
            FROM notifications 
            WHERE ID_USER_FROM = ? 
            AND ID_USER_TO = ? 
            AND ID_POST = ? 
            AND TYPE_NOTIFICATION = ? 
            AND DATE_CREATED > DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ");
        $checkSql->execute([$userFrom, $userTo, $postId, $type]);
        $existingCount = $checkSql->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($existingCount > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Notification similaire déjà existante"
            ]);
            exit;
        }
    }
    
    // Insérer la notification
    $sql = $db->prepare("
        INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $result = $sql->execute([$userFrom, $userTo, $postId, $type, $message]);
    
    if (!$result) {
        throw new PDOException("Échec de la création de la notification");
    }
    
    $notificationId = $db->lastInsertId();
    
    echo json_encode([
        "success" => true,
        "message" => "Notification créée avec succès",
        "notification_id" => $notificationId
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
