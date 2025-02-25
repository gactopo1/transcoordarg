<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = $_GET['server'];
$username = $_GET['usuario'];
$password = $_GET['clave'];
$dbname = $_GET['nombre'];
$action = $_GET['action'];
  
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

try {
    if ($action == 'clone') {
        $response = [];

        // Obtener lista de tablas
        $tables = $conn->query("SHOW TABLES");
        while ($table = $tables->fetch_array()) {
            $tableName = $table[0];

            // Obtener estructura de la tabla
            $createTableResult = $conn->query("SHOW CREATE TABLE `$tableName`")->fetch_assoc();
            $createTableStatement = $createTableResult['Create Table'];

            $response[$tableName]['structure'] = $createTableStatement;

            // Obtener datos de la tabla
            $data = $conn->query("SELECT * FROM `$tableName`");
            $response[$tableName]['data'] = [];
            while ($row = $data->fetch_assoc()) {
                $response[$tableName]['data'][] = $row;
            }
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    // Cierre seguro de la conexión
    $conn->close();
}
exit();