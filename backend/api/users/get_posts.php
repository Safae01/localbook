<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
$current_user_id = isset($_GET['current_user_id']) ? $_GET['current_user_id'] : null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

try {
    // Récupérer les posts de l'utilisateur avec les informations de l'auteur
    $query = "
        SELECT 
            p.ID_POST,
            p.ID_USER,
            p.TYPE_LOC,
            p.VILLE,
            p.QUARTIER,
            p.DUREE,
            p.PRIX,
            p.SURFACE,
            p.NBRE_PIECE,
            p.ETAT,
            p.EQUIPEMENT,
            p.POST_IMG,
            p.POST_VID,
            p.DESCRIPTION,
            p.DATE_POST,
            u.NOM as AUTEUR_NOM,
            u.IMG_PROFIL as AUTEUR_AVATAR,
            -- Compter les likes
            (SELECT COUNT(*) FROM liker l WHERE l.ID_POST = p.ID_POST) as LIKES_COUNT,
            -- Compter les commentaires
            (SELECT COUNT(*) FROM commenter c WHERE c.ID_POST = p.ID_POST) as COMMENTS_COUNT,
            -- Vérifier si l'utilisateur actuel a liké ce post
            " . ($current_user_id ? "(SELECT COUNT(*) FROM liker l WHERE l.ID_POST = p.ID_POST AND l.ID_USER = :current_user_id) as IS_LIKED" : "0 as IS_LIKED") . ",
            -- Calculer le temps écoulé
            CASE 
                WHEN TIMESTAMPDIFF(MINUTE, p.DATE_POST, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.DATE_POST, NOW()), ' min')
                WHEN TIMESTAMPDIFF(HOUR, p.DATE_POST, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.DATE_POST, NOW()), ' h')
                WHEN TIMESTAMPDIFF(DAY, p.DATE_POST, NOW()) < 7 THEN CONCAT(TIMESTAMPDIFF(DAY, p.DATE_POST, NOW()), ' j')
                ELSE DATE_FORMAT(p.DATE_POST, '%d/%m/%Y')
            END as TIME_AGO
        FROM poste p
        INNER JOIN user u ON p.ID_USER = u.ID_USER
        WHERE p.ID_USER = :user_id
        ORDER BY p.DATE_POST DESC
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    if ($current_user_id) {
        $stmt->bindParam(':current_user_id', $current_user_id);
    }
    $stmt->execute();

    $posts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Construire les URLs des médias
        $images = [];
        if ($row['POST_IMG']) {
            $images[] = "http://localhost/localbook/backend/api/Uploads/posts/" . $row['POST_IMG'];
        }
        
        $video = null;
        if ($row['POST_VID']) {
            $video = "http://localhost/localbook/backend/api/Uploads/posts/" . $row['POST_VID'];
        }

        // Construire la description avec les détails du post
        $description_parts = [];
        if ($row['DESCRIPTION']) {
            $description_parts[] = $row['DESCRIPTION'];
        }
        
        // Ajouter les détails de l'annonce
        $details = [];
        if ($row['TYPE_LOC']) $details[] = "Type: " . $row['TYPE_LOC'];
        if ($row['VILLE']) $details[] = "Ville: " . $row['VILLE'];
        if ($row['QUARTIER']) $details[] = "Quartier: " . $row['QUARTIER'];
        if ($row['PRIX']) $details[] = "Prix: " . number_format($row['PRIX']) . " €";
        if ($row['SURFACE']) $details[] = "Surface: " . $row['SURFACE'] . " m²";
        if ($row['NBRE_PIECE']) $details[] = "Pièces: " . $row['NBRE_PIECE'];
        if ($row['ETAT']) $details[] = "État: " . $row['ETAT'];
        if ($row['EQUIPEMENT']) $details[] = "Équipement: " . $row['EQUIPEMENT'];
        if ($row['DUREE']) $details[] = "Durée: " . $row['DUREE'];
        
        if (!empty($details)) {
            $description_parts[] = "\n" . implode(" • ", $details);
        }

        $posts[] = [
            'id' => $row['ID_POST'],
            'author' => $row['AUTEUR_NOM'],
            'avatar' => $row['AUTEUR_AVATAR'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['AUTEUR_AVATAR'] : "https://via.placeholder.com/40",
            'time' => $row['TIME_AGO'],
            'content' => implode("", $description_parts),
            'images' => $images,
            'video' => $video,
            'likes' => (int)$row['LIKES_COUNT'],
            'comments' => (int)$row['COMMENTS_COUNT'],
            'isLiked' => $current_user_id ? ((int)$row['IS_LIKED'] > 0) : false,
            'details' => [
                'postType' => $row['TYPE_LOC'],
                'location' => $row['VILLE'],
                'quartier' => $row['QUARTIER'],
                'price' => $row['PRIX'],
                'area' => $row['SURFACE'],
                'rooms' => $row['NBRE_PIECE'],
                'furnishingStatus' => $row['ETAT'],
                'equipment' => $row['EQUIPEMENT'],
                'duration' => $row['DUREE']
            ]
        ];
    }

    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'total' => count($posts)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
