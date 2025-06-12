<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$follower_id = isset($_GET['follower_id']) ? $_GET['follower_id'] : null;
$followed_id = isset($_GET['followed_id']) ? $_GET['followed_id'] : null;

if (!$follower_id || !$followed_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'follower_id and followed_id are required']);
    exit;
}

try {
    // Vérifier si la relation existe
    $checkQuery = "SELECT COUNT(*) as count FROM follow WHERE id_follower = :follower_id AND id_user = :followed_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':follower_id', $follower_id);
    $checkStmt->bindParam(':followed_id', $followed_id);
    $checkStmt->execute();
    
    $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'is_following' => $result['count'] > 0
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
