let lienzoPuntos;
let lienzoGrilla;
let lienzoCurvas;
let lienzoPoligonos;
let lienzoAux;
let lienzoVolumen;
let ctxPuntos;
let ctxGrilla;
let ctxCurvas;
let ctxPoligonos;
let ctxAux;
let nubePuntos=[];
let grilla=[];
let curva=[];
let poligono=[];
let selectedVertex = []; // Almacenar los vértices seleccionados de la triangulacion
var poligonosAdyacentes=[];
let puntosSeleccionados = []; // Almacenar puntos seleccionados de la triangulacion
let puntosSeleccionadosPto = []; // Almacenar puntos seleccionados de la nube de puntos
let puntosSeleccionadosGri = []; // Almacenar puntos seleccionados de la grilla
let niveles = [];
let zoomLevel = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let rubberBandStart = null;
let isDrawingLine = false;
let isDrawingRect = false;
let rectanguloStart = null;
let startX, startY;
let siPuntos = false;
let siGrilla = true;
let siCurvas = true;
let siPoligonos =true;
let selPunto = false;
let selPuntoPto = false;
let selPuntoGri = false;
// Declarar las funciónes fuera del alcance local
let seleccionarGrilla; 
let seleccionarTriangulacion;
let seleccionarCurva;
let seleccionarVertice;
let seleccionarPunto;
let manejarZoom; 
let iniciarArrastre;
let moverCanvas;
let detenerArrastre;
let abrirAjustes;
let esGrilla=0;
let mensaje=null;
//Variables de opciones
let tolerance;
let scaleAmount;
let colorRubber; 
let colorRect;
let colorPtoSel;
let colorVerSel;
let colorVertice;
let colorPunto;
let colorGrilla;
let colorPoligono;
let colorPoligonoSel;
let transparenciaPoligonoSel;
let pxRubber;
let pxRect;
let pxPtoSel;
let pxVerSel;
let pxVertice;
let pxPunto;
let pxGrilla;
let pxPoligono;
// variables globales de Volumen
let renderer=null;
let calcularVolumen = null;

document.addEventListener("DOMContentLoaded", function() {

    lienzoPuntos = document.getElementById('lienzoPuntos');
    lienzoGrilla = document.getElementById('lienzoGrilla');
    lienzoCurvas = document.getElementById('lienzoCurvas');
    lienzoPoligonos = document.getElementById('lienzoPoligonos');
    lienzoAux = document.getElementById('lienzoAux');
    lienzoVolumen = document.getElementById('lienzoVolumen');
    ctxPuntos=lienzoPuntos.getContext('2d');
    ctxPuntos.translate(0, lienzoPuntos.height);
    ctxPuntos.scale(1, -1);
    ctxAux=lienzoAux.getContext('2d');
    ctxAux.translate(0, lienzoAux.height);
    ctxAux.scale(1, -1);
    ctxGrilla=lienzoGrilla.getContext('2d');
    ctxGrilla.translate(0, lienzoGrilla.height);
    ctxGrilla.scale(1, -1);
    ctxCurvas=lienzoCurvas.getContext('2d');
    ctxCurvas.translate(0, lienzoCurvas.height);
    ctxCurvas.scale(1, -1);
    ctxPoligonos=lienzoPoligonos.getContext('2d');
    ctxPoligonos.translate(0, lienzoPoligonos.height);
    ctxPoligonos.scale(1, -1);

    document.getElementById('omitirPoligono').addEventListener('click', function(){omitirSeleccion('poligono')});
    document.getElementById('borrarPoligono').addEventListener('click',function(){borrarSeleccion('poligono')});
    document.getElementById('agregarPoligono').addEventListener('click',agregarPoligono);
    document.getElementById('curvas').addEventListener('click',curvasPoligonos);
    document.getElementById('guardarCurvasP').addEventListener('click',guardarCurvas);
    document.getElementById('cancelar').addEventListener('click',selTriangulacion);
    document.getElementById('omitirGrilla').addEventListener('click',function(){omitirSeleccion('grilla')});
    document.getElementById('borrarGrilla').addEventListener('click',selTriangulacion);
    document.getElementById('guardarCurvasG').addEventListener('click',guardarCurvas);
    document.getElementById('omitirPunto').addEventListener('click',function(){omitirSeleccion('punto')});
    document.getElementById('borrarPunto').addEventListener('click',function(){borrarSeleccion('punto')});
    document.getElementById('deshacerPunto').addEventListener('click',function(){deshacer('punto')});
    document.getElementById('guardarOpciones').addEventListener('click',guardarOpciones);
    document.getElementById('abrirOpciones').addEventListener('click',abrirOpciones);
    document.getElementById('limpiar').addEventListener('click',limpiar);
    document.getElementById('zoom').addEventListener('click',zoomNormal);
    document.getElementById('selGrilla').addEventListener('click',selGrilla);
    document.getElementById('selTriangulacion').addEventListener('click',selTriangulacion);
    document.getElementById('selVolumen').addEventListener('click',function(){selVolumen(10)});

    if (isWebGL2){
        document.getElementById('rangoLuzA').value="0.5";
        document.getElementById('rangoLuzD').value="5";
        document.getElementById('colorVolumen').value="#C0C0C0";
    }

    let oFileIn = document.getElementById('file_input');
    oFileIn.addEventListener('change', filePicked, false);
    mensaje = document.getElementById('mensaje');
    function filePicked(oEvent) {
        let oFile = oEvent.target.files[0];
        let extension = oFile.name.split('.').pop().toLowerCase();
        document.getElementById('nomArchivo').innerText = oFile.name;
        let reader = new FileReader();

        if (extension === "csv") {
            reader.onload = function(event) {
                let csv = event.target.result;
                let data = csv.split('\n').map(function(row) {
                    return row.split(',');
                });
                let table = document.getElementById('torigen');
                data.forEach(function(row) {
                    let fila = document.createElement('tr');
                    row.forEach(function(cell) {
                        var col = document.createElement('td');
                        col.innerText = parseFloat(cell).toString();
                        fila.appendChild(col);
                    });
                    table.appendChild(fila);
                });
                maxmin();
                afterTableFilled();
            };
            reader.readAsText(oFile);
        } else if (extension === "xls" || extension === "xlsx" || extension === "xlsm") {
            reader.onload = function(e) {
                let data = e.target.result;
                let workbook = XLSX.read(data, { type: 'binary' });

                workbook.SheetNames.forEach(function(sheetName) {
                    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                    let table = document.getElementById('torigen');
                    data.forEach(function(row) {
                        let fila = document.createElement('tr');
                        row.forEach(function(cell) {
                            if (cell !== "") {
                                let col = document.createElement('td');
                                col.innerText = cell;
                                fila.appendChild(col);
                            }
                        });
                        table.appendChild(fila);
                    });
                });
                maxmin();
                afterTableFilled();
            };
            reader.readAsBinaryString(oFile);
        } else if (extension === "dxf") {
            reader.onload = function(event) {
                let data = event.target.result;
                let parser = new DxfParser();
                try {
                    let dxf = parser.parseSync(data);
                    let table = document.getElementById('torigen');
                    dxf.entities.forEach(function(entity) {
                        let fila;
                        let lat, lon, h;
                        if (entity.type === 'POINT') {
                            fila = document.createElement('tr');
                            lat = document.createElement('td');
                            lon = document.createElement('td');
                            h = document.createElement('td');
                            lat.innerText = entity.position.x;
                            lon.innerText = entity.position.y;
                            h.innerText = entity.position.z;
                            fila.appendChild(lat);
                            fila.appendChild(lon);
                            fila.appendChild(h);
                            table.appendChild(fila);
                        } 
                    });
                    maxmin();
                    afterTableFilled();
                } catch (err) {
                    mensaje.textContent = "Error al procesar el archivo DXF.";
                }
            };
            reader.readAsText(oFile);
           
        } else {
            mensaje.textContent = "Formato de archivo no soportado.";
        }
        
        oFileIn.removeEventListener('change', filePicked, false);
        document.getElementById('archivo').style.display="none";
        document.getElementById('controles').style.display='flex';
    
        document.getElementById('checkPuntos').addEventListener('change',function(){
            if (this.checked) {
                siPuntos=false;
                ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
                if (esGrilla===1){
                    lienzoGrilla.style.zIndex=5
                    lienzoPoligonos.style.zIndex=2;
                    document.getElementById('contenedorBotonesGrilla').style.display='block';
                    document.getElementById('contenedorBotonesTriangulacion').style.display='none';
                }else if(esGrilla===2){
                    lienzoPoligonos.style.zIndex=5;
                    lienzoGrilla.style.zIndex=2;
                    document.getElementById('contenedorBotonesTriangulacion').style.display='block';
                    document.getElementById('contenedorBotonesGrilla').style.display='none';
                }
                lienzoCurvas.style.zIndex=3;
                lienzoPuntos.style.zIndex=4;
                document.getElementById('contenedorBotonesPunto').style.display='none';
            } else {
                siPuntos=true;
                lienzoPuntos.style.zIndex=5;
                lienzoCurvas.style.zIndex=4;
                lienzoGrilla.style.zIndex=3;
                lienzoPoligonos.style.zIndex=2;
                document.getElementById('contenedorBotonesGrilla').style.display='none';
                document.getElementById('contenedorBotonesTriangulacion').style.display='none';
                document.getElementById('contenedorBotonesPunto').style.display='block';
                verPuntos();
            }
            lienzoVolumen.style.zIndex=0;  
        },false);
        document.getElementById('checkGrilla').addEventListener('change',function(){
            if (this.checked) {
                siGrilla=false;
                ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
                ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
            } else {
                siGrilla=true;
                verGrilla(grilla);
            }
        },false);
        document.getElementById('checkCurvas').addEventListener('change',function(){
            if (this.checked) {
                siCurvas=false;
                ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
                if (esGrilla === 1){
                    lienzoGrilla.style.zIndex=5;
                    lienzoPoligonos.style.zIndex=2;
                }else if(esGrilla === 2){
                    lienzoPoligonos.style.zIndex=5;
                    lienzoGrilla.style.zIndex=2;
                }
                lienzoCurvas.style.zIndex=3;
                lienzoPuntos.style.zIndex=4;
            } else {
                siCurvas=true;
                lienzoCurvas.style.zIndex=5;
                lienzoPuntos.style.zIndex=4;
                lienzoGrilla.style.zIndex=3;
                lienzoPoligonos.style.zIndex=2;
                verCurvas(curva);
            }
        },false);
        document.getElementById('checkPoligonos').addEventListener('change',function(){
            if (this.checked) {
                siPoligonos=false;
                ctxPoligonos.clearRect(0, 0, lienzoPoligonos.width, lienzoPoligonos.height);
            } else {
                siPoligonos=true;
                verPoligonos(poligono);
            }
        },false);
        document.getElementById('checkSelpuntos').addEventListener('change',function(){
            if (this.checked) {
                selPunto=false;
            } else {
                selPunto=true;
            }
        },false);
        document.getElementById('checkSelpuntosPto').addEventListener('change',function(){
            if (this.checked) {
                selPuntoPto=false;
            } else {
                selPuntoPto=true;
            }
        },false);
        document.getElementById('checkSelpuntosGri').addEventListener('change',function(){
            if (this.checked) {
                selPuntoGri=false;
            } else {
                selPuntoGri=true;
            }
        },false);
        document.getElementById('checkNiveles').addEventListener('change',function(){
            document.getElementById('checkColores').checked=true;
            document.getElementById('checkTamanos').checked=true;
            document.getElementById('ajustesColores').style.display="none";
            document.getElementById('ajustesTamanos').style.display="none";
            if (this.checked) {
                document.getElementById('ajustesNiveles').style.display="none";
            } else {
                document.getElementById('ajustesNiveles').style.display="block";
            }
        },false);
        document.getElementById('checkColores').addEventListener('change',function(){
            document.getElementById('checkNiveles').checked=true;
            document.getElementById('checkTamanos').checked=true;
            document.getElementById('ajustesNiveles').style.display="none";
            document.getElementById('ajustesTamanos').style.display="none";
            if (this.checked) {
                document.getElementById('ajustesColores').style.display="none";
            } else {
                document.getElementById('ajustesColores').style.display="block";
            }
        },false);
        document.getElementById('checkTamanos').addEventListener('change',function(){
            document.getElementById('checkNiveles').checked=true;
            document.getElementById('checkColores').checked=true;
            document.getElementById('ajustesNiveles').style.display="none";
            document.getElementById('ajustesColores').style.display="none";
            if (this.checked) {
                document.getElementById('ajustesTamanos').style.display="none";
            } else {
                document.getElementById('ajustesTamanos').style.display="block";
            }
        },false);
        document.getElementById('nivel').addEventListener('change',function(){
            let nivel = parseInt(this.value);
            let zMin = parseFloat(document.getElementById('zmin').value);
            let zMax = parseFloat(document.getElementById('zmax').value);
            generarGrillaNiveles(zMin,zMax,nivel);
        });

        lienzoPoligonos.addEventListener('mousedown', seleccionarVertice);
        lienzoPoligonos.addEventListener('mousedown', iniciarArrastre);
        lienzoPoligonos.addEventListener('mousemove', moverCanvas);
        lienzoPoligonos.addEventListener('mouseup', detenerArrastre);
        lienzoPoligonos.addEventListener('wheel', manejarZoom);
        lienzoPoligonos.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Esto previene el menú contextual
        });

        lienzoGrilla.addEventListener('mousedown', seleccionarPunto);
        lienzoGrilla.addEventListener('mousedown', iniciarArrastre);
        lienzoGrilla.addEventListener('mousemove', moverCanvas);
        lienzoGrilla.addEventListener('mouseup', detenerArrastre);
        lienzoGrilla.addEventListener('wheel', manejarZoom);
        lienzoGrilla.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Esto previene el menú contextual
        });

        lienzoPuntos.addEventListener('mousedown', seleccionarPunto);
        lienzoPuntos.addEventListener('mousedown', iniciarArrastre);
        lienzoPuntos.addEventListener('mousemove', moverCanvas);
        lienzoPuntos.addEventListener('mouseup', detenerArrastre);
        lienzoPuntos.addEventListener('wheel', manejarZoom);
        lienzoPuntos.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Esto previene el menú contextual
        });
        document.getElementById('factorZ').addEventListener('change',setFactorZ);
        document.getElementById('mallaAlambre').addEventListener('change',setFactorZ);
        document.getElementById('planoReferencia').addEventListener('change',setFactorZ);
        document.getElementById('colorVolumen').addEventListener('change',setFactorZ);
        document.getElementById('colorPlano').addEventListener('change',setFactorZ);
        document.getElementById('rangoLuzA').addEventListener('change',setFactorZ);
        document.getElementById('rangoLuzD').addEventListener('change',setFactorZ);
        document.getElementById('referenciaZ').addEventListener('change',setFactorZ);
        document.getElementById('piso').addEventListener('click',calcularPiso);

        if(document.getElementById('checkPuntos').checked){
            verPuntos();
        }
        reader = null;
    }
});

