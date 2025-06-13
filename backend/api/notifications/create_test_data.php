<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Récupérer quelques utilisateurs
    $usersSql = $db->query("SELECT ID_USER, NOM FROM user LIMIT 5");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer quelques posts
    $postsSql = $db->query("SELECT ID_POST, ID_USER FROM poste LIMIT 5");
    $posts = $postsSql->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) < 2 || count($posts) < 1) {
        echo json_encode([
            "success" => false,
            "error" => "Pas assez d'utilisateurs ou de posts pour créer des notifications de test"
        ]);
        exit;
    }
    
    // Créer quelques notifications de test
    $testNotifications = [
        [
            'user_from' => $users[0]['ID_USER'],
            'user_to' => $users[1]['ID_USER'],
            'post_id' => $posts[0]['ID_POST'],
            'type' => 'like',
            'message' => 'a aimé votre publication'
        ],
        [
            'user_from' => $users[1]['ID_USER'],
            'user_to' => $users[0]['ID_USER'],
            'post_id' => $posts[0]['ID_POST'],
            'type' => 'comment',
            'message' => 'a commenté votre publication'
        ]
    ];
    
    $createdNotifications = [];
    
    foreach ($testNotifications as $notif) {
        // Vérifier si une notification similaire existe déjà
        $checkSql = $db->prepare("
            SELECT COUNT(*) as count 
            FROM notifications 
            WHERE ID_USER_FROM = ? 
            AND ID_USER_TO = ? 
            AND ID_POST = ? 
            AND TYPE_NOTIFICATION = ?
        ");
        $checkSql->execute([$notif['user_from'], $notif['user_to'], $notif['post_id'], $notif['type']]);
        $exists = $checkSql->fetch(PDO::FETCH_ASSOC)['count'] > 0;
        
        if (!$exists) {
            $insertSql = $db->prepare("
                INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
                VALUES (?, ?, ?, ?, ?, NOW())
            ");
            $result = $insertSql->execute([$notif['user_from'], $notif['user_to'], $notif['post_id'], $notif['type'], $notif['message']]);
            
            if ($result) {
                $createdNotifications[] = [
                    'id' => $db->lastInsertId(),
                    'from_user' => $users[array_search($notif['user_from'], array_column($users, 'ID_USER'))]['NOM'],
                    'to_user' => $users[array_search($notif['user_to'], array_column($users, 'ID_USER'))]['NOM'],
                    'type' => $notif['type'],
                    'message' => $notif['message']
                ];
            }
        }
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Notifications de test créées",
        "created_notifications" => $createdNotifications,
        "available_users" => $users,
        "available_posts" => $posts
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
