// Obtener la lista de convenios
async function obtenerConvenios() {
    try {
        const response = await fetch(`http://localhost:3001/api/convenios`);
        if (!response.ok) throw new Error('Error al obtener la lista de convenios');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los convenios:', error);
        return null;
    }
}

// Agregar un nuevo convenio
async function agregarConvenio(convenio) {
    try {
        const response = await fetch(`http://localhost:3001/api/convenios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(convenio),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar el convenio');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar un convenio:', error);
        return null;
    }
}
