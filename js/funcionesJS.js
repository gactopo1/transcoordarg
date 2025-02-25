var map;
var selTipo="geodesicas";

document.addEventListener("DOMContentLoaded", function() {
    var elaO=document.getElementById("elaO");
    var elaD=document.getElementById("elaD");
    var nloO=document.getElementById("nloO");
    var nloD=document.getElementById("nloD");
    ponerlistenerlat(elaO);
    ponerlistenerlat(elaD);
    ponerlistenerlon(nloO);
    ponerlistenerlon(nloD);
    obtenertipocoord('selcoordD');
    obtenertipocoord('selcoordO');
});

function ponerlistenerlat(control){
    control.addEventListener('input',listenerlat);
    function listenerlat(){
        if(selTipo==="geodesicas"){
            if (control.placeholder==="99 99 99.99"){
                var inputValue = control.value;
                var formattedValue = inputValue.replace(/[^\d\s.-]/g, ''); // Eliminar caracteres que no sean dígitos

                var signo = inputValue.substring(0,1);
                var can=2;
                if (signo==="-"){
                    can=3;
                }
                if(inputValue.length === can){
                    // Validar que los primeros dos dígitos no superen 90
                    let degrees = parseInt(formattedValue.substring(can-2), 10);
                    degrees = Math.min(degrees, 90);
                    if(can===3){
                        formattedValue = "-" + degrees.toString().padStart(2, '0')+" ";

                    }else{
                        formattedValue = degrees.toString().padStart(2, '0')+" ";
                    }
                }

                if(inputValue.length===can+3){
                    // Validar que los segundos dos dígitos no superen 60
                    let minutes = parseInt(formattedValue.substring(can+1), 10);
                    minutes = Math.min(minutes, 60);
                    formattedValue = formattedValue.substring(0,formattedValue.length-2) + minutes.toString().padStart(2, '0') + " ";
                    //formattedValue = formattedValue.substring(0, can+1) + minutes.toString().padStart(2, '0') + formattedValue.substring(can+3);
                }

                if(inputValue.length > can+5 && inputValue.length < can+7){
                    // Validar que los últimos dos dígitos no superen 60
                    let seconds = parseInt(formattedValue.substring(can+3), 10);
                    seconds = Math.min(seconds, 60);
                    formattedValue = formattedValue.substring(0, can+4) + seconds.toString()+".";
                }

                // Aplicar formato
                formattedValue = formattedValue.replace(/^(-?\d{0,2})?(\d{2})(\d{2})(\d{2})?/, '$1 $2 $3.$4'); 

                control.value = formattedValue;
            }
        }
    }
}

function ponerlistenerlon(control){
    control.addEventListener('input',listenerlon);
    function listenerlon(){
        if(selTipo==="geodesicas"){
            if (control.placeholder==="999 99 99.99"){
                var inputValue = control.value;
                var formattedValue = inputValue.replace(/[^\d\s.-]/g, ''); // Eliminar caracteres que no sean dígitos

                var signo = inputValue.substring(0,1);
                var can=3;
                if (signo==="-"){
                    can=4;
                }
                if(inputValue.length === can){
                    // Validar que los primeros tres dígitos no superen 180
                    let degrees = parseInt(formattedValue.substring(can-3), 10);
                    degrees = Math.min(degrees, 180);
                    if(can===4){
                        formattedValue = "-" + degrees.toString().padStart(3, '0')+" ";

                    }else{
                        formattedValue = degrees.toString().padStart(3, '0')+" ";
                    }
                }

                if(inputValue.length===can+3){
                    // Validar que los segundos dos dígitos no superen 60
                    let minutes = parseInt(formattedValue.substring(can+1), 10);
                    minutes = Math.min(minutes, 60);
                    formattedValue = formattedValue.substring(0,formattedValue.length-2) + minutes.toString().padStart(2, '0') + " ";
                    //formattedValue = formattedValue.substring(0, can+1) + minutes.toString().padStart(2, '0') + formattedValue.substring(can+3);
                }

                if(inputValue.length > can+5 && inputValue.length < can+7){
                    // Validar que los últimos dos dígitos no superen 60
                    let seconds = parseInt(formattedValue.substring(can+3), 10);
                    seconds = Math.min(seconds, 60);
                    formattedValue = formattedValue.substring(0, can+4) + seconds.toString()+".";
                }

                // Aplicar formato
                formattedValue = formattedValue.replace(/^(-?\d{0,3})?(\d{3})(\d{2})(\d{2})?/, '$1 $2 $3.$4'); 

                control.value = formattedValue;
            }
        }
    }
}

