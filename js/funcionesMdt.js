

function hexToRgb(hex,cadena=true) {
    // Asegura que el formato hexadecimal comience con "#"
    hex = hex.replace(/^#/, '');

    // Convierte el valor hexadecimal a sus componentes RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (cadena){
        return `${r}, ${g}, ${b}`;
    }else{
        return {r, g, b};
    }
}

function mostrarSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}

// Ocultar el spinner cuando el proceso termine
function ocultarSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function contarNiveles(zMin, zMax) {
    const primerNivel = Math.floor(zMin);
    const ultimoNivel = Math.floor(zMax);
    const cantidadNiveles = ultimoNivel - primerNivel + 1;
    return Math.max(cantidadNiveles, 0);
}

function generarGrillaNiveles(zMin,zMax,nivel){
    const container = document.getElementById('contenedorGrillaNiveles');
    const intervalo = (zMax - zMin) / (nivel - 1);
    const cells = container.querySelectorAll('.cell');
    cells.forEach(cell => {
        container.removeChild(cell);
    });
    niveles=[];
    for (let i = 0; i < nivel; i++) {
      const valorNivel = zMin + i * intervalo;
      const valorColor = generarColorAleatorio();
      const valorLinea = 1; 
      // Crear input para el nivel
      const nivelInput = document.createElement('input');
      nivelInput.type = 'number';
      nivelInput.id = 'nivel' + i;
      nivelInput.value = valorNivel.toFixed(2);
      nivelInput.step = 0.1;
      nivelInput.className = 'cellinput';
      nivelInput.addEventListener('change', cambiarNiveles);

      // Crear input para el tipo de línea
      const lineaInput = document.createElement('input');
      lineaInput.type = 'number';
      lineaInput.id = 'linea' + i;
      lineaInput.value = valorLinea;
      nivelInput.step = 0.1;
      lineaInput.className = 'cellinput';
      lineaInput.addEventListener('change', cambiarNiveles);

      // Crear input para el color aleatorio
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.id = 'color' + i;
      colorInput.value = valorColor;
      colorInput.addEventListener('change', cambiarNiveles);

      // Agregar cada elemento a su celda en el contenedor
      const nivelCell = document.createElement('div');
      nivelCell.className = 'cell';
      nivelCell.appendChild(nivelInput);

      const lineaCell = document.createElement('div');
      lineaCell.className = 'cell';
      lineaCell.appendChild(lineaInput);

      const colorCell = document.createElement('div');
      colorCell.className = 'cell';
      colorCell.appendChild(colorInput);

      container.appendChild(nivelCell);
      container.appendChild(lineaCell);
      container.appendChild(colorCell);
      niveles.push({nivel:valorNivel, px: valorLinea, color: valorColor });
    }
}

function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

function cambiarNiveles(){
    const container = document.getElementById('contenedorGrillaNiveles');
    const cells = container.querySelectorAll('.cell');
    nivel = cells.length / 3;
    niveles=[];
    for (i=0;i<nivel;i++){
        let valorNivel = parseFloat(document.getElementById('nivel'+i).value);
        let valorLinea = parseInt(document.getElementById('linea'+i).value);
        let valorColor = document.getElementById('color'+i).value;
        niveles.push({nivel: valorNivel, px: valorLinea, color: valorColor});
    }
}

function eliminarRepetidos(arr) {
    return [...new Set(arr)];
}

// Función para interpolar bilinealmente en una celda de la grilla
function interpolarBilineal(p1, p2, p3, p4, x, y) {
    const x1 = p1.x, y1 = p1.y, z1 = p1.z || 0;
    const x2 = p2.x, y2 = p2.y, z2 = p2.z || 0;
    const x3 = p3.x, y3 = p3.y, z3 = p3.z || 0;
    const x4 = p4.x, y4 = p4.y, z4 = p4.z || 0;

    const t = (x - x1) / (x2 - x1);
    const u = (y - y1) / (y3 - y1);

    const zInterpolada =
        (1 - t) * (1 - u) * z1 +
        t * (1 - u) * z2 +
        (1 - t) * u * z3 +
        t * u * z4;

    return zInterpolada;
}

