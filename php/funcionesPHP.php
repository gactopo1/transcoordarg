<?php
require_once 'funcionesgeo.php';
require_once 'proyecciones.php';
require_once 'transformaciones.php';

function conexion() {
    $base = new PDO('mysql:host=mysql8.serv00.com;dbname=m8039_transcoordarg', 'm8039_gcuello', 'Burundi5101');
    return $base;
}

# Limpiar cadenas de texto #
function limpiar_cadena($cadena){
    $cadena=trim($cadena);
    $cadena=stripslashes($cadena);
    $cadena=str_ireplace("<script>", "", $cadena);
    $cadena=str_ireplace("</script>", "", $cadena);
    $cadena=str_ireplace("<script src", "", $cadena);
    $cadena=str_ireplace("<script type=", "", $cadena);
    $cadena=str_ireplace("SELECT * FROM", "", $cadena);
    $cadena=str_ireplace("DELETE FROM", "", $cadena);
    $cadena=str_ireplace("INSERT INTO", "", $cadena);
    $cadena=str_ireplace("DROP TABLE", "", $cadena);
    $cadena=str_ireplace("DROP DATABASE", "", $cadena);
    $cadena=str_ireplace("TRUNCATE TABLE", "", $cadena);
    $cadena=str_ireplace("SHOW TABLES;", "", $cadena);
    $cadena=str_ireplace("SHOW DATABASES;", "", $cadena);
    $cadena=str_ireplace("<?php", "", $cadena);
    $cadena=str_ireplace("?>", "", $cadena);
    $cadena=str_ireplace("--", "", $cadena);
    $cadena=str_ireplace("^", "", $cadena);
    $cadena=str_ireplace("<", "", $cadena);
    $cadena=str_ireplace("[", "", $cadena);
    $cadena=str_ireplace("]", "", $cadena);
    $cadena=str_ireplace("==", "", $cadena);
    $cadena=str_ireplace(";", "", $cadena);
    $cadena=str_ireplace("::", "", $cadena);
    $cadena=trim($cadena);
    $cadena=stripslashes($cadena);
    return $cadena;
}


//Funciones varias
function Radianes($grados) {
    return $grados * M_PI / 180;
}

function Grados($radianes) {
    return $radianes * 180 / M_PI;
}

Function GradGMS($x){
    $a= [0,0,0.0];
    $a[0] = intval($x);
    $a[1] = intval(($x - $a[0]) * 60);
    $a[2] = ((($x - $a[0]) * 60) - $a[1]) * 60;
    return $a;
}

function GMSGrad($x){
    return  $x[0] + ($x[1] / 60) + ($x[2] / 3600);
}

function transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD){
    $scrCI69 = new scrObj();
    $scrCI69->tipo="geodesicas";
    $scrCI69->sistema='4221';
    $scrCI69->datum='Campo Inchauspe 1969';
    $scrCI69->semimayor=6378388;
    $scrCI69->semimenor=6356911.9461279;
    $scrCI69->aplanamiento=1/297;
    $dato = transformardat($dato,$tranCI69[0],$scrO,$scrCI69,$transfechaO,$transfechaD);
    $dato = transformardat($dato,$tranCI69[1],$scrCI69,$scrD,$transfechaO,$transfechaD);
    return $dato;
}

//Funciones de transformacion de datum
function transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD){
    switch($trandat->trans){
        case "3 Parameter Molodensky":
            $dato = molodensky($dato,$trandat,$scrO,$scrD);
            break;
        case "Molodensky Reducido": 
            $dato = molodenskyRed($dato,$trandat,$scrO,$scrD);
            break;
        case "Helmert": //"7 Parameter (Position Vector Rotation)":
            $dato= geodesgeocen(true, $scrO, $dato);
            $dato = helmert("PVR",$dato,$trandat);
            $dato= geodesgeocen(false, $scrD, $dato);
            break;
        case "General Fourth-Order Polynomial":
        case "General Sixth-Order Polynomial":
        case "Traslacion Geocentrica":
            $dato=geodesgeocen(true,$scrO,$dato);
            $dato=geocentrictranslation($dato,$trandat);
            $dato= geodesgeocen(false, $scrD, $dato);
            break;
        case "Traslacion 2D":
            $dato=geodesproyec(True, $scrO, $dato);
            $dato['ela'] = $dato['ela'] + $trandat->dx;
            $dato['nlo'] = $dato['nlo'] + $trandat->dy;
            $dato= geodesproyec(False, $scrO, $dato);
            break;
        case "Longitude Rotation":
        case "Multiple Regression Equation":
        case "Time-Specific (Coordinate Frame Rotation)":
            $dato= geodesgeocen(true, $scrO, $dato);
            $dato = helmerttimespecific("CFR",$dato,$trandat,$scrO,$transfechaO,$transfechaD);
            $dato= geodesgeocen(false, $scrD, $dato);
            break;
        case "Time-Specific (Position Vector Rotation)":
            $dato= geodesgeocen(true, $scrO, $dato);
            $dato = helmerttimespecific("PVR",$dato,$trandat,$scrO,$transfechaO,$transfechaD);
            $dato= geodesgeocen(false, $scrD, $dato);
            break;
    }
    return $dato;
}

