const PRODUCTOS_POR_PAGINA = 8; // Número de filas por página
let paginaActual = 1; // Página inicial
let productosTotales = []; // Almacena todos los productos
let valorIva = 0;

cargarProductos();

async function cargarProductos() {
    const productos = await obtenerProductos(); // Obtén la lista completa de productos
    productosTotales = productos; // Guarda la lista total
    cargarTabla(productos, paginaActual); // Carga la tabla con la primera página
    cargarControles(productos.length);
}

function cargarTabla(productos, pagina) {
    const tablaProductos = document.getElementById("tablaMostrarProductos");
    tablaProductos.innerHTML = ""; // Limpia la tabla para actualizarla

    // Calcular el rango de productos para la página actual
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosPagina = productos.slice(inicio, fin);

    productosPagina.forEach(producto => { 
        // Crear el tr
        const tr = document.createElement("tr");
        // Crear y agregar el td nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = producto.nombre;
        tr.appendChild(tdNombre);

        // Crear y agregar el td tipo de producto
        const tdTipo = document.createElement("td");
        tdTipo.textContent = producto.tipo === "producto" ? "Producto" : "Servicio";
        tr.appendChild(tdTipo);

        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = producto.precio;
        tr.appendChild(tdPrecio);

        // Crear y agregar el td acciones
        const tdAcciones = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Ver / Editar";
        btnEditar.onclick = () => abrirModal(producto.id);
        btnEditar.classList.add("btn", "btn-primary");
        tdAcciones.appendChild(btnEditar);
        tr.appendChild(tdAcciones);

        // Agregar el tr a la tabla
        tablaProductos.appendChild(tr);
    });
}

function cargarControles(totalProductos) {
    const controles = document.getElementById("controlesPaginacion");
    controles.innerHTML = ""; // Limpia los controles anteriores

    const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA);
    const maxPaginasVisibles = 5; // Número máximo de botones de página visibles

    // Botón "Primera"
    if (paginaActual > 1) {
        const btnPrimera = crearBoton("«", 1);
        controles.appendChild(btnPrimera);
    }

    // Botón "Anterior"
    if (paginaActual > 1) {
        const btnAnterior = crearBoton("‹", paginaActual - 1);
        controles.appendChild(btnAnterior);
    }

    // Páginas visibles (centradas en la página actual)
    const inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    const fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);

    for (let i = inicio; i <= fin; i++) {
        const boton = crearBoton(i, i);
        if (i === paginaActual) {
            boton.classList.add("active");
        }
        controles.appendChild(boton);
    }

    // Botón "Siguiente"
    if (paginaActual < totalPaginas) {
        const btnSiguiente = crearBoton("›", paginaActual + 1);
        controles.appendChild(btnSiguiente);
    }

    // Botón "Última"
    if (paginaActual < totalPaginas) {
        const btnUltima = crearBoton("»", totalPaginas);
        controles.appendChild(btnUltima);
    }
}   

function crearBoton(texto, pagina) {
    const boton = document.createElement("button");
    boton.textContent = texto;
    boton.classList.add("btn", "btn-secondary", "mx-1");
    boton.onclick = () => cambiarPagina(pagina);
    return boton;
}

function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;

    // Aplica el filtro actual para actualizar la tabla
    const tipoSeleccionado = filtroTipo.value;
    let productosFiltrados;
    if (tipoSeleccionado === "todos") {
        productosFiltrados = productosTotales;
    } else {
        productosFiltrados = productosTotales.filter(producto => producto.tipo === tipoSeleccionado);
    }

    cargarTabla(productosFiltrados, paginaActual);
    cargarControles(productosFiltrados.length);
}

// Capturamos el select y agregamos el evento change
const filtroTipo = document.getElementById("filtrarCategoria");
filtroTipo.addEventListener("change", filtrarProductos);

function filtrarProductos() {
    const tipoSeleccionado = filtroTipo.value;

    // Filtrar los productos según el tipo seleccionado
    let productosFiltrados;
    if (tipoSeleccionado === "todos") {
        productosFiltrados = productosTotales; // Mostrar todos
    } else {
        productosFiltrados = productosTotales.filter(producto => producto.tipo === tipoSeleccionado);
    }

    // Reinicia la paginación y actualiza la tabla y controles
    paginaActual = 1;
    cargarTabla(productosFiltrados, paginaActual);
    cargarControles(productosFiltrados.length);
}

