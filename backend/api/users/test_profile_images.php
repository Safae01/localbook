<?php
require_once '../config/database.php';

echo "=== Test des Images de Profil ===\n\n";

try {
    // Récupérer tous les utilisateurs avec leurs images
    $query = "SELECT ID_USER, NOM, EMAIL, IMG_PROFIL, IMG_COUVERT FROM user ORDER BY ID_USER";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Utilisateurs et leurs images:\n";
    foreach ($users as $user) {
        echo "- ID: " . $user['ID_USER'] . "\n";
        echo "  Nom: " . $user['NOM'] . "\n";
        echo "  Email: " . $user['EMAIL'] . "\n";
        echo "  IMG_PROFIL: " . ($user['IMG_PROFIL'] ? $user['IMG_PROFIL'] : 'NULL') . "\n";
        echo "  IMG_COUVERT: " . ($user['IMG_COUVERT'] ? $user['IMG_COUVERT'] : 'NULL') . "\n";
        
        // Vérifier si les fichiers existent
        if ($user['IMG_PROFIL']) {
            $profilePath = __DIR__ . '/../Uploads/users/' . $user['IMG_PROFIL'];
            echo "  Fichier profil existe: " . (file_exists($profilePath) ? 'OUI' : 'NON') . "\n";
            if (file_exists($profilePath)) {
                echo "  Taille: " . filesize($profilePath) . " bytes\n";
            }
        }
        
        if ($user['IMG_COUVERT']) {
            $coverPath = __DIR__ . '/../Uploads/users/' . $user['IMG_COUVERT'];
            echo "  Fichier couverture existe: " . (file_exists($coverPath) ? 'OUI' : 'NON') . "\n";
            if (file_exists($coverPath)) {
                echo "  Taille: " . filesize($coverPath) . " bytes\n";
            }
        }
        
        echo "\n";
    }
    
    // Vérifier le dossier uploads
    echo "=== Vérification du dossier Uploads/users ===\n";
    $uploadDir = __DIR__ . '/../Uploads/users/';
    echo "Chemin: $uploadDir\n";
    echo "Existe: " . (is_dir($uploadDir) ? 'OUI' : 'NON') . "\n";
    echo "Accessible en écriture: " . (is_writable($uploadDir) ? 'OUI' : 'NON') . "\n";
    
    if (is_dir($uploadDir)) {
        $files = scandir($uploadDir);
        $files = array_filter($files, function($file) {
            return $file !== '.' && $file !== '..';
        });
        
        echo "Fichiers dans le dossier (" . count($files) . "):\n";
        foreach ($files as $file) {
            echo "  - $file\n";
        }
    }
    
    // Test des URLs
    echo "\n=== Test des URLs ===\n";
    foreach ($users as $user) {
        if ($user['IMG_PROFIL']) {
            $url = "http://localhost/localbook/backend/api/Uploads/users/" . $user['IMG_PROFIL'];
            echo "URL profil pour " . $user['NOM'] . ": $url\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
?>
