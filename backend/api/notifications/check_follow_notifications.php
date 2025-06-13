<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Récupérer toutes les notifications de type 'follow'
    $sql = $db->query("
        SELECT 
            n.ID_NOTIFICATION,
            n.ID_USER_FROM,
            n.ID_USER_TO,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as FROM_USER,
            u_to.NOM as TO_USER
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        JOIN user u_to ON n.ID_USER_TO = u_to.ID_USER
        WHERE n.TYPE_NOTIFICATION = 'follow'
        ORDER BY n.DATE_CREATED DESC
        LIMIT 10
    ");
    $followNotifications = $sql->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer aussi quelques autres notifications pour comparaison
    $sql2 = $db->query("
        SELECT 
            n.ID_NOTIFICATION,
            n.ID_USER_FROM,
            n.ID_USER_TO,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as FROM_USER,
            u_to.NOM as TO_USER
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        JOIN user u_to ON n.ID_USER_TO = u_to.ID_USER
        ORDER BY n.DATE_CREATED DESC
        LIMIT 20
    ");
    $allNotifications = $sql2->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "follow_notifications" => $followNotifications,
        "all_recent_notifications" => $allNotifications,
        "total_follow_notifications" => count($followNotifications)
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
