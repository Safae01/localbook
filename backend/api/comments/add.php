<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log received data for debugging
    error_log("Received comment data: " . print_r($data, true));
    
    if (!isset($data['userId']) || !isset($data['postId']) || !isset($data['content'])) {
        http_response_code(400);
        echo json_encode(["error" => "Données incomplètes"]);
        exit;
    }
    
    $userId = intval($data['userId']);
    $postId = intval($data['postId']);
    $content = trim($data['content']);
    
    if (empty($content)) {
        http_response_code(400);
        echo json_encode(["error" => "Le commentaire ne peut pas être vide"]);
        exit;
    }
    
    // Vérifier si l'utilisateur existe
    $checkUser = $db->prepare("SELECT COUNT(*) FROM user WHERE ID_USER = ?");
    $checkUser->execute([$userId]);
    if ($checkUser->fetchColumn() == 0) {
        http_response_code(400);
        echo json_encode(["error" => "Utilisateur invalide (ID: $userId)"]);
        exit;
    }

    // Vérifier si le post existe
    $checkPost = $db->prepare("SELECT COUNT(*) FROM poste WHERE ID_POST = ?");
    $checkPost->execute([$postId]);
    if ($checkPost->fetchColumn() == 0) {
        http_response_code(400);
        echo json_encode(["error" => "Post invalide (ID: $postId)"]);
        exit;
    }

    // Vérifier si la table commenter existe
    $checkTable = $db->query("SHOW TABLES LIKE 'commenter'");
    if ($checkTable->rowCount() == 0) {
        // La table n'existe pas, la créer
        $db->exec("CREATE TABLE IF NOT EXISTS commenter (
            ID_COMMENT INT AUTO_INCREMENT PRIMARY KEY,
            ID_USER INT NOT NULL,
            ID_POST INT NOT NULL,
            CONTENT TEXT NOT NULL,
            DATE_COMMENTS DATETIME NOT NULL,
            FOREIGN KEY (ID_USER) REFERENCES user(ID_USER),
            FOREIGN KEY (ID_POST) REFERENCES poste(ID_POST)
        )");
        error_log("Table commenter created");
    }

    // Insérer le commentaire
    $sql = $db->prepare("INSERT INTO commenter (ID_USER, ID_POST, CONTENT, DATE_COMMENTS) VALUES (?, ?, ?, NOW())");
    $result = $sql->execute([$userId, $postId, $content]);
    
    if (!$result) {
        error_log("SQL Error: " . print_r($sql->errorInfo(), true));
        throw new PDOException("Échec de l'ajout du commentaire: " . implode(", ", $sql->errorInfo()));
    }
    
    $commentId = $db->lastInsertId();
    
    // Récupérer les informations de l'utilisateur pour le retour
    $userSql = $db->prepare("SELECT NOM, IMG_PROFIL FROM user WHERE ID_USER = ?");
    $userSql->execute([$userId]);
    $user = $userSql->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        error_log("User not found: ID_USER = $userId");
        throw new Exception("Utilisateur non trouvé");
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Commentaire ajouté avec succès",
        "comment" => [
            "ID_COMMENT" => $commentId,
            "ID_USER" => $userId,
            "ID_POST" => $postId,
            "CONTENT" => $content,
            "AUTHOR_NAME" => $user['NOM'],
            "AUTHOR_AVATAR" => $user['IMG_PROFIL'],
            "DATE_COMMENTS" => date('Y-m-d H:i:s'),
            "TIME_AGO" => "à l'instant"
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Add comment error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>