// Función de interpolación entre dos puntos
function interpolarNivel(p1, p2, nivel) {
    if ((nivel > p1.z && nivel > p2.z) || (nivel < p1.z && nivel < p2.z)) {
        return null; // No hay intersección
    }
    const t = (nivel - p1.z) / (p2.z - p1.z);
    return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y),
        z: p1.z + t * (p2.z - p1.z) // Valor interpolado de z
    };
}

// Función para encontrar el vecino más cercano
function vecinoMasCercano(nube,puntoGrilla) {
    let distanciaMinima = Infinity;
    let puntoCercano = null;

    nube.forEach(puntoNube => {
        let dx = puntoGrilla.x - puntoNube.x;
        let dy = puntoGrilla.y - puntoNube.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);  // Distancia euclidiana

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            puntoCercano = puntoNube;
        }
    });

    return puntoCercano;
}

// Función para calcular la envolvente convexa utilizando el algoritmo de Graham Scan
function calcularEnvolventeConvexa(puntos) {
    puntos.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

    const parteInferior = [];
    for (const p of puntos) {
        while (parteInferior.length >= 2 && productocruz(parteInferior[parteInferior.length - 2], parteInferior[parteInferior.length - 1], p) <= 0) {
            parteInferior.pop();
        }
        parteInferior.push(p);
    }

    const parteSuperior = [];
    for (let i = puntos.length - 1; i >= 0; i--) {
        const p = puntos[i];
        while (parteSuperior.length >= 2 && productocruz(parteSuperior[parteSuperior.length - 2], parteSuperior[parteSuperior.length - 1], p) <= 0) {
            parteSuperior.pop();
        }
        parteSuperior.push(p);
    }

    // Quitar el último punto de cada parte porque está repetido
    parteSuperior.pop();
    parteInferior.pop();

    // Unir ambas partes
    return parteInferior.concat(parteSuperior);
}

// Función para calcular el producto cruzado
function productocruz(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// Función para detectar intersección de dos segmentos de línea
function interseccion(p1, p2, q1, q2) {
    function orientacion(a, b, c) {
        return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    }
    const o1 = orientacion(p1, p2, q1);
    const o2 = orientacion(p1, p2, q2);
    const o3 = orientacion(q1, q2, p1);
    const o4 = orientacion(q1, q2, p2);
    return (o1 * o2 < 0) && (o3 * o4 < 0);
}

// Función que verifica si un punto está dentro del polígono
function puntoDentro(x, y, poligono) {
    // Verificar si el punto (x, y) está dentro del polígono usando el algoritmo Ray-Casting
    let dentro = false;
    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
        const xi = poligono[i].x, yi = poligono[i].y;
        const xj = poligono[j].x, yj = poligono[j].y;

        const intersecta = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersecta) dentro = !dentro;
    }

    return dentro;
}

