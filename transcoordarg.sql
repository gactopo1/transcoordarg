-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: transcoordarg
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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
-- Table structure for table `datumhor`
--

DROP TABLE IF EXISTS `datumhor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datumhor` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `elipsoide` text NOT NULL,
  `semimayor` double NOT NULL,
  `invflattening` double NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datumhor`
--

LOCK TABLES `datumhor` WRITE;
/*!40000 ALTER TABLE `datumhor` DISABLE KEYS */;
INSERT INTO `datumhor` VALUES (1062,'POSGAR 07','GSR80',6378137,298.2572235631),(1257,'Tapi Aike','Internacional 1924',6378388,297),(1258,'Ministerio de Marina Norte','Internacional 1924',6378388,297),(1259,'Ministerio de Marina Sur','Internacional 1924',6378388,297),(6160,'Chos Malal 1914','Internacional 1924',6378388,297),(6190,'POSGAR 98','GSR80',6378137,298.257222101),(6221,'Campo Inchauspe 1969','Internacional 1924',6378388,297),(6694,'POSGAR 94','WGS84',6378137,298.2572235631),(10001,'Carranza','Internacional 1924',6378137,297),(10002,'25 de Mayo','Internacional 1924',6378388,297),(10003,'Aguaray','Internacional 1924',6378388,297),(10004,'TDF95','WGS84',6378137,298.2572235631),(10005,'Pampa del Castillo','Internacional 1924',6378388,297),(10006,'Castelli - Bs.As.','Internacional 1924',6378388,297),(10007,'Castelli - Entre Rios','Internacional 1924',6378388,297),(10008,'Castelli - Mendoza','Internacional 1924',6378388,297),(10009,'Ubajay','Internacional 1924',6378388,297),(10010,'Yavi','Internacional 1924',6378388,297),(10011,'Hito XVIII 1963','Internacional 1924',6378388,297),(10012,'CABA - 1919','WGS84',6378137,298.2572235631),(10013,'CABA - P07','WGS84',6378137,298.2572235631),(10014,'Astra Minas','Internacional 1924',6378388,297),(10015,'Provincial Bs.As.','WGS84',6378137,298.2572235631),(10016,'PASMA Bs.As.','WGS84',6378137,298.2572235631),(10018,'PASMA Catamarca','WGS84',6378137,298.2572235631),(10020,'Provincial Chaco','WGS84',6378137,298.2572235631),(10021,'PASMA Chaco','WGS84',6378137,298.2572235631),(10022,'Provincial Chubut','WGS84',6378137,298.2572235631),(10023,'PASMA Chubut','WGS84',6378137,298.2572235631),(10024,'Provincial Cordoba','WGS84',6378137,298.2572235631),(10025,'Provincial Corrientes','WGS84',6378137,298.2572235631),(10026,'PASMA Corrientes','WGS84',6378137,298.2572235631),(10027,'Provincial Entre Rios','WGS84',6378137,298.2572235631),(10028,'Provincial Formosa','WGS84',6378137,298.2572235631),(10029,'PASMA Formosa','WGS84',6378137,298.2572235631),(10030,'PASMA Entre Rios','WGS84',6378137,298.2572235631),(10031,'Provincial Jujuy','WGS84',6378137,298.2572235631),(10032,'PASMA Jujuy','WGS84',6378137,298.2572235631),(10033,'PASMA La Pampa','WGS84',6378137,298.2572235631),(10034,'PASMA La Rioja','WGS84',6378137,298.2572235631),(10035,'Provincial Mendoza','WGS84',6378137,298.2572235631),(10036,'PASMA Mendoza','WGS84',6378137,298.2572235631),(10037,'Provincial Misiones','WGS84',6378137,298.2572235631),(10038,'PASMA Misiones','WGS84',6378137,298.2572235631),(10039,'Provincial Neuquen','WGS84',6378137,298.2572235631),(10040,'PASMA Neuquen','WGS84',6378137,298.2572235631),(10041,'Provincial Rio Negro','WGS84',6378137,298.2572235631),(10042,'PASMA Rio Negro','WGS84',6378137,298.2572235631),(10043,'PASMA Salta','WGS84',6378137,298.2572235631),(10044,'PASMA San Juan','WGS84',6378137,298.2572235631),(10045,'PASMA San Luis','WGS84',6378137,298.2572235631),(10046,'PASMA Santa Cruz','WGS84',6378137,298.2572235631),(10047,'Provincial Santa Fe','WGS84',6378137,298.2572235631),(10048,'PASMA Santa Fe','WGS84',6378137,298.2572235631),(10049,'PASMA Santiago del Estero','WGS84',6378137,298.2572235631),(10050,'PASMA Tierra del Fuego','WGS84',6378137,298.2572235631),(10051,'Provincial Tucuman','WGS84',6378137,298.2572235631),(10052,'PASMA Tucuman','WGS84',6378137,298.2572235631);
/*!40000 ALTER TABLE `datumhor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scrusuario`
--

DROP TABLE IF EXISTS `scrusuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scrusuario` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `datumhor` int(11) NOT NULL,
  `proyeccion` text NOT NULL,
  `lo0` double NOT NULL,
  `la0` double NOT NULL,
  `fe` double NOT NULL,
  `fn` double NOT NULL,
  `facesc` double NOT NULL,
  `lat1` double NOT NULL,
  `lon1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon2` double NOT NULL,
  `parametros` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scrusuario`
