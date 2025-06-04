<?php
// Version simplifiée pour debug
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Configuration de la base de données directement ici
    $host = 'localhost';
    $dbname = 'localbook';
    $username = 'root';
    $password = '';

    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get form data
    $data = $_POST;

    // Validation simple
    if (empty($data['ID_USER']) || empty($data['TYPE_LOC']) || empty($data['VILLE']) || empty($data['PRIX'])) {
        echo json_encode([
            "error" => "Champs obligatoires manquants",
            "received" => $data
        ]);
        exit;
    }

    // Handle multiple images upload
    $post_img = null;
    $uploaded_images = [];

    if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && count($_FILES['images']['name']) > 0) {
        $upload_dir = '../Uploads/posts/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];

        // Traiter toutes les images uploadées
        for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                if (in_array($_FILES['images']['type'][$i], $allowed) && $_FILES['images']['size'][$i] <= 10 * 1024 * 1024) {
                    $file_name = uniqid() . '_' . basename($_FILES['images']['name'][$i]);
                    $file_path = $upload_dir . $file_name;

                    if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $file_path)) {
                        $uploaded_images[] = $file_name;
                    }
                }
            }
        }

        // Stocker les images en JSON si au moins une image a été uploadée
        if (!empty($uploaded_images)) {
            $post_img = json_encode($uploaded_images);
        }
    }

    // Handle video upload
    $post_vid = null;
    if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
        $allowed_video = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        if (in_array($_FILES['video']['type'], $allowed_video) && $_FILES['video']['size'] <= 50 * 1024 * 1024) {
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
    }

    // Prepare equipments
    $equipements = null;
    if (isset($data['equipements'])) {
        if (is_array($data['equipements'])) {
            $equipements = implode(',', $data['equipements']);
        } else if (is_string($data['equipements'])) {
            $decoded = json_decode($data['equipements'], true);
            if (is_array($decoded)) {
                $equipements = implode(',', $decoded);
            } else {
                $equipements = $data['equipements'];
            }
        }
    }

    // Insert avec tous les champs
    $sql = $db->prepare("
        INSERT INTO poste (
            ID_USER, ID_ADMIN, TYPE_LOC, VILLE, QUARTIER, DUREE, PRIX,
            SURFACE, NBRE_PIECE, ETAT, EQUIPEMENT, POST_IMG, POST_VID, DESCRIPTION
        ) VALUES (
            :id_user, 1, :type_loc, :ville, :quartier, :duree, :prix,
            :surface, :nbre_piece, :etat, :equipement, :post_img, :post_vid, :description
        )
    ");

    $result = $sql->execute([
        ':id_user' => $data['ID_USER'],
        ':type_loc' => $data['TYPE_LOC'],
        ':ville' => $data['VILLE'],
        ':quartier' => $data['QUARTIER'] ?? null,
        ':duree' => $data['DUREE'] ?? null,
        ':prix' => $data['PRIX'],
        ':surface' => $data['SURFACE'] ?? null,
        ':nbre_piece' => $data['NBRE_PIECE'] ?? null,
        ':etat' => $data['ETAT'] ?? null,
        ':equipement' => $equipements,
        ':post_img' => $post_img,
        ':post_vid' => $post_vid,
        ':description' => $data['DESCRIPTION'] ?? null
    ]);

    if ($result) {
        echo json_encode([
            "success" => "Post créé avec succès",
            "post_id" => $db->lastInsertId()
        ]);
    } else {
        echo json_encode([
            "error" => "Échec de l'insertion"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "error" => "Erreur: " . $e->getMessage()
    ]);
}
?>