<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Récupérer tous les utilisateurs
    $usersSql = $db->query("SELECT ID_USER, NOM, EMAIL FROM user ORDER BY ID_USER");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer toutes les notifications
    $notifSql = $db->query("
        SELECT 
            n.ID_NOTIFICATION,
            n.ID_USER_FROM,
            n.ID_USER_TO,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as FROM_NAME,
            u_to.NOM as TO_NAME
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        JOIN user u_to ON n.ID_USER_TO = u_to.ID_USER
        ORDER BY n.DATE_CREATED DESC
    ");
    $notifications = $notifSql->fetchAll(PDO::FETCH_ASSOC);
    
    // Compter les notifications par utilisateur
    $countSql = $db->query("
        SELECT 
            ID_USER_TO,
            u.NOM,
            COUNT(*) as notification_count
        FROM notifications n
        JOIN user u ON n.ID_USER_TO = u.ID_USER
        GROUP BY ID_USER_TO, u.NOM
        ORDER BY notification_count DESC
    ");
    $notificationCounts = $countSql->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "data" => [
            "all_users" => $users,
            "all_notifications" => $notifications,
            "notification_counts_by_user" => $notificationCounts,
            "total_users" => count($users),
            "total_notifications" => count($notifications)
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