// Capturamos el select y el input de búsqueda
const filtroBuscar = document.getElementById("buscarProducto");
const inputBuscar = document.getElementById("buscadorProducto");

// Agregamos un evento para actualizar la tabla mientras se escribe
inputBuscar.addEventListener("input", buscarProductos);

function buscarProductos() {
    const criterio = filtroBuscar.value; // Obtiene el campo por el que buscar (nombre)
    const texto = inputBuscar.value.toLowerCase(); // Convierte a minúsculas para una búsqueda insensible a mayúsculas

    // Filtrar los productos según el texto ingresado y el criterio seleccionado
    const productosFiltrados = productosTotales.filter(producto => 
        producto[criterio].toLowerCase().includes(texto)
    );

    // Reinicia la paginación y actualiza la tabla y controles
    paginaActual = 1;
    cargarTabla(productosFiltrados, paginaActual);
    cargarControles(productosFiltrados.length);
}

// Elementos del modal principal
var modal = document.getElementById("modalProducto");
const formProducto = document.getElementById("formProducto");

async function abrirModal(id) {
    const producto = await getProductoPorId(id);
    const modalDos = document.getElementById("modalProducto");
    const monedas = await obtenerMonedas();
    getIva();
    console.log(producto); // Verifica los datos recibidos
    if (producto) {
        modalDos.style.display = "flex";
        document.getElementById("productoNombre").value = producto.nombre;
        document.getElementById("productoCategoria").value = producto.tipo;
        document.getElementById("productoPrecio").value = producto.precio;
        document.getElementById("productoDescripcion").value = producto.descripcion;
        document.getElementById("productoPrecioSinIva").value = producto.precioSinIva;
        const tituloDetalles = document.getElementById("tituloDetalles");
        const btnEliminar = document.getElementById("eliminarProducto");
        const selectMoneda = document.getElementById("monedaProducto");
        const rowUnidadMedida = document.getElementById("unidadMedidaTable");
        const unidadMedida = document.getElementById("unidadMedida");
        selectMoneda.innerHTML = "";

        monedas.forEach(moneda => {
            const option = document.createElement("option");
            option.value = moneda.id;
            option.textContent = moneda.valor;
            if(moneda.id == producto.moneda){
                option.selected = true;
            }
            selectMoneda.appendChild(option);
        });

        if(producto.tipo == "producto"){
            btnEliminar.innerText = "Eliminar Producto";
            tituloDetalles.innerText = "Detalles del Producto";
            unidadMedida.innerHTML = "";
            const unidades = await obtenerUnidadesMedida();
            rowUnidadMedida.style.display = "contents";
            unidades.forEach(unidad => {
                const option = document.createElement("option");
                option.value = unidad.id;
                option.textContent = unidad.nombre;
                if(producto.unidadDeMedida == unidad.id){
                    option.selected = true;
                }
                unidadMedida.appendChild(option);
            });
        }else if(producto.tipo == "servicio"){
            btnEliminar.innerText = "Eliminar Servicio";
            tituloDetalles.innerText = "Detalles del Servicio";
            rowUnidadMedida.style.display = "none";
        }

        document.getElementById("guardarProducto").onclick = () => actualizarProducto(producto.id);
    } else {
        alert("Producto no encontrado.");
    }
    document.getElementById("eliminarProducto").onclick = () => borrarProducto(producto.id, producto.nombre);
      // Ahora se puede acceder a 'modal' sin error
}
// Guardar cambios del producto

/*
    const newProducto = {
        tipo: "producto",
        nombre: document.getElementById("productoNombre").value,
        precio: parseFloat(document.getElementById("productoPrecio")),
        precioSinIva: parseFloat(document.getElementById("productoPrecio")),
        moneda: document.getElementById("monedaProducto").value,
        unidadDeMedida: document.getElementById("unidadMedida").value,
        descripcion: document.getElementById("productoDescripcion").value,
    };
*/

