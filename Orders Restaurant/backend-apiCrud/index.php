<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

require("operaciones.php");
$ruta = $_GET['url'] ?? '';
//echo $ruta;
if ($ruta === 'login') {
    // Verificar si se recibieron datos del usuario
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del inicio de sesión desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        //echo json_encode($data);
        $usuario = $data['usuario'];
        $contrasena = $data['contrasena'];

        // Verificar el inicio de sesión
        $userData = login($usuario, $contrasena);
        //echo json_encode($userData);
        if ($userData) {
            // Usuario autenticado, devolver los datos del usuario en formato JSON
            http_response_code(200);
            echo json_encode($userData);
        } else {
            // Credenciales incorrectas
            http_response_code(401);
            echo json_encode(array("message" => "Credenciales incorrectas"));
        }
    } else {
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Metodo no permitido"));
    }
}else if ($ruta === 'productos') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Consultar productos
        $stmt = $db->query("SELECT * FROM productos");
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($productos);
    }elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Crear producto (solo permitido para administradores)
        // Recibir datos del producto desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = $data['precio'];
        $stock = $data['stock'];
        $imagen = $data['imagen'];
        //pasar los datos a la funcion
        getProducts($nombre, $descripcion, $precio, $stock, $imagen);
    }elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
         // Actualizar producto (solo permitido para administradores)
        // Recibir datos del producto desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $precio = $data['precio'];
        $stock = $data['stock'];
        $imagen = $data['imagen'];
        updateProducts($id, $nombre, $descripcion, $precio, $stock, $imagen);
    }elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Eliminar producto (solo permitido para administradores)
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'];
        deleteProduct($id);
    } else {
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
}else if($ruta === 'pedidos'){
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Crear pedido (solo permitido para administradores)
        // Recibir datos del pedido desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        $nombre = $data['nombre'];
        $apellido = $data['apellido'];
        $email = $data['email'];
        $celular = $data['celular'];
        $direccion = $data['direccion'];
        $direccion2 = $data['direccion2'];
        $notas = $data['descripcion'];
        $descuento = $data['descuento'];
        $aumento = $data['aumento'];
        $metodo_pago = $data['metodo_pago'];
        $id_producto = $data['id_producto'];
        $precio = $data['precio'];
        $cantidad = $data['cantidad'];
        //pasar los datos a la funcion
        $id_cliente = sendClient($nombre, $apellido, $email, $celular, $direccion, $direccion2,$notas);
        $id_pedido = sendOrder($id_cliente, $descuento, $metodo_pago, $aumento);
        sendORderDetail($id_pedido, $id_producto, $precio, $cantidad);
    }
}else{
    http_response_code(404);
    echo json_encode(array("message" => "Ruta no encontrada"));
}

//INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen`, `created_at`, `updated_at`) VALUES (1, 'Hamburgueza', 'Hamburguesa doble carne', '30000', '10', 'https://www.irenemilito.it/wp-content/uploads/2017/03/23-double-bacon-cheeseburger.w710.h473.jpg', current_timestamp(), current_timestamp());