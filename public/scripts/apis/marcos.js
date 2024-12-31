// Obtener todas las marcas y modelos
async function obtenerMarcasYModelos() {
    try {
        const response = await fetch('http://localhost:3001/api/marcas');
        if (!response.ok) {
            throw new Error('Error al obtener las marcas y modelos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las marcas y modelos:', error);
        return null; // Retorna null en caso de error
    }
}

// Agregar una nueva marca
async function agregarMarca(nombre, descripcion) {
    try {
        const response = await fetch('http://localhost:3001/api/marcas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, descripcion }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar una nueva marca');
        }

        const nuevaMarca = await response.json();
        return nuevaMarca; // Devuelve la nueva marca creada
    } catch (error) {
        console.error('Error al agregar la marca:', error);
        return null; // Retorna null en caso de error
    }
}

// Agregar un nuevo modelo
async function agregarModelo(nombre, descripcion, idMarca, stock) {
    try {
        const response = await fetch('http://localhost:3001/api/modelos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, descripcion, idMarca, stock }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar un nuevo modelo');
        }

        const nuevoModelo = await response.json();
        return nuevoModelo; // Devuelve el nuevo modelo creado
    } catch (error) {
        console.error('Error al agregar el modelo:', error);
        return null; // Retorna null en caso de error
    }
}

// Actualizar una marca o modelo
async function actualizarMarcaOModelo(tipo, id, datosActualizados) {
    try {
        const response = await fetch(`http://localhost:3001/api/marcas-modelos/${tipo}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`${tipo === 'marcas' ? 'Marca' : 'Modelo'} no encontrado.`);
            }
            throw new Error(`Error al actualizar el ${tipo === 'marcas' ? 'marca' : 'modelo'}.`);
        }

        const actualizado = await response.json();
        return actualizado; // Devuelve el objeto actualizado
    } catch (error) {
        console.error(`Error al actualizar el ${tipo === 'marcas' ? 'marca' : 'modelo'}:`, error);
        return null; // Retorna null en caso de error
    }
}

// Eliminar una marca o modelo
async function eliminarMarcaOModelo(tipo, id) {
    try {
        const response = await fetch(`http://localhost:3001/api/marcas-modelos/${tipo}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error al eliminar el ${tipo === 'marcas' ? 'marca' : 'modelo'}`);
        }

        const eliminado = await response.json();
        return eliminado; // Devuelve el mensaje de éxito y el objeto eliminado
    } catch (error) {
        console.error(`Error al eliminar el ${tipo === 'marcas' ? 'marca' : 'modelo'}:`, error);
        return null; // Retorna null en caso de error
    }
}
