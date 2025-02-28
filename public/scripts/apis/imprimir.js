async function obtenerImpresoras() {
    try {
        const response = await fetch('http://localhost:3001/api/impresoras');
        if (!response.ok) throw new Error('Error al obtener la lista de impresoras');
        const data = await response.json();
        return data; // Devuelve la lista de impresoras
    } catch (error) {
        console.error('Error al obtener impresoras:', error);
        return [];
    }
}

async function imprimirTicket(ticketData) {
    try {
        const response = await fetch('http://localhost:3001/api/imprimir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData), // Enviamos los datos del ticket
        });

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); // Leer la respuesta como texto
            throw new Error(text || 'Error desconocido al imprimir el ticket');
        }

        const data = await response.json(); // Leer la respuesta como JSON
        if (!response.ok) {
            throw new Error(data.message || 'Error al imprimir el ticket');
        }

        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error al imprimir el ticket:', error.message);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

async function imprimirInforme(ticketData) {
    try {
        const response = await fetch('http://localhost:3001/api/imprimir-informe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData), // Enviamos los datos del ticket
        });

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); // Leer la respuesta como texto
            throw new Error(text || 'Error desconocido al imprimir el informe');
        }

        const data = await response.json(); // Leer la respuesta como JSON
        if (!response.ok) {
            throw new Error(data.message || 'Error al imprimir el informe');
        }

        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error al imprimir el informe:', error.message);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}

async function imprimirInformeSemanal(ticketData) {
    try {
        const response = await fetch('http://localhost:3001/api/imprimir-informe-semanal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData), // Enviamos los datos del ticket
        });

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); // Leer la respuesta como texto
            throw new Error(text || 'Error desconocido al imprimir el informe');
        }

        const data = await response.json(); // Leer la respuesta como JSON
        if (!response.ok) {
            throw new Error(data.message || 'Error al imprimir el informe');
        }

        return data; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error al imprimir el informe:', error.message);
        throw error; // Lanzar el error para que sea manejado por el código que llama a esta función
    }
}