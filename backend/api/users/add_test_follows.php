<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Ajout de relations de test ===\n\n";
    
    // Récupérer tous les utilisateurs
    $query = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER");
    $users = $query->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) < 2) {
        echo "❌ Pas assez d'utilisateurs dans la base de données\n";
        exit;
    }
    
    echo "Utilisateurs trouvés:\n";
    foreach ($users as $user) {
        echo "- ID: " . $user['ID_USER'] . ", Nom: " . $user['NOM'] . "\n";
    }
    echo "\n";
    
    // Ajouter quelques relations de test
    $relations = [
        [$users[0]['ID_USER'], $users[1]['ID_USER']], // User 1 suit User 2
    ];
    
    // Si on a plus d'utilisateurs, ajouter plus de relations
    if (count($users) >= 3) {
        $relations[] = [$users[0]['ID_USER'], $users[2]['ID_USER']]; // User 1 suit User 3
        $relations[] = [$users[1]['ID_USER'], $users[2]['ID_USER']]; // User 2 suit User 3
    }
    
    if (count($users) >= 4) {
        $relations[] = [$users[0]['ID_USER'], $users[3]['ID_USER']]; // User 1 suit User 4
        $relations[] = [$users[2]['ID_USER'], $users[0]['ID_USER']]; // User 3 suit User 1
    }
    
    echo "Relations à ajouter:\n";
    foreach ($relations as $relation) {
        $follower_id = $relation[0];
        $followed_id = $relation[1];
        
        // Vérifier si la relation existe déjà
        $checkQuery = $db->prepare("SELECT COUNT(*) as count FROM follow WHERE id_follower = ? AND id_user = ?");
        $checkQuery->execute([$follower_id, $followed_id]);
        $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);
        
        if ($exists['count'] == 0) {
            $insertQuery = $db->prepare("INSERT INTO follow (id_follower, id_user) VALUES (?, ?)");
            $insertQuery->execute([$follower_id, $followed_id]);
            echo "✅ Ajouté: User $follower_id suit User $followed_id\n";
        } else {
            echo "ℹ️ Existe déjà: User $follower_id suit User $followed_id\n";
        }
    }
    
    echo "\n=== Résultat final ===\n";
    
    // Afficher toutes les relations
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
    
    echo "Relations dans la base de données:\n";
    foreach ($follows as $follow) {
        echo "- " . $follow['follower_name'] . " (ID: " . $follow['id_follower'] . ") suit " . $follow['followed_name'] . " (ID: " . $follow['id_user'] . ")\n";
    }
    
    echo "\nNombre total de relations: " . count($follows) . "\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
