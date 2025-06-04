<?php
header('Content-Type: application/json');
require_once "../config/cors.php";

try {
    require_once "../config/database.php";
    
    // Vérifier la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
        exit;
    }
    
    $userId = $_GET['userId'] ?? null;
    $postId = $_GET['postId'] ?? null;
    
    if (!$userId || !$postId) {
        http_response_code(400);
        echo json_encode(["error" => "userId et postId sont requis"]);
        exit;
    }
    
    // Vérifier si l'utilisateur a liké ce post
    $checkSql = $db->prepare("SELECT COUNT(*) as count FROM liker WHERE ID_USER = ? AND ID_POST = ?");
    $checkSql->execute([$userId, $postId]);
    $result = $checkSql->fetch(PDO::FETCH_ASSOC);
    
    $isLiked = $result['count'] > 0;
    
    // Compter le nombre total de likes pour ce post
    $countSql = $db->prepare("SELECT COUNT(*) as total_likes FROM liker WHERE ID_POST = ?");
    $countSql->execute([$postId]);
    $countResult = $countSql->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "isLiked" => $isLiked,
        "totalLikes" => (int)$countResult['total_likes']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
