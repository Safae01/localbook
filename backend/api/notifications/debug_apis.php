<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

try {
    echo "<h1>Test des APIs pour les notifications</h1>";
    
    // Test 1: Commentaire
    echo "<h2>Test 1: API Commentaire</h2>";
    $commentData = json_encode([
        'user_id' => 1,
        'post_id' => 1,
        'comment' => 'Test commentaire pour notification'
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/comments/add.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $commentData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $commentResponse = curl_exec($ch);
    $commentHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p>HTTP Code: $commentHttpCode</p>";
    echo "<pre>" . htmlspecialchars($commentResponse) . "</pre>";
    
    // Test 2: Save
    echo "<h2>Test 2: API Save</h2>";
    $saveData = json_encode([
        'user_id' => 1,
        'post_id' => 1
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/saves/save.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $saveData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $saveResponse = curl_exec($ch);
    $saveHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p>HTTP Code: $saveHttpCode</p>";
    echo "<pre>" . htmlspecialchars($saveResponse) . "</pre>";
    
    // Test 3: Follow
    echo "<h2>Test 3: API Follow</h2>";
    $followData = json_encode([
        'follower_id' => 1,
        'followed_id' => 2
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/users/follow.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $followData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $followResponse = curl_exec($ch);
    $followHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p>HTTP Code: $followHttpCode</p>";
    echo "<pre>" . htmlspecialchars($followResponse) . "</pre>";
    
    // Test 4: Vérifier les notifications créées
    echo "<h2>Test 4: Notifications dans la DB</h2>";
    $notifSql = $db->query("
        SELECT 
            n.ID_NOTIFICATION,
            n.TYPE_NOTIFICATION,
            n.MESSAGE,
            n.DATE_CREATED,
            u_from.NOM as FROM_USER,
            u_to.NOM as TO_USER
        FROM notifications n
        JOIN user u_from ON n.ID_USER_FROM = u_from.ID_USER
        JOIN user u_to ON n.ID_USER_TO = u_to.ID_USER
        ORDER BY n.DATE_CREATED DESC
        LIMIT 10
    ");
    $notifications = $notifSql->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>ID</th><th>Type</th><th>Message</th><th>De</th><th>Vers</th><th>Date</th></tr>";
    foreach ($notifications as $notif) {
        echo "<tr>";
        echo "<td>" . $notif['ID_NOTIFICATION'] . "</td>";
        echo "<td>" . $notif['TYPE_NOTIFICATION'] . "</td>";
        echo "<td>" . $notif['MESSAGE'] . "</td>";
        echo "<td>" . $notif['FROM_USER'] . "</td>";
        echo "<td>" . $notif['TO_USER'] . "</td>";
        echo "<td>" . $notif['DATE_CREATED'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "<p>Erreur: " . $e->getMessage() . "</p>";
}
?>
