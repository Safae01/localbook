<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

// Vérifier la connexion
if (!$db) {
    echo json_encode([
        'success' => false,
        'error' => 'Could not connect to database'
    ]);
    exit;
}

try {
    // Récupérer les stories avec les informations des utilisateurs
    $query = "SELECT s.*, u.NOM as AUTHOR_NAME, u.IMG_PROFIL as AUTHOR_AVATAR 
              FROM STORY s 
              JOIN USER u ON s.ID_USER = u.ID_USER 
              WHERE s.DATE_STORY >= DATE_SUB(NOW(), INTERVAL 24 HOUR) 
              ORDER BY s.DATE_STORY DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $stories = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $story_item = array(
            'ID_STORY' => $row['ID_STORY'],
            'ID_USER' => $row['ID_USER'],
            'CONTENT' => $row['CONTENT'],
            'AUTHOR_NAME' => $row['AUTHOR_NAME'],
            'AUTHOR_AVATAR' => $row['AUTHOR_AVATAR'],
            'DATE_STORY' => $row['DATE_STORY']
        );
        array_push($stories, $story_item);
    }

    echo json_encode([
        'success' => true,
        'stories' => $stories
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => "Database error: " . $e->getMessage()
    ]);
}