function arraypuntos(){
    let dato = {
        x:0.0,
        y:0.0,
        z:0.0,
        i:0
    };
    let puntos=[];
    //generar array de puntos
    let tabla = document.getElementById('torigen');
    for (let i = 0; i < tabla.rows.length; i++) {
        let fila = tabla.rows[i];
        dato = {
            x: parseFloat(fila.cells[0].textContent),
            y: parseFloat(fila.cells[1].textContent),
            z: parseFloat(fila.cells[2].textContent),
            i: i
        };
        puntos.push(dato);
    }
    return puntos;
}

function lienzoarriba(){
    if (lienzoPuntos.style.zIndex === '5'){
        return lienzoPuntos;
    }else if(lienzoGrilla.style.zIndex === '5'){
        return lienzoGrilla;
    }else if(lienzoPoligonos.style.zIndex === '5'){
        return lienzoPoligonos;
    }else if(lienzoCurvas.style.zIndex === '5'){
        return lienzoCurvas;
    }
}

manejarZoom = function(event) {
    event.preventDefault();
    const lienzo=lienzoarriba();
    const wheel = event.deltaY < 0 ? 1 : -1;
    zoomLevel += wheel * scaleAmount;
    zoomLevel = Math.max(zoomLevel, 0.1);
    const rect = lienzo.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const correctedMouseY = lienzo.height - mouseY; 
    offsetX -= (mouseX - offsetX) * (wheel * scaleAmount);
    offsetY -= (correctedMouseY - offsetY) * (wheel * scaleAmount);
    if (siPuntos){verPuntos()}
    if (siGrilla){verGrilla(grilla)}
    if (siCurvas){verCurvas(curva)}
    if (siPoligonos){verPoligonos(poligono)}
};

function zoomNormal(){
    zoomLevel = 1;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    startX=0
    startY=0;
    if (siPuntos){verPuntos()}
    if (siGrilla){verGrilla(grilla)}
    if (siCurvas){verCurvas(curva)}
    if (siPoligonos){verPoligonos(poligono)}
}

iniciarArrastre = function(event) {
    event.preventDefault();
    const lienzo=lienzoarriba();
    if (event.button === 1) { // Botón central del ratón
        event.preventDefault();
        isDragging = true;
        const rect = lienzo.getBoundingClientRect();
        startX = event.clientX - offsetX;
        startY = (lienzo.height - (event.clientY - rect.top)) - offsetY; // Compensar la inversión del eje Y
        lienzo.style.cursor = 'move';
    }
};

moverCanvas = function(event) {
    if (isDragging) {
        const lienzo=lienzoarriba();
        const rect = lienzo.getBoundingClientRect();
        offsetX = event.clientX - startX;
        offsetY = (lienzo.height - (event.clientY - rect.top)) - startY; // Compensar la inversión del eje Y
        if (siPuntos){verPuntos()}
        if (siGrilla){verGrilla(grilla)}
        if (siCurvas){verCurvas(curva)}
        if (siPoligonos){verPoligonos(poligono)}
    }else if (isDrawingLine){
        const rect = lienzoPoligonos.getBoundingClientRect();
        dibujarRubberBandLinea(rubberBandStart, { x: event.clientX-rect.left, y: lienzoPoligonos.height-(event.clientY-rect.top) });
    }else if(isDrawingRect){
        const rect = lienzoPuntos.getBoundingClientRect();
        dibujarRectangulo(rectanguloStart, { x: event.clientX-rect.left, y: lienzoAux.height-(event.clientY-rect.top) });
    }
};

function dibujarRubberBandLinea(start, end) {
    ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height); // Limpiar el canvas antes de dibujar
    ctxAux.beginPath();
    ctxAux.moveTo(start.x, start.y);
    ctxAux.lineTo(end.x, end.y);
    ctxAux.strokeStyle = colorRubber;
    ctxAux.lineWidth = pxRubber;
    ctxAux.stroke();
    ctxAux.closePath();
}

function dibujarRectangulo(start,end){
    ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height); // Limpiar el canvas antes de dibujar
    ctxAux.beginPath();
    ctxAux.moveTo(start.x, start.y);
    ctxAux.lineTo(end.x, start.y);
    ctxAux.lineTo(end.x, end.y);
    ctxAux.lineTo(start.x, end.y);
    ctxAux.lineTo(start.x, start.y);
    ctxAux.closePath();
    ctxAux.lineWidth = 2;
    ctxAux.strokeStyle = "blue";
    ctxAux.stroke();
}

detenerArrastre = function(event) {
    if (event.button === 1){  //boton medio
        isDragging = false;
        let lienzo=lienzoarriba();
        lienzo.style.cursor = 'default';
    }
};