function obtenertipocoord(odcoord){
    var odtipo="";
    var elaO = document.getElementById("elaO");
    var nloO = document.getElementById("nloO");
    var zO = document.getElementById("zO");
    var hO = document.getElementById("hO");
    var fO = document.getElementById("fO");
    var elaD = document.getElementById("elaD");
    var nloD = document.getElementById("nloD");
    var zD = document.getElementById("zD");
    var hD = document.getElementById("hD");
    var fD = document.getElementById("fD");
    if(odcoord==="selcoordO"){
        odtipo="coordO";
        elaO.value="";
        nloO.value="";
        zO.value="";
        hO.value="";
        fO.value="";
    }else{
        odtipo="coordD";
        elaD.value="";
        nloD.value="";
        zD.value="";
        hD.value="";
        fD.value="";
    };
    document.getElementById('labelmensaje').innerHTML="";
    var tipos = document.getElementsByName(odtipo);
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            selTipo = tipos[i].value;
        };
    };
    switch (selTipo) {
    case "geocentricas":
        if(odtipo==="coordO"){
            document.getElementById("boton_formatoO").style.display="none";
            document.getElementById("geocen_Z_O").style.display="block";
            document.getElementById("lab_O_1").textContent="X";
            document.getElementById("lab_O_2").textContent="Y";
            document.getElementById("h_elip_O").style.display="none";
            elaO.placeholder="99999999.9999";
            elaO.pattern="[0-9.-]";
            nloO.placeholder="99999999.9999";
            nloO.pattern="[0-9.-]";
        }else{
            document.getElementById("boton_formatoD").style.display="none";
            document.getElementById("geocen_Z_D").style.display="block";
            document.getElementById("lab_D_1").textContent="X";
            document.getElementById("lab_D_2").textContent="Y";
            document.getElementById("h_elip_D").style.display="none";
            elaD.placeholder="99999999.9999";
            elaD.pattern="[0-9.-]";
            nloD.placeholder="99999999.9999";
            nloD.pattern="[0-9.-]";
        };
        break;
    case "geodesicas":
        if(odtipo==="coordO"){
            document.getElementById("boton_formatoO").style.display="block";
            document.getElementById("geocen_Z_O").style.display="none";
            document.getElementById("lab_O_1").textContent="Latitud";
            document.getElementById("lab_O_2").textContent="Longitud";
            document.getElementById("h_elip_O").style.display="block";
            elaO.placeholder="99 99 99.99";
            elaO.pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
            nloO.placeholder="999 99 99.99";
            nloO.pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
        }else{
            document.getElementById("boton_formatoD").style.display="block";
            document.getElementById("geocen_Z_D").style.display="none";
            document.getElementById("lab_D_1").textContent="Latitud";
            document.getElementById("lab_D_2").textContent="Longitud";
            document.getElementById("h_elip_D").style.display="block";
            elaD.placeholder="99 99 99.99";
            elaD.pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
            nloD.placeholder="999 99 99.99";
            nloD.pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
        };
        break;
    case "proyectadas":
    case "usuario":
        if(odtipo==="coordO"){
            document.getElementById("boton_formatoO").style.display="none";
            document.getElementById("geocen_Z_O").style.display="none";
            document.getElementById("lab_O_1").textContent="Este";
            document.getElementById("lab_O_2").textContent="Norte";
            document.getElementById("h_elip_O").style.display="block";
            elaO.placeholder="99999999.9999";
            elaO.pattern="[0-9.-]";
            nloO.placeholder="99999999.9999";
            nloO.pattern="[0-9.-]";
        }else{
            document.getElementById("boton_formatoD").style.display="none";
            document.getElementById("geocen_Z_D").style.display="none";
            document.getElementById("lab_D_1").textContent="Este";
            document.getElementById("lab_D_2").textContent="Norte";
            document.getElementById("h_elip_D").style.display="block";
            elaD.placeholder="99999999.9999";
            elaD.pattern="[0-9.-]";
            nloD.placeholder="99999999.9999";
            nloD.pattern="[0-9.-]";
        };
        break;
    };

    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/consultaSCR.php", true);
         // Establecer el encabezado de la solicitud
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function() {
            reject(Error("Error de red"));
        };
        xhr.send("selTipo=" + selTipo);
    }).then(function(response){
            var miSelect = document.getElementById(odcoord);
            while (miSelect.options.length > 0) {
                miSelect.remove(0);
            };
            var nuevaOpcion = document.createElement("option");
            nuevaOpcion.value="";
            nuevaOpcion.text="Seleccione un sistema de coordenadas";
            nuevaOpcion.disabled=true;
            nuevaOpcion.selected=true;
            miSelect.appendChild(nuevaOpcion);
            if (response.length > 1){
                response.forEach(function(value){
                    var nuevaOpcion = document.createElement("option");
                    nuevaOpcion.value=value["codigo"];
                    nuevaOpcion.text=value["nombre"];
                    nuevaOpcion.dataset.datum=value["datumhor"];
                    miSelect.appendChild(nuevaOpcion);
                });
            }else{
                    var nuevaOpcion = document.createElement("option");
                    nuevaOpcion.value=response["codigo"];
                    nuevaOpcion.text=response["nombre"];
                    nuevaOpcion.dataset.datum=response["datumhor"];
                    miSelect.appendChild(nuevaOpcion);
            }
    }).catch(function(error) {
        console.log('Error en la solicitud: ', error);
    });
}    

function detallesistemas(odcoord){
    var codigo = document.getElementById(odcoord).value;
    var odtipo="";
    var boton="";
    if(odcoord==="selcoordO"){
        odtipo="coordO";
        boton="boton_sis_o";
    }else{
        odtipo="coordD";
        boton="boton_sis_d";
    }
    var tipos = document.getElementsByName(odtipo);
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            selTipo = tipos[i].value;
        };
    }
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/consultaSCRcodigo.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function() {
            reject(Error("Error de red"));
        };
        xhr.send("selTipo=" + selTipo + "&selCodigo=" + codigo);
    }).then(function(response) {
        var ventana = document.getElementById("campos_ventana");
        ventana.innerHTML = ""; //limpiar ventana
        var map = document.getElementById('map');
        if (map !== undefined && map !== null){
        map.innerHTML="";} //limpiar mapa
        generarventana(selTipo,response,ventana);
    }).catch(function(error) {
        console.log('Error en la solicitud: ', error);
    });
}

