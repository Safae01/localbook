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

$req = "SELECT * FROM user WHERE EMAIL = :email";
$stmt = $db->prepare($req);
$stmt->execute([":email" => $data->EMAIL]);

if ($stmt->rowCount() === 0) {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
    exit;
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (password_verify($data->MDPS, $user['MDPS'])) {
    // In a real app, generate a JWT or session token here
    http_response_code(200);
    echo json_encode(["success" => "Connexion réussie", "user" => [
        "ID_USER" => $user['ID_USER'],
        "NOM" => $user['NOM'],
        "EMAIL" => $user['EMAIL'],
        "IMG_PROFIL" => $user['IMG_PROFIL']
    ]]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Email ou mot de passe incorrect"]);
}
exit;
?>