async function actualizarProducto(id) {
    const idProducto = parseInt(id);
    const nombre = document.getElementById("productoNombre").value;
    const precio = parseFloat(document.getElementById("productoPrecio").value); // Corregido
    const precioSinIva = parseFloat(document.getElementById("productoPrecioSinIva").value); // Corregido
    const moneda = document.getElementById("monedaProducto").value;
    const descripcion = document.getElementById("productoDescripcion").value;
    const tipo = document.getElementById("productoCategoria").value;
    let unidadDeMedida = "";

    if (tipo === "producto") {
        unidadDeMedida = document.getElementById("unidadMedida").value;
    } else {
        unidadDeMedida = "0";
    }

    const newProducto = {
        tipo: tipo,
        nombre: nombre || undefined, // No enviar campos vacíos
        precio: isNaN(precio) ? undefined : precio, // Validar número
        precioSinIva: isNaN(precioSinIva) ? undefined : precioSinIva,
        moneda: moneda || undefined,
        unidadDeMedida: unidadDeMedida || undefined,
        descripcion: descripcion || undefined,
    };

    try {
        const productoActualizado = await actualizarProductosBackend(idProducto, newProducto);
        if (productoActualizado) {
            alert("Producto actualizado satisfactoriamente");
            cargarProductos();
            cerrarModal();
            // Aquí puedes refrescar la vista, cerrar el modal, etc.
        }
    } catch (error) {
        alert("No se pudo actualizar el producto");
    }
}

async function borrarProducto(id, nombre){
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el producto ${nombre}?`);
    
    if (confirmacion) {
        await eliminarProductoBackend(id);
        cargarProductos();
        modal.style.display = "none";
        alert("Producto borrado satisfactoriamente");
    } 
}

function cerrarModal(){
    event?.preventDefault();  // Asegura que el evento no se propague
    const modalDos = document.getElementById("modalProducto");
    modalDos.style.display = "none";  // Cerrar el modal
}

async function getProductoPorId(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}`);
        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }
        const producto = await response.json();
        return producto; // Devuelve el producto encontrado
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        return null; // Retorna null en caso de error
    }
}

const precioProducto = document.getElementById("productoPrecio");
const productoPrecioSinIva = document.getElementById("productoPrecioSinIva");
const monedaProducto = document.getElementById("monedaProducto");

precioProducto.addEventListener("input", () => {
    // Verifica si el evento está siendo disparado correctamente
    console.log("Se detectó un cambio en el precio");

    // Asegúrate de que el valor de IVA sea correcto
    console.log("Valor IVA:", valorIva);

    // Obtiene el precio con IVA ingresado
    const precioConIva = parseFloat(precioProducto.value);
    console.log("Precio con IVA:", precioConIva);

    // Verifica si el precio ingresado es válido
    if (!isNaN(precioConIva)) {
        // Calcula el precio sin IVA
        let precioSinIva = precioConIva - (precioConIva * valorIva / 100);
        console.log("Precio sin IVA calculado:", precioSinIva);

        // Si la moneda es CLP, redondeamos el precio
        if (monedaProducto.value == "1") {  // Asegúrate de que el valor sea una cadena
            precioSinIva = Math.round(precioSinIva);
            console.log("Precio redondeado para CLP:", precioSinIva);
        } else {
            // Si no es CLP, mostramos dos decimales
            precioSinIva = precioSinIva.toFixed(2);
            console.log("Precio con dos decimales:", precioSinIva);
        }

        // Actualiza el campo precioSinIva
        productoPrecioSinIva.value = precioSinIva;
    } else {
        // Si el precio ingresado no es válido, vacía el campo
        productoPrecioSinIva.value = "";
    }
});

// Asegúrate de obtener el valor del IVA cuando cargue la página
async function getIva() {
    try {
        // Simula la obtención del IVA
        const iva = await obtenerIva();
        valorIva = iva[0]?.valor || 19;  // Valor predeterminado de 19 si no se obtiene
        console.log("IVA cargado:", valorIva);
    } catch (error) {
        console.error("Error al obtener IVA:", error);
    }
}

getIva();