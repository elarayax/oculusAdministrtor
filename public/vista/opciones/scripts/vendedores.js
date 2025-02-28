// Función para agregar un nuevo método de pago
async function agregarVendedorFront() {
    const nombre = document.getElementById('nombreVendedor').value.trim();

    if (!nombre) {
        generarMensaje("red",'Por favor, completa todos los campos correctamente.');
        return;
    }

    let vendedor = {
        nombre: nombre,
    }

    try {
        const nuevoVendedor = await agregarVendedor(vendedor);
        if (nuevoVendedor) {
            generarMensaje("green",'Vendedor agregado correctamente.');
            document.getElementById('nombreVendedor').value = "";
            listarVendedores(); // Actualiza el listado de métodos de pago
        }
    } catch (error) {
        generarMensaje("red",'No fue posible agregar el vendedor.');
    }
}

async function listarVendedores() {
    try {
        const vendedores = await obtenerVendedores();
        const listadoVendedores = document.getElementById('listadoVendedores');
        listadoVendedores.innerHTML = ''; // Limpiar el contenido previo

        if (!Array.isArray(vendedores) || vendedores.length === 0) {
            console.warn('No se encontraron vendedores.');
            listadoVendedores.innerHTML = '<tr><td colspan="3">No hay vendedores disponibles.</td></tr>';
            return;
        }

        vendedores.forEach((vendedor) => {
            // Verificar si ya existe la fila antes de crear una nueva
            let filaExistente = document.getElementById(`fila-${vendedor.id}`);
            if (filaExistente) filaExistente.remove();

            const fila = document.createElement('tr');
            fila.id = `fila-${vendedor.id}`;
            fila.innerHTML = `
                <td><input type="text" value="${vendedor.nombre}" id="nombreVendedor-${vendedor.id}" disabled/></td>
                <td>
                    <button type="button" class="btn btn-secondary" id="editarVendedorFront-${vendedor.id}" onclick="editarVendedorFront(${vendedor.id})">Editar</button>
                    <button type="button" class="btn btn-primary" style="display:none" id="guardarVendedor-${vendedor.id}" onclick="guardarCambio(${vendedor.id})">Guardar</button>
                    <button type="button" class="btn btn-danger" onclick="eliminarVendedorFront('${vendedor.nombre}',${vendedor.id})">Eliminar</button>
                </td>
            `;
            listadoVendedores.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar los vendedores:', error);
    }
}

function editarVendedorFront(id) {
    const input = document.getElementById(`nombreVendedor-${id}`);

    if (input) {
        input.disabled = false;
        input.removeAttribute('disabled');
        input.focus();
        document.getElementById(`editarVendedorFront-${id}`).style.display  = "none";
        document.getElementById(`guardarVendedor-${id}`).style.display  = "inline";
    } else {
        console.error(`No se encontró el input con id "nombre-${id}"`);
    }
}

async function guardarCambio(id) {
    const input = document.getElementById(`nombreVendedor-${id}`);
    const nuevoNombre = input.value.trim();
    if (nuevoNombre) {
        datosActualizados = {
            nombre: nuevoNombre,
        }
        try{
            await editarVendedor(id, datosActualizados);
            generarMensaje("green", "Vendedor Actualizado Satisfactoriamente");
            document.getElementById(`editarVendedorFront-${id}`).style.display  = "inline";
            document.getElementById(`guardarVendedor-${id}`).style.display  = "none";
            document.getElementById(`nombreVendedor-${id}`).disabled;
            listarVendedores();
        }catch(error){
            generarMensaje("red", "No se pudieron actualizar los datos del vendedor");
        }
    }           

}

function eliminarVendedorFront(nombreVendedor,id){
    abrirModalEliminar(nombreVendedor, "vendedor", eliminarVendedor, listarVendedores, id);
}

listarVendedores();
