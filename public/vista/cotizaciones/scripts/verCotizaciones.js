const COTIZACIONES_POR_PAGINA = 8; // Número de filas por página
let paginaActual = 1; // Página inicial
let cotizacionesTotales = []; // Almacena todas las cotizaciones

cargarCotizaciones();

async function cargarCotizaciones() {
    const cotizaciones = await obtenerCotizaciones(); // Obtén la lista completa de cotizaciones
    cotizacionesTotales = cotizaciones; // Guarda la lista total
    cargarTabla(cotizaciones, paginaActual); // Carga la tabla con la primera página
    cargarControles(cotizaciones.length);
}

async function obtenerCotizaciones() {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones`);
        if (!response.ok) throw new Error('Error al obtener la lista de cotizaciones');
        const data = await response.json();
        return data; // Suponiendo que el backend devuelve un array de cotizaciones
    } catch (error) {
        alert(error.message);
        return []; // Retorna un arreglo vacío si hay error
    }
}

function cargarTabla(cotizaciones, pagina) {
    const tablaCotizaciones = document.getElementById("tablaMostrarCotizaciones");
    tablaCotizaciones.innerHTML = ""; // Limpia la tabla para actualizarla

    // Calcular el rango de cotizaciones para la página actual
    const inicio = (pagina - 1) * COTIZACIONES_POR_PAGINA;
    const fin = inicio + COTIZACIONES_POR_PAGINA;
    const cotizacionesPagina = cotizaciones.slice(inicio, fin);

    cotizacionesPagina.forEach(cotizacion => { 
        // Crear el tr
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = cotizacion.id;
        tr.appendChild(tdId);

        // Crear y agregar el td nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = cotizacion.cliente.nombre; // Asumiendo que cada cotización tiene un clienteNombre
        tr.appendChild(tdNombre);

        // Crear y agregar el td fecha
        const tdFecha = document.createElement("td");
        tdFecha.textContent = cotizacion.fechaInicio; // Fecha de la cotización
        tr.appendChild(tdFecha);

        const tdFechaTermino = document.createElement("td");
        tdFechaTermino.textContent = cotizacion.fechaTermino; // Fecha de la cotización
        tr.appendChild(tdFechaTermino);

        // Crear y agregar el td monto
        const tdMonto = document.createElement("td");
        tdMonto.textContent = cotizacion.totalGeneral; // Monto de la cotización
        tr.appendChild(tdMonto);

        // Crear y agregar el td acciones
        const tdAcciones = document.createElement("td");
        const btnVer = document.createElement("button");
        btnVer.textContent = "Ver / Editar";
        btnVer.onclick = () => abrirModalCotizacion(cotizacion.id); // Cambié el identificador de cliente a id de cotización
        btnVer.classList.add("btn", "btn-primary");
        tdAcciones.appendChild(btnVer);
        tr.appendChild(tdAcciones);

        // Agregar el tr a la tabla
        tablaCotizaciones.appendChild(tr);
    });
}

function cargarControles(totalCotizaciones) {
    const controles = document.getElementById("controlesPaginacion");
    controles.innerHTML = ""; // Limpia los controles anteriores

    const totalPaginas = Math.ceil(totalCotizaciones / COTIZACIONES_POR_PAGINA);
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
    const fechaInicioFiltro = document.getElementById("fechaInicio").value;
    const fechaTerminoFiltro = document.getElementById("fechaTermino").value;

    // Filtrar las cotizaciones según los valores de los filtros
    let cotizacionesFiltradas = cotizacionesTotales;

    if (clienteFiltro) {
        cotizacionesFiltradas = cotizacionesFiltradas.filter(cotizacion =>
            cotizacion.cliente.nombre.toLowerCase().includes(clienteFiltro)
        );
    }

    if (fechaInicioFiltro) {
        cotizacionesFiltradas = cotizacionesFiltradas.filter(cotizacion =>
            cotizacion.fechaInicio >= fechaInicioFiltro
        );
    }

    if (fechaTerminoFiltro) {
        cotizacionesFiltradas = cotizacionesFiltradas.filter(cotizacion =>
            cotizacion.fechaTermino <= fechaTerminoFiltro
        );
    }

    // Vuelve a cargar la tabla con los filtros aplicados
    cargarTabla(cotizacionesFiltradas, paginaActual);
    cargarControles(cotizacionesFiltradas.length);
}

// Filtro de fecha con el botón
document.getElementById("filtrarFechas").addEventListener("click", () => {
    aplicarFiltros();
});

// Para la búsqueda de cotizaciones
const filtroBuscar = document.getElementById("buscarCotizacion");
const inputBuscar = document.getElementById("filtrarCliente");

inputBuscar.addEventListener("input", buscarCotizaciones);

function buscarCotizaciones() {
    const texto = inputBuscar.value.toLowerCase();  // El texto ingresado para la búsqueda

    // Filtrar las cotizaciones por el nombre del cliente
    const cotizacionesFiltradas = cotizacionesTotales.filter(cotizacion => {
        // Verificar que cotizacion.cliente y cotizacion.cliente.nombre existen
        if (cotizacion.cliente && cotizacion.cliente.nombre) {
            return cotizacion.cliente.nombre.toLowerCase().includes(texto);
        }
        return false;  // Si no se encuentra el nombre, devolver false
    });

    // Reinicia la paginación y actualiza la tabla y controles
    paginaActual = 1;
    cargarTabla(cotizacionesFiltradas, paginaActual);
    cargarControles(cotizacionesFiltradas.length);
}

// Elementos del modal de cotización
const modalCotizacion = document.getElementById("modalCotizacion");
const formCotizacion = document.getElementById("formCotizacion");

async function abrirModalCotizacion(id) {
    const cotizacion = await obtenerCotizacionPorId(id);
    modalCotizacion.style.display = "flex";
    document.getElementById("clienteNombre").value = cotizacion.cliente.nombre;
    document.getElementById("fechaInicioModal").value = cotizacion.fechaInicio;
    document.getElementById("fechaTerminoModal").value = cotizacion.fechaTermino;
    document.getElementById("totalGeneral").value = cotizacion.totalGeneral;
    document.getElementById("totalSinIva").value = cotizacion.totalSinIVA;
    const listadoPRoductos = document.getElementById("productosList");
    const listProductos = cotizacion.productos;
    listadoPRoductos.innerHTML = "";
    listProductos.forEach(e => {
        const tr = document.createElement("tr");
         
        const tdNombre = document.createElement("td");
        tdNombre.textContent = e.nombre;
        tr.appendChild(tdNombre);

        const tdCantidad = document.createElement("td");
        tdCantidad.textContent = e.cantidad;
        tr.appendChild(tdCantidad);

        const tdValorUnitario = document.createElement("td");
        tdValorUnitario.textContent = e.precio;
        tr.appendChild(tdValorUnitario);

        const tdValorTotal = document.createElement("td");
        tdValorTotal.textContent = e.total;
        tr.appendChild(tdValorTotal);

        listadoPRoductos.appendChild(tr);
    });

    document.getElementById("imprimirCotizacion").onclick = () => imprimirPDF(cotizacion);
    
    /*document.getElementById("cotizacionId").value = cotizacion.id;
    document.getElementById("cotizacionCliente").value = cotizacion.clienteNombre;
    document.getElementById("cotizacionFecha").value = cotizacion.fecha;
    document.getElementById("cotizacionMonto").value = cotizacion.monto;
    modalCotizacion.style.display = "flex";*/
}

async function imprimirPDF(cotizacion){
    const response = await fetch('http://localhost:3001/generar-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cotizacion) // Enviar la cotización al backend para generar el PDF
    });
}


// Guardar cambios de cotización
/*document.getElementById("guardarCotizacion").onclick = async (event) => {
    event.stopPropagation();
    const cotizacion = {
        clienteNombre: document.getElementById("cotizacionCliente").value,
        fecha: document.getElementById("cotizacionFecha").value,
        monto: document.getElementById("cotizacionMonto").value,
    };

    const id = document.getElementById("cotizacionId").value;
    try {
        const resultado = await actualizarCotizacionPorId(id, cotizacion);
        if (resultado) {
            alert("Cotización actualizada exitosamente.");
        } else {
            alert("No se pudo actualizar la cotización. Verifica los datos e intenta nuevamente.");
        }
    } catch (error) {
        alert(`Error al actualizar la cotización: ${error.message}`);
    }

    modalCotizacion.style.display = "none";  // Cerrar el modal si todo fue correcto
};*/

async function actualizarCotizacionPorId(id, cotizacion) {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cotizacion),
        });

        if (!response.ok) throw new Error('Error al actualizar la cotización');
        return await response.json();
    } catch (error) {
        alert(error.message);
    }
}

function cerrarModal(event){
    event?.preventDefault();
    modalCotizacion.style.display = "none";
}
