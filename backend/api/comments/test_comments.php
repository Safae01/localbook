<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Test des commentaires ===\n\n";
    
    // Test 1: Vérifier la structure de la table commenter
    echo "1. Structure de la table commenter:\n";
    try {
        $query = $db->query("DESCRIBE commenter");
        $columns = $query->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $column) {
            echo "   - " . $column['Field'] . " (" . $column['Type'] . ")\n";
        }
    } catch (Exception $e) {
        echo "   ❌ Table commenter n'existe pas: " . $e->getMessage() . "\n";
        echo "   Création de la table commenter...\n";
        
        $createTable = "
            CREATE TABLE IF NOT EXISTS commenter (
                ID_COMMENT INT AUTO_INCREMENT PRIMARY KEY,
                ID_USER INT NOT NULL,
                ID_POST INT NOT NULL,
                CONTENT TEXT NOT NULL,
                DATE_COMMENTS TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ID_USER) REFERENCES user(ID_USER),
                FOREIGN KEY (ID_POST) REFERENCES poste(ID_POST)
            )
        ";
        $db->exec($createTable);
        echo "   ✅ Table commenter créée\n";
    }
    echo "\n";
    
    // Test 2: Vérifier les posts existants
    echo "2. Posts existants:\n";
    $postsQuery = $db->query("SELECT ID_POST, ID_USER, TYPE_LOC, VILLE FROM poste ORDER BY ID_POST LIMIT 5");
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
    $usersQuery = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER LIMIT 5");
    $users = $usersQuery->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "   - User ID: " . $user['ID_USER'] . " (" . $user['NOM'] . ")\n";
    }
    echo "\n";
    
    // Test 4: Ajouter quelques commentaires de test
    echo "4. Ajout de commentaires de test:\n";
    
    $testComments = [
        [
            'user_id' => $users[0]['ID_USER'],
            'post_id' => $posts[0]['ID_POST'],
            'content' => 'Très belle annonce ! Je suis intéressé.'
        ],
        [
            'user_id' => $users[1]['ID_USER'] ?? $users[0]['ID_USER'],
            'post_id' => $posts[0]['ID_POST'],
            'content' => 'Le prix est-il négociable ?'
        ]
    ];
    
    if (count($posts) > 1) {
        $testComments[] = [
            'user_id' => $users[0]['ID_USER'],
            'post_id' => $posts[1]['ID_POST'],
            'content' => 'Magnifique appartement ! Quand peut-on visiter ?'
        ];
    }
    
    foreach ($testComments as $comment) {
        // Vérifier si le commentaire existe déjà
        $checkQuery = $db->prepare("SELECT COUNT(*) as count FROM commenter WHERE ID_USER = ? AND ID_POST = ? AND CONTENT = ?");
        $checkQuery->execute([$comment['user_id'], $comment['post_id'], $comment['content']]);
        $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);
        
        if ($exists['count'] == 0) {
            $insertQuery = $db->prepare("INSERT INTO commenter (ID_USER, ID_POST, CONTENT) VALUES (?, ?, ?)");
            $insertQuery->execute([$comment['user_id'], $comment['post_id'], $comment['content']]);
            echo "   ✅ Commentaire ajouté: Post " . $comment['post_id'] . " par User " . $comment['user_id'] . "\n";
        } else {
            echo "   ℹ️ Commentaire existe déjà: Post " . $comment['post_id'] . " par User " . $comment['user_id'] . "\n";
        }
    }
    echo "\n";
    
    // Test 5: Vérifier les commentaires ajoutés
    echo "5. Commentaires dans la base:\n";
    $commentsQuery = $db->query("
        SELECT 
            c.ID_COMMENT, 
            c.ID_USER, 
            c.ID_POST, 
            c.CONTENT, 
            c.DATE_COMMENTS,
            u.NOM as AUTHOR_NAME
        FROM commenter c
        JOIN user u ON c.ID_USER = u.ID_USER
        ORDER BY c.DATE_COMMENTS DESC
    ");
    $comments = $commentsQuery->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($comments as $comment) {
        echo "   - " . $comment['AUTHOR_NAME'] . " sur Post " . $comment['ID_POST'] . ": \"" . substr($comment['CONTENT'], 0, 50) . "...\"\n";
    }
    echo "\n";
    
    // Test 6: Tester l'API get.php
    echo "6. Test de l'API get.php:\n";
    $testPostId = $posts[0]['ID_POST'];
    echo "   Test avec Post ID: " . $testPostId . "\n";
    
    $apiUrl = "http://localhost/localbook/backend/api/comments/get.php?postId=" . $testPostId;
    $apiResponse = file_get_contents($apiUrl);
    echo "   Réponse API: " . $apiResponse . "\n";
    
    echo "\n✅ Test des commentaires terminé !\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
