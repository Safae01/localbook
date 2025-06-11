-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 11 juin 2025 à 15:54
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `localbook`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `ID_ADMIN` int(11) NOT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `MDPS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`ID_ADMIN`, `EMAIL`, `MDPS`) VALUES
(1, 'sasabenmouna@gmail.com', '1234567\r\n');

-- --------------------------------------------------------

--
-- Structure de la table `chater`
--

CREATE TABLE `chater` (
  `ID_MSG` int(11) NOT NULL,
  `USE_ID_USER` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `CONTENT` longtext DEFAULT NULL,
  `TYPE_CONTENT` varchar(255) DEFAULT NULL,
  `URL_FICHIER` varchar(255) DEFAULT NULL,
  `NOM_FICHIER` varchar(255) DEFAULT NULL,
  `DATE_ENVOI` timestamp NOT NULL DEFAULT current_timestamp(),
  `LU` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commenter`
--

CREATE TABLE `commenter` (
  `ID_COMMENT` int(11) NOT NULL,
  `ID_POST` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `DATE_COMMENTS` timestamp NOT NULL DEFAULT current_timestamp(),
  `CONTENT` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commenter`
--

INSERT INTO `commenter` (`ID_COMMENT`, `ID_POST`, `ID_USER`, `DATE_COMMENTS`, `CONTENT`) VALUES
(1, 1, 2, '2025-06-10 09:25:45', 'SALAM'),
(2, 2, 2, '2025-06-10 11:21:42', 'cc'),
(3, 1, 2, '2025-06-10 11:52:21', 'cc'),
(4, 1, 2, '2025-06-10 12:02:28', 'oui'),
(5, 2, 3, '2025-06-10 12:12:04', 'WOWW'),
(6, 3, 2, '2025-06-10 12:13:50', 'ALLEZZ'),
(7, 3, 2, '2025-06-11 09:25:33', 'ASALAMµ'),
(8, 3, 4, '2025-06-11 10:50:01', 'cdc'),
(9, 3, 4, '2025-06-11 10:53:06', 'knhioh'),
(10, 3, 4, '2025-06-11 10:53:49', 'salam');

-- --------------------------------------------------------

--
-- Structure de la table `enregistrer`
--

CREATE TABLE `enregistrer` (
  `ID_USER` int(11) NOT NULL,
  `ID_POST` int(11) NOT NULL,
  `DATE_SAVE` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enregistrer`
--

INSERT INTO `enregistrer` (`ID_USER`, `ID_POST`, `DATE_SAVE`) VALUES
(2, 2, '2025-06-10 12:03:20'),
(2, 3, '2025-06-11 09:25:20'),
(3, 2, '2025-06-10 12:12:11'),
(4, 1, '2025-06-11 10:54:26'),
(4, 3, '2025-06-11 10:08:00');

-- --------------------------------------------------------

--
-- Structure de la table `follow`
--

CREATE TABLE `follow` (
  `id_follow` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_follower` int(11) NOT NULL,
  `date_follow` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `liker`
--

CREATE TABLE `liker` (
  `ID_USER` int(11) NOT NULL,
  `ID_POST` int(11) NOT NULL,
  `DATE_LIKE` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `liker`
--

INSERT INTO `liker` (`ID_USER`, `ID_POST`, `DATE_LIKE`) VALUES
(2, 3, '2025-06-11 09:25:29'),
(3, 2, '2025-06-11 09:28:28'),
(3, 3, '2025-06-10 12:13:28'),
(4, 1, '2025-06-11 10:54:11'),
(4, 2, '2025-06-11 11:05:09'),
(4, 3, '2025-06-11 11:04:53');

-- --------------------------------------------------------

--
-- Structure de la table `poste`
--

CREATE TABLE `poste` (
  `ID_POST` int(11) NOT NULL,
  `ID_ADMIN` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `TYPE_LOC` longtext DEFAULT NULL,
  `VILLE` longtext DEFAULT NULL,
  `QUARTIER` varchar(255) DEFAULT NULL,
  `DUREE` longtext DEFAULT NULL,
  `PRIX` int(11) DEFAULT NULL,
  `SURFACE` int(11) DEFAULT NULL,
  `NBRE_PIECE` int(11) DEFAULT NULL,
  `ETAT` longtext DEFAULT NULL,
  `EQUIPEMENT` varchar(255) DEFAULT NULL,
  `POST_IMG` varchar(255) DEFAULT NULL,
  `POST_VID` varchar(255) DEFAULT NULL,
  `DESCRIPTION` longtext DEFAULT NULL,
  `DATE_POST` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `poste`
--

INSERT INTO `poste` (`ID_POST`, `ID_ADMIN`, `ID_USER`, `TYPE_LOC`, `VILLE`, `QUARTIER`, `DUREE`, `PRIX`, `SURFACE`, `NBRE_PIECE`, `ETAT`, `EQUIPEMENT`, `POST_IMG`, `POST_VID`, `DESCRIPTION`, `DATE_POST`) VALUES
(1, 1, 2, 'chambre', 'tanger', 'birchifa', 'courte durée', 123, 231, 13, 'meuble', '', '6847fa084f149_Capture d\'écran 2024-11-28 121625.png', '6847fa084f4ca_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-10 09:25:28'),
(2, 1, 2, 'appartement', 'TANGER', 'MARJANE', 'courte durée', 233, 22, 344, 'meuble', 'garage', '684803ddb1648_WhatsApp Image 2025-05-28 at 10.38.16.jpeg', '684803ddb1922_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-10 10:07:25'),
(3, 1, 3, 'appartement', 'TANGER', 'HOMET SEDDAM', 'courte durée', 45, 3456, 3456, 'meuble', 'wifi,terrasse', '684821495b21e_favicon2.png', '684821495b6e5_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-10 12:12:57');

-- --------------------------------------------------------

--
-- Structure de la table `story`
--

CREATE TABLE `story` (
  `ID_STORY` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `ID_ADMIN` int(11) NOT NULL,
  `CONTENT` longtext DEFAULT NULL,
  `DATE_STORY` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `story`
--

INSERT INTO `story` (`ID_STORY`, `ID_USER`, `ID_ADMIN`, `CONTENT`, `DATE_STORY`) VALUES
(1, 2, 1, '68496f1b961d2_1749643035.jpeg', '2025-06-11 11:57:15'),
(2, 2, 1, '68496f2b9a8f0_1749643051.jpeg', '2025-06-11 11:57:31'),
(3, 2, 1, '68497275b322c_1749643893.jpeg', '2025-06-11 12:11:33'),
(4, 2, 1, '684972804ab8a_1749643904.png', '2025-06-11 12:11:44'),
(5, 2, 1, '684972d4d0c77_1749643988.png', '2025-06-11 12:13:08'),
(6, 2, 1, '68497379bf103_1749644153.png', '2025-06-11 12:15:53'),
(7, 2, 1, '684975ab2774a_1749644715.png', '2025-06-11 12:25:15'),
(8, 2, 1, '68497658a3bb7_1749644888.jpeg', '2025-06-11 12:28:08'),
(9, 3, 1, '6849787b76602_1749645435.jpeg', '2025-06-11 12:37:15');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `ID_USER` int(11) NOT NULL,
  `ID_ADMIN` int(11) NOT NULL,
  `NOM` varchar(255) DEFAULT NULL,
  `CIN_NUM` varchar(255) DEFAULT NULL,
  `CIN_IMG` varchar(255) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `MDPS` varchar(255) DEFAULT NULL,
  `IMG_PROFIL` varchar(255) DEFAULT NULL,
  `IMG_COUVERT` varchar(255) DEFAULT NULL,
  `BIO` longtext DEFAULT NULL,
  `STATUT` longtext DEFAULT NULL,
  `AGE` int(11) DEFAULT NULL,
  `DATE_NAISSANCE` date DEFAULT NULL,
  `TELE` varchar(255) DEFAULT NULL,
  `DATE_INSCRIPTION` timestamp NOT NULL DEFAULT current_timestamp(),
  `DATE_BLOCK` timestamp NULL DEFAULT NULL,
  `DUREE` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`ID_USER`, `ID_ADMIN`, `NOM`, `CIN_NUM`, `CIN_IMG`, `EMAIL`, `MDPS`, `IMG_PROFIL`, `IMG_COUVERT`, `BIO`, `STATUT`, `AGE`, `DATE_NAISSANCE`, `TELE`, `DATE_INSCRIPTION`, `DATE_BLOCK`, `DUREE`) VALUES
(1, 1, 'safae', 'FER245', '6847ed51ecdb2_favicon2.png', 'sasabenmouna@gmail.com', '$2y$10$Zr2XKqBFV2QNdUpvkdQxluxLtYZGiHEZnvSHD5mt4uiHZuD9owPpa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 08:31:14', NULL, NULL),
(2, 1, 'safae BENMOUNAa', 'FER245', '6847ed5fa4c01_favicon2.png', 'sasabenmouna1@gmail.com', '$2y$10$8jp/MmV0ct/6vssprZqqZuBFfji280uc/GA4VowN/sw9S.IU6Ibpa', '684840b5cec74_WhatsApp Image 2025-05-28 at 10.38.16.jpeg', '684817e1a0c0d_WhatsApp Image 2025-05-28 at 10.38.16.jpeg', 'Membre de Localbook | Passionné d\'immobilier', 'Membre', 25, '1999-01-01', '+33 6 12 34 56 78', '2025-06-10 08:31:27', NULL, NULL),
(3, 1, 'kenza aboulmajd', 'FER245', '684820fee9ccb_WhatsApp Image 2025-05-28 at 11.08.13.jpeg', 'KENIZA@gmail.com', '$2y$10$TGUEwNDzMGy5hu1cFB2WGeDQdiXZ0Za6eIqer03BtxKT/2ulxAIMa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 12:11:43', NULL, NULL),
(4, 1, 'ayoub jlita', 'GZ327938', '68494c90bc906_L (2).png', 'ayoub@gmail.com', '$2y$10$NS7Och/NxNnD3u5qimwrkexG4be4B8SGSYCD4zFrWckgNHDHvf.86', NULL, NULL, 'Membre de Localbook | Passionné d\'immobilier', 'Membre', 23, '1999-01-01', '06 12 34 56 78', '2025-06-11 09:29:52', NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID_ADMIN`);

--
-- Index pour la table `chater`
--
ALTER TABLE `chater`
  ADD PRIMARY KEY (`ID_MSG`),
  ADD UNIQUE KEY `USE_ID_USER` (`USE_ID_USER`,`ID_USER`,`ID_MSG`),
  ADD KEY `CHATER_FK` (`USE_ID_USER`),
  ADD KEY `CHATER2_FK` (`ID_USER`);

--
-- Index pour la table `commenter`
--
ALTER TABLE `commenter`
  ADD PRIMARY KEY (`ID_COMMENT`),
  ADD UNIQUE KEY `ID_POST` (`ID_POST`,`ID_USER`,`DATE_COMMENTS`),
  ADD KEY `COMMENTER_FK` (`ID_POST`),
  ADD KEY `COMMENTER2_FK` (`ID_USER`);

--
-- Index pour la table `enregistrer`
--
ALTER TABLE `enregistrer`
  ADD PRIMARY KEY (`ID_USER`,`ID_POST`),
  ADD KEY `ENREGISTRER_USER_FK` (`ID_USER`),
  ADD KEY `ENREGISTRER_POST_FK` (`ID_POST`);

--
-- Index pour la table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id_follow`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_follower` (`id_follower`);

--
-- Index pour la table `liker`
--
ALTER TABLE `liker`
  ADD PRIMARY KEY (`ID_USER`,`ID_POST`),
  ADD KEY `LIKER_FK` (`ID_USER`),
  ADD KEY `LIKER2_FK` (`ID_POST`);

--
-- Index pour la table `poste`
--
ALTER TABLE `poste`
  ADD PRIMARY KEY (`ID_POST`),
  ADD KEY `POSTER_FK` (`ID_USER`),
  ADD KEY `SUPP_POSTE_FK` (`ID_ADMIN`);

--
-- Index pour la table `story`
--
ALTER TABLE `story`
  ADD PRIMARY KEY (`ID_STORY`),
  ADD KEY `EMETTRE_FK` (`ID_USER`),
  ADD KEY `SUPP_STORY_FK` (`ID_ADMIN`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID_USER`),
  ADD KEY `BLOQUER_FK` (`ID_ADMIN`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID_ADMIN` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `chater`
--
ALTER TABLE `chater`
  MODIFY `ID_MSG` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commenter`
--
ALTER TABLE `commenter`
  MODIFY `ID_COMMENT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `follow`
--
ALTER TABLE `follow`
  MODIFY `id_follow` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `poste`
--
ALTER TABLE `poste`
  MODIFY `ID_POST` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `story`
--
ALTER TABLE `story`
  MODIFY `ID_STORY` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chater`
--
ALTER TABLE `chater`
  ADD CONSTRAINT `FK_CHATER` FOREIGN KEY (`USE_ID_USER`) REFERENCES `user` (`ID_USER`),
  ADD CONSTRAINT `FK_CHATER2` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Contraintes pour la table `commenter`
--
ALTER TABLE `commenter`
  ADD CONSTRAINT `FK_COMMENTER` FOREIGN KEY (`ID_POST`) REFERENCES `poste` (`ID_POST`),
  ADD CONSTRAINT `FK_COMMENTER2` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Contraintes pour la table `enregistrer`
--
ALTER TABLE `enregistrer`
  ADD CONSTRAINT `FK_ENREGISTRER_POST` FOREIGN KEY (`ID_POST`) REFERENCES `poste` (`ID_POST`),
  ADD CONSTRAINT `FK_ENREGISTRER_USER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`);

--
-- Contraintes pour la table `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`ID_USER`),
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`id_follower`) REFERENCES `user` (`ID_USER`);

--
-- Contraintes pour la table `liker`
--
ALTER TABLE `liker`
  ADD CONSTRAINT `FK_LIKER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`),
  ADD CONSTRAINT `FK_LIKER2` FOREIGN KEY (`ID_POST`) REFERENCES `poste` (`ID_POST`);

--
-- Contraintes pour la table `poste`
--
ALTER TABLE `poste`
  ADD CONSTRAINT `FK_POSTER` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`),
  ADD CONSTRAINT `FK_SUPP_POSTE` FOREIGN KEY (`ID_ADMIN`) REFERENCES `admin` (`ID_ADMIN`);

--
-- Contraintes pour la table `story`
--
ALTER TABLE `story`
  ADD CONSTRAINT `FK_EMETTRE` FOREIGN KEY (`ID_USER`) REFERENCES `user` (`ID_USER`),
  ADD CONSTRAINT `FK_SUPP_STORY` FOREIGN KEY (`ID_ADMIN`) REFERENCES `admin` (`ID_ADMIN`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_BLOQUER` FOREIGN KEY (`ID_ADMIN`) REFERENCES `admin` (`ID_ADMIN`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
