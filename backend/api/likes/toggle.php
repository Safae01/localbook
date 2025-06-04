<?php
header('Content-Type: application/json');
require_once "../config/cors.php";

try {
    require_once "../config/database.php";
    
    // Vérifier la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
        exit;
    }
    
    // Récupérer les données JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Données JSON invalides"]);
        exit;
    }
    
    $userId = $input['userId'] ?? null;
    $postId = $input['postId'] ?? null;
    
    if (!$userId || !$postId) {
        http_response_code(400);
        echo json_encode(["error" => "userId et postId sont requis"]);
        exit;
    }
    
    // Vérifier si l'utilisateur a déjà liké ce post
    $checkSql = $db->prepare("SELECT COUNT(*) as count FROM liker WHERE ID_USER = ? AND ID_POST = ?");
    $checkSql->execute([$userId, $postId]);
    $result = $checkSql->fetch(PDO::FETCH_ASSOC);
    
    $isLiked = $result['count'] > 0;
    
    if ($isLiked) {
        // Supprimer le like (unlike)
        $deleteSql = $db->prepare("DELETE FROM liker WHERE ID_USER = ? AND ID_POST = ?");
        $deleteSql->execute([$userId, $postId]);
        $action = 'unliked';
    } else {
        // Ajouter le like
        $insertSql = $db->prepare("INSERT INTO liker (ID_USER, ID_POST, DATE_LIKE) VALUES (?, ?, NOW())");
        $insertSql->execute([$userId, $postId]);
        $action = 'liked';
    }
    
    // Compter le nombre total de likes pour ce post
    $countSql = $db->prepare("SELECT COUNT(*) as total_likes FROM liker WHERE ID_POST = ?");
    $countSql->execute([$postId]);
    $countResult = $countSql->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "action" => $action,
        "isLiked" => !$isLiked,
        "totalLikes" => (int)$countResult['total_likes'],
        "message" => $action === 'liked' ? "Post liké avec succès" : "Like retiré avec succès"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
