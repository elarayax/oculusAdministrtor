// Variables globales
let metodosPago;

// Función para obtener los métodos de pago
async function getMetodosPago() {
    try {
        const metodosPagos = await obtenerMetodosPago(); // Llamada a tu API
        metodosPago = metodosPagos; 
        selectMetodosPago(metodosPago);
    } catch (error) {
        generarMensaje("red","Error al cargar métodos de pago");
    }
}

// Función para renderizar los métodos de pago en el select
function selectMetodosPago(metodosPago) {
    document.getElementById("totalVenta").innerText = "$"+(venta.total).toLocaleString("es-CL");
    document.getElementById("pendienteVenta").innerText = "$"+(venta.total - venta.abonos).toLocaleString("es-CL");
    const select = document.getElementById("selectMetodoPago");
    select.innerHTML = ""; // Limpiar opciones previas
    const leOption = document.createElement("option");
    leOption.value = "-1";
    leOption.text = "Seleccione un método de pago";
    select.appendChild(leOption);

    metodosPago.forEach((metodoPago) => {
        const option = document.createElement("option");
        option.value = metodoPago.id;
        option.text = metodoPago.nombre;
        select.appendChild(option);
    });
}

// Agregar funcionalidad al botón "Cambiar Precio"
document.getElementById("btnCambiarPrecio").addEventListener("click", (event) => {

    event.preventDefault();
    const tabla = document.getElementById("tablaMetodosPago");

    // Verificar si ya existe la fila para cambiar precio
    if (document.getElementById("filaCambiarPrecio")) {
        generarMensaje("red","Ya hay una fila para cambiar el precio.");
        return;
    }

    // Crear una nueva fila para cambiar precio
    const nuevaFila = document.createElement("tr");
    nuevaFila.id = "filaCambiarPrecio";

    // Celda para el texto "Nuevo Precio"
    const tdTexto = document.createElement("td");
    tdTexto.innerHTML = "<b>Nuevo Precio</b>";
    nuevaFila.appendChild(tdTexto);

    // Celda con el input para ingresar el nuevo precio
    const tdInput = document.createElement("td");
    const inputNuevoPrecio = document.createElement("input");
    inputNuevoPrecio.type = "text";
    inputNuevoPrecio.placeholder = "Ingresa nuevo precio";
    inputNuevoPrecio.setAttribute("oninput", "formatearNumero(this)");
    inputNuevoPrecio.id = "inputNuevoPrecioAux";
    tdInput.appendChild(inputNuevoPrecio);
    nuevaFila.appendChild(tdInput);

    // Celda con el botón de guardar
    const tdBotonGuardar = document.createElement("td");
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn", "btn-primary");

    // Acción del botón "Guardar"
    btnGuardar.addEventListener("click", () => {
        const nuevoPrecio = parseInt(inputNuevoPrecio.value.replace(/\./g, ""), 10);
        if (!isNaN(nuevoPrecio) && nuevoPrecio >= 0) {
            // Actualizar el total en la tabla
            venta.total = nuevoPrecio;
            document.getElementById("totalVenta").innerText = "$"+nuevoPrecio.toLocaleString("es-CL");
            // Eliminar la fila después de guardar
            nuevaFila.remove();
        } else {
            generarMensaje("red","Por favor, ingresa un precio válido.");
        }
    });

    tdBotonGuardar.appendChild(btnGuardar);
    nuevaFila.appendChild(tdBotonGuardar);

    // Agregar la fila a la tabla
    tabla.appendChild(nuevaFila);
    document.getElementById("inputNuevoPrecioAux").focus();
});

document.getElementById("btnAbonarVenta").addEventListener("click", (event) => {
    event.preventDefault();
    const tabla = document.getElementById("tablaMetodosPago");

    // Verificar si ya existe la fila para registrar abono
    if (document.getElementById("filaAbono")) {
        generarMensaje("red", "Ya hay una fila para registrar un abono.");
        return;
    }

    // Crear nueva fila para abonos
    const nuevaFila = document.createElement("tr");
    nuevaFila.id = "filaAbono";

    // Celda para el texto "Monto Abono"
    const tdTexto = document.createElement("td");
    tdTexto.innerHTML = "<b>Monto Abono</b>";
    nuevaFila.appendChild(tdTexto);

    // Celda para input del abono
    const tdInput = document.createElement("td");
    const inputAbono = document.createElement("input");
    inputAbono.type = "text";
    inputAbono.setAttribute("oninput", "formatearNumero(this)");
    inputAbono.placeholder = "Ingresa abono";
    inputAbono.id = "inputAbono";
    tdInput.appendChild(inputAbono);
    nuevaFila.appendChild(tdInput);

    // Celda para botón de guardar abono
    const tdBotonGuardar = document.createElement("td");
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar Abono";
    btnGuardar.classList.add("btn", "btn-primary");

    // Acción del botón "Guardar Abono"
    btnGuardar.addEventListener("click", () => {
        const montoAbono = parseInt(inputAbono.value.replace(/\./g, ""), 10);

        if (!isNaN(montoAbono)) {
            // Verificar que el abono no exceda el monto pendiente
            const pendiente = venta.total - venta.abonos;
            if (montoAbono > pendiente) {
                generarMensaje("red", "El abono no puede exceder el monto pendiente.");
                return;
            }

            // Actualizar abonos y el pendiente
            venta.abonos = montoAbono;
            document.getElementById("totalAbonos").innerText = "$" + (venta.abonos).toLocaleString("es-CL");
            document.getElementById("pendienteVenta").innerText = "$" + (venta.total - venta.abonos).toLocaleString("es-CL");

            // Eliminar fila después de guardar
            nuevaFila.remove();
        } else {
            generarMensaje("red", "Por favor, ingresa un monto válido.");
        }
    });

    tdBotonGuardar.appendChild(btnGuardar);
    nuevaFila.appendChild(tdBotonGuardar);

    // Agregar fila a la tabla
    tabla.appendChild(nuevaFila);
    document.getElementById("inputAbono").focus();
});

function casiListo() {
    const totalAbonos = parseInt(document.getElementById("totalAbonos").innerText.replace(/[^0-9]/g, ""), 10) || 0;
    const pendiente = parseInt(document.getElementById("pendienteVenta").innerText.replace(/[^0-9]/g, ""), 10) || 0;

    const metodo = document.getElementById("selectMetodoPago").value;

    if (metodo == "-1") {
        generarMensaje("red", "Debe seleccionar un método de pago");
        return;
    }
    
    venta.metodoPago = metodo;
    venta.abonos = totalAbonos;
    venta.pendiente = pendiente;

    goToStep("final");
}
