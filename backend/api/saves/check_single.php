<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

if (!isset($_GET['user_id']) || !isset($_GET['post_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "user_id et post_id requis"]);
    exit;
}

try {
    $userId = $_GET['user_id'];
    $postId = $_GET['post_id'];
    
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM enregistrer WHERE ID_USER = ? AND ID_POST = ?");
    $stmt->execute([$userId, $postId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "is_saved" => $result['count'] > 0
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
