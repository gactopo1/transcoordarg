<?php

$lat = $_POST['lat'];
$lon = $_POST['lon'];

if ($lon > 360.0) {$lon -= 360.0;}
if ($lon < 0.0) {$lon += 360.0;}
if ($lat > 180.0) {$lat -= 180.0;}
if ($lat < 0.0) {$lat += 180.0;}

// Define constants
const DLAT = 2.5 / 60.0;
const DLON = 2.5 / 60.0;
const IWIND = 6;
const IW = IWIND + 1;
const NROWS = 4321;
const NCOLS = 8640;
const NRIW2 = NROWS + 2 * IW;
const NCIW2 = NCOLS + 2 * IW;
$grid = [];
$scrd = [];
//$statd = array_fill(0, 22, 0.0);
$temp = array_fill(0, NCIW2, 0.0);

// Read binary grid file
$fp = fopen("../grids/GEOIDE-egm2008", 'rb');
for ($i = 1; $i <= NROWS; $i++) {
    $ii = NROWS + 1 - $i;
    $temp = fread($fp, NCIW2 * 4); // Read float values
    $temp = unpack("f*", $temp); // Unpack as floats
    $xlat = $ii * DLAT; // Calcula la latitud correspondiente
    for ($j = 1; $j <= NCOLS; $j++) {
        $xlon = $j * DLON; // Calcula la longitud correspondiente        
        $distance = haversine_distance($lat, $lon, $xlat, $xlon);
        if ($distance <= 100){
            $grid[$ii + IW][$j + IW] = $temp[$j + IW];
            $scrd[$j][0] = $grid[$ii + IW][$j + IW];
            $scrd[$j][1] = 1.0;
        }
    }
    // Call stats function
    //stats(90.0, 0.0, $i, DLAT, DLON, NROWS, NCOLS, $scrd, 9999.0, 0, $statd, $icell);
}
fclose($fp);

// Pad edges of the grid
for ($i = IW + 1; $i <= NROWS + IW; $i++) {
    for ($j = 1; $j <= IW; $j++) {
        $grid[$i][$j] = $grid[$i][$j + NCOLS];
    }
    for ($j = NCOLS + IW + 1; $j <= NCOLS + 2 * IW; $j++) {
        $grid[$i][$j] = $grid[$i][$j - NCOLS];
    }
}

for ($i = 1; $i <= IW; $i++) {
    $ii = 2 * IW + 1 - $i;
    for ($j = 1; $j <= NCOLS + 2 * IW; $j++) {
        $jj = $j + NCOLS / 2;
        if ($jj > NCOLS + 2 * IW) {
            $jj -= NCOLS;
        }
        $grid[$i][$j] = $grid[$ii][$jj];
    }
}

for ($i = NROWS + IW + 1; $i <= NROWS + 2 * IW; $i++) {
    $ii = 2 * (NROWS + IW) + 1 - $i;
    for ($j = 1; $j <= NCOLS + 2 * IW; $j++) {
        $jj = $j + NCOLS / 2;
        if ($jj > NCOLS + 2 * IW) {
            $jj -= NCOLS;
        }
        $grid[$i][$j] = $grid[$ii][$jj];
    }
}

// Interpolation
$dmin = 0.0;
$slat = -90.0 - DLAT * IW;
$wlon = -DLON * IW;

$alturaInterpolada = interp(IWIND, $dmin, $grid, $slat, $wlon, DLAT, DLON, NRIW2, NCIW2, NRIW2, NCIW2, $lat, $lon);

echo $alturaInterpolada;


