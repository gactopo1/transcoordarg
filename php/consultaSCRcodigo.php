<?php

require_once "../php/funcionesPHP.php";

// Recibir los datos
$selTipo = limpiar_cadena($_POST['selTipo']);
$selCodigo = limpiar_cadena($_POST['selCodigo']);

$base = conexion();
switch ($selTipo){
    case "geocentricas":
        $cad="SELECT siscoorgeocentricas.*,datumhor.nombre AS datumhornombre,datumhor.elipsoide AS datumhorelipsoide, datumhor.semimayor AS datumhorsemimayor,".
        "datumhor.invflattening AS datumhorinvflattening FROM siscoorgeocentricas JOIN datumhor ON siscoorgeocentricas.datumhor=datumhor.codigo WHERE siscoorgeocentricas.codigo = " . $selCodigo;
        break;
    case "geodesicas":
        $cad="SELECT siscoorgeodesicas.*,datumhor.nombre AS datumhornombre,datumhor.elipsoide AS datumhorelipsoide, datumhor.semimayor AS datumhorsemimayor,".
        "datumhor.invflattening AS datumhorinvflattening FROM siscoorgeodesicas JOIN datumhor ON siscoorgeodesicas.datumhor=datumhor.codigo WHERE siscoorgeodesicas.codigo = " . $selCodigo;
        break;
    case "proyectadas":
        $cad="SELECT siscoorproyectadas.*,datumhor.nombre AS datumhornombre,datumhor.elipsoide AS datumhorelipsoide, datumhor.semimayor AS datumhorsemimayor,".
        "datumhor.invflattening AS datumhorinvflattening FROM siscoorproyectadas JOIN datumhor ON siscoorproyectadas.datumhor=datumhor.codigo WHERE siscoorproyectadas.codigo = " . $selCodigo;
        break;
    case "usuario":
        $cad="SELECT scrusuario.*,datumhor.nombre AS datumhornombre,datumhor.elipsoide AS datumhorelipsoide, datumhor.semimayor AS datumhorsemimayor,".
        "datumhor.invflattening AS datumhorinvflattening FROM scrusuario JOIN datumhor ON scrusuario.datumhor=datumhor.codigo WHERE scrusuario.codigo = " . $selCodigo;
        break;
}
$consulta = $base->query($cad);
$resultado = $consulta->fetch(PDO::FETCH_ASSOC);
$resul= json_encode($resultado);
$base=null;
echo $resul;
