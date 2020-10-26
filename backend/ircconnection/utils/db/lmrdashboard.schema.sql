-- MariaDB dump 10.17  Distrib 10.5.6-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: lmrdashboard
-- ------------------------------------------------------
-- Server version	10.5.6-MariaDB

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
-- Table structure for table `last_messages`
--

DROP TABLE IF EXISTS `last_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `last_messages` (
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `server` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `last_messages`
--

LOCK TABLES `last_messages` WRITE;
/*!40000 ALTER TABLE `last_messages` DISABLE KEYS */;
INSERT INTO `last_messages` VALUES ('aboft','#aboftytest','this is a test line','2020-10-26 18:44:18'),('aboft','#aboftytest','im gonna ping Asmodean to prove this is a real line','2020-10-26 18:44:24'),('aboft','#aboftytest','linux good windows bad','2020-10-26 18:44:27'),('aboft','#aboftytest','.lines','2020-10-26 18:44:28'),('aboft','#aboftytest','as you can see, we are ignoring bots the best we can','2020-10-26 18:44:47');
/*!40000 ALTER TABLE `last_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online_users`
--

DROP TABLE IF EXISTS `online_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `online_users` (
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `server` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateCreated` datetime DEFAULT current_timestamp(),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online_users`
--

LOCK TABLES `online_users` WRITE;
/*!40000 ALTER TABLE `online_users` DISABLE KEYS */;
INSERT INTO `online_users` VALUES ('tsbottest','#aboftytest','2020-10-26 18:43:54'),('audron','#aboftytest','2020-10-26 18:43:54'),('Asmodean','#aboftytest','2020-10-26 18:43:54'),('aboftybot','#aboftytest','2020-10-26 18:43:54'),('aboft','#aboftytest','2020-10-26 18:43:54');
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

-- Dump completed on 2020-10-26 18:45:54
