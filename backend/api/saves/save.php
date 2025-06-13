<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Debug log
error_log("Received data: " . print_r($data, true));

if (!isset($data['user_id']) || !isset($data['post_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

try {
    // Vérifier si le post est déjà sauvegardé
    $check = $db->prepare("SELECT * FROM enregistrer WHERE ID_USER = :user_id AND ID_POST = :post_id");
    $check->execute([
        ':user_id' => $data['user_id'],
        ':post_id' => $data['post_id']
    ]);

    if ($check->rowCount() > 0) {
        echo json_encode(["message" => "Post déjà sauvegardé"]);
        exit;
    }

    // Sauvegarder le post
    $stmt = $db->prepare("INSERT INTO enregistrer (ID_USER, ID_POST) VALUES (:user_id, :post_id)");
    $result = $stmt->execute([
        ':user_id' => $data['user_id'],
        ':post_id' => $data['post_id']
    ]);

    if ($result) {
        // Créer une notification pour le propriétaire du post
        $postOwnerSql = $db->prepare("SELECT ID_USER FROM poste WHERE ID_POST = ?");
        $postOwnerSql->execute([$data['post_id']]);
        $postOwner = $postOwnerSql->fetch(PDO::FETCH_ASSOC);

        if ($postOwner && $postOwner['ID_USER'] != $data['user_id']) {
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

            $message = "a enregistré votre publication";
            $notifSql = $db->prepare("
                INSERT INTO notifications (ID_USER_FROM, ID_USER_TO, ID_POST, TYPE_NOTIFICATION, MESSAGE, DATE_CREATED)
                VALUES (?, ?, ?, 'mention', ?, NOW())
            ");
            $notifResult = $notifSql->execute([$data['user_id'], $postOwner['ID_USER'], $data['post_id'], $message]);


        }

        echo json_encode(["success" => true, "message" => "Post sauvegardé avec succès"]);
    } else {
        http_response_code(500);
        $errorInfo = $stmt->errorInfo();
        error_log("SQL Error: " . print_r($errorInfo, true));
        echo json_encode(["error" => "Erreur lors de la sauvegarde: " . $errorInfo[2]]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de base de données: " . $e->getMessage()]);
}
