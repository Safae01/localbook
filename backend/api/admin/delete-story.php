<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Données JSON invalides"]);
        exit;
    }
    
    $storyId = $input['storyId'] ?? null;
    $adminId = $input['adminId'] ?? null;
    
    if (!$storyId || !$adminId) {
        http_response_code(400);
        echo json_encode(["error" => "storyId et adminId sont requis"]);
        exit;
    }
    
    // Vérifier que l'admin existe
    $checkAdminQuery = "SELECT ID_ADMIN FROM admin WHERE ID_ADMIN = :adminId";
    $checkAdminStmt = $db->prepare($checkAdminQuery);
    $checkAdminStmt->execute([':adminId' => $adminId]);
    
    if ($checkAdminStmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["error" => "Accès non autorisé"]);
        exit;
    }
    
    // Récupérer les informations de la story avant suppression
    $getStoryQuery = "SELECT CONTENT FROM story WHERE ID_STORY = :storyId";
    $getStoryStmt = $db->prepare($getStoryQuery);
    $getStoryStmt->execute([':storyId' => $storyId]);
    $story = $getStoryStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$story) {
        http_response_code(404);
        echo json_encode(["error" => "Story non trouvée"]);
        exit;
    }
    
    // Supprimer la story de la base de données
    $deleteQuery = "DELETE FROM story WHERE ID_STORY = :storyId";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->execute([':storyId' => $storyId]);
    
    // Supprimer le fichier associé si il existe
    if ($story['CONTENT']) {
        $uploadDir = __DIR__ . '/../Uploads/stories/';
        $filePath = $uploadDir . $story['CONTENT'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Story supprimée avec succès"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
