const COTIZACIONES_POR_PAGINA = 8; // Número de filas por página
let paginaActual = 1; // Página inicial
let ventasTotales = []; // Almacena todas las cotizaciones

let metodosPago;

getMetodosPago();

// Función para obtener los métodos de pago
async function getMetodosPago() {
    try {
        const metodosPagos = await obtenerMetodosPago(); // Llamada a tu API
        metodosPago = metodosPagos; 
    } catch (error) {
        alert("Error al cargar métodos de pago");
    }
}

async function cargarVentas(){
    try{
        const getVentas = await obtenerVentas();
        ventasTotales = getVentas;
        cargarTabla(ventasTotales, paginaActual);
        cargarControles(ventasTotales.length);
    }catch(error){
        console.log(`No se pudieron cargar las ventas${error}`);
    }
}

cargarVentas();

function cargarTabla(ventas, pagina) {
    const tablaVentas = document.getElementById("tablaMostrarVentas");
    tablaVentas.innerHTML = ""; // Limpia la tabla para actualizarla

    // Calcular el rango de cotizaciones para la página actual
    const inicio = (pagina - 1) * COTIZACIONES_POR_PAGINA;
    const fin = inicio + COTIZACIONES_POR_PAGINA;
    const ventasPagina = ventas.slice(inicio, fin);

    ventasPagina.forEach(venta => { 
        // Crear el tr
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = venta.id;
        tr.appendChild(tdId);

        // Crear y agregar el td nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = venta.cliente.nombre; // Asumiendo que cada cotización tiene un clienteNombre
        tr.appendChild(tdNombre);

        // Crear y agregar el td fecha
        const tdFecha = document.createElement("td");
        tdFecha.textContent = venta.fecha; // Fecha de la cotización
        tr.appendChild(tdFecha);

        const tdEstado = document.createElement("td");
        tdEstado.textContent = venta.estado; // Asumiendo que cada cotización tiene un clienteNombre
        tr.appendChild(tdEstado);

        // Crear y agregar el td monto
        const tdMonto = document.createElement("td");
        tdMonto.textContent = `$${venta.total}`; // Monto de la cotización
        tr.appendChild(tdMonto);

        const tdPendiente = document.createElement("td");
        tdPendiente.textContent = `$${venta.pendiente}`; // Monto de la cotización
        tr.appendChild(tdPendiente);

        // Crear y agregar el td acciones
        const tdAcciones = document.createElement("td");
        const btnVer = document.createElement("button");
        btnVer.textContent = "Ver / Editar";
        btnVer.onclick = () => abrirModalVenta(venta.id); // Cambié el identificador de cliente a id de cotización
        btnVer.classList.add("btn", "btn-primary");
        tdAcciones.appendChild(btnVer);
        tr.appendChild(tdAcciones);

        // Agregar el tr a la tabla
        tablaVentas.appendChild(tr);
    });
}

function cargarControles(ventas) {
    const controles = document.getElementById("controlesPaginacion");
    controles.innerHTML = ""; // Limpia los controles anteriores

    const totalPaginas = Math.ceil(ventas / COTIZACIONES_POR_PAGINA);
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
    aplicarFiltros();
}

function aplicarFiltros() {
    const clienteFiltro = document.getElementById("filtrarCliente").value.toLowerCase();
    const fechaFiltro = document.getElementById("fecha").value;

    const fecha = new Date(fechaFiltro);

    let fechaLocal = '';

    if (fechaFiltro) {
        const [year, month, day] = fechaFiltro.split('-');
        fechaLocal = `${parseInt(day)}/${parseInt(month)}/${year}`; // Convertir al formato esperado (DD/MM/YYYY)
    }
    // Filtrar las cotizaciones según los valores de los filtros
    let ventasFiltradas = ventasTotales;

    if (clienteFiltro) {
        ventasFiltradas = ventasFiltradas.filter(venta =>
            venta.cliente.nombre.toLowerCase().includes(clienteFiltro)
        );
    }

    if (fechaFiltro) {
        ventasFiltradas = ventasFiltradas.filter(venta =>
            venta.fecha === fechaLocal // Comparar en formato local
        );
    }

    // Vuelve a cargar la tabla con los filtros aplicados
    cargarTabla(ventasFiltradas, paginaActual);
    cargarControles(ventasFiltradas.length);
}

const inputBuscar = document.getElementById("filtrarCliente");

