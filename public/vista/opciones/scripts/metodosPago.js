// Función para agregar un nuevo método de pago
async function agregarMetodoPago() {
    const nombre = document.getElementById('nombreMetodo').value.trim();
    const comision = parseFloat(document.getElementById('comisionMetodo').value.trim());

    if (!nombre || isNaN(comision)) {
        generarMensaje("red",'Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const nuevoMetodo = await agregarMetodoPagoBackend(nombre, comision);
        if (nuevoMetodo) {
            generarMensaje("green",'Método de pago agregado correctamente.');
            document.getElementById('nombreMetodo').value = "";
            document.getElementById('comisionMetodo').value = "";
            listarMetodosPago(); // Actualiza el listado de métodos de pago
        }
    } catch (error) {
        generarMensaje("red",'No fue posible agregar el método de pago.');
    }
}

// Función para listar los métodos de pago
async function listarMetodosPago() {
    try {
        const metodos = await obtenerMetodosPago();

        if (!Array.isArray(metodos) || metodos.length === 0) {
            console.warn('No se encontraron métodos de pago.');
            const listadoMetodos = document.getElementById('listadoMétodos');
            listadoMetodos.innerHTML = '<tr><td colspan="3">No hay métodos de pago disponibles.</td></tr>';
            return;
        }

        const listadoMetodos = document.getElementById('listadoMétodos');
        listadoMetodos.innerHTML = ''; // Limpia el contenido previo

        metodos.forEach((metodo) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><input type="text" value="${metodo.nombre}" id="nombre-${metodo.id}" /></td>
                <td><input type="number" value="${metodo.comision}" id="comision-${metodo.id}" /></td>
                <td>
                    <button class="btn btn-success" onclick="actualizarMetodoPago(${metodo.id})">Actualizar</button>
                    <button class="btn btn-danger" onclick="eliminarMetodoPago('${metodo.nombre}', ${metodo.id})">Eliminar</button>
                </td>
            `;
            listadoMetodos.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar los métodos de pago:', error);
    }
}

// Función para actualizar un método de pago
async function actualizarMetodoPago(id) {
    const nombre = document.getElementById(`nombre-${id}`).value.trim();
    const comision = parseFloat(document.getElementById(`comision-${id}`).value.trim());

    if (!nombre || isNaN(comision)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    const metodoActualizado = {
        nombre,
        comision,
    };

    try {
        const resultado = await actualizarMetodoPagoEnBackend(id, metodoActualizado);
        if (resultado) {
            generarMensaje("green",'Método de pago actualizado correctamente.');
            listarMetodosPago(); // Refrescar el listado
        }
    } catch (error) {
        console.error('Error al actualizar el método de pago:', error);
        generarMensaje("red",'Error al actualizar el método de pago.');
    }
}

function eliminarMetodoPago(nombre,id){
    abrirModalEliminar(nombre, "método de pago", eliminarMetodoPagoBackend, listarMetodosPago, id);
}

// Ejecutar al cargar la página para listar los métodos
listarMetodosPago();
