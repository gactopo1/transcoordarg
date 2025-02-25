<!DOCTYPE html>
<html lang="es">
<head>
    <title>Transformacion de coordenadas - Argentina</title>
    <?php 
        include "./php/head.php";
        if (!isset($_GET['vista']) || $_GET['vista'] == "") {

                $_GET['vista'] = "home";
        }
        $vista = $_GET['vista'];
        echo '<link rel="stylesheet" href="./css/transcoord.css">';
        echo '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>';
    ?>
    
</head>
<body>
     <?php
        if (is_file("./php/" . $_GET['vista'] . ".php")) {

                include "./php/" . $_GET['vista'] . ".php";

        } else {

                include "./php/nofile.php";
        }
    ?>
</body>
</html>

