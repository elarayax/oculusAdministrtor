// Obtener todas las monedas
async function obtenerMonedas() {
    try {
        const response = await fetch('http://localhost:3001/api/monedas');
        if (!response.ok) {
            throw new Error('Error al obtener las monedas');
        }
        const monedas = await response.json();
        return monedas; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al obtener las monedas:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

// Agregar una nueva moneda
async function agregarMonedaBackend(nombre, simbolo) {
    try {
        const response = await fetch('http://localhost:3001/api/monedas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, simbolo }),
        });
        if (!response.ok) {
            throw new Error('Error al agregar una nueva moneda');
        }
        const data = await response.json();
        return data; // Devuelve la moneda recién agregada
    } catch (error) {
        console.error('Error al agregar la moneda:', error);
        return null;
    }
}

// Actualizar todas las monedas
async function actualizarMonedasBackend(monedasActualizadas) {
    try {
        const response = await fetch('http://localhost:3001/api/monedas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(monedasActualizadas),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar las monedas');
        }
        const data = await response.json();
        return data; // Devuelve las monedas actualizadas
    } catch (error) {
        console.error('Error al actualizar las monedas:', error);
        return null;
    }
}

// Actualizar un campo específico de una moneda
async function actualizarCampoMoneda(id, campo, valor) {
    try {
        const response = await fetch(`http://localhost:3001/api/monedas/${id}/${campo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Campo o moneda no encontrado');
            }
            throw new Error('Error al actualizar el campo de la moneda');
        }
        const data = await response.json();
        return data; // Devuelve los datos actualizados
    } catch (error) {
        console.error('Error al actualizar el campo de la moneda:', error);
        return null;
    }
}

// Eliminar una moneda
async function eliminarMonedaBackend(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/monedas/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar la moneda');
        }

        const data = await response.json();
        return data; // Devuelve el mensaje de éxito y la moneda eliminada
    } catch (error) {
        console.error('Error al eliminar la moneda:', error);
        return null;
    }
}
