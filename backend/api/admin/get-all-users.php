<?php
require_once "../config/database.php";
require_once "../config/cors.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

try {
    // Récupérer tous les utilisateurs pour l'admin
    $query = "SELECT
                u.ID_USER,
                u.NOM,
                u.EMAIL,
                u.IMG_PROFIL,
                u.IMG_COUVERT,
                u.VILLE,
                u.STATUT,
                u.TELE,
                u.DATE_INSCRIPTION,
                u.BIO,
                u.AGE,
                u.CIN_NUM
                FROM user u
                ORDER BY u.DATE_INSCRIPTION DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $users[] = [
            'ID_USER' => $row['ID_USER'],
            'NOM' => $row['NOM'],
            'EMAIL' => $row['EMAIL'],
            'IMG_PROFIL' => $row['IMG_PROFIL'],
            'IMG_COUVERT' => $row['IMG_COUVERT'],
            'VILLE' => $row['VILLE'],
            'STATUT' => $row['STATUT'],
            'TELE' => $row['TELE'],
            'DATE_INSCRIPTION' => $row['DATE_INSCRIPTION'],
            'BIO' => $row['BIO'],
            'AGE' => $row['AGE'],
            'CIN_NUM' => $row['CIN_NUM']
        ];
    }

    echo json_encode([
        'success' => true,
        'users' => $users,
        'total' => count($users)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
