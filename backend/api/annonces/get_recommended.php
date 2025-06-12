<?php
require_once "../../config/database.php";
require_once "../../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {    // Build query to get posts ordered by likes count
    $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;

    $sql = "
        SELECT
            p.ID_POST,
            p.DESCRIPTION,
            p.POST_IMG as IMAGE,
            p.POST_VID as VIDEO,
            p.DATE_POST,
            p.ID_USER,
            p.PRIX,
            p.SURFACE,
            p.VILLE,
            p.QUARTIER,
            p.TYPE_LOC,
            p.DUREE,
            p.NBRE_PIECE,
            p.ETAT,
            p.EQUIPEMENT,
            u.NOM as AUTEUR_NOM,
            u.IMG_PROFIL as AUTEUR_AVATAR,
            (SELECT COUNT(*) FROM LIKER l WHERE l.ID_POST = p.ID_POST) as LIKES_COUNT,
            (SELECT COUNT(*) FROM COMMENTER c WHERE c.ID_POST = p.ID_POST) as COMMENTS_COUNT,
            CASE 
                WHEN e.ID_USER IS NOT NULL THEN '1'
                ELSE '0'
            END as IS_SAVED
        FROM POSTE p
        JOIN USER u ON p.ID_USER = u.ID_USER
        LEFT JOIN ENREGISTRER e ON e.ID_POST = p.ID_POST AND e.ID_USER = :user_id
        ORDER BY LIKES_COUNT DESC
        LIMIT 20
    ";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    $posts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $posts[] = [
            'id' => $row['ID_POST'],
            'content' => $row['DESCRIPTION'],
            'image' => $row['IMAGE'],
            'video' => $row['VIDEO'],
            'created_at' => $row['DATE_POST'],
            'user_id' => $row['ID_USER'],
            'username' => $row['AUTEUR_NOM'],
            'profile_photo' => $row['AUTEUR_AVATAR'],
            'like_count' => $row['LIKES_COUNT'],
            'comment_count' => $row['COMMENTS_COUNT'],
            'price' => $row['PRIX'],
            'surface' => $row['SURFACE'],
            'city' => $row['VILLE'],
            'neighborhood' => $row['QUARTIER'],
            'type' => $row['TYPE_LOC'],
            'duration' => $row['DUREE'],
            'rooms' => $row['NBRE_PIECE'],
            'state' => $row['ETAT'],
            'equipment' => $row['EQUIPEMENT'],
            'is_saved' => $row['IS_SAVED']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $posts
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur lors de la récupération des posts'
    ]);
}
?>