function formato(control){
    var boton = document.getElementById(control);
    if(control==="boton_formatoO"){
        var elaO = document.getElementById('elaO');
        var nloO = document.getElementById('nloO');
        if (boton.value === "DD MM SS" ){
            if(elaO.value !== ""){elaO.value=GraGraMinSeg(false,elaO.value);}
                
            if(nloO.value !== ""){nloO.value=GraGraMinSeg(false,nloO.value);}
            
            boton.value="DEC";
            elaO.placeholder="99.99999999";
            elaO.pattern="[-0-9]{2}\.[0-9]{8}";
            nloO.placeholder="999.99999999";
            nloO.pattern="[-0-9]{3}\.[0-9]{8}";
        }else{

            if(elaO.value !== ""){elaO.value=GraGraMinSeg(true,elaO.value);}
            if(nloO.value !== ""){nloO.value=GraGraMinSeg(true,nloO.value);}
            
            boton.value="DD MM SS";
            elaO.placeholder="99 99 99.99";
            elaO.pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
            nloO.placeholder="999 99 99.99";
            nloO.pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
        }
    }else{
        var elaD = document.getElementById('elaD');
        var nloD = document.getElementById('nloD');
        if (boton.value === "DD MM SS" ){
            
            if(elaD.value !== ""){elaD.value=GraGraMinSeg(false,elaD.value);}
            if(nloD.value !== ""){nloD.value=GraGraMinSeg(false,nloD.value);}

            boton.value="DEC";
            elaD.placeholder="99.99999999";
            elaD.pattern="[-0-9]{2}\.[0-9]{8}";
            nloD.placeholder="999.99999999";
            nloD.pattern="[-0-9]{3}\.[0-9]{8}";
        }else{

            if(elaD.value !== ""){elaD.value=GraGraMinSeg(true,elaD.value);}
            if(nloD.value !== ""){nloD.value=GraGraMinSeg(true,nloD.value);}
            
            boton.value="DD MM SS";
            elaD.placeholder="99 99 99.99";
            elaD.pattern="[-0-9]{2}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
            nloD.placeholder="999 99 99.99";
            nloD.pattern="[-0-9]{3}\s[0-9]{2}\s[0-9]{2}\.[0-9]{2}";
        }
    }
}

function generarventana(selTipo,respuesta,ventana){
    abrirventana('ventana');
    document.getElementById("titulo_detalle").innerHTML=respuesta["nombre"];
    var lat1 = respuesta['lat1'];
    var lon1 = respuesta['lon1'];
    var lat2 = respuesta['lat2'];
    var lon2 = respuesta['lon2'];
    var campoDiv = document.createElement("div");
    campoDiv.textContent = "Datum: " + respuesta['datumhornombre'];
    ventana.appendChild(campoDiv);
    campoDiv = document.createElement("div");
    campoDiv.textContent = "Elipsoide: " + respuesta["datumhorelipsoide"];
    ventana.appendChild(campoDiv);
    campoDiv = document.createElement("div");
    campoDiv.textContent = "Semi eje mayor: " + respuesta['datumhorsemimayor'].toString();
    ventana.appendChild(campoDiv);
    campoDiv = document.createElement("div");
    campoDiv.textContent = "Inversa Aplanamiento: " + respuesta['datumhorinvflattening'].toString();
    ventana.appendChild(campoDiv);
    campoDiv = document.createElement("div");
    campoDiv.textContent = "Area de uso: (" + lat1.toString() + "," + lon1.toString() + ") - (" + lat2.toString() + "," + lon2.toString() + ")";
    ventana.appendChild(campoDiv);
    if (selTipo==="proyectadas" || selTipo==="usuario"){
        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Proyeccion:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        switch(respuesta['proyeccion']){
            case 'TM':
                campoLabel.textContent = 'Transversa Mercator';
                break;
            case 'EP':
                campoLabel.textContent = 'Estereografica Polar';
                break;
            case 'LE':
                campoLabel.textContent = 'Lambert Equiarea';
                break;
        }
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);

        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Origen de latitudes:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['la0'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);

        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Origen de longitudes:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['lo0'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);

        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Falso norte:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['fn'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);

        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Falso este:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['fe'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);
        
        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Factor de escala:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['facesc'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);
        
        campoDiv = document.createElement("div");
        campoDiv.className = "labelinput";
        campoLabel = document.createElement("label");
        campoLabel.setAttribute("class", "ancho200");
        campoLabel.textContent = "Otros parametros:";
        campoDiv.appendChild(campoLabel);
        campoLabel = document.createElement("label");
        campoLabel.textContent = respuesta['parametros'];
        campoDiv.appendChild(campoLabel);
        ventana.appendChild(campoDiv);
    }
    var mapDiv = document.getElementById('map');
    // Verificar si el div del mapa contiene un mapa cargado
    if (mapDiv && mapDiv._leaflet_id) {
        mapDiv.remove();
    }
    map = L.map('map').setView([medio(lat1,lat2),medio(lon1,lon2)], 3);
    const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const bounds = [[lat1, lon1], [lat2, lon2]];
    L.rectangle(bounds, {color: "blue", weight: 1}).addTo(map);
    // Ajustar la vista del mapa
    map.fitBounds([[Math.min(lat1, lat2), Math.min(lon1, lon2)], [Math.max(lat1, lat2), Math.max(lon1, lon2)]]);
    const popup = L.popup();
    map.on('click', function(e){
        popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    });
}

function abrirventana(ventana) {
  vent = document.getElementById(ventana);
  vent.style.display="block";
  hacerArrastrable(vent);
}

function cerrarventana(ventana) {
  document.getElementById(ventana).style.display = "none";
  if (map !== undefined && map !== null){
  map.remove();}
}

