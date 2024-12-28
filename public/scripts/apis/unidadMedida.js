// Obtener todas las unidades de medida
async function obtenerUnidadesMedida() {
    try {
        const response = await fetch('http://localhost:3001/api/unidad-medida');
        if (!response.ok) {
            throw new Error('Error al obtener las unidades de medida');
        }
        const unidades = await response.json();
        return unidades;  // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al obtener las unidades de medida:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}


// Agregar una nueva unidad de medida
async function agregarUnidadMedidaBackend(nombre, abreviacion) {
    try {
        const response = await fetch('http://localhost:3001/api/unidad-medida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, abreviacion }),
        });
        if (!response.ok) {
            throw new Error('Error al agregar una nueva unidad de medida');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar la unidad de medida:', error);
        return null;
    }
}

// Actualizar todas las unidades de medida
async function actualizarUnidadesMedidaBackend(unidadActualizada) {
    try {
        const response = await fetch('http://localhost:3001/api/unidad-medida', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(unidadActualizada),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar las unidades de medida');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar las unidades de medida:', error);
        return null;
    }
}

// Actualizar un campo específico de una unidad de medida
async function actualizarCampoUnidadMedida(campo, valor) {
    try {
        const response = await fetch(`http://localhost:3001/api/unidad-medida/${campo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Campo no encontrado');
            }
            throw new Error('Error al actualizar el campo de la unidad de medida');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar el campo:', error);
        return null;
    }
}

// Eliminar una unidad de medida
async function eliminarUnidadMedidaBackEnd(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/unidad-medida/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar la unidad de medida');
        }
        
        const data = await response.json();
        return data;  // Devuelve el mensaje de éxito y la unidad eliminada
    } catch (error) {
        console.error('Error al eliminar la unidad de medida:', error);
        return null;
    }
}