//Proyecciones
function geodesproyec($di,$scrD,$dato){
    switch($scrD->proyeccion){
        case 'TM': // Transversa Mercator  9807
            $dato=epsg9807($di, $scrD->factorescala, $scrD->latitudorigen, $scrD->longitudorigen, $scrD->falsoeste, $scrD->falsonorte, $scrD->semimayor, fexentricidadF($scrD->aplanamiento), $dato['ela'],$dato['nlo'],$dato['h']);
            break;
        case 'EP': // Estereografica Polar 9829
            $dato=epsg9829($di, $scrD->latitudorigen, $scrD->longitudorigen, $scrD->falsoeste, $scrD->falsonorte, $scrD->semimayor, fexentricidadF($scrD->aplanamiento), $dato['ela'],$dato['nlo'],$dato['h']);
            break;
        case 'LE': // Lambert Equiareal 9820
            $dato=epsg9820($di, $scrD->latitudorigen, $scrD->longitudorigen, $scrD->falsoeste, $scrD->falsonorte, $scrD->semimayor, fexentricidadF($scrD->aplanamiento), $dato['ela'],$dato['nlo'],$dato['h']);
            break;
    }
    return $dato;
}

function geodesgeocen($di,$scrD,$dato){
    if ($di){
        //geodesgeocen
        $e=fexentricidadAB($scrD->semimayor,$scrD->semimenor);
        $n=fradiocurvaturaverticalAEL($scrD->semimayor,$e,$dato['ela']);
        $x = ($n + $dato['h']) * cos($dato['ela']) * cos($dato['nlo']);
        $y = ($n + $dato['h']) * cos($dato['ela']) * sin($dato['nlo']);
        $z = ($n * (1 - pow($e,2))+$dato['h']) * Sin($dato['ela']);
        $dato['ela']=$x;
        $dato['nlo']=$y;
        $dato['z']=$z;
        $dato['h']=0.0;
        
    }else{
        //geocengeodes
        $e=fexentricidadAB($scrD->semimayor,$scrD->semimenor);
        $eps=pow($e,2)/(1-pow($e,2));
        $b = $scrD->semimayor * (1 - $scrD->aplanamiento);
        $p = pow(pow($dato['ela'],2)+pow($dato['nlo'],2),0.5);
        $q = atan(($dato['z']*$scrD->semimayor) / ($p*$b));
        $la = atan(($dato['z']+$eps*$b*pow(sin($q),3))/($p-pow($e,2)*$scrD->semimayor*pow(cos($q),3)));
        $lo = atan2($dato['nlo'] , $dato['ela']);
        $dato['ela']=$la;
        $dato['nlo']=$lo;
        $dato['h']=($p/cos($la))-fradiocurvaturaverticalAEL($scrD->semimayor,$e,$la);
        $dato['z']=0;
        
    }
    return $dato;
}

function geocenproyec($di,$scrD,$dato){
    if ($di){
        //geocenproyec
        $dato=geodesgeocen(false,$scrD,$dato);
        $dato=geodesproyec(true,$scrD,$dato);
    }else{
        //proyecgeocen
        $dato=geodesproyec(false,$scrD,$dato);
        $dato=geodesgeocen(true,$scrD,$dato);
    }
    return $dato;
}

function esBisiesto($ano) {
    if ($ano % 400 == 0) {
        return true;
    } elseif ($ano % 100 == 0) {
        return false;
    } elseif ($ano % 4 == 0) {
        return true;
    } else {
        return false;
    }
}

function diasTranscurridos($dia, $mes, $ano) {
    $dias_por_mes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (esBisiesto($ano)) {
        $dias_por_mes[1] = 29;
    }
    $dias_totales = 0;
    if ($dia > 1 && $mes > 1){
        for ($i = 0; $i <= $mes - 1; $i++) {
            $dias_totales += $dias_por_mes[$i];
        }

        $dias_totales = $dias_totales + $dia - 0.5;
    }
    return $dias_totales;
}
