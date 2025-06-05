<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    // Vérifier la structure de la base de données
    $tables = [];
    $result = $db->query("SHOW TABLES");
    while ($row = $result->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }
    
    // Vérifier si la table commenter existe
    $hasCommenterTable = in_array('commenter', $tables);
    
    // Structure de la table commenter
    $commenterStructure = [];
    if ($hasCommenterTable) {
        $result = $db->query("DESCRIBE commenter");
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $commenterStructure[] = $row;
        }
    }
    
    // Récupérer quelques utilisateurs et posts pour tester
    $users = [];
    $result = $db->query("SELECT ID_USER, NOM FROM user LIMIT 5");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $users[] = $row;
    }
    
    $posts = [];
    $result = $db->query("SELECT ID_POST FROM poste LIMIT 5");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $posts[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'database_info' => [
            'tables' => $tables,
            'has_commenter_table' => $hasCommenterTable,
            'commenter_structure' => $commenterStructure,
            'sample_users' => $users,
            'sample_posts' => $posts
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>