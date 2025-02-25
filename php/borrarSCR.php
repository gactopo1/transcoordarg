<?php

require_once "funcionesPHP.php";

$codigo = $_POST['codigo'];

$cad = "DELETE FROM scrusuario  WHERE codigo=".$codigo;

$base = conexion();
$consulta = $base->query($cad);
$base = null;