// Función para hacer una ventana arrastrable
function hacerArrastrable(ventana) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // Cuando se presiona el título de la ventana, se activa la función
  var ventmov = document.getElementById("campos_ventana");
  ventmov.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Obtener la posición inicial del mouse
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Cuando se mueve el mouse, se activa la función
    document.onmousemove = elementDrag;
    // Cuando se suelta el mouse, se desactiva la función
    document.onmouseup = closeDragElement;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Calcular la nueva posición del elemento
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Establecer la nueva posición del elemento
    ventana.style.top = (ventana.offsetTop - pos2) + "px";
    ventana.style.left = (ventana.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // Cuando se suelta el mouse, desactivar la función
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function medio(num1, num2) {
    // Calcular el número medio
    var numeroMedio = (num1 + num2) / 2;
    return numeroMedio;
}

function cargararchivo() {
    var mensaje = document.getElementById('labelmensaje');
    mensaje.textContent = "";
    document.getElementById('barra_botones').style.display = 'none';
    document.getElementById('archivoexcel').style.display = 'block';
    document.getElementById('descarga').style.display = 'none';

    var oFileIn = document.getElementById('my_file_input');
        // Eliminar event listeners anteriores para evitar duplicación
    oFileIn.addEventListener('change', filePicked, false);

    function filePicked(oEvent) {
        var oFile = oEvent.target.files[0];
        var extension = oFile.name.split('.').pop().toLowerCase();
        document.getElementById('archivoexcel').value = oFile.name;
        var reader = new FileReader();

        if (extension === "csv") {
            reader.onload = function(event) {
                var csv = event.target.result;
                var data = csv.split('\n').map(function(row) {
                    return row.split(',');
                });
                var table = document.getElementById('tabla_origen');
                data.forEach(function(row) {
                    var fila = document.createElement('tr');
                    row.forEach(function(cell) {
                        var col = document.createElement('td');
                        col.innerText = parseFloat(cell).toString();
                        fila.appendChild(col);
                    });
                    table.appendChild(fila);
                });
            };
            reader.readAsText(oFile);
        } else if (extension === "xls" || extension === "xlsx" || extension === "xlsm") {
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });

                workbook.SheetNames.forEach(function(sheetName) {
                    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                    var table = document.getElementById('tabla_origen');
                    data.forEach(function(row) {
                        var fila = document.createElement('tr');
                        row.forEach(function(cell) {
                            if (cell !== "") {
                                var col = document.createElement('td');
                                col.innerText = cell;
                                fila.appendChild(col);
                            }
                        });
                        table.appendChild(fila);
                    });
                });
            };
            reader.readAsBinaryString(oFile);
        } else if (extension === "gpx") {
            reader.onload = function(event) {
                var xmlString = event.target.result;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlString, "text/xml");
                var geojson = toGeoJSON.gpx(xmlDoc);

                var table = document.getElementById('tabla_origen');
                geojson.features.forEach(function(feature) {
                    var fila = document.createElement('tr');
                    var col = document.createElement('td');
                    col.innerText = JSON.stringify(feature.geometry.coordinates);
                    fila.appendChild(col);
                    table.appendChild(fila);
                });
            };
            reader.readAsText(oFile);            
        } else if (extension === "kml") {
            reader.onload = function(event) {
                var xmlString = event.target.result;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xmlString, "text/xml");
                var geojson = toGeoJSON.kml(xmlDoc);
                var table = document.getElementById('tabla_origen');
                geojson.features.forEach(function(feature) {
                    feature.geometry.coordinates.forEach(function(coord) {
                        var fila = document.createElement('tr');
                        var lat = document.createElement('td');
                        var lon = document.createElement('td');
                        lat.innerText = coord[1];
                        lon.innerText = coord[0];
                        fila.appendChild(lat);
                        fila.appendChild(lon);
                        table.appendChild(fila);
                    });
                });
            };
            reader.readAsText(oFile);
        } else if (extension === "kmz") {
            reader.onload = function(event) {
                JSZip.loadAsync(event.target.result).then(function(zip) {
                    zip.forEach(function(relativePath, zipEntry) {
                        if (zipEntry.name.endsWith('.kml')) {
                            zipEntry.async('string').then(function(text) {
                                var parser = new DOMParser();
                                var xmlDoc = parser.parseFromString(text, "text/xml");
                                var geojson = toGeoJSON.kml(xmlDoc);

                                var table = document.getElementById('tabla_origen');
                                geojson.features.forEach(function(feature) {
                                    feature.geometry.coordinates.forEach(function(coord) {
                                        var fila = document.createElement('tr');
                                        var lat = document.createElement('td');
                                        var lon = document.createElement('td');
                                        lat.innerText = coord[1];
                                        lon.innerText = coord[0];
                                        fila.appendChild(lat);
                                        fila.appendChild(lon);
                                        table.appendChild(fila);
                                    });
                                });
                            });
                        }
                    });
                });
            };
            reader.readAsArrayBuffer(oFile);
        } else if (extension === "dxf") {
            reader.onload = function(event) {
                var data = event.target.result;
                var parser = new DxfParser();
                try {
                    var dxf = parser.parseSync(data);
                    var table = document.getElementById('tabla_origen');
                    dxf.entities.forEach(function(entity) {
                        var fila;
                        var lat, lon;
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
                        } else if (entity.type === 'LINE') {
                            fila = document.createElement('tr');
                            lat = document.createElement('td');
                            lon = document.createElement('td');
                            h = document.createElement('td');
                            lat.innerText = entity.vertices[0].x;
                            lon.innerText = entity.vertices[0].y;
                            h.innerText = entity.vertices[0].z;
                            fila.appendChild(lat);
                            fila.appendChild(lon);
                            fila.appendChild(h);
                            table.appendChild(fila);

                            fila = document.createElement('tr');
                            lat = document.createElement('td');
                            lon = document.createElement('td');
                            h = document.createElement('td');
                            lat.innerText = entity.vertices[1].x;
                            lon.innerText = entity.vertices[1].y;
                            h.innerText = entity.vertices[1].z;
                            fila.appendChild(lat);
                            fila.appendChild(lon);
                            fila.appendChild(h);
                            table.appendChild(fila);
                        } else if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
                            entity.vertices.forEach(function(vertex) {
                                fila = document.createElement('tr');
                                lat = document.createElement('td');
                                lon = document.createElement('td');
                                h = document.createElement('td');
                                lat.innerText = vertex.x;
                                lon.innerText = vertex.y;
                                h.innerText = entity.elevation;
                                fila.appendChild(lat);
                                fila.appendChild(lon);
                                fila.appendChild(h);
                                table.appendChild(fila);
                            });
                        }
                    });
                } catch (err) {
                    mensaje.textContent = "Error al procesar el archivo DXF.";
                }
            };
            reader.readAsText(oFile);        
        } else {
            mensaje.textContent = "Formato de archivo no soportado.";
        }
    
        oFileIn.removeEventListener('change', filePicked, false);

        document.getElementById("boton_cal_archivo").style.display = "inline-block";
        reader = null;
    }
}

