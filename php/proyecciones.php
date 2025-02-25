<?php

function epsg9820($di, $la0, $lo0, $fe, $fn, $a, $e, $ela, $nlo, $h){
    //Lambert Azimuthal Equal Area
    if (Abs($la0) === M_PI_2){
        $aspec = 1;
    }else{
        $aspec = 2;
    }
    $m0 = elipx5($e, $la0);
    $q0 = fqEla($e, $la0);
    $qp = fqEla($e, M_PI_2);
    $beta0 = Asin($q0 / $qp);
    $rq = $a * pow($qp / 2,  0.5);
    $D = ($a * $m0) / ($rq * Cos($beta0));
    if ($di){
        //$m = elipx5($e, $ela);
        $q = fqEla($e, $ela);
        if ($aspec === 1) {
            if ($la0 < 0){
                $p = $a * pow($qp + $q,  0.5);
                $v['nlo'] = $p * Cos($nlo - $lo0);
            }else{
                $p = $a * pow($qp - $q,  0.5);
                $v['nlo'] = -$p * Cos($nlo - $lo0);
            }
            $v['ela'] = $p * Sin($nlo - $lo0);
        }else{
            $beta = Asin($q / $qp);
            $b = $rq * pow((2 / (1 + (Sin($beta0) * Sin($beta)) + (Cos($beta0) * Cos($beta) * Cos($nlo - $lo0)))) , 0.5);
            $v['ela'] = $fe + ($b * $D * Cos($beta) * Sin($nlo - $lo0));
            $v['nlo'] = $fn + (($b / $D) * (Cos($beta0) * Sin($beta) - Sin($beta0) * Cos($beta) * Cos($nlo - $lo0)));
        }
    }else{
        $x = $ela - $fe;
        $y = $nlo - $fe;
        if ($aspec === 1) {
            $p = pow(pow($x , 2) + pow($y , 2),  0.5);
            $q = ($qp - pow($p / $a,  2)) * ($la0 < 0 ? -1 : 1);
            $beta = Asin(1 - pow($p , 2) / (pow($a , 2) * (1 - ((1 - pow($e , 2)) / (2 * $e)) * Log((1 - $e) / (1 + $e))))) * ($la0 < 0 ? -1 : 1);
            $v['ela'] = flatElatautalica($e, $beta);
            if ($la0 < 0){
                $v['nlo'] = $lo0 + Atan2($y, $x);
            }else{
                $v['nlo'] = $lo0 + Atn2(-$y, $x);
            }
        }else{
            $p = pow(pow($x / $D,  2) + pow($D * $y, 2),  0.5);
            $ce = 2 * Asin($p / (2 * $rq));
            if ($p === 0){
                $q = $qp * Sin($beta0);
                $beta = Asin($q / $qp);
            }else{
                $beta = Asin(Cos($ce) * Sin($beta0) + ($D * $y * Sin($ce) * Cos($beta0) / $p));
            }
            $v['ela'] = flatElatautalica($e, $beta);
            if ($p === 0){
                $v['nlo'] = 0.0;
            }else{
                
                $t1 = $D * $p * Cos($beta0) * Cos($ce) - pow($D , 2) * $y * Sin($beta0) * Sin($ce);
                $t2=$x * Sin($ce);
                $at = atan2($t2,$t1);
                $v['nlo'] = $lo0 + $at;
            }
        }
    }
    $v['h']=$h;
    return $v;
}

