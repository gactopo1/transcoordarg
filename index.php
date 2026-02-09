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
    <main>
        <?php
            if (is_file("./php/" . $_GET['vista'] . ".php")) {

                    include "./php/" . $_GET['vista'] . ".php";

            } else {

                    include "./php/nofile.php";
            }
        ?>
    </main>
    <footer style="margin-top: 40px; padding: 20px; border-top: 1px solid #ccc; text-align: center; font-family: sans-serif;">
        <div class="footer-content">
            <p><strong>TransCoordArg</strong> - Herramientas Geodésicas para Argentina</p>
            <p style="font-size: 0.9em;">
                © <?php echo date("Y"); ?> | Desarrollado por <strong>gactopo1</strong>
            </p>
            <p>
                <a href="https://github.com/gactopo1/transcoordarg" target="_blank" rel="noopener" style="text-decoration: none; color: #0366d6;">
                    <svg height="20" viewBox="0 0 16 16" width="20" style="vertical-align: middle; margin-right: 5px;"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    Código fuente en GitHub
                </a>
            </p>
        </div>
    </footer>
</body>
</html>

