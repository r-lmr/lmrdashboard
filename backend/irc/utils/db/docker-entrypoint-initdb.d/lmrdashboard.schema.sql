-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: lmrdashboard
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friend_scores`
--

DROP TABLE IF EXISTS `friend_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_scores` (
  `user` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duccs` int(32) DEFAULT NULL,
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_scores`
--

LOCK TABLES `friend_scores` WRITE;
/*!40000 ALTER TABLE `friend_scores` DISABLE KEYS */;
INSERT INTO `friend_scores` VALUES (' v​olkor',1378),(' s​bl',1372),(' a​udron',420),(' a​boft',436),(' z​owlyfon',411),(' u​nixbird',395),(' p​uretryout',214),(' a​scrod',184),(' s​bbb',167),(' u​1001',158),(' z​',152),(' w​aterlubber',139),(' h​imrin',131),(' r​adiodemon',130),(' t​himoteus',372);
/*!40000 ALTER TABLE `friend_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `killer_scores`
--

DROP TABLE IF EXISTS `killer_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `killer_scores` (
  `user` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duccs` int(32) DEFAULT NULL,
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `killer_scores`
--

LOCK TABLES `killer_scores` WRITE;
/*!40000 ALTER TABLE `killer_scores` DISABLE KEYS */;
INSERT INTO `killer_scores` VALUES (' s​ham1',1021),(' r​0flcopt3r',890),(' j​ennifer-lawrence',882),(' t​sahyt',666),(' m​rneon',501),(' p​b',422),(' s​hibe',401),(' n​ik282000',372),(' z​inn',343),(' a​ndroidkitkat',309),(' c​alexil',297),(' a​smodean',1),(' t​irkaz',220),(' w​inter_fox',339);
/*!40000 ALTER TABLE `killer_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `last_messages`
--

DROP TABLE IF EXISTS `last_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `last_messages` (
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `server` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL DEFAULT utc_timestamp(),
  `userIsBot` boolean
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `last_messages`
--

LOCK TABLES `last_messages` WRITE;
/*!40000 ALTER TABLE `last_messages` DISABLE KEYS */;
INSERT INTO `last_messages` VALUES ('aboft','#aboftytest','this is a test line','2020-10-26 18:44:18', false);
/*!40000 ALTER TABLE `last_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `line_counts`
--

DROP TABLE IF EXISTS `line_counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `line_counts` (
  `count` int(11) DEFAULT NULL,
  `botLines` int(11) DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `line_counts`
--

LOCK TABLES `line_counts` WRITE;
/*!40000 ALTER TABLE `line_counts` DISABLE KEYS */;
INSERT INTO `line_counts` VALUES (7,2,'2020-11-11 00:00:00');
/*!40000 ALTER TABLE `line_counts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online_users`
--

DROP TABLE IF EXISTS `online_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `online_users` (
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateCreated` datetime DEFAULT utc_timestamp(),
  `role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online_users`
--

LOCK TABLES `online_users` WRITE;
/*!40000 ALTER TABLE `online_users` DISABLE KEYS */;
INSERT INTO `online_users` VALUES ('ChanServ','2020-12-26 11:36:38','@'),('lmrdevasmo','2020-12-26 11:36:38',NULL),('audron','2020-12-26 11:36:38','@'),('Asmodean','2020-12-26 11:36:38','@'),('lmrstageboard','2020-12-26 11:36:38',NULL),('gonzobot','2020-12-26 11:36:38',NULL);
/*!40000 ALTER TABLE `online_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-26 11:37:26
