async function obtenerBoleta() {
    try {
        const response = await fetch('http://localhost:3001/api/boletas');
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No se ha configurado una boleta');
                return null; // Devuelve null si no hay boleta configurada
            }
            throw new Error('Error al obtener la boleta');
        }
        const data = await response.json();
        return data;  // Devuelve la boleta si existe
    } catch (error) {
        console.error('Error al obtener la boleta:', error);
        return null;  // Devuelve null si ocurre un error
    }
}

async function actualizarBoleta(nuevaBoleta) {
    try {
        const response = await fetch('http://localhost:3001/api/boletas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaBoleta), // Enviamos la nueva boleta
        });
        if (!response.ok) throw new Error('Error al actualizar la boleta');
        const data = await response.json();
        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error al actualizar la boleta:', error);
        return null;
    }
}
