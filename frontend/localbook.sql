-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 14 juin 2025 à 21:35
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.2.0

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
(14, 10, 5, '2025-06-12 22:02:41', 'NADI ENDK HDCHI AZINA'),
(16, 10, 5, '2025-06-13 13:44:20', 'wow'),
(18, 10, 5, '2025-06-13 13:49:16', 'wowww'),
(20, 11, 2, '2025-06-13 13:58:38', 'chrilii'),
(21, 10, 5, '2025-06-13 14:16:53', 'dijfhhfr'),
(22, 11, 6, '2025-06-13 20:19:13', 'DRFTVYGHUNJ'),
(23, 11, 2, '2025-06-14 12:35:47', 'salam'),
(24, 11, 2, '2025-06-14 12:40:26', 'dcdz'),
(28, 9, 2, '2025-06-14 13:00:03', 'cc'),
(29, 10, 2, '2025-06-14 13:01:54', 'salam');

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
(2, 9, '2025-06-12 21:50:22'),
(3, 11, '2025-06-12 22:26:57'),
(5, 10, '2025-06-13 14:17:09'),
(6, 11, '2025-06-13 20:27:45');

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

--
-- Déchargement des données de la table `follow`
--

INSERT INTO `follow` (`id_follow`, `id_user`, `id_follower`, `date_follow`) VALUES
(3, 2, 3, '2025-06-11 23:20:55'),
(10, 3, 2, '2025-06-12 22:46:09'),
(12, 5, 3, '2025-06-12 23:23:41'),
(20, 2, 5, '2025-06-13 15:28:37'),
(21, 5, 2, '2025-06-13 15:33:04'),
(23, 5, 6, '2025-06-13 21:24:29');

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
(2, 9, '2025-06-12 22:45:07'),
(2, 11, '2025-06-13 15:16:34'),
(2, 12, '2025-06-14 14:06:41'),
(3, 9, '2025-06-12 21:28:02'),
(3, 10, '2025-06-12 22:27:10'),
(3, 11, '2025-06-12 22:27:12'),
(5, 9, '2025-06-13 13:57:31'),
(5, 10, '2025-06-13 14:13:27'),
(5, 11, '2025-06-12 22:22:51'),
(6, 11, '2025-06-13 20:19:04');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `ID_NOTIFICATION` int(11) NOT NULL,
  `ID_USER_FROM` int(11) NOT NULL COMMENT 'Utilisateur qui fait l''action',
  `ID_USER_TO` int(11) NOT NULL COMMENT 'Utilisateur qui reçoit la notification',
  `ID_POST` int(11) DEFAULT NULL COMMENT 'Post concerné (pour likes, commentaires)',
  `TYPE_NOTIFICATION` enum('like','comment','follow','mention') NOT NULL,
  `MESSAGE` text NOT NULL COMMENT 'Message de la notification',
  `IS_READ` tinyint(1) DEFAULT 0 COMMENT '0 = non lu, 1 = lu',
  `DATE_CREATED` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`ID_NOTIFICATION`, `ID_USER_FROM`, `ID_USER_TO`, `ID_POST`, `TYPE_NOTIFICATION`, `MESSAGE`, `IS_READ`, `DATE_CREATED`) VALUES
