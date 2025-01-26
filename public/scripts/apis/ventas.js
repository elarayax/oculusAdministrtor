async function obtenerVentas() {
    try {
        const response = await fetch(`http://localhost:3001/api/ventas`);
        if (!response.ok) throw new Error('Error al obtener la lista de ventas');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        return null;
    }
}

async function agregarVenta(venta) {
    try {
        const response = await fetch(`http://localhost:3001/api/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(venta),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar la venta');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar la venta:', error);
        return null;
    }
}

async function actualizarVenta(id, actualizacion) {
    try {
        const response = await fetch(`http://localhost:3001/api/ventas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actualizacion),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error ${response.status}: ${errorMessage}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        return null;
    }
}

