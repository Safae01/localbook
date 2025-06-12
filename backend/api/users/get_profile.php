<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    // Vérifier si l'ID utilisateur est fourni
    if (!isset($_GET['userId']) || empty($_GET['userId'])) {
        throw new Exception("ID utilisateur requis");
    }
    
    $userId = $_GET['userId'];
    
    // Utiliser la connexion à la base de données existante
    // La variable $db est déjà définie dans database.php
    
    // Requête pour récupérer les informations de l'utilisateur
    $sql = "SELECT * FROM user WHERE ID_USER = :userId";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception("Utilisateur non trouvé");
    }
    
    // Retourner les données du profil
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
