<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "ID utilisateur manquant"]);
    exit;
}

try {
    $userId = $_GET['user_id'];
    $postIds = isset($_GET['post_ids']) ? explode(',', $_GET['post_ids']) : [];

    if (empty($postIds)) {
        $stmt = $db->prepare("SELECT ID_POST FROM enregistrer WHERE ID_USER = ?");
        $stmt->execute([$userId]);
        $savedPosts = $stmt->fetchAll(PDO::FETCH_COLUMN);
    } else {
        $placeholders = str_repeat('?,', count($postIds) - 1) . '?';
        $stmt = $db->prepare("SELECT ID_POST FROM enregistrer WHERE ID_USER = ? AND ID_POST IN ($placeholders)");
        $params = array_merge([$userId], $postIds);
        $stmt->execute($params);
        $savedPosts = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    $result = array();
    foreach ($postIds as $postId) {
        $result[$postId] = in_array($postId, $savedPosts);
    }

    echo json_encode([
        "success" => true,
        "saved_posts" => $result
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