--

LOCK TABLES `scrusuario` WRITE;
/*!40000 ALTER TABLE `scrusuario` DISABLE KEYS */;
INSERT INTO `scrusuario` VALUES (1,'UNO',10003,'TM',-69,-90,2500000,0,1,0,0,0,0,'');
/*!40000 ALTER TABLE `scrusuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siscoorgeocentricas`
--

DROP TABLE IF EXISTS `siscoorgeocentricas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siscoorgeocentricas` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `datumhor` int(11) NOT NULL,
  `lat1` double NOT NULL,
  `lon1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon2` double NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siscoorgeocentricas`
--

LOCK TABLES `siscoorgeocentricas` WRITE;
/*!40000 ALTER TABLE `siscoorgeocentricas` DISABLE KEYS */;
INSERT INTO `siscoorgeocentricas` VALUES (4928,'POSGAR 94',6694,-54.93,-73.59,-21.78,-53.65),(4960,'POSGAR 98',6190,-54.93,-73.59,-21.78,53.65),(5341,'POSGAR 07',1062,-54.93,-73.59,-21.78,-53.65);
/*!40000 ALTER TABLE `siscoorgeocentricas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siscoorgeodesicas`
--

DROP TABLE IF EXISTS `siscoorgeodesicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siscoorgeodesicas` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `datumhor` int(11) NOT NULL,
  `lat1` double NOT NULL,
  `lon1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon2` double NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siscoorgeodesicas`
--

LOCK TABLES `siscoorgeodesicas` WRITE;
/*!40000 ALTER TABLE `siscoorgeodesicas` DISABLE KEYS */;
INSERT INTO `siscoorgeodesicas` VALUES (4160,'Chos Malal 1914',6160,-43.41,-70.51,-31.91,-67.49),(4161,'Pampa del Castillo',10005,-42.49,-65.47,-51.34,-73.59),(4190,'POSGAR 98',6190,-54.93,-73.59,-21.78,-53.65),(4221,'Campo Inchauspe 1969',6221,-54.93,-73.59,-21.78,-53.65),(4694,'POSGAR 94',6694,-54.93,-73.59,-21.78,-53.65),(5340,'POSGAR 07',1062,-54.93,-73.59,-21.78,-53.65),(9248,'Tapi Aike',1257,-52.43,-73.28,-50.33,-68.3),(9251,'Ministerio de Marina Norte',1258,-55.11,-68.64,-52.39,-63.73),(9253,'Ministerio de Marina Sur',1259,-55.11,-68.64,-52.39,-63.73),(9497,'CABA - P07',6694,-34.71,-58.54,-34.5,-58.29),(9498,'CABA - 1919',6694,-34.71,-58.54,-34.5,-58.29),(10002,'Carranza (Chumbicha)',10001,-28.5,-66,-29,-66.5),(10003,'Castelli - Buenos Aires',10006,-33,-63,-41,-56.5),(10004,'Castelli - Entre Rios',10007,-30,-60.8,-34,-57.7),(10005,'Castelli - Mendoza',10008,-32,-70.5,-37.5,-66.4),(10006,'25 de Mayo',10002,-31,-68,-32,-69),(10007,'Ubajay',10009,0,0,0,0),(10008,'Aguaray',10003,0,0,0,0),(10009,'TDF 95',10004,-52,-65,-55,-68),(10010,'Yavi',10010,0,0,0,0),(10011,'Hito XVIII 1963',10011,-52,-65,-55,-68),(10012,'Astra Minas',10014,-45.19,-67.1,-46.7,-69.5),(10013,'Provincial Bs.As.',10015,-33,-63,-41,-56.5),(10014,'PASMA Bs.As.',10016,-33,-63,-41,-56.5),(10016,'PASMA Catamarca',10018,-25.16,-69.11,-30.18,-64.7),(10017,'Provincial Chaco',10020,-24,-63.5,-28.18,-58.37),(10018,'PASMA Chaco',10021,-24,-63.5,-28.18,-58.37),(10019,'Provincial Chubut',10022,-42,-72.23,-46,-63.5),(10020,'PASMA Chubut',10023,-42,-72.23,-46,-63.5),(10021,'Provincial Cordoba',10024,-29.5,-65.8,-35,-61.7),(10022,'Provincial Corrientes',10025,-27.3,-59.7,-30.8,-55.6),(10023,'PASMA Corrientes',10025,-27.3,-59.7,-30.8,-55.6),(10024,'Provincial Entre Rios',10027,-30,-60.8,-34,-57.7),(10025,'PASMA Entre Rios',10030,-30,-60.8,-34,-57.7),(10026,'Provincial Formosa',10028,-22.5,-62.3,-26.9,-57.5),(10027,'PASMA Formosa',10029,-22.5,-62.3,-26.9,-57.5),(10028,'Provincial Jujuy',10031,-21.7,-67.2,-24.6,-64.1),(10029,'PASMA Jujuy',10032,-21.7,-67.2,-24.6,-64.1),(10030,'PASMA La Pampa',10033,-35,-68.3,-39.3,-63.3),(10031,'PASMA La Rioja',10034,-27.7,-69.7,-32,-65.4),(10032,'Provincial Mendoza',10035,-32,-70.5,-37.5,-66.4),(10033,'PASMA Mendoza',10036,-32,-70.5,-37.5,-66.4),(10034,'Provincial Misiones',10037,-25.5,-56,-28.2,-53.6),(10035,'PASMA Misiones',10038,-25.5,-56,-28.2,-53.6),(10036,'Provincial Neuquen',10039,-36.1,-71.9,-41,-67.9),(10037,'PASMA Neuquen',10040,-36.1,-71.9,-41,-67.9),(10038,'Provincial Rio Negro',10041,-37.6,-71.9,-42.1,-62.76),(10039,'PASMA Rio Negro',10042,-37.6,-71.9,-42.1,-62.76),(10040,'PASMA Salta',10043,-22,-68.5,-26.3,-62.3),(10041,'PASMA San Juan',10044,-28,-70.5,-32.6,-66.7),(10042,'PASMA San Luis',10045,-31.9,-67.4,-36,-64.8),(10043,'PASMA Santa Cruz',10046,-46,-73.5,-52.4,-65.6),(10044,'Provincial Santa Fe',10047,-28,-62.8,-34.4,-58.8),(10045,'PASMA Santa Fe',10048,-28,-62.8,-34.4,-58.8),(10046,'PASMA Santiago del Estero',10049,-25.74,-65.2,-30.5,-61.6),(10047,'PASMA Tierra del Fuego',10050,-52,-65,-55,-68),(10048,'Provincial Tucuman',10051,-26,-66.2,-28,-64.4),(10049,'PASMA Tucuman',10052,-26,-66.2,-28,-64.4);
/*!40000 ALTER TABLE `siscoorgeodesicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siscoorproyectadas`
--

DROP TABLE IF EXISTS `siscoorproyectadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siscoorproyectadas` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `datumhor` int(11) NOT NULL,
  `proyeccion` text NOT NULL,
  `lo0` double NOT NULL,
  `la0` double NOT NULL,
  `fe` double NOT NULL,
  `fn` double NOT NULL,
  `facesc` double NOT NULL,
  `lat1` double NOT NULL,
  `lon1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon2` double NOT NULL,
  `parametros` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siscoorproyectadas`
--

LOCK TABLES `siscoorproyectadas` WRITE;
/*!40000 ALTER TABLE `siscoorproyectadas` DISABLE KEYS */;
INSERT INTO `siscoorproyectadas` VALUES (1004,'Buenos Aires - Faja 4',10015,'TM',-63,-90,4500000,0,1,-33,-63,-41,-61.5,''),(1005,'Buenos Aires - Faja 5',10015,'TM',-60,-90,5500000,0,1,-33,-61.5,-41,-58.5,''),(1006,'Buenos Aires - Faja 6',10016,'TM',-57,-90,6500000,0,1,-33,-58.5,-41,-55.5,''),(2081,'Chos Malal 1914 - Faja 2',6160,'TM',-69,-90,2500000,0,1,-43.41,-70.51,-31.91,-67.49,''),(2082,'Pampa del Castillo - Faja 2',10005,'TM',-69,-90,2500000,0,1,-50.34,-70.5,-42.49,-67.49,''),(2083,'Hito XVIII 1963 - Faja 2',10011,'TM',-69,-90,2500000,0,1,-54.9,-68.64,-52.59,-67.5,''),(2084,'Hito XVIII 1963 / UTM zona 19S',10011,'TM',-69,0,500000,10000000,0.9996,-55.96,-74.83,-51.99,-66.33,''),(2315,'Campo Inchauspe / UTM zona 19S',6221,'TM',-69,0,500000,10000000,0.9996,-54.93,-73.59,-21.78,-53.65,''),(2316,'Campo Inchauspe / UTM zona 20S',6221,'TM',-63,0,500000,10000000,0.9996,-54.93,-73.59,-21.78,-53.65,''),(5343,'POSGAR 07 - Faja 1',1062,'TM',-72,-90,1500000,0,1,-52,-73.5,-36.16,-70.5,''),(5344,'POSGAR 07 - Faja 2',1062,'TM',-69,-90,2500000,0,1,-55,-70.5,-24.08,-67.49,''),(5345,'POSGAR 07 - Faja 3',1062,'TM',-66,-90,3500000,0,1,-55,-67.5,-21.78,-64.49,''),(5346,'POSGAR 07 - Faja 4',1062,'TM',-63,-90,4500000,0,1,-43.14,-64.5,-21.99,-61.49,''),(5347,'POSGAR 07 - Faja 5',1062,'TM',-60,-90,5500000,0,1,-39.06,-61.51,-23.37,-58.5,''),(5348,'POSGAR 07 - Faja 6',1062,'TM',-57,-90,6500000,0,1,-38.59,-58.5,-24.84,-55.49,''),(5349,'POSGAR 07 - Faja 7',1062,'TM',-54,-90,7500000,0,1,-28.11,-55.5,-25.49,-53.65,''),(9249,'Tapi Aike / Faja 1',1257,'TM',-72,-90,1500000,0,1,-52.43,-73.28,-50.33,-70.5,''),(9250,'Tapi Aike / Faja 2',1257,'TM',-69,-90,2500000,0,1,-52.43,-70.5,-50.33,-68.3,''),(9252,'Ministerio de Marina Norte - Faja 2',1258,'TM',-69,-90,2500000,0,1,-55.11,-68.64,-52.59,-63.73,''),(9254,'Ministerio de Marina Sur - Faja 2',1259,'TM',-69,-90,2500000,0,1,-55.11,-68.64,-52.59,-63.73,''),(9265,'POSGAR 07 / UTM zona 19S',1062,'TM',-69,0,500000,10000000,0.9996,-54.61,-68.62,-51.65,-66,''),(9282,'Pampa del Castillo - Faja 1',10005,'TM',-72,-90,1500000,0,1,-51.34,-73.59,-44.94,-70.5,''),(9285,'Pampa del Castillo - Faja 3',10005,'TM',-66,-90,3500000,0,1,-49.05,-67.5,-43.58,-65.47,''),(9497,'CABA 1919',10012,'TM',-58.46330833,-34.62926667,20000,70000,1,-34.71,-58.54,-34.5,-58.29,''),(9498,'CABA - P07',10013,'TM',-58.46330833,-34.62926667,20000,70000,1,-34.71,-58.54,-34.5,-58.29,''),(10001,'TDF 95 - Faja 2',10004,'TM',-69,-90,2500000,0,1,-52,-67.5,-55,-68,''),(10002,'TDF 95 - Faja 3',10004,'TM',-66,-90,3500000,0,1,-52,-65,-55,-67.5,''),(10003,'Astra Minas / UTM',10014,'TM',-65.25,-37.25,500000,6250000,0.9996,-45.19,-67.1,-46.7,-69.5,''),(10004,'YAVI',10010,'TM',-65.5,-23.5,3500000,7000000,1,-23.5,-65.5,-22.5,-64.5,''),(22171,'POSGAR 98 / Faja 1',6190,'TM',-72,-90,1500000,0,1,-52,-73.5,-36.16,-70.5,''),(22172,'POSGAR 98 / Faja 2',6190,'TM',-69,-90,2500000,0,1,-55,-70.5,-24.08,-67.49,''),(22173,'POSGAR 98 / Faja 3',6190,'TM',-66,-90,3500000,0,1,-55,-67.5,-21.78,-64.49,''),(22174,'POSGAR 98 / Faja 4',6190,'TM',-63,-90,4500000,0,1,-43.14,-64.5,-21.98,-61.49,''),(22175,'POSGAR 98 / Faja 5',6190,'TM',-60,-90,5500000,0,1,-39.59,-61.51,-23.27,-58.5,''),(22176,'POSGAR 98 / Faja 6',6190,'TM',-57,-90,6500000,0,1,-38.59,-58.5,-24.84,-55.49,''),(22177,'POSGAR 98 / Faja 7',6190,'TM',-54,-90,7500000,0,1,-28.11,-55.5,-25.49,-53.65,''),(22181,'POSGAR 94 / Faja 1',6694,'TM',-72,-90,1500000,0,1,-52,-73.5,-36.16,-70.5,''),(22182,'POSGAR 94 / Faja 2',6694,'TM',-69,-90,2500000,0,1,-55,-70.5,-24.08,-67.49,''),(22183,'POSGAR 94 / Faja 3',6694,'TM',-66,-90,3500000,0,1,-55,-67.5,-21.78,-64.49,''),(22184,'POSGAR 94 / Faja 4',6694,'TM',-63,-90,4500000,0,1,-43.14,-64.5,-21.98,-61.49,''),(22185,'POSGAR 94 / Faja 5',6694,'TM',-60,-90,5500000,0,1,-39.06,-61.51,-23.37,-58.5,''),(22186,'POSGAR 94 / Faja 6',6694,'TM',-57,-90,6500000,0,1,-38.59,-58.5,-24.84,-55.49,''),(22187,'POSGAR 94 / Faja 7',6694,'TM',-54,-90,7500000,0,1,-28.11,-55.5,-25.49,-53.65,''),(22191,'Campo Inchauspe - Faja 1',6221,'TM',-72,-90,1500000,0,1,-52,-73.5,-36.16,-70.5,''),(22192,'Campo Inchauspe - Faja 2',6221,'TM',-69,-90,2500000,0,1,-55,-70.5,-24.08,-67.49,''),(22193,'Campo Inchauspe - Faja 3',6221,'TM',-66,-90,3500000,0,1,-55,-67.5,-21.78,-64.49,''),(22194,'Campo Inchauspe - Faja 4',6221,'TM',-63,-90,4500000,0,1,-43.14,-64.5,-21.99,-61.49,''),(22195,'Campo Inchauspe - Faja 5',6221,'TM',-60,-90,5500000,0,1,-39.06,-61.51,-23.37,-58.5,''),(22196,'Campo Inchauspe - Faja 6',6221,'TM',-57,-90,6500000,0,1,-38.59,-58.5,-24.84,-55.49,''),(22197,'Campo Inchauspe - Faja 7',6221,'TM',-54,-90,7500000,0,1,-28.11,-55.5,-25.49,-53.65,'');
/*!40000 ALTER TABLE `siscoorproyectadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trandatum`
--

DROP TABLE IF EXISTS `trandatum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trandatum` (
  `codigo` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `Descripcion` text NOT NULL,
  `datumorigen` int(11) NOT NULL,
  `datumdestino` int(11) NOT NULL,
  `transformacion` text NOT NULL,
  `dx` double NOT NULL,
  `dy` double NOT NULL,
  `dz` double NOT NULL,
  `rx` double NOT NULL,
  `ry` double NOT NULL,
  `rz` double NOT NULL,
  `k` double NOT NULL,
  `param1` text NOT NULL,
  `param2` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trandatum`
--

LOCK TABLES `trandatum` WRITE;
/*!40000 ALTER TABLE `trandatum` DISABLE KEYS */;
INSERT INTO `trandatum` VALUES (1527,'Campo Inchauspe 1969 - POSGAR 94 (Neuquen - EPSG)','Nuequen - Area Auca Mahuida - Derivado de las Estaciones Cerro Colorado y Chihuido Sur, vinculadas a 4 estaciones IGS (feb-1995)',6221,6694,'Traslacion Geocentrica',-154.5,150.7,100.4,0,0,0,1,'',''),(1528,'Chos Malal 1914 - Campo Inchauspe 1969','Neuquen Area Auca Mahuida - EPSG',6160,6221,'Traslacion Geocentrica',160,26,41,0,0,0,1,'',''),(5350,'Campo Inchauspe 1969 - POSGAR 07 (NIMA)','Adoptado por U.S. Defense Mapping Agency, asumiendo que POSGAR 07 es igual a WGS84',6221,1062,'Traslacion Geocentrica',-148,136,90,0,0,0,1,'',''),(9257,'Chos Malal 1914 - POSGAR 94 (13)','Nuequen - Derivado de 13 estaciones comunes',6160,6694,'Traslacion Geocentrica',8.88,184.86,106.69,0,0,0,1,'',''),(9258,'Chos Malal 1914 - POSGAR 94 (43)','Nuequen - Derivado por YPF de 43 estaciones comunes',6160,6694,'Traslacion Geocentrica',15.75,164.93,126.18,0,0,0,1,'',''),(9259,'Pampa del Castillo - POSGAR 94 (YPF)','Derivado por YPF de 22 estaciones comunes de la Cuenca del Golfo San Jorge',10005,6694,'Traslacion Geocentrica',-233.43,6.65,173.64,0,0,0,1,'',''),(9260,'Tapi Aike - POSGAR 94 (EPSG)','',1257,6694,'Traslacion Geocentrica',-192.26,65.72,132.08,0,0,0,1,'',''),(9261,'Ministerio de Marina Norte - POSGAR 94 (EPSG)','',1258,6694,'Traslacion Geocentrica',-9.5,122.9,138.2,0,0,0,1,'',''),(9262,'Ministerio de Marina Sur - POSGAR 94 (EPSG)','',1259,6694,'Traslacion Geocentrica',-78.1,101.6,133.3,0,0,0,1,'',''),(10001,'Campo Inchauspe 1969 - POSGAR 94 (Neuquen YPF)','Derivado por YPF de 43 estaciones comunes de la Cuenca Neuquina',6221,6694,'Traslacion Geocentrica',-148.73,133.91,87,0,0,0,1,'',''),(10002,'Chos Malal 1914 - Campo Inchauspe 1969 (YPF)','Derivado por YPF de 43 estaciones comunes de la Cuenca Neuquina',6160,6221,'Traslacion Geocentrica',164.47,31.02,39.17,0,0,0,1,'',''),(10003,'Campo Inchauspe 1969 - POSGAR 94 (IGN)','Adoptado por U.S. Defense Mapping Agency',6221,6694,'Traslacion Geocentrica',-148,136,90,0,0,0,1,'',''),(10004,'POSGAR 94 - POSGAR 07 (IGN)','',6694,1062,'Traslacion Geocentrica',0.41,-0.46,0.35,0,0,0,1,'',''),(10005,'Pampa del Castillo - Campo Inchauspe 1969 (YPF)','Derivado por YPF de 22 estaciones comunes de la Cuenca del Golfo San Jorge',10005,1062,'Traslacion Geocentrica',-86.7,-129.9,85.8,0,0,0,1,'',''),(10006,'Campo Inchauspe 1969 - POSGAR 94 (Golfo San Jorge YPF)','Derivado por YPF de 22 estaciones comunes de la Cuenca del Golfo San Jorge',6221,6694,'Traslacion Geocentrica',-146.73,136.55,87.85,0,0,0,1,'',''),(10100,'Yavi - Campo Inchauspe 1969 (IGN) 2D','',10010,6221,'Traslacion 2D',102,89,0,0,0,0,1,'',''),(10101,'Carranza (Chumbicha) - Campo Inchauspe 1969 (IGN) 2D','',10001,6221,'Traslacion 2D',-152,-235,0,0,0,0,1,'',''),(10102,'Castelli(Buenos Aires) - Campo Inchauspe 1969 (IGN) 2D','',10006,6221,'Traslacion 2D',-21,10,0,0,0,0,1,'',''),(10103,'Castelli(Entre Rios) - Campo Inchauspe 1969 (IGN) 2D','',10007,6221,'Traslacion 2D',-19,3,0,0,0,0,1,'',''),(10104,'Castelli(Mendoza) - Campo Inchauspe 1969 (IGN) 2D','',10008,6221,'Traslacion 2D',-25,-4,0,0,0,0,1,'',''),(10105,'25 de Mayo - Campo Inchauspe 1969 (IGN) 2D','',10002,6221,'Traslacion 2D',-364,-178,0,0,0,0,1,'',''),(10106,'Ubajay - Campo Inchauspe 1969 (IGN) 2D','',10009,6221,'Traslacion 2D',84,-58,0,0,0,0,1,'',''),(10107,'Chos Malal 1914 - Campo Inchauspe 1969 (IGN) 2D','',6160,6221,'Traslacion 2D',-50,-163,0,0,0,0,1,'',''),(10108,'Pampa del Castillo - Campo Inchauspe 1969 (IGN) 2D','',10005,6221,'Traslacion 2D',-126,-128,0,0,0,0,1,'',''),(10109,'Tapi Aike - Campo Inchauspe 1969 (IGN) 2D','',1257,6221,'Traslacion 2D',72,-65,0,0,0,0,1,'',''),(10110,'Chos Malal 1914 - Campo Inchauspe 1969 (IGM) 2D','',6160,6221,'Traslacion 2D',-50.5,-161.8,0,0,0,0,1,'',''),(10111,'Chos Malal 1914 - Campo Inchauspe 1969 (YPF) 2D','',6160,6221,'Traslacion 2D',-49.33,-164.65,0,0,0,0,1,'',''),(10112,'Pampa del Castillo - Campo Inchauspe 1969 (YPF) 2D','',10005,6221,'Traslacion 2D',-124.48,127.49,0,0,0,0,1,'',''),(10113,'TDF95 - POSGAR 07 (7 parametros Oficial Provincia)','',10004,1062,'Helmert',1.942,-1.669,3.113,0.095991474,0.162845879,0.078076798,0.02852173,'',''),(10114,'TDF95 - POSGAR 07 (7 parametros Recursos Hidricos)','',10004,1062,'Helmert',1.52,-1.468,3.133,0.09269417,0.14807666,0.07814111,0.0629396,'',''),(10115,'TDF95 - POSGAR 07 (7 parametros EARG1)','',10004,1062,'Helmert',1.759,-1.639,2.998,0.0928038,0.158117,0.0825435,0.0227497,'',''),(10116,'TDF95 - POSGAR 07 (7 parametros EARG2)','',10004,1062,'Helmert',1.794,-0.804,2.253,0.0568286,0.1560966,0.079504,0.0028609,'',''),(10117,'Provincial Bs.As. - POSGAR 07','',10015,1062,'Helmert',-0.019,2.418,-1.81,-0.068918,-0.011429,-0.030926,0.01837109,'',''),(10118,'PASMA Bs.As. - POSGAR 07','',10016,1062,'Helmert',1.051,1.325,-0.038,-0.005125,0.027715,-0.044405,0.002150532,'',''),(10120,'PASMA Catamarca - POSGAR 07','',10018,1062,'Helmert',-6.499,-6.305,3.741,0.21692,-0.052818,0.228955,-0.121884,'',''),(10121,'PASMA Chaco - POSGAR 07','',10021,1062,'Helmert',1.34,1.018,-0.346,-0.009007,0.040145,-0.040949,-0.07136196,'',''),(10122,'Provincial Chaco - POSGAR 07','',10020,1062,'Helmert',-6.633,8.439,-15.929,-0.49447,-0.31722,0.043445,0.3537386,'',''),(10123,'Provincial Chubut - POSGAR 07','',10022,1062,'Helmert',-0.152,-0.962,-0.003,0.02774,-0.000297,0.014419,-0.0648549,'',''),(10124,'PASMA Chubut - POSGAR 07','',10023,1062,'Helmert',-7.365,-10.099,7.572,0.391988,-0.050686,0.280938,0.05351439,'',''),(10125,'Provincial Cordoba - POSGAR 07','',10024,1062,'Helmert',1.095,0.731,0.042,-0.00509,0.016748,-0.039081,0.02868793,'',''),(10126,'Provincial Corrientes - POSGAR 07','',10025,1062,'Helmert',1.802,0.825,0.51,0.026186,0.039533,-0.057727,-0.1126084,'',''),(10127,'PASMA Corrientes - POSGAR 07','',10025,1062,'Helmert',0.157,-0.027,1.148,0.048357,0.031737,0.002647,0.08176927,'',''),(10128,'Provincial Entre Rios - Posgar 07','',10027,1062,'Helmert',-3.75,-14.45,16.399,0.642347,0.192136,0.305834,-0.1453053,'',''),(10129,'PASMA Entre Rios - Posgar 07','',10030,1062,'Helmert',-0.357,-0.32,0.974,0.040251,0.030369,0.020768,0.002126994,'',''),(10130,'Provincial Formosa - Posgar 07','',10028,1062,'Helmert',17.935,-4.29,25.262,0.717865,0.63527,-0.3886,-0.263457,'',''),(10131,'PASMA Formosa - Posgar 07','',10029,1062,'Helmert',2.628,-0.014,3.087,0.092659,0.107417,-0.058129,-0.1034595,'',''),(10132,'Provincial Jujuy - Posgar 07','',10031,1062,'Helmert',-17.862,-9.221,9.902,0.439274,-0.164914,0.554636,0.5345147,'',''),(10133,'PASMA Jujuy - Posgar 07','',10032,1062,'Helmert',-5.088,-2.213,1.158,0.100335,-0.082475,0.135186,0.1640679,'',''),(10134,'PASMA La Pampa - Posgar 07','',10033,1062,'Helmert',1.6,-3.254,5.353,0.207465,0.097318,-0.006569,0.01855299,'',''),(10135,'PASMA La Rioja - Posgar 07','',10034,1062,'Helmert',-9.476,-3.92,1.74,0.12742,-0.122509,0.278417,0.1938372,'',''),(10136,'Provincial Mendoza - Posgar 07','',10035,1062,'Helmert',-0.333,-0.144,0.008,0.007218,-0.010125,0.003285,-0.002917227,'',''),(10137,'PASMA Mendoza - Posgar 07','',10036,1062,'Helmert',-2.257,-0.107,-1.853,-0.020994,-0.05986,0.04125,0.000813845,'',''),(10138,'Provincial Misiones - Posgar 07','',10037,1062,'Helmert',3.866,5.864,-3.772,-0.197213,0.0729,-0.144305,0.03238306,'',''),(10139,'PASMA Misiones - Posgar 07','',10038,1062,'Helmert',0.447,0.184,1.086,0.048446,0.038868,-0.010696,0.01624451,'',''),(10140,'Provincial Nuequen - Posgar 07','',10039,1062,'Helmert',3.334,-4.635,6.251,0.264011,0.113672,-0.05783,-0.002380746,'',''),(10141,'PASMA Nuequen - Posgar 07','',10040,1062,'Helmert',-16.301,-9.995,6.367,0.372557,-0.272644,0.462832,0.2058445,'',''),(10142,'Provincial Rio Negro - Posgar 07','',10041,1062,'Helmert',-0.14,-1.185,0.383,0.053395,0.003466,0.006613,-0.1363116,'',''),(10143,'PASMA Rio Negro - Posgar 07','',10042,1062,'Helmert',-2.495,5.532,-6.694,-0.2518,-0.104139,0.001795,0.07085742,'',''),(10144,'PASMA Salta - Posgar 07','',10043,1062,'Helmert',-3.031,-1.338,-0.394,0.048392,-0.077186,0.066956,0.04299755,'',''),(10145,'PASMA San Juan - Posgar 07','',10044,1062,'Helmert',-11.34,-6.686,3.836,0.214569,-0.102025,0.374988,0.1211736,'',''),(10146,'PASMA San Luis - Posgar 07','',10045,1062,'Helmert',13.474,7.013,-2.059,-0.112135,0.126344,-0.489688,-0.006623425,'',''),(10147,'PASMA Santa Cruz - Posgar 07','',10046,1062,'Helmert',-0.812,-2.822,4.93,0.178659,0.053006,0.055012,0.2532467,'',''),(10148,'Provincial Santa Fe - Posgar 07','',10047,1062,'Helmert',1.509,-4.222,-0.619,0.005727,0.002622,0.001712,-0.1475964,'',''),(10149,'PASMA Santa Fe - Posgar 07','',10048,1062,'Helmert',-3.403,-1.319,0.67,0.045429,-0.014212,0.114185,0.03592865,'',''),(10150,'PASMA Santiago del Estero - Posgar 07','',10049,1062,'Helmert',-1.469,-0.438,0.134,0.015513,0.018681,0.054046,0.0536496,'',''),(10151,'PASMA Tierra del Fuego - Posgar 07','',10050,1062,'Helmert',7.086,2.509,1.913,-0.048411,0.32167,0.00565,0.0439089,'',''),(10152,'Provincial Tucuman - Posgar 07','',10051,1062,'Helmert',2.803,0.545,0.44,0.008014,0.045639,-0.08245,-0.05857639,'',''),(10153,'PASMA Tucuman - Posgar 07','',10052,1062,'Helmert',4.101,2.61,-1.095,-0.047137,0.061713,-0.146339,0.1156001,'','');
/*!40000 ALTER TABLE `trandatum` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-07 10:52:41
