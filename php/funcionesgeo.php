<?php

function fsemimenorAF($a,$f){
    // elip13 - semi eje menor del elipsoide dados a (semieje mayor) y f (aplanamiento)
    $b = $a-($a*$f);
    return $b;
}

function fexentricidadF($f){
    // elip16 - exentricidad del elipsoide dado f (aplanamiento del elipsoide)
    $e = pow($f * (2 - $f),0.5);
    return $e;    
}

function elipx5($e, $la){
    $k = Cos($la) / pow((1 - (pow($e , 2) * pow(Sin($la) , 2))) , 0.5);
    return $k;
}    

function fqEla($e, $la){
    //elip312 - 'q = (1-e²){sin la / (1-e² sin²la) - (1/(2e))ln[(1-e sin la)/(1+e sin la)]}
    $q = (1 - pow($e , 2)) * ((Sin($la) / (1 - (pow($e , 2) * pow(Sin($la) , 2)))) - ((1 / (2 * $e)) * log((1 - ($e * Sin($la))) / (1 + ($e * Sin($la))))));
    return $q;
}

function flatElatautalica($e, $lh){
    //elip318 - Latitud en funcion de Authalic Latitude
    $la = $lh + (((pow($e , 2) / 3) + (31 * pow($e , 4) / 180) + (517 * pow($e , 6) / 5040)) * Sin(2 * $lh)) + (((23 * pow($e , 4) / 360) + (251 * pow($e , 6) / 3780)) * Sin(4 * $lh)) + ((761 * pow($e , 6) / 45360) * Sin(6 * $lh));
    return $la;
}

function f2exentricidadE($e){
    // elip19 - segunda exentricidad del elipsoide dado e (exentricidad del elipsoide)
    $ee = pow(pow($e,2) / (1 - pow($e,2)),0.5);
    return $ee;
}

function farcmerEqLat($a, $e, $la){
    //elip321 - Arco de Meridiano, desde el ecuador al punto de latitud la
    $arc = $a * (((1 - (pow($e , 2) / 4) - (3 * pow($e , 4) / 64) - (5 * pow($e , 6) / 256)) * $la) - (((3 * pow($e , 2) / 8) + (3 * pow($e , 4) / 32) + (45 * pow($e , 6) / 1024)) * Sin(2 * $la)) + (((15 * pow($e , 4) / 256) + (45 * pow($e , 6) / 1024)) * Sin(4 * $la)) - ((35 * pow($e , 6) / 3072) * Sin(6 * $la)));
    return $arc;
}

function fexentPrima($e){
    //elip324
    $e1 = (1 - pow((1 - pow($e , 2)) , 0.5)) / (1 + pow((1 - pow($e , 2)) , 0.5));
    return $e1;
}

function flatrecAEM($a, $e, $m) {
    //elip719 - Latitud rectificada en funcion de M
    $lr = $m / ($a * (1 - (pow($e , 2) / 4) - (3 * pow($e , 4) / 64) - (5 * pow($e , 6) / 256)));
    return $lr;
}

function flatLatRec26($e1, $lr){
    //elip326 - Latitud en funcion de la Latitud rectificada
    $la = $lr + (((3 * $e1 / 2) - (27 * pow($e1 , 3) / 32)) * Sin(2 * $lr)) + (((21 * pow($e1 , 2) / 16) - (55 * pow($e1 , 4) / 32)) * Sin(4 * $lr)) + ((151 * pow($e1 , 3) / 96) * Sin(6 * $lr)) + ((1097 * pow($e1 , 4) / 512) * Sin(8 * $lr));
    return $la;
}

function fradiocurvaturameridianoAEL($a,$e,$la){
    // elip22 - Radio de curvatura del meridiano de latitud la, dados a y e
    $m = ($a * (1 - pow($e, 2))) / pow((1 - (pow($e, 2) * pow(sin($la), 2))), 1.5);
    return $m;    
}

function fradiocurvaturaverticalAEL($a,$e,$la){
    // elip21 - Radio de curvatura en el primer vertical dados a , e y la latitud del punto
    $v = $a / (pow(1 - (pow($e,2) * pow(sin($la),2)),0.5));
    return $v;
}

function finvlatconformeELcserie($e,$lc){
    // elip35 - Latitud en funcion de la latitud conforme x dado e (desarrollo en serie)
    $la = $lc + (((pow($e, 2) / 2) + (5 * pow($e, 4) / 24) + (pow($e, 6) / 12) + (13 * pow($e, 8) / 360)) * sin(2 * $lc)) + (((7 * pow($e, 4) / 48) + (29 * pow($e, 6) / 240) + (811 * pow($e, 8) / 11520)) * sin(4 * $lc)) + (((7 * pow($e, 6) / 120) + (81 * pow($e, 8) / 1120)) * sin(6 * $lc)) + ((4279 * pow($e, 8) / 161280) * sin(8 * $lc));
    return $la;
}

function fexentricidadAB($a,$b){
    // elip15 - exentricidad del elipsoide dados a (semieje mayor) y b (semieje menor)
    $e = pow((pow($a,2) - pow($b,2)) / pow($a,2),0.5);
    return $e;
}   
