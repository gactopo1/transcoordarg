<?php

require_once "funcionesPHP.php";
require_once "geoides.php";
require_once "scrObj.php";
require_once "trandatumObj.php";
require_once "funcionesgeo.php";
require_once "velar.php";

$dato = [
    'ela' => 0.0,
    'nlo' => 0.0,
    'z' => 0.0,
    'h' => 0.0
];

$datosO = [];
$datosD = [];
$epocaO = 0.0;
$epocaD = 0.0;
// Recibir los datos
$od = limpiar_cadena($_POST['OD']);
$tipoO = limpiar_cadena($_POST['tipoO']);
$sisO = limpiar_cadena($_POST['sisO']);
$tipoD = limpiar_cadena($_POST['tipoD']);
$sisD = limpiar_cadena($_POST['sisD']);
$transcod = limpiar_cadena($_POST['transcod']);
$transcod2 = limpiar_cadena($_POST['transcod2']);
$transtip = limpiar_cadena($_POST['transtip']);
$transinv = ($_POST['transinv']==='true' ? 1 : 0 );
$transinv2 = ($_POST['transinv2']==='true' ? 1 : 0 );
$transfechaO = limpiar_cadena($_POST['transfechaO']);
$transfechaD = limpiar_cadena($_POST['transfechaD']);
$alturaO = limpiar_cadena($_POST['alturaO']);
$alturaD = limpiar_cadena($_POST['alturaD']);
$geoideO = limpiar_cadena($_POST['geoideO']);
$geoideD = limpiar_cadena($_POST['geoideD']);
$datosJSON = $_POST['datos'];
$datosarray = json_decode($datosJSON, true);
if ($datosarray === null){
    echo "Error al decodificar el JSON";
}else{
    foreach ($datosarray as $dato) {
        if (isset($dato['z'])){
            $valorz=$dato['z'];
        }else{
            $valorz=0;
        }
        if (isset($dato['h'])){
            $valorh=$dato['h'];
        }else{
            $valorh=0;
        }
        $datoNuevo=[
            'ela' => $dato['ela'],
            'nlo' => $dato['nlo'],
            'z' => $valorz,
            'h' => $valorh
        ];
        $datosO[] = $datoNuevo;
    }
}

$result = [
    'ela' => 0.0,
    'nlo' => 0.0,
    'z' => 0.0,
    'h' => 0.0
];
$resultados = [];

$scrO = new scrObj();
$scrD = new scrObj();
$trandat = new trandatumObj();
$tranCI69 = [];

//obtener datos de sistema origen
If ($tipoO==="usuario"){
    $baseLocal = conexionlocal();
    $base = conexion();
    $cad="SELECT * FROM siscoorproyectadas WHERE siscoorproyectadas.codigo = " . $sisO;
    $consultaLocal = $baseLocal->query($cad);
    $resultadoLocal = $consultaLocal->fetch(PDO::FETCH_ASSOC);
    $cad="SELECT datumhor.semimayor AS semimayor, datumhor.invflattening AS invflattening FROM datumhor WHERE codigo = " . $resultadoLocal['datumhor'];
    $consultaRemota = $base->query($cad);
    $resultadoRemoto = $consultaRemota->fetch(PDO::FETCH_ASSOC);
    $fila = array_merge($resultadoLocal, $resultadoRemoto);
    $base=null;
    $baseLocal=null;    
}else{
    $base = conexion(); // Conexión a la base de datos
    switch ($tipoO){
        case "geocentricas":
            $cad="SELECT siscoorgeocentricas.*, datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorgeocentricas ".
                "JOIN datumhor ON siscoorgeocentricas.datumhor=datumhor.codigo ".
                "WHERE siscoorgeocentricas.codigo=".$sisO;
            break;
        case "geodesicas":
            $cad= "SELECT siscoorgeodesicas.*, datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorgeodesicas ".
                "JOIN datumhor ON siscoorgeodesicas.datumhor=datumhor.codigo WHERE siscoorgeodesicas.codigo=".$sisO;
            break;
        case "proyectadas":
            $cad="SELECT siscoorproyectadas.*,datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorproyectadas ".
                "JOIN datumhor ON siscoorproyectadas.datumhor=datumhor.codigo ".
                "WHERE siscoorproyectadas.codigo=".$sisO;
            break;
    }
    $consulta = $base->query($cad);
    $fila = $consulta->fetch(PDO::FETCH_ASSOC);
    $base=null;
}
if($fila){
    // Acceder a cada columna de la fila
    $scrO->tipo=$tipoO;
    $scrO->sistema = $sisO;
    $scrO->datum = $fila["datumhor"];
    $scrO->semimayor = $fila["semimayor"];
    $scrO->aplanamiento = 1 / $fila["invflattening"];
    $scrO->semimenor = fsemimenorAF($fila["semimayor"],$scrO->aplanamiento);
    if($tipoO==='proyectadas' || $tipoO==="usuario"){
        $scrO->proyeccion = $fila["proyeccion"];
        $scrO->falsoeste = $fila["fe"];
        $scrO->falsonorte = $fila["fn"];
        $scrO->factorescala = $fila["facesc"];
        $scrO->longitudorigen = $fila["lo0"];
        $scrO->latitudorigen = $fila["la0"];
        $scrO->parametros = $fila["parametros"];
    }
}
$scrO->altura = $alturaO;
$scrO->geoide = $geoideO;

