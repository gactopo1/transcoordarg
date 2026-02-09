<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="./css/mdt.css">
        <script>
            // Variable global que indica si WebGL2 es soportado
            let isWebGL2;
            let canvas = document.createElement('canvas');
            isWebGL2 = !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
            console.log('WebGL2 soportado:', isWebGL2);
            </script>
                    <script type="importmap">
                {
                    "imports": {
                            "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
                            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
                    }
                }
            </script>
    </head>
    
    <body>
        <section class="encabezado"> 
            <div class="encabezado" style="flex-direction: row">  
                <label>Modelo digital de terreno</label>
            </div>
            <div class="encabezado" style="flex-direction: row">
                <label id="nomArchivo" style="margin-left: 10px; font-size: 12px;"></label>
                <label id="nombreGrilla" style="margin-left: 10px; font-size: 12px;"></label>
                <label id="nombreCurva" style="margin-left: 10px; font-size: 12px;"></label>
                <label id="mensaje" style="margin-left: 10px; font-size: 12px;"></label>
            </div>
        </section>    
        <section id="pantalla" class="contenedor" style="background-color: rgb(185, 221, 241);">
            <div class="grilla" style="width: 320px;">
                <div class="xy">
                    <div class="texinput">
                        <label>x-min</label>
                        <input class="imput" type="number" step="1" id="xmin">
                    </div>
                    <div class="texinput" style="margin-left: 10px;">
                        <label>x-max</label>
                        <input class="imput" type="number" step="1" id="xmax">
                    </div>
                </div>
                <div class="xy">
                    <div class="texinput">
                        <label>y-min</label>
                        <input class="imput" type="number" step="1" id="ymin">
                    </div>
                    <div class="texinput" style="margin-left: 10px;">
                        <label>y-max</label>
                        <input class="imput" type="number" step="1" id="ymax">
                    </div>
                </div>
                <div class="xy">
                    <div class="texinput">
                        <label>z-min</label>
                        <input class="imput" type="number" step="1" id="zmin">
                    </div>
                    <div class="texinput" style="margin-left: 10px;">
                        <label>z-max</label>
                        <input class="imput" type="number" step="1" id="zmax">
                    </div>
                </div>
                <div class="xy">
                    <div class="texinput">
                        <label>paso</label>
                        <input class="imput" type="number" step="0.1" id="paso">
                    </div>
                    <div class="texinput" style="margin-left: 10px;">
                        <label>niveles</label>
                        <input class="imput" type="number" step="1" id="nivel">
                    </div>
                </div>
                <div class="xy" style="margin-top: 10px;">
                    <label>X</label>
                    <label id="xpunto" class="punto"></label>
                    <label style="margin-left: 10px;">Y</label>
                    <label id="ypunto" class="punto"></label>
                    <label style="margin-left: 10px;">Z</label>
                    <label id="zpunto" class="punto" style="width: 50px;"></label>
                </div>
                <div id="interruptores" class="lineaBotones">
                    <label class="switch-vintage">
                        <label>Ver Puntos</label>
                        <input type="checkbox" id="checkPuntos" checked>
                        <span class="boton-vintage"></span>
                    </label>
                    <label class="switch-vintage">
                        <label>Ver Grilla</label>
                        <input type="checkbox" id="checkGrilla">
                        <span class="boton-vintage"></span>
                    </label>
                    <label class="switch-vintage">
                        <label>Ver Curvas</label>
                        <input type="checkbox" id="checkCurvas">
                        <span class="boton-vintage"></span>
                    </label>
                    <label class="switch-vintage">
                        <label>Ver Poligonos</label>
                        <input type="checkbox" id="checkPoligonos">
                        <span class="boton-vintage"></span>
                    </label>
                </div>
                <div id="contenedorBotonesTriangulacion" style="display: none">
                    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                        <label>Edicion de poligonos</label>
                    </div>    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label class="switch-vintage">
                            <label>Sel punto</label>
                            <input type="checkbox" id="checkSelpuntos" checked>
                            <span class="boton-vintage"></span>
                        </label>
                        <input type="button" value="Descartar" class="boton-redondo" id="omitirPoligono">
                        <input type="button" value="Borrar" class="boton-redondo" id="borrarPoligono">
                        <input type="button" value="Agregar" class="boton-redondo" id="agregarPoligono">
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">    
                        <input type="button" value="Dibujar Curvas" class="boton-redondo" id="curvas">
                        <input type="button" value="Guardar Curvas" class="boton-redondo" id="guardarCurvasP">
                        <input type="button" value="Cancelar" class="boton-redondo" id="cancelar">
                    </div>    
                </div>
                <div id="contenedorBotonesGrilla" style="display: none;">
                    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                        <label>Edicion de grilla</label>
                    </div>    
                    <select id="sAjustes">
                        <option disabled selected>Ajustes método de interpolación</option>
                        <option>Kriging</option>
                        <option>Inversa de la Distancia Ponderada (IDW)</option>
                        <option>Minimos Cuadrados Ajustados</option>
                        <option>RBF - Cantidad de vecinos</option>
                        <option>RBF - Gausiana</option>
                        <option>RBF - Multicuadratica / Inversa</option>
                    </select>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <label class="switch-vintage">
                            <label>Sel punto</label>
                            <input type="checkbox" id="checkSelpuntosGri" checked>
                            <span class="boton-vintage"></span>
                        </label>
                        <input type="button" value="Descartar" class="boton-redondo" id="omitirGrilla">
                        <input type="button" value="Borrar" class="boton-redondo" id="borrarGrilla">
                        <input type="button" value="Guardar Curvas" class="boton-redondo" id="guardarCurvasG">

                    </div>    
                </div>
                <div id="contenedorBotonesPunto" style ="display: none;">
                    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                        <label>Edicion de puntos</label>
                    </div>    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label class="switch-vintage">
                            <label>Sel punto</label>
                            <input type="checkbox" id="checkSelpuntosPto" checked>
                            <span class="boton-vintage"></span>
                        </label>
                        <input type="button" value="Descartar" class="boton-redondo" id="omitirPunto">
                        <input type="button" value="Borrar" class="boton-redondo" id="borrarPunto">
                        <input type="button" value="Deshacer" class="boton-redondo" id="deshacerPunto">
                    </div>    
                </div>
                <div class="ajuste" id="ajustesKriging">
                    <div class="texinput">
                        <label>Nugget:</label>
                        <input class="imput" type="number" step="0.1" id="nugget" value="0">
                    </div>
                    <div class="texinput">
                        <label>Rango:</label>
                        <input class="imput" type="number" step="1" id="rango" value="100">
                    </div>
                    <div style="display: flex;">
                        <label style="font-size: 12px;">Modelo:</label>
                        <div style="display: flex; justify-content: space-between; flex-grow: 1;">
                            <label style="font-size: 12px;"><input type="radio" name="modeloKriging" id="radio1" value="exponential" checked /> Exponencial</label>
                            <label style="font-size: 12px;"><input type="radio" name="modeloKriging" id="radio2" value="gaussian" /> Gausiano</label>
                            <label style="font-size: 12px;"><input type="radio" name="modeloKriging" id="radio3" value="spherical" /> Esférico</label>
                        </div>
                    </div>
                </div>
                <div class="ajuste" id="ajustesVecinos">
                    <div class="texinput">
                        <label>Vecinos:</label>
                        <input class="imput" type="number" step="1" id="vecinos" value="6">
                    </div>
                </div>
                <div class="ajuste" id="ajustesIDW">
                    <div class="texinput">
                        <label>Potencia:</label>
                        <input class="imput" type="number" step="1" id="potencia" value="2">
                    </div>
                </div>
                <div class="ajuste" id="ajustesMCA">
                    <div style="display: flex;">
                        <label style="font-size: 12px;">Grado:</label>
                        <div style="display: flex; flex-grow: 1;">
                            <label style="font-size: 12px;"><input type="radio" name="grado" id="grado1" value="1" checked /> 1</label>
                            <label style="font-size: 12px;"><input type="radio" name="grado" id="grado2" value="2" /> 2</label>
                        </div>
                    </div>
                </div>
                <div class="ajuste" id="ajustesRBFgausiana">
                    <div class="texinput">
                        <label style="width: 100px;">Ancho campana:</label>
                        <input class="imput" type="number" step="1" id="epsilon" value="1">
                    </div>
                </div>    
                <div class="ajuste" id="ajustesRBFmulticuadratica">
                    <div class="texinput">
                        <label style="width: 80px;">Parámetro:</label>
                        <input class="imput" type="number" step="1" id="parametro" value="1">
                    </div>
                </div>   
                <div id="divspinner" style="margin-top: 10px;">
                    <div id="loading-spinner" style="display: none;">
                        <div class="spinner"></div>
                    </div>
                </div>
                <div id="contenedorBotonesVolumen" style="display: none;">
                    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                        <label>Modelo 3D</label>
                    </div>
                    <div class="texinput" style="margin-top: 10px;">
                        <label for="factorZ" style="width: 150px; font-size: 15px; margin-right: 10px;">Factor de escala en Z</label>
                        <input type="number" step="1" id="factorZ" value="10" style="width: 40px">
                    </div>
                    <div class="lineaBotones">
                        <label class="switch-vintage">
                            <label>Malla de alambre</label>
                            <input type="checkbox" id="mallaAlambre" checked>
                            <span class="boton-vintage"></span>
                        </label>
                        <label class="switch-vintage">
                            <label>Plano de referencia</label>
                            <input type="checkbox" id="planoReferencia" checked>
                            <span class="boton-vintage"></span>
                        </label>
                    </div>
                    <div class="texinput" style="margin-top: 10px; justify-content: space-between;">
                        <label for="colorVolumen"  style="width: 150px; font-size: 15px; margin-right: 10px;">Color 3D</label>
                        <input id="colorVolumen" type="color" value="#808080" style="width: 40px">
                        <label for="colorPlano"  style="width: 150px; font-size: 15px; margin-right: 10px; margin-left: 20px;">Color Plano</label>
                        <input id="colorPlano" type="color" value="#00ff00" style="width: 40px">
                    </div>
                    <div style="display: inline-flex; margin-top: 10px;">
                        <label for="rangoLuzA" style="width: 150px; font-size: 15px; margin-right: 10px;">Luz Ambiental</label>
                        <input id="rangoLuzA" type="range" min="0.1" max="5" value="0.1" class="slider" step="0.1">                    
                    </div>
                    <div style="display: inline-flex; margin-top: 10px;">
                        <label for="rangoLuzD" style="width: 150px; font-size: 15px; margin-right: 10px;">Luz Direccional</label>
                        <input id="rangoLuzD" type="range" min="0.1" max="10" value="1" class="slider" step="0.1">                    
                    </div>
                    <div class="texinput" style="margin-top: 10px;">
                        <label for="toleranciaZ" style="width: 150px; font-size: 15px; margin-right: 10px;">Tolerancia</label>
                        <input type="number" step="0.01" min="0.01" id="toleranciaZ" value="0.30" style="width: 80px">
                        <input type="button" value="Piso" class="boton-redondo" id="piso">
                    </div>
                    <div class="texinput" style="margin-top: 10px;">
                        <label for="referenciaZ" style="width: 150px; font-size: 15px; margin-right: 10px;">Z de referencia</label>
                        <input type="number" step="0.1" id="referenciaZ" value="1" style="width: 80px">
                    </div>
                    <div style="display: inline-flex; margin-top: 10px;">
                        <label style="width: 150px; font-size: 15px;">Volumen sobre Z</label>
                        <label id="volumenSobre" class="punto"></label>
                    </div>
                    <div style="display: inline-flex; margin-top: 10px;">
                        <label style="width: 150px; font-size: 15px;">Volumen bajo Z</label>
                        <label id="volumenBajo" class="punto"></label>
                    </div>
                    <div style="display: inline-flex; margin-top: 10px;">
                        <label style="width: 150px; font-size: 15px;">Volumen total</label>
                        <label id="volumenTotal" class="punto"></label>
                    </div>
                </div>
            </div>
            <div id="divcanvaSuperior">
                <div id="divcanva">
                    <canvas id="lienzoPoligonos" width="500" height="500" class="lienzo"></canvas>
                    <canvas id="lienzoPuntos" width="500" height="500"  class="lienzo"></canvas>
                    <canvas id="lienzoCurvas" width="500" height="500" class="lienzo"></canvas>
                    <canvas id="lienzoGrilla" width="500" height="500" class="lienzo"></canvas>
                    <canvas id="lienzoAux" width="500" height="500" class="lienzo"></canvas>
                    <canvas id="lienzoVolumen" width="500" height="500"></canvas>
                </div>
            </div>
            <div class="grilla" style="width: 400px; margin-left: 2px;">
                <div style="display: flex; justify-content: center;">
                    <label>Opciones</label>
                </div>
                <div class="lineaBotones">
                    <label class="switch-vintage">
                        <label>Niveles</label>
                        <input type="checkbox" id="checkNiveles" checked>
                        <span class="boton-vintage"></span>
                    </label>
                    <label class="switch-vintage">
                        <label>Colores</label>
                        <input type="checkbox" id="checkColores" checked>
                        <span class="boton-vintage"></span>
                    </label>
                    <label class="switch-vintage">
                        <label>Tamaños</label>
                        <input type="checkbox" id="checkTamanos" checked>
                        <span class="boton-vintage"></span>
                    </label>
                    <input type="button" value="Guardar" class="boton-redondo" id="guardarOpciones">
                    <input type="button" value="Abrir" class="boton-redondo" id="abrirOpciones">
                </div>
                <div class="ajuste" id="ajustesNiveles">
                    <div class="grillaNiveles" id="contenedorGrillaNiveles">
                        <div class="header">Nivel</div>
                        <div class="header">Linea Px</div>
                        <div class="header">Color</div>  
                    </div>
                </div>    
                <div class="ajuste" id="ajustesColores">
                    <div class="grilla" id="contenedorColores">
                        <div class="header">Colores</div>
                        <div class="lingrilla">
                            <label for="colorRubber">Linea de seleccion de poligonos</label>
                            <input id="colorRubber" type="color" value="#0000FF" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorRect">Rectangulo de seleccion de puntos</label>
                            <input id="colorRect" type="color" value="#0000FF" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorPtoSel">Punto seleccionado</label>
                            <input id="colorPtoSel" type="color" value="#000000" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorVerSel">Vértice seleccionado</label>
                            <input id="colorVerSel" type="color" value="#FF0000" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorVertice">Vertice y poligonos adyacentes seleccionados</label>
                            <input id="colorVertice" type="color" value="#000000" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorPunto">Punto de la nube de puntos</label>
                            <input id="colorPunto" type="color" value="#FF0000" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorGrilla">Punto de la grilla</label>
                            <input id="colorGrilla" type="color" value="#777777" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorPoligono">Poligono</label>
                            <input id="colorPoligono" type="color" value="#777777" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="colorPoligonoSel">Poligono seleccionado</label>
                            <input id="colorPoligonoSel" type="color" value="#0000FF" onchange="cambioColor()">
                        </div>
                        <div class="lingrilla">
                            <label for="transparenciaPoligonoSel">Transparencia poligono seleccionado</label>
                            <input id="transparenciaPoligonoSel" type="number" step="0.1" value="0.5" onchange="cambioColor()">
                        </div>
                    </div>
                </div>    
                <div class="ajuste" id="ajustesTamanos">
                    <div class="grilla" id="contenedorTamanos">
                        <div class="header">Tamaños</div>
                        <div class="lingrilla">
                            <label for="tolerance">Tolerancia de cercania</label>
                            <input id="tolerance" type="number" step="0.1" value="5" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="scaleAmount">Factor de escalado del zoom</label>
                            <input id="scaleAmount" type="number" step="0.1" value="0.1" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxRubber">Linea de seleccion de poligonos</label>
                            <input id="pxRubber" type="number" step="0.1" value="2" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxRect">Linea de Rectangulo de seleccion de puntos</label>
                            <input id="pxRect" type="number" step="0.1" value="2" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxPtoSel">Diametro punto seleccionado</label>
                            <input id="pxPtoSel" type="number" step="0.1" value="3" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxVerSel">Diametro vertice seleccionado</label>
                            <input id="pxVerSel" type="number" step="0.1" value="3" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxVertice">Dimetro Vertice y adyacentes seleccionados</label>
                            <input id="pxVertice" type="number" step="0.1" value="3" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxPunto">Diametro punto de la nube de puntos</label>
                            <input id="pxPunto" type="number" step="0.1" value="2" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxGrilla">Diametro punto de la grilla</label>
                            <input id="pxGrilla" type="number" step="0.1" value="1" onchange="cambioTamano()">
                        </div>
                        <div class="lingrilla">
                            <label for="pxPoligono">Linea de poligonos</label>
                            <input id="pxPoligono" type="number" step="0.1" value="0.3" onchange="cambioTamano()">
                        </div>
                    </div>
                </div> 
                <div class="ajuste" id="abrirOpciones">
                    <label>Archivo de opciones</label>
                    <input type="file" id="file_opciones" accept=".xml" style='margin-left: 10px;'>
                </div>   
            </div> 
        </section>
        <section id="pie">
            <section id="archivo" class="contenedor" style="padding: 10px;">
                <input type="file" id="file_input" accept=".xls,.xlsx,.xlsm,.csv,.dxf" style='margin-left: 10px;'>
            </section>
            <section class="contenedor" id="controles" style="display: none; padding-bottom: 10px; padding-top: 10px;">
                <input type="button" value="Limpiar" id="limpiar" class="boton-redondo">
                <input type="button" value="Zoom 100%" class="boton-redondo" id="zoom">
                <input type="button" value="Grilla" id="selGrilla" class="boton-redondo">
                <input type="button" value="Triangulacion" id="selTriangulacion" class="boton-redondo">
                <input type="button" value="Volumen" id="selVolumen" class="boton-redondo">
                <select id="sGrilla" style="display: none; margin-left: 20px;">
                    <option disabled selected>Seleccione un método de interpolación</option>
                    <option>Vecino mas cercano</option>
                    <option>Bilineal</option>
                    <option>Bicubica</option> 
                    <option>Kriging</option>
                    <option>Thiessen</option>
                    <option>Spline Bicubico</option>
                    <option>Spline Bicuadratico</option>
                    <option>Minimos Cuadrados Ajustados</option>
                    <option>Inversa de la Distancia</option>
                    <option>Inversa de la Distancia Ponderada (IDW)</option>
                    <option>RBF - Bessel</option>
                    <option>RBF - Neumann</option>
                    <option>RBF - Gaussiana</option>
                    <option>RBF - Lineal</option>
                    <option>RBF - Exponencial</option>
                    <option>RBF - Cubica</option>
                    <option>RBF - Cuadratica</option>
                    <option>RBF - Multicuadratica</option>
                    <option>RBF - Multicuadratica Inversa</option>
                    <option>RBF - Thin Plate Spline</option>
                </select>
                <select id="sTriangulacion" style="display: none; margin-left: 20px;">
                    <option disabled selected>Seleccione un método de Triangulacion</option>
                    <option>Triangulacion de Delanuay</option>
                    <option>Poligonos de Voronoi</option> 
                </select>
                <select id="sCurvas" style="display: none; margin-left: 20px;">
                    <option disabled selected>Seleccione un método de Curvas de Nivel</option>
                    <option>Interpolación de Contornos</option> 
                    <option>Marching Squares</option> 
                    <option>Triangulos de Delanuay</option> 
                </select>
            </section>
            <section class="contenedor">
                <table id='torigen' style="margin-left: 20px;">
                </table>
            </section>
        </section>
    </body>
    <script src='./js/funcionesMdt.js'></script>
    <script src="./js/kriging.js"></script>
    <script src="./js/mdt.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dxf-parser@1.1.2/dist/dxf-parser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3-delaunay@6"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3@7.9.0"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.min.js" integrity="sha512-UxA96DnrUS08g7OSNzn0pV+il4lrdvuTpiPjLrmL9mKP1U7FoUtqMvSTjGCMnCKXE1ss3IQ4GBor3gS1WteN+w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    
    <script>
        function cargarScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(); // Resuelve la promesa cuando el script se carga
                script.onerror = () => reject(new Error(`Error al cargar el script ${src}`)); // Rechaza la promesa si hay un error
                document.body.appendChild(script);
            });
        }
    
        async function cargarDependencias() {
            if (!isWebGL2) {
                try {
                    // Cargar Three.js 0.128.0 si no se soporta WebGL2
                    console.log('Cargando Three.js versión 0.128.0...');
                    await cargarScript('https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js');
                    await cargarScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
                    
                    console.log('Version cargada: 128');
                    
                    // Aquí puedes llamar a las funciones que dependen de Three.js y OrbitControls
                    // Por ejemplo, inicializar la escena o cualquier otro código que dependa de los scripts cargados
                } catch (error) {
                    console.error('Error al cargar los scripts:', error);
                }
            } else {
                console.log('Version cargada: 170');
                // Aquí puedes hacer lo que necesitas para WebGL2
            }
        }
    
        // Llamada a la función para cargar los scripts y ejecutar la lógica
        cargarDependencias();
    </script>
</html>