function epsg9807($di, $k0, $la0, $lo0, $fe, $fn, $a, $e, $ela, $nlo, $h){
    //TRANSVERSA MERCATOR GENERAL
    $e2 = f2exentricidadE($e);
    //USGS formulas
    $am0 = farcmerEqLat($a, $e, $la0);
    if ($di){
        $aa = ($nlo - $lo0) * Cos($ela);
        $rv = fradiocurvaturaverticalAEL($a, $e, $ela);
        $t = pow(Tan($ela) , 2);
        $c = (pow($e , 2) * pow(Cos($ela) , 2)) / (1 - pow($e , 2));
        $am = farcmerEqLat($a, $e, $ela);
        $v['ela'] = $fe + ($k0 * $rv * ($aa + (((1 - $t + $c) * pow($aa , 3)) / 6) + (((5 - (18 * $t) + pow($t , 2) + (72 * $c) - (58 * pow($e2 , 2))) * pow($aa , 5)) / 120)));
        $ter1 = (((5 - $t + (9 * $c) + (4 * pow($c , 2))) * pow($aa , 4)) / 24);
        $ter2 = (((61 - (58 * $t) + pow($t , 2) + (600 * $c) - (330 * pow($e2 , 2))) * pow($aa , 6)) / 720);
        $v['nlo'] = $fn + ($k0 * ($am - $am0 + ($rv * Tan($ela) * ((pow($aa , 2) / 2) + $ter1 + $ter2))));
    }else{
        $e1 = fexentPrima($e);
        $am = $am0 + (($nlo - $fn) / $k0);
        $lr = flatrecAEM($a, $e, $am);
        $la1 = flatLatRec26($e1, $lr);
        $p = fradiocurvaturameridianoAEL($a, $e, $la1);
        $rv = fradiocurvaturaverticalAEL($a, $e, $la1);
        $t = pow(Tan($la1) , 2);
        $c = pow($e2 , 2) * pow(Cos($la1) , 2);
        $D = ($ela - $fe) / ($rv * $k0);
        $v['ela'] = $la1 - (($rv * Tan($la1) / $p) * ((pow($D , 2) / 2) - (((5 + (3 * $t) + (10 * $c) - (4 * pow($c , 2)) - (9 * pow($e2 , 2))) * pow($D , 4)) / 24) + (((61 + (90 * $t) + (298 * $c) + (45 * pow($t , 2)) - (252 * pow($e2 , 2)) - (3 * pow($c , 2))) * pow($D , 6)) / 720)));
        $v['nlo'] = $lo0 + (($D - ((1 + (2 * $t) + $c) * pow($D , 3) / 6) + (((5 - (2 * $c) + (28 * $t) - (3 * pow($c , 2)) + (8 * pow($e2 , 2)) + (24 * pow($t , 2))) * pow($D , 5)) / 120)) / Cos($la1));
    }
    $v['h']=$h;
    return $v;
}

function epsg9829($di, $la0, $lo0, $fe, $fn, $a, $e, $ela, $nlo, $h){
    //Polar Stereographic Variant B
    $m0 = elipx5($e, $la0);
    if ($la0 < 0){
        $t0 = Tan(M_PI_4 + ($la0 / 2)) / pow((1 + ($e * Sin($la0))) / (1 - ($e * Sin($la0))),$e / 2);
    }else{
        $t0 = Tan(M_PI_4 - ($la0 / 2)) * pow((1 + ($e * Sin($la0))) / (1 - ($e * Sin($la0))),$e / 2);
    }
    $k0 = $m0 * pow((pow((1 + $e) , (1 + $e)) * pow((1 - $e) , (1 - $e))) , 0.5) / (2 * $t0);
    if ($di){
        if ($la0 < 0){
            $t = Tan(M_PI_4 + ($ela / 2)) / pow((1 + ($e * Sin($ela))) / (1 - ($e * Sin($ela))),$e / 2);
        }else{
            $t = Tan(M_PI_4 - ($ela / 2)) * pow((1 + ($e * Sin($ela))) / (1 - ($e * Sin($ela))),$e / 2);
        }
        $p = (2 * $a * $k0 * $t) / pow((pow((1 + $e) , (1 + $e)) * pow((1 - $e) , (1 - $e))) , 0.5);
        $v['ela'] = $fe + $p * Sin($nlo - $lo0);
        if ($la0 < 0){
            $v['nlo'] = $fn + $p * Cos($nlo - $lo0);
        }else{
            $v['nlo'] = $fn - $p * Cos($nlo - $lo0);
        }
    }else{
        $p = pow(pow($ela - $fe,2) + pow($nlo - $fn,2),0.5);
        $t = $p * pow((pow((1 + $e) , (1 + $e)) * pow((1 - $e) , (1 - $e))) , 0.5) / (2 * $a * $k0);
        if ($la0 < 0){
            $chi = 2 * Atan($t) - M_PI_2;
            $v['nlo'] = $lo0 + Atan(($ela - $fe) / ($nlo - $fn));
        }else{
            $chi = M_PI_2 - 2 * Atan($t);
            $v['nlo'] = $lo0 + Atan(($ela - $fe) / ($fn - $nlo));
        }
        $v['ela'] = finvlatconformeELcserie($e, $chi);
    }
    $v['h']=$h;
    return $v;
}