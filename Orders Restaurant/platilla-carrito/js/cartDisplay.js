
function productCarrito() {
    console.log("=== INICIANDO mostrarProductosCarrito ===");
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let cartTableBody = document.querySelector(".cart-table tbody");
    
    console.log("Productos en carrito:", carrito.length);
    console.log("Tabla encontrada:", !!cartTableBody);
    

    if (!cartTableBody) {
        console.log("No se encontró la tabla del carrito - no estamos en cart.html");
        return;
    }
    
    cartTableBody.innerHTML = "";
    

    if (carrito.length === 0) {
        carritoVacio(cartTableBody);
        updateResumeCart(0);
        return;
    }
    
    let subtotalGeneral = 0;
    

    carrito.forEach((producto, index) => {
        let cantidad = producto.cantidad || 1;
        let precioUnitario = parseFloat(producto.precio) || 0;
        let subtotalProducto = precioUnitario * cantidad;
        subtotalGeneral += subtotalProducto;
        
        console.log(`Producto ${index + 1}: ${producto.nombre} - Cantidad: ${cantidad} - Subtotal: $${subtotalProducto.toFixed(2)}`);
        

        let filaProducto = crearFilaProducto(producto, index, cantidad, precioUnitario, subtotalProducto);
        cartTableBody.appendChild(filaProducto);
    });
    
    console.log(`Subtotal general: $${subtotalGeneral.toFixed(2)}`);
    
    updateResumeCart(subtotalGeneral);
    
    console.log("=== FINALIZANDO mostrarProductosCarrito ===");
}


function crearFilaProducto(producto, index, cantidad, precioUnitario, subtotalProducto) {
    let fila = document.createElement("tr");
    fila.setAttribute("data-index", index);
    
    fila.innerHTML = `
        <td class="product-block">
            <a href="#" class="remove-from-cart-btn" onclick="eliminarProductoDelCarrito(${index})" 
               style="color: red; margin-right: 10px; font-size: 18px; text-decoration: none;">
                <i class="fa-solid fa-x"></i>
            </a>
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;">
            <a href="#" class="h6" style="text-decoration: none; color: #333;">
                ${producto.nombre}
                <br><small class="text-muted">${producto.descripcion || ''}</small>
            </a>
        </td>
        <td>
            <p class="lead color-black">$${precioUnitario.toFixed(2)}</p>
        </td>
        <td style="vertical-align: middle;">
            <div class="quantity quantity-wrap d-flex align-items-center">
                <button class="btn btn-outline-secondary btn-sm" onclick="decrementarCantidadProducto(${index})" style="margin-right: 10px;">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <input type="text" value="${cantidad}" maxlength="2" size="2" class="form-control text-center" 
                       style="width: 60px; margin: 0 5px;" readonly>
                <button class="btn btn-outline-secondary btn-sm" onclick="incrementarCantidadProducto(${index})" style="margin-left: 10px;">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </td>
        <td>
            <h6 class="color-primary">$${subtotalProducto.toFixed(2)}</h6>
        </td>
    `;
    
    return fila;
}

function carritoVacio(cartTableBody) {
    cartTableBody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-5">
                <div style="padding: 40px;">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 48px; color: #ffc800; margin-bottom: 20px;"></i>
                    <h5 class="mb-3">Tu carrito está vacío</h5>
                    <p class="lead mb-4">¡Agrega algunos deliciosos productos para comenzar tu pedido!</p>
                    <a href="index.html" class="btn btn-primary" style="background-color: #ffc800; border-color: #ffc800;">
                        <i class="fa-solid fa-arrow-left"></i> Continuar Comprando
                    </a>
                </div>
            </td>
        </tr>
    `;
}


function updateResumeCart(subtotal) {
    console.log("=== ACTUALIZANDO RESUMEN DE CARRITO ===");
    
    let valorDomicilio = 5.00;
    let descuentoPromo = 5.00;
    let total = subtotal + valorDomicilio - descuentoPromo;
    
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`Valor domicilio: $${valorDomicilio.toFixed(2)}`);
    console.log(`Descuento: -$${descuentoPromo.toFixed(2)}`);
    console.log(`Total: $${total.toFixed(2)}`);
    

    let subtotalElement = document.querySelector('.cart-summary .d-flex:nth-child(1) .lead:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        console.log("✅ Subtotal actualizado");
    }

    let totalElement = document.querySelector('.cart-summary h5.color-primary:last-child');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
        console.log("✅ Total actualizado");
    }
    
    console.log("=== RESUMEN ACTUALIZADO ===");
}

function increaseProductQuantity(index) {
    console.log(`Incrementando cantidad del producto en index: ${index}`);
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        console.log(`Nueva cantidad: ${carrito[index].cantidad}`);
        
   
        productCarrito();
        actualizarContadorCarrito();
    }
}

function dicreaseProductQuantity(index) {
    console.log(`Decrementando cantidad del producto en index: ${index}`);
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (carrito[index] && (carrito[index].cantidad || 1) > 1) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) - 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        console.log(`Nueva cantidad: ${carrito[index].cantidad}`);
        
        productCarrito();
        actualizarContadorCarrito();
    }
}

function eliminarProductoDelCarrito(index) {
    console.log(`Eliminando producto en index: ${index}`);
    
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        if (carrito[index]) {
            console.log(`Eliminando: ${carrito[index].nombre}`);
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            
            // Recargar la vista del carrito
            productCarrito();
            actualizarContadorCarrito();
            
            console.log("✅ Producto eliminado exitosamente");
        }
    }
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let iconCount = document.querySelector(".contar-pro");
    
    if (iconCount) {
        let totalCantidad = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
        iconCount.textContent = totalCantidad;
        console.log(`Contador actualizado: ${totalCantidad} productos`);
    }
}

function inicializarCarrito() {
    console.log("=== INICIALIZANDO CARRITO ===");
    
    if (document.querySelector(".cart-table")) {
        console.log("Detectada página cart.html - mostrando productos");
        productCarrito();
        actualizarContadorCarrito();
    } else {
        console.log("No estamos en cart.html");
    }
}

document.addEventListener("DOMContentLoaded", inicializarCarrito);


function procesarPedido() {
    console.log("=== PROCESANDO PEDIDO ===");
    

    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();
    let email = document.getElementById('email').value.trim();
    let celular = document.getElementById('celular').value.trim();
    let direccion = document.getElementById('direccion').value.trim();
    let direccion2 = document.getElementById('direccion2').value.trim();
    let notas = document.getElementById('notas').value.trim();
    

    let metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value;
    

    if (!nombre || !apellido || !email || !celular || !direccion) {
        alert('Por favor completa todos los campos obligatorios (Nombres, Apellidos, Email, Celular, Dirección)');
        return;
    }
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de realizar el pedido.');
        return;
    }
    
    console.log('Datos del pedido:', {
        nombre, apellido, email, celular, direccion, direccion2, notas, metodoPago, 
        productos: carrito.length
    });
    

    alert('¡Pedido procesado exitosamente! Serás redirigido a la página de confirmación.');

    localStorage.removeItem("carrito");
    

    window.location.href = "thankyou.html";
}