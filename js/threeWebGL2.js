import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let escena, camara, renderer, controls;

export function inicializarEscena(canvas,vertices) {
    // Guardar el estado actual de la cámara y los controles
    const previousCameraPosition = camara ? camara.position.clone() : null;
    const previousTarget = controls ? controls.target.clone() : null;

    limpiarEscena();
    let xMin = parseFloat(document.getElementById('xmin').value);
    let xMax = parseFloat(document.getElementById('xmax').value);
    let yMin = parseFloat(document.getElementById('ymin').value);
    let yMax = parseFloat(document.getElementById('ymax').value);
    let zMin = parseFloat(document.getElementById('zmin').value);
    let zMax = parseFloat(document.getElementById('zmax').value);
    let zRef = parseFloat(document.getElementById('referenciaZ').value);
    let factorZ = parseFloat(document.getElementById('factorZ').value);
    const color = document.getElementById('colorVolumen').value;
    const colorPlano = document.getElementById('colorPlano').value;
    const rangoLuzA = parseFloat(document.getElementById('rangoLuzA').value);
    const rangoLuzD = parseFloat(document.getElementById('rangoLuzD').value);
    const mallaAlambre = !document.getElementById('mallaAlambre').checked;
    const siplanoRef = !document.getElementById('planoReferencia').checked;
    let x = xMin + (xMax-xMin)/2;
    let y = yMin + (yMax-yMin)/2;  
    let xCen = ((x - xMin) / (xMax - xMin)) * canvas.clientWidth 
    let yCen = ((y - yMin) / (yMax - yMin)) * canvas.clientHeight;
    let zCen = (zMin + (zMax-zMin)/2)*factorZ;

    // Configuración inicial de la escena
    escena = new THREE.Scene();
    camara = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);

    // Configuración del renderizador usando el canvas pasado
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xffffff, 1);
    // Control de órbita
    controls = new OrbitControls(camara, renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.MeshLambertMaterial({ 
        color: color,
        wireframe: mallaAlambre,
        flatShading: true,
        side: THREE.DoubleSide
    });
    const malla = new THREE.Mesh(geometry, material);

    const box = new THREE.Box3().setFromObject(malla);
    const size = box.getSize(new THREE.Vector3());
    malla.position.set(-xCen, -zCen, yCen); // Posicionar la malla en el centro  (xCen,zCen,yCen)
    malla.rotation.x = -Math.PI / 2;
    escena.add(malla);
    if(siplanoRef){
        //creamos el plano de referencia
        const geometryPlano = new THREE.PlaneGeometry(size.x, size.y);
        const materialPlano = new THREE.MeshBasicMaterial({ color: colorPlano, side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3 });
        const plano = new THREE.Mesh(geometryPlano, materialPlano);
        const boxPlano = new THREE.Box3().setFromObject(plano);
        const center = boxPlano.getCenter(new THREE.Vector3());

        plano.position.set(center.x, (zRef*factorZ)-zCen, center.y); // Posicionar la malla en el centro  (xCen,zCen,yCen)
        plano.rotation.x = -Math.PI / 2;
        escena.add(plano);
    }

    // Luz ambiental para mejor visualización
    const ambientLight = new THREE.AmbientLight(0xffffff, rangoLuzA); // Luz ambiental suave
    escena.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, rangoLuzD); // Luz direccional intensa
    directionalLight.position.set(150, 150, 100).normalize();
    escena.add(directionalLight);
    //escena.add( new THREE.AxesHelper( 500) );
    //escena.add( new THREE.CameraHelper( camara ));

    // Restaurar la posición y el objetivo de la cámara si estaban definidos anteriormente
    if (previousCameraPosition) {
        camara.position.copy(previousCameraPosition);
    }else{
        // Posicionar cámara si no hay un estado previo
        const maxDimension = Math.max(size.x, size.y, size.z);
        //camara.position.set(0, maxDimension, maxDimension * 1.5);
        camara.position.set(0, 0, maxDimension);
    }
    if (previousTarget) {
        controls.target.copy(previousTarget);
    } else {
        controls.target.set(0,0,0);
    }

    camara.lookAt(0,0,0); // Mira hacia el origen
    controls.target.set(0,0,0);
    camara.updateProjectionMatrix();
    controls.update();

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(escena, camara);
}

function limpiarEscena(){
    if (escena) {
        // Recorre todos los objetos en la escena para liberar sus recursos
        escena.traverse((objeto) => {
            if (objeto.isMesh) {
                // Liberar geometría
                if (objeto.geometry) objeto.geometry.dispose();

                // Liberar material (manejar caso de array de materiales)
                if (objeto.material) {
                    if (Array.isArray(objeto.material)) {
                        objeto.material.forEach(mat => mat.dispose());
                    } else {
                        objeto.material.dispose();
                    }
                }
            }
        });

        // Elimina la escena y la cámara
        escena.clear();
        escena = null;
    }

    // Libera el control de órbita si ya está creado
    if (controls) {
        controls.dispose();
        controls = null;
    }

    // Libera el renderer
    if (renderer) {
        renderer.clear();
        renderer.setRenderTarget(null);
        renderer.dispose();
    }
}

export function limpiarRenderer(){
//    renderer.clear();
//    renderer.setRenderTarget(null);
//    renderer.dispose();
    limpiarEscena();

}