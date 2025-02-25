document.getElementById('selcoord').addEventListener('change', function() {
        buscarcoord(this.value);
});

document.getElementById('seldatum').addEventListener('change', function() {
        buscardatum(this.value);
    });

document.getElementById('cod').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Llamar a buscarcoord con el valor actual del input 'cod'
        buscarcoord(this.value);
    }
});
document.getElementById('cod').addEventListener('blur', function() {
    // Llamar a buscarcoord con el valor actual del input 'cod'
    buscarcoord(this.value);
});

document.getElementById('dat').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Llamar a buscardatum con el valor actual del input 'dat'
        buscardatum(this.value);
    }
});
document.getElementById('dat').addEventListener('blur', function() {
    // Llamar a buscarcoord con el valor actual del input 'cod'
    buscardatum(this.value);
});
    
function buscarcoord(codigo){
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
        xhr.send("selTipo=usuario" + "&selCodigo=" + codigo);    })
    .then(function(response) {
        if (response){
            cargarSCR(response);
        }    
    }).catch(function(error) {
        console.log('Error en la solicitud: ', error);
    });    
}

function buscardatum(codigo){
    var bdat = document.getElementById("seldatum");
    var dat = document.getElementById("dat");
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/consultaDatumCodigo.php", true);
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
        xhr.send("codigo=" + codigo);    })
    .then(function(response) {
        if(response){
            bdat.value=response['codigo'];
            dat.value=response['codigo'];
        }else{
            bdat.value='';
        }
    }).catch(function(error) {
        console.log('Error en la solicitud: ', error);
    });    

}

function cargarSCR(respuesta){
    var cod = document.getElementById("cod");
    var nom = document.getElementById("nom");
    var dat = document.getElementById("dat");
    var lo0 = document.getElementById("lo0");
    var la0 = document.getElementById("la0");
    var fn = document.getElementById("fn");
    var fe = document.getElementById("fe");
    var esc = document.getElementById("esc");
    var la1 = document.getElementById("la1");
    var lo1 = document.getElementById("lo1");
    var la2 = document.getElementById("la2");
    var lo2 = document.getElementById("lo2");
    var bscr = document.getElementById("selcoord");
    var bpro = document.getElementById("selproy");
    cod.value=respuesta['codigo'];
    nom.value=respuesta['nombre'];
    dat.value=respuesta['datumhor'];
    lo0.value=respuesta['lo0'];
    la0.value=respuesta['la0'];
    fn.value=respuesta['fn'];
    fe.value=respuesta['fe'];
    esc.value=respuesta['facesc'];
    la1.value=respuesta['lat1'];
    lo1.value=respuesta['lon1'];
    la2.value=respuesta['lat2'];
    lo2.value=respuesta['lon2'];
    bscr.value=respuesta['codigo'];
    bpro.value=respuesta['proyeccion'];
    buscardatum(respuesta['datumhor']);
}

function limpiar(){
    var cod = document.getElementById("cod");
    var nom = document.getElementById("nom");
    var dat = document.getElementById("dat");
    var lo0 = document.getElementById("lo0");
    var la0 = document.getElementById("la0");
    var fn = document.getElementById("fn");
    var fe = document.getElementById("fe");
    var esc = document.getElementById("esc");
    var la1 = document.getElementById("la1");
    var lo1 = document.getElementById("lo1");
    var la2 = document.getElementById("la2");
    var lo2 = document.getElementById("lo2");
    var bscr = document.getElementById("selcoord");
    var bdat = document.getElementById("seldatum");
    var bpro = document.getElementById("selproy");
    cod.value='';
    nom.value='';
    dat.value='';
    lo0.value='';
    la0.value='';
    fn.value='';
    fe.value='';
    esc.value='';
    la1.value='';
    lo1.value='';
    la2.value='';
    lo2.value='';
    bscr.value='';
    bdat.value='';
    bpro.value="TM";
}

function guardar(){
    var bscr = document.getElementById("selcoord");
    var datos = cargardatos();
    if(bscr.value===''){
        nuevoSCR(datos);
    }else{
        modSCR(datos);
    }
    limpiar();
}

function cargardatos(){
    var dato = {
        cod:0.0,
        nom:'',
        dat:0.0,
        pro:'',
    lo0:0.0,
    la0:0.0,
    fn:0.0,
    fe:0.0,
    esc:0.0,
    la1:0.0,
    lo1:0.0,
    la2:0.0,
    lo2:0.0
    };    
    dato['cod']=document.getElementById("cod").value || 0.0;
    dato['nom']=document.getElementById("nom").value;
    dato['dat']=document.getElementById("dat").value || 0.0;
    dato['pro']=document.getElementById("selproy").value;
    dato['lo0']=document.getElementById("lo0").value || 0.0;
    dato['la0']=document.getElementById("la0").value || 0.0;
    dato['fn']=document.getElementById("fn").value || 0.0;
    dato['fe']=document.getElementById("fe").value || 0.0;
    dato['esc']=document.getElementById("esc").value || 0.0;
    dato['la1']=document.getElementById("la1").value || 0.0;
    dato['lo1']=document.getElementById("lo1").value || 0.0;
    dato['la2']=document.getElementById("la2").value || 0.0;
    dato['lo2']=document.getElementById("lo2").value || 0.0;
    return dato;
}

function nuevoSCR(datos) {
    var jsonData = JSON.stringify(datos);
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/nuevoSCR.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var select = document.getElementById("selcoord");
                var newOption = document.createElement("option");
                newOption.value = datos['cod']; // Valor del código
                newOption.text = datos['nom'];  // Texto del nombre
                select.appendChild(newOption);  // Añadir la nueva opción

                // No hacemos nada con la respuesta
                resolve(); // Resolución sin respuesta
            } else {
                reject(Error(xhr.statusText)); // Rechazamos si hay error
            }
        };

        xhr.onerror = function() {
            reject(Error("Error de red")); // Rechazamos en caso de error de red
        };
        
        // Enviar los datos en formato URL
        xhr.send("datos=" + encodeURIComponent(jsonData));
    }).catch(function(error) {
        // Manejo del error en la solicitud
        console.log('Error en la solicitud: ', error);
    });
}

function modSCR(datos) {
    var jsonData = JSON.stringify(datos);
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/modSCR.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                // No hacemos nada con la respuesta
                resolve(); // Resolución sin respuesta
            } else {
                reject(Error(xhr.statusText)); // Rechazamos si hay error
            }
        };

        xhr.onerror = function() {
            reject(Error("Error de red")); // Rechazamos en caso de error de red
        };
        
        // Enviar los datos en formato URL
        xhr.send("datos=" + encodeURIComponent(jsonData));
    }).catch(function(error) {
        // Manejo del error en la solicitud
        console.log('Error en la solicitud: ', error);
    });
}

function borrar(){
    codigo=document.getElementById("cod").value || 0.0;
    limpiar();
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/borrarSCR.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var select = document.getElementById("selcoord");
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value == codigo) {
                        select.remove(i);
                        break;
                    }
                }                
                resolve(); // Resolución sin respuesta
            } else {
                reject(Error(xhr.statusText)); // Rechazamos si hay error
            }
        };

        xhr.onerror = function() {
            reject(Error("Error de red")); // Rechazamos en caso de error de red
        };
        
        // Enviar los datos en formato URL
        xhr.send("codigo=" + codigo);
    }).catch(function(error) {
        // Manejo del error en la solicitud
        console.log('Error en la solicitud: ', error);
    });
}