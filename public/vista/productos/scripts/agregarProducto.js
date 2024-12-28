const tipoProducto = document.getElementById("tipoProducto");
const formProducto = document.getElementById("formProducto");
const formServicio = document.getElementById("formServicio");
const precioProducto = document.getElementById("precioProducto");
const precioProductoSinIva = document.getElementById("precioProductoSinIva");
const monedaProducto = document.getElementById("monedaProducto");
const precioServicio = document.getElementById("precioServicio");
const precioServicioSinIva = document.getElementById("precioServicioSinIva");
const monedaServicio = document.getElementById("monedaServicio");
let valorIva = 0;

tipoProducto.addEventListener("change", () => {
    formProducto.classList.add("hidden");
    formServicio.classList.add("hidden");

    if (tipoProducto.value === "producto") {
        formProducto.classList.remove("hidden");
        cargarMonedas();
        cargarUnidadesMedida();
        getIva();
        document.getElementById("nombreProducto").focus();
    } else if (tipoProducto.value === "servicio") {
        formServicio.classList.remove("hidden");
        getIva();
        cargarMonedasServicio();
        document.getElementById("nombreServicio").focus();
    }
});

async function cargarMonedas(){
    const monedas = await obtenerMonedas();
    const selectMoneda = document.getElementById("monedaProducto");
    selectMoneda.innerHTML = "";
    monedas.forEach((moneda) => {
        const option = document.createElement("option");
        option.value = moneda.id;
        option.textContent = moneda.valor;
        if(moneda.defecto){
            option.selected = true;
        }
        selectMoneda.appendChild(option);
    });
}

async function cargarMonedasServicio(){
    const monedas = await obtenerMonedas();
    const selectMoneda = document.getElementById("monedaServicio");
    selectMoneda.innerHTML = "";
    monedas.forEach((moneda) => {
        const option = document.createElement("option");
        option.value = moneda.id;
        option.textContent = moneda.valor;
        if(moneda.defecto){
            option.selected = true;
        }
        selectMoneda.appendChild(option);
    });
}

async function cargarUnidadesMedida(){
    const unidad = await obtenerUnidadesMedida();
    const selectUnidad = document.getElementById("unidadMedidaProducto");
    selectUnidad.innerHTML = "";
    unidad.forEach((unidad) => {
        const option = document.createElement("option");
        option.value = unidad.id;
        option.textContent = `${unidad.nombre} - ${unidad.abreviacion}`;
        selectUnidad.appendChild(option)
    });
}

async function agregarProducto() {
    const nombreProducto = document.getElementById("nombreProducto").value.trim();
    const precioProducto = parseFloat(document.getElementById("precioProducto").value);
    const precioProductoSinIva = parseFloat(document.getElementById("precioProductoSinIva").value);
    const descripcionProducto = document.getElementById("descripcionProducto").value.trim();
    const monedaProducto = document.getElementById("monedaProducto").value;
    const unidadMedidaProducto = document.getElementById("unidadMedidaProducto").value;

    // Validaciones
    if (!nombreProducto) {
        alert("El nombre del producto es obligatorio.");
        return;
    }

    if (isNaN(precioProducto) || precioProducto <= 0) {
        alert("El precio del producto debe ser un número positivo.");
        return;
    }

    if (isNaN(precioProductoSinIva) || precioProductoSinIva < 0) {
        alert("El precio del producto sin IVA debe ser un número positivo.");
        return;
    }

    if (!descripcionProducto || descripcionProducto.length < 10) {
        alert("La descripción del producto debe tener al menos 10 caracteres.");
        return;
    }

    if (!monedaProducto) {
        alert("Debe seleccionar una moneda para el producto.");
        return;
    }

    if (!unidadMedidaProducto) {
        alert("Debe seleccionar una unidad de medida para el producto.");
        return;
    }

    const producto = {
        tipo: "producto",
        nombre: nombreProducto,
        precio: precioProducto,
        precioSinIva: precioProductoSinIva,
        moneda: monedaProducto,
        unidadDeMedida: unidadMedidaProducto,
        descripcion: descripcionProducto,
    };

    try {
        // Llamada al backend para agregar el producto
        const agregar = await agregarProductoBackend(
            producto.tipo, 
            producto.nombre, 
            producto.precio, 
            producto.precioSinIva, 
            producto.moneda, 
            producto.unidadDeMedida, 
            producto.descripcion
        );

        // Limpiar el formulario después de agregar el producto
        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioProducto").value = "";
        document.getElementById("precioProductoSinIva").value = "";
        document.getElementById("monedaProducto").value = "";
        document.getElementById("unidadMedidaProducto").value = "";
        document.getElementById("descripcionProducto").value = "";

        alert("Producto agregado exitosamente.");
        location.reload();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al agregar el producto.");
    }
}