function cerrararchivo(){
    var tablaorigen = document.getElementById('tabla_origen');
    var tabladestino = document.getElementById('tabla_destino');
    var mensaje = document.getElementById('labelmensaje');
    document.getElementById('my_file_input').value="";
    
    while (tablaorigen.rows.length > 0) {
        tablaorigen.deleteRow(0);}
    while (tabladestino.rows.length > 0) {
        tabladestino.deleteRow(0);}
    
    //tablaorigen.innerHTML="";
    //tabladestino.innerHTML="";
    mensaje.textContent="";
    document.getElementById('archivoexcel').style.display='none';
    document.getElementById('barra_botones').style.display='flex';
    document.getElementById('boton_descargar_archivo').style.display = 'none';
    document.getElementById("boton_cal_archivo").style.display = "none";

}

function obtenerTransformacion(siscoorO, siscoorD) {
    return new Promise((resolve, reject) => {
        const dathttp = new XMLHttpRequest();
        dathttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const resp = JSON.parse(this.responseText);
                resolve(resp);
            }
        };
        dathttp.open("POST", "./php/vertransformacion.php", true);
        dathttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        dathttp.send("sisO=" + siscoorO + "&sisD=" + siscoorD);
    });
}

function esperarSeleccionCombo() {
    return new Promise(resolve => {
        const combo = document.getElementById("seltrans");
        combo.addEventListener("change", function() {
            resolve(combo.options[combo.selectedIndex]);
        });
    });
}