seleccionarPunto = function(event){
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    let lienzo=null;
    let ctx=null;
    let nube=[];
    let puntoSel=[];
    let puntoVintage=null;
    if (siPuntos){
        lienzo=lienzoPuntos;
        ctx=ctxPuntos;
        nube = nubePuntos;
        puntoVintage=selPuntoPto;
    }else{
        lienzo=lienzoGrilla;
        ctx=ctxAux;
        grilla.forEach(fila =>{
            fila.forEach(p => {
                if (p.z !== Infinity){
                    nube.push(p);
                }
            });
        });
        puntoVintage=selPuntoGri;
    }
    const canvasWidth = lienzo.width;
    const canvasHeight = lienzo.height;
    if (event.button === 0) { // Solo reaccionar al clic izquierdo
        const rect = lienzo.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const correctedMouseY = canvasHeight - mouseY; 
        if (event.ctrlKey){
            if (!isDrawingRect){
                //iniciar rectangulo
                rectanguloStart = {x: mouseX, y: correctedMouseY};
                isDrawingRect=true;
            }else{
                //finalizar rectuangulo
                const xMinR = Math.min(rectanguloStart.x, mouseX);
                const xMaxR = Math.max(rectanguloStart.x, mouseX);
                const yMinR = Math.min(rectanguloStart.y, correctedMouseY);
                const yMaxR = Math.max(rectanguloStart.y, correctedMouseY);
                const puntosDentroDelRectangulo = nube.filter(p =>
                    escalarX(p.x,canvasWidth,xMin,xMax) >= xMinR && escalarX(p.x,canvasWidth,xMin,xMax) <= xMaxR &&
                    escalarY(p.y,canvasHeight,yMin,yMax) >= yMinR && escalarY(p.y,canvasHeight,yMin,yMax) <= yMaxR
                    );
                isDrawingRect = false;
                puntosDentroDelRectangulo.forEach(p => {
                    if (siPuntos){
                        puntosSeleccionadosPto.push(p);
                    }else{
                        puntosSeleccionadosGri.push(p);
                    }
                });
                ctx.clearRect(0, 0, lienzo.width, lienzo.height);
                if (siPuntos){
                    verPuntos();
                }else{
                    verGrilla();
                }
            }
        }else{
            // Buscar si algún punto está cerca del clic
            nube.forEach(p => {
                let vx = escalarX(p.x,canvasWidth,xMin,xMax);
                let vy = escalarY(p.y,canvasHeight,yMin,yMax);
                if ( Math.abs(vx - mouseX) < tolerance && Math.abs(vy - correctedMouseY) < tolerance){
                    verDatosPunto(p);
                    if (puntoVintage){
                        if (siPuntos){
                            puntosSeleccionadosPto.push(p);
                        }else{
                            puntosSeleccionadosGri.push(p);
                        }
                        ctx.beginPath();
                        ctx.arc(vx, vy, pxPtoSel, 0, 2 * Math.PI);
                        ctx.fillStyle = colorPtoSel;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            });
        }
    }

}

seleccionarVertice = function(event) {
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    const canvasWidth = lienzoPoligonos.width;
    const canvasHeight = lienzoPoligonos.height;
    if (event.button === 0) { // Solo reaccionar al clic izquierdo
        const rect = lienzoPoligonos.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const correctedMouseY = canvasHeight - mouseY; 
        if (event.ctrlKey){
            if (!isDrawingLine){
                //iniciar rubber-band
                rubberBandStart = {x: mouseX, y: correctedMouseY};
                isDrawingLine=true;
            }else{
                //finalizar rubber-band
                isDrawingLine = false;
                // Verificar qué polígonos han sido cruzados por la línea
                const poligonosSeleccionados = poligono.filter((poligono) =>
                  poligonoCruzadoPorLinea(poligono.poligono, rubberBandStart, {x: mouseX, y: correctedMouseY},canvasHeight,canvasWidth,xMin,xMax,yMin,yMax)
                );
                poligonosAdyacentes = [...poligonosAdyacentes, ...poligonosSeleccionados.map(p => p.indice)];
            }
        }else{
            // Buscar si algún vértice está cerca del clic
            let clickedVertex = false;
            let verticesel;
            poligono.forEach((poligono) => {
                poligono.poligono.forEach((vertice) => {
                    let vx = escalarX(vertice.x,canvasWidth,xMin,xMax);
                    let vy = escalarY(vertice.y,canvasHeight,yMin,yMax);
                    if ( Math.abs(vx - mouseX) < tolerance && Math.abs(vy - correctedMouseY) < tolerance){
                        if (!clickedVertex){
                            clickedVertex=true;
                            verticesel=vertice;
                            verDatosPunto(vertice);
                            if (selPunto){
                                puntosSeleccionados.push(vertice);
                            }else{
                                selectedVertex.push(vertice);    
                            }
                        }
                        if (!selPunto){
                            poligonosAdyacentes.push(poligono.indice)
                        }
                    }
                })
            })
            if (clickedVertex) {
                ctxAux.beginPath();
                if (selPunto){
                    ctxAux.arc(escalarX(verticesel.x,lienzoAux.width,xMin,xMax), escalarY(verticesel.y,lienzoAux.height,yMin,yMax), pxVerSel, 0, 2 * Math.PI);
                    ctxAux.fillStyle = colorVerSel;
                }else{
                    ctxAux.arc(escalarX(verticesel.x,lienzoAux.width,xMin,xMax), escalarY(verticesel.y,lienzoAux.height,yMin,yMax), pxVertice, 0, 2 * Math.PI);
                    ctxAux.fillStyle = colorVertice;
                }
                ctxAux.fill();
                ctxAux.closePath();
            }else{
                //buscar si un lado esta cerca del click
                let i = 0;
                for (let i=0; i < poligono.length; i++) {
                    let lados = poligonoLados(poligono[i].poligono,canvasHeight,canvasWidth,xMin,xMax,yMin,yMax);
                    //calcular envolventeConvexa
                    let polenv = [];
                    lados.forEach(lado => {
                        polenv.push({x: lado[0].x, y: lado[0].y, z: lado[0].z});
                        polenv.push({x: lado[1].x, y: lado[1].y, z: lado[1].z})
                    });
                    if (puntoDentro(mouseX,correctedMouseY,polenv)) {
                        // Calcular la distancia desde el mouse a cada lado del triángulo
                        for (let j=0; j < lados.length; j++) {
                            const distancia = distanciaDesdePuntoALinea(mouseX, correctedMouseY, lados[j][0], lados[j][1]);
                            if (distancia < tolerance){
                                poligonosAdyacentes.push(poligono[i].indice);
                                j=lados.length;
                                i=poligono.length;
                            }                        
                        }
                    }
                }    
            }
        }
        verPoligonosAdyacentes(xMin,xMax,yMin,yMax);
    }else if(event.button === 2){ //botton derecho
        /*
        if (selectedVertex.length === 3){
                //agregar triangulo
                var trianglesArray = Array.from(triangles);
                trianglesArray.push(selectedVertex[0].i);
                trianglesArray.push(selectedVertex[1].i);
                trianglesArray.push(selectedVertex[2].i);
                selectedVertex=[];
                triangles = new Uint32Array(trianglesArray);
                dibujarTriangulos();
        }
        */
    }
}

function verDatosPunto(punto){
    document.getElementById("xpunto").innerText = punto.x.toFixed(2);
    document.getElementById("ypunto").innerText = punto.y.toFixed(2);
    document.getElementById("zpunto").innerText = punto.z.toFixed(2);
}

function poligonoLados(poligono,canvasHeight,canvasWidth,xMin,xMax,yMin,yMax){
    const ladosPoligono=[];
    // Definir los lados del poligono
    for (let i = 0; i < poligono.length; i++) {
        const puntoActual = {x: escalarX(poligono[i].x,canvasWidth,xMin,xMax), y: escalarY(poligono[i].y,canvasHeight,yMin,yMax), z: poligono[i].z};
        const ii = (i + 1) % poligono.length;
        const puntoSiguiente = {x: escalarX(poligono[ii].x,canvasWidth,xMin,xMax), y: escalarY(poligono[ii].y,canvasHeight,yMin,yMax), z: poligono[ii].z};
        ladosPoligono.push([puntoActual, puntoSiguiente, poligono[i], poligono[ii]]);
    }
    return ladosPoligono;
}

function poligonoCruzadoPorLinea(poligono, start, end,canvasHeight,canvasWidth,xMin,xMax,yMin,yMax){
    const ladosPoligono = poligonoLados(poligono,canvasHeight,canvasWidth,xMin,xMax,yMin,yMax);
    // Verificar si algún lado del polígono intersecta con la línea de rubber-band
    for (const lado of ladosPoligono) {
      if (interseccion(lado[0], lado[1], start, end)) {
        return true;
      }
    }
    return false;
}

function omitirSeleccion(tipo){
    switch (tipo){
        case 'poligono': 
            ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
            puntosSeleccionados=[];
            selectedVertex=[];
            poligonosAdyacentes=[];
            break;
        case 'punto':
            puntosSeleccionadosPto=[];
            verPuntos();
            break;
        case 'grilla':
            puntosSeleccionadosGri=[];
            verGrilla();
            break;
        case 'curva':
            break;
    }
}

function deshacer(tipo){
    switch (tipo){
        case 'poligono': 
            break;
        case 'punto':
            if (nubePuntos.length>0){
                puntosSeleccionadosPto=[];
                nubePuntos=[];
                maxmin();
                verPuntos();
            }
            break;
        case 'grilla':
            break;
        case 'curva':
            break;
    }
}

function borrarSeleccion(tipo){
    switch (tipo){
        case 'poligono': 
            ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
            poligono = poligono.filter(p => !poligonosAdyacentes.includes(p.indice));
            for(let i=0; i<poligono.length;i++){
                poligono[i].indice=i;
            }
            puntosSeleccionados=[];
            selectedVertex=[];
            poligonosAdyacentes=[];
            verPoligonos(poligono);
            break;
        case 'punto':
            ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
            nubePuntos = nubePuntos.filter(pNube => 
                !puntosSeleccionadosPto.some(pSel => pSel.i === pNube.i)
            );
            for(let i=0; i<nubePuntos.length;i++){
                nubePuntos[i].i=i;
            }
            puntosSeleccionadosPto=[];
            if (nubePuntos.length>0){
                maxmin();
            }
            break;
        case 'grilla':
            const ptoselSet = new Set(puntosSeleccionadosGri.map(p => `${p.x},${p.y}`));
            grilla.forEach(fila => {
                fila.forEach(punto => {
                    const key = `${punto.x},${punto.y}`;
                    if (ptoselSet.has(key)) {
                        punto.z = Infinity;
                    }
                });
            });
            puntosSeleccionadosGri=[];
            verGrilla(grilla);
            break;
        case 'curva':
            break;
    }
}

function agregarPoligono(){
    if (puntosSeleccionados.length===2){
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);
        const l1 = puntosSeleccionados[0];
        const l2 = puntosSeleccionados[1];
        const canvasWidth = lienzoPoligonos.width;
        const canvasHeight = lienzoPoligonos.height;
        const p1 = {x: escalarX(l1.x,canvasWidth,xMin,xMax), y: escalarY(l1.y,canvasHeight,yMin,yMax), z: l1.z}
        const p2 = {x: escalarX(l2.x,canvasWidth,xMin,xMax), y: escalarY(l2.y,canvasHeight,yMin,yMax), z: l2.z}
        const poligonosSeleccionados = poligono.filter((poligono) =>
            poligonoCruzadoPorLinea(poligono.poligono, p1, p2,canvasHeight,canvasWidth,xMin,xMax,yMin,yMax)
        );
        poligonosAdyacentes = [...poligonosAdyacentes, ...poligonosSeleccionados.map(p => p.indice)];
        //Obtener los lados no cortados por la linea p1-p2 a ambos lados de la linea
        let triangulos=[];
        poligonosAdyacentes.forEach(indice => {
            const poligonoEncontrado = poligono.find(p => p.indice === indice);
            triangulos.push(poligonoEncontrado.poligono);
        });
        let ladosL2=[] , ladosL1=[];
        for (let i = 0; i < triangulos.length; i++) {
            const triangulo = triangulos[i];
            const [p1, p2, p3] = triangulo;
            //ver que lados son cortados por la linea l1,l2
            let p1p2 = interseccion(p1, p2, l1, l2);
            let p2p3 = interseccion(p2, p3, l1, l2);
            let p3p1 = interseccion(p3, p1, l1, l2);
            let puntoComun;
            let lado=[];
            //si dos lados son cortados ver de que lado de la linea esta el lado no cortado
            if (p1p2 && p2p3){ // lado no cortado p3p1
                puntoComun = p2;
                lado=[p3,p1];
            }else if(p1p2 && p3p1){ //lado no cortado p2p3
                puntoComun = p1;
                lado=[p2,p3];
            }else if(p2p3 && p3p1){  //lado no cortado p1p2
                puntoComun = p3;
                lado=[p1,p2];
            }else{  // solo hay un lado cortado
                puntoComun = null;
                //determinar si contiene a l1 o l2
                if (p1===l1){
                    if (calcularDistancia(l1,p2) < calcularDistancia(l1,p3)){
                        ladosL1.push([p2,l1]);
                    }else{
                        ladosL1.push([p3,l1]);
                    }
                }else if(p2===l1){
                    if (calcularDistancia(l1,p1) < calcularDistancia(l1,p3)){
                        ladosL1.push([p1,l1]);
                    }else{
                        ladosL1.push([p3,l1])
                    }    
                }else if(p3 === l1){
                    if (calcularDistancia(l1,p1) < calcularDistancia(l1,p2)){
                        ladosL1.push([p1,l1]);
                    }else{
                        ladosL1.push([p2,l1]);
                    }
                }else if (p1===l2){
                    if (calcularDistancia(l2,p2) < calcularDistancia(l2,p3)){
                        ladosL2.push([p2,l2]);
                    }else{
                        ladosL2.push([p3,l2]);
                    }
                }else if(p2===l2){
                    if (calcularDistancia(l2,p1) < calcularDistancia(l2,p3)){
                        ladosL2.push([p1,l2]);
                    }else{
                        ladosL2.push([p3,l2])
                    }    
                }else if(p3 === l2){
                    if (calcularDistancia(l2,p1) < calcularDistancia(l2,p2)){
                        ladosL2.push([p1,l2]);
                    }else{
                        ladosL2.push([p2,l2]);
                    }
                }
            }
            
            // ver de que lado de la linea l1l2 cae el punto comun
            if (puntoComun){
                // Calcular el determinante para determinar el lado
                const determinante = (l2.x - l1.x) * (puntoComun.y - l1.y) - (l2.y - l1.y) * (puntoComun.x - l1.x);
                if (determinante > 0){
                    ladosL2.push(lado);
                }else{
                    ladosL1.push(lado);
                }
            }
        }
        //Borrar los triangulos seleccionados
        poligono = poligono.filter(p => !poligonosAdyacentes.includes(p.indice));
        for(let i=0; i<poligono.length;i++){
            poligono[i].indice=i;
        }
        
        poligonosAdyacentes=[];
     
        //agregar triangulos desde l1 a cada lado de ladosA
        // comprobar el primer triangulo de ladosA
        ladosL1.forEach(lado => {
            const p1=lado[0];
            const p2=lado[1];
            const triangulo = [l2,p1,p2];
            let dato = {
                indice: poligono.length,
                poligono: triangulo
            }
            poligono.push(dato);
        })
        ladosL2.forEach(lado => {
            const p1=lado[0];
            const p2=lado[1];
            const triangulo = [l1,p1,p2];
            let dato = {
                indice: poligono.length,
                poligono: triangulo
            }
            poligono.push(dato);
        })

    }else{
        let dato = {
            indice: poligono.length,
            poligono: puntosSeleccionados
        }
        poligono.push(dato);
    }
    puntosSeleccionados=[];
    verPoligonos(poligono);
}

function curvasPoligonos(){
    mostrarSpinner();
    setTimeout(() => {
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);
        curva=[];
        niveles.forEach((nivel, nivelIndex) => {
            let polilinea=[];
            poligono.forEach(p => {
                let lados=poligonoLados(p.poligono,lienzoCurvas.height,lienzoCurvas.width,xMin,xMax,yMin,yMax);
                let puntosInterseccion=[];
                lados.forEach(lado =>{
                    puntosInterseccion.push(interpolarNivel(lado[2],lado[3],nivel.nivel))
                });
                puntosInterseccion=puntosInterseccion.filter(p => p !== null)            
                if (puntosInterseccion.length > 1) {
                    // Ordenar puntos si es necesario (opcional dependiendo del contexto)
                    puntosInterseccion.sort((a, b) => a.x - b.x);
        
                    for (let i = 0; i < puntosInterseccion.length - 1; i++) {
                        // Crear segmento entre puntos consecutivos
                        let segmento = [puntosInterseccion[i],puntosInterseccion[i + 1]];
                        polilinea.push(segmento);
                    }
                }
            });    
            curva.push({ nivel: nivelIndex, polilinea: polilinea });
        });
        if (siCurvas && curva.length>0){
            verCurvas(curva);
        }
        ocultarSpinner(); 
    },100);    
}

