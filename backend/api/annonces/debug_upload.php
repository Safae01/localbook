<?php
// Script de debug pour tester l'upload d'images multiples
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

echo json_encode([
    'method' => $_SERVER['REQUEST_METHOD'],
    'files_received' => isset($_FILES) ? array_keys($_FILES) : [],
    'images_info' => isset($_FILES['images']) ? [
        'count' => count($_FILES['images']['name']),
        'names' => $_FILES['images']['name'],
        'types' => $_FILES['images']['type'],
        'sizes' => $_FILES['images']['size'],
        'errors' => $_FILES['images']['error']
    ] : 'No images',
    'post_data' => $_POST,
    'php_max_file_uploads' => ini_get('max_file_uploads'),
    'php_upload_max_filesize' => ini_get('upload_max_filesize'),
    'php_post_max_size' => ini_get('post_max_size')
]);
?>
