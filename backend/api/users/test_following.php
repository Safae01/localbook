<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test de la fonctionnalité Following ===\n\n";

    // Test 1: Vérifier la structure de la table follow
    echo "1. Structure de la table follow:\n";
    $query = $db->query("DESCRIBE follow");
    $columns = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "   - " . $column['Field'] . " (" . $column['Type'] . ")\n";
    }
    echo "\n";

    // Test 2: Vérifier la structure de la table user
    echo "2. Structure de la table user:\n";
    $query = $db->query("DESCRIBE user");
    $columns = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "   - " . $column['Field'] . " (" . $column['Type'] . ")\n";
    }
    echo "\n";

    // Test 3: Compter les utilisateurs
    echo "3. Nombre d'utilisateurs:\n";
    $query = $db->query("SELECT COUNT(*) as count FROM user");
    $result = $query->fetch(PDO::FETCH_ASSOC);
    echo "   Total: " . $result['count'] . " utilisateurs\n\n";

    // Test 4: Lister les utilisateurs
    echo "4. Liste des utilisateurs:\n";
    $query = $db->query("SELECT ID_USER, NOM, EMAIL FROM user");
    $users = $query->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as $user) {
        echo "   - ID: " . $user['ID_USER'] . ", Nom: " . $user['NOM'] . ", Email: " . $user['EMAIL'] . "\n";
    }
    echo "\n";

    // Test 5: Compter les relations follow
    echo "5. Nombre de relations follow:\n";
    $query = $db->query("SELECT COUNT(*) as count FROM follow");
    $result = $query->fetch(PDO::FETCH_ASSOC);
    echo "   Total: " . $result['count'] . " relations\n\n";

    // Test 6: Lister les relations follow
    echo "6. Relations follow existantes:\n";
    $query = $db->query("SELECT * FROM follow");
    $follows = $query->fetchAll(PDO::FETCH_ASSOC);
    if (count($follows) > 0) {
        foreach ($follows as $follow) {
            echo "   - Follower ID: " . $follow['id_follower'] . " suit User ID: " . $follow['id_user'] . "\n";
        }
    } else {
        echo "   Aucune relation follow trouvée\n";
    }
    echo "\n";

    // Test 7: Insérer quelques relations de test
    echo "7. Insertion de relations de test:\n";

    // Vérifier s'il y a au moins 2 utilisateurs
    if (count($users) >= 2) {
        $user1 = $users[0]['ID_USER'];
        $user2 = $users[1]['ID_USER'];

        // Vérifier si la relation existe déjà
        $checkQuery = $db->prepare("SELECT COUNT(*) as count FROM follow WHERE id_follower = ? AND id_user = ?");
        $checkQuery->execute([$user1, $user2]);
        $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);

        if ($exists['count'] == 0) {
            $insertQuery = $db->prepare("INSERT INTO follow (id_follower, id_user) VALUES (?, ?)");
            $insertQuery->execute([$user1, $user2]);
            echo "   ✅ Relation ajoutée: User " . $user1 . " suit User " . $user2 . "\n";
        } else {
            echo "   ℹ️ Relation déjà existante: User " . $user1 . " suit User " . $user2 . "\n";
        }

        // Ajouter une relation inverse si possible
        if (count($users) >= 3) {
            $user3 = $users[2]['ID_USER'];
            $checkQuery->execute([$user2, $user3]);
            $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);

            if ($exists['count'] == 0) {
                $insertQuery->execute([$user2, $user3]);
                echo "   ✅ Relation ajoutée: User " . $user2 . " suit User " . $user3 . "\n";
            } else {
                echo "   ℹ️ Relation déjà existante: User " . $user2 . " suit User " . $user3 . "\n";
            }
        }
    } else {
        echo "   ❌ Pas assez d'utilisateurs pour créer des relations de test\n";
    }
    echo "\n";

    // Test 8: Tester la requête de get_following
    echo "8. Test de la requête get_following pour chaque utilisateur:\n";
    foreach ($users as $user) {
        $userId = $user['ID_USER'];
        echo "   Pour l'utilisateur " . $user['NOM'] . " (ID: $userId):\n";

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
            $following[] = [
                'id' => $row['id'],
                'name' => $row['username'],
                'avatar' => $row['avatar']
            ];
        }

        if (count($following) > 0) {
            foreach ($following as $followed) {
                echo "     - Suit: " . $followed['name'] . " (ID: " . $followed['id'] . ")\n";
            }
        } else {
            echo "     - Ne suit personne\n";
        }
    }

} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}