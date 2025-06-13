<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "user_id est requis"]);
        exit;
    }
    
    // Valider et sécuriser les paramètres limit et offset
    $limit = max(1, min(100, (int)$limit)); // Entre 1 et 100
    $offset = max(0, (int)$offset); // Minimum 0

    // Récupérer les notifications avec les informations des utilisateurs
    $sql = $db->prepare("
        SELECT
            n.ID_NOTIFICATION,
            n.ID_USER_FROM,
            n.ID_USER_TO,
            n.ID_POST,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as USER_FROM_NAME,
            u_from.IMG_PROFIL as USER_FROM_AVATAR,
            p.TYPE_LOC,
            p.VILLE,
            p.POST_IMG
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        LEFT JOIN poste p ON n.ID_POST = p.ID_POST
        WHERE n.ID_USER_TO = ?
        ORDER BY n.DATE_CREATED DESC
        LIMIT $limit OFFSET $offset
    ");

    $sql->execute([$userId]);
    $notifications = $sql->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater les notifications pour le frontend
    $formattedNotifications = [];
    foreach ($notifications as $notification) {
        // Calculer le temps écoulé
        $dateCreated = new DateTime($notification['DATE_CREATED']);
        $now = new DateTime();
        $interval = $now->diff($dateCreated);
        
        if ($interval->d > 0) {
            $timeAgo = $interval->d . 'j';
        } elseif ($interval->h > 0) {
            $timeAgo = $interval->h . 'h';
        } elseif ($interval->i > 0) {
            $timeAgo = $interval->i . 'min';
        } else {
            $timeAgo = 'à l\'instant';
        }
        
        // Générer l'URL de l'avatar
        $avatarUrl = $notification['USER_FROM_AVATAR'] 
            ? "http://localhost/localbook/backend/api/Uploads/users/" . $notification['USER_FROM_AVATAR']
            : "https://via.placeholder.com/40";
        
        $formattedNotifications[] = [
            'id' => $notification['ID_NOTIFICATION'],
            'user' => $notification['USER_FROM_NAME'],
            'avatar' => $avatarUrl,
            'action' => $notification['MESSAGE'],
            'time' => 'il y a ' . $timeAgo,
            'type' => $notification['TYPE_NOTIFICATION'],
            'postId' => $notification['ID_POST'],
            'dateCreated' => $notification['DATE_CREATED']
        ];
    }
    
    // Compter le nombre de notifications non vues
    $countSql = $db->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE ID_USER_TO = ? AND IS_READ = 0");
    $countSql->execute([$userId]);
    $unreadCount = $countSql->fetch(PDO::FETCH_ASSOC)['unread_count'];

    echo json_encode([
        "success" => true,
        "notifications" => $formattedNotifications,
        "total_count" => count($formattedNotifications),
        "unread_count" => (int)$unreadCount
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
