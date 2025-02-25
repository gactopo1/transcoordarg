<?php


// Función para resolver un sistema lineal de ecuaciones (A*X = L)
function solve_linear_system($A, $B) {
    $n = count($A);
    // Crear una matriz aumentada combinando A con B
    for ($i = 0; $i < $n; $i++) {
        $A[$i][] = $B[$i];
    }

    // Aplicar eliminación de Gauss-Jordan
    for ($i = 0; $i < $n; $i++) {
        // Buscar el elemento máximo en la columna actual
        $maxRow = $i;
        for ($k = $i + 1; $k < $n; $k++) {
            if (abs($A[$k][$i]) > abs($A[$maxRow][$i])) {
                $maxRow = $k;
            }
        }

        // Intercambiar las filas
        $temp = $A[$i];
        $A[$i] = $A[$maxRow];
        $A[$maxRow] = $temp;

        // Asegurarse de que el elemento de la diagonal no sea cero
        if ($A[$i][$i] == 0) {
            throw new Exception("La matriz es singular y no puede ser resuelta.");
        }

        // Normalizar la fila actual dividiendo por el elemento de la diagonal
        for ($k = $i + 1; $k <= $n; $k++) {
            $A[$i][$k] /= $A[$i][$i];
        }

        // Hacer ceros en la columna i para las filas restantes
        for ($j = 0; $j < $n; $j++) {
            if ($j != $i) {
                $factor = $A[$j][$i];
                for ($k = $i + 1; $k <= $n; $k++) {
                    $A[$j][$k] -= $factor * $A[$i][$k];
                }
            }
        }
    }

    // Extraer el vector solución
    $X = array();
    for ($i = 0; $i < $n; $i++) {
        $X[] = $A[$i][$n];
    }

    return $X;
}

