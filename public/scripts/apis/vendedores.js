// Obtener la lista de convenios
async function obtenerVendedores() {
    try {
        const response = await fetch(`http://localhost:3001/api/vendedores`);
        if (!response.ok) throw new Error('Error al obtener la lista de vendedores');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los vendedores:', error);
        return null;
    }
}

// Agregar un nuevo convenio
async function agregarVendedor(vendedor) {
    try {
        const response = await fetch(`http://localhost:3001/api/vendedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedor),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar el vendedor');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar un vendedor:', error);
        return null;
    }
}

// Editar un vendedor por ID
async function editarVendedor(id, datosActualizados) {
    try {
        const response = await fetch(`http://localhost:3001/api/vendedores/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });
        if (!response.ok) {
            if (response.status === 400 || response.status === 404) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al editar el vendedor');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar el vendedor:', error);
        return null;
    }
}

// Eliminar un vendedor por ID
async function eliminarVendedor(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/vendedores/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al eliminar el vendedor');
        }
        return true; // Indica que la eliminación fue exitosa
    } catch (error) {
        console.error('Error al eliminar el vendedor:', error);
        return false;
    }
}