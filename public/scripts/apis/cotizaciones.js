async function obtenerCotizaciones() {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones`);
        if (!response.ok) throw new Error('Error al obtener la lista de cotizaciones');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las cotizaciones:', error);
        return null;
    }
}

async function agregarCotizacion(cotizacion) {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cotizacion),
        });
        if (!response.ok) {
            if (response.status === 400) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            throw new Error('Error al agregar la cotización');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar la cotización:', error);
        return null;
    }
}

async function obtenerCotizacionPorId(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la cotización por ID');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener la cotización por ID:', error);
        return null;
    }
}

async function eliminarCotizacion(id) {
    try {
        const response = await fetch(`http://localhost:3001/api/cotizaciones/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Cotización no encontrada');
            }
            throw new Error('Error al eliminar la cotización');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar la cotización:', error);
        return null;
    }
}

async function obtenerCotizacionesPorFiltro(filtros) {
    try {
        const { fechaInicio, fechaTermino, estadoCotizacion } = filtros;
        const response = await fetch(`http://localhost:3001/api/cotizaciones/buscar?fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}&estadoCotizacion=${estadoCotizacion}`);
        if (!response.ok) {
            throw new Error('Error al obtener cotizaciones por filtro');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener cotizaciones por filtro:', error);
        return null;
    }
}