async function calcular(od,multiple){
    mostrarSpinner();
    //Tipo de coordenada
    var tipocoorO="";
    var tipocoorD="";
    var geoideO="";
    var geoideD="";
    var alturaO="";
    var alturaD="";
    var fechaO = document.getElementById("fO").value;
    var fechaD = document.getElementById("fD").value;
    var botonhO = document.getElementById("ar16O");
    var botonhD = document.getElementById("ar16D");
    var b1O = document.getElementById('b_ar16_O');
    var b2O = document.getElementById('b_egm96_O');
    var b3O = document.getElementById('b_egm2008_O');
    var b1D = document.getElementById('b_ar16_D');
    var b2D = document.getElementById('b_egm96_D');
    var b3D = document.getElementById('b_egm2008_D');
    var botones = document.getElementById("descarga");
    botones.style.display="none";
    if (od==="DO"){
        fechaO = document.getElementById("fD").value;
        fechaD = document.getElementById("fO").value;
        var botonhO = document.getElementById("ar16D");
        var botonhD = document.getElementById("ar16O");
        var b1O = document.getElementById('b_ar16_D');
        var b2O = document.getElementById('b_egm96_D');
        var b3O = document.getElementById('b_egm2008_D');
        var b1D = document.getElementById('b_ar16_O');
        var b2D = document.getElementById('b_egm96_O');
        var b3D = document.getElementById('b_egm2008_O');
    }
    var mensaje = document.getElementById('labelmensaje');
    var tablad = document.getElementById('tabla_destino');
    if (botonhO.checked){
        alturaO = "orto";
        if (b1O.classList.contains('selected')){
            geoideO = "ar16";
        }else if(b2O.classList.contains('selected')){
            geoideO = "egm96";
        }else if(b3O.classList.contains('selected')){
            geoideO = "egm2008";
        }else{
            geoideO="";
        }
    }else{
        alturaO = "elip";
        geoideO = "";
    }

    if (botonhD.checked){
        alturaD = "orto";
        if (b1D.classList.contains('selected')){
            geoideD = "ar16";
        }else if(b2D.classList.contains('selected')){
            geoideD = "egm96";
        }else if(b3D.classList.contains('selected')){
            geoideD = "egm2008";
        }else{
            geoideD="";
        }
    }else{
        alturaD = "elip";
        geoideD = "";
    }

    tablad.innerHTML="";
    mensaje.textContent="";
    var transObj = {
        transtip:"",
        transcod:"",
        inverso:false,
        transcod2:"",
        inverso2:false
    };
    var dato = {
        ela:0.0,
        nlo:0.0,
        z:0.0,
        h:0.0
    };
    var datos = [];
    
    var tipos = document.getElementsByName('coordO');
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            if(od==='OD'){tipocoorO = tipos[i].value;}else{tipocoorD = tipos[i].value;}
        };
    }
    var tipos = document.getElementsByName('coordD');
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            if(od==='OD'){tipocoorD = tipos[i].value;}else{tipocoorO = tipos[i].value;}
        };
    }
    //Sistema de coordenada
    var siscoorO=document.getElementById("selcoordO");
    var siscoorD=document.getElementById("selcoordD");
    var indO=siscoorO.selectedIndex;
    var indD=siscoorD.selectedIndex;
    var seloptionO = siscoorO.options[indO];
    var seloptionD = siscoorD.options[indD];
    
    if(od==="OD"){
        var sisO = seloptionO.value;
        var sisD = seloptionD.value;
        var datumO=seloptionO.dataset.datum;
        var datumD=seloptionD.dataset.datum;
        var ela=document.getElementById("elaO").value;
        var nlo=document.getElementById("nloO").value;
        var z=document.getElementById("zO").value;
        var h=document.getElementById("hO").value;
    }else{
        var sisO = seloptionD.value;
        var sisD = seloptionO.value;
        var datumO = seloptionD.dataset.datum;
        var datumD = seloptionO.dataset.datum;
        var ela=document.getElementById("elaD").value;
        var nlo=document.getElementById("nloD").value;
        var z=document.getElementById("zD").value;
        var h=document.getElementById("hD").value;
    }
    if(datumO !== datumD){
        //const respuesta = await obtenerTransformacion(sisgO, sisgD);
        const respuesta = await obtenerTransformacion(datumO, datumD);
        if (respuesta.length > 0) {
            texto=document.getElementById('labelmensaje');
            combo=document.getElementById('seltrans');
            combo.options.length=0;
            fila=document.createElement("option");
            fila.value="";
            fila.text="Seleccione una transformacion";
            fila.disabled=true;
            fila.selected=true;
            combo.appendChild(fila);        
            respuesta.forEach(function(item) {
                fila=document.createElement("option");
                transObj.transtip=item.tipo;
                transObj.transcod=item.codigo;
                transObj.inverso=item.inverso;
                if (item.tipo==='CI69'){
                    fila.value=item.codigo;
                    fila.text=item.nombre+" ["+item.transformacion+"] -> "+item.nombre2+" ["+item.transformacion2+"]";
                    fila.dataset.tipo="CI69";
                    fila.dataset.inverso=item.inverso;
                    fila.dataset.codigo2=item.codigo2;
                    fila.dataset.inverso2=item.inverso2;
                    transObj.transcod2=item.codigo2;
                    transObj.inverso2=item.inverso2;
                }else{
                    fila.value=item.codigo;
                    fila.text=item.nombre+" ["+item.transformacion+"]";
                    fila.dataset.tipo=item.tipo;
                    fila.dataset.inverso=item.inverso;
                }
                combo.appendChild(fila);
            }); 
            if(combo.options.length>2){
                combo.style.display="inline-block";
                await esperarSeleccionCombo().then(opcionSeleccionada => {
                    transObj.transtip = opcionSeleccionada.dataset.tipo;
                    transObj.transcod = opcionSeleccionada.value;
                    transObj.inverso = opcionSeleccionada.dataset.inverso;
                    transObj.transcod2=opcionSeleccionada.dataset.codigo2;
                    transObj.inverso2=opcionSeleccionada.dataset.inverso2;
                    combo.options.length=0;
                    combo.style.display="none";
                    texto.textContent = opcionSeleccionada.text;
                });
            }else{
                texto.textContent = combo.options[1].text;
            }
        }
    }
    if(multiple){
        //Recorrer tabla #tabla_origen y cargar en datos
        tabla=document.getElementById('tabla_origen');
        //numcells = tabla.rows[0].cells.length;
        var fila = tabla.rows[0];
        numcells = fila.cells.length;
        for (var i = 0; i < tabla.rows.length; i++) {
            fila = tabla.rows[i];
            let dato = {ela:0.0, nlo:0.0, z:0.0, h:0.0};
            dato['ela'] = cadenanumero(fila.cells[0].textContent);
            dato['nlo'] = cadenanumero(fila.cells[1].textContent);
            //revisar e incluir la altura
            if (numcells>2){
                if(numcells===3 && tipocoorO==='geocentricas'){
                    dato['z'] = cadenanumero(fila.cells[2].textContent);
                }else{
                    dato['h'] = cadenanumero(fila.cells[2].textContent);
                }
                if (numcells===4 && tipocoorO==='geocentricas'){
                    dato['z'] = cadenanumero(fila.cells[2].textContent);
                    dato['h'] = cadenanumero(fila.cells[3].textContent);
                }
            }
            datos.push(dato);
        }        
    }else{
        dato['ela']=cadenanumero(ela);
        dato['nlo']= cadenanumero(nlo);
        dato['z'] = cadenanumero(z);
        dato['h'] = cadenanumero(h);
        datos.push(dato);
    }
    var datosJSON = datos.map(function(objeto) {
        return JSON.stringify(objeto);
    });
    var datosFinalJSON = '['+datosJSON.join(',')+']';
    
    var xhttp = new XMLHttpRequest();
    // Definir la función de respuesta
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            ocultarSpinner();
            //mostrar las coordenadas de destino
            //si multiple cargar en la tabla, si no carlar en los inputs destino
            if(this.responseText !== ""){
                const resp = JSON.parse(this.responseText);
                if(resp.length>1){
                    tabla=document.getElementById('tabla_destino');
                    resp.forEach(function(item){
                        var fila = document.createElement('tr');
                        var celela = document.createElement('td');
                        var celnlo = document.createElement('td');
                        celela.textContent = item['ela'];
                        fila.appendChild(celela);
                        celnlo.textContent=item['nlo'];
                        fila.appendChild(celnlo);
                        if(item.hasOwnProperty('z')){
                            var celz = document.createElement('td');
                            celz.textContent = item['z'];
                            fila.appendChild(celz);
                        }
                        if(item.hasOwnProperty('h')){
                            var celh = document.createElement('td');
                            celh.textContent = item['h'];
                            fila.appendChild(celh);
                        }
                        tabla.appendChild(fila);
                    });
                    document.getElementById('boton_descargar_archivo').style.display = 'inline-block';
                }else{
                    item=resp[0];
                    if(od==='OD'){
                        var inela=document.getElementById('elaD');
                        var innlo=document.getElementById('nloD');
                        var inz=document.getElementById('zD');
                        var inh=document.getElementById('hD');
                    }else{
                        var inela=document.getElementById('elaO');
                        var innlo=document.getElementById('nloO');
                        var inz=document.getElementById('zO');
                        var inh=document.getElementById('hO');
                    }
                    if(tipocoorD==="geodesicas"){
                        var fa=null;
                        if(od==='OD'){
                            fa = document.getElementById('boton_formatoD');
                        }else{
                            fa = document.getElementById('boton_formatoO');
                        }
                        if (fa.value==="DD MM SS"){
                            inela.value=GraGraMinSeg(true,item['ela']);
                            innlo.value=GraGraMinSeg(true,item['nlo']);
                        }else{
                            inela.value=item['ela'];
                            innlo.value=item['nlo'];
                        }
                        inh.value=item['h'];
                    }else{
                        inela.value=item['ela'];
                        innlo.value=item['nlo'];
                        if(resp['z'] !== ""){
                            inz.value=item['z'];
                        }
                        inh.value=item['h'];
                    }
                }
            }else{
                alert("Inversa no definida");
            }
        }
    };
    xhttp.open("POST", "./php/calcular.php", true);
     // Establecer el encabezado de la solicitud
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("OD="+ od + "&tipoO=" + tipocoorO + "&sisO=" + sisO + "&tipoD=" + tipocoorD + "&sisD=" + sisD + "&datos=" + datosFinalJSON + "&transtip=" + transObj.transtip + "&transcod=" + transObj.transcod + "&transinv=" + transObj.inverso + "&transcod2=" + transObj.transcod2 + "&transinv2=" + transObj.inverso2 + "&transfechaO=" + fechaO + "&transfechaD=" + fechaD + "&alturaO=" + alturaO + "&geoideO=" + geoideO + "&alturaD=" + alturaD + "&geoideD=" + geoideD);
}

