<?php
require_once "funcionesPHP.php";

$datosJSON = $_POST['datos'];
$dato = json_decode($datosJSON, true);

$cad = "UPDATE scrusuario SET nombre='".$dato['nom']."', datumhor=".$dato['dat'].", proyeccion='".$dato['pro'].
        "', lo0=".$dato['lo0'].', la0='.$dato['la0'].', fn='.$dato['fn'].', fe='.$dato['fe'].', facesc='.$dato['esc'].
        ', lat1='.$dato['la1'].',lon1='.$dato['lo1'].',lat2='.$dato['lo1'].',lon2='.$dato['lo2']." WHERE codigo=".$dato['cod'];

$base = conexion();
$consulta = $base->query($cad);
$base = null;
