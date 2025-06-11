<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Récupérer les données JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

$follower_id = isset($input['follower_id']) ? $input['follower_id'] : null;
$followed_id = isset($input['followed_id']) ? $input['followed_id'] : null;

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
    
    $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($exists['count'] == 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Follow relationship not found']);
        exit;
    }
    
    // Supprimer la relation de suivi
    $deleteQuery = "DELETE FROM follow WHERE id_follower = :follower_id AND id_user = :followed_id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':follower_id', $follower_id);
    $deleteStmt->bindParam(':followed_id', $followed_id);
    $deleteStmt->execute();
    
    if ($deleteStmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Successfully unfollowed user'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to unfollow user'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
