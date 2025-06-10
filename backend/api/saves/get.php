<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required"]);
    exit;
}

try {
    $userId = $_GET['user_id'];

    $query = "SELECT 
                p.*,
                u.NOM as AUTEUR_NOM, 
                u.IMG_PROFIL as AUTEUR_AVATAR,
                e.DATE_SAVE,
                p.TYPE_LOC,
                p.VILLE,
                p.QUARTIER,
                p.PRIX,
                p.SURFACE,
                p.NBRE_PIECE,
                p.ETAT,
                p.DUREE,
                p.EQUIPEMENT,
                p.DESCRIPTION,
                p.POST_IMG,
                p.POST_VID,
                (SELECT COUNT(*) FROM LIKER l WHERE l.ID_POST = p.ID_POST) as LIKES_COUNT,
                (SELECT COUNT(*) FROM COMMENTER c WHERE c.ID_POST = p.ID_POST) as COMMENTS_COUNT,
                (SELECT COUNT(*) > 0 FROM LIKER l WHERE l.ID_POST = p.ID_POST AND l.ID_USER = ?) as IS_LIKED,
                CASE
                    WHEN TIMESTAMPDIFF(SECOND, e.DATE_SAVE, NOW()) < 60 THEN 'À l''instant'
                    WHEN TIMESTAMPDIFF(MINUTE, e.DATE_SAVE, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, e.DATE_SAVE, NOW()), ' min')
                    WHEN TIMESTAMPDIFF(HOUR, e.DATE_SAVE, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, e.DATE_SAVE, NOW()), ' h')
                    ELSE DATE_FORMAT(e.DATE_SAVE, '%d/%m/%Y')
                END as TIME_AGO
              FROM POSTE p 
              INNER JOIN ENREGISTRER e ON p.ID_POST = e.ID_POST
              INNER JOIN USER u ON p.ID_USER = u.ID_USER
              LEFT JOIN LIKER l ON p.ID_POST = l.ID_POST AND l.ID_USER = ?
              WHERE e.ID_USER = ?
              ORDER BY e.DATE_SAVE DESC";

    $stmt = $db->prepare($query);
    $stmt->execute([$userId, $userId, $userId]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "posts" => $posts
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
