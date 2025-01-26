const API_BASE_URL = 'http://localhost:3001/api/unidad-medida';

// Función para agregar una nueva unidad de medida
async function agregarUnidadMedida() {
    const nombre = document.getElementById('unidadMedida').value.trim();
    const abreviacion = document.getElementById('abreviacionUnidad').value.trim();

    if (!nombre || !abreviacion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        // Llamar a la función de agregar unidad de medida correctamente
        const nuevaUnidad = await agregarUnidadMedidaBackend(nombre, abreviacion);
        if (nuevaUnidad) {
            // Si se agrega correctamente, actualiza el listado de unidades
            listarUnidadesMedida();
        }
    } catch (error) {
        alert("No fue posible agregar la unidad de medida");
    }
}

async function listarUnidadesMedida() {
    try {
        const unidades = await obtenerUnidadesMedida();
        
        if (!Array.isArray(unidades) || unidades.length === 0) {
            console.warn('No se encontraron unidades de medida.');
            const listadoUnidades = document.getElementById('listadoUnidades');
            listadoUnidades.innerHTML = '<tr><td colspan="3">No hay unidades de medida disponibles.</td></tr>';
            return;
        }

        const listadoUnidades = document.getElementById('listadoUnidades');
        listadoUnidades.innerHTML = ''; // Limpiar el contenido antes de agregar nuevas filas

        unidades.forEach((unidad) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><input type="text" value="${unidad.nombre}" id="nombre-${unidad.id}" /></td>
                <td><input type="text" value="${unidad.abreviacion}" id="abreviacion-${unidad.id}" /></td>
                <td>
                    <button class="btn btn-success" onclick="actualizarUnidadMedida(${unidad.id})">Actualizar</button>
                    <button class="btn btn-danger" onclick="eliminarUnidadMedida('${unidad.nombre}',${unidad.id})">Eliminar</button>
                </td>
            `;
            listadoUnidades.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al listar las unidades de medida:', error);
    }
}


// Función para actualizar una unidad de medida
async function actualizarUnidadMedida(id) {
    const nombre = document.getElementById(`nombre-${id}`).value.trim();
    const abreviacion = document.getElementById(`abreviacion-${id}`).value.trim();

    if (!nombre || !abreviacion) {
        alert('Por favor, completa todos los campos antes de actualizar.');
        return;
    }

    let unidadNueva = {
        id,
        nombre,
        abreviacion
    };

    try {
        // Llamar a la función de actualizar en el backend
        const unidadActualizada = await actualizarUnidadesMedidaBackend(unidadNueva);
        if (unidadActualizada) {
            alert('Unidad de medida actualizada correctamente.');
            listarUnidadesMedida(); // Refrescar la lista de unidades
        }
    } catch (error) {
        alert('Error al actualizar la unidad de medida');
    }
}

// Función para eliminar una unidad de medida
async function eliminarUnidadMedida(nombre, id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la unidad de medida ${nombre}?`)) {
        return;
    }

    try {
        // Esperar la respuesta de la función de eliminación
        const resultado = await eliminarUnidadMedidaBackEnd(id);
        
        if (resultado) {
            alert('Unidad de medida eliminada correctamente.');
            listarUnidadesMedida(); // Listar nuevamente las unidades actualizadas
        } else {
            alert('No se pudo eliminar la unidad de medida.');
        }
    } catch (error) {
        alert('Error al eliminar la unidad de medida:', error);
    }
}


//listarUnidadesMedida();
