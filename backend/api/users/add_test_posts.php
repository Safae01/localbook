<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../config/database.php';

try {
    echo "=== Ajout de posts de test ===\n\n";
    
    // Récupérer les utilisateurs
    $query = $db->query("SELECT ID_USER, NOM FROM user ORDER BY ID_USER LIMIT 5");
    $users = $query->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) < 2) {
        echo "❌ Pas assez d'utilisateurs pour créer des posts\n";
        exit;
    }
    
    echo "Utilisateurs trouvés:\n";
    foreach ($users as $user) {
        echo "- " . $user['NOM'] . " (ID: " . $user['ID_USER'] . ")\n";
    }
    echo "\n";
    
    // Posts de test à ajouter
    $testPosts = [
        [
            'user_id' => $users[0]['ID_USER'],
            'type_loc' => 'Appartement',
            'ville' => 'Paris',
            'quartier' => 'Marais',
            'prix' => 1200,
            'surface' => 45,
            'nbre_piece' => 2,
            'etat' => 'Meublé',
            'equipement' => 'WiFi, Cuisine équipée',
            'duree' => '6 mois',
            'description' => 'Magnifique appartement au cœur du Marais ! Parfait pour un séjour à Paris. Très lumineux et entièrement rénové.'
        ],
        [
            'user_id' => $users[1]['ID_USER'],
            'type_loc' => 'Studio',
            'ville' => 'Lyon',
            'quartier' => 'Bellecour',
            'prix' => 800,
            'surface' => 25,
            'nbre_piece' => 1,
            'etat' => 'Non meublé',
            'equipement' => 'Balcon, Ascenseur',
            'duree' => '1 an',
            'description' => 'Studio moderne avec vue sur la place Bellecour. Idéal pour étudiant ou jeune professionnel.'
        ],
        [
            'user_id' => $users[0]['ID_USER'],
            'type_loc' => 'Maison',
            'ville' => 'Marseille',
            'quartier' => 'Vieux-Port',
            'prix' => 2000,
            'surface' => 120,
            'nbre_piece' => 4,
            'etat' => 'Meublé',
            'equipement' => 'Jardin, Garage, Piscine',
            'duree' => '2 ans',
            'description' => 'Belle maison provençale avec jardin et piscine. Vue mer exceptionnelle depuis la terrasse.'
        ]
    ];
    
    if (count($users) >= 3) {
        $testPosts[] = [
            'user_id' => $users[2]['ID_USER'],
            'type_loc' => 'Chambre',
            'ville' => 'Toulouse',
            'quartier' => 'Capitole',
            'prix' => 450,
            'surface' => 15,
            'nbre_piece' => 1,
            'etat' => 'Meublé',
            'equipement' => 'Bureau, WiFi',
            'duree' => '9 mois',
            'description' => 'Chambre confortable dans colocation étudiante. Ambiance conviviale garantie !'
        ];
    }
    
    echo "Ajout des posts de test:\n";
    
    foreach ($testPosts as $index => $post) {
        // Vérifier si un post similaire existe déjà
        $checkQuery = $db->prepare("
            SELECT COUNT(*) as count 
            FROM poste 
            WHERE ID_USER = ? AND VILLE = ? AND QUARTIER = ? AND PRIX = ?
        ");
        $checkQuery->execute([$post['user_id'], $post['ville'], $post['quartier'], $post['prix']]);
        $exists = $checkQuery->fetch(PDO::FETCH_ASSOC);
        
        if ($exists['count'] == 0) {
            $insertQuery = $db->prepare("
                INSERT INTO poste (
                    ID_USER, TYPE_LOC, VILLE, QUARTIER, DUREE, PRIX, 
                    SURFACE, NBRE_PIECE, ETAT, EQUIPEMENT, DESCRIPTION, DATE_POST
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $insertQuery->execute([
                $post['user_id'],
                $post['type_loc'],
                $post['ville'],
                $post['quartier'],
                $post['duree'],
                $post['prix'],
                $post['surface'],
                $post['nbre_piece'],
                $post['etat'],
                $post['equipement'],
                $post['description']
            ]);
            
            echo "✅ Post ajouté: " . $post['type_loc'] . " à " . $post['ville'] . " (" . $post['quartier'] . ") - " . $post['prix'] . "€\n";
        } else {
            echo "ℹ️ Post similaire existe déjà: " . $post['type_loc'] . " à " . $post['ville'] . "\n";
        }
    }
    
    echo "\n=== Résumé des posts par utilisateur ===\n";
    
    foreach ($users as $user) {
        $countQuery = $db->prepare("SELECT COUNT(*) as count FROM poste WHERE ID_USER = ?");
        $countQuery->execute([$user['ID_USER']]);
        $count = $countQuery->fetch(PDO::FETCH_ASSOC);
        
        echo "- " . $user['NOM'] . " (ID: " . $user['ID_USER'] . "): " . $count['count'] . " posts\n";
    }
    
    echo "\n✅ Ajout des posts de test terminé !\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}