// Calcular la distancia euclidiana entre dos puntos en 2D (solo x, y)
function calcularDistancia(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function distanciaDesdePuntoALinea(px, py, p1, p2) {
        // Vector del punto p1 al punto p2
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        // Si los puntos son el mismo, devolver la distancia al punto
        if (dx === 0 && dy === 0) {
            return Math.hypot(px - p1.x, py - p1.y);
        }
        // Proyectar el punto sobre la línea, pero restringir la proyección dentro del segmento
        const t = ((px - p1.x) * dx + (py - p1.y) * dy) / (dx * dx + dy * dy);
        // Asegurarse de que la proyección esté dentro del segmento
        const tClamped = Math.max(0, Math.min(1, t));
        // Punto proyectado sobre el segmento
        const proyX = p1.x + tClamped * dx;
        const proyY = p1.y + tClamped * dy;
        // Calcular la distancia entre el punto proyectado y el punto original
        return Math.hypot(px - proyX, py - proyY);
}

function puntosCercanos(nubeDePuntos, P, cant) {
    // Ordenar los puntos de la nube según su distancia al punto P
    const puntosOrdenados = nubeDePuntos.sort((puntoA, puntoB) => {
        const distanciaA = calcularDistancia(puntoA, P);
        const distanciaB = calcularDistancia(puntoB, P);
        return distanciaA - distanciaB;
    });

    // Retornar los primeros puntos más cercanos
    return puntosOrdenados.slice(0, cant);
}

function puntosCercanosCuadrangulo(nubePuntos, x, y) {
    // Encontrar los 4 puntos cercanos que formen un "cuadrado" en torno al punto (x, y)
    let p1, p2, p3, p4;

    // Ordenar los puntos de la nube por su distancia al punto (x, y)
    const puntosOrdenados = nubePuntos.slice().sort((a, b) => {
        const distA = Math.sqrt((a.x - x) ** 2 + (a.y - y) ** 2);
        const distB = Math.sqrt((b.x - x) ** 2 + (b.y - y) ** 2);
        return distA - distB;
    });

    // Encontrar los 4 puntos más cercanos que formen un "cuadrado" o rectángulo
    for (let i = 0; i < puntosOrdenados.length; i++) {
        const p = puntosOrdenados[i];
        if (!p1 || (p.x <= x && p.y <= y)) p1 = p;
        else if (!p2 || (p.x >= x && p.y <= y)) p2 = p;
        else if (!p3 || (p.x >= x && p.y >= y)) p3 = p;
        else if (!p4 || (p.x <= x && p.y >= y)) p4 = p;

        if (p1 && p2 && p3 && p4) break;
    }

    return [p1, p2, p3, p4].filter(Boolean);
}

function interpolarCubico(t, p0, p1, p2, p3) {
    // Interpolación cúbica de un solo punto
    return (
        p1 +
        0.5 * t * (p2 - p0 + t * (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3 + t * (3.0 * (p1 - p2) + p3 - p0)))
    );
}

function interpolarSplineCubico(t, p0, p1, p2, p3) {
    const a = (-0.5 * p0) + (1.5 * p1) - (1.5 * p2) + (0.5 * p3);
    const b = (p0) - (2.5 * p1) + (2 * p2) - (0.5 * p3);
    const c = (-0.5 * p0) + (0.5 * p2);
    const d = p1;

    return a * Math.pow(t, 3) + b * Math.pow(t, 2) + c * t + d;
}

function interpolarBicubica(puntos, x, y, xInterp, yInterp, spline) {
    // Verificar si el punto {xInterp, yInterp} está dentro de los límites de la matriz 4x4
    const minX = puntos[0].x;
    const maxX = puntos[3].x;
    const minY = puntos[0].y;
    const maxY = puntos[12].y;

    // Si el punto a interpolar está fuera de los límites, retornar la z del punto mas cercano
    if (xInterp < minX || xInterp > maxX || yInterp < minY || yInterp > maxY) {
        return puntos[0].z;
    }    
    // Formatear los 16 puntos en una matriz 4x4
    let z = [];
    for (let i = 0; i < 4; i++) {
        z[i] = [];
        for (let j = 0; j < 4; j++) {
            z[i][j] = puntos[i * 4 + j].z;
        }
    }

    // Calcular la distancia relativa en los ejes x e y
    const tX = (xInterp - x) / (puntos[1].x - puntos[0].x); // Proporción de x entre el primer y segundo punto
    const tY = (yInterp - y) / (puntos[4].y - puntos[0].y); // Proporción de y entre el primer y quinto punto

    // Interpolación en el eje x para cada fila
    let interpolacionX = [];
    for (let i = 0; i < 4; i++) {
        if (spline){
            interpolacionX[i] = interpolarSplineCubico(tX, z[i][0], z[i][1], z[i][2], z[i][3]);
        }else{
            interpolacionX[i] = interpolarCubico(tX, z[i][0], z[i][1], z[i][2], z[i][3]);
        }
    }
    var zinterpolada = 0;
    // Interpolación en el eje y usando los resultados de la interpolación en x
    if (spline){
        zinterpolada = interpolarSplineCubico(tY, interpolacionX[0], interpolacionX[1], interpolacionX[2], interpolacionX[3]);
    }else{
        zinterpolada = interpolarCubico(tY, interpolacionX[0], interpolacionX[1], interpolacionX[2], interpolacionX[3]);
    }
    
    return zinterpolada;
}

function InterpolarSplineBicuadratico(puntos, x, y, xInterp, yInterp) {
    // Verificar si el punto {xInterp, yInterp} está dentro de los límites de la matriz 4x4
    const minX = puntos[0].x;
    const maxX = puntos[3].x;
    const minY = puntos[0].y;
    const maxY = puntos[12].y;

    // Si el punto a interpolar está fuera de los límites, retornar la z del punto mas cercano
     if (xInterp < minX || xInterp > maxX || yInterp < minY || yInterp > maxY) {
        return puntos[0].z;
    }    

    // Formatear los 16 puntos en una matriz 4x4 de valores z
    let z = [];
    for (let i = 0; i < 4; i++) {
        z[i] = [];
        for (let j = 0; j < 4; j++) {
            z[i][j] = puntos[i * 4 + j].z;
        }
    }

    // Calcular las diferencias en las coordenadas
    const tX = (xInterp - x) / (puntos[1].x - puntos[0].x);
    const tY = (yInterp - y) / (puntos[4].y - puntos[0].y);

    // Interpolación cuadrática en el eje x para cada fila (4 veces)
    let interpolacionesX = [];
    for (let i = 0; i < 4; i++) {
        interpolacionesX[i] = (
            z[i][0] * (1 - tX) * (1 - tX) +
            2 * z[i][1] * tX * (1 - tX) +
            z[i][2] * tX * tX
        );
    }

    // Interpolación cuadrática en el eje y utilizando los resultados de la interpolación en x
    const zInterpolada = (
        interpolacionesX[0] * (1 - tY) * (1 - tY) +
        2 * interpolacionesX[1] * tY * (1 - tY) +
        interpolacionesX[2] * tY * tY
    );

    return zInterpolada;
}

function interpolacionThiessen(nubePuntos, voronoi, punto) {
    // Encontrar el polígono de Voronoi que contiene el punto dado
    var zint = Infinity;
    for (i=0;i<voronoi.length;i++){
        if (puntoDentro(punto.x,punto.y,voronoi[i].poligono)) {
            // Si está dentro, retornar el z correspondiente al punto en la nube
            zint = nubePuntos[voronoi[i].indice].z;
            break;
        }
    }
    return zint;
}

// Función para calcular el centro circunscrito de un triángulo
function calcularCentroCircunscrito(p1, p2, p3) {
    const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

    const Ux = ((p1.x * p1.x + p1.y * p1.y) * (p2.y - p3.y) +
                (p2.x * p2.x + p2.y * p2.y) * (p3.y - p1.y) +
                (p3.x * p3.x + p3.y * p3.y) * (p1.y - p2.y)) / D;

    const Uy = ((p1.x * p1.x + p1.y * p1.y) * (p3.x - p2.x) +
                (p2.x * p2.x + p2.y * p2.y) * (p1.x - p3.x) +
                (p3.x * p3.x + p3.y * p3.y) * (p2.x - p1.x)) / D;

    return { x: Ux, y: Uy, z: 0 };
}

function calcularVoronoi(puntos, triangulos) {
    var xMin = parseFloat(document.getElementById('xmin').value);
    var xMax = parseFloat(document.getElementById('xmax').value);
    var yMin = parseFloat(document.getElementById('ymin').value);
    var yMax = parseFloat(document.getElementById('ymax').value);
    let centros=[];
    triangulos.forEach((_, i) => {
        if (i % 3 === 0) {
            const p1 = puntos[triangulos[i]];
            const p2 = puntos[triangulos[i + 1]];
            const p3 = puntos[triangulos[i + 2]];
            // Calcular el centro circunscrito del triángulo
            const centroCircunscrito = calcularCentroCircunscrito(p1, p2, p3);
            // Añadir el centro circunscrito a cada triangulo
            centros.push({triangulo: [triangulos[i],triangulos[i+1],triangulos[i+2]],centro: centroCircunscrito});
        }
    });
    let poligonosVoronoi = [];
    // Iterar sobre cada punto de la nube
    puntos.forEach((_, indicePunto) => {
        // Filtrar los triángulos que contienen el punto actual
        let centrosFiltrados = centros
            .filter(({ triangulo }) => triangulo.includes(indicePunto))
            .map(({ centro }) => centro); // Obtener solo los centros circunscritos
        // Si hay centros circunscritos asociados al punto, añadir al arreglo de polígonos
        if (centrosFiltrados.length > 0) {
            //ordenar los centrosFiltrados
            centrosFiltrados.sort((a, b) => {
                const anguloA = Math.atan2(a.y - puntos[indicePunto].y, a.x - puntos[indicePunto].x);
                const anguloB = Math.atan2(b.y - puntos[indicePunto].y, b.x - puntos[indicePunto].x);
                return anguloA - anguloB;
            });
            var agregar=true;
            for (i=0;i<centrosFiltrados.length;i++){
                var p = centrosFiltrados[i];
                if (p.x > xMax || p.y > yMax || p.x < xMin || p.y < yMin){
                    agregar=false
                }
            }
            if (agregar){
                //agregar la componente z a cada vertice
                centrosFiltrados.forEach(vertice =>{
                    const zinterpolada = interpolacionInversaDistancia(puntos,vertice)
                    vertice.z = zinterpolada;
                })
                poligonosVoronoi.push({
                    indice: indicePunto,
                    poligono: centrosFiltrados
                });
            }
        }
    });

    return poligonosVoronoi;
}

function interpolacionInversaDistancia(puntos,vertice){
    let puntosCercanos = puntos.map(p => {
        let distancia = Math.sqrt(Math.pow(p.x - vertice.x, 2) + Math.pow(p.y - vertice.y, 2));
        return { ...p, distancia };
    }).sort((a, b) => a.distancia - b.distancia).slice(0, 3); // Obtén los 3 más cercanos

    // Realiza una interpolación inversa a la distancia para calcular z
    let sumaInversaDistancia = 0;
    let sumaZInversaDistancia = 0;
    puntosCercanos.forEach(p => {
        if (p.distancia !== 0) {
            let inversaDistancia = 1 / p.distancia;
            sumaInversaDistancia += inversaDistancia;
            sumaZInversaDistancia += p.z * inversaDistancia;
        } else {
            // Si el punto está justo en el vértice, asigna directamente su z
            return p.z;
        }
    });
    return sumaZInversaDistancia / sumaInversaDistancia;
}

function resolverSistemaMinimosCuadrados(A, b) {
    const det = math.det(A);
    let coef = null;
    if (det!==0){
        const A_pinv = math.pinv(A);
        coef = math.multiply(A_pinv, b)
    }
    return coef;
}

function minimosCuadradosAjustados(nubePuntos,puntoGrilla,k,grado) {
    if (grado===2){k=6;}
    let vecinos = puntosCercanos(nubePuntos,puntoGrilla,k);
    var zInterpolada = Infinity;
    let n = vecinos.length;
    // Si hay menos de k vecinos, no se puede ajustar un polinomio
    if (n >= (grado === 1 ? 3 : 6)) {
        let A=[];
        let b=[];
        let coef=[];
        if (grado === 1) {
            // Polinomio de primer grado: z = ax + by + c
            let sumX = 0, sumY = 0, sumZ = 0;
            let sumX2 = 0, sumY2 = 0, sumXY = 0, sumXZ = 0, sumYZ = 0;
            vecinos.forEach(p => {
                sumX += p.x;
                sumY += p.y;
                sumZ += p.z;
                sumX2 += p.x * p.x;
                sumY2 += p.y * p.y;
                sumXY += p.x * p.y;
                sumXZ += p.x * p.z;
                sumYZ += p.y * p.z;
            });
            // Matriz de coeficientes para z = ax + by + c
            A = [
                [sumX2, sumXY, sumX],
                [sumXY, sumY2, sumY],
                [sumX, sumY, n]
            ];
            // Vector b
            b = [sumXZ, sumYZ, sumZ];
        } else if (grado === 2) {
            vecinos.forEach(p => {
                let x = p.x, y = p.y, z = p.z;
                let x2 = x * x, y2 = y * y, xy = x * y;

                // Añadir las filas de la matriz A y el vector B
                A.push([x2, y2, xy, x, y, 1]);
                b.push(z);
            });
        }
        try {
            coef = math.lusolve(A, b);
        } catch (e) {
            coef = resolverSistemaMinimosCuadrados(A, b);
        }
        if (coef){
            let xg = puntoGrilla.x;
            let yg = puntoGrilla.y;
            if (grado===1){
                let a = coef[0][0];
                let b = coef[1][0];
                let c = coef[2][0];
                zInterpolada = a * xg + b * yg + c;    
            }else if(grado===2){
                let a = coef[0][0];
                let b = coef[1][0];
                let c = coef[2][0];
                let d = coef[3][0];
                let e = coef[4][0];
                let f = coef[5][0];
                let x2 = xg * xg;
                let y2 = yg * yg;
                let xy = xg * yg;
                zInterpolada = a * x2 + b * y2 + c * xy + d * xg + e * yg + f;
            }
        }
    }
    return zInterpolada;
}

function idwInterpolation(nubePuntos,puntoGrilla,potencia){
    var zInterpolada;
    var numerador=0;
    var denominador=0;
    nubePuntos.forEach(puntoNube => {
        let distancia = calcularDistancia(puntoGrilla,puntoNube)
        if (distancia === 0) {
            zInterpolada = puntoNube.z;
            return zInterpolada;
        }
        // Inversa de la distancia elevada a la potencia
        let peso = 1 / Math.pow(distancia, potencia);
        // Sumar al numerador y al denominador
        numerador += peso * puntoNube.z;
        denominador += peso;
    });
    zInterpolada = numerador / denominador;
    return zInterpolada
}

function interpolanteRBF(distancia, epsilon, tipo) {
    let ret=1;
    if (distancia > 0){
        if (tipo===1){   //Bessel
            ret = Math.sin(distancia) / distancia;
        }else if(tipo===2){   //Neumann simplificada
            ret = -Math.cos(distancia) / distancia;
        }else if(tipo===3){   //Gausiana
            ret = Math.exp(- ((epsilon * distancia) ** 2));
        }else if(tipo===4){   //Lineal
            ret = 1 / (1 + distancia);
        }else if(tipo===5){  //Exponencial
            ret = Math.exp(-distancia);
        }else if(tipo===6){   //Cubica
            if (distancia < 1) {
                ret = (1 - distancia) ** 3;
            } else {
                ret = 0.5 * (1 / distancia ** 3);
            }
        }else if(tipo===7){   //Cuadratica
            if (distancia < 1) {
                ret = (1 - distancia) ** 2;
            } else {
                ret = 0.5 * (1 / distancia ** 2);
            }
        }else if(tipo===8){   //Multicuadratica
            ret = Math.sqrt(distancia ** 2 + epsilon ** 2);
        }else if(tipo===9){   //Multicuadratica Inversa
            if (distancia === 0) {
                ret = 1 / epsilon; 
            }else{
                ret = 1 / Math.sqrt(distancia ** 2 + epsilon ** 2);
            }
        }else if(tipo===10){   //Thin Plate Spline (TPS)
            if (distancia === 0) {
                ret = 0; 
            }else{
                ret = distancia * distancia * Math.log(distancia);
            }
        
        }
    }
    return ret;
}

function interpolacionRBF(nubePuntos, puntoGrilla, vecinos, epsilon, tipo){
    let A = [];
    let b = [];
    let pesos=[];
    let suma = 0;
    let pesoTotal = 0;
    let zInterpolada = Infinity;
    let puntosCercanos = nubePuntos.map(p => {
        let distancia = calcularDistancia(p,puntoGrilla);
        return { ...p, distancia };
    }).sort((a, b) => a.distancia - b.distancia).slice(0, vecinos);

    // Crear la matriz A usando la función de Bessel seleccionada para cada par de puntos en la nube
    for (let i = 0; i < puntosCercanos.length; i++) {
       A[i] = [];
       for (let j = 0; j < puntosCercanos.length; j++) {
           let distancia = calcularDistancia(puntosCercanos[i],puntosCercanos[j]);
           A[i][j] = interpolanteRBF(distancia,epsilon,tipo);
       }
       b.push(puntosCercanos[i].z); // Los valores z de los puntos
    }
    try {
        pesos = math.lusolve(A, b);
    } catch (e) {
        pesos = resolverSistemaMinimosCuadrados(A, b);
    }
    if (pesos){
        for (let k = 0; k < puntosCercanos.length; k++) {
            let distancia = calcularDistancia(puntoGrilla,puntosCercanos[k]);
            let peso = pesos[k][0] * interpolanteRBF(distancia,epsilon,tipo);
            suma += peso * puntosCercanos[k].z;
            pesoTotal += Math.abs(peso);
        }
        zInterpolada = suma / pesoTotal;
    }
    return zInterpolada;
}

function crearCalculadorVolumen(vertices,factorZ) {
    return function() {
        let volumenArriba = 0;
        let volumenAbajo = 0;
        const zRef = parseFloat(document.getElementById('referenciaZ').value); 
        const lienzoVolumen = document.getElementById('lienzoVolumen');        
        const canvasHeight = lienzoVolumen.height;
        const canvasWidth = lienzoVolumen.width;
        let xMin = parseFloat(document.getElementById('xmin').value);
        let xMax = parseFloat(document.getElementById('xmax').value);
        let yMin = parseFloat(document.getElementById('ymin').value);
        let yMax = parseFloat(document.getElementById('ymax').value);

        for (let i = 0; i < vertices.length; i += 9) {
            // Obtener los puntos p1, p2, p3 de cada triángulo
            const p1 = { 
                x: desescalarX(vertices[i],canvasWidth,xMin,xMax), 
                y: desescalarY(vertices[i + 1],canvasHeight,yMin,yMax), 
                z: parseFloat((vertices[i + 2] / factorZ).toFixed(2))};
            const p2 = { 
                x: desescalarX(vertices[i + 3],canvasWidth,xMin,xMax), 
                y: desescalarY(vertices[i + 4],canvasHeight,yMin,yMax), 
                z: parseFloat((vertices[i + 5] / factorZ).toFixed(2))};
            const p3 = { 
                x: desescalarX(vertices[i + 6],canvasWidth,xMin,xMax), 
                y: desescalarY(vertices[i + 7],canvasHeight,yMin,yMax), 
                z: parseFloat((vertices[i + 8] / factorZ).toFixed(2))};

            // Casos según las posiciones relativas de los puntos respecto a zRef
            const posiciones = [p1.z >= zRef, p2.z >= zRef, p3.z >= zRef];
            // Todos los vértices por encima de zRef
            if (posiciones.every(pos => pos)) {
                volumenArriba += calcularVolumenTetraedro(p1, p2, p3,zRef);
            }
            // Todos los vértices por debajo de zRef
            else if (posiciones.every(pos => !pos)) {
                volumenAbajo += calcularVolumenTetraedro(p1, p2, p3,zRef);
            }
            // El triángulo cruza el plano zRef, dividir en sub-triángulos
            else {
                const { volumenArribaTri, volumenAbajoTri } = dividirTriangulo(p1, p2, p3, zRef);
                volumenArriba += volumenArribaTri;
                volumenAbajo += volumenAbajoTri;
            }
        }
        document.getElementById('volumenSobre').innerText = volumenArriba.toFixed(2);
        document.getElementById('volumenBajo').innerText = volumenAbajo.toFixed(2);
        document.getElementById('volumenTotal').innerText = (volumenArriba + volumenAbajo).toFixed(2);

//        return { volumenArriba, volumenAbajo };
    };
}

// Función auxiliar para calcular el volumen de un tetraedro
function calcularVolumenTetraedro(p1, p2, p3,zRef) {
    let AB = {x: p1.x-p2.x, y: p1.y-p2.y, z: p1.z-p2.z};
    let AC = {x: p1.x-p3.x, y: p1.y-p3.y, z: p1.z-p3.z};
    let prodVec  = {
        x: AB.y * AC.z - AB.z * AC.y,
        y: AB.z * AC.x - AB.x * AC.z,
        z: AB.x * AC.y - AB.y * AC.x
    };
    let areaABC = Math.sqrt(
        Math.pow(prodVec.x, 2) +
        Math.pow(prodVec.y, 2) +
        Math.pow(prodVec.z, 2)
    )/2;
    let h = (Math.abs(p1.z-zRef)+Math.abs(p2.z-zRef)+Math.abs(p3.z-zRef))/3;
    return areaABC * h;
}

// Función para calcular el punto de intersección entre dos puntos y el plano zRef
function interpolarPunto(v1, v2, zRef) {
    const t = (zRef - v1.z) / (v2.z - v1.z);
    return {
        x: v1.x + t * (v2.x - v1.x),
        y: v1.y + t * (v2.y - v1.y),
        z: zRef
    };
}

// Función para dividir un triángulo en sub-triángulos en función de zRef
function dividirTriangulo(v0, v1, v2, zRef) {
    // Separar los vértices en dos grupos: por encima y por debajo de zRef
    const arriba = [v0, v1, v2].filter(v => v.z >= zRef);
    const abajo = [v0, v1, v2].filter(v => v.z < zRef);

    // Si hay dos vértices en un lado y uno en el otro, generamos dos sub-triángulos
    if (arriba.length === 2 && abajo.length === 1) {
        const [a, b] = arriba;
        const c = abajo[0];

        // Calcular intersecciones entre los bordes del triángulo y el plano zRef
        const p1 = interpolarPunto(c, a, zRef);
        const p2 = interpolarPunto(c, b, zRef);

        // Triángulo por encima de zRef
        const volumenArribaTri = calcularVolumenTetraedro(a, b, p1,zRef) + calcularVolumenTetraedro(b, p1, p2,zRef);

        // Triángulo por debajo de zRef
        const volumenAbajoTri = calcularVolumenTetraedro(c, p1, p2,zRef);

        return { volumenArribaTri, volumenAbajoTri };
    }

    // Si hay dos vértices por debajo y uno por encima, invertimos el cálculo
    if (arriba.length === 1 && abajo.length === 2) {
        const [a] = arriba;
        const [b, c] = abajo;

        // Calcular intersecciones entre los bordes del triángulo y el plano zRef
        const p1 = interpolarPunto(a, b, zRef);
        const p2 = interpolarPunto(a, c, zRef);

        // Triángulo por encima de zRef
        const volumenArribaTri = calcularVolumenTetraedro(a, p1, p2,zRef);

        // Triángulo por debajo de zRef
        const volumenAbajoTri = calcularVolumenTetraedro(b, c, p1,zRef) + calcularVolumenTetraedro(c, p1, p2,zRef);

        return { volumenArribaTri, volumenAbajoTri };
    }

    return { volumenArribaTri: 0, volumenAbajoTri: 0 };
}