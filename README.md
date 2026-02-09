# TransCoordArg

**TransCoordArg** es una aplicación web integral diseñada para la transformación de coordenadas geodésicas y el procesamiento de Modelos Digitales del Terreno (MDT). Desarrollada con un enfoque en la geodesia argentina, incluye herramientas avanzadas para cálculos de volúmenes, interpolación de superficies y visualización 3D.

## 🚀 Características Principales

### 🌐 Módulo de Transformación de Coordenadas
*   **Sistemas de Referencia:** Conversión entre coordenadas Geodésicas, Geocéntricas y Proyectadas (Gauss-Krüger, UTM, etc.).
*   **Modelos de Velocidades (VEL-AR):** Cálculo de coordenadas en época actual aplicando velocidades intersísmicas y saltos cosísmicos (Sismos de Maule 2010 e Illapel 2015).
*   **Modelos de Geoide:** Cálculo de ondulación del geoide utilizando modelos **AR16**, **EGM2008** y **EGM96**.
*   **Procesamiento por Lotes:** Carga de archivos (CSV, Excel, GPX, KML, KMZ, DXF) para transformación masiva de puntos.
*   **Visualización en Mapa:** Integración con **Leaflet** para visualizar puntos de origen y destino.
*   **Exportación:** Generación de reportes en Excel, DXF, GPX y KML.

### 🏔️ Módulo MDT (Modelo Digital del Terreno)
*   **Importación de Datos:** Soporte para nubes de puntos desde CSV, Excel y DXF.
*   **Interpolación de Grillas:**
    *   Métodos determinísticos: IDW (Inversa de la Distancia), Vecino más cercano, Bilineal, Bicúbica.
    *   Métodos geoestadísticos: **Kriging**.
    *   Splines: Bicuadrático, Bicúbico.
    *   **RBF (Radial Basis Functions):** Multicuadrática, Thin Plate Spline, Gaussiana, Bessel, etc.
    *   Ajuste por Mínimos Cuadrados (Polinomios).
*   **Triangulación y Polígonos:**
    *   Triangulación de Delaunay.
    *   Polígonos de Voronoi.
*   **Curvas de Nivel:** Generación automática mediante algoritmos como *Marching Squares* y triangulación.
*   **Cálculo de Volúmenes:** Cálculo preciso de volúmenes sobre y bajo un plano de referencia mediante descomposición en tetraedros.
*   **Visualización 3D:** Renderizado de superficies y volúmenes utilizando **Three.js** (WebGL).
*   **Edición Gráfica:** Herramientas de selección, borrado y edición de puntos, triángulos y grillas directamente en el canvas.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3 (Diseño responsivo), JavaScript (ES6+).
*   **Backend:** PHP (Procesamiento de cálculos geodésicos y manejo de grillas).
*   **Librerías JavaScript:**
    *   [Three.js](https://threejs.org/): Visualización 3D.
    *   [Leaflet](https://leafletjs.com/): Mapas interactivos.
    *   [D3.js](https://d3js.org/): Triangulación de Delaunay y Voronoi.
    *   [SheetJS (xlsx)](https://sheetjs.com/): Manejo de archivos Excel.
    *   [Math.js](https://mathjs.org/): Cálculos matemáticos complejos (matrices).
    *   [Kriging.js](https://github.com/oeo/kriging): Interpolación Kriging.

## 📋 Requisitos de Instalación

Para ejecutar este proyecto localmente, necesitas un servidor web con soporte PHP (como XAMPP, WAMP, o Apache/Nginx con PHP).

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/TransCoordArg.git
    ```

2.  **Ubicación:**
    Copia la carpeta del proyecto en el directorio raíz de tu servidor web (ej. `C:\xampp\htdocs\TransCoordArg`).

3.  **Configuración de Grillas:**
    Asegúrate de que la carpeta `grids/` contenga los archivos de modelos necesarios (ej. `ALTar16.txt`, `vel-ar-lin.txt`, etc.) para que los cálculos PHP funcionen correctamente.

4.  **Ejecución:**
    Abre tu navegador y accede a:
    `http://localhost/TransCoordArg/`

## 📂 Estructura del Proyecto

```text
TransCoordArg/
├── css/
│   └── transcoord.css       # Estilos principales
├── js/
│   ├── mdt.js               # Lógica principal del MDT y Canvas
│   ├── funcionesMdt.js      # Algoritmos matemáticos (Interpolación, Volúmenes)
│   ├── funcionesJS.js       # Lógica de transformación de coordenadas
│   ├── threeWebGL2.js       # Renderizado 3D
│   └── usuario.js           # Gestión de SCR de usuario
├── php/
│   ├── velar.php            # Lógica del modelo de velocidades VEL-AR
│   ├── geoides.php          # Cálculo de ondulación (N)
│   ├── calcular.php         # Controlador de cálculos
│   └── ...
├── grids/                   # Archivos de datos geodésicos (No incluidos en repo por defecto)
└── index.html               # Punto de entrada (asumido)
