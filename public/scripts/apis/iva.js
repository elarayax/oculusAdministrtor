async function obtenerIva() {
    try {
        const response = await fetch('http://localhost:3001/api/iva');
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No se ha configurado el IVA');
                return null; // Devuelve null si no hay IVA configurado
            }
            throw new Error('Error al obtener el IVA');
        }
        const data = await response.json();
        return data;  // Devuelve los datos del IVA si existen
    } catch (error) {
        console.error('Error al obtener el IVA:', error);
        return null;  // Devuelve null si ocurre un error
    }
}

async function actualizarIva(nuevoIva) {
    try {
        const response = await fetch('http://localhost:3001/api/iva', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ valor: nuevoIva }), // Enviamos el nuevo valor del IVA
        });
        if (!response.ok) throw new Error('Error al actualizar el IVA');
        const data = await response.json();
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error al actualizar el IVA:', error);
        return null;
    }
}
