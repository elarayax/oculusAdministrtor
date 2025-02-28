const CLIENTES_POR_PAGINA = 8; // Número de filas por página
let paginaActual = 1; // Página inicial
let clientesTotales = []; // Almacena todos los clientes

cargarClientes();

async function cargarClientes() {
    const clientes = await obtenerClientes(); // Obtén la lista completa de clientes
    clientesTotales = clientes; // Guarda la lista total
    cargarTabla(clientes, paginaActual); // Carga la tabla con la primera página
    cargarControles(clientes.length);
    document.getElementById("buscadorCliente").focus();
}

function cargarTabla(clientes, pagina) {
    const tablaClientes = document.getElementById("tablaMostrarClientes");
    tablaClientes.innerHTML = ""; // Limpia la tabla para actualizarla

    // Calcular el rango de clientes para la página actual
    const inicio = (pagina - 1) * CLIENTES_POR_PAGINA;
    const fin = inicio + CLIENTES_POR_PAGINA;
    const clientesPagina = clientes.slice(inicio, fin);

    clientesPagina.forEach(cliente => { 
        // Crear el tr
        const tr = document.createElement("tr");
        // Crear y agregar el td nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = cliente.nombre;
        tr.appendChild(tdNombre);

        // Crear y agregar el td tipo de cliente
        const tdTipo = document.createElement("td");
        tdTipo.textContent = cliente.rut;
        tr.appendChild(tdTipo);

        // Crear y agregar el td acciones
        const tdAcciones = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Ver / Editar";
        btnEditar.onclick = () => abrirModal(cliente.rut);
        btnEditar.classList.add("btn", "btn-primary");
        tdAcciones.appendChild(btnEditar);
        tr.appendChild(tdAcciones);

        // Agregar el tr a la tabla
        tablaClientes.appendChild(tr);
    });
}

function cargarControles(totalClientes) {
    const controles = document.getElementById("controlesPaginacion");
    controles.innerHTML = ""; // Limpia los controles anteriores

    const totalPaginas = Math.ceil(totalClientes / CLIENTES_POR_PAGINA);
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
    let clientesFiltrados;
    if (tipoSeleccionado === "todos") {
        clientesFiltrados = clientesTotales;
    } else {
        clientesFiltrados = clientesTotales.filter(cliente => cliente.tipo === tipoSeleccionado);
    }

    cargarTabla(clientesFiltrados, paginaActual);
    cargarControles(clientesFiltrados.length);
}


// Capturamos el select y el input de búsqueda
const filtroBuscar = document.getElementById("buscarCliente");
const inputBuscar = document.getElementById("buscadorCliente");

// Agregamos un evento para actualizar la tabla mientras se escribe
inputBuscar.addEventListener("input", buscarClientes);

function buscarClientes() {
    const criterio = filtroBuscar.value; // Obtiene el campo por el que buscar (nombre o rut)
    const texto = inputBuscar.value.toLowerCase(); // Convierte a minúsculas para una búsqueda insensible a mayúsculas

    // Filtrar los clientes según el texto ingresado y el criterio seleccionado
    const clientesFiltrados = clientesTotales.filter(cliente => 
        cliente[criterio].toLowerCase().includes(texto)
    );

    // Reinicia la paginación y actualiza la tabla y controles
    paginaActual = 1;
    cargarTabla(clientesFiltrados, paginaActual);
    cargarControles(clientesFiltrados.length);
}

// Elementos del modal principal
const modal = document.getElementById("modalCliente");
const modalRepresentante = document.getElementById("modalRepresentante");
const formCliente = document.getElementById("formCliente");
const formRepresentante = document.getElementById("formRepresentante");
const listaRepresentantes = document.getElementById("listaRepresentantes");
let representantes = [];

// Abrir modal del cliente
async function abrirModal(rut) {
    const cliente = await obtenerClientePorRut(rut);
    document.getElementById("clienteNombre").value = cliente.nombre;
    document.getElementById("clienteRut").value = cliente.rut;
    document.getElementById("clienteTelefono").value = cliente.telefono;
    document.getElementById("clienteCorreo").value = cliente.correo;
    if(cliente.direccion == null){
        document.getElementById("clienteDireccion").value = "";
    }else{
        document.getElementById("clienteDireccion").value = cliente.direccion;
    }
    document.getElementById("eliminarCliente").onclick = () => borrarCliente(cliente.rut, cliente.nombre);
    modal.style.display = "flex";
    document.getElementById("clienteNombre").focus();
}


async function borrarCliente(rut, nombre){
    abrirModalEliminar(nombre, "cliente", eliminarCliente, rut, cargarClientes);
    cerrarModal();
}

// Guardar cambios del cliente
document.getElementById("guardarCliente").onclick = async (event) => {
    event.stopPropagation();  // Evita que el clic en este botón cierre el modal
    const rut = document.getElementById("clienteRut").value;
    const cliente = {
        nombre: document.getElementById("clienteNombre").value,
        telefono: document.getElementById("clienteTelefono").value,
        correo: document.getElementById("clienteCorreo").value,
        direccion: document.getElementById("clienteDireccion").value,
    };

    try {
        const resultado = await actualizarClientePorRut(rut, cliente);
        if (resultado) {
            generarMensaje("green","Cliente actualizado exitosamente");
            document.getElementById("buscadorCliente").focus();
            modal.style.display = "none";  // Cerrar el modal si todo fue correcto
        } else {
            generarMensaje("red","No se pudo actualizar el cliente. Verifica los datos e intenta nuevamente");
            document.getElementById("clienteNombre").focus();
        }
    } catch (error) {
        generarMensaje("red",`Error al actualizar el cliente: ${error.message}`);
        document.getElementById("clienteNombre").focus();
    }

    
};


function cerrarModal(event){
    event?.preventDefault();  // Asegura que el evento no se propague
    modal.style.display = "none";  // Cerrar el modal
    document.getElementById("buscadorCliente").focus();
}