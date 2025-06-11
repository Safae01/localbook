<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test de la fonctionnalité Unfollow ===\n\n";
    
    // Afficher les relations existantes
    echo "1. Relations existantes avant test:\n";
    $query = $db->query("
        SELECT 
            f.id_follower,
            f.id_user,
            u1.NOM as follower_name,
            u2.NOM as followed_name
        FROM follow f
        JOIN user u1 ON f.id_follower = u1.ID_USER
        JOIN user u2 ON f.id_user = u2.ID_USER
        ORDER BY f.id_follower, f.id_user
    ");
    $follows = $query->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($follows) > 0) {
        foreach ($follows as $follow) {
            echo "   - " . $follow['follower_name'] . " (ID: " . $follow['id_follower'] . ") suit " . $follow['followed_name'] . " (ID: " . $follow['id_user'] . ")\n";
        }
    } else {
        echo "   Aucune relation trouvée\n";
    }
    echo "\n";
    
    if (count($follows) > 0) {
        // Prendre la première relation pour le test
        $testRelation = $follows[0];
        $follower_id = $testRelation['id_follower'];
        $followed_id = $testRelation['id_user'];
        
        echo "2. Test de suppression de la relation:\n";
        echo "   Suppression: " . $testRelation['follower_name'] . " ne suit plus " . $testRelation['followed_name'] . "\n";
        
        // Simuler l'appel API unfollow
        $deleteQuery = "DELETE FROM follow WHERE id_follower = :follower_id AND id_user = :followed_id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':follower_id', $follower_id);
        $deleteStmt->bindParam(':followed_id', $followed_id);
        $deleteStmt->execute();
        
        if ($deleteStmt->rowCount() > 0) {
            echo "   ✅ Relation supprimée avec succès\n";
        } else {
            echo "   ❌ Échec de la suppression\n";
        }
        echo "\n";
        
        // Afficher les relations après suppression
        echo "3. Relations après suppression:\n";
        $query = $db->query("
            SELECT 
                f.id_follower,
                f.id_user,
                u1.NOM as follower_name,
                u2.NOM as followed_name
            FROM follow f
            JOIN user u1 ON f.id_follower = u1.ID_USER
            JOIN user u2 ON f.id_user = u2.ID_USER
            ORDER BY f.id_follower, f.id_user
        ");
        $followsAfter = $query->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($followsAfter) > 0) {
            foreach ($followsAfter as $follow) {
                echo "   - " . $follow['follower_name'] . " (ID: " . $follow['id_follower'] . ") suit " . $follow['followed_name'] . " (ID: " . $follow['id_user'] . ")\n";
            }
        } else {
            echo "   Aucune relation restante\n";
        }
        echo "\n";
        
        // Restaurer la relation pour les tests futurs
        echo "4. Restauration de la relation pour les tests futurs:\n";
        $insertQuery = $db->prepare("INSERT INTO follow (id_follower, id_user) VALUES (?, ?)");
        $insertQuery->execute([$follower_id, $followed_id]);
        echo "   ✅ Relation restaurée: " . $testRelation['follower_name'] . " suit à nouveau " . $testRelation['followed_name'] . "\n";
        
    } else {
        echo "2. Aucune relation à tester. Ajoutez des relations d'abord.\n";
    }
    
    echo "\n=== Test terminé ===\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
