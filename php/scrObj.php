<?php


class scrObj {
    public $tipo;
    public $sistema;
    public $datum;
    public $semimayor;
    public $semimenor;
    public $aplanamiento;
    public $proyeccion;
    public $falsoeste;
    public $falsonorte;
    public $factorescala;
    public $longitudorigen;
    public $latitudorigen;
    public $parametros;
    public $altura;
    public $geoide;
    
    public function __construct() {
        $this->tipo = "";
        $this->sistema = "";
        $this->datum = "";
        $this->semimayor = 0.0;
        $this->semimenor = 0.0;
        $this->aplanamiento = 0.0;
        $this->proyeccion = "";
        $this->falsoeste = 0.0;
        $this->falsonorte = 0.0;
        $this->factorescala = 0.0;
        $this->longitudorigen = 0.0;
        $this->latitudorigen = 0.0;
        $this->parametros = "";
        $this->altura = "";
        $this->geoide = "";
    }
}