function cadenanumero(cad) {
    var num=0.0;
    if(cad!==""){
        var Acad = cad.trimEnd().split(" ");
        if (Acad.length === 3) {
            var gg = parseInt(Acad[0]);
            var sign = gg < 0 ? -1 : 1;
            gg = Math.abs(gg);
            mm = parseInt(Acad[1]);
            ss = parseFloat(Acad[2]);
            num = sign * (gg + mm / 60 + ss / 3600);
        } else if (Acad.length === 2) {
            var gg = parseInt(Acad[0]);
            var sign = gg < 0 ? -1 : 1;
            gg = Math.abs(gg);
            mm = parseInt(Acad[1]);
            ss = 0.0;
            num = sign * (gg + mm / 60);
        } else {
            num = parseFloat(Acad[0]);
        }
    }
    return num;
}

function GraGraMinSeg(tipo,valor){
    if(tipo){
        //GG -> GG MM SS
        var sign = valor < 0 ? '-' : '';
        valor=Math.abs(valor);
        var degrees = Math.trunc(valor);
        var dif = valor-degrees;
        if (1-dif < 0.000001){
            degrees+=1;
            minutes=0;
            seconds=0;
        }else{
            var minutes_float = dif * 60;
            var minutes = Math.trunc(minutes_float);
            var difm = minutes_float-minutes;
            if(1-difm < 0.0000001){
                minutes+=1;
                seconds=0;
            }else{
                var seconds = difm * 60;
            }
        }
        //degrees=degrees*sign;
        var ggmmss = sign + degrees.toString().padStart(2, '0') + " " + minutes.toString().padStart(2, '0') + " " + seconds.toFixed(6);
        return ggmmss;
    }else{
        //GG MM SS -> GG
        var decimal=0.0;
        if(valor!==""){
            if(valor.slice(0, 1)==='-'){sign = -1;}else{sign=1;}
            var parts = valor.trimEnd().split(' ');
            if(parts.length===3){
                var degrees = parseInt(parts[0], 10);
                var minutes = parseInt(parts[1], 10);
                var seconds = parseFloat(parts[2]);
            }else if(parts.length===2){
                var degrees = parseInt(parts[0], 10);
                var minutes = parseInt(parts[1], 10);
                var seconds=0.0;
            }else{
                var degrees = parseInt(parts[0], 10);
                var minutes=0.0;    
                var seconds=0.0;
            }
            degrees = Math.abs(degrees);
            minutes = Math.abs(minutes);
            seconds = Math.abs(seconds);
            var decimal = sign * (degrees + (minutes / 60) + (seconds / 3600));
        }
        return decimal;        
    }
}

function limpiar(){
    var elaO = document.getElementById("elaO");
    var nloO = document.getElementById("nloO");
    var zO = document.getElementById("zO");
    var hO = document.getElementById("hO");
    var fO = document.getElementById("fO");
    var elaD = document.getElementById("elaD");
    var nloD = document.getElementById("nloD");
    var zD = document.getElementById("zD");
    var hD = document.getElementById("hD");
    var fD = document.getElementById("fD");
    elaO.value="";
    nloO.value="";
    zO.value="";
    hO.value="";
    fO.value="";
    elaD.value="";
    nloD.value="";
    zD.value="";
    hD.value="";
    fD.value="";
    document.getElementById('labelmensaje').innerHTML="";
}

function botondescarga(){
    var botondxf = document.getElementById("bdxf");
    var botongpx = document.getElementById("bgpx");
    var botonkml = document.getElementById("bkml");
    var tipo='';
    var tipos = document.getElementsByName('coordD');
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            tipo = tipos[i].value;
        };
    };
    if (tipo === 'proyectadas' || tipo === 'usuario'){
        botondxf.style.display="inline-block";
        botongpx.style.display="inline-block";
        botonkml.style.display="none";
    }else{
        botondxf.style.display="none";
        botongpx.style.display="none";
        botonkml.style.display="inline-block";
    }
    var botones = document.getElementById("descarga");
    botones.style.display="inline-block";
}

