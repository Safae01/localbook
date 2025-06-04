<?php
// Debug endpoint pour voir les données reçues
header('Content-Type: application/json');

echo json_encode([
    "method" => $_SERVER['REQUEST_METHOD'],
    "post_data" => $_POST,
    "files_data" => $_FILES,
    "headers" => getallheaders(),
    "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'not set',
    "php_input" => file_get_contents('php://input')
]);
?>
