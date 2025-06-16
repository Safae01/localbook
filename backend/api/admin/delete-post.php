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
    
    $postId = $input['postId'] ?? null;
    $adminId = $input['adminId'] ?? null;
    
    if (!$postId || !$adminId) {
        http_response_code(400);
        echo json_encode(["error" => "postId et adminId sont requis"]);
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
    
    // Récupérer les informations du post
    $checkQuery = "SELECT ID_POST, POST_IMG, POST_VID FROM poste WHERE ID_POST = :postId";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([':postId' => $postId]);
    $post = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$post) {
        http_response_code(404);
        echo json_encode(["error" => "Post non trouvé"]);
        exit;
    }
    
    // Commencer une transaction
    $db->beginTransaction();
    
    try {
        // Supprimer les commentaires liés au post
        $deleteCommentsQuery = "DELETE FROM commenter WHERE ID_POST = :postId";
        $deleteCommentsStmt = $db->prepare($deleteCommentsQuery);
        $deleteCommentsStmt->execute([':postId' => $postId]);
        
        // Supprimer les likes liés au post
        $deleteLikesQuery = "DELETE FROM liker WHERE ID_POST = :postId";
        $deleteLikesStmt = $db->prepare($deleteLikesQuery);
        $deleteLikesStmt->execute([':postId' => $postId]);
        
        // Supprimer les enregistrements (saves) liés au post
        $deleteSavesQuery = "DELETE FROM enregistrer WHERE ID_POST = :postId";
        $deleteSavesStmt = $db->prepare($deleteSavesQuery);
        $deleteSavesStmt->execute([':postId' => $postId]);
        
        // Supprimer les notifications liées au post
        $deleteNotificationsQuery = "DELETE FROM notifications WHERE ID_POST = :postId";
        $deleteNotificationsStmt = $db->prepare($deleteNotificationsQuery);
        $deleteNotificationsStmt->execute([':postId' => $postId]);
        
        // Supprimer le post lui-même
        $deletePostQuery = "DELETE FROM poste WHERE ID_POST = :postId";
        $deletePostStmt = $db->prepare($deletePostQuery);
        $deletePostStmt->execute([':postId' => $postId]);
        
        // Supprimer les fichiers associés si ils existent
        $uploadDir = __DIR__ . '/../Uploads/posts/';
        
        if ($post['POST_IMG']) {
            $images = explode(',', $post['POST_IMG']);
            foreach ($images as $image) {
                $imagePath = $uploadDir . trim($image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
        }
        
        if ($post['POST_VID']) {
            $videoPath = $uploadDir . $post['POST_VID'];
            if (file_exists($videoPath)) {
                unlink($videoPath);
            }
        }
        
        // Confirmer la transaction
        $db->commit();
        
        echo json_encode([
            "success" => true,
            "message" => "Post supprimé avec succès"
        ]);
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