function descargararchivo(tipo){
    // Obtener la tabla HTML
    var table = document.getElementById('tabla_destino');
    switch(tipo){
        case "xls":
            // Crear una nueva hoja de trabajo
            var ws = XLSX.utils.table_to_sheet(table);

            // Crear un libro de Excel y agregar la hoja de trabajo
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Guardar el libro de Excel como un archivo
            XLSX.writeFile(wb, 'datos.xlsx');
            break;
        case "dxf":
            var filas = table.getElementsByTagName('tr');
            // Cabecera del archivo DXF
            var dxf = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n`;
            dxf += `0\nSECTION\n2\nTABLES\n0\nENDSEC\n`;
            dxf += `0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n`;
            dxf += `0\nSECTION\n2\nENTITIES\n`;
            for (var i = 0; i < filas.length; i++) {
                var columnas = filas[i].getElementsByTagName('td');
                var x = parseFloat(columnas[0].innerText);
                var y = parseFloat(columnas[1].innerText);
                if (columnas.length === 3) {
                    var z = parseFloat(columnas[2].innerText);
                }else{
                    var z = 0.0;
                }
                dxf += `0\nPOINT\n8\n0\n10\n${x}\n20\n${y}\n30\n${z}\n`;
            }
            // Cierre de la sección de entidades y del archivo DXF
            dxf += `0\nENDSEC\n0\nSECTION\n2\nOBJECTS\n0\nENDSEC\n0\nEOF`;
            // Crear archivo DXF y descargarlo
            var blob = new Blob([dxf], { type: 'text/plain' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.dxf';
            link.click();
            break;
        case 'gpx':
            var filas = table.getElementsByTagName('tr');
            var gpx = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="Generador GPX" xmlns="http://www.topografix.com/GPX/1/1">`;
            for (var i = 0; i < filas.length; i++) {
                var columnas = filas[i].getElementsByTagName('td');
                if (columnas.length === 1) {
                    var coordinates = JSON.parse(columnas[0].innerText);
                    var lat = coordinates[1];  // GPX usa latitud primero
                    var lon = coordinates[0];  // GPX usa longitud segundo
                    var ele = coordinates[2] || 0;  // Elevar a 0 si no está presente

                    // Añadimos un punto (wpt) al GPX
                   gpx += `<wpt lat="${lat}" lon="${lon}"> <ele>${ele}</ele> <name>Punto ${i + 1}</name></wpt>\n`;
                }
            }
            gpx += '</gpx>';
            // Crear archivo GPX y descargarlo
            var blob = new Blob([gpx], { type: 'application/gpx+xml' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.gpx';
            link.click();
            break;
        case 'kml':
            var filas = table.getElementsByTagName('tr');
            var kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>  <name>Generado desde tabla</name>\n`;
            for (var i = 0; i < filas.length; i++) {
                var columnas = filas[i].getElementsByTagName('td');
                if (columnas.length === 2) {
                    var lat = parseFloat(columnas[0].innerText);
                    var lon = parseFloat(columnas[1].innerText);

                    // Añadimos un punto (Placemark) al KML
                    kml += `<Placemark>    <Point>      <coordinates>${lon},${lat},0</coordinates>    </Point>    <name>Punto ${i + 1}</name>  </Placemark>\n`;
                }
            }
            kml += '</Document>\n</kml>';
            // Crear archivo KML y descargarlo
            var blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.kml';
            link.click();            
            break;
    }        
}
/*
function calcularAlt(od) {
    if (od==="O"){
        idela="elaO";
        idnlo="nloO";
        idtipos = 'coordO';
        idfa = 'boton_formatoO';

        
        idh="hO";
        ido='ortoO';
    }else{
        idela="elaD";
        idnlo="nloD";
        idtipos = 'coordD';
        idfa = 'boton_formatoD';
        bidh = 'ar16D';
        idh="hD";
        ido='ortoD';
    }
    var ela=document.getElementById(idela).value;
    var nlo=document.getElementById(idnlo).value;
    var tipos = document.getElementsByName(idtipos);
    var botonh = document.getElementById(bidh);
    var alt = document.getElementById(idh).value;
    altura=0.0;
    if (botonh.checked){
        document.getElementById(ido).style.display="inline-block";
    }else{
        document.getElementById(ido).style.display="none";
    }
    
    //poner selector de tipo en el html
    tipo = 'ar16';
        
    if (alt !== ""){
        altura = +alt; 
    }
    //ver tipo de sistema
    for (var i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            tipocoor = tipos[i].value;}
    };
    switch (tipocoor){
        case "geodesicas":
            if(ela === ""){return;}
            if (document.getElementById(idfa).value ==="DD MM SS"){
                ela=GraGraMinSeg(false,ela);
                nlo=GraGraMinSeg(false,nlo);
            }
            break;
        case "proyectadas":
            return;
    }
    mostrarSpinner();
    var xhttp = new XMLHttpRequest();
    // Definir la función de respuesta
    xhttp.onreadystatechange = function() {
        ocultarSpinner();
        if (this.readyState === 4 && this.status === 200) {
            //mostrar las coordenadas de destino
            //si multiple cargar en la tabla, si no carlar en los inputs destino
            if(this.responseText !== ""){
                const resp = +this.responseText;
                if (botonh.checked){
                    document.getElementById(idh).value = (altura - resp);
                }else{
                    document.getElementById(idh).value = (altura + resp);
                }
        }
    }};
    xhttp.open("POST", "./php/ar16.php", true);
     // Establecer el encabezado de la solicitud
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("lat=" + ela + "&lon=" + nlo + "&tipo=" + tipo);
}
*/
function selectButton(selectedId,od) {
    if (od==="O"){
        b1 = 'b_ar16_O';
        b2 = 'b_egm96_O';
        b3 = 'b_egm2008_O';
    }else{
        b1 = 'b_ar16_D';
        b2 = 'b_egm96_D';
        b3 = 'b_egm2008_D';
    }
    document.getElementById(b1).classList.remove('selected');
    document.getElementById(b2).classList.remove('selected');
    document.getElementById(b3).classList.remove('selected');
    document.getElementById(selectedId).classList.add('selected');
}

function botonesAlt(od){
    if (od==="O"){
        bidh = 'ar16O';
        ido='ortoO';
        b1 = 'b_ar16_O';
        b2 = 'b_egm96_O';
        b3 = 'b_egm2008_O';
    }else{
        bidh = 'ar16D';
        ido='ortoD';
        b1 = 'b_ar16_D';
        b2 = 'b_egm96_D';
        b3 = 'b_egm2008_D';
    }
    var botonh = document.getElementById(bidh);
    if (botonh.checked){
        document.getElementById(ido).style.display="inline-block";
    }else{
        document.getElementById(ido).style.display="none";
        document.getElementById(b1).classList.remove('selected');
        document.getElementById(b2).classList.remove('selected');
        document.getElementById(b3).classList.remove('selected');
    }
}

function mostrarSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

// Ocultar el spinner cuando el proceso termine
function ocultarSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}