function ocultarAjustes(){
    const ajustes = document.querySelectorAll('.ajuste');
    ajustes.forEach(ajuste => {
        ajuste.style.display = 'none';
    });
}

abrirAjustes = function(){
    ocultarAjustes();
    switch (event.target.value) {
        case 'Kriging':
            document.getElementById('ajustesKriging').style.display="block";
            break;
        case 'Inversa de la Distancia Ponderada (IDW)':
            document.getElementById('ajustesIDW').style.display="block";
            break;
        case 'Minimos Cuadrados Ajustados':    
            document.getElementById('ajustesVecinos').style.display="block";
            document.getElementById('ajustesMCA').style.display="block";
            break;
        case 'RBF - Cantidad de vecinos':
            document.getElementById('ajustesVecinos').style.display="block";
            break;
        case 'RBF - Gausiana':
            document.getElementById('ajustesVecinos').style.display="block";
            document.getElementById('ajustesRBFgausiana').style.display="block";
            break;
        case 'RBF - Multicuadratica / Inversa':
            document.getElementById('ajustesVecinos').style.display="block";
            document.getElementById('ajustesRBFmulticuadratica').style.display="block";
            break;
    }
}

function limpiar(){
    location.reload();
}

function selGrilla(){
//    nubePuntos=arraypuntos();
    esGrilla=1;
    siPuntos=false;
    siPoligonos=false;
    siGrilla=true;
    poligono=[];
    curva=[];
    poligonosAdyacentes=[];
    selectedVertex=[];
    puntosSeleccionados=[];
    puntosSeleccionadosPto=[];
    grilla=[];
    let sgrilla = document.getElementById('sGrilla');
    let sajustes = document.getElementById('sAjustes');
    sgrilla.style.display='flex';
    document.getElementById('nombreGrilla').innerText="";
    document.getElementById('nombreCurva').innerText="";
    document.getElementById('mensaje').innerText="";
    document.getElementById('checkPuntos').checked=true;
    document.getElementById('sTriangulacion').style.display='none';  
    document.getElementById('lienzoVolumen').style.zIndex=0;  
    document.getElementById('lienzoPoligonos').style.zIndex=2;
    document.getElementById('lienzoCurvas').style.zIndex=3;
    document.getElementById('lienzoPuntos').style.zIndex=4;
    document.getElementById('lienzoGrilla').style.zIndex=5;
    document.getElementById('checkPoligonos').checked=true;
    document.getElementById('checkGrilla').checked=false;
    document.getElementById('checkNiveles').checked=true;
    document.getElementById('checkColores').checked=true;
    document.getElementById('checkTamanos').checked=true;
    document.getElementById('interruptores').style.display='flex';
    document.getElementById('contenedorBotonesTriangulacion').style.display='none';
    document.getElementById('contenedorBotonesVolumen').style.display='none';
    document.getElementById('contenedorBotonesPunto').style.display='none';
    document.getElementById('contenedorBotonesGrilla').style.display='block';
    ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
    ctxPoligonos.clearRect(0, 0, lienzoPoligonos.width, lienzoPoligonos.height);
    ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
    ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
    ctxAux.clearRect(0,0,lienzoAux.width, lienzoAux.height);
    sgrilla.selectedIndex = 0;
    sajustes.selectedIndex = 0;
    sgrilla.addEventListener('change',seleccionarGrilla);
    sajustes.addEventListener('change',abrirAjustes);
    ocultarAjustes();
    liberarLienzoVolumen();
}

function selTriangulacion(){
//    nubePuntos=arraypuntos();
    esGrilla=2;
    siPuntos=false;
    siPoligonos=true;
    siGrilla=false;
    poligono=[];
    curva=[];
    poligonosAdyacentes=[];
    selectedVertex=[];
    puntosSeleccionados=[];
    puntosSeleccionadosPto=[];
    grilla=[];
    let striangulacion = document.getElementById('sTriangulacion');
    striangulacion.style.display='flex';
    document.getElementById('nombreGrilla').innerText="";
    document.getElementById('nombreCurva').innerText="";
    document.getElementById('mensaje').innerText="";
    document.getElementById('checkPuntos').checked=true;
    document.getElementById('sGrilla').style.display='none';
    document.getElementById('sCurvas').style.display='none';
    document.getElementById('lienzoPoligonos').style.zIndex=5;
    document.getElementById('lienzoVolumen').style.zIndex=0;  
    document.getElementById('lienzoGrilla').style.zIndex=2;
    document.getElementById('lienzoCurvas').style.zIndex=3;
    document.getElementById('lienzoPuntos').style.zIndex=4;
    document.getElementById('checkGrilla').checked=true;
    document.getElementById('checkPoligonos').checked=false;
    document.getElementById('checkNiveles').checked=true;
    document.getElementById('checkColores').checked=true;
    document.getElementById('checkTamanos').checked=true;
    document.getElementById('interruptores').style.display='flex';
    document.getElementById('contenedorBotonesTriangulacion').style.display='block';
    document.getElementById('contenedorBotonesGrilla').style.display='none';
    document.getElementById('contenedorBotonesPunto').style.display='none';
    document.getElementById('contenedorBotonesVolumen').style.display='none';
    ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
    ctxPoligonos.clearRect(0, 0, lienzoPoligonos.width, lienzoPoligonos.height);
    ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
    ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
    ctxAux.clearRect(0,0,lienzoAux.width, lienzoAux.height);
    striangulacion.selectedIndex=0;
    striangulacion.addEventListener('change',seleccionarTriangulacion)
    ocultarAjustes();
    liberarLienzoVolumen();
}

function verPuntos(){
    const canvasWidth=lienzoPuntos.width;
    const canvasHeight=lienzoPuntos.height;
    ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
    ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    nubePuntos.forEach(dato => {
        let xCanvas = escalarX(dato.x,canvasWidth,xMin,xMax);
        let yCanvas = escalarY(dato.y,canvasWidth,yMin,yMax);
        if (esVisiblePunto({x: xCanvas, y: yCanvas})){
            ctxPuntos.beginPath();
            ctxPuntos.arc(xCanvas, yCanvas, pxPunto, 0, 2 * Math.PI);
            ctxPuntos.closePath();
            ctxPuntos.fillStyle = colorPunto;
            ctxPuntos.fill();
        }
    });
    puntosSeleccionadosPto.forEach(p => {
        let xCanvas = escalarX(p.x,canvasWidth,xMin,xMax);
        let yCanvas = escalarY(p.y,canvasWidth,yMin,yMax);
        ctxPuntos.beginPath();
        ctxPuntos.arc(xCanvas, yCanvas, pxPtoSel, 0, 2 * Math.PI);
        ctxPuntos.closePath();
        ctxPuntos.fillStyle = colorPtoSel;
        ctxPuntos.fill();
    });
}