document.getElementById("filtrarFechas").addEventListener("click", () => {
    aplicarFiltros();
});

inputBuscar.addEventListener("input", buscarVentas);

function buscarVentas() {
    const texto = inputBuscar.value.toLowerCase();  // El texto ingresado para la búsqueda

    // Filtrar las cotizaciones por el nombre del cliente
    const ventasFiltradas = ventasTotales.filter(venta => {
        // Verificar que cotizacion.cliente y cotizacion.cliente.nombre existen
        if (venta.cliente && venta.cliente.nombre) {
            return venta.cliente.nombre.toLowerCase().includes(texto);
        }
        return false;  // Si no se encuentra el nombre, devolver false
    });

    // Reinicia la paginación y actualiza la tabla y controles
    paginaActual = 1;
    cargarTabla(ventasFiltradas, paginaActual);
    cargarControles(ventasFiltradas.length);
}

const modalVenta = document.getElementById("modalVenta");

function cerrarModal(event){
    event?.preventDefault();
    modalVenta.style.display = "none";
    ventaActualId = null;
}

const inputAbono = document.getElementById("inputAbono");
const guardarAbonoBtn = document.getElementById("guardarAbono");

const selectEstadoVenta = document.getElementById("selectEstadoVenta");
const guardarEstadoVentaBtn = document.getElementById("guardarEstadoVenta");
let ventaActualId = null;

function abrirModalVenta(id) {
    let ventaSeleccionada = ventasTotales.filter(venta => venta.id == id);
    modalVenta.style.display = "flex";
    ventaActualId = id;

    console.log(ventaSeleccionada);
    const datosClienteModal = document.getElementById("datosClienteModal");
    let tablaCliente = `
        <tr>
            <td>
                <b>Nombre</b>
            </td>
            <td>
                ${ventaSeleccionada[0].cliente.nombre}
            </td>
            <td>
                <b>Rut</b>
            </td>
            <td>
                ${ventaSeleccionada[0].cliente.rut}
            </td>
        </tr>
        <tr>
            <td>
                <b>Teléfono</b>
            </td>
            <td>
                ${ventaSeleccionada[0].cliente.telefono}
            </td>
            <td>
                <b>Correo</b>
            </td>
            <td>
                ${ventaSeleccionada[0].cliente.correo}
            </td>
        </tr>
    `;
    datosClienteModal.innerHTML = "";
    datosClienteModal.innerHTML = tablaCliente;

    let detalleVentaFinal = document.getElementById("detalleVentaModal");

    detalleVentaFinal.innerHTML = "";

    ventaSeleccionada[0].productos.forEach(producto => {
        let datosDetalleVenta = `
        <tr>
            <td>
                ${producto.nombre}
            </td>
            <td>
                ${producto.cantidad}
            </td>
            <td>
                $${producto.precio}
            </td>
        </tr>`;
        detalleVentaFinal.innerHTML += datosDetalleVenta;
    });

    let tablaDatosPago = document.getElementById("tablaDatosPago");
    tablaDatosPago.innerHTML = "";

    let nombreMetodoPago = metodosPago.find(c => c.id == parseInt(ventaSeleccionada[0].metodoPago));

    let datosTablaPago = `
        <tr>
            <td>
                <b>Total</b>
            </td>
            <td>
                $${ventaSeleccionada[0].total}
            </td>
        </tr>
        <tr>
            <td>
                <b>Abono</b>
            </td>
            <td id="abonoActual">
                $${ventaSeleccionada[0].abonos}
            </td>
        <tr>
        <tr>
            <td>
                <b>Pendiente</b>
            </td>
            <td id="pendienteActual">
                $${ventaSeleccionada[0].pendiente}
            </td>
        <tr>
        <tr>
            <td>
                <b>Método de pago</b>
            </td>
            <td>
                ${nombreMetodoPago.nombre}
            </td>
        </tr>
    `;

    tablaDatosPago.innerHTML = datosTablaPago;

    //document.getElementById("selectEstadoVenta").value = ventaSeleccionada[0].estado;

    selectEstadoVenta.value = ventaSeleccionada[0].estado;

    // Inicialmente deshabilitar el botón Guardar
    guardarEstadoVentaBtn.disabled = true;

    // Escuchar cambios en el estado
    selectEstadoVenta.addEventListener("change", () => {
        guardarEstadoVentaBtn.disabled = false;
    });

    inputAbono.value = "";
    guardarAbonoBtn.disabled = true;

    // Habilitar el botón Guardar Abono cuando haya un valor en el input
    inputAbono.addEventListener("input", () => {
        guardarAbonoBtn.disabled = inputAbono.value <= 0;
    });
}

