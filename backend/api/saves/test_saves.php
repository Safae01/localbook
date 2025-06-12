<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test des sauvegardes ===\n\n";
    
    // Test 1: Vérifier la structure de la table enregistrer
    echo "1. Vérification de la table enregistrer:\n";
    try {
        $query = $db->query("DESCRIBE enregistrer");
        $columns = $query->fetchAll(PDO::FETCH_ASSOC);
        echo "   Table enregistrer existe:\n";
        foreach ($columns as $column) {
            echo "   - " . $column['Field'] . " (" . $column['Type'] . ")\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Table enregistrer n'existe pas: " . $e->getMessage() . "\n";
        echo "   Création de la table enregistrer...\n";
        
        $createTable = "
            CREATE TABLE IF NOT EXISTS enregistrer (
                ID_ENREGISTRER INT AUTO_INCREMENT PRIMARY KEY,
                ID_USER INT NOT NULL,
                ID_POST INT NOT NULL,
                DATE_ENREGISTRER TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_save (ID_USER, ID_POST),
                FOREIGN KEY (ID_USER) REFERENCES user(ID_USER),
                FOREIGN KEY (ID_POST) REFERENCES poste(ID_POST)
            )
        ";
        $db->exec($createTable);
        echo "   ✅ Table enregistrer créée\n";
    }
    echo "\n";
    
    // Test 2: Vérifier les posts existants
    echo "2. Posts existants:\n";
    $postsQuery = $db->query("SELECT ID_POST, ID_USER, TYPE_LOC, VILLE FROM poste ORDER BY ID_POST LIMIT 3");
    $posts = $postsQuery->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($posts) == 0) {
        echo "   ❌ Aucun post trouvé\n";
        exit;
    }
    
    foreach ($posts as $post) {
        echo "   - Post ID: " . $post['ID_POST'] . " (" . $post['TYPE_LOC'] . " à " . $post['VILLE'] . ")\n";
    }
    echo "\n";
    
    // Test 3: Vérifier les utilisateurs
    echo "3. Utilisateurs existants:\n";
    $usersQuery = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER LIMIT 3");
    $users = $usersQuery->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "   - User ID: " . $user['ID_USER'] . " (" . $user['NOM'] . ")\n";
    }
    echo "\n";
    
    // Test 4: Tester la sauvegarde
    echo "4. Test de sauvegarde:\n";
    $testUserId = $users[0]['ID_USER'];
    $testPostId = $posts[0]['ID_POST'];
    
    echo "   Test: User " . $testUserId . " sauvegarde Post " . $testPostId . "\n";
    
    // Vérifier si déjà sauvegardé
    $checkQuery = $db->prepare("SELECT COUNT(*) as count FROM enregistrer WHERE ID_USER = ? AND ID_POST = ?");
    $checkQuery->execute([$testUserId, $testPostId]);
    $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);
    
    if ($exists['count'] == 0) {
        $insertQuery = $db->prepare("INSERT INTO enregistrer (ID_USER, ID_POST) VALUES (?, ?)");
        $insertQuery->execute([$testUserId, $testPostId]);
        echo "   ✅ Post sauvegardé avec succès\n";
    } else {
        echo "   ℹ️ Post déjà sauvegardé\n";
    }
    
    // Test 5: Vérifier les sauvegardes
    echo "\n5. Sauvegardes dans la base:\n";
    $savesQuery = $db->query("
        SELECT 
            e.ID_USER, 
            e.ID_POST, 
            e.DATE_ENREGISTRER,
            u.NOM as USER_NAME,
            p.TYPE_LOC,
            p.VILLE
        FROM enregistrer e
        JOIN user u ON e.ID_USER = u.ID_USER
        JOIN poste p ON e.ID_POST = p.ID_POST
        ORDER BY e.DATE_ENREGISTRER DESC
    ");
    $saves = $savesQuery->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($saves as $save) {
        echo "   - " . $save['USER_NAME'] . " a sauvegardé: " . $save['TYPE_LOC'] . " à " . $save['VILLE'] . " (Post " . $save['ID_POST'] . ")\n";
    }
    
    // Test 6: Tester l'API save.php
    echo "\n6. Test de l'API save.php:\n";
    $postData = json_encode([
        'user_id' => $testUserId,
        'post_id' => $testPostId
    ]);
    
    echo "   Données envoyées: " . $postData . "\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/localbook/backend/api/saves/save.php');
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
    
    echo "   Code HTTP: " . $httpCode . "\n";
    echo "   Réponse: " . $response . "\n";
    
    // Test 7: Tester l'API check.php
    echo "\n7. Test de l'API check.php:\n";
    $checkUrl = "http://localhost/localbook/backend/api/saves/check.php?user_id=" . $testUserId . "&post_id=" . $testPostId;
    $checkResponse = file_get_contents($checkUrl);
    echo "   URL: " . $checkUrl . "\n";
    echo "   Réponse: " . $checkResponse . "\n";
    
    echo "\n✅ Test des sauvegardes terminé !\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
