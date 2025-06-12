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

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    require_once '../config/database.php';

    // Get list of users that follow the current user (followers)
    $query = "SELECT u.ID_USER as id, u.NOM as username, u.IMG_PROFIL as avatar, u.DATE_INSCRIPTION as last_active
              FROM user u
              INNER JOIN follow f ON u.ID_USER = f.id_follower
              WHERE f.id_user = :user_id
              ORDER BY u.NOM";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $followers = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $isOnline = (time() - strtotime($row['last_active'])) < 86400; // 24 hours (since we don't have real last_active)
        $followers[] = [
            'id' => $row['id'],
            'name' => $row['username'],
            'avatar' => $row['avatar'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['avatar'] : null,
            'status' => $isOnline ? 'online' : 'offline'
        ];
    }

    echo json_encode([
        'success' => true,
        'followers' => $followers
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
