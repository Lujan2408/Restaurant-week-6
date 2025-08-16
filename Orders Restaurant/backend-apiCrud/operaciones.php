<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

 include("conexion.php");

 // Conexión a la base de datos
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// Función para verificar el inicio de sesión
function login($usuario, $contrasena) {
    global $db;
    try{
        $stmt = $db->prepare("SELECT * FROM roles WHERE usuario = :usuario AND contrasena = :contrasena");
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();

        if ($stmt->rowCount() > 0 ) {
            //usuario encontrado
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            //echo json_encode($row);
            return $row;
        }

        return false;
    }catch( PDOExeption $e ){
        // Manejar errores de la base de datos
        die("Error al verificar el inicio de sesión: " . $e->getMessage());
    }
}

//funcion para crear productos en la base de datos
function getProducts($nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    $stmt = $db->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (:nombre, :descripcion, :precio, :stock, :imagen)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':imagen', $imagen);
    $stmt->execute();
    echo json_encode(array("message" => "Producto creado con exito"));
}

function updateProducts($id, $nombre, $descripcion, $precio, $stock, $imagen){
    global $db;
    $stmt = $db->prepare("UPDATE productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, stock = :stock, imagen = :imagen WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':imagen', $imagen);
    $stmt->execute();
    echo json_encode(array("message" => "Producto actualizado con exito"));
}

function deleteProduct($id){
    global $db;
    $stmt = $db->prepare("DELETE FROM productos WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    echo json_encode(array("message" => "Producto eliminado con exito"));
}

function sendClient($nombre, $apellido, $email, $celular, $direccion, $direccion2,$notas){
    global $db;
    $stmt = $db->prepare("INSERT INTO clientes (nombre, apellido, email, celular, direccion, direccion2, descripcion) VALUES (:nombre, :apellido, :email, :celular, :direccion, :direccion2, :descripcion)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':celular', $celular);
    $stmt->bindParam(':direccion', $direccion);
    $stmt->bindParam(':direccion2', $direccion2);
    $stmt->bindParam(':descripcion', $notas);
    $stmt->execute();
    $id_cliente = $db->lastInsertId();
    //echo json_encode(array("message" => "Producto creado con exito"));
    return $id_cliente;
}

function sendOrder($id_cliente, $descuento, $metodo_pago, $aumento){
    global $db;
    $stmt = $db->prepare("INSERT INTO pedido (id_cliente, descuento, metodo_pago, aumento) VALUES (:id_cliente, :descuento, :metodo_pago, :aumento)");
    $stmt->bindParam(':id_cliente', $id_cliente);
    $stmt->bindParam(':descuento', $descuento);
    $stmt->bindParam(':metodo_pago', $metodo_pago);
    $stmt->bindParam(':aumento', $aumento);
    $stmt->execute();
    $id_pedido = $db->lastInsertId();
    //echo json_encode(array("message" => "Producto creado con exito"));
    return $id_pedido;
}

function sendORderDetail($id_pedido, $id_producto, $precio, $cantidad){
    global $db;
    $stmt = $db->prepare("INSERT INTO detalle_pedido (id_pedido, id_producto, precio, cantidad) VALUES (:id_pedido, :id_producto, :precio, :cantidad)");
    $stmt->bindParam(':id_pedido', $id_pedido);
    $stmt->bindParam(':id_producto', $id_producto);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':cantidad', $cantidad);
    $stmt->execute();
    echo json_encode(array("message" => "Pedido creado con exito"));
}