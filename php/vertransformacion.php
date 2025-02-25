<?php

require_once "funcionesPHP.php";

// Recibir los datos
$sisO = limpiar_cadena($_POST['sisO']);
$sisD = limpiar_cadena($_POST['sisD']);

$datos = [
    "tipo"=>" ",
    "codigo"=>" ",
    "nombre"=>" ",
    "transformacion"=>" ",
    "inverso"=>false,
    "codigo2"=>" ",
    "nombre2"=>" ",
    "transformacion2"=>" ",
    "inverso2"=>false,
];

$respuesta = array();            

$base = conexion();
//buscar en trandatum
$inv=false;
$encontro=false;
$cad = "SELECT codigo,nombre,transformacion FROM trandatum WHERE datumorigen=".$sisO." AND datumdestino=".$sisD;
$consulta=$base->query($cad);
if (!$consulta->rowCount()>0){
    $cad = "SELECT codigo,nombre,transformacion FROM trandatum WHERE datumorigen=".$sisD." AND datumdestino=".$sisO;
    $consulta=$base->query($cad);
    if ($consulta->rowCount()>0){
        $inv=true;
        $encontro=true;
    }
}else{
    $encontro=true;
}
if($encontro){
    $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
    foreach ($resultado as $fila) {
        $datos["tipo"]="dat";
        $datos["codigo"]=$fila["codigo"];
        $datos["nombre"]=$fila["nombre"];
        $datos["transformacion"]=$fila["transformacion"];
        $datos["inverso"]=$inv;
        $respuesta[]=$datos;
    }
}    
//Cargar transformaciones de datum via CI69 DIRECTA
$cad = "SELECT codigo,nombre,transformacion FROM trandatum WHERE datumorigen=".$sisO." AND datumdestino=6221";
$consulta=$base->query($cad);
if ($consulta->rowCount()>0){
    $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
    foreach ($resultado as $fila) {
        $cad2 = "SELECT codigo,nombre,transformacion FROM trandatum WHERE datumdestino=".$sisD." AND datumorigen=6221";
        $consulta2=$base->query($cad2);
        $resultado2 = $consulta2->fetchAll(PDO::FETCH_ASSOC);
        if ($consulta2->rowCount()>0){
            foreach ($resultado2 as $fila2) {
                $datos["tipo"]="CI69";
                $datos["codigo"]=$fila["codigo"];
                $datos["nombre"]=$fila["nombre"];
                $datos["transformacion"]=$fila["transformacion"];
                $datos["inverso"]=false;
                $datos["codigo2"]=$fila2["codigo"];
                $datos["nombre2"]=$fila2["nombre"];
                $datos["transformacion2"]=$fila2["transformacion"];
                $datos["inverso2"]=false;
                $respuesta[]=$datos;
            }
        }
    }
}

$resul= json_encode($respuesta);

echo $resul;

$base = null;