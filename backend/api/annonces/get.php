<?php
require_once "../config/database.php";
require_once "../config/cors.php";

// Set JSON header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Get query parameters
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    // Build query
    $where_clause = "WHERE 1=1"; // Pas de statut dans la table poste
    $params = [];

    if ($user_id) {
        $where_clause .= " AND p.ID_USER = :user_id";
        $params[':user_id'] = $user_id;
    }

    $sql = "
        SELECT
            p.*,
            u.NOM as AUTEUR_NOM,
            u.IMG_PROFIL as AUTEUR_AVATAR,
            (SELECT COUNT(*) FROM liker l WHERE l.ID_POST = p.ID_POST) as LIKES_COUNT,
            (SELECT COUNT(*) FROM commenter c WHERE c.ID_POST = p.ID_POST) as COMMENTS_COUNT
        FROM poste p
        JOIN user u ON p.ID_USER = u.ID_USER
        $where_clause
        ORDER BY p.DATE_POST DESC
        LIMIT :limit OFFSET :offset
    ";

    $stmt = $db->prepare($sql);

    // Bind parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process the results
    foreach ($posts as &$post) {
        // Process equipments (comma-separated string)
        $post['EQUIPEMENTS'] = $post['EQUIPEMENT'] ? explode(',', $post['EQUIPEMENT']) : [];

        // Process images (multiple images stored as JSON in POST_IMG)
        if ($post['POST_IMG']) {
            // Essayer de décoder le JSON d'abord
            $decoded_images = json_decode($post['POST_IMG'], true);
            if (is_array($decoded_images)) {
                // Si c'est un JSON valide avec un tableau d'images
                $post['IMAGES'] = $decoded_images;
            } else {
                // Si c'est une seule image (ancien format)
                $post['IMAGES'] = [$post['POST_IMG']];
            }
        } else {
            $post['IMAGES'] = [];
        }

        // Format dates
        $post['DATE_CREATION_FORMATTED'] = date('d/m/Y H:i', strtotime($post['DATE_POST']));

        // Calculate time ago
        $time_diff = time() - strtotime($post['DATE_POST']);
        if ($time_diff < 60) {
            $post['TIME_AGO'] = 'à l\'instant';
        } elseif ($time_diff < 3600) {
            $minutes = floor($time_diff / 60);
            $post['TIME_AGO'] = "il y a $minutes minute" . ($minutes > 1 ? 's' : '');
        } elseif ($time_diff < 86400) {
            $hours = floor($time_diff / 3600);
            $post['TIME_AGO'] = "il y a $hours heure" . ($hours > 1 ? 's' : '');
        } else {
            $days = floor($time_diff / 86400);
            $post['TIME_AGO'] = "il y a $days jour" . ($days > 1 ? 's' : '');
        }

        // Format price
        $post['PRIX_FORMATTED'] = number_format($post['PRIX'], 0, ',', ' ') . '€';

        // Build description text
        $type_text = [
            'location' => 'Location',
            'vente' => 'Vente',
            'colocation' => 'Colocation',
            'recherche' => 'Recherche'
        ];

        $etat_text = [
            'meuble' => 'Meublé',
            'non_meuble' => 'Non meublé',
            'partiellement_meuble' => 'Partiellement meublé'
        ];

        $post['TYPE_TEXT'] = $type_text[$post['TYPE_LOC']] ?? $post['TYPE_LOC'];
        $post['ETAT_TEXT'] = $etat_text[$post['ETAT']] ?? $post['ETAT'];

        // Build content summary
        $content_parts = [];
        $content_parts[] = $post['TYPE_TEXT'];
        $content_parts[] = $post['VILLE'];
        if ($post['QUARTIER']) {
            $content_parts[] = $post['QUARTIER'];
        }
        $content_parts[] = $post['PRIX_FORMATTED'];
        if ($post['DUREE']) {
            $content_parts[] = $post['DUREE'];
        }

        if ($post['SURFACE']) {
            $content_parts[] = $post['SURFACE'] . 'm²';
        }
        if ($post['NBRE_PIECE']) {
            $content_parts[] = $post['NBRE_PIECE'] . ' pièces';
        }
        if ($post['ETAT']) {
            $content_parts[] = $post['ETAT_TEXT'];
        }

        $post['CONTENT_SUMMARY'] = implode(' - ', $content_parts);

        // Compatibility fields for frontend
        $post['ID_ANNONCE'] = $post['ID_POST'];
        $post['LOCALISATION'] = $post['VILLE'];
        $post['SUPERFICIE'] = $post['SURFACE'];
        $post['NB_PIECES'] = $post['NBRE_PIECE'];
        $post['TYPE_ANNONCE'] = $post['TYPE_LOC'];
        $post['STATUT_MEUBLE'] = $post['ETAT'];
        $post['VIDEO'] = $post['POST_VID'];
        $post['DATE_CREATION'] = $post['DATE_POST'];
        $post['MEUBLE_TEXT'] = $post['ETAT_TEXT'];
        $post['TYPE_DUREE'] = $post['DUREE'];
        $post['TITRE'] = $post['TYPE_LOC'] . ' - ' . $post['VILLE'];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "annonces" => $posts,
        "total" => count($posts)
    ]);

} catch (PDOException $e) {
    error_log("Get annonces error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur: " . $e->getMessage()]);
}

exit;
?>