async function cargarClientes() {
    try {
        const clientes = await obtenerClientes(); // Función para obtener clientes de tu API
        usuariosGlobal = clientes; 
    } catch (error) {
        generarMensaje("red", "Error al cargar clientes");
    }
}

document.getElementById('nombreCliente').addEventListener('input', mostrarSugerencias);

function mostrarSugerencias(e) {
    const input = e.target.value.toLowerCase(); // Valor ingresado por el usuario
    const sugerenciasContainer = document.getElementById('sugerenciasCliente');
    sugerenciasContainer.innerHTML = ''; // Limpia sugerencias anteriores

    if (input.length === 0) return; // No mostrar sugerencias si el campo está vacío

    // Filtrar clientes que coincidan con el texto ingresado
    const sugerencias = usuariosGlobal.filter(cliente =>
        cliente.nombre.toLowerCase().includes(input)
    );

    // Crear elementos de sugerencias
    sugerencias.forEach(cliente => {
        const sugerenciaDiv = document.createElement('div');
        sugerenciaDiv.classList.add('sugerencia');
        sugerenciaDiv.textContent = cliente.nombre; // Mostrar el nombre del cliente
        sugerenciaDiv.dataset.id = cliente.id; // Guardar el ID del cliente

        // Evento para seleccionar una sugerencia
        sugerenciaDiv.addEventListener('click', () => {
            seleccionarCliente(cliente); // Llenar los datos del cliente
            sugerenciasContainer.innerHTML = ''; // Limpiar las sugerencias
        });

        sugerenciasContainer.appendChild(sugerenciaDiv);
    });
}

function seleccionarCliente(cliente) {
    // Rellenar los datos básicos del cliente
    document.getElementById('nombreCliente').value = cliente.nombre; // Nombre del cliente
    document.getElementById('rutCliente').value = cliente.rut; // Rut del cliente
    document.getElementById("telefonoCliente").value = cliente.telefono;
    document.getElementById("correoCliente").value = cliente.correo;

    if(cliente.direccion != null)
        document.getElementById("direccionCliente").value = cliente.direccion;
    else
        document.getElementById("direccionCliente").value = "";
}

function thisClient(){
    event.preventDefault();
    const rut = document.getElementById('rutCliente').value;

    if(rut == ""){
        generarMensaje("red","tiene que seleccionar un cliente");
        return;
    }

    const cliente = usuariosGlobal.find(cliente => cliente.rut === rut);

    venta.cliente = {
        nombre: cliente.nombre,
        rut: cliente.rut,
        telefono: cliente.telefono,
        correo: cliente.correo,
        direccion: cliente.direccion
    }

    usuariosGlobal = [];

    generarMensaje("green", "Cliente Seleccionado");

    goToStep("origin");
}

function checkCliente(){
    const userSelected = document.getElementById("userSelected");
    const selectUser = document.getElementById("selectUser");
    const tablaClienteResumen = document.getElementById("tablaClienteResumen");

    if(venta.cliente != null){
        userSelected.classList.remove("non-display");
        selectUser.classList.add("non-display");
        tablaClienteResumen.innerHTML = `
            <tr>
                <td>
                    <b>Rut Cliente</b>
                </td>
                <td>
                    ${venta.cliente.rut}
                </td>
            </tr>
            <tr>
                <td>
                    <b>Nombre Cliente</b>
                </td>
                <td>
                    ${venta.cliente.nombre}
                </td>
            </tr>
        `;
    }else{
        userSelected.classList.add("non-display");
        selectUser.classList.remove("non-display");
        tablaClienteResumen.innerHTML = "";
    }
}

function quitarCliente(){
    event.preventDefault();
    venta.cliente = null;
    generarMensaje("green", "Cliente quitado satisfactoriamente")
    checkCliente();
}

function clearInputCliente(){
    document.getElementById('nombreCliente').value = "";
    document.getElementById('rutCliente').value = ""; // Rut del cliente
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("correoCliente").value = "";
    document.getElementById("direccionCliente").value = "";
}

function clearInputClienteNuevo(){
    document.getElementById('nombreClienteNew').value = "";
    document.getElementById('rutClienteNew').value = ""; // Rut del cliente
    document.getElementById("telefonoClienteNew").value = "";
    document.getElementById("correoClienteNew").value = "";
    document.getElementById("direccionClienteNew").value = "";
}

function createClient(){
    event.preventDefault();
    const nombre = document.getElementById('nombreClienteNew').value;
    const rut = document.getElementById('rutClienteNew').value;
    const telefono = document.getElementById("telefonoClienteNew").value;
    const correo = document.getElementById("correoClienteNew").value;
    const direccion = document.getElementById("direccionClienteNew").value;
    venta.cliente = {
        nombre: nombre,
        rut: rut,
        telefono: telefono,
        correo: correo,
        direccion: direccion
    };
    newClient = true;
    clearInputClienteNuevo();
    generarMensaje("green", "Cliente creado satisfactoriamente");
    checkCliente();
    goToStep("origin");
}

