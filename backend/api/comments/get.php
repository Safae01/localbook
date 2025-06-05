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
    $postId = isset($_GET['postId']) ? intval($_GET['postId']) : null;
    
    if (!$postId) {
        http_response_code(400);
        echo json_encode(["error" => "ID du post requis"]);
        exit;
    }
    
    // Récupérer les commentaires avec les informations de l'auteur
    $sql = $db->prepare("
        SELECT 
            c.ID_COMMENT, 
            c.ID_USER, 
            c.ID_POST, 
            c.CONTENT, 
            c.DATE_COMMENTS,
            u.NOM as AUTHOR_NAME,
            u.IMG_PROFIL as AUTHOR_AVATAR
        FROM commenter c
        JOIN user u ON c.ID_USER = u.ID_USER
        WHERE c.ID_POST = ?
        ORDER BY c.DATE_COMMENTS DESC
    ");
    
    $sql->execute([$postId]);
    $comments = $sql->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater les dates pour chaque commentaire
    foreach ($comments as &$comment) {
        // Calculer le temps écoulé
        $time_diff = time() - strtotime($comment['DATE_COMMENTS']);
        if ($time_diff < 60) {
            $comment['TIME_AGO'] = 'à l\'instant';
        } elseif ($time_diff < 3600) {
            $minutes = floor($time_diff / 60);
            $comment['TIME_AGO'] = "il y a $minutes minute" . ($minutes > 1 ? 's' : '');
        } elseif ($time_diff < 86400) {
            $hours = floor($time_diff / 3600);
            $comment['TIME_AGO'] = "il y a $hours heure" . ($hours > 1 ? 's' : '');
        } else {
            $days = floor($time_diff / 86400);
            $comment['TIME_AGO'] = "il y a $days jour" . ($days > 1 ? 's' : '');
        }
    }
    
    echo json_encode([
        "success" => true,
        "comments" => $comments
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur serveur: " . $e->getMessage()
    ]);
}
?>