function interp(
    $iwO, $dmin, $h, $phis, $dlaw, $ddfi, $ddla, $nphi, $ndla,
    $ipdim, $ildim, $phi, $dla, &$valint
) {
    $ipa1 = 20;
    $twopi = 6.28318530717959;
    $rho = 360.0 / $twopi;
    $rearh = 6371000.0;

    // Ensure iwO is within valid range
    if ($iwO < 2) {$iwO = 2;}
    if ($iwO > $ipa1) {$iwO = $ipa1;}

    $ilimit = $dmin * 1000.0 * $rho / ($rearh * $ddfi);
    $jlimit = $dmin * 1000.0 * $rho / ($rearh * $ddla * cos(($phis + $ddfi * $nphi / 2.0) / $rho));

    $lodd = ($iwO / 2) * 2 != $iwO;
    $ri = ($phi - $phis) / $ddfi;
    $rj = ($dla - $dlaw) / $ddla;

    if ($lodd) {
        $i0 = $ri - 0.5;
        $j0 = $rj - 0.5;
    } else {
        $i0 = $ri;
        $j0 = $rj;
    }

    $i0 = $i0 - $iwO / 2 + 1;
    $j0 = $j0 - $iwO / 2 + 1;
    $ii = $i0 + $iwO - 1;
    $jj = $j0 + $iwO - 1;

    if ($i0 < 0 || $ii >= $nphi || $j0 < 0 || $jj >= $ndla) {
        $valint = 999999.0;
        return;
    } elseif ($i0 < $ilimit || $ii > $nphi - $ilimit || $j0 < $jlimit || $jj > $ndla - $jlimit) {
        $valint = 999999.0;
        return;
    }

    if ($iwO > 2) {
        $a = array_fill(0, $ipa1, 0.0);
        $hc = array_fill(0, $ipa1, 0.0);

        for ($i = 0; $i < $iwO; $i++) {
            for ($j = 0; $j < $iwO; $j++) {
                $a[$j] = $h[$i0 + $i][$j0 + $j];
            }
            initsp($a, $iwO, $rho, $q);
            $hc[$i] = spline($rj - $j0 + 1.0, $a, $iwO, $rho);
        }
        initsp($hc, $iwO, $rho, $q);
        $valint = spline($ri - $i0 + 1.0, $hc, $iwO, $rho);
    } else {
        $valint = bilin($ri + 1.0, $rj + 1.0, $h, $nphi, $ndla, $ipdim, $ildim);
    }
    return $valint;
}

function bilin($ri, $rj, $a, $imax, $jmax, $iadim, $jadim) {
    // Compute integer and fractional parts of ri and rj
    $in = floor($ri);
    $ie = floor($rj);
    $rn = $ri - $in;
    $re = $rj - $ie;

    // Handle boundaries
    if ($in < 1) {
        $in = 1;
        $rn = 0.0;
    } elseif ($in >= $imax) {
        $in = $imax - 1;
        $rn = 1.0;
    }

    if ($ie < 1) {
        $ie = 1;
        $re = 0.0;
    } elseif ($ie >= $jmax) {
        $ie = $jmax - 1;
        $re = 1.0;
    }

    $rnm1 = 1.0 - $rn;
    $rem1 = 1.0 - $re;

    // Perform bilinear interpolation
    $bilin = $rnm1 * $rem1 * $a[$in][$ie] +
             $rn * $rem1 * $a[$in + 1][$ie] +
             $rnm1 * $re * $a[$in][$ie + 1] +
             $rn * $re * $a[$in + 1][$ie + 1];

    return $bilin;
}

function initsp($y, $n, &$r, &$q) {
    $q[0] = 0.0;
    $r[0] = 0.0;

    for ($k = 1; $k < $n - 1; $k++) {
        $p = $q[$k - 1] / 2 + 2;
        $q[$k] = -0.5 / $p;
        $r[$k] = (3 * ($y[$k + 1] - 2 * $y[$k] + $y[$k - 1]) - $r[$k - 1] / 2) / $p;
    }

    $r[$n - 1] = 0.0;

    for ($k = $n - 2; $k >= 1; $k--) {
        $r[$k] = $q[$k] * $r[$k + 1] + $r[$k];
    }
}

function spline($x, $y, $n, $r) {
    if ($x < 1) {
        $spline = $y[0] + ($x - 1) * ($y[1] - $y[0] - $r[1] / 6);
    } elseif ($x > $n) {
        $spline = $y[$n - 1] + ($x - $n) * ($y[$n - 1] - $y[$n - 2] + $r[$n - 2] / 6);
    } else {
        $j = floor($x);
        $xx = $x - $j;
        $spline = $y[$j - 1] +
                  $xx * (($y[$j] - $y[$j - 1] - $r[$j - 1] / 3 - $r[$j] / 6) +
                  $xx * ($r[$j - 1] / 2 +
                  $xx * ($r[$j] - $r[$j - 1]) / 6));
    }

    return $spline;
}

// Función para calcular la distancia en kilómetros entre dos puntos geográficos
function haversine_distance($lat1, $lon1, $lat2, $lon2) {
    $earth_radius = 6371; // Radio de la Tierra en kilómetros

    $dlat = deg2rad($lat2 - $lat1);
    $dlon = deg2rad($lon2 - $lon1);

    $a = sin($dlat / 2) * sin($dlat / 2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dlon / 2) * sin($dlon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earth_radius * $c;
}