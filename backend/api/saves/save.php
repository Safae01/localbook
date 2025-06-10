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
    $check = $db->prepare("SELECT * FROM ENREGISTRER WHERE ID_USER = :user_id AND ID_POST = :post_id");
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
