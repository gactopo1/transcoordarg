
<?php
    include "./php/menu.php";
?>

<section class="contenedor">
    <section class="origen">
        <div class="centrado">
            <label class="subtitulo">Sistema Origen</label>
        </div>
        <label for="geod-o"><input id="geod-o" onchange="obtenertipocoord('selcoordO')" type="radio" name="coordO" value="geodesicas" checked> Goedesicas</label>
        <label for="geoc-o"><input id="geoc-o" onchange="obtenertipocoord('selcoordO')" type="radio" name="coordO" value="geocentricas">Geocentricas</label>
        <label for="proy-o"><input id="proy-o" onchange="obtenertipocoord('selcoordO')" type="radio" name="coordO" value="proyectadas">Proyectadas</label>
        <label for="usu-o"><input id="usu-o" onchange="obtenertipocoord('selcoordO')" type="radio" name="coordO" value="usuario">Usuario</label>
        <div class="separador"></div>
        <div class="selec_boton">
            <select id="selcoordO" class="ancho300">
                <option disabled selected>Seleccione un sistema de coordenadas</option>
            </select>
            <input type="button" value="Detalle" id="boton_sis_o" class="boton-redondo" onclick="detallesistemas('selcoordO')">
        </div>
        <div class="linea-divisoria"></div>
        <form class="dataform">
            <div class="titulodatos">
                <label class="subtitulo">Datos de Entrada</label>
                <input type="button" value="DD MM SS" id="boton_formatoO" class="boton-redondo" onclick="formato('boton_formatoO')">
            </div>
            <div style="height: 20px"></div>
            <div class="labelinput">
                <label for="elaO" id="lab_O_1" class="ancho200">Latitud</label>
                <input class="imput" id="elaO" name="Latitud" type="text" placeholder="99 99 99.99" pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}">
            </div>
            <div class="labelinput">
                <label for="nloO" id="lab_O_2" class="ancho200">Longitud</label>
                <input class="imput" id="nloO" name="Longitud" type="text" placeholder="999 99 99.99" pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}">
            </div>     
            <div id="geocen_Z_O" class="labelinput">
                <label for="zO" id="lab_O_3" class="ancho200">Z</label>
                <input class="imput" id="zO" name="Z" type="text" placeholder="99999999.9999" pattern="[-0-9.]">
            </div>
            <div id="h_elip_O" class="labelinput">
                <label for="hO" id="lab_elip_O" >Altura</label>
                <label class="switch">
                  <input type="checkbox" id="ar16O" onclick="botonesAlt('O')">
                  <span class="slider">
                    <span class="slider-text off">elipsoidal</span>
                    <span class="slider-text on">ortometrica</span>
                  </span>
                </label>                
                <input class="imput" id="hO" name="altO" type="text" placeholder="9999.9999" pattern="[-0-9.]" style="margin-left: 50px;">
                
                <label class="button-group" id="ortoO">
                    <input type="button" id="b_ar16_O" value="ar16" class="btn selected" onclick="selectButton('b_ar16_O','O')">
                    <input type="button" id="b_egm96_O" value="egm96" class="btn" onclick="selectButton('b_egm96_O','O')">
                    <input type="button" id="b_egm2008_O" value="egm2008" class="btn" onclick="selectButton('b_egm2008_O','O')">
                </label>            
                
                <!-- <label class="button-group" id="ortoO">botones</label> -->
            </div>
            <div id="fecha_O" class="labelinput"> 
                <label for="fO" id="lab_F_O" class="ancho200">Fecha</label>
                <input class="imput" id="fO" name="fechao" type="date">
            </div>
        </form>
    </section>
    <section class="destino">
        <div class="centrado">
            <label class="subtitulo">Sistema Destino</label>
        </div>
        <label for="geod-d"><input  id="geod-d" onchange="obtenertipocoord('selcoordD')" type="radio" name="coordD" value="geodesicas"> Goedesicas</label>
        <label for="geoc-d"><input  id="geoc-d" onchange="obtenertipocoord('selcoordD')" type="radio" name="coordD" value="geocentricas">Geocentricas</label>
        <label for="proy-d"><input  id="proy-d" onchange="obtenertipocoord('selcoordD')" type="radio" name="coordD" value="proyectadas" checked>Proyectadas</label>
        <label for="usu-d"><input id="usu-d" onchange="obtenertipocoord('selcoordD')" type="radio" name="coordD" value="usuario">Usuario</label>
        <div class="separador"></div>
        
        <div class="selec_boton">
            <select id="selcoordD" class="ancho300">
                <option disabled selected>Seleccione un sistema de coordenadas</option>
            </select>
            <input type="button" value="Detalle" id="boton_sis_d" class="boton-redondo" onclick="detallesistemas('selcoordD')">
        </div>
        <div class="linea-divisoria"></div>
        <form class="dataform">
            <div class="titulodatos">
                <label class="subtitulo">Datos de Salida</label>
                <input type="button" value="DD MM SS" id="boton_formatoD" class="boton-redondo" onclick="formato('boton_formatoD')">
            </div>
            <div style="height: 20px"></div>
            <div class="labelinput">
                <label for="elaD" id="lab_D_1" class="ancho200">Latitud</label>
                <input class="imput" id="elaD" name="Latitud" type="text" placeholder="99 99 99.99" pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}">
            </div>
            <div class="labelinput">
                <label for="nloD" id="lab_D_2" class="ancho200">Longitud</label>
                <input class="imput" id="nloD" name="Longitud" type="text" placeholder="999 99 99.99" pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}">
            </div>  
            <div id="geocen_Z_D" class="labelinput">
                <label for="zD" id="lab_D_3" class="ancho200">Z</label>
                <input class="imput" id="zD" name="Z" type="text" placeholder="99999999.9999" pattern="[-0-9.]">
            </div>
            <div id="h_elip_D" class="labelinput">
                <label for="hD" id="lab_elip_D" >Altura </label>
                <label class="switch">
                  <input type="checkbox" id="ar16D" onclick="botonesAlt('D')">
                  <span class="slider">
                    <span class="slider-text off">elipsoidal</span>
                    <span class="slider-text on">ortometrica</span>
                  </span>
                </label>                

                <input class="imput" id="hD" name="altD" type="text" placeholder="9999.9999" pattern="[-0-9.]" style="margin-left: 50px;">
                
                <label class="button-group" id="ortoD">
                    <input type="button" id="b_ar16_D" value="ar16" class="btn selected" onclick="selectButton('b_ar16_D','D')">
                    <input type="button" id="b_egm96_D" value="egm96" class="btn" onclick="selectButton('b_egm96_D','D')">
                    <input type="button" id="b_egm2008_D" value="egm2008" class="btn" onclick="selectButton('b_egm2008_D','D')">
                </label>            

            </div>
            <div id="fecha_D" class="labelinput"> 
                <label for="fD" id="lab_F_D" class="ancho200">Fecha</label>
                <input class="imput" id="fD" name="fechad" type="date">
            </div>
        </form>
    </section>
