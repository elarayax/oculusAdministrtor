// Obtener todos los clientes
async function obtenerClientes() {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes`);
        if (!response.ok) throw new Error('Error al obtener la lista de clientes');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return null;
    }
}

// Agregar un nuevo cliente
async function agregarCliente(cliente) {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar el cliente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar un cliente:', error);
        return null;
    }
}

// Eliminar un cliente por ID
async function eliminarCliente(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Cliente no encontrado');
            }
            throw new Error('Error al eliminar el cliente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return null;
    }
}

async function obtenerClientesPorFiltro(campo, valor) {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes/filtro?campo=${campo}&valor=${valor}`);
        if (!response.ok) {
            throw new Error('Error al obtener clientes por filtro');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener clientes por filtro:', error);
        return null;
    }
}

async function obtenerClientePorRut(rut) {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes/${rut}`);
        if (!response.ok) {
            throw new Error('Error al obtener clientes por rut');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener clientes por rut:', error);
        return null;
    }
}

// Actualizar un cliente por RUT
async function actualizarClientePorRut(rut, datosActualizados) {
    try {
        const response = await fetch(`http://localhost:3001/api/clientes/${rut}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Cliente no encontrado');
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al actualizar el cliente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return null;
    }
}
