<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/cors.php';

try {
    // Récupérer tous les statuts distincts dans la base de données
    $query = "SELECT DISTINCT u.STATUT as status, COUNT(*) as count 
              FROM user u 
              WHERE u.STATUT IS NOT NULL AND u.STATUT != ''
              GROUP BY u.STATUT
              ORDER BY count DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $statuts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $statuts[] = [
            'status' => $row['status'],
            'count' => $row['count']
        ];
    }

    // Aussi récupérer quelques exemples d'utilisateurs avec leurs statuts
    $query2 = "SELECT u.ID_USER, u.NOM, u.STATUT 
               FROM user u 
               WHERE u.STATUT IS NOT NULL AND u.STATUT != ''
               LIMIT 10";
    
    $stmt2 = $db->prepare($query2);
    $stmt2->execute();
    
    $examples = [];
    while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
        $examples[] = [
            'id' => $row['ID_USER'],
            'name' => $row['NOM'],
            'status' => $row['STATUT']
        ];
    }

    echo json_encode([
        'success' => true,
        'statuts_disponibles' => $statuts,
        'exemples_utilisateurs' => $examples
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