if($tipoO==='proyectadas' || $tipoO==="usuario"){
    $scrO->longitudorigen = Radianes($scrO->longitudorigen);
    $scrO->latitudorigen = Radianes($scrO->latitudorigen);
}

//obtener datos de sistema destino
If ($tipoD==="usuario"){
    $baseLocal = conexionlocal();
    $base = conexion();
    $cad="SELECT * FROM siscoorproyectadas WHERE siscoorproyectadas.codigo = " . $sisD;
    $consultaLocal = $baseLocal->query($cad);
    $resultadoLocal = $consultaLocal->fetch(PDO::FETCH_ASSOC);
    $cad="SELECT datumhor.semimayor AS semimayor, datumhor.invflattening AS invflattening FROM datumhor WHERE codigo = " . $resultadoLocal['datumhor'];
    $consultaRemota = $base->query($cad);
    $resultadoRemoto = $consultaRemota->fetch(PDO::FETCH_ASSOC);
    $fila = array_merge($resultadoLocal, $resultadoRemoto);
    $base=null;
    $baseLocal=null;    
}else{
    $base = conexion(); // Conexión a la base de datos
    switch ($tipoD){
        case "geocentricas":
            $cad="SELECT siscoorgeocentricas.*, datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorgeocentricas ".
                "JOIN datumhor ON siscoorgeocentricas.datumhor=datumhor.codigo ".
                "WHERE siscoorgeocentricas.codigo='".$sisD."'";
            break;
        case "geodesicas":
            $cad= "SELECT siscoorgeodesicas.*, datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorgeodesicas ".
                "JOIN datumhor ON siscoorgeodesicas.datumhor=datumhor.codigo WHERE siscoorgeodesicas.codigo='".$sisD."'";
            break;
        case "proyectadas":
            $cad="SELECT siscoorproyectadas.*,datumhor.semimayor AS semimayor,datumhor.invflattening AS invflattening FROM siscoorproyectadas ".
                "JOIN datumhor ON siscoorproyectadas.datumhor=datumhor.codigo ".
                "WHERE siscoorproyectadas.codigo='".$sisD."'";
            break;
    }
    $consulta = $base->query($cad);
    $fila = $consulta->fetch(PDO::FETCH_ASSOC);
    $base=null;
}
if ($fila) {
    // Acceder a cada columna de la fila
    $scrD->tipo=$tipoD;
    $scrD->sistema = $sisD;
    $scrD->datum = $fila["datumhor"];
    $scrD->semimayor = $fila["semimayor"];
    $scrD->aplanamiento = 1 / $fila["invflattening"];
    $scrD->semimenor = fsemimenorAF($fila["semimayor"],$scrD->aplanamiento);
    if($tipoD==='proyectadas' || $tipoD==="usuario"){
        $scrD->proyeccion = $fila["proyeccion"];
        $scrD->falsoeste = $fila["fe"];
        $scrD->falsonorte = $fila["fn"];
        $scrD->factorescala = $fila["facesc"];
        $scrD->longitudorigen = $fila["lo0"];
        $scrD->latitudorigen = $fila["la0"];
        $scrD->parametros = $fila["parametros"];
    }
}

