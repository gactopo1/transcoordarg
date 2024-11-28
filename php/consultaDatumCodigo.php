<?php

require_once "../php/funcionesPHP.php";

// Recibir los datos
$codigo = limpiar_cadena($_POST['codigo']);

$base = conexion();
$cad="SELECT * FROM datumhor WHERE codigo = " . $codigo;
$consulta = $base->query($cad);
$resultado = $consulta->fetch(PDO::FETCH_ASSOC);
$base=null;

$resul= json_encode($resultado);
echo $resul;