<?php

class trandatumObj {
    public $codigo;
    public $trans;
    public $dx;
    public $dy;
    public $dz;
    public $k;
    public $rx;
    public $ry;
    public $rz;
    public $param1;
    public $param2;
    public $inverso;
    
    public function __construct() {
        $this->codigo="";
        $this->trans="";
        $this->dx=0.0;
        $this->dy=0.0;
        $this->dz=0.0;
        $this->k=0.0;
        $this->rx=0.0;
        $this->ry=0.0;
        $this->rz=0.0;
        $this->param1="";
        $this->param2="";
        $this->inverso = 0;
    }
}

