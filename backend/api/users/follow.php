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

// Vérifier qu'on ne suit pas soi-même
if ($follower_id == $followed_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Cannot follow yourself']);
    exit;
}

try {
    // Vérifier si la relation existe déjà
    $checkQuery = "SELECT COUNT(*) as count FROM follow WHERE id_follower = :follower_id AND id_user = :followed_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':follower_id', $follower_id);
    $checkStmt->bindParam(':followed_id', $followed_id);
    $checkStmt->execute();
    
    $exists = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($exists['count'] > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Already following this user']);
        exit;
    }
    
    // Vérifier que les deux utilisateurs existent
    $userCheckQuery = "SELECT COUNT(*) as count FROM user WHERE ID_USER IN (:follower_id, :followed_id)";
    $userCheckStmt = $db->prepare($userCheckQuery);
    $userCheckStmt->bindParam(':follower_id', $follower_id);
    $userCheckStmt->bindParam(':followed_id', $followed_id);
    $userCheckStmt->execute();
    
    $userExists = $userCheckStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($userExists['count'] < 2) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'One or both users not found']);
        exit;
    }
    
    // Ajouter la relation de suivi
    $insertQuery = "INSERT INTO follow (id_follower, id_user, date_follow) VALUES (:follower_id, :followed_id, NOW())";
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':follower_id', $follower_id);
    $insertStmt->bindParam(':followed_id', $followed_id);
    $insertStmt->execute();
    
    if ($insertStmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Successfully followed user'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to follow user'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
