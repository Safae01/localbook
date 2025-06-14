<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gérer les requêtes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

// Vérifier si la méthode est DELETE ou POST
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Récupérer les données
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['commentId']) || !isset($data['userId'])) {
        http_response_code(400);
        echo json_encode(["error" => "Données incomplètes"]);
        exit;
    }
    
    $commentId = intval($data['commentId']);
    $userId = intval($data['userId']);
    
    // Vérifier si le commentaire existe et appartient à l'utilisateur
    $checkComment = $db->prepare("SELECT COUNT(*) FROM commenter WHERE ID_COMMENT = ? AND ID_USER = ?");
    $checkComment->execute([$commentId, $userId]);
    
    if ($checkComment->fetchColumn() == 0) {
        http_response_code(403);
        echo json_encode(["error" => "Commentaire non trouvé ou vous n'êtes pas autorisé à le supprimer"]);
        exit;
    }
    
    // Supprimer le commentaire
    $deleteComment = $db->prepare("DELETE FROM commenter WHERE ID_COMMENT = ?");
    $result = $deleteComment->execute([$commentId]);
    
    if ($result) {
        echo json_encode([
            "success" => true,
            "message" => "Commentaire supprimé avec succès"
        ]);
    } else {
        throw new Exception("Échec de la suppression du commentaire");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>