function verGrilla(nubeDePuntos = []){
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    if(nubeDePuntos.length>0){
        const canvasWidth=lienzoGrilla.width;
        const canvasHeight=lienzoGrilla.height;
        ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
        nubeDePuntos.forEach(dato => {
            dato.forEach(fila => {
                // Configuración de los círculos (puedes cambiar el color y estilo)
                if(fila.z !== Infinity){
                    let xCanvas = escalarX(fila.x,canvasWidth,xMin,xMax);
                    let yCanvas = escalarY(fila.y,canvasHeight,yMin,yMax);
                    if (esVisiblePunto({x: xCanvas, y: yCanvas})){
                        ctxGrilla.beginPath();
                        ctxGrilla.arc(xCanvas, yCanvas, pxGrilla, 0, 2 * Math.PI);
                        ctxGrilla.closePath();
                        ctxGrilla.fillStyle = colorGrilla;
                        ctxGrilla.fill();
                    }
                }
            });
        });
    }
    ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
    if (puntosSeleccionadosGri.length>0){
        puntosSeleccionadosGri.forEach(p => {
            let xCanvas = escalarX(p.x,lienzoAux.width,xMin,xMax);
            let yCanvas = escalarY(p.y,lienzoAux.height,yMin,yMax);
            ctxAux.beginPath();
            ctxAux.arc(xCanvas, yCanvas, pxPtoSel, 0, 2 * Math.PI);
            ctxAux.closePath();
            ctxAux.fillStyle = colorPtoSel;
            ctxAux.fill();
        });
    }
}

function verCurvas(curva) {
    if(curva.length>0){
        const canvasWidth = lienzoCurvas.width;
        const canvasHeight = lienzoCurvas.height;
        ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);
        for (let index=0; index <= curva.length-1;index++){
            let nivelIndex = curva[index].nivel;
            ctxCurvas.beginPath(); // Empezar una nueva línea
            ctxCurvas.strokeStyle = niveles[nivelIndex].color;
            ctxCurvas.lineWidth = niveles[nivelIndex].px;
            // Dibujar la polilínea de la curva de nivel
            let polilinea = curva[index].polilinea;
            for (let i=0; i <= polilinea.length-1; i++){
                let segmento = polilinea[i];
                let xCanvas0 = escalarX(segmento[0].x,canvasWidth,xMin,xMax);
                let yCanvas0 = escalarY(segmento[0].y,canvasHeight,yMin,yMax);
                let xCanvas1 = escalarX(segmento[1].x,canvasWidth,xMin,xMax);
                let yCanvas1 = escalarY(segmento[1].y,canvasHeight,yMin,yMax);
                if (esVisibleSegmento({x: xCanvas0, y: yCanvas0},{x: xCanvas1, y: yCanvas1})){
                    ctxCurvas.moveTo(xCanvas0, yCanvas0); // Mover al primer punto
                    ctxCurvas.lineTo(xCanvas1, yCanvas1); // Dibujar hasta el siguiente punto
                    ctxCurvas.stroke();
                }
            }
            ctxPuntos.closePath();
            //   ACA PONER FUNCION PARA AGREGAR ETIQUETAS DE NIVEL A LAS CURVAS
        }
    }
}

function verPoligonos(poligonos){
    // Función para dibujar un lado entre dos puntos
    function dibujarLado(p1, p2) {
        ctxPoligonos.strokeStyle = colorPoligono;
        ctxPoligonos.lineWidth = pxPoligono;
        ctxPoligonos.beginPath();
        ctxPoligonos.moveTo(p1.x, p1.y);
        ctxPoligonos.lineTo(p2.x, p2.y);
        ctxPoligonos.stroke();
        ctxPuntos.closePath();
    }
    if (poligonos.length > 0){
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);
        const canvasWidth = lienzoPoligonos.width;
        const canvasHeight = lienzoPoligonos.height;
        ctxPoligonos.clearRect(0, 0, canvasWidth, canvasHeight);
        ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
        poligonos.forEach(poligono => {
            // Escalar los puntos
            const poligonoEscalado = poligono.poligono.map(p => ({
                x: escalarX(p.x,canvasWidth,xMin,xMax),
                y: escalarY(p.y,canvasHeight,yMin,yMax)
            }));
            if (esVisiblePoligono(poligonoEscalado)){
                for (i=0;i<poligonoEscalado.length-1;i++){
                    dibujarLado(poligonoEscalado[i],poligonoEscalado[i+1]);
                }
                dibujarLado(poligonoEscalado[poligonoEscalado.length-1],poligonoEscalado[0]);
            }
        });
        if (poligonosAdyacentes.length>0){
            verPoligonosAdyacentes(xMin,xMax,yMin,yMax);
        }
    }
}

function verPoligonosAdyacentes(xMin,xMax,yMin,yMax){
    poligonosAdyacentes = eliminarRepetidos(poligonosAdyacentes);
    ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
    poligonosAdyacentes.forEach(indice => {
        const poligonoEncontrado = poligono.find(p => p.indice === indice);
        const poligonoEnc = poligonoEncontrado.poligono;
        const poligonoEsc = poligonoEnc.map(p => ({
            x: escalarX(p.x,lienzoAux.width,xMin,xMax),
            y: escalarY(p.y,lienzoAux.height,yMin,yMax)
        }));
        ctxAux.beginPath();
        ctxAux.moveTo(poligonoEsc[0].x, poligonoEsc[0].y);
        for (let i = 1; i < poligonoEsc.length; i++) {
            ctxAux.lineTo(poligonoEsc[i].x, poligonoEsc[i].y);
        }
        ctxAux.closePath();
        const color = hexToRgb(colorPoligonoSel);
        ctxAux.fillStyle = `rgba(${color}, ${transparenciaPoligonoSel})`;
        ctxAux.fill();
    });
    if (selectedVertex.length > 0){
        selectedVertex.forEach(vertice =>{
            ctxAux.beginPath();
            ctxAux.arc(escalarX(vertice.x,lienzoAux.width,xMin,xMax), escalarY(vertice.y,lienzoAux.height,yMin,yMax), pxVerSel, 0, 2 * Math.PI);
            ctxAux.closePath();
            ctxAux.fillStyle = colorVerSel;
            ctxAux.fill();
        })
    }
    if (puntosSeleccionados.length>0){
        puntosSeleccionados.forEach(vertice =>{
            ctxAux.beginPath();
            ctxAux.arc(escalarX(vertice.x,lienzoAux.width,xMin,xMax), escalarY(vertice.y,lienzoAux.height,yMin,yMax), pxPtoSel, 0, 2 * Math.PI);
            ctxAux.closePath();
            ctxAux.fillStyle = colorPtoSel;
            ctxAux.fill();
        })
    }
}

function maxmin(){
    if (nubePuntos.length===0){
        nubePuntos=arraypuntos();
    }
    let xMin = nubePuntos[0].x, xMax = nubePuntos[0].x;
    let yMin = nubePuntos[0].y, yMax = nubePuntos[0].y;
    let zMin = nubePuntos[0].z, zMax = nubePuntos[0].z;

    // Recorremos los puntos para actualizar los extremos
    nubePuntos.forEach(punto => {
        if (punto.x < xMin) xMin = punto.x;
        if (punto.x > xMax) xMax = punto.x;
        if (punto.y < yMin) yMin = punto.y;
        if (punto.y > yMax) yMax = punto.y;
        if (punto.z < zMin) zMin = punto.z;
        if (punto.z > zMax) zMax = punto.z;
    });
    document.getElementById('referenciaZ').value=zMin.toFixed(2);
    const nivel = contarNiveles(zMin,zMax);
    //cargar los inputs
    document.getElementById('xmin').value=xMin.toFixed(2);
    document.getElementById('xmax').value=xMax.toFixed(2);
    document.getElementById('ymin').value=yMin.toFixed(2);
    document.getElementById('ymax').value=yMax.toFixed(2);
    document.getElementById('zmin').value=zMin.toFixed(2);
    document.getElementById('zmax').value=zMax.toFixed(2);
    document.getElementById('paso').value=1;
    document.getElementById('nivel').value=nivel
    cambioColor();
    cambioTamano();
    generarGrillaNiveles(zMin,zMax,nivel);
    let verpto = document.getElementById('checkPuntos').checked; 
    if (!verpto){
        document.getElementById('contenedorBotonesPunto').style.display='block';
        lienzoPuntos.style.zIndex = 5;
        lienzoGrilla.style.zIndex = 4;
        lienzoPoligonos.style.zIndex = 3;
        lienzoCurvas.style.zIndex = 2;
        siPuntos=true;
        verPuntos();
    }
}

function afterTableFilled() {
    if (siPuntos) {
        verPuntos();
    }
}

// Escalado de coordenadas x, y
function escalarX(x, canvasWidth,minX,maxX) {
    return ((x - minX) / (maxX - minX)) * canvasWidth * zoomLevel + offsetX;
}

function escalarY(y, canvasHeight,minY,maxY) {
    return ((y - minY) / (maxY - minY)) * canvasHeight * zoomLevel + offsetY;
}

function desescalarX(xEscalado, canvasWidth, minX, maxX) {
    return ((xEscalado - offsetX) / (canvasWidth * zoomLevel)) * (maxX - minX) + minX;
}

function desescalarY(yEscalado, canvasHeight, minY, maxY) {
    return ((yEscalado - offsetY) / (canvasHeight * zoomLevel)) * (maxY - minY) + minY;
}

function esVisiblePunto(p1) {
    return (
        (p1.x >= 0 && p1.x <= lienzoGrilla.width && p1.y >= 0 && p1.y <= lienzoGrilla.height)
    );
}

function esVisibleSegmento(p1,p2){
    return (
        (p1.x >= 0 && p1.x <= lienzoGrilla.width && p1.y >= 0 && p1.y <= lienzoGrilla.height) &&
        (p2.x >= 0 && p2.x <= lienzoGrilla.width && p2.y >= 0 && p2.y <= lienzoGrilla.height)
    )
}

function esVisiblePoligono(poligono) {
    canvasWidth=lienzoPoligonos.width;
    canvasHeight=lienzoPoligonos.height;
    let visible=true;
    for (let i=0;i<poligono.length;i++) {
        if (poligono[i].x > canvasWidth || poligono[i].y > canvasHeight || poligono[i].x <=0 || poligono[i].y <=0) {
            visible=false;
            break;
        }
    };
    return visible;
}

