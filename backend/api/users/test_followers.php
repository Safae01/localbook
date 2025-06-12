<?php
require_once '../config/database.php';

echo "=== Test des API Followers ===\n\n";

try {
    // Récupérer tous les utilisateurs
    $query = "SELECT ID_USER, NOM FROM user ORDER BY ID_USER";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Utilisateurs disponibles:\n";
    foreach ($users as $user) {
        echo "- ID: " . $user['ID_USER'] . ", Nom: " . $user['NOM'] . "\n";
    }
    echo "\n";
    
    // Tester l'API get_followers pour chaque utilisateur
    echo "=== Test get_followers.php ===\n";
    foreach ($users as $user) {
        $userId = $user['ID_USER'];
        echo "Followers de " . $user['NOM'] . " (ID: $userId):\n";
        
        // Simuler l'appel à get_followers.php
        $query = "SELECT u.ID_USER as id, u.NOM as username, u.IMG_PROFIL as avatar, u.DATE_INSCRIPTION as last_active
                  FROM user u
                  INNER JOIN follow f ON u.ID_USER = f.id_follower
                  WHERE f.id_user = :user_id
                  ORDER BY u.NOM";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $followers = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $isOnline = (time() - strtotime($row['last_active'])) < 86400;
            $followers[] = [
                'id' => $row['id'],
                'name' => $row['username'],
                'avatar' => $row['avatar'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['avatar'] : null,
                'status' => $isOnline ? 'online' : 'offline'
            ];
        }
        
        if (empty($followers)) {
            echo "   Aucun follower\n";
        } else {
            foreach ($followers as $follower) {
                echo "   - " . $follower['name'] . " (ID: " . $follower['id'] . ") - " . $follower['status'] . "\n";
            }
        }
        echo "\n";
    }
    
    // Tester l'API get_following pour chaque utilisateur
    echo "=== Test get_following.php ===\n";
    foreach ($users as $user) {
        $userId = $user['ID_USER'];
        echo "Following de " . $user['NOM'] . " (ID: $userId):\n";
        
        // Simuler l'appel à get_following.php
        $query = "SELECT u.ID_USER as id, u.NOM as username, u.IMG_PROFIL as avatar, u.DATE_INSCRIPTION as last_active
                  FROM user u
                  INNER JOIN follow f ON u.ID_USER = f.id_user
                  WHERE f.id_follower = :user_id
                  ORDER BY u.NOM";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $following = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $isOnline = (time() - strtotime($row['last_active'])) < 86400;
            $following[] = [
                'id' => $row['id'],
                'name' => $row['username'],
                'avatar' => $row['avatar'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['avatar'] : null,
                'status' => $isOnline ? 'online' : 'offline'
            ];
        }
        
        if (empty($following)) {
            echo "   Ne suit personne\n";
        } else {
            foreach ($following as $person) {
                echo "   - " . $person['name'] . " (ID: " . $person['id'] . ") - " . $person['status'] . "\n";
            }
        }
        echo "\n";
    }
    
    // Afficher les relations de suivi
    echo "=== Relations de suivi dans la base ===\n";
    $query = "SELECT 
                f.id_follower,
                f.id_user,
                u1.NOM as follower_name,
                u2.NOM as followed_name
              FROM follow f
              JOIN user u1 ON f.id_follower = u1.ID_USER
              JOIN user u2 ON f.id_user = u2.ID_USER
              ORDER BY f.id_follower, f.id_user";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $follows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($follows)) {
        echo "Aucune relation de suivi trouvée\n";
    } else {
        foreach ($follows as $follow) {
            echo "- " . $follow['follower_name'] . " (ID: " . $follow['id_follower'] . ") suit " . $follow['followed_name'] . " (ID: " . $follow['id_user'] . ")\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>
