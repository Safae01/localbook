<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test de l'API Unfollow ===\n\n";
    
    // Récupérer une relation existante pour le test
    $query = $db->query("
        SELECT 
            f.id_follower,
            f.id_user,
            u1.NOM as follower_name,
            u2.NOM as followed_name
        FROM follow f
        JOIN user u1 ON f.id_follower = u1.ID_USER
        JOIN user u2 ON f.id_user = u2.ID_USER
        LIMIT 1
    ");
    $relation = $query->fetch(PDO::FETCH_ASSOC);
    
    if (!$relation) {
        echo "❌ Aucune relation trouvée pour le test\n";
        exit;
    }
    
    echo "Relation trouvée pour le test:\n";
    echo "- " . $relation['follower_name'] . " (ID: " . $relation['id_follower'] . ") suit " . $relation['followed_name'] . " (ID: " . $relation['id_user'] . ")\n\n";
    
    // Simuler un appel POST à l'API unfollow
    $postData = json_encode([
        'follower_id' => $relation['id_follower'],
        'followed_id' => $relation['id_user']
    ]);
    
    echo "Données POST envoyées:\n";
    echo $postData . "\n\n";
    
    // Utiliser cURL pour tester l'API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/users/unfollow.php');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($postData)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Réponse de l'API (Code HTTP: $httpCode):\n";
    echo $response . "\n\n";
    
    // Vérifier si la relation a été supprimée
    $checkQuery = $db->prepare("SELECT COUNT(*) as count FROM follow WHERE id_follower = ? AND id_user = ?");
    $checkQuery->execute([$relation['id_follower'], $relation['id_user']]);
    $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);
    
    if ($exists['count'] == 0) {
        echo "✅ Relation supprimée avec succès de la base de données\n";
        
        // Restaurer la relation pour les tests futurs
        $insertQuery = $db->prepare("INSERT INTO follow (id_follower, id_user) VALUES (?, ?)");
        $insertQuery->execute([$relation['id_follower'], $relation['id_user']]);
        echo "✅ Relation restaurée pour les tests futurs\n";
    } else {
        echo "❌ La relation existe toujours dans la base de données\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