</section>
<div id="barramensaje" class="barra_botones">

    <div id="loading-spinner" style="display: none;">
        <div class="spinner"></div>
    </div>
    
    <select id="seltrans" style='margin-left: 20px;'></select>
    <label id="labelmensaje"></label>
</div>
<div id="barra_botones" class="barra_botones">
    <input type="button" value="Calcular Origen -> Destino" id="boton_cal_dir" class="boton-redondo" onclick="calcular('OD',false)">
    <input type="button" value="Calcular Destino -> Origen" id="boton_cal_inv" class="boton-redondo" onclick="calcular('DO',false)" style="margin-left: 10px;">
    <input type="button" value="Cargar Archivo" id="boton_archivo" class="boton-redondo" onclick="cargararchivo()" style="margin-left: 10px;">
    <input type="button" value="Limpiar" id="boton_limpiar" class="boton-redondo" onclick="limpiar()" style="margin-left: 10px"> 
</div>
<div id="ventana">
    <div id="div_boton_cerrar" style="display: flex; justify-content: space-between; align-items: center;">
        <Label class="subtitulo" id="titulo_detalle" ></Label>
        <input type="button" id="boton_cerrar_ventana" class="boton-redondo" value="Cerrar" onclick="cerrarventana('ventana')">
    </div>
    <div id="cuerpo_ventana" style="width: 800px; display: flex; margin-top: 10px;">
        <div id="campos_ventana" style="flex: 1;  cursor: move;" ></div>
        <div id="map" style="height: 400px; flex: 1; cursor: default;" ></div>
    </div>
</div>
<section id="archivoexcel">
    <section id="barra_archivo">
        <input type="file" id="my_file_input" accept=".xls,.xlsx,.xlsm,.csv, .gpx, .kml, .kmz, .dxf">
        <input type="button" value="Volver" id="boton_volver_archivo" class="boton-redondo" onclick="cerrararchivo()">
        <input style="display: none" type="button" value="Calcular Origen -> Destino" id="boton_cal_archivo" class="boton-redondo" onclick="calcular('OD',true)">
        <input style="display: none; margin-left: 20px" type="button" value="Descargar Archivo" id="boton_descargar_archivo" class="boton-redondo" onclick="botondescarga()">
        <div style="display: none; margin-left: 20px" id="descarga">
            <input type="button" id="bxls" value="XLS" class="boton-redondo" onclick="descargararchivo('xls')">
            <input type="button" id="bkml" value="KML" class="boton-redondo" onclick="descargararchivo('kml')">
            <input type="button" id="bdxf" value="DXF" class="boton-redondo" onclick="descargararchivo('dxf')">
            <input type="button" id="bgpx" value="GPX" class="boton-redondo" onclick="descargararchivo('gpx')">
        </div>            
    </section>
    <div class="linea-divisoria"></div>
    <section class="contenedor">
        <section class="origen">
            <table id='tabla_origen'>
            </table>
        </section>
        <section class="destino">
            <table id='tabla_destino'>
            </table>
        </section>
    </section>
</section>

<script src="./js/funcionesJS.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dxf-parser@1.1.2/dist/dxf-parser.min.js"></script>

<script
    src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
    crossorigin="anonymous">
</script>
<script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin="">
</script>