$scrD->altura = $alturaD;
$scrD->geoide = $geoideD;

if($tipoD==='proyectadas' || $tipoD==='usuario'){
    $scrD->longitudorigen = Radianes($scrD->longitudorigen);
    $scrD->latitudorigen = Radianes($scrD->latitudorigen);
}

//Transformacion de datum
if ($transtip !== ""){
    Switch($transtip){
        //contemplar el caso de "CI69" que implica dos transformaciones via Campo Inchauspe 1969
        case "CI69":{
            $cad="SELECT * FROM trandatum WHERE codigo='".$transcod."'";
            $cad2="SELECT * FROM trandatum WHERE codigo='".$transcod2."'";
            break;
        }
        case "dat":{
            $cad="SELECT * FROM trandatum WHERE codigo='".$transcod."'";
            break;
        }
    }
    $base = conexion(); // Conexión a la base de datos
    $consulta=$base->query($cad);
    $fila=$consulta->fetch(PDO::FETCH_ASSOC);
    Switch($transtip){
        case "CI69":{
            $trandat->codigo=$fila['codigo'];
            $trandat->trans=$fila['transformacion'];
            $trandat->dx=$fila['dx'];
            $trandat->dy=$fila['dy'];
            $trandat->dz=$fila['dz'];
            $trandat->k=$fila['k'];
            $trandat->rx=$fila['rx'];
            $trandat->ry=$fila['ry'];
            $trandat->rz=$fila['rz'];
            $trandat->param1=$fila['param1'];
            $trandat->param2=$fila['param2'];
            $trandat->inverso=$transinv;
            $tranCI69[]=$trandat;
            $trandat2 = new trandatumObj();
            $consulta2=$base->query($cad2);
            $fila2=$consulta2->fetch(PDO::FETCH_ASSOC);
            $trandat2->codigo=$fila2['codigo'];
            $trandat2->trans=$fila2['transformacion'];
            $trandat2->dx=$fila2['dx'];
            $trandat2->dy=$fila2['dy'];
            $trandat2->dz=$fila2['dz'];
            $trandat2->k=$fila2['k'];
            $trandat2->rx=$fila2['rx'];
            $trandat2->ry=$fila2['ry'];
            $trandat2->rz=$fila2['rz'];
            $trandat2->param1=$fila2['param1'];
            $trandat2->param2=$fila2['param2'];
            $trandat2->inverso=$transinv2;
            $tranCI69[]=$trandat2;
            break;
        }
        case "dat":{
            $trandat->codigo=$fila['codigo'];
            $trandat->trans=$fila['transformacion'];
            $trandat->dx=$fila['dx'];
            $trandat->dy=$fila['dy'];
            $trandat->dz=$fila['dz'];
            $trandat->k=$fila['k'];
            $trandat->rx=$fila['rx'];
            $trandat->ry=$fila['ry'];
            $trandat->rz=$fila['rz'];
            $trandat->param1=$fila['param1'];
            $trandat->param2=$fila['param2'];
            $trandat->inverso=$transinv;
            break;
        }
    }
    $base=null;
}


If($transfechaO!=='' && $transfechaD!==''){
    //ajustar por velocidades
    $fec=explode("-", $transfechaO);
    $ano=intval($fec[0]);
    $mes=intval($fec[1]);
    $dia=intval($fec[2]);
    $div = (esBisiesto($ano)) ? 366 : 365;
    $epocaO = $ano + (diasTranscurridos($dia, $mes, $ano) / $div);
    $fec=explode("-", $transfechaD);
    $ano=intval($fec[0]);
    $mes=intval($fec[1]);
    $dia=intval($fec[2]);
    $div = (esBisiesto($ano)) ? 366 : 365;
    $epocaD = $ano + (diasTranscurridos($dia, $mes, $ano) / $div);
}

if ($scrO->tipo === "geodesicas" and ($scrD->tipo === "proyectadas" || $scrD->tipo === "usuario")):
    $transcoortipo="geodesproyec";
elseif (($scrO->tipo === "proyectadas" || $scrO->tipo === "usuario") and $scrD->tipo === "geodesicas"):
    $transcoortipo="proyecgeodes";
