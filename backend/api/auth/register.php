<?php
// Suppress any unexpected output
ob_start();
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    ob_end_flush();
    exit;
}

// Get form data
$data = $_POST;

// Check required fields
if (empty($data['NOM']) || empty($data['CIN_NUM']) || empty($data['STATUT']) || empty($data['TELE']) || empty($data['EMAIL']) || empty($data['MDPS'])) {
    http_response_code(400);
    echo json_encode(["error" => "Veuillez remplir tous les champs"]);
    ob_end_flush();
    exit;
}

// Validate email format
if (!filter_var($data['EMAIL'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Format d'email invalide"]);
    ob_end_flush();
    exit;
}

// Validate password length (minimum 7 characters)
if (strlen($data['MDPS']) < 7) {
    http_response_code(400);
    echo json_encode(["error" => "Le mot de passe doit contenir au moins 7 caractères"]);
    ob_end_flush();
    exit;
}

// Check if email exists
try {
    $req = "SELECT * FROM user WHERE EMAIL = :email";
    $verif = $db->prepare($req);
    $verif->execute([":email" => $data['EMAIL']]);
    if ($verif->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["error" => "Cet email est déjà utilisé"]);
        ob_end_flush();
        exit;
    }
} catch (PDOException $e) {
    error_log("Email check error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur lors de la vérification de l'email"]);
    ob_end_flush();
    exit;
}

// Debug: Log received files
error_log("Files received: " . print_r($_FILES, true));
error_log("POST data received: " . print_r($_POST, true));

// Validate CIN image is required
if (!isset($_FILES['cin-file-upload'])) {
    http_response_code(400);
    echo json_encode(["error" => "L'image de la carte nationale est obligatoire - fichier non reçu"]);
    ob_end_flush();
    exit;
}

if ($_FILES['cin-file-upload']['error'] !== UPLOAD_ERR_OK) {
    $error_message = "Erreur lors de l'upload: ";
    switch ($_FILES['cin-file-upload']['error']) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $error_message .= "Le fichier est trop volumineux";
            break;
        case UPLOAD_ERR_PARTIAL:
            $error_message .= "Le fichier n'a été que partiellement téléchargé";
            break;
        case UPLOAD_ERR_NO_FILE:
            $error_message .= "Aucun fichier n'a été téléchargé";
            break;
        default:
            $error_message .= "Erreur inconnue (" . $_FILES['cin-file-upload']['error'] . ")";
    }
    http_response_code(400);
    echo json_encode(["error" => $error_message]);
    ob_end_flush();
    exit;
}

// Handle file upload
$cin_img = null;
if (isset($_FILES['cin-file-upload']) && $_FILES['cin-file-upload']['error'] === UPLOAD_ERR_OK) {
    $allowed = ['image/png', 'image/jpeg', 'image/gif'];
    if (!in_array($_FILES['cin-file-upload']['type'], $allowed) || $_FILES['cin-file-upload']['size'] > 10 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["error" => "Fichier invalide ou trop grand"]);
        ob_end_flush();
        exit;
    }
    $upload_dir = '../Uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $file_name = uniqid() . '_' . basename($_FILES['cin-file-upload']['name']);
    $file_path = $upload_dir . $file_name;
    if (!move_uploaded_file($_FILES['cin-file-upload']['tmp_name'], $file_path)) {
        http_response_code(500);
        echo json_encode(["error" => "Échec du téléchargement de l'image"]);
        ob_end_flush();
        exit;
    }
    $cin_img = $file_name;
}

// Hash password
$hashed_password = password_hash($data['MDPS'], PASSWORD_DEFAULT);

// Insert user
try {
    $sql = $db->prepare("INSERT INTO user (NOM, CIN_NUM, CIN_IMG, STATUT, TELE, EMAIL, MDPS, ID_ADMIN) VALUES (:nom, :cin, :cin_img, :statut, :tele, :email, :password, :id_admin)");
    $sql->execute([
        ":nom" => $data['NOM'],
        ":cin" => $data['CIN_NUM'],
        ":cin_img" => $cin_img,
        ":statut" => $data['STATUT'],
        ":tele" => $data['TELE'],
        ":email" => $data['EMAIL'],
        ":password" => $hashed_password,
        ":id_admin" => 1
    ]);
    http_response_code(201);
    echo json_encode(["success" => "Inscription réussie, vous pouvez vous connecter."]);
} catch (PDOException $e) {
    error_log("Insert user error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}


ob_end_flush();
exit;
?>