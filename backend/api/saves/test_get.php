<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Tester avec un ID utilisateur spécifique
$user_id = 2; // Remplacer par un ID utilisateur valide de votre base de données

try {
    // 1. Vérifier si l'utilisateur existe
    $stmt = $db->prepare("SELECT * FROM user WHERE ID_USER = :user_id");
    $stmt->execute([':user_id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "Test 1 - Vérification de l'utilisateur:\n";
    echo $user ? "Utilisateur trouvé\n" : "Utilisateur non trouvé\n";

    // 2. Vérifier les enregistrements
    $stmt = $db->prepare("SELECT * FROM enregistrer WHERE ID_USER = :user_id");
    $stmt->execute([':user_id' => $user_id]);
    $saves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "\nTest 2 - Enregistrements trouvés:\n";
    echo "Nombre d'enregistrements: " . count($saves) . "\n";

    // 3. Vérifier les posts complets
    $stmt = $db->prepare("
        SELECT 
            p.*,            u.NOM as AUTEUR_NOM,
            u.IMG_PROFIL as AUTEUR_AVATAR
        FROM poste p
        INNER JOIN enregistrer e ON p.ID_POST = e.ID_POST
        INNER JOIN user u ON p.ID_USER = u.ID_USER
        WHERE e.ID_USER = :user_id
    ");
    $stmt->execute([':user_id' => $user_id]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "\nTest 3 - Posts complets:\n";
    echo "Nombre de posts: " . count($posts) . "\n";
    if (count($posts) > 0) {
        echo "\nPremier post:\n";
        print_r($posts[0]);
    }

} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