async function guardarEstadoVenta() {
    if (!ventaActualId) return;

    // Encontrar la venta actual y actualizar su estado
    const venta = ventasTotales.find(venta => venta.id == ventaActualId);
    if (venta) {
        venta.estado = selectEstadoVenta.value; // Actualizar el estado
        alert(`Estado de la venta actualizado a "${venta.estado}"`);
        
        // Puedes recargar la tabla o actualizar directamente
        //cargarTabla(ventasTotales, paginaActual);
    }

    let mensajeWhatsapp;

    if(venta.estado == "Generada"){
        mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido generada, te avisaremos de cualquier cambio por este medio`;
    }else{
        if(venta.estado == "Fabricando"){
            mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido enviada a fabricación, por lo que pronto estará lista!, te avisaremos de cualquier cambio por este medio`;
        }else{
            if(venta.estado == "Finalizada"){
                mensajeWhatsapp = `Hola ${venta.cliente.nombre}, tu compra a sido finalizada! esperamos que quedes muy satisfecho con esta, esperamos verte pronto`;
            }
        }
    }

    try {
        const resultado = await actualizarVenta(venta.id, venta);
        if (resultado) {
            try {
                await enviarMensajeWhatsapp(`56${venta.cliente.telefono}`, mensajeWhatsapp);
                alert("Mensaje enviado por WhatsApp satisfactoriamente");
            } catch (error) {
                console.error("Error al enviar mensaje por WhatsApp:", error);
                alert("Error al enviar mensaje por WhatsApp");
            }
        } else {
            alert("Error al actualizar la venta");
        }
    } catch (error) {
        console.error("Error al actualizar venta:", error);
        alert("Error al actualizar venta");
    }
    
    // Deshabilitar el botón después de guardar
    guardarEstadoVentaBtn.disabled = true;

    // Opcional: cerrar el modal
    cerrarModal();
    cargarVentas();

}

async function guardarAbono() {
    if (!ventaActualId) return;

    const abonoIngresado = parseFloat(inputAbono.value);
    if (abonoIngresado <= 0) {
        alert("Por favor, ingresa un valor válido para el abono.");
        return;
    }

    // Encontrar la venta actual y actualizar el abono
    const venta = ventasTotales.find(venta => venta.id == ventaActualId);
    if (venta) {
        const pendienteActual = venta.total - venta.abonos;

        if (abonoIngresado > pendienteActual) {
            alert(`El abono ingresado ($${abonoIngresado}) no puede ser mayor al saldo pendiente ($${pendienteActual}).`);
            return;
        }

        venta.abonos += abonoIngresado; // Actualizar el abono
        venta.pendiente = venta.total - venta.abonos; // Recalcular el pendiente

        // Actualizar el modal
        document.getElementById("abonoActual").innerText = `$${venta.abonos}`;
        document.getElementById("pendienteActual").innerText = `$${venta.pendiente}`;

        alert(`Se añadió un abono de $${abonoIngresado}.`);

        let mensajeWhatsapp = `Hola ${venta.cliente.nombre}, registramos tu abono de ${abonoIngresado} al saldo de tu venta!`;

        try {
            const resultado = await actualizarVenta(venta.id, venta);
            if (resultado) {
                try {
                    await enviarMensajeWhatsapp(`56${venta.cliente.telefono}`, mensajeWhatsapp);
                    alert("Mensaje enviado por WhatsApp satisfactoriamente");
                } catch (error) {
                    console.error("Error al enviar mensaje por WhatsApp:", error);
                    alert("Error al enviar mensaje por WhatsApp");
                }
            } else {
                alert("Error al actualizar la venta");
            }
        } catch (error) {
            console.error("Error al actualizar venta:", error);
            alert("Error al actualizar venta");
        }
    }

    // Limpiar el input y deshabilitar el botón
    inputAbono.value = "";
    guardarAbonoBtn.disabled = true;

    // Opcional: recargar la tabla o actualizar directamente
    cerrarModal();
    cargarVentas()
}

async function verificarEstado() {
    const estado = await obtenerEstadoWhatsapp();
    if (estado) {
        return estado;
    } else {
        console.log('No se pudo obtener el estado');
        return null;
    }
}