elseif ($scrO->tipo === "geodesicas" and $scrD->tipo === "geocentricas"):
    $transcoortipo="geodesgeocen";
elseif ($scrO->tipo === "geocentricas" and $scrD->tipo === "geodesicas"):
    $transcoortipo="geocengeodes";
elseif ($scrO->tipo === "geocentricas" and ($scrD->tipo === "proyectadas" || $scrD->tipo === "usuario")):
    $transcoortipo="geocenproyec";
elseif (($scrO->tipo === "proyectadas" || $scrO->tipo === "usuario") and $scrD->tipo === "geocentricas"):
    $transcoortipo="proyecgeocen";
elseif ($scrO->tipo === "geodesicas" and $scrD->tipo === "geodesicas"):
    $transcoortipo="geodesgeodes";
elseif ($scrO->tipo === "geocentricas" and $scrD->tipo === "geocentricas"):
    $transcoortipo="geocengeocen";
elseif (($scrO->tipo === "proyectadas" || $scrO->tipo === "usuario") and ($scrD->tipo === "proyectadas" || $scrD->tipo === "usuario")):
    $transcoortipo="proyecproyec";
endif;

foreach($datosO as $dato){
    switch ($transcoortipo){
        case "geodesproyec":
            $dato['ela']= Radianes($dato['ela']);
            $dato['nlo']= Radianes($dato['nlo']);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranwgs,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesproyec(true,$scrD,$dato);
            break;
        case "proyecgeodes":
            $dato=geodesproyec(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['ela']=Grados($dato['ela']);
            $dato['nlo']=Grados($dato['nlo']); 
            $dato['h'] = calcularAltura($dato['ela'],$dato['nlo'],$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar($dato['ela'],$dato['nlo'],$dato['h'],$epocaO,$epocaD);
            }
            break;
        case "geodesgeocen":
            $dato['ela']= Radianes($dato['ela']);
            $dato['nlo']= Radianes($dato['nlo']);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesgeocen(true,$scrD,$dato);
            break;
        case "geocengeodes":
            $dato=geodesgeocen(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['ela']=Grados($dato['ela']);
            $dato['nlo']=Grados($dato['nlo']); 
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar($dato['ela'],$dato['nlo'],$dato['h'],$epocaO,$epocaD);
            }
            break;
        case "geocenproyec":
            $dato=geodesgeocen(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesproyec(true,$scrD,$dato);
            break;
        case "proyecgeocen":
            $dato=geodesproyec(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesgeocen(true,$scrD,$dato);
            break;
        case "geodesgeodes":
            $dato['ela']= Radianes($dato['ela']);
            $dato['nlo']= Radianes($dato['nlo']);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['ela']=Grados($dato['ela']);
            $dato['nlo']=Grados($dato['nlo']); 
            $dato['h'] = calcularAltura($dato['ela'],$dato['nlo'],$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar($dato['ela'],$dato['nlo'],$dato['h'],$epocaO,$epocaD);
            }
            break;
        case "proyecproyec":
            $dato=geodesproyec(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }
            $dato['h'] = calcularAltura(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$alturaO,$geoideO,$alturaD,$geoideD);
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesproyec(true,$scrD,$dato);
            break;
        case "geocengeocen":    
            $dato=geodesgeocen(false,$scrO,$dato);
            switch($transtip){
                case "CI69":
                    $dato=transformarCI69($dato,$tranCI69,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
                case "dat":
                    $dato=transformardat($dato,$trandat,$scrO,$scrD,$transfechaO,$transfechaD);
                    break;
            }    
            if ($epocaO > 0 && $epocaD > 0){
                $dato=velar(Grados($dato['ela']),Grados($dato['nlo']),$dato['h'],$epocaO,$epocaD);
                $dato['ela']=Radianes($dato['ela']);
                $dato['nlo']=Radianes($dato['nlo']);
            }
            $dato=geodesgeocen(true,$scrD,$dato);
    }
    if(abs($dato['h'])<0.000001){
        $dato['h']=0;
    }
    $datosD[]=$dato;
}

//RETORNAR EL RESULTADO
echo json_encode($datosD);
