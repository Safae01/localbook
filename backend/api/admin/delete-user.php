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
    
    $userId = $input['userId'] ?? null;
    $adminId = $input['adminId'] ?? null;
    
    if (!$userId || !$adminId) {
        http_response_code(400);
        echo json_encode(["error" => "userId et adminId sont requis"]);
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
    
    // Récupérer les informations de l'utilisateur avant suppression
    $getUserQuery = "SELECT IMG_PROFIL, IMG_COUVERT, CIN_IMG FROM user WHERE ID_USER = :userId";
    $getUserStmt = $db->prepare($getUserQuery);
    $getUserStmt->execute([':userId' => $userId]);
    $user = $getUserStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "Utilisateur non trouvé"]);
        exit;
    }
    
    // Commencer une transaction
    $db->beginTransaction();
    
    try {
        // Supprimer toutes les données liées à l'utilisateur
        
        // 1. Supprimer les commentaires de l'utilisateur
        $deleteCommentsQuery = "DELETE FROM commenter WHERE ID_USER = :userId";
        $deleteCommentsStmt = $db->prepare($deleteCommentsQuery);
        $deleteCommentsStmt->execute([':userId' => $userId]);
        
        // 2. Supprimer les likes de l'utilisateur
        $deleteLikesQuery = "DELETE FROM liker WHERE ID_USER = :userId";
        $deleteLikesStmt = $db->prepare($deleteLikesQuery);
        $deleteLikesStmt->execute([':userId' => $userId]);
        
        // 3. Supprimer les sauvegardes de l'utilisateur
        $deleteSavesQuery = "DELETE FROM enregistrer WHERE ID_USER = :userId";
        $deleteSavesStmt = $db->prepare($deleteSavesQuery);
        $deleteSavesStmt->execute([':userId' => $userId]);
        
        // 4. Supprimer les relations de suivi
        $deleteFollowsQuery = "DELETE FROM follow WHERE id_follower = :userId OR id_user = :userId";
        $deleteFollowsStmt = $db->prepare($deleteFollowsQuery);
        $deleteFollowsStmt->execute([':userId' => $userId]);
        
        // 5. Supprimer les notifications liées à l'utilisateur
        $deleteNotificationsQuery = "DELETE FROM notifications WHERE ID_USER = :userId OR ID_USER_NOTIFIER = :userId";
        $deleteNotificationsStmt = $db->prepare($deleteNotificationsQuery);
        $deleteNotificationsStmt->execute([':userId' => $userId]);
        
        // 6. Supprimer les stories de l'utilisateur
        $deleteStoriesQuery = "DELETE FROM story WHERE ID_USER = :userId";
        $deleteStoriesStmt = $db->prepare($deleteStoriesQuery);
        $deleteStoriesStmt->execute([':userId' => $userId]);
        
        // 7. Supprimer les posts de l'utilisateur (avec leurs dépendances)
        $getPostsQuery = "SELECT ID_POST, POST_IMG, POST_VID FROM poste WHERE ID_USER = :userId";
        $getPostsStmt = $db->prepare($getPostsQuery);
        $getPostsStmt->execute([':userId' => $userId]);
        $userPosts = $getPostsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($userPosts as $post) {
            // Supprimer les commentaires du post
            $deletePostCommentsQuery = "DELETE FROM commenter WHERE ID_POST = :postId";
            $deletePostCommentsStmt = $db->prepare($deletePostCommentsQuery);
            $deletePostCommentsStmt->execute([':postId' => $post['ID_POST']]);
            
            // Supprimer les likes du post
            $deletePostLikesQuery = "DELETE FROM liker WHERE ID_POST = :postId";
            $deletePostLikesStmt = $db->prepare($deletePostLikesQuery);
            $deletePostLikesStmt->execute([':postId' => $post['ID_POST']]);
            
            // Supprimer les sauvegardes du post
            $deletePostSavesQuery = "DELETE FROM enregistrer WHERE ID_POST = :postId";
            $deletePostSavesStmt = $db->prepare($deletePostSavesQuery);
            $deletePostSavesStmt->execute([':postId' => $post['ID_POST']]);
        }
        
        // Supprimer les posts eux-mêmes
        $deletePostsQuery = "DELETE FROM poste WHERE ID_USER = :userId";
        $deletePostsStmt = $db->prepare($deletePostsQuery);
        $deletePostsStmt->execute([':userId' => $userId]);
        
        // 8. Supprimer les messages de chat
        $deleteChatQuery = "DELETE FROM chater WHERE USE_ID_USER = :userId OR ID_USER = :userId";
        $deleteChatStmt = $db->prepare($deleteChatQuery);
        $deleteChatStmt->execute([':userId' => $userId]);
        
        // 9. Finalement, supprimer l'utilisateur
        $deleteUserQuery = "DELETE FROM user WHERE ID_USER = :userId";
        $deleteUserStmt = $db->prepare($deleteUserQuery);
        $deleteUserStmt->execute([':userId' => $userId]);
        
        // Supprimer les fichiers associés
        $uploadDir = __DIR__ . '/../Uploads/users/';
        
        if ($user['IMG_PROFIL']) {
            $profilePath = $uploadDir . $user['IMG_PROFIL'];
            if (file_exists($profilePath)) {
                unlink($profilePath);
            }
        }
        
        if ($user['IMG_COUVERT']) {
            $coverPath = $uploadDir . $user['IMG_COUVERT'];
            if (file_exists($coverPath)) {
                unlink($coverPath);
            }
        }
        
        if ($user['CIN_IMG']) {
            $cinPath = $uploadDir . $user['CIN_IMG'];
            if (file_exists($cinPath)) {
                unlink($cinPath);
            }
        }
        
        // Supprimer les fichiers des posts
        foreach ($userPosts as $post) {
            $postUploadDir = __DIR__ . '/../Uploads/posts/';
            
            if ($post['POST_IMG']) {
                $images = explode(',', $post['POST_IMG']);
                foreach ($images as $image) {
                    $imagePath = $postUploadDir . trim($image);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }
            }
            
            if ($post['POST_VID']) {
                $videoPath = $postUploadDir . $post['POST_VID'];
                if (file_exists($videoPath)) {
                    unlink($videoPath);
                }
            }
        }
        
        // Confirmer la transaction
        $db->commit();
        
        echo json_encode([
            "success" => true,
            "message" => "Utilisateur supprimé avec succès"
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
