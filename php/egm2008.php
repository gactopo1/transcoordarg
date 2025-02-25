<?php

$lat = $_POST['lat'];
$lon = $_POST['lon'];


$latMinIndex = null;
$latMaxIndex = null;
$lonMinIndex = null;
$lonMaxIndex = null;


$grigAlt = [];
$grigLat = [];
$grigLon = [];

$latg = -57;
$long = -76;
$des = 2.5/60;
for($i=0;$i<1441;$i++){
    $gridLon[]=$long;
    $long+=$des;
    $gridLat[]=$latg;
    $latg+=$des;
}
for ($i=1441;$i<2221;$i++){
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
    if ($i>2221){break;}        
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
    if ($i>2221){break;}        
}

$q11indi = $latMinIndi * 1441 + $lonMinIndi;
$q21indi = $latMinIndi * 1441 + $lonMaxIndi;
$q12indi = $latMaxIndi * 1441 + $lonMinIndi;
$q22indi = $latMaxIndi * 1441 + $lonMaxIndi;

// Abrir el archivo en modo lectura
if (($handle = fopen("../grids/ALTar16.csv", 'r')) !== FALSE) {
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

echo $alturaInterpolada;


