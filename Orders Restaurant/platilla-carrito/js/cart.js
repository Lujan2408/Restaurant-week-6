// Variables globales
let iconCart = document.querySelector(".carrito");
let iconCount = document.querySelector(".contar-pro");
let btnProducts = document.querySelectorAll(".btn-product");
let contentProducts = document.querySelector(".content-pro");
let tablePro = document.querySelector(".list-cart tbody");
let carritoContainer = document.querySelector(".list-cart"); // Contenedor del carrito
let btnCart= document.querySelector(".btn-cart");
let con = 1;

// Evento inicial
document.addEventListener("DOMContentLoaded", () => {
    getProductData();
    renderCarrito();
    renderCartPage(); // Cargar productos en cart.html si estamos en esa página
});

// Mostrar/Ocultar carrito
iconCart.addEventListener("click", () => {
    carritoContainer.classList.toggle("oculto"); // "oculto" es una clase CSS que pondremos para esconder
});

// Función para obtener info de producto y agregar al carrito
let getInfoProduc = (id) => {
    let products = JSON.parse(localStorage.getItem("productos")) || [];
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let producto = products[id];
    console.log("Agregando producto:", producto); // Debug
    
    if (producto) {
        // Verificar si el producto ya existe en el carrito
        let existeProducto = carrito.find(item => item.id === producto.id);
        
        if (existeProducto) {
            // Si ya existe, incrementar la cantidad
            existeProducto.cantidad = (existeProducto.cantidad || 1) + 1;
            console.log("Producto ya existe, nueva cantidad:", existeProducto.cantidad); // Debug
        } else {
            // Si no existe, agregarlo con cantidad 1
            producto.cantidad = 1;
            carrito.push(producto);
            console.log("Nuevo producto agregado:", producto); // Debug
        }
        
        localStorage.setItem("carrito", JSON.stringify(carrito));
        console.log("Carrito actualizado:", carrito); // Debug
        renderCarrito();
    }
};

// Ir a cart.html al hacer click en "Ver carrito"
btnCart.addEventListener("click", () => {
    console.log("=== CLICK EN VER CARRITO ===");
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log("Carrito al hacer click:", carrito);

    // Siempre redirigir a cart.html, incluso si está vacío
    console.log(`Redirigiendo a cart.html con ${carrito.length} productos`);
    window.location.href = "cart.html";
});

