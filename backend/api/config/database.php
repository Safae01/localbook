<?php
    $sdn="mysql:host=localhost;dbname=localbook";
    $username="root";
    $password="";
    try {
        $db = new PDO($sdn, $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        echo "error".$e->getMessage();
        exit;
    }
?>