<?php

require_once "../php/funcionesPHP.php";

// Recibir los datos
$selCodigo = limpiar_cadena($_POST['selCodigo']);

$base = conexion();

$cad="SELECT * FROM datumhor WHERE codigo = " . $selCodigo;

$consulta = $base->query($cad);

$resultado = $consulta->fetch(PDO::FETCH_ASSOC);

$resul= json_encode($resultado);

echo $resul;
$base=null;