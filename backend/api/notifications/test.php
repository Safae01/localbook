<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Vérifier si la table notifications existe
    $checkTable = $db->query("SHOW TABLES LIKE 'notifications'");
    $tableExists = $checkTable->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            "success" => false,
            "error" => "La table notifications n'existe pas. Veuillez l'exécuter dans votre base de données.",
            "sql_to_run" => "
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            "
        ]);
        exit;
    }
    
    // Récupérer quelques utilisateurs pour les tests
    $usersSql = $db->query("SELECT ID_USER, NOM FROM user LIMIT 5");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer quelques posts pour les tests
    $postsSql = $db->query("SELECT ID_POST, ID_USER FROM poste LIMIT 5");
    $posts = $postsSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Compter les notifications existantes
    $countSql = $db->query("SELECT COUNT(*) as count FROM notifications");
    $notificationCount = $countSql->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Récupérer quelques notifications récentes
    $recentSql = $db->query("
        SELECT 
            n.ID_NOTIFICATION,
            n.ID_USER_FROM,
            n.ID_USER_TO,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as USER_FROM_NAME,
            u_to.NOM as USER_TO_NAME
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        JOIN user u_to ON n.ID_USER_TO = u_to.ID_USER
        ORDER BY n.DATE_CREATED DESC
        LIMIT 10
    ");
    $recentNotifications = $recentSql->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Test des notifications réussi",
        "data" => [
            "table_exists" => $tableExists,
            "notification_count" => (int)$notificationCount,
            "sample_users" => $users,
            "sample_posts" => $posts,
            "recent_notifications" => $recentNotifications
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
