<!DOCTYPE html>
<html lang="es">
<head>
    <?php 
        include "./php/head.php";
        if (!isset($_GET['vista']) || $_GET['vista'] == "") {

                $_GET['vista'] = "home";
        }
        $vista = $_GET['vista'];

        echo '<link rel="stylesheet" href="./css/transcoord.css">';
        echo '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>';
    ?>
    <?php 

        // 2. Configuración dinámica de Título y Meta Descripción (Vital para SEO)
        $titulo = "";
        $desc = "";

        switch ($vista) {
            case "home":
                $titulo = "Transformacion de coordenadas - Argentina";
                $desc = "Pagina especializada en las proyecciones geograficas y en las transformaciones de datum de la Republica de Argentina. Realiza transformaciones de coordenadas ONLINE para todos los datums de Argentina";
                break;
            case "usuario":
                $titulo = "Base de datos de usuarios";
                $desc = "Gestion de la base de datos de usuarios";
                break;
            case "mdt":
                $titulo = "Modelo digital de terreno (MDT)";
                $desc = "Página dedicada a la generacion de grillas de puntos, en base a una nuve de puntos dada, subiendo un archivo en formato DXF, XLS, kml, CSV.
         La grilla se genera por Interpolacion usando alguno de los siguientes metodos: Vecino mas cercano, Bilinial, Bicubica, Kriging, Thiessen, Splines, Inversa de la distancia, IDW, RBFs.
         Realiza curvas de nivel, en base a la grilla de puntos usando alguno de los siguientes metodos: Interpolación de Contornos, Marching Squares, Triangulos de Delanuay.
         Genera un Modelo Digital de Terreno (MDT) (EDM)";
                break;
        }
    ?>
    <title><?php echo $titulo; ?></title>
    <meta name="description" content="<?php echo $desc; ?>">
    <link rel="canonical" href="https://transcoordarg.gactopo1.serv00.net/<?php echo ($vista=='home' ? 'inicio' : ($vista=='usuario' ? 'usuario' : 'mdt')); ?>">    
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