async function getIva() {
    const iva = await obtenerIva();
    valorIva = iva[0]?.valor || 19; // Asegúrate de que tenga un valor válido
}

precioProducto.addEventListener("input", () => {
    if (valorIva > 0) {
        const precioConIva = parseFloat(precioProducto.value);
        if (!isNaN(precioConIva)) {
            // Calcula el precio sin IVA restando el IVA
            let precioSinIva = precioConIva - (precioConIva * valorIva / 100);
            
            // Si la moneda seleccionada es CLP, redondear a un entero
            if (monedaProducto.value == 1) {
                precioSinIva = Math.round(precioSinIva);
            } else {
                precioSinIva = precioSinIva.toFixed(2);
            }

            // Actualiza el campo deshabilitado
            precioProductoSinIva.value = precioSinIva;
        } else {
            precioProductoSinIva.value = "";
        }
    }
});

precioServicio.addEventListener("input", () => {
    if (valorIva > 0) {
        const precioConIva = parseFloat(precioServicio.value);
        if (!isNaN(precioConIva)) {
            // Calcula el precio sin IVA restando el IVA
            let precioSinIva = precioConIva - (precioConIva * valorIva / 100);
            
            // Si la moneda seleccionada es CLP, redondear a un entero
            if (monedaServicio.value == 1) {
                precioSinIva = Math.round(precioSinIva);
            } else {
                precioSinIva = precioSinIva.toFixed(2);
            }

            // Actualiza el campo deshabilitado
            precioServicioSinIva.value = precioSinIva;
        } else {
            precioServicioSinIva.value = "";
        }
    }
});

async function agregarServicio() {
    const nombreServicio = document.getElementById("nombreServicio").value.trim();
    const precioServicio = parseFloat(document.getElementById("precioServicio").value);
    const precioServicioSinIva = parseFloat(document.getElementById("precioServicioSinIva").value);
    const descripcionServicio = document.getElementById("descripcionServicio").value.trim();  // Asumí que la descripción es la misma para servicio y producto
    const monedaServicio = document.getElementById("monedaServicio").value;
    const unidadMedidaServicio = "0";

    // Validaciones
    if (!nombreServicio) {
        alert("El nombre del servicio es obligatorio.");
        return;
    }

    if (isNaN(precioServicio) || precioServicio <= 0) {
        alert("El precio del servicio debe ser un número positivo.");
        return;
    }

    if (isNaN(precioServicioSinIva) || precioServicioSinIva < 0) {
        alert("El precio del servicio sin IVA debe ser un número positivo.");
        return;
    }

    if (!descripcionServicio || descripcionServicio.length < 10) {
        alert("La descripción del servicio debe tener al menos 10 caracteres.");
        return;
    }

    if (!monedaServicio) {
        alert("Debe seleccionar una moneda para el servicio.");
        return;
    }

    const servicio = {
        tipo: "servicio",  // Asegúrate de que el tipo sea "servicio"
        nombre: nombreServicio,
        precio: precioServicio,
        precioSinIva: precioServicioSinIva,
        moneda: monedaServicio,
        unidadDeMedida: unidadMedidaServicio,
        descripcion: descripcionServicio,
    };

    try {
        // Llamada al backend para agregar el servicio
        const agregar = await agregarProductoBackend( 
            servicio.tipo, 
            servicio.nombre, 
            servicio.precio, 
            servicio.precioSinIva, 
            servicio.moneda, 
            servicio.unidadDeMedida, 
            servicio.descripcion
        );

        // Limpiar el formulario después de agregar el servicio
        document.getElementById("nombreServicio").value = "";
        document.getElementById("precioServicio").value = "";
        document.getElementById("precioServicioSinIva").value = "";
        document.getElementById("monedaServicio").value = "";
        document.getElementById("unidadMedidaProducto").value = "";
        document.getElementById("descripcionProducto").value = "";

        alert("Servicio agregado exitosamente.");
        location.reload();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al agregar el servicio.");
    }
}
