<?php

require_once "../php/funcionesPHP.php";

// Recibir los datos
$selTipo = limpiar_cadena($_POST['selTipo']);

$base = conexion();

switch ($selTipo){
    case "geocentricas":
        $cad="SELECT * FROM siscoorgeocentricas ORDER BY nombre";
        break;
    case "geodesicas":
        $cad="SELECT * FROM siscoorgeodesicas ORDER BY nombre";
        break;
    case "proyectadas":
        $cad="SELECT * FROM siscoorproyectadas ORDER BY nombre";
        break;
    case "usuario":
        $cad="SELECT * FROM scrusuario ORDER BY nombre";
        break;
}

$consulta = $base->query($cad);
$num = $consulta->rowCount();
if($consulta->rowCount()>1){
    $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
}else{
    $resultado = $consulta->fetch(PDO::FETCH_ASSOC);
}

$resul= json_encode($resultado);

echo $resul;
$base=null;
