<?php


//$lat = $_POST['lat'];
//$lon = $_POST['lon'];
//$tipo = $_POST['tipo'];

function calcularAltura($lat,$lon,$h,$alturaO,$geoideO,$alturaD,$geoideD){
    $n = 0.0;
    $alt = 0.0;
    if ($alturaO === "elip" && $alturaD === "orto"){
      $n = calcularN($lat,$lon,$geoideD);
      $alt = $h - $n;        
    }else if($alturaO === "elip" && $alturaD === "elip"){
      $alt = $h;     
    }else if($alturaO === "orto" && $alturaD === "orto"){
        if ($geoideO === $geoideD){
            $alt = $h;
        }else{
            $n = calcularN($lat,$lon,$geoideO);
            $alt = $h + $n;
            $n = calcularN($lat,$lon,$geoideD);
            $alt = $alt - $n;
        }
    }else if($alturaO === "orto" && $alturaD === "elip"){
        $n = calcularN($lat,$lon,$geoideO);
        $alt = $h + $n;
    }
    return $alt;
}

function calcularN($lat, $lon, $tipo){
    $latMinIndex = null;
    $latMaxIndex = null;
    $lonMinIndex = null;
    $lonMaxIndex = null;
    $grigAlt = [];
    $grigLat = [];
    $grigLon = [];
    $latg = -57;
    $long = -76;
    switch ($tipo) {
        case 'ar16':
            $des = 1/60;
            $numlon = 1441;
            $numlat = 2221;
            $archivo='../grids/ALTar16.txt';
            break;
        case 'egm2008':
            $des = 2.5/60;
            $numlon = 577;
            $numlat = 889;
            $archivo='../grids/ALTegm2008.txt';
            break;
        case 'egm96':
            $des = 0.25;
            $numlon = 97;
            $numlat = 149;
            $archivo='../grids/ALTegm96.txt';
            break;
    }
    for($i=0;$i<$numlon;$i++){
        $gridLon[]=$long;
        $long+=$des;
        $gridLat[]=$latg;
        $latg+=$des;
    }
    for ($i=$numlon;$i<$numlat;$i++){
        $gridLat[]=$latg;
        $latg+=$des;
    }
    $i=0;
    while(true){
        if($gridLat[$i] > $lat){
            $latMin = $gridLat[$i-1];
            $latMax = $gridLat[$i];
            $latMinIndi = $i-1;
            $latMaxIndi = $i;
            break;
        }
        $i++;
        if ($i>$numlat){break;}        
    }
    $i=0;
    while(true){
        if($gridLon[$i]>$lon){
            $lonMin = $gridLon[$i-1];
            $lonMax = $gridLon[$i];
            $lonMinIndi = $i-1;
            $lonMaxIndi = $i;
            break;
        }
        $i++;
        if ($i>$numlat){break;}        
    }
    $q11indi = $latMinIndi * $numlon + $lonMinIndi;
    $q21indi = $latMinIndi * $numlon + $lonMaxIndi;
    $q12indi = $latMaxIndi * $numlon + $lonMinIndi;
    $q22indi = $latMaxIndi * $numlon + $lonMaxIndi;
    // Abrir el archivo en modo lectura
    if (($handle = fopen($archivo, 'r')) !== FALSE) {
        // Leer cada línea del archivo
        while (($linea = fgets($handle)) !== FALSE) {
            // Quitar espacios en blanco o saltos de línea
            $linea = trim($linea);
            // Almacenar el número en el arreglo
            $gridAlt[] = $linea;
        }
        // Cerrar el archivo
        fclose($handle);
    }
    $Q11 = $gridAlt[$q11indi];
    $Q21 = $gridAlt[$q21indi];
    $Q12 = $gridAlt[$q12indi];
    $Q22 = $gridAlt[$q22indi];
    // Calcular la posición relativa de lat y lon
    $xRelativa = ($lon - $gridLon[$lonMinIndi]) / ($gridLon[$lonMaxIndi] - $gridLon[$lonMinIndi]);
    $yRelativa = ($lat - $gridLat[$latMinIndi]) / ($gridLat[$latMaxIndi] - $gridLat[$latMinIndi]);
    // Realizar la interpolación bilineal
    $R1 = $Q11 * (1 - $xRelativa) + $Q21 * $xRelativa;
    $R2 = $Q12 * (1 - $xRelativa) + $Q22 * $xRelativa;
    $alturaInterpolada = $R1 * (1 - $yRelativa) + $R2 * $yRelativa;
    return $alturaInterpolada;
}











