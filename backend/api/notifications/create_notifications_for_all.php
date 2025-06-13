<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Récupérer tous les utilisateurs
    $usersSql = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer quelques posts
    $postsSql = $db->query("SELECT ID_POST, ID_USER FROM poste ORDER BY ID_POST LIMIT 5");
    $posts = $postsSql->fetchAll(PDO::FETCH_ASSOC);

    if (count($users) < 2) {
        echo json_encode([
            "success" => false,
            "error" => "Pas assez d'utilisateurs dans la base de données"
        ]);
        exit;
    }

    // Supprimer les anciennes notifications
    $db->exec("DELETE FROM notifications");
    
    $createdNotifications = [];
    
    // Créer des notifications pour chaque utilisateur
    foreach ($users as $index => $user) {
        // Créer 2-3 notifications pour chaque utilisateur
        $otherUsers = array_filter($users, function($u) use ($user) {
            return $u['ID_USER'] != $user['ID_USER'];
        });
        
        if (count($otherUsers) > 0) {
            $otherUser1 = array_values($otherUsers)[0];
            $otherUser2 = count($otherUsers) > 1 ? array_values($otherUsers)[1] : $otherUser1;
            
            // Notification 1: Like
            if (count($posts) > 0) {
                $insertSql = $db->prepare("
                    INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
                    VALUES (?, ?, ?, 'like', 'a aimé votre publication', NOW() - INTERVAL ? MINUTE)
                ");
                $insertSql->execute([$otherUser1['ID_USER'], $user['ID_USER'], $posts[0]['ID_POST'], rand(5, 60)]);
                $createdNotifications[] = $otherUser1['NOM'] . " a aimé la publication de " . $user['NOM'];
            }
            
            // Notification 2: Comment
            if (count($posts) > 0) {
                $insertSql = $db->prepare("
                    INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
                    VALUES (?, ?, ?, 'comment', 'a commenté votre publication', NOW() - INTERVAL ? HOUR)
                ");
                $insertSql->execute([$otherUser2['ID_USER'], $user['ID_USER'], $posts[0]['ID_POST'], rand(1, 12)]);
                $createdNotifications[] = $otherUser2['NOM'] . " a commenté la publication de " . $user['NOM'];
            }
            
            // Notification 3: Follow
            $insertSql = $db->prepare("
                INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
                VALUES (?, ?, NULL, 'follow', 'a commencé à vous suivre', NOW() - INTERVAL ? DAY)
            ");
            $insertSql->execute([$otherUser1['ID_USER'], $user['ID_USER'], rand(1, 3)]);
            $createdNotifications[] = $otherUser1['NOM'] . " suit maintenant " . $user['NOM'];
        }
    }
    
    // Compter les notifications créées
    $countSql = $db->query("SELECT COUNT(*) as count FROM notifications");
    $totalNotifications = $countSql->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo json_encode([
        "success" => true,
        "message" => "Notifications créées pour tous les utilisateurs",
        "total_notifications_created" => (int)$totalNotifications,
        "users_processed" => count($users),
        "sample_notifications" => array_slice($createdNotifications, 0, 10)
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
