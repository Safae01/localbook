<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || !isset($data['post_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

try {
    $stmt = $db->prepare("DELETE FROM ENREGISTRER WHERE ID_USER = ? AND ID_POST = ?");
    $success = $stmt->execute([$data['user_id'], $data['post_id']]);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Post retiré des sauvegardes"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la suppression"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}
