<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    // Récupérer quelques utilisateurs et posts pour le test
    $usersSql = $db->query("SELECT ID_USER, NOM FROM user LIMIT 3");
    $users = $usersSql->fetchAll(PDO::FETCH_ASSOC);
    
    $postsSql = $db->query("SELECT ID_POST, ID_USER FROM poste LIMIT 3");
    $posts = $postsSql->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) < 2 || count($posts) < 1) {
        echo json_encode([
            "success" => false,
            "error" => "Pas assez d'utilisateurs ou de posts pour le test"
        ]);
        exit;
    }
    
    // Simuler un appel à l'API toggle like
    $userWhoLikes = $users[0]; // Celui qui like
    $postToLike = $posts[0]; // Le post à liker
    
    // Préparer les données comme le ferait le frontend
    $postData = json_encode([
        'userId' => $userWhoLikes['ID_USER'],
        'postId' => $postToLike['ID_POST']
    ]);
    
    // Simuler l'appel à l'API toggle
    $url = 'http://localhost/localbook/backend/api/likes/toggle.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($postData)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $likeResult = json_decode($response, true);
    
    // Vérifier si une notification a été créée
    $checkNotifSql = $db->prepare("
        SELECT n.*, u.NOM as USER_FROM_NAME 
        FROM notifications n 
        JOIN user u ON n.ID_USER_FROM = u.ID_USER 
        WHERE n.ID_POST = ? AND n.TYPE_NOTIFICATION = 'like'
        ORDER BY n.DATE_CREATED DESC 
        LIMIT 1
    ");
    $checkNotifSql->execute([$postToLike['ID_POST']]);
    $latestNotification = $checkNotifSql->fetch(PDO::FETCH_ASSOC);
    
    // Compter toutes les notifications
    $countSql = $db->query("SELECT COUNT(*) as count FROM notifications");
    $totalNotifications = $countSql->fetch(PDO::FETCH_ASSOC)['count'];
    
    echo json_encode([
        "success" => true,
        "message" => "Test de like avec notification",
        "test_data" => [
            "user_who_likes" => $userWhoLikes,
            "post_to_like" => $postToLike,
            "like_api_response" => $likeResult,
            "like_api_http_code" => $httpCode,
            "latest_notification_for_post" => $latestNotification,
            "total_notifications_in_db" => (int)$totalNotifications
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
