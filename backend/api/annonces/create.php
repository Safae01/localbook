<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Suppress any unexpected output
ob_start();

try {
    require_once "../config/database.php";
    require_once "../config/cors.php";
} catch (Exception $e) {
    ob_end_clean();
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["error" => "Erreur de configuration: " . $e->getMessage()]);
    exit;
}

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

// Debug: Log received data
error_log("Received POST data: " . print_r($data, true));
error_log("Received FILES data: " . print_r($_FILES, true));

// Check required fields
if (
    empty($data['ID_USER']) || empty($data['TYPE_LOC']) ||
    empty($data['VILLE']) || empty($data['PRIX'])
) {
    http_response_code(400);
    echo json_encode([
        "error" => "Veuillez remplir tous les champs obligatoires",
        "received_data" => $data
    ]);
    ob_end_flush();
    exit;
}

// Validate price
if (!is_numeric($data['PRIX']) || $data['PRIX'] <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Le prix doit être un nombre positif"]);
    ob_end_flush();
    exit;
}

// Handle image upload (single image for POST_IMG)
$post_img = null;
if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && count($_FILES['images']['name']) > 0) {
    $upload_dir = '../Uploads/posts/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];

    // Prendre seulement la première image
    if ($_FILES['images']['error'][0] === UPLOAD_ERR_OK) {
        if (
            !in_array($_FILES['images']['type'][0], $allowed) ||
            $_FILES['images']['size'][0] > 10 * 1024 * 1024
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Fichier image invalide ou trop grand"]);
            ob_end_flush();
            exit;
        }

        $file_name = uniqid() . '_' . basename($_FILES['images']['name'][0]);
        $file_path = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['images']['tmp_name'][0], $file_path)) {
            $post_img = $file_name;
        }
    }
}

// Handle video upload
$post_vid = null;
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $allowed_video = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (
        !in_array($_FILES['video']['type'], $allowed_video) ||
        $_FILES['video']['size'] > 50 * 1024 * 1024
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Fichier vidéo invalide ou trop grand (max 50MB)"]);
        ob_end_flush();
        exit;
    }

    $upload_dir = '../Uploads/posts/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $video_name = uniqid() . '_' . basename($_FILES['video']['name']);
    $video_path = $upload_dir . $video_name;

    if (move_uploaded_file($_FILES['video']['tmp_name'], $video_path)) {
        $post_vid = $video_name;
    }
}

// Prepare equipments
$equipements = null;
if (isset($data['equipements'])) {
    if (is_array($data['equipements'])) {
        $equipements = implode(',', $data['equipements']);
    } else if (is_string($data['equipements'])) {
        // Si c'est déjà une chaîne JSON, la décoder puis la reconvertir
        $decoded = json_decode($data['equipements'], true);
        if (is_array($decoded)) {
            $equipements = implode(',', $decoded);
        } else {
            $equipements = $data['equipements'];
        }
    }
}

try {
    // Debug: Log what we're about to insert
    $insert_data = [
        ":id_user" => $data['ID_USER'],
        ":id_admin" => 1, // ID admin par défaut
        ":type_loc" => $data['TYPE_LOC'],
        ":ville" => $data['VILLE'],
        ":quartier" => $data['QUARTIER'] ?? null,
        ":duree" => $data['DUREE'] ?? null,
        ":prix" => $data['PRIX'],
        ":surface" => $data['SURFACE'] ?? null,
        ":nbre_piece" => $data['NBRE_PIECE'] ?? null,
        ":etat" => $data['ETAT'] ?? null,
        ":equipement" => $equipements,
        ":post_img" => $post_img,
        ":post_vid" => $post_vid,
        ":description" => $data['DESCRIPTION'] ?? null
    ];

    error_log("Insert data: " . print_r($insert_data, true));

    $sql = $db->prepare("
        INSERT INTO poste (
            ID_USER, ID_ADMIN, TYPE_LOC, VILLE, QUARTIER, DUREE, PRIX,
            SURFACE, NBRE_PIECE, ETAT, EQUIPEMENT, POST_IMG, POST_VID, DESCRIPTION
        ) VALUES (
            :id_user, :id_admin, :type_loc, :ville, :quartier, :duree, :prix,
            :surface, :nbre_piece, :etat, :equipement, :post_img, :post_vid, :description
        )
    ");

    $result = $sql->execute($insert_data);

    if (!$result) {
        throw new PDOException("Échec de l'exécution de la requête");
    }

    $post_id = $db->lastInsertId();

    error_log("Post created successfully with ID: " . $post_id);

    // Clean output buffer before sending response
    ob_clean();

    http_response_code(201);
    echo json_encode([
        "success" => "Post créé avec succès",
        "post_id" => $post_id
    ]);

} catch (PDOException $e) {
    error_log("Create post error: " . $e->getMessage());
    error_log("SQL Error Info: " . print_r($sql->errorInfo(), true));

    // Clean output buffer before sending response
    ob_clean();

    http_response_code(500);
    echo json_encode([
        "error" => "Erreur serveur: " . $e->getMessage(),
        "sql_error" => $sql->errorInfo()
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());

    // Clean output buffer before sending response
    ob_clean();

    http_response_code(500);
    echo json_encode([
        "error" => "Erreur générale: " . $e->getMessage()
    ]);
}

ob_end_flush();
exit;
?>