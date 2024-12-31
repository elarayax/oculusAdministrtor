// Obtener todos los métodos de pago
async function obtenerMetodosPago() {
    try {
        const response = await fetch('http://localhost:3001/api/metodo-pago');
        if (!response.ok) {
            throw new Error('Error al obtener los métodos de pago');
        }
        const metodos = await response.json();
        return metodos; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al obtener los métodos de pago:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

// Agregar un nuevo método de pago
async function agregarMetodoPagoBackend(nombre, comision) {
    try {
        const response = await fetch('http://localhost:3001/api/metodo-pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, comision }),
        });
        if (!response.ok) {
            throw new Error('Error al agregar un nuevo método de pago');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar el método de pago:', error);
        return null;
    }
}

// Actualizar un campo específico de un método de pago
async function actualizarMetodoPagoEnBackend(id, datosActualizados) {
    try {
        const response = await fetch(`http://localhost:3001/api/metodo-pago/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Método de pago no encontrado.');
            }
            throw new Error('Error al actualizar el método de pago.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar el método de pago en el backend:', error);
        return null;
    }
}

// Eliminar un método de pago
async function eliminarMetodoPagoBackend(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/metodo-pago/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar el método de pago');
        }

        const data = await response.json();
        return data; // Devuelve el mensaje de éxito y el método eliminado
    } catch (error) {
        console.error('Error al eliminar el método de pago:', error);
        return null;
    }
}

