<?php
// Test direct de la base de données
try {
    $host = 'localhost';
    $dbname = 'localbook';
    $username = 'root';
    $password = '';
    
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connexion à la base de données réussie<br>";
    
    // Test de la table poste
    $query = $db->query("DESCRIBE poste");
    $columns = $query->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Structure de la table 'poste':</h3>";
    echo "<table border='1'>";
    echo "<tr><th>Colonne</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    foreach ($columns as $col) {
        echo "<tr>";
        echo "<td>{$col['Field']}</td>";
        echo "<td>{$col['Type']}</td>";
        echo "<td>{$col['Null']}</td>";
        echo "<td>{$col['Key']}</td>";
        echo "<td>{$col['Default']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Test d'insertion
    echo "<h3>Test d'insertion:</h3>";
    $sql = $db->prepare("
        INSERT INTO poste (ID_USER, ID_ADMIN, TYPE_LOC, VILLE, PRIX, DESCRIPTION) 
        VALUES (2, 1, 'location', 'Test Ville', 1000, 'Test description')
    ");
    
    if ($sql->execute()) {
        $id = $db->lastInsertId();
        echo "✅ Insertion réussie avec ID: $id<br>";
        
        // Supprimer le test
        $db->prepare("DELETE FROM poste WHERE ID_POST = ?")->execute([$id]);
        echo "✅ Test supprimé<br>";
    } else {
        echo "❌ Échec de l'insertion<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage();
}
?>
