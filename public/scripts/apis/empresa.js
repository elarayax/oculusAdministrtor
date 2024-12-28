async function obtenerEmpresa() {
    try {
        const response = await fetch(`http://localhost:3001/api/empresa/`);
        if (!response.ok) {
            if (response.status === 404) {
                // Si el archivo está vacío, podemos mostrar un mensaje al usuario
                console.log('No se han configurado los datos de la empresa');
                return null; // Devolvemos null o algún valor adecuado
            }
            throw new Error('Error al obtener los datos de la empresa');
        }
        const data = await response.json();
        return data;  // Devuelve los datos de la empresa si existen
    } catch (error) {
        console.error('Error al obtener los datos de la empresa:', error);
        return null;  // Devuelve null si ocurre un error
    }
}


async function actualizarEmpresa(empresaActualizada) {
    try {
        const response = await fetch(`http://localhost:3001/api/empresa`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresaActualizada),
        });
        if (!response.ok) throw new Error('Error al actualizar los datos de la empresa');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar los datos de la empresa:', error);
        return null;
    }
}

async function actualizarCampoEmpresa(campo, valor) {
    try {
        const response = await fetch(`http://localhost:3001/api/empresa/${campo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor: valor }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Campo no encontrado');
            }
            throw new Error('Error al actualizar el campo de la empresa');
        }

        const data = await response.json();
        return data; // Devuelve el campo actualizado
    } catch (error) {
        console.error('Error al actualizar el campo:', error);
        return null;
    }
}
