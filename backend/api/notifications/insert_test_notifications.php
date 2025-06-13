<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Vérifier si la table notifications existe, sinon la créer
    $checkTable = $db->query("SHOW TABLES LIKE 'notifications'");
    if ($checkTable->rowCount() == 0) {
        $createTableSQL = "
            CREATE TABLE IF NOT EXISTS `notifications` (
              `ID_NOTIFICATION` int(11) NOT NULL AUTO_INCREMENT,
              `ID_USER_FROM` int(11) NOT NULL COMMENT 'Utilisateur qui fait l\'action',
              `ID_USER_TO` int(11) NOT NULL COMMENT 'Utilisateur qui reçoit la notification',
              `ID_POST` int(11) DEFAULT NULL COMMENT 'Post concerné (pour likes, commentaires)',
              `TYPE_NOTIFICATION` enum('like','comment','follow','mention') NOT NULL,
              `MESSAGE` text NOT NULL COMMENT 'Message de la notification',
              `IS_READ` tinyint(1) DEFAULT 0 COMMENT '0 = non lu, 1 = lu',
              `DATE_CREATED` timestamp NOT NULL DEFAULT current_timestamp(),
              PRIMARY KEY (`ID_NOTIFICATION`),
              KEY `FK_NOTIFICATION_USER_FROM` (`ID_USER_FROM`),
              KEY `FK_NOTIFICATION_USER_TO` (`ID_USER_TO`),
              KEY `FK_NOTIFICATION_POST` (`ID_POST`),
              KEY `IDX_USER_TO_READ` (`ID_USER_TO`, `IS_READ`),
              KEY `IDX_DATE_CREATED` (`DATE_CREATED`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ";
        $db->exec($createTableSQL);
        echo json_encode(["message" => "Table notifications créée"]);
    }

    // Récupérer les utilisateurs existants
    $usersSql = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER LIMIT 10");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les posts existants
    $postsSql = $db->query("SELECT ID_POST, ID_USER FROM poste ORDER BY ID_POST LIMIT 10");
    $posts = $postsSql->fetchAll(PDO::FETCH_ASSOC);

    if (count($users) < 2) {
        echo json_encode([
            "success" => false,
            "error" => "Pas assez d'utilisateurs dans la base de données pour créer des notifications de test"
        ]);
        exit;
    }

    if (count($posts) < 1) {
        echo json_encode([
            "success" => false,
            "error" => "Pas de posts dans la base de données pour créer des notifications de test"
        ]);
        exit;
    }

    // Supprimer les anciennes notifications de test
    $db->exec("DELETE FROM notifications WHERE MESSAGE LIKE '%test%'");

    // Créer des notifications de test
    $testNotifications = [];
    
    // Notification 1: Like
    if (count($users) >= 2 && count($posts) >= 1) {
        $insertSql = $db->prepare("
            INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
            VALUES (?, ?, ?, 'like', 'a aimé votre publication', NOW() - INTERVAL 5 MINUTE)
        ");
        $insertSql->execute([$users[0]['ID_USER'], $users[1]['ID_USER'], $posts[0]['ID_POST']]);
        $testNotifications[] = "Like de " . $users[0]['NOM'] . " vers " . $users[1]['NOM'];
    }

    // Notification 2: Comment
    if (count($users) >= 2 && count($posts) >= 1) {
        $insertSql = $db->prepare("
            INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
            VALUES (?, ?, ?, 'comment', 'a commenté votre publication', NOW() - INTERVAL 15 MINUTE)
        ");
        $insertSql->execute([$users[1]['ID_USER'], $users[0]['ID_USER'], $posts[0]['ID_POST']]);
        $testNotifications[] = "Commentaire de " . $users[1]['NOM'] . " vers " . $users[0]['NOM'];
    }

    // Notification 3: Follow (si on a plus d'utilisateurs)
    if (count($users) >= 3) {
        $insertSql = $db->prepare("
            INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED) 
            VALUES (?, ?, NULL, 'follow', 'a commencé à vous suivre', NOW() - INTERVAL 1 HOUR)
        ");
        $insertSql->execute([$users[2]['ID_USER'], $users[0]['ID_USER']]);
        $testNotifications[] = "Follow de " . $users[2]['NOM'] . " vers " . $users[0]['NOM'];
    }

    echo json_encode([
        "success" => true,
        "message" => "Notifications de test créées avec succès",
        "created_notifications" => $testNotifications,
        "users_available" => $users,
        "posts_available" => $posts
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
