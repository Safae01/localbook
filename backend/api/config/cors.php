<?php
// Allow requests from the specified frontend origin
header("Access-Control-Allow-Origin: http://localhost:5173");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
?>