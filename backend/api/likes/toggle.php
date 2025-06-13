<?php
header('Content-Type: application/json');
require_once "../config/cors.php";

try {
    require_once "../config/database.php";
    
    // Vérifier la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
        exit;
    }
    
    // Récupérer les données JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Données JSON invalides"]);
        exit;
    }
    
    $userId = $input['userId'] ?? null;
    $postId = $input['postId'] ?? null;
    
    if (!$userId || !$postId) {
        http_response_code(400);
        echo json_encode(["error" => "userId et postId sont requis"]);
        exit;
    }
    
    // Vérifier si l'utilisateur a déjà liké ce post
    $checkSql = $db->prepare("SELECT COUNT(*) as count FROM liker WHERE ID_USER = ? AND ID_POST = ?");
    $checkSql->execute([$userId, $postId]);
    $result = $checkSql->fetch(PDO::FETCH_ASSOC);
    
    $isLiked = $result['count'] > 0;
    
    if ($isLiked) {
        // Supprimer le like (unlike)
        $deleteSql = $db->prepare("DELETE FROM liker WHERE ID_USER = ? AND ID_POST = ?");
        $deleteSql->execute([$userId, $postId]);
        $action = 'unliked';
    } else {
        // Ajouter le like
        $insertSql = $db->prepare("INSERT INTO liker (ID_USER, ID_POST, DATE_LIKE) VALUES (?, ?, NOW())");
        $insertSql->execute([$userId, $postId]);
        $action = 'liked';

        // Créer une notification pour le propriétaire du post
        $postOwnerSql = $db->prepare("SELECT ID_USER FROM poste WHERE ID_POST = ?");
        $postOwnerSql->execute([$postId]);
        $postOwner = $postOwnerSql->fetch(PDO::FETCH_ASSOC);

        if ($postOwner && $postOwner['ID_USER'] != $userId) {
            // Récupérer le nom de l'utilisateur qui a liké
            $userSql = $db->prepare("SELECT NOM FROM user WHERE ID_USER = ?");
            $userSql->execute([$userId]);
            $user = $userSql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $message = "a aimé votre publication";

                // Vérifier si la table notifications existe
                $checkTable = $db->query("SHOW TABLES LIKE 'notifications'");
                if ($checkTable->rowCount() == 0) {
                    // Créer la table si elle n'existe pas
                    $createTableSQL = "
                        CREATE TABLE IF NOT EXISTS `notifications` (
                          `ID_NOTIFICATION` int(11) NOT NULL AUTO_INCREMENT,
                          `ID_USER_FROM` int(11) NOT NULL COMMENT 'Utilisateur qui fait l\'action',
                          `ID_USER_TO` int(11) NOT NULL COMMENT 'Utilisateur qui reçoit la notification',
                          `ID_POST` int(11) DEFAULT NULL COMMENT 'Post concerné (pour likes, commentaires)',
                          `TYPE_NOTIFICATION` enum('like','comment','follow','mention') NOT NULL,
                          `MESSAGE` text NOT NULL COMMENT 'Message de la notification',
                          `IS_READ` tinyint(1) DEFAULT 0 COMMENT '0 = non lu, 1 = lu',
                          `DATE_CREATED` timestamp NOT NULL DEFAULT current_timestamp(),
                          PRIMARY KEY (`ID_NOTIFICATION`),
                          KEY `FK_NOTIFICATION_USER_FROM` (`ID_USER_FROM`),
                          KEY `FK_NOTIFICATION_USER_TO` (`ID_USER_TO`),
                          KEY `FK_NOTIFICATION_POST` (`ID_POST`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
                    ";
                    $db->exec($createTableSQL);
                }

                $notifSql = $db->prepare("
                    INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED)
                    VALUES (?, ?, ?, 'like', ?, NOW())
                ");
                $result = $notifSql->execute([$userId, $postOwner['ID_USER'], $postId, $message]);


            }
        }
    }
    
    // Compter le nombre total de likes pour ce post
    $countSql = $db->prepare("SELECT COUNT(*) as total_likes FROM liker WHERE ID_POST = ?");
    $countSql->execute([$postId]);
    $countResult = $countSql->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "action" => $action,
        "isLiked" => !$isLiked,
        "totalLikes" => (int)$countResult['total_likes'],
        "message" => $action === 'liked' ? "Post liké avec succès" : "Like retiré avec succès"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>
