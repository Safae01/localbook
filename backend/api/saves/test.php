<?php
require_once dirname(__FILE__) . "/../config/database.php";
require_once dirname(__FILE__) . "/../config/cors.php";

try {
    // Vérifier si la table existe
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables dans la base de données:\n";
    print_r($tables);
    echo "\n\n";

    // Vérifier le contenu de la table ENREGISTRER
    $stmt = $db->query("SELECT * FROM ENREGISTRER");
    $saves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Nombre total d'enregistrements: " . count($saves) . "\n\n";

    if (count($saves) > 0) {
        echo "Premiers enregistrements:\n";
        foreach (array_slice($saves, 0, 5) as $save) {
            echo json_encode($save, JSON_PRETTY_PRINT) . "\n";
        }
    }

    // Vérifier si la table existe et sa structure
    $stmt = $db->query("SHOW CREATE TABLE ENREGISTRER");
    $tableInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "\nStructure de la table:\n";
    echo $tableInfo['Create Table'] . "\n";

} catch (PDOException $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
