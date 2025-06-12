<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test des APIs Follow/Unfollow ===\n\n";
    
    // Récupérer des utilisateurs pour le test
    $query = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER LIMIT 3");
    $users = $query->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) < 2) {
        echo "❌ Pas assez d'utilisateurs pour le test\n";
        exit;
    }
    
    $user1 = $users[0];
    $user2 = $users[1];
    
    echo "Utilisateurs de test:\n";
    echo "- User 1: " . $user1['NOM'] . " (ID: " . $user1['ID_USER'] . ")\n";
    echo "- User 2: " . $user2['NOM'] . " (ID: " . $user2['ID_USER'] . ")\n\n";
    
    // Test 1: Vérifier le statut initial
    echo "1. Test check_follow.php (statut initial):\n";
    $checkUrl = "http://localhost/localbook/backend/api/users/check_follow.php?follower_id=" . $user1['ID_USER'] . "&followed_id=" . $user2['ID_USER'];
    $checkResponse = file_get_contents($checkUrl);
    echo "   Réponse: " . $checkResponse . "\n\n";
    
    // Test 2: Follow
    echo "2. Test follow.php:\n";
    $followData = json_encode([
        'follower_id' => $user1['ID_USER'],
        'followed_id' => $user2['ID_USER']
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/users/follow.php');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $followData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($followData)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $followResponse = curl_exec($ch);
    $followHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   Code HTTP: " . $followHttpCode . "\n";
    echo "   Réponse: " . $followResponse . "\n\n";
    
    // Test 3: Vérifier le statut après follow
    echo "3. Test check_follow.php (après follow):\n";
    $checkResponse2 = file_get_contents($checkUrl);
    echo "   Réponse: " . $checkResponse2 . "\n\n";
    
    // Test 4: Unfollow
    echo "4. Test unfollow.php:\n";
    $unfollowData = json_encode([
        'follower_id' => $user1['ID_USER'],
        'followed_id' => $user2['ID_USER']
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/users/unfollow.php');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $unfollowData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($unfollowData)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $unfollowResponse = curl_exec($ch);
    $unfollowHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   Code HTTP: " . $unfollowHttpCode . "\n";
    echo "   Réponse: " . $unfollowResponse . "\n\n";
    
    // Test 5: Vérifier le statut final
    echo "5. Test check_follow.php (après unfollow):\n";
    $checkResponse3 = file_get_contents($checkUrl);
    echo "   Réponse: " . $checkResponse3 . "\n\n";
    
    // Test 6: Vérifier la base de données
    echo "6. État final de la base de données:\n";
    $dbQuery = $db->query("
        SELECT 
            f.id_follower,
            f.id_user,
            u1.NOM as follower_name,
            u2.NOM as followed_name
        FROM follow f
        JOIN user u1 ON f.id_follower = u1.ID_USER
        JOIN user u2 ON f.id_user = u2.ID_USER
        WHERE f.id_follower = " . $user1['ID_USER'] . " AND f.id_user = " . $user2['ID_USER'] . "
    ");
    $dbResults = $dbQuery->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($dbResults) > 0) {
        echo "   Relations trouvées:\n";
        foreach ($dbResults as $relation) {
            echo "   - " . $relation['follower_name'] . " suit " . $relation['followed_name'] . "\n";
        }
    } else {
        echo "   ✅ Aucune relation trouvée (correct après unfollow)\n";
    }
    
    echo "\n=== Test terminé ===\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
