// Obtener todos los productos
async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:3001/api/productos');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const productos = await response.json();
        return productos; // Devuelve los datos obtenidos de la API
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

// Agregar un nuevo producto
async function agregarProductoBackend(tipo, nombre, precio, precioSinIva, moneda, unidadDeMedida, descripcion) {
    try {
        const response = await fetch('http://localhost:3001/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipo, nombre, precio, precioSinIva, moneda, unidadDeMedida, descripcion }),
        });
        if (!response.ok) {
            throw new Error('Error al agregar un nuevo producto');
        }
        const data = await response.json();
        return data; // Devuelve el producto recién agregado
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return null;
    }
}

async function actualizarProductosBackend(id, productoActualizado) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoActualizado),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }

        const data = await response.json();
        return data; // Devuelve el producto actualizado
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return null;
    }
}


// Actualizar un campo específico de un producto
async function actualizarCampoProducto(id, campo, valor) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}/${campo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Campo o producto no encontrado');
            }
            throw new Error('Error al actualizar el campo del producto');
        }
        const data = await response.json();
        return data; // Devuelve los datos actualizados
    } catch (error) {
        console.error('Error al actualizar el campo del producto:', error);
        return null;
    }
}

// Eliminar un producto
async function eliminarProductoBackend(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar el producto');
        }

        const data = await response.json();
        return data; // Devuelve el mensaje de éxito y el producto eliminado
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return null;
    }
}

// Buscar un producto por su ID
async function buscarProductoPorId(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}`);
        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }
        const producto = await response.json();
        return producto; // Devuelve el producto encontrado
    } catch (error) {
        console.error('Error al buscar el producto:', error);
        return null; // Retorna null en caso de error
    }
}

