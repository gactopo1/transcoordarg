<?php
require_once "funcionesPHP.php";
$datosJSON = $_POST['datos'];
$dato = json_decode($datosJSON, true);

$cad = "INSERT INTO scrusuario (codigo, nombre, datumhor, proyeccion, lo0, la0, fn, fe, facesc, lat1, lon1, lat2, lon2) VALUES (".
        $dato['cod'].",'".$dato['nom']."',".$dato['dat'].",'".$dato['pro']."',".$dato['lo0'].",".$dato['la0'].",".$dato['fn'].",".$dato['fe'].
        ",".$dato['esc'].",".$dato['la1'].",".$dato['lo1'].",".$dato['la2'].",".$dato['lo2'].")";

$base = conexion();
$consulta = $base->query($cad);
$base = null;