<?php
    require_once "./php/funcionesPHP.php";
    include "./php/menu.php";
?>

<section class="contenedor">
    <section class="origen">
        <div class="centrado">
            <label class="subtitulo">Sistemas de coordenadas proyectadas</label>
        </div>
        <div class="centrado">
            <label class="subtitulo">Definidos por el usuario</label>
        </div>
        <div class="separador"></div>
        <section class="dataform">
            <div style="height: 20px"></div>
            <div class="labelinput">
                <label for="cod" id="l-cod" style="width: 150px">Còdigo</label>
                <input class="imput" style="margin-right: 10px;" id="cod" type="text" size="6">
                <select id="selcoord" class="ancho300">
                    <option value="" disabled selected>Seleccione un sistema de coordenadas</option>
                    <?php
                   $baseLocal = conexion();
                   $consultaLocal = $baseLocal->query('SELECT codigo,nombre FROM scrusuario ORDER BY nombre');
                   $reg=$consultaLocal->rowCount();
                    $resul = $consultaLocal->fetchAll();
                    foreach ($resul as $fila) {
                            echo '<option value="' . $fila['codigo'] . '" >' . $fila['nombre'] . '</option>';
                    }
                   $baseLocal = null;
                   ?>
                </select>
            </div>
            <div class="labelinput">
                <label for="nom" id="l-nom" style="width: 150px">Nombre</label>
                <input class="imput" id="nom" type="text" size="40">
            </div>
            <div class="labelinput">
                <label for="dat" id="l-dat" style="width: 150px">Datum</label>
                <input class="imput"  style="margin-right: 10px;" id="dat" size="6">
                <select id="seldatum" class="ancho300">
                    <option value="" disabled selected>Seleccione un datum</option>
                    <?php
                   $base = conexion();
                   $base = $base->query('SELECT codigo,nombre FROM datumhor ORDER BY nombre');
                    $base = $base->fetchAll();
                    foreach ($base as $fila) {
                            echo '<option value="' . $fila['codigo'] . '" >' . $fila['nombre'] . '</option>';
                    }
                   $base = null;
                   ?>
                </select>
            </div>     
            <div class="labelinput">
                <label for="dat" id="l-dat" style="width: 150px">Proyeccion</label>
                <select id="selproy" class="ancho300">
                    <option value="TM" selected>Transversa Mercator</option>
                    <option value="EP">Estereografica Polar</option>
                    <option value="LE">Lambert Equiarea</option>
                </select>
            </div>     
            <div class="labelinput">
                <label for="lo0" id="l-lo0" style="width: 150px">Origen de longitudes</label>
                <input class="imput" id="lo0" type="text" size="6">
            </div>
            <div class="labelinput">
                <label for="la0" id="l-la0" style="width: 150px">Origen de latitudes</label>
                <input class="imput" id="la0" type="text" size="6">
            </div>
            <div class="labelinput">
                <label for="fn" id="l-fn" style="width: 150px">Falso norte</label>
                <input class="imput" id="fn" type="text" size="6">
            </div>
            <div class="labelinput">
                <label for="fe" id="l-fe" style="width: 150px">Falso este</label>
                <input class="imput" id="fe" type="text" size="6">
            </div>
            <div class="labelinput">
                <label for="esc" id="l-esc" style="width: 150px">Factor de escala</label>
                <input class="imput" id="esc" type="text" size="6">
            </div>
            <div class="labelinput">
                <label style="width: 150px">Area de uso</label>
                <label for="la1" id="l-la1" style="width: 50px">Lat1</label>
                <input class="imput" id="la1" type="text" size="4" style="margin-right: 10px">
                <label for="lo1" id="l-lo1" style="width: 50px">Lon1</label>
                <input class="imput" id="lo1" type="text" size="4" style="margin-right: 10px">
                <label for="la2" id="l-la2" style="width: 50px">Lat2</label>
                <input class="imput" id="la2" type="text" size="4" style="margin-right: 10px">
                <label for="lo2" id="l-lo2" style="width: 50px">Lon2</label>
                <input class="imput" id="lo2" type="text" size="4">
            </div>
        </section>
    </section>
</section>
<div id="botones" class="barra_botones">
    <input type="button" value="Guardar" id="boton_guardar" class="boton-redondo" onclick="guardar()">
    <input type="button" value="Limpiar" id="boton_limpiar" class="boton-redondo" onclick="limpiar()" style="margin-left: 10px"> 
    <input type="button" value="Borrar" id="boton_borrar" class="boton-redondo" onclick="borrar()" style="margin-left: 10px;">
</div>

<script src="./js/usuario.js"></script>
