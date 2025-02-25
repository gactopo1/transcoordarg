<?php

function geocentrictranslation($dato,$trandat){
    $x = $dato['ela'];
    $y = $dato['nlo'];
    $z = $dato['z'];
    $dx = $trandat->dx;
    $dy = $trandat->dy;
    $dz = $trandat->dz;
    if ($trandat->inverso){
        $dato['ela']=$x - $dx;
        $dato['nlo']=$y - $dy;
        $dato['z']=$z - $dz;
    }else{
        $dato['ela']=$x + $dx;
        $dato['nlo']=$y + $dy;
        $dato['z']=$z + $dz;
    }
    return $dato;
}

function helmert($tipo,$dato,$trandat){
    if ($trandat->inverso !== 1){
        $rx=-radianes($trandat->rx/3600);
        $ry=-radianes($trandat->ry/3600);
        $rz=-radianes($trandat->rz/3600);
        $dx = -$trandat->dx;
        $dy = -$trandat->dy;
        $dz = -$trandat->dz;
        $k = -$trandat->k / 1000000;               
    }else{    
        $rx=radianes($trandat->rx/3600);
        $ry=radianes($trandat->ry/3600);
        $rz=radianes($trandat->rz/3600);
        $dx = $trandat->dx;
        $dy = $trandat->dy;
        $dz = $trandat->dz;
        $k = $trandat->k / 1000000;               
    }
    if ($tipo==="CFR"){    //Coordinate Frame Rotation
        $mr[0][0]=1;
        $mr[0][1]=$rz;
        $mr[0][2]=-$ry;
        $mr[1][0]=-$rz;
        $mr[1][1]=1;
        $mr[1][2]=$rx;
        $mr[2][0]=$ry;
        $mr[2][1]=-$rx;
        $mr[2][2]=1;
    }else{                 //Position Vector Rotation
        $mr[0][0]=1;
        $mr[0][1]=-$rz;
        $mr[0][2]=$ry;
        $mr[1][0]=$rz;
        $mr[1][1]=1;
        $mr[1][2]=-$rx;
        $mr[2][0]=-$ry;
        $mr[2][1]=$rx;
        $mr[2][2]=1;
    }
    $vo[0]=$dato['ela'];
    $vo[1]=$dato['nlo'];
    $vo[2]=$dato['z'];
    $m = 1 + $k;
    $vd = promatrizvector($mr, $vo);
    $vd[0]=$vd[0]*$m;
    $vd[1]=$vd[1]*$m;
    $vd[2]=$vd[2]*$m;
    $vd[0]=$vd[0]+$dx;
    $vd[1]=$vd[1]+$dy;
    $vd[2]=$vd[2]+$dz;
    $dato['ela']=$vd[0];
    $dato['nlo']=$vd[1];
    $dato['z']=$vd[2];
    return $dato;
}

/*
function helmert($tipo,$dato,$trandat){
    $rx=-radianes($trandat->rx/3600);
    $ry=-radianes($trandat->ry/3600);
    $rz=-radianes($trandat->rz/3600);
    $dx = -$trandat->dx;
    $dy = -$trandat->dy;
    $dz = -$trandat->dz;
    $k = -$trandat->k / 1000000;               
    if ($tipo==="CFR"){    //Coordinate Frame Rotation
        $mr[0][0]=1;
        $mr[0][1]=$rz;
        $mr[0][2]=-$ry;
        $mr[1][0]=-$rz;
        $mr[1][1]=1;
        $mr[1][2]=$rx;
        $mr[2][0]=$ry;
        $mr[2][1]=-$rx;
        $mr[2][2]=1;
    }else{                 //Position Vector Rotation
        $mr[0][0]=1;
        $mr[0][1]=-$rz;
        $mr[0][2]=$ry;
        $mr[1][0]=$rz;
        $mr[1][1]=1;
        $mr[1][2]=-$rx;
        $mr[2][0]=-$ry;
        $mr[2][1]=$rx;
        $mr[2][2]=1;
    }
    $vo[0]=$dato['ela'];
    $vo[1]=$dato['nlo'];
    $vo[2]=$dato['z'];
    if ($trandat->inverso === 1){
        //VS = (1 – dS) * R^-1 * (VT – T)
        $vo[0]=$vo[0]-$dx;
        $vo[1]=$vo[1]-$dy;
        $vo[2]=$vo[2]-$dz;
        $mr = InvMatrizGJ($mr);
        $m = 1 - $k;
    }else{
        $m = 1 + $k;
    }
    $vd = promatrizvector($mr, $vo);
    $vd[0]=$vd[0]*$m;
    $vd[1]=$vd[1]*$m;
    $vd[2]=$vd[2]*$m;
    if ($trandat->inverso !== 1){
        $vd[0]=$vd[0]+$dx;
        $vd[1]=$vd[1]+$dy;
        $vd[2]=$vd[2]+$dz;
    }
    $dato['ela']=$vd[0];
    $dato['nlo']=$vd[1];
    $dato['z']=$vd[2];
    return $dato;
}
*/

function promatrizvector($mr,$vx){
    $xx = array_fill(0,3,0);
    for ($i = 0; $i <= 2; $i++){
        $x=0;
        for ($j = 0; $j <= 2; $j++){
            $x = $x + ($mr[$i][$j] * $vx[$j]);
        }
        $xx[$i]=$x;
    } 
    return $xx;
}

function InvMatrizGJ($a){
    $MIde = IdeMatriz(2);
    $Mamp = AmpMatriz($a, $MIde);
    $error=false;
    $MInv = array_fill(0, 3, array_fill(0, 3, 0.0));
    for ($i = 0; $i <= 2; $i++){ //Recorre la diagonal principal
        if ($Mamp[$i][$i] === 0) {
            $error = true;
            break;
        }
        $X = $Mamp[$i][$i]; //Diagonal principal
        for ($Ij = 0; $Ij <= 5; $Ij++){ //Divide la fila del pivote por el pivote
            $Mamp[$i][$Ij] = $Mamp[$i][$Ij] / $X;
        }
        for ($Ii = 0; $Ii <= 2; $Ii++){ //Recorre la columna del pivote
            if ($Ii !== $i){  //Salta el pivote
                $X = (-1) * $Mamp[$Ii][$i]; //Inverso aditivo
                for ($Ij = 0; $Ij <= 5; $Ij++){ //Recorre la fila del elemento que se esta reduciendo
                    $Mamp[$Ii][$Ij] = ($X * $Mamp[$i][$Ij]) + $Mamp[$Ii] [$Ij];
                }
            }
        }
    }
    if (!$error) {
        for ($i = 0; $i <= 2; $i++){
            for ($j = 0; $j <= 2; $j++){
                $MInv[$i][$j] = $Mamp[$i][$j + 3];
            }
        }
    }
    return $MInv;
}

function IdeMatriz($n) {
    $a = array_fill(0, $n+1, array_fill(0, $n+1, 0));
    for ($i = 0; $i <= $n; $i++){
        for ($j = 0; $j <= $n; $j++){
            $a[$i][$j] = ($i === $j) ? 1 : 0;
        }
    }
    return $a;
}

function AmpMatriz($M1, $M2){
    $Mamp = array_fill(0, 3, array_fill(0, 6, 0));
    for ($i = 0; $i <= 2; $i++){
        for ($j = 0; $j <= 2; $j++){
            $Mamp[$i][$j] = $M1[$i][$j];
        }
    }
    for ($i = 0; $i <= 2; $i++){
        for ($j = 0; $j <= 2; $j++){
            $Mamp[$i][$j + 3] = $M2[$i][$j];
        }
    }
    return $Mamp;
}