seleccionarGrilla = function(event) {
    mostrarSpinner();
    setTimeout(() => {
        ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);
        let zMin = parseFloat(document.getElementById('zmin').value);
        let zMax = parseFloat(document.getElementById('zmax').value);
        let paso = parseFloat(document.getElementById('paso').value);
        let envolventeConvexa = calcularEnvolventeConvexa(nubePuntos);
        // Calcula el número de filas y columnas basado en el paso
        let filas = Math.ceil((yMax - yMin) / paso) + 1;
        let columnas = Math.ceil((xMax - xMin) / paso) + 1;
        let vecinos;
        grilla = [];
        // Generar la grilla con valores de z=0
        for (let i = 0; i < filas; i++) {
            let fila = [];
            let y = yMin + i * paso;
            for (let j = 0; j < columnas; j++) {
                let x = xMin + j * paso;
                fila.push({ x: x, y: y, z: Infinity });
            }
            grilla.push(fila);
        }
        const metodo =event.target.value;
        document.getElementById('nombreGrilla').innerText=metodo; 
        switch (metodo) {
            case 'Vecino mas cercano':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            let punto = puntosCercanos(nubePuntos,puntoGrilla,1);
                            let puntoC = punto[0];
                            puntoGrilla.z = puntoC.z;
                        }
                    });    
                });    
                break;
            case 'Bilineal':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if (puntoDentro(puntoGrilla.x, puntoGrilla.y, envolventeConvexa)){
                            let puntos = puntosCercanosCuadrangulo(nubePuntos,puntoGrilla.x,puntoGrilla.y);
                            if (puntos.length === 4){
                                puntoGrilla.z = interpolarBilineal(puntos[0],puntos[1],puntos[2],puntos[3],puntoGrilla.x,puntoGrilla.y); 
                                if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                    puntoGrilla.z = Infinity;
                                }
                            }    
                        }
                    });
                });
                break;
            case 'Bicubica':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            let puntos = puntosCercanos(nubePuntos,puntoGrilla,16);
                            if (puntos.length === 16){
                                puntoGrilla.z = interpolarBicubica(puntos,puntos[0].x,puntos[0].y,puntoGrilla.x,puntoGrilla.y,false); 
                                if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                    puntoGrilla.z = Infinity;
                                }
                            }
                        }
                    });
                });
                break;
            case 'Spline Bicubico':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            let puntos = puntosCercanos(nubePuntos,puntoGrilla,16);
                            if (puntos.length === 16){
                                puntoGrilla.z = interpolarBicubica(puntos,puntos[0].x,puntos[0].y,puntoGrilla.x,puntoGrilla.y,true); 
                                if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                    puntoGrilla.z = Infinity;
                                }
                            }
                        }
                    });
                });
                break;
            case 'Kriging':
                let nugget = parseInt(document.getElementById('nugget').value);
                let rango = parseInt(document.getElementById('rango').value);
                let modelo = document.querySelector('input[name="modeloKriging"]:checked').value;
                let vecX = [];
                let vecY = [];
                let vecZ = [];
                nubePuntos.forEach(dato => {
                    vecX.push(dato.x);
                    vecY.push(dato.y);
                    vecZ.push(dato.z);
                });
                // Calcular el modelo Kriging
                let variogram = kriging.train(vecZ, vecX, vecY, modelo, nugget, rango);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = kriging.predict(puntoGrilla.x, puntoGrilla.y, variogram);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'Thiessen':
                const delaunay = d3.Delaunay.from(nubePuntos, d => d.x, d => d.y);
                let triangulos = delaunay.triangles;
                let voronoi = calcularVoronoi(nubePuntos,triangulos);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionThiessen(nubePuntos, voronoi, puntoGrilla);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'Spline Bicuadratico':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            let puntos = puntosCercanos(nubePuntos,puntoGrilla,16);
                            if (puntos.length === 16){
                                puntoGrilla.z = InterpolarSplineBicuadratico(puntos,puntos[0].x,puntos[0].y,puntoGrilla.x,puntoGrilla.y); 
                                if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                    puntoGrilla.z = Infinity;
                                }
                            }
                        }
                    });
                });
                break;
            case 'Minimos Cuadrados Ajustados':
                vecinos = parseInt(document.getElementById('vecinos').value);
                let grado = parseInt(document.querySelector('input[name="grado"]:checked').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = minimosCuadradosAjustados(nubePuntos,puntoGrilla,vecinos,grado);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'Inversa de la Distancia':
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionInversaDistancia(nubePuntos,puntoGrilla);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'Inversa de la Distancia Ponderada (IDW)': 
                let potencia = parseInt(document.getElementById('potencia').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = idwInterpolation(nubePuntos,puntoGrilla,potencia);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Bessel': 
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,1);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
            break;
            case 'RBF - Neumann':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,2);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Gaussiana':
                vecinos = parseInt(document.getElementById('vecinos').value);
                let epsilon = parseInt(document.getElementById('epsilon').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,epsilon,3);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Lineal':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,4);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Exponencial':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,5);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Cubica':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,6);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Cuadratica':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,7);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Multicuadratica':
                vecinos = parseInt(document.getElementById('vecinos').value);
                let parametro = parseInt(document.getElementById('epsilon').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,parametro,8);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Multicuadratica Inversa':
                vecinos = parseInt(document.getElementById('vecinos').value);
                let param = parseInt(document.getElementById('epsilon').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,param,9);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
            case 'RBF - Thin Plate Spline':
                vecinos = parseInt(document.getElementById('vecinos').value);
                grilla.forEach(fila =>{
                    fila.forEach(puntoGrilla =>{
                        if(puntoDentro(puntoGrilla.x,puntoGrilla.y,envolventeConvexa)){
                            puntoGrilla.z = interpolacionRBF(nubePuntos, puntoGrilla,vecinos,0,10);
                            if (puntoGrilla.z < zMin || puntoGrilla.z > zMax){
                                puntoGrilla.z = Infinity;
                            }
                        }
                    });
                });
                break;
        }
        
        if (siGrilla && grilla.length>0){
            verGrilla(grilla);
        }
        ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);

        let scurvas = document.getElementById('sCurvas');
        let sgrilla = document.getElementById('sGrilla');
        let sajustes = document.getElementById('sAjustes');
        scurvas.style.display="inline-block";
        scurvas.selectedIndex = 0;
        sgrilla.selectedIndex = 0;
        sajustes.selectedIndex = 0;
        scurvas.addEventListener('change',seleccionarCurva);
        ocultarSpinner();
        ocultarAjustes();
    }, 100); 
}

seleccionarCurva = function(event){
    mostrarSpinner();
    setTimeout(() => {
        ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
        const metodo = event.target.value;
        document.getElementById('nombreCurva').innerText=metodo;
        curva = [];
        switch (metodo) {
            case 'Interpolación de Contornos':
                curva=interpolacionContornos(niveles);
                break;
            case 'Marching Squares':
                curva=MarchingSquares(niveles);
                break;
            case 'Triangulos de Delanuay':
                curva=triangulacionDelanuay(niveles);
                break;
        }
        if (siCurvas && curva.length>0){
            verCurvas(curva);
        }
        ocultarSpinner(); 
        var scurvas = document.getElementById('sCurvas')
        scurvas.selectedIndex = 0;
    }, 100);   
}

seleccionarTriangulacion = function(event){
    mostrarSpinner();
    setTimeout(() => {
        ctxAux.clearRect(0, 0, lienzoAux.width, lienzoAux.height);
        ctxPoligonos.clearRect(0, 0, lienzoPoligonos.width, lienzoPoligonos.height);
        ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
        selectedVertex=[];
        poligonosAdyacentes=[];
        curva=[];
        const metodo = event.target.value;
        document.getElementById('nombreGrilla').innerText=metodo;
        poligono = [];
        switch (metodo) {
            case 'Triangulacion de Delanuay':
                poligono=triangulosDelaunay();
                break;
            case 'Poligonos de Voronoi':
                poligono=poligonosDeVoronoi();
                break;
        }
        if (siPoligonos && poligono.length>0){
            verPoligonos(poligono);
        }
        ocultarSpinner(); 
        let striangulacion = document.getElementById('sTriangulacion');
        striangulacion.selectedIndex = 0;
    },100);    
}

function MarchingSquares(contornos){
    let curvasDeNivel = [];
    const numFilas = grilla.length;
    const numColumnas = grilla[0].length;
    contornos.forEach((nivel,nivelIndex) => {
        let polilinea = [];
        for (let i = 0; i < numFilas - 1; i++) {
            for (let j = 0; j < numColumnas - 1; j++) {
                // Puntos de la celda en la grilla
                const p1 = grilla[i][j];         // Esquina superior izquierda
                const p2 = grilla[i][j + 1];     // Esquina superior derecha
                const p3 = grilla[i + 1][j + 1]; // Esquina inferior derecha
                const p4 = grilla[i + 1][j];     // Esquina inferior izquierda
                // Omite las celdas que tienen puntos con z = Infinity
                if ([p1.z, p2.z, p3.z, p4.z].includes(Infinity)) continue;
                // Generar la clave de la celda de 4 bits según si los puntos están por encima o por debajo del nivel
                let clave = 0;
                if (p1.z >= nivel.nivel) clave |= 1; // Bit 0
                if (p2.z >= nivel.nivel) clave |= 2; // Bit 1
                if (p3.z >= nivel.nivel) clave |= 4; // Bit 2
                if (p4.z >= nivel.nivel) clave |= 8; // Bit 3
                // Determinar los puntos de intersección según la clave de Marching Squares
                let puntosInterseccion = [];
                switch (clave) {
                    case 1: case 14:
                        puntosInterseccion.push(interpolarNivel(p1, p4, nivel.nivel), interpolarNivel(p1, p2,nivel.nivel));
                        break;
                    case 2: case 13:
                        puntosInterseccion.push(interpolarNivel(p1, p2, nivel.nivel), interpolarNivel(p2, p3, nivel.nivel));
                        break;
                    case 3: case 12:
                        puntosInterseccion.push(interpolarNivel(p1, p4, nivel.nivel), interpolarNivel(p2, p3, nivel.nivel));
                        break;
                    case 4: case 11:
                        puntosInterseccion.push(interpolarNivel(p2, p3, nivel.nivel), interpolarNivel(p3, p4, nivel.nivel));
                        break;
                    case 5:
                        puntosInterseccion.push(interpolarNivel(p1, p2, nivel.nivel), interpolarNivel(p2, p3, nivel.nivel));
                        puntosInterseccion.push(interpolarNivel(p1, p4, nivel.nivel), interpolarNivel(p3, p4, nivel.nivel));
                        break;
                    case 6: case 9:
                        puntosInterseccion.push(interpolarNivel(p1, p2, nivel.nivel), interpolarNivel(p3, p4, nivel.nivel));
                        break;
                    case 7: case 8:
                        puntosInterseccion.push(interpolarNivel(p1, p4, nivel.nivel), interpolarNivel(p3, p4, nivel.nivel));
                        break;
                    case 10:
                        puntosInterseccion.push(interpolarNivel(p1, p4, nivel.nivel), interpolarNivel(p2, p3, nivel.nivel));
                        break;
                    default:
                        // Casos 0 y 15 no tienen intersecciones
                        break;
                }
                // Si hay dos o más intersecciones, guardar el segmento en el arreglo
                if (puntosInterseccion.length >= 2) {
                    for (let k = 0; k < puntosInterseccion.length; k += 2) {
                        polilinea.push([puntosInterseccion[k], puntosInterseccion[k + 1]]);
                    }
                }
            }
        }
        curvasDeNivel.push({ nivel: nivelIndex, polilinea: polilinea});        
    });
    return curvasDeNivel;
}

