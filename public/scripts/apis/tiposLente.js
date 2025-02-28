// Obtener la lista de convenios
async function obtenerTiposLente() {
    try {
        const response = await fetch(`http://localhost:3001/api/tipoLentes`);
        if (!response.ok) throw new Error('Error al obtener la lista de tipos de lentes');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los tipos de lente:', error);
        return null;
    }
}

// Agregar un nuevo convenio
async function agregarTipoLente(tipoLente) {
    try {
        const response = await fetch(`http://localhost:3001/api/tipoLentes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tipoLente),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar el tipo de lente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar un tipo de lente:', error);
        return null;
    }
}

// Editar un vendedor por ID
async function editarTipoLente(id, datosActualizados) {
    try {
        const response = await fetch(`http://localhost:3001/api/tipoLentes/${id}`, {
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
            throw new Error('Error al editar el tipo de lente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar el tipo de lente:', error);
        return null;
    }
}

// Eliminar un vendedor por ID
async function eliminarTipoLente(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/tipoLentes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al eliminar el tipo de lente');
        }
        return true; // Indica que la eliminación fue exitosa
    } catch (error) {
        console.error('Error al eliminar el tipo de lente:', error);
        return false;
    }
}