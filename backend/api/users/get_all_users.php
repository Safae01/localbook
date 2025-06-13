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

try {
    // Récupérer seulement les utilisateurs avec le statut "proprietaire" ou "intermediaire"
    $query = "SELECT
                u.ID_USER as id,
                u.NOM as name,
                u.EMAIL as email,
                u.IMG_PROFIL as avatar,
                u.VILLE as city,
                u.STATUT as status,
                u.DATE_INSCRIPTION as join_date,
                u.DATE_INSCRIPTION as last_active
              FROM user u
              WHERE u.STATUT IN ('proprietaire', 'intermediaire')
              ORDER BY u.NOM ASC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Déterminer le statut en ligne (simulé basé sur la date d'inscription pour l'instant)
        $isOnline = (time() - strtotime($row['last_active'])) < 86400; // 24 heures
        
        $users[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'city' => $row['city'],
            'status' => $row['status'],
            'avatar' => $row['avatar'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['avatar'] : null,
            'isOnline' => $isOnline ? 'online' : 'offline',
            'joinDate' => $row['join_date']
        ];
    }

    echo json_encode([
        'success' => true,
        'users' => $users,
        'total' => count($users)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