function interpolacionContornos(contornos){
    let curvasDeNivel = [];
    const numFilas = grilla.length;
    const numColumnas = grilla[0].length;
    contornos.forEach((nivel,nivelIndex) => {
        let polilinea = [];
        for (let i = 0; i < numFilas - 1; i++) {
            for (let j = 0; j < numColumnas - 1; j++) {
                // Puntos de la celda en la grilla
                const p1 = grilla[i][j];
                const p2 = grilla[i][j + 1];
                const p3 = grilla[i + 1][j + 1];
                const p4 = grilla[i + 1][j];
                // Omite las celdas que tienen puntos con z = Infinity
                if ([p1.z, p2.z, p3.z, p4.z].includes(Infinity)) continue;
                // Encontrar intersecciones en los lados de la celda
                const puntosInterseccion = [
                    interpolarNivel(p1, p2, nivel.nivel),
                    interpolarNivel(p2, p3, nivel.nivel),
                    interpolarNivel(p3, p4, nivel.nivel),
                    interpolarNivel(p4, p1, nivel.nivel)
                ].filter(p => p !== null);
                // Si hay dos intersecciones, agregar el segmento a la polilinea
                if (puntosInterseccion.length === 2) {
                    polilinea.push(
                        [puntosInterseccion[0], puntosInterseccion[1]]
                    );
                }
            }
        }
        curvasDeNivel.push({ nivel: nivelIndex, polilinea: polilinea });        
    });
    return curvasDeNivel;
}


function triangulacionDelanuay(contornos){
    const numFilas = grilla.length;
    const numColumnas = grilla[0].length;
    let puntos = [];
    for (let i=0;i<=numFilas-1;i++){
        for (let j=0;j<=numColumnas-1;j++){
            let p=grilla[i][j];
            if (p.z !== Infinity) {
                puntos.push(p);
            }
        }
    }
    const delaunay = d3.Delaunay.from(puntos, d => d.x, d => d.y);
    let triangulos = delaunay.triangles;
    let curvasDeNivel = [];
    contornos.forEach((nivel,nivelIndex) => {
        let polilinea = [];
        triangulos.forEach((_, i) => {
            if (i % 3 === 0) {
                const a = puntos[triangulos[i]];
                const b = puntos[triangulos[i + 1]];
                const c = puntos[triangulos[i + 2]];
                // Interpolar en los bordes del triángulo para este nivel
                const puntosInterseccion = [
                    interpolarNivel(a, b, nivel.nivel),
                    interpolarNivel(b, c, nivel.nivel),
                    interpolarNivel(c, a, nivel.nivel)
                ].filter(p => p !== null);
                // Si hay exactamente dos intersecciones, formar un segmento
                if (puntosInterseccion.length === 2) {
                    polilinea.push([puntosInterseccion[0], puntosInterseccion[1]]);
                }
            }
        });
        // Agregar la polilinea de este nivel a las curvas de nivel
        if (polilinea.length > 0) {
            curvasDeNivel.push({ nivel: nivelIndex, polilinea: polilinea });
        }
    });
    return curvasDeNivel;
}

function poligonosDeVoronoi(){
    const delaunay = d3.Delaunay.from(nubePuntos, d => d.x, d => d.y);
    let triangulos = delaunay.triangles;
    let voronoi = calcularVoronoi(nubePuntos,triangulos);
    let poligonos=[];
    voronoi.forEach(poligono => {
        poligonos.push(poligono);
    })
    return poligonos;
}

function triangulosDelaunay(){
    const delaunay = d3.Delaunay.from(nubePuntos, d => d.x, d => d.y);
    let triangulos = delaunay.triangles
    var indice=0;
    let poligonos=[];
    triangulos.forEach((_, i) => {
        if (i % 3 === 0) {
            const p1 = nubePuntos[triangulos[i]];
            const p2 = nubePuntos[triangulos[i + 1]];
            const p3 = nubePuntos[triangulos[i + 2]];
            poligonos.push({
                indice: indice,
                poligono: [p1,p2,p3]
            });
            indice++;
        }
    });
    return poligonos;
}

function cambioColor(){
    colorRubber = document.getElementById('colorRubber').value; 
    colorRect = document.getElementById('colorRect').value;
    colorPtoSel = document.getElementById('colorPtoSel').value;
    colorVerSel = document.getElementById('colorVerSel').value;
    colorVertice = document.getElementById('colorVertice').value;
    colorPunto = document.getElementById('colorPunto').value;
    colorGrilla = document.getElementById('colorGrilla').value;
    colorPoligono = document.getElementById('colorPoligono').value;
    colorPoligonoSel = document.getElementById('colorPoligonoSel').value;
    transparenciaPoligonoSel = parseFloat(document.getElementById('transparenciaPoligonoSel').value);    
}

function cambioTamano(){
    tolerance = parseFloat(document.getElementById('tolerance').value);
    scaleAmount = parseFloat(document.getElementById('scaleAmount').value);
    pxRubber = parseFloat(document.getElementById('pxRubber').value);
    pxRect = parseFloat(document.getElementById('pxRect').value);
    pxPtoSel = parseFloat(document.getElementById('pxPtoSel').value);
    pxVerSel = parseFloat(document.getElementById('pxVerSel').value);
    pxVertice = parseFloat(document.getElementById('pxVertice').value);
    pxPunto = parseFloat(document.getElementById('pxPunto').value);
    pxGrilla = parseFloat(document.getElementById('pxGrilla').value);
    pxPoligono = parseFloat(document.getElementById('pxPoligono').value);
}

function guardarOpciones(){

    let variables = {
        colorRubber: colorRubber, 
        colorRect: colorRect,
        colorPtoSel: colorPtoSel,
        colorVerSel: colorVerSel,
        colorVertice: colorVertice,
        colorPunto: colorPunto,
        colorGrilla: colorGrilla,
        colorPoligono: colorPoligono,
        colorPoligonoSel: colorPoligonoSel,
        transparenciaPoligonoSel: transparenciaPoligonoSel,
        tolerance: tolerance,
        scaleAmount: scaleAmount,
        pxRubber: pxRubber,
        pxRect: pxRect,
        pxPtoSel: pxPtoSel,
        pxVerSel: pxVerSel,
        pxVertice: pxVertice,
        pxPunto: pxPunto,
        pxGrilla: pxGrilla,
        pxPoligono: pxPoligono    
    };
    // Crea un documento XML
    let xmlDoc = document.implementation.createDocument("", "", null);
    let root = xmlDoc.createElement("variables");

    // Añade cada variable como un elemento XML
    for (let [name, value] of Object.entries(variables)) {
        let variableElement = xmlDoc.createElement("variable");

        // Añade el nombre y el valor como atributos
        variableElement.setAttribute("name", name);
        variableElement.setAttribute("value", value);

        // Añade el elemento al nodo raíz
        root.appendChild(variableElement);
    }

    xmlDoc.appendChild(root);

    // Convierte el XML en una cadena
    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);

    //Grabar en disco
    const blob = new Blob([xmlString], { type: "application/xml" });

    // Crea un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mdtopciones.xml";

    // Simula el clic para iniciar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpia el objeto URL y elimina el enlace del DOM
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);

}

function abrirOpciones(){
    document.getElementById('abrirOpciones').style.display='block';
    let archivoIn = document.getElementById('file_opciones'); 
    archivoIn.addEventListener('change', filePickedOpciones, false);
    mensaje = document.getElementById('mensaje');
    function filePickedOpciones(oEvent) {
        let archivoXml = oEvent.target.files[0];

        const reader = new FileReader();
        // Define la función que se ejecutará cuando el archivo se haya leído
        reader.onload = function(event) {
            const xmlString = event.target.result; // Obtiene el contenido del archivo
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            let variables = {};
            // Obtener todos los elementos <variable>
            let variableElements = xmlDoc.getElementsByTagName("variable");
            for (let variable of variableElements) {
                // Lee los atributos "name" y "value"
                let name = variable.getAttribute("name");
                let value = variable.getAttribute("value");
                // Añade al objeto variables
                variables[name] = value;
            }
            colorRubber=variables.colorRubber; 
            colorRect=variables.colorRect;
            colorPtoSel=variables.colorPtoSel;
            colorVerSel=variables.colorVerSel;
            colorVertice=variables.colorVertice;
            colorPunto=variables.colorPunto;
            colorGrilla=variables.colorGrilla;
            colorPoligono=variables.colorPoligono;
            colorPoligonoSel=variables.colorPoligonoSel;
            transparenciaPoligonoSel=variables.transparenciaPoligonoSel;
            tolerance=variables.tolerance;
            scaleAmount=variables.scaleAmount;
            pxRubber=variables.pxRubber;
            pxRect=variables.pxRect;
            pxPtoSel=variables.pxPtoSel;
            pxVerSel=variables.pxVerSel;
            pxVertice=variables.pxVertice;
            pxPunto=variables.pxPunto;
            pxGrilla=variables.pxGrilla;
            pxPoligono=variables.pxPoligono;    
            document.getElementById('colorRubber').value=colorRubber;
            document.getElementById('colorRect').value=colorRect;
            document.getElementById('colorPtoSel').value=colorPtoSel;
            document.getElementById('colorVerSel').value=colorVerSel;
            document.getElementById('colorVertice').value=colorVertice;
            document.getElementById('colorPunto').value=colorPunto;
            document.getElementById('colorGrilla').value=colorGrilla;
            document.getElementById('colorPoligono').value=colorPoligono;
            document.getElementById('colorPoligonoSel').value=colorPoligonoSel;
            document.getElementById('transparenciaPoligonoSel').value=transparenciaPoligonoSel;
            document.getElementById('tolerance').value=tolerance;
            document.getElementById('scaleAmount').value=scaleAmount;
            document.getElementById('pxRubber').value=pxRubber;
            document.getElementById('pxRect').value=pxRect;
            document.getElementById('pxPtoSel').value=pxPtoSel;
            document.getElementById('pxVerSel').value=pxVerSel;
            document.getElementById('pxVertice').value=pxVertice;
            document.getElementById('pxPunto').value=pxPunto;
            document.getElementById('pxGrilla').value=pxGrilla;
            document.getElementById('pxPoligono').value=pxPoligono;    
            document.getElementById('abrirOpciones').style.display='none';
        };
        // Lee el archivo como texto
        reader.readAsText(archivoXml);
    }    
}