(9, 3, 2, 9, 'like', 'a aimé votre publication', 1, '2025-06-13 13:04:21'),
(10, 4, 2, 9, 'comment', 'a commenté votre publication', 1, '2025-06-13 09:37:21'),
(11, 3, 2, NULL, 'follow', 'a commencé à vous suivre', 1, '2025-06-10 13:37:21'),
(12, 2, 3, 9, 'like', 'a aimé votre publication', 1, '2025-06-13 13:04:21'),
(13, 4, 3, 9, 'comment', 'a commenté votre publication', 1, '2025-06-13 10:37:21'),
(14, 2, 3, NULL, 'follow', 'a commencé à vous suivre', 1, '2025-06-11 13:37:21'),
(15, 2, 4, 9, 'like', 'a aimé votre publication', 0, '2025-06-13 13:21:21'),
(16, 3, 4, 9, 'comment', 'a commenté votre publication', 0, '2025-06-13 08:37:21'),
(17, 2, 4, NULL, 'follow', 'a commencé à vous suivre', 0, '2025-06-12 13:37:21'),
(18, 2, 5, 9, 'like', 'a aimé votre publication', 1, '2025-06-13 13:18:21'),
(19, 3, 5, 9, 'comment', 'a commenté votre publication', 1, '2025-06-13 06:37:21'),
(20, 2, 5, NULL, 'follow', 'a commencé à vous suivre', 1, '2025-06-12 13:37:21'),
(21, 5, 2, 10, 'like', 'a aimé votre publication', 1, '2025-06-13 13:48:14'),
(22, 5, 2, 10, 'like', 'a aimé votre publication', 1, '2025-06-13 13:48:35'),
(23, 2, 5, 11, 'like', 'a aimé votre publication', 1, '2025-06-13 13:54:24'),
(24, 5, 3, 9, 'like', 'a aimé votre publication', 1, '2025-06-13 13:57:31'),
(25, 5, 2, 10, 'like', 'a aimé votre publication', 1, '2025-06-13 13:58:16'),
(26, 2, 5, 11, 'like', 'a aimé votre publication', 1, '2025-06-13 13:59:22'),
(27, 5, 2, 10, 'like', 'a aimé votre publication', 1, '2025-06-13 14:13:27'),
(28, 5, 2, 10, 'comment', 'a commenté votre publication', 1, '2025-06-13 14:16:53'),
(29, 5, 2, 10, 'mention', 'a enregistré votre publication', 1, '2025-06-13 14:17:09'),
(30, 5, 2, NULL, 'follow', 'a commencé à vous suivre', 1, '2025-06-13 14:17:26'),
(31, 2, 5, NULL, 'follow', 'a commencé à vous suivre', 1, '2025-06-13 14:17:53'),
(32, 5, 2, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:19:44'),
(33, 2, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:20:26'),
(34, 2, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:20:45'),
(35, 2, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:26:45'),
(36, 5, 2, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:28:37'),
(37, 2, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 14:33:04'),
(38, 2, 5, 11, 'like', 'a aimé votre publication', 1, '2025-06-13 15:16:34'),
(39, 6, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 20:18:03'),
(40, 6, 5, 11, 'like', 'a aimé votre publication', 1, '2025-06-13 20:19:04'),
(41, 6, 5, 11, 'comment', 'a commenté votre publication', 1, '2025-06-13 20:19:13'),
(42, 6, 5, NULL, 'follow', 's\'est abonné à vous', 1, '2025-06-13 20:24:29'),
(43, 6, 5, 11, 'mention', 'a enregistré votre publication', 1, '2025-06-13 20:27:45'),
(44, 2, 5, 11, 'comment', 'a commenté votre publication', 1, '2025-06-14 12:35:47'),
(45, 2, 5, 11, 'comment', 'a commenté votre publication', 1, '2025-06-14 12:40:26'),
(46, 2, 5, 11, 'comment', 'a commenté votre publication', 1, '2025-06-14 12:44:24'),
(47, 2, 3, 9, 'comment', 'a commenté votre publication', 0, '2025-06-14 12:56:52'),
(48, 2, 3, 9, 'comment', 'a commenté votre publication', 0, '2025-06-14 12:57:01'),
(49, 2, 3, 9, 'comment', 'a commenté votre publication', 0, '2025-06-14 13:00:03');

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
(9, 1, 3, 'maison', 'marrakech', 'gueliz', 'courte durée', 283, 100, 1, 'meuble', 'wifi,garage,parking,terrasse,salleDeSport', '[\"684b462e08cae_salon-Maroua-Ihrai2.jpg\",\"684b462e09170_images.jpg\",\"684b462e09671_1-1024x768.jpg\"]', '684b462e09871_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-12 21:27:10'),
(10, 1, 2, 'maison', 'oujda', 'lazaret', 'courte durée', 234, 334, 12, 'meuble', 'wifi,garage,terrasse,parking', '[\"684b4b5ba19c4_salon-Maroua-Ihrai2.jpg\",\"684b4b5ba1e1a_images.jpg\",\"684b4b5ba22cb_1-1024x768.jpg\"]', '684b4b5ba24a4_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-12 21:49:15'),
(11, 1, 5, 'maison', 'oujda', 'cih', 'courte durée', 134, 24, 4, 'meuble', 'garage', '[\"684b533443bc6_salon-Maroua-Ihrai2.jpg\",\"684b533444031_images.jpg\"]', '684b533444269_Plan maison - vidéo - Séjour & salle à manger.mp4', '', '2025-06-12 22:22:44'),
(12, 1, 2, 'maison', 'tanger', 'ézfg', 'courte durée', 116, 3214, 2343, 'meuble', 'wifi', '[\"684d806c9c298_images.jpg\",\"684d806c9ce99_1-1024x768.jpg\"]', '684d806c9d175_Plan maison - vidéo - Séjour & salle à manger.mp4', 'wow c bien', '2025-06-14 14:00:12');

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
(9, 3, 1, '6849787b76602_1749645435.jpeg', '2025-06-11 12:37:15'),
(11, 2, 1, '684b46f2e7684_1749763826.jpg', '2025-06-12 21:30:26'),
(12, 2, 1, '684b4c22ac42e_1749765154.jpg', '2025-06-12 21:52:34'),
(13, 2, 1, '684d8220ba099_1749910048.jpg', '2025-06-14 14:07:28'),
(14, 2, 1, '684d8224c8a4a_1749910052.jpg', '2025-06-14 14:07:32'),
(15, 2, 1, '684d8229146c4_1749910057.jpg', '2025-06-14 14:07:37');

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
  `DUREE` longtext DEFAULT NULL,
  `VILLE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`ID_USER`, `ID_ADMIN`, `NOM`, `CIN_NUM`, `CIN_IMG`, `EMAIL`, `MDPS`, `IMG_PROFIL`, `IMG_COUVERT`, `BIO`, `STATUT`, `AGE`, `DATE_NAISSANCE`, `TELE`, `DATE_INSCRIPTION`, `DATE_BLOCK`, `DUREE`, `VILLE`) VALUES
(2, 1, 'safae BENMOUNA', 'FER245', '684b5aef41b79_WhatsApp Image 2025-01-23 à 21.40.12_a0d322f5.jpg', 'sasabenmouna1@gmail.com', '$2y$10$8jp/MmV0ct/6vssprZqqZuBFfji280uc/GA4VowN/sw9S.IU6Ibpa', '684b4af677c51_WhatsApp Image 2024-04-15 à 02.57.52_7d11936d.jpg', '684b4b1971e84_téléchargement.jpg', 'Membre de Localbook | Passionné d\'immobilier', 'intermediaire', 25, '1999-01-01', '0687654321', '2025-06-10 08:31:27', NULL, NULL, 'tanger'),
(3, 1, 'kenza aboulmajd', 'FER245', '684b53c57ee6f_WhatsApp Image 2025-01-23 à 21.40.12_a0d322f5.jpg', 'KENIZA@gmail.com', '$2y$10$TGUEwNDzMGy5hu1cFB2WGeDQdiXZ0Za6eIqer03BtxKT/2ulxAIMa', '684b2fb245707_Capture d’écran 2022-04-11 230506.png', NULL, 'FZAF', 'proprietaire', 18, '2025-06-22', '0698765432', '2025-06-10 12:11:43', NULL, NULL, 'FES'),
(4, 1, 'ayoub jlita', 'GZ327938', '68494c90bc906_L (2).png', 'ayoub@gmail.com', '$2y$10$NS7Och/NxNnD3u5qimwrkexG4be4B8SGSYCD4zFrWckgNHDHvf.86', NULL, NULL, 'Membre de Localbook | Passionné d\'immobilier', 'Membre', 23, '1999-01-01', '0623456789', '2025-06-11 09:29:52', NULL, NULL, '0'),
(5, 1, 'taha khlifi', 'F123455', '684b5259c1f79_888859.png', 'taha@gmail.com', '$2y$10$WYhOYmci2UGAl4eoZenofOtzpguFFbPwDrwZtX5On/kEkKjav1YP.', '684b4dde04cef_WhatsApp Image 2025-06-12 à 20.40.52_c4b0a3ee.jpg', '684b4dde04e84_téléchargement.jpg', 'HUSBAND de safae', 'locataire', 18, '2002-10-29', '0634567890', '2025-06-12 21:58:32', NULL, NULL, 'oujda'),
(6, 1, 'ghita aboulmajd', 'cd445890', '684c8589e4f18_Best Breakfast Recipes With Eggs - Food_com.jpeg', 'ghita67@gmail.com', '$2y$10$S3ZZBbW4Y7wsAQK9Mky3KOkuZ0fQckDO0w0p7ZADVAYc7CULzgcqG', '684c88d7b25a5_549d374_2015-05-24T140743Z_01_TOR903_RTRIDSP_3_PEOPLE-NASH.jpg', NULL, 'JE SUIS ETUDIANTE', 'Employé', 24, '2000-09-10', '0691347878', '2025-06-13 20:09:46', NULL, NULL, 'CASA MAARIF'),
(7, 1, 'ZA', 'ZEFRG', '684c86c566f4e_salon-Maroua-Ihrai2.jpg', 'kenza@gmail.com', '$2y$10$dsMF6KMl5kv4oZiFlBUNOeCkK3cEHPP9H.cgGqR0zQoSEAUF089T2', NULL, NULL, NULL, 'Employé', NULL, NULL, '12345', '2025-06-13 20:15:01', NULL, NULL, NULL);

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
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`ID_NOTIFICATION`),
  ADD KEY `FK_NOTIFICATION_USER_FROM` (`ID_USER_FROM`),
  ADD KEY `FK_NOTIFICATION_USER_TO` (`ID_USER_TO`),
  ADD KEY `FK_NOTIFICATION_POST` (`ID_POST`),
  ADD KEY `IDX_USER_TO_READ` (`ID_USER_TO`,`IS_READ`),
  ADD KEY `IDX_DATE_CREATED` (`DATE_CREATED`),
  ADD KEY `IDX_NOTIFICATIONS_UNREAD` (`ID_USER_TO`,`IS_READ`,`DATE_CREATED`);

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
  MODIFY `ID_COMMENT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `follow`
--
ALTER TABLE `follow`
  MODIFY `id_follow` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `ID_NOTIFICATION` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `poste`
--
ALTER TABLE `poste`
  MODIFY `ID_POST` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `story`
--
ALTER TABLE `story`
  MODIFY `ID_STORY` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_NOTIFICATION_POST` FOREIGN KEY (`ID_POST`) REFERENCES `poste` (`ID_POST`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_NOTIFICATION_USER_FROM` FOREIGN KEY (`ID_USER_FROM`) REFERENCES `user` (`ID_USER`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_NOTIFICATION_USER_TO` FOREIGN KEY (`ID_USER_TO`) REFERENCES `user` (`ID_USER`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `FK_BLOQUER` FOREIGN KEY (`ID_ADMIN`) REFERENCES `admin` (`ID_ADMIN`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
