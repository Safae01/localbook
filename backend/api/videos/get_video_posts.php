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

$current_user_id = isset($_GET['current_user_id']) ? $_GET['current_user_id'] : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

try {
    // Récupérer seulement les posts qui ont des vidéos
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
        WHERE p.POST_VID IS NOT NULL AND p.POST_VID != ''
        ORDER BY p.DATE_POST DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    if ($current_user_id) {
        $stmt->bindParam(':current_user_id', $current_user_id);
    }
    $stmt->execute();

    $posts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Pour les posts vidéos, on ne retourne QUE la vidéo (pas les images)
        $images = []; // Pas d'images dans la vue vidéos

        $video = null;
        if ($row['POST_VID']) {
            $video = "http://localhost/localbook/backend/api/Uploads/posts/" . $row['POST_VID'];
        }

        // Construire la description avec les détails du post
        $description_parts = [];
        if ($row['DESCRIPTION']) {
            $description_parts[] = $row['DESCRIPTION'];
        }

        $posts[] = [
            'id' => $row['ID_POST'],
            'userId' => $row['ID_USER'],
            'author' => $row['AUTEUR_NOM'],
            'avatar' => $row['AUTEUR_AVATAR'] ? "http://localhost/localbook/backend/api/Uploads/users/" . $row['AUTEUR_AVATAR'] : "https://via.placeholder.com/40",
            'time' => $row['TIME_AGO'],
            'content' => implode("", $description_parts),
            'images' => $images,
            'video' => $video,
            'likes' => (int) $row['LIKES_COUNT'],
            'comments' => (int) $row['COMMENTS_COUNT'],
            'isLiked' => $current_user_id ? ((int) $row['IS_LIKED'] > 0) : false,
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

    // Compter le total de posts avec vidéos
    $countQuery = "SELECT COUNT(*) as total FROM poste WHERE POST_VID IS NOT NULL AND POST_VID != ''";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute();
    $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'posts' => $posts,
        'total' => (int) $totalResult['total'],
        'has_more' => ($offset + $limit) < (int) $totalResult['total']
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