function guardarCurvas(){
    if (curva.length > 0) {
        let nomArchivo = "curvas.dxf";
        //let dxfContent = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

        let dxfContent = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n`;
        // Agregar capas a la tabla de capas
        dxfContent += `0\nTABLE\n2\nLAYER\n`;
        niveles.forEach((nivel, index) => {
            const capa = nivel.nivel;
            const { r, g, b } = hexToRgb(nivel.color, false);
            const dxfColor = rgbToDxfColor(r, g, b);

            dxfContent += `0\nLAYER\n2\n${capa}\n70\n0\n62\n${dxfColor}\n6\nCONTINUOUS\n`; // Define la capa con color y nombre
        });
        dxfContent += `0\nENDTAB\n0\nENDSEC\n`;

        // Agregar bloques y entidades
        dxfContent += `0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;

        curva.forEach(contour => {
            const { nivel, polilinea } = contour;
            const capa = niveles[nivel].nivel;
            const color = niveles[nivel].color;
            const pxLinea = niveles[nivel].px;
            // Obtén el código de color DXF desde hexadecimal
            const { r, g, b } = hexToRgb(color,false)
            const dxfColor = rgbToDxfColor(r, g, b);
            
            // Crea cada polilínea en una capa con color y grosor
            //dxfContent += `0\nLAYER\n2\n${capa}\n62\n${dxfColor}\n`;  // Color de la capa
            
            polilinea.forEach(segmento => {
                const startPoint=segmento[0];
                const endPoint=segmento[1];
                dxfContent += `0\nLINE\n8\n${capa}\n62\n256\n370\n0\n`;
                dxfContent += `10\n${startPoint.x}\n20\n${startPoint.y}\n30\n${startPoint.z}\n`; // Punto inicial
                dxfContent += `11\n${endPoint.x}\n21\n${endPoint.y}\n31\n${endPoint.z}\n`; // Punto final
            });
        });

        dxfContent += `0\nENDSEC\n0\nEOF\n`;

        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nomArchivo;

        // Simula el clic para iniciar la descarga
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    }
}

function rgbToDxfColor(r, g, b){
    const dxfColorIndex = [
        { r: 0, g: 0, b: 0 },       // Color index 0: Black
        { r: 255, g: 0, b: 0 },     // Color index 1: Red
        { r: 255, g: 255, b: 0 },   // Color index 2: Yellow
        { r: 0, g: 255, b: 0 },     // Color index 3: Green
        { r: 0, g: 255, b: 255 },   // Color index 4: Cyan
        { r: 0, g: 0, b: 255 },     // Color index 5: Blue
        { r: 255, g: 0, b: 255 },   // Color index 6: Magenta
        { r: 255, g: 255, b: 255 }, // Color index 7: White
        { r: 128, g: 128, b: 128 }, // Color index 8: Gray
        { r: 192, g: 192, b: 192 }, // Color index 9: Light Gray
        // Agrega más colores según sea necesario hasta el índice 255
    ];
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    dxfColorIndex.forEach((color, index) => {
        const distance = Math.sqrt(
            Math.pow(color.r - r, 2) +
            Math.pow(color.g - g, 2) +
            Math.pow(color.b - b, 2)
        );
        
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
        }
    });

    return nearestIndex;
}

function selVolumen(facEsc){
    zoomLevel = 1;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    startX=0
    startY=0;

    mensaje = document.getElementById('mensaje');
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    const vertices = [];
    switch(esGrilla){
        case 0: { //nubePuntos
            //escalar los puntos
            const puntosEscalados = nubePuntos.map(p => ({
                x: escalarX(p.x,lienzoVolumen.width,xMin,xMax),
                y: escalarY(p.y,lienzoVolumen.height,yMin,yMax),
                z: p.z * facEsc
            }));

            const delaunay = d3.Delaunay.from(puntosEscalados, d => d.x, d => d.y);
            let triangulos = delaunay.triangles

            // Agrega los triángulos a la geometría.
            for (let i = 0; i < triangulos.length; i += 3) {
                const idx1 = triangulos[i];
                const idx2 = triangulos[i + 1];
                const idx3 = triangulos[i + 2];
                
                const p1 = puntosEscalados[idx1];
                const p2 = puntosEscalados[idx2];
                const p3 = puntosEscalados[idx3];
                
                // Agrega los vértices de cada triángulo en la geometría.
                vertices.push(p1.x, p1.y, p1.z);
                vertices.push(p2.x, p2.y, p2.z);
                vertices.push(p3.x, p3.y, p3.z);
            }
            break;
        }
        case 1: { //grilla
            if (grilla.length){
                const numFilas = grilla.length;
                const numColumnas = grilla[0].length;
                let puntos = [];
                for (let i=0;i<=numFilas-1;i++){
                    for (let j=0;j<=numColumnas-1;j++){
                        let p=grilla[i][j];
                        if (p.z !== Infinity) {
                            puntos.push(p);
                        }
                    }
                }
                const puntosEscalados = puntos.map(p => ({
                    x: escalarX(p.x,lienzoVolumen.width,xMin,xMax),
                    y: escalarY(p.y,lienzoVolumen.height,yMin,yMax),
                    z: p.z * facEsc
                }));
    
                const delaunay = d3.Delaunay.from(puntosEscalados, d => d.x, d => d.y);
                let triangulos = delaunay.triangles;
                // Agrega los triángulos a la geometría.
                for (let i = 0; i < triangulos.length; i += 3) {
                    const idx1 = triangulos[i];
                    const idx2 = triangulos[i + 1];
                    const idx3 = triangulos[i + 2];
                    
                    const p1 = puntosEscalados[idx1];
                    const p2 = puntosEscalados[idx2];
                    const p3 = puntosEscalados[idx3];
                    
                    // Agrega los vértices de cada triángulo en la geometría.
                    vertices.push(p1.x, p1.y, p1.z);
                    vertices.push(p2.x, p2.y, p2.z);
                    vertices.push(p3.x, p3.y, p3.z);
                }
            }
            break;
        }
        case 2: { //poligono
            if (poligono.length>0){
                // Recorre cada polígono en el arreglo escalando los puntos
                let poligonoEscalado=[];
                poligono.forEach(({indice,poligono}) => {
                    let poli= [];
                    poligono.forEach(p => {
                        dato={
                            x: escalarX(p.x,lienzoVolumen.width,xMin,xMax),
                            y: escalarY(p.y,lienzoVolumen.height,yMin,yMax),
                            z: p.z * facEsc
                        }
                        poli.push(dato)
                    });
                    poligonoEscalado.push({indice: indice,poligono: poli});
                });

                poligonoEscalado.forEach(({ indice, poligono }) => {
                if (poligono.length < 3) return; // Necesitamos al menos tres puntos para formar un triángulo

                // Usamos el primer punto como el vértice de referencia
                const p0 = poligono[0];

                // Generar triángulos para cada par consecutivo de puntos en el polígono
                for (let i = 1; i < poligono.length - 1; i++) {
                    const p1 = poligono[i];
                    const p2 = poligono[i + 1];

                    // Añadir los vértices del triángulo a la geometría

                    vertices.push(p0.x, p0.y, p0.z);
                    vertices.push(p1.x, p1.y, p1.z);
                    vertices.push(p2.x, p2.y, p2.z);
                }
                });
            }
            break;
        }
    }
    if (vertices.length>0){
        document.getElementById('interruptores').style.display='none';
        document.getElementById('sGrilla').style.display='none';
        document.getElementById('sCurvas').style.display='none';
        document.getElementById('sTriangulacion').style.display='none';
        document.getElementById('contenedorBotonesPunto').style.display='none';
        document.getElementById('contenedorBotonesTriangulacion').style.display='none';
        document.getElementById('contenedorBotonesGrilla').style.display='none';
        document.getElementById('contenedorBotonesVolumen').style.display='block';
        ctxPoligonos.clearRect(0, 0, lienzoPoligonos.width, lienzoPoligonos.height);
        ctxCurvas.clearRect(0, 0, lienzoCurvas.width, lienzoCurvas.height);
        ctxPuntos.clearRect(0, 0, lienzoPuntos.width, lienzoPuntos.height);
        ctxGrilla.clearRect(0, 0, lienzoGrilla.width, lienzoGrilla.height);
   
        lienzoVolumen.style.zIndex=1000;
        cargarThreeJS(lienzoVolumen, vertices);
        calcularVolumen = crearCalculadorVolumen(vertices,facEsc);
        calcularVolumen();

        mensaje.innerText="volumen";

    }
}

async function cargarThreeJS(lienzoVolumen,vertices) {
    if (isWebGL2) {
        try {
            const module = await import('./threeWebGL2.js');
            module.inicializarEscena(lienzoVolumen, vertices);
        } catch (error) {
            console.error("Error al cargar threeWebGL2.js:", error);
        }
    } else {
        try {
            const module = await import('./threeWebGL1.js');
            module.inicializarEscena(lienzoVolumen, vertices);
        } catch (error) {
            console.error("Error al cargar threeWebGL1.js:", error);
        }
    }
}

function setFactorZ(){
    const factorZ = parseInt(document.getElementById('factorZ').value);
    liberarLienzoVolumen();
    selVolumen(factorZ);
}

function liberarLienzoVolumen(){
    // Primero limpia el renderizador de Three.js
    cargarLimpiarRenderer();
    lienzoVolumen.remove();
    canvas=document.createElement("canvas");
    canvas.id = "lienzoVolumen";
    canvas.width="500";
    canvas.height="500";
    canvas.class="lienzo";
    contenedor=document.getElementById('divcanva');
    contenedor.appendChild(canvas);
    lienzoVolumen=document.getElementById('lienzoVolumen');
}

async function cargarLimpiarRenderer() {
    if (isWebGL2) {
        try {
            const module = await import('./threeWebGL2.js');
            module.limpiarRenderer();
        } catch (error) {
            console.error("Error al cargar threeWebGL2.js:", error);
        }
    } else {
        try {
            const module = await import('./threeWebGL1.js');
            module.limpiarRenderer();
        } catch (error) {
            console.error("Error al cargar threeWebGL1.js:", error);
        }
    }
}

function agruparZ(z, tolerancia) {
    let ret=Math.round(z / tolerancia) * tolerancia;
    return ret;
}
function calcularPiso(){
    let tolerancia = parseFloat(document.getElementById('toleranciaZ').value);
    tolerancia = tolerancia<=0 ? 0.01 :tolerancia;
    const valoresZ = nubePuntos.map(punto => agruparZ(punto.z, tolerancia));
    // Contar las frecuencias de los valores de z agrupados
    const frecuencias = {};
    valoresZ.forEach(z => {
        frecuencias[z] = (frecuencias[z] || 0) + 1;
    });

    // Encontrar el valor de z más frecuente
    let valorMasFrecuente = null;
    let maxFrecuencia = 0;
    for (let z in frecuencias) {
        if (frecuencias[z] > maxFrecuencia) {
            valorMasFrecuente = z;
            maxFrecuencia = frecuencias[z];
        }
    }
    const zref=document.getElementById('referenciaZ');
    zref.value = valorMasFrecuente;
    zref.dispatchEvent(new Event('change'));
}