//funcion para interpolar las grillas del modelo
function get_variable($lat, $lon, $archivo, $max_dist = null) {
    // Radio terrestre en kilómetros
    $R = 6371.0;

    // Cargar los datos del archivo
    $grilla = file($archivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $grilla = array_map(function($linea) {
        return array_map('floatval', preg_split('/\s+/', $linea));
    }, $grilla);

    // Convertir a radianes
    $grilla_rad = array_map(function($fila) {
        return array_map(function($val) {
            return Radianes($val);
        }, $fila);
    }, $grilla);

    // Inicializar variables
    $nfilas = count($grilla);
    $pos = array_fill(0, $nfilas, [Radianes($lat), Radianes($lon)]);

    // Calcular distancias utilizando la fórmula de Haversine
    $dist = array();
    foreach ($grilla_rad as $i => $fila) {
        $d_phi = ($fila[0] - $pos[$i][0]) / 2;
        $d_lam = ($fila[1] - $pos[$i][1]) / 2;
        $dist[$i] = 2 * $R * asin(sqrt(pow(sin($d_phi), 2) + cos($fila[0]) * cos($pos[$i][0]) * pow(sin($d_lam), 2)));
    }

    // Ordenar las distancias y grilla según la distancia calculada
    array_multisort($dist, SORT_ASC, $grilla);

    // Concatenar distancias con los datos de la grilla
    $inter = array_map(function($d, $g) {
        return array_merge([$d], $g);
    }, $dist, $grilla);

    if ($max_dist !== null) {
        if ($inter[0][0] > $max_dist) {
            // Si la distancia del punto más cercano es mayor a la distancia máxima, no se interpola
            return [0.0, 0.0];
        }
    }

    // Seleccionar los 4 puntos más cercanos
    $points = 4;
    $inter = array_slice($inter, 0, $points);

    // Convertir las coordenadas geodésicas a planas UTM
    $A = array_fill(0, $points, [1.0, 0.0, 0.0]);
    for ($i = 0; $i < $points; $i++) {
        list($utmX, $utmY) = lle2utm($inter[$i][1], $inter[$i][2], $lon);
        $A[$i][1] = $utmX;
        $A[$i][2] = $utmY;
    }

    // Convertir las coordenadas del punto en estudio a planas UTM
    list($utmX, $utmY) = lle2utm($lat, $lon, $lon);
    $a = [1.0, $utmX, $utmY];

    // Coeficientes de la grilla para las componentes norte y este
    $L1 = array_column($inter, 3);
    $L2 = array_column($inter, 4);

    // Resolver sistemas lineales de ecuaciones para cada componente
    $AT = transponer_matriz($A);
    $X1 = solve_linear_system(producto_punto_mm($AT, $A), producto_punto_mv($AT, $L1));
    $X2 = solve_linear_system(producto_punto_mm($AT, $A), producto_punto_mv($AT, $L2));

    // Devolver el resultado de la interpolación en norte y este
    $res = [producto_punto_vv($a, $X1), producto_punto_vv($a, $X2)];

    return $res;
}

//funcion para convertir coordenadas geodesicas a planas UTM
function lle2utm($lat, $lon, $lcm) {
    // Constantes
    // WGS84
    $a  = 6378137.0;
    $b  = 6.356752314245179e+06;
    $e2 = 0.006694379990141;
    $f = 1 - sqrt(1 - $e2);
    $ko = 0.9996;    // Factor de escala
    $No = 1e7;       // Falso norte
    $Eo = 0;         // Falso este

    $lat = Radianes($lat);
    $lon = Radianes($lon);
    $lcm = Radianes($lcm);

    $lam = $lon - $lcm;

    // Cálculos intermedios
    $RN = $a / pow(1 - $e2 * pow(sin($lat), 2), 0.5);
    $RM = $a * (1 - $e2) / pow(1 - $e2 * pow(sin($lat), 2), 1.5);
    $h2 = $e2 * pow(cos($lat), 2) / (1 - $e2);
    $t = tan($lat);
    $n = $f / (2 - $f);

    // Expansión de Helmert (1880) para la simplificación de la serie de Bessel
    $A0 = 1 + pow($n, 2) / 4 + pow($n, 4) / 64;
    $A2 = 3 / 2 * ($n - pow($n, 3) / 8);
    $A4 = 15 / 16 * (pow($n, 2) - pow($n, 4) / 4);
    $A6 = 35 / 48 * pow($n, 3);
    $A8 = 315 / 512 * pow($n, 4);
    $S = $a / (1 + $n) * ($A0 * $lat - $A2 * sin(2 * $lat) + $A4 * sin(4 * $lat) - $A6 * sin(6 * $lat) + $A8 * sin(8 * $lat));

    // Cálculos de coordenadas Este y Norte
    $E1 = $lam * cos($lat);
    $E2 = pow($lam, 3) * pow(cos($lat), 3) / 6 * (1 - pow($t, 2) + $h2);
    $E3 = pow($lam, 5) * pow(cos($lat), 5) / 120 * (5 - 18 * pow($t, 2) + pow($t, 4) + 14 * $h2 - 58 * pow($t, 2) * $h2 + 13 * pow($h2, 2) + 4 * pow($h2, 3) - 64 * pow($t, 2) * pow($h2, 2) - 24 * pow($t, 2) * pow($h2, 3));
    $E4 = pow($lam, 7) * pow(cos($lat), 7) / 5040 * (61 - 479 * pow($t, 2) + 179 * pow($t, 4) - pow($t, 6));
    $E = $Eo + $ko * $RN * ($E1 + $E2 + $E3 + $E4);

    $N1 = $S / $RN;
    $N2 = pow($lam, 2) / 2 * sin($lat) * cos($lat);
    $N3 = pow($lam, 4) / 24 * sin($lat) * pow(cos($lat), 3) * (5 - pow($t, 2) + 9 * $h2 + 4 * pow($h2, 2));
    $N4 = pow($lam, 6) / 720 * sin($lat) * pow(cos($lat), 5) * (61 - 58 * pow($t, 2) + pow($t, 4) + 270 * $h2 - 330 * pow($t, 2) * $h2 + 445 * pow($h2, 2) + 324 * pow($h2, 3) - 680 * pow($t, 2) * pow($h2, 2) + 88 * pow($h2, 4) - 600 * pow($t, 2) * pow($h2, 3) - 192 * pow($t, 2) * pow($h2, 4));
    $N5 = pow($lam, 8) / 40320 * sin($lat) * pow(cos($lat), 7) * (1385 - 311 * pow($t, 2) + 543 * pow($t, 4) - pow($t, 6));
    $N = $No + $ko * $RN * ($N1 + $N2 + $N3 + $N4 + $N5);

    // Devolver las coordenadas UTM [Norte, Este]
    return [$N / 1000 - 6200, $E / 1000];
}

function ecef2lla($x, $y, $z) {
    /*
    Función para convertir coordenadas cartesianas
    geocéntricas a coordenadas geodésicas
    */

    // Constantes elipsoidales
    $a  = 6378137.0;
    $b  = 6.356752314245179e+06;
    $e2 = 0.006694379990141;

    $ep = sqrt((pow($a, 2) - pow($b, 2)) / pow($b, 2));
    $p  = sqrt(pow($x, 2) + pow($y, 2));
    $th = atan2($a * $z, $b * $p);
    $lon = atan2($y, $x);
    $lat = atan2(($z + pow($ep, 2) * $b * pow(sin($th), 3)), ($p - $e2 * $a * pow(cos($th), 3)));
    $N = $a / sqrt(1 - $e2 * pow(sin($lat), 2));
    $h = $p / cos($lat) - $N;

    // Devuelve el valor de la longitud en el intervalo [0,2*pi)
    $res['nlo'] = fmod($lon, 2 * M_PI) / (M_PI/180);
    $res['ela'] = $lat / (M_PI/180);
    $res['h']=$h;
    
    return $res;
}

function lla2ecef($lat, $lon, $alt) {

    /*
    Función para convertir coordenadas geodésicas a
    coordenadas cartesianas geocéntricas
    */

    // Constantes elipsoidales
    $a  = 6378137.0;
    $b  = 6.356752314245179e+06;
    $e2 = 0.006694379990141;

    $lat_rad = Radianes($lat);
    $lon_rad = Radianes($lon);

    $N = $a / sqrt(1 - $e2 * pow(sin($lat_rad), 2));

    $res['ela'] = ($N + $alt) * cos($lat_rad) * cos($lon_rad);
    $res['nlo'] = ($N + $alt) * cos($lat_rad) * sin($lon_rad);
    $res['z'] = ((1 - $e2) * $N + $alt) * sin($lat_rad);

    return $res;
}

//Función escalón para determinar el sentido del salto cosísmico.
function heaviside($ti, $tf, $ts) {
    if (($tf - $ts) > 0.0 && ($ti - $ts) < 0.0) {
        // La fecha objetivo es después del sismo y la fecha de partida es antes del sismo.
        return 1.0;
    } elseif (($tf - $ts) < 0.0 && ($ti - $ts) > 0.0) {
        // La fecha objetivo es antes del sismo y la fecha de partida es después del sismo.
        return -1.0;
    } else {
        // Ambas fechas son anteriores o posteriores al sismo.
        return 0.0;
    }
}

/*
Función para determinar el intervalo de tiempo que se ingresa
dentro del logaritmo para calcular la componente postsísmica.
*/
function delta_log($ti, $tf, $ts) {
    if (($ti - $ts) >= 0) {
        // La fecha de partida es después del sismo.
        return $ti - $ts;
    } elseif (($ti - $ts) < 0) {
        // La fecha de partida es anterior al sismo.
        return $tf - $ts;
    }
}

function helmert7($x, $y, $z, $marco_inicial = 'P07b') {

    /*
    Transformación de 7 parámetros de coordenadas geocéntricas
    x: coordenada cartesiana X (m)
    y: coordenada cartesiana Y (m)
    z: coordenada cartesiana Z (m)
    return: coordenadas cartesianas transformadas
    */

    // Vector x, y, z original
    $xyz_before = [
        [$x],
        [$y],
        [$z]
    ];

    /*
    Parámetros de transformación de P07b a P07:
    T (mm) : -1.03 -1.00 -0.62
    R (ppb): -0.72  0.44 -0.05
    S (ppb):  1.8101
    */

    $tx = -1.03 / 1000;
    $ty = -1.00 / 1000;
    $tz = -0.62 / 1000;
    $rx = -0.72;
    $ry = 0.44;
    $rz = -0.05;
    $sc = 1.8101;

    // Vector de parámetros
    $parameters = [
        [$tx],
        [$ty],
        [$tz],
        [$sc],
        [$rx],
        [$ry],
        [$rz]
    ];

    if ($marco_inicial == 'P07') {
        foreach ($parameters as &$param) {
            $param[0] *= -1;
        }
    }

    // Matriz de diseño
    $A = [
        [1.0, 0.0, 0.0, $x * 1e-9, 0.0, -$z * 1e-9, $y * 1e-9],
        [0.0, 1.0, 0.0, $y * 1e-9, $z * 1e-9, 0.0, -$x * 1e-9],
        [0.0, 0.0, 1.0, $z * 1e-9, -$y * 1e-9, $x * 1e-9, 0.0]
    ];

    // Vector x, y, z transformado
    $xyz_after = [];
    for ($i = 0; $i < 3; $i++) {
        $sum = 0;
        for ($j = 0; $j < 7; $j++) {
            $sum += $A[$i][$j] * $parameters[$j][0];
        }
        $xyz_after[$i] = $sum + $xyz_before[$i][0];
    }

    $res['ela'] = floatval($xyz_after[0]);
    $res['nlo'] = floatval($xyz_after[1]);
    $res['z'] = floatval($xyz_after[2]);

    return $res;
}



//funcion principal para determinar los parametros del modelo para el punto
//	en analisis y computar las coordenadas en la epoca objetivo
function velar($lat, $lon, $alt, $ti, $tf) {

    // epoca del terremoto de Maule y de Illapel
    $tmaule   = 2010.1589;
    $tillapel = 2015.7096;
    $a  = 6378137.0;
    $b  = 6.356752314245179e+06;
    $e2 = 0.006694379990141;

    $res = [
        'ela' => 0.0,
        'nlo' => 0.0,
        'z' => 0.0,
        'h' => 0.0
    ];
    // Si la fecha inicial es 2006.632, aplica una transformación de 7 parámetros P07 -> P07b
    if ($ti == 2006.632) {
        $res = lla2ecef($lat, $lon, $alt);
        $res = helmert7($res['ela'], $res['nlo'], $res['z'], 'P07');
        $res = ecef2lla($res['ela'], $res['nlo'], $res['z']);
        $lat = $res['ela'];
        $lon = $res['nlo'];
    }

    // Componente intersismica
    $intersismica = get_variable($lat, $lon, '../grids/vel-ar-lin.txt');
    $desplazamientos = array_map(function($v) use ($ti, $tf) { return $v * ($tf - $ti); }, $intersismica);

    //$res['componente_intersismica'] = [$intersismica[0], $intersismica[1], 0.0];

    // Componente del sismo de Maule
    if ($lat < -25.0 && $lat > -45.0 && $lon < -55.0 && $lon > -75.0) {
        $cosismicaM = get_variable($lat, $lon, '../grids/vel-ar-cos-maule.txt');
    } else {
        $cosismicaM = [0.0, 0.0];
    }

    $postsismicaM = get_variable($lat, $lon, '../grids/vel-ar-log-maule.txt', 13.5);

    //$res['salto_cosismico_maule'] = [$cosismica[0], $cosismica[1], 0.0];
    //$res['componente_postsismica_maule'] = [$postsismica[0], $postsismica[1], 0.0];

    $h = heaviside($ti, $tf, $tmaule);
    $desplazamientos = array_map(function($d, $c) use ($h) { return $d + $h * $c; }, $desplazamientos, $cosismicaM);

    if ($h != 0.0) {
        $desplazamientos = array_map(function($d, $p) use ($h, $ti, $tf, $tmaule) {
            return $d + $h * $p * log10(1 + (delta_log($ti, $tf, $tmaule) / 0.5));
        }, $desplazamientos, $postsismicaM);
    }

    if ($h == 0.0 && $ti > $tmaule) {
        $desplazamientos = array_map(function($d, $p) use ($tf, $tmaule, $ti) {
            return $d + $p * log10(1 + (($tf - $tmaule) / 0.5)) - $p * log10(1 + (($ti - $tmaule) / 0.5));
        }, $desplazamientos, $postsismicaM);
    }

    // Componente del sismo de Illapel
    $cosismicaI = get_variable($lat, $lon, '../grids/vel-ar-cos-illapel.txt');
    $postsismicaI = get_variable($lat, $lon, '../grids/vel-ar-log-illapel.txt', 12.0);

    //$res['salto_cosismico_illapel'] = [$cosismica[0], $cosismica[1], 0.0];
    //$res['componente_postsismica_illapel'] = [$postsismica[0], $postsismica[1], 0.0];

    $h = heaviside($ti, $tf, $tillapel);
    $desplazamientos = array_map(function($d, $c) use ($h) { return $d + $h * $c; }, $desplazamientos, $cosismicaI);

    if ($h != 0.0) {
        $desplazamientos = array_map(function($d, $p) use ($h, $ti, $tf, $tillapel) {
            return $d + $h * $p * log10(1 + (delta_log($ti, $tf, $tillapel) / 0.5));
        }, $desplazamientos, $postsismicaI);
    }

    if ($h == 0.0 && $ti > $tillapel) {
        $desplazamientos = array_map(function($d, $p) use ($tf, $tillapel, $ti) {
            return $d + $p * log10(1 + (($tf - $tillapel) / 0.5)) - $p * log10(1 + (($ti - $tillapel) / 0.5));
        }, $desplazamientos, $postsismicaI);
    }

    // Coordenadas finales
    $v = $a / sqrt(1 - $e2 * pow(sin(Radianes($lat)), 2));
    $r = $v * (1 - $e2) / (1 - $e2 * pow(sin(Radianes($lat)), 2));
    $dlat = ($desplazamientos[0] / ($r + $alt)) / (M_PI/180);
    $dlon = ($desplazamientos[1] / cos(Radianes($lat)) / ($v + $alt)) / (M_PI/180);

    $res['ela'] = $lat + $dlat;
    $res['nlo'] = $lon + $dlon;
    $res['h'] = $alt;
    $res['z'] = 0.0;
    if ($tf == 2006.632) {
            $res = lla2ecef($res['ela'], $res['nlo'], $res['h']);
            $res = helmert7($res['ela'], $res['nlo'], $res['z']);
            $res = ecef2lla($res['ela'], $res['nlo'], $res['z']);
            $res['z']=0.0;
    }

    return $res;
}

function transponer_matriz($matriz) {
    $transpuesta = [];
    
    // Obtener el número de filas y columnas
    $filas = count($matriz);
    $columnas = count($matriz[0]);
    
    // Recorrer las columnas y filas para crear la transpuesta
    for ($i = 0; $i < $columnas; $i++) {
        $nuevaFila = [];
        for ($j = 0; $j < $filas; $j++) {
            $nuevaFila[] = $matriz[$j][$i];
        }
        $transpuesta[] = $nuevaFila;
    }
    
    return $transpuesta;
}

function producto_punto_mm($A, $B) {
    $filasA = count($A);
    $columnasA = count($A[0]);
    $filasB = count($B);
    $columnasB = count($B[0]);
    
    // Verificar si las matrices pueden multiplicarse
    if ($columnasA != $filasB) {
        throw new Exception("El número de columnas de A debe ser igual al número de filas de B.");
    }
    
    // Inicializar la matriz resultante
    $resultado = [];
    for ($i = 0; $i < $filasA; $i++) {
        for ($j = 0; $j < $columnasB; $j++) {
            $resultado[$i][$j] = 0;
            for ($k = 0; $k < $columnasA; $k++) {
                $resultado[$i][$j] += $A[$i][$k] * $B[$k][$j];
            }
        }
    }
    
    return $resultado;
}

function producto_punto_mv($A, $V) {
    $filasA = count($A);
    $columnasA = count($A[0]);
    $dimensionV = count($V);
    
    // Verificar si las dimensiones son compatibles
    if ($columnasA != $dimensionV) {
        throw new Exception("El número de columnas de A debe ser igual al número de elementos en V.");
    }
    
    // Inicializar el vector resultante
    $resultado = [];
    
    // Calcular el producto matricial
    for ($i = 0; $i < $filasA; $i++) {
        $resultado[$i] = 0;
        for ($j = 0; $j < $columnasA; $j++) {
            $resultado[$i] += $A[$i][$j] * $V[$j];
        }
    }
    
    return $resultado;
}

function producto_punto_vv($V1, $V2) {
    // Verificar que los vectores tengan la misma longitud
    if (count($V1) != count($V2)) {
        throw new Exception("Los vectores deben tener la misma longitud.");
    }
    
    // Calcular el producto punto
    $producto_punto = 0;
    for ($i = 0; $i < count($V1); $i++) {
        $producto_punto += $V1[$i] * $V2[$i];
    }
    
    return $producto_punto;
}