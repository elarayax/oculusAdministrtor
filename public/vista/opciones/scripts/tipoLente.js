// Función para agregar un nuevo método de pago
async function agregarTipoLenteFront() {
    const nombre = document.getElementById('nombreTipoLente').value.trim();

    if (!nombre) {
        generarMensaje("red",'Por favor, completa todos los campos correctamente.');
        return;
    }

    let tipoLente = {
        tipo: nombre,
    }

    try {
        const nuevoTipoLente = await agregarTipoLente(tipoLente);
        if (nuevoTipoLente) {
            generarMensaje("green",'Tipo de lente agregado correctamente.');
            document.getElementById('nombreTipoLente').value = "";
            listarTiposDeLente(); // Actualiza el listado de métodos de pago
        }
    } catch (error) {
        generarMensaje("red",'No fue posible agregar el tipo de lente.');
    }
}

async function listarTiposDeLente() {
    try {
        const tiposLente = await obtenerTiposLente();
        const listadoTipoLentes = document.getElementById('listadoTipoLentes');
        listadoTipoLentes.innerHTML = ''; // Limpiar el contenido previo

        if (!Array.isArray(tiposLente) || tiposLente.length === 0) {
            console.warn('No se encontraron tipos de lente.');
            listadoVendedores.innerHTML = '<tr><td colspan="3">No hay tipos de lentes disponibles.</td></tr>';
            return;
        }

        tiposLente.forEach((tipoLente) => {
            // Verificar si ya existe la fila antes de crear una nueva
            let filaExistente = document.getElementById(`fila-${tipoLente.id}`);
            if (filaExistente) filaExistente.remove();

            const fila = document.createElement('tr');
            fila.id = `fila-${tipoLente.id}`;
            fila.innerHTML = `
                <td><input type="text" value="${tipoLente.tipo}" id="tipoLente-${tipoLente.id}" disabled/></td>
                <td>
                    <button type="button" class="btn btn-secondary" id="editarTipoLenteFront-${tipoLente.id}" onclick="editarTipoLenteFront(${tipoLente.id})">Editar</button>
                    <button type="button" class="btn btn-primary" style="display:none" id="guardarTipoLente-${tipoLente.id}" onclick="guardarCambioTipoLente(${tipoLente.id})">Guardar</button>
                    <button type="button" class="btn btn-danger" onclick="eliminarTipoLenteFront('${tipoLente.tipo}',${tipoLente.id})">Eliminar</button>
                </td>
            `;
            listadoTipoLentes.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar los tipos de lentes:', error);
    }
}

function editarTipoLenteFront(id) {
    const input = document.getElementById(`tipoLente-${id}`);

    if (input) {
        input.disabled = false;
        input.removeAttribute('disabled');
        input.focus();
        document.getElementById(`editarTipoLenteFront-${id}`).style.display  = "none";
        document.getElementById(`guardarTipoLente-${id}`).style.display  = "inline";
    } else {
        console.error(`No se encontró el input con id "nombre-${id}"`);
    }
}

async function guardarCambioTipoLente(id) {
    const input = document.getElementById(`tipoLente-${id}`);
    const nuevoNombre = input.value.trim();
    if (nuevoNombre) {
        datosActualizados = {
            tipo: nuevoNombre,
        }
        try{
            await editarTipoLente(id, datosActualizados);
            generarMensaje("green", "Tipo de lente Actualizado Satisfactoriamente");
            document.getElementById(`editarTipoLenteFront-${id}`).style.display  = "inline";
            document.getElementById(`guardarTipoLente-${id}`).style.display  = "none";
            document.getElementById(`tipoLente-${id}`).disabled;
            listarTiposDeLente();
        }catch(error){
            generarMensaje("red", "No se pudieron actualizar los datos del tipo de lente");
        }
    }           

}

function eliminarTipoLenteFront(nombreVendedor,id){
    abrirModalEliminar(nombreVendedor, "tipo de lente", eliminarTipoLente, listarTiposDeLente, id);
}

listarTiposDeLente();
