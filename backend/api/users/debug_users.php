<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../config/cors.php';

try {
    echo "<h2>Debug des utilisateurs et statuts</h2>";
    
    // 1. Compter tous les utilisateurs
    $query1 = "SELECT COUNT(*) as total FROM user";
    $stmt1 = $db->prepare($query1);
    $stmt1->execute();
    $total = $stmt1->fetch(PDO::FETCH_ASSOC)['total'];
    echo "<p><strong>Total utilisateurs:</strong> $total</p>";
    
    // 2. Voir tous les statuts distincts
    echo "<h3>Statuts disponibles:</h3>";
    $query2 = "SELECT DISTINCT STATUT, COUNT(*) as count FROM user GROUP BY STATUT ORDER BY count DESC";
    $stmt2 = $db->prepare($query2);
    $stmt2->execute();
    
    echo "<ul>";
    while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
        $status = $row['STATUT'] ? "'" . $row['STATUT'] . "'" : 'NULL/VIDE';
        echo "<li><strong>$status:</strong> " . $row['count'] . " utilisateurs</li>";
    }
    echo "</ul>";
    
    // 3. Voir quelques exemples d'utilisateurs
    echo "<h3>Exemples d'utilisateurs:</h3>";
    $query3 = "SELECT ID_USER, NOM, STATUT FROM user LIMIT 10";
    $stmt3 = $db->prepare($query3);
    $stmt3->execute();
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>ID</th><th>Nom</th><th>Statut</th></tr>";
    while ($row = $stmt3->fetch(PDO::FETCH_ASSOC)) {
        $status = $row['STATUT'] ? $row['STATUT'] : 'VIDE';
        echo "<tr><td>" . $row['ID_USER'] . "</td><td>" . $row['NOM'] . "</td><td>$status</td></tr>";
    }
    echo "</table>";
    
    // 4. Test de la requête actuelle
    echo "<h3>Résultat de la requête filtrée:</h3>";
    $query4 = "SELECT COUNT(*) as count FROM user WHERE STATUT IN ('proprietaire', 'intermediaire', 'intermadiaire', 'intermédiaire')";
    $stmt4 = $db->prepare($query4);
    $stmt4->execute();
    $filtered = $stmt4->fetch(PDO::FETCH_ASSOC)['count'];
    echo "<p><strong>Utilisateurs avec statut proprietaire/intermediaire:</strong> $filtered</p>";
    
    // 5. Voir les utilisateurs filtrés
    if ($filtered > 0) {
        echo "<h3>Utilisateurs filtrés:</h3>";
        $query5 = "SELECT ID_USER, NOM, STATUT FROM user WHERE STATUT IN ('proprietaire', 'intermediaire', 'intermadiaire', 'intermédiaire') LIMIT 10";
        $stmt5 = $db->prepare($query5);
        $stmt5->execute();
        
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Nom</th><th>Statut</th></tr>";
        while ($row = $stmt5->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr><td>" . $row['ID_USER'] . "</td><td>" . $row['NOM'] . "</td><td>" . $row['STATUT'] . "</td></tr>";
        }
        echo "</table>";
    }

} catch (PDOException $e) {
    echo "<p style='color: red;'>Erreur: " . $e->getMessage() . "</p>";
}
?>