// Renderizar el carrito en la tabla
let renderCarrito = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (tablePro) {
        tablePro.innerHTML = ""; // Limpiar antes de renderizar

        carrito.forEach((prod, index) => {
            let cantidad = prod.cantidad || 1;
            tablePro.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><img src="${prod.imagen}" width="50" style="object-fit: cover;"></td>
                    <td>
                        ${prod.nombre}
                        <br><small>Cantidad: ${cantidad}</small>
                    </td>
                    <td>$${(parseFloat(prod.precio) * cantidad).toFixed(2)}</td>
                    <td>
                        <button onclick="eliminarProducto(${index})" class="btn btn-danger btn-sm">X</button>
                    </td>
                </tr>
            `;
        });
    }

    // Actualizar contador - contar cantidad total de productos
    if (iconCount) {
        let totalCantidad = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
        iconCount.textContent = totalCantidad;
    }
};

// Eliminar producto del carrito
let eliminarProducto = (index) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
};

// Función para traer datos desde la BD
let getProductData = async () => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (respuesta.status === 204) {
            console.log("No hay datos en la BD");
        } else {
            let tableData = await respuesta.json();
            localStorage.setItem("productos", JSON.stringify(tableData));

            if (contentProducts) {
                contentProducts.innerHTML = "";
                tableData.forEach((dato, i) => {
                    contentProducts.innerHTML += `
                        <div class="col-md-3 py-3 py-md-0">
                            <div class="card">
                                <img src="${dato.imagen}" alt="">
                                <div class="card-body">
                                    <h3>${dato.nombre}</h3>
                                    <p>${dato.descripcion}</p>
                                    <h5>$${dato.precio} 
                                        <span class="btn-product" onclick="getInfoProduc(${i})">
                                            <i class="fa-solid fa-basket-shopping"></i>
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

// Función para mostrar productos del carrito en cart.html
let renderCartPage = () => {
    console.log("=== INICIANDO renderCartPage ===");
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let cartTableBody = document.querySelector(".cart-table tbody");
    
    console.log("Carrito encontrado:", carrito);
    console.log("Tabla encontrada:", cartTableBody);
    
    // Si no estamos en cart.html, salir
    if (!cartTableBody) {
        console.log("No se encontró tabla de carrito - no estamos en cart.html");
        return;
    }
    
    // Limpiar tabla
    cartTableBody.innerHTML = "";
    
    // Si no hay productos en el carrito
    if (carrito.length === 0) {
        console.log("Carrito vacío - mostrando mensaje");
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <h5 class="mb-3">Tu carrito está vacío</h5>
                    <p class="lead mb-4">¡Agrega algunos deliciosos productos!</p>
                    <a href="index.html" class="btn btn-primary">Continuar Comprando</a>
                </td>
            </tr>
        `;
        updateCartSummary(0);
        return;
    }
    
    console.log(`Mostrando ${carrito.length} productos en el carrito`);
    
    let subtotal = 0;
    
    // Mostrar cada producto
    carrito.forEach((producto, index) => {
        let cantidad = producto.cantidad || 1;
        let precioUnitario = parseFloat(producto.precio);
        let subtotalProducto = precioUnitario * cantidad;
        subtotal += subtotalProducto;
        
        console.log(`Procesando producto ${index + 1}:`, {
            id: producto.id,
            nombre: producto.nombre,
            precio: precioUnitario,
            cantidad: cantidad,
            subtotal: subtotalProducto
        });
        
        let filaHTML = `
            <tr data-index="${index}">
                <td class="product-block">
                    <a href="#" class="remove-from-cart-btn" onclick="eliminarProductoCart(${index})" style="color: red; margin-right: 10px; font-size: 18px; text-decoration: none;">
                        <i class="fa-solid fa-x"></i>
                    </a>
                    <img src="${producto.imagen}" alt="">
                    <a href="product-detail.html" class="h6">${producto.nombre}</a>
                </td>
                <td>
                    <p class="lead color-black">$${precioUnitario.toFixed(2)}</p>
                </td>
                <td style="vertical-align: middle;">
                    <div class="quantity quantity-wrap">
                        <div class="decrement" onclick="decrementarCantidad(${index})" style="cursor: pointer;">
                            <i class="fa-solid fa-minus"></i>
                        </div>
                        <input type="text" name="quantity" value="${cantidad}" maxlength="2" size="1" class="number" readonly>
                        <div class="increment" onclick="incrementarCantidad(${index})" style="cursor: pointer;">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </td>
                <td>
                    <h6>$${subtotalProducto.toFixed(2)}</h6>
                </td>
            </tr>
        `;
        
        cartTableBody.innerHTML += filaHTML;
    });
    
    console.log("Subtotal calculado:", subtotal);
    console.log("=== FINALIZANDO renderCartPage ===");
    
    updateCartSummary(subtotal);
};

// Función para actualizar el resumen del carrito
let updateCartSummary = (subtotal) => {
    console.log("=== ACTUALIZANDO RESUMEN ===");
    
    let valorDomicilio = 5.00;
    let descuentoPromo = 5.00;
    let total = subtotal + valorDomicilio - descuentoPromo;
    
    console.log("Subtotal:", subtotal);
    console.log("Valor domicilio:", valorDomicilio);
    console.log("Descuento:", descuentoPromo);
    console.log("Total calculado:", total);
    
    // Buscar el contenedor del resumen
    let cartSummary = document.querySelector('.cart-summary');
    
    if (!cartSummary) {
        console.log("No se encontró .cart-summary - probablemente no estamos en cart.html");
        return;
    }
    
    console.log("Resumen de carrito encontrado:", cartSummary);
    
    try {
        // Método más directo - buscar por posición en la estructura
        let summaryItems = cartSummary.querySelectorAll('.d-flex .lead');
        let totalItems = cartSummary.querySelectorAll('.color-primary');
        
        console.log("Items de resumen encontrados:", summaryItems.length);
        console.log("Items de total encontrados:", totalItems.length);
        
        // Actualizar subtotal (normalmente el segundo elemento)
        if (summaryItems.length >= 2) {
            summaryItems[1].textContent = `$${subtotal.toFixed(2)}`;
            console.log("✅ Subtotal actualizado a:", subtotal.toFixed(2));
        }
        
        // Actualizar total (último elemento)
        if (totalItems.length >= 2) {
            totalItems[totalItems.length - 1].textContent = `$${total.toFixed(2)}`;
            console.log("✅ Total actualizado a:", total.toFixed(2));
        }
        
    } catch (error) {
        console.error("Error actualizando resumen:", error);
    }
    
    console.log("=== RESUMEN ACTUALIZADO ===");
};

// Función para incrementar cantidad
let incrementarCantidad = (index) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito[index]) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCartPage();
        renderCarrito();
    }
};

// Función para decrementar cantidad
let decrementarCantidad = (index) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito[index] && (carrito[index].cantidad || 1) > 1) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) - 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCartPage();
        renderCarrito();
    }
};

// Función para eliminar producto del carrito desde cart.html
let eliminarProductoCart = (index) => {
    console.log("Intentando eliminar producto en index:", index); // Debug
    
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        console.log("Carrito antes de eliminar:", carrito); // Debug
        
        if (carrito[index]) {
            console.log("Eliminando producto:", carrito[index]); // Debug
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            
            console.log("Carrito después de eliminar:", carrito); // Debug
            
            renderCartPage();
            renderCarrito();
        } else {
            console.error("Producto no encontrado en index:", index); // Debug
        }
    }
};