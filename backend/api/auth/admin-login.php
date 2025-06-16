<?php
require_once "../config/database.php";
require_once "../config/cors.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->EMAIL) || empty($data->MDPS)) {
    http_response_code(400);
    echo json_encode(["error" => "Veuillez remplir tous les champs"]);
    exit;
}

$req = "SELECT * FROM admin WHERE EMAIL = :email";
$stmt = $db->prepare($req);
$stmt->execute([":email" => $data->EMAIL]);

if ($stmt->rowCount() === 0) {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
    exit;
}

$admin = $stmt->fetch(PDO::FETCH_ASSOC);

// Pour l'admin, on compare directement le mot de passe (pas de hash dans votre DB)
if (trim($admin['MDPS']) === trim($data->MDPS)) {
    http_response_code(200);
    echo json_encode([
        "success" => "Connexion admin réussie", 
        "admin" => [
            "ID_ADMIN" => $admin['ID_ADMIN'],
            "EMAIL" => $admin['EMAIL'],
            "isAdmin" => true
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
}
exit;
?>
