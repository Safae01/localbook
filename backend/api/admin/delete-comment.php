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
    
    $commentId = $input['commentId'] ?? null;
    $adminId = $input['adminId'] ?? null;
    
    if (!$commentId || !$adminId) {
        http_response_code(400);
        echo json_encode(["error" => "commentId et adminId sont requis"]);
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
    
    // Vérifier que le commentaire existe
    $checkCommentQuery = "SELECT ID_COMMENT FROM commenter WHERE ID_COMMENT = :commentId";
    $checkCommentStmt = $db->prepare($checkCommentQuery);
    $checkCommentStmt->execute([':commentId' => $commentId]);
    
    if ($checkCommentStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Commentaire non trouvé"]);
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
