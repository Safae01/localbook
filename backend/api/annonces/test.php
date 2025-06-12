<?php
// Test simple pour vérifier la connexion à la base de données
header('Content-Type: application/json');

try {
    require_once "../config/database.php";
    
    // Test de connexion
    $test_query = $db->query("SELECT COUNT(*) as count FROM poste");
    $result = $test_query->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Connexion à la base de données réussie",
        "posts_count" => $result['count'],
        "database_connected" => true
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "database_connected" => false
    ]);
}
?>
