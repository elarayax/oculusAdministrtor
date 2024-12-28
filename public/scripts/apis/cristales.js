
async function obtenerCristales() {
    try {
        const response = await fetch(`http://localhost:3001/api/cristales`);
        if (!response.ok) throw new Error('Error al obtener la lista de cristales');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los cristales:', error);
        return null;
    }
}

async function agregarEsfera(idCristal, cilindro) {
    try {
        const response = await fetch(`http://localhost:3001/api/cristales/${idCristal}/cilindros/${cilindro}/esferas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error al agregar la esfera');

        const data = await response.json();
        console.log('Esfera agregada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al agregar la esfera:', error);
        return null;
    }
}

async function guardarCilindro(idCristal, cilindro, esferasActualizadas) {
    try {
        const response = await fetch(`/api/cristales/${idCristal}/cilindros/${cilindro}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ esferas: esferasActualizadas })
        });

        const resultado = await response.json();

        if (response.ok) {
            console.log('Cilindro actualizado:', resultado);
        } else {
            console.error('Error al actualizar cilindro:', resultado.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

async function agregarCilindroBack(idCristal) {
    try {
        const response = await fetch(`/api/cristales/${idCristal}/nuevo-cilindro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resultado = await response.json();

        if (response.ok) {
            console.log('Cilindro creado:', resultado);
        } else {
            console.error('Error al crear cilindro:', resultado.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

async function eliminarVariante(idCristal, idVariante) {
    try {
        const response = await fetch(`http://localhost:3001/api/cristales/${idCristal}/variantes/${idVariante}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la variante');
        }

        const data = await response.json();
        console.log('Variante eliminada exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al eliminar la variante:', error);
        return null;
    }
}

async function actualizarVariante(idCristal, idVariante, nuevoNombre, descripcion, observacion) {
    const payload = {
        nombreVariante: nuevoNombre,
        descripcion: descripcion || '', // Si no se proporciona, puede ser vacío
        observacion: observacion || ''  // Lo mismo para observación
    };

    const response = await fetch(`/api/cristales/${idCristal}/variantes/${idVariante}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("No se pudo actualizar la variante.");
    }
    return await response.json();
}

async function agregarCristal(nuevoCristal) {
    try {
        const response = await fetch(`http://localhost:3001/api/cristales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoCristal) // Aquí envías el objeto con los datos del cristal
        });

        if (!response.ok) {
            throw new Error('Error al crear el cristal');
        }

        const data = await response.json();
        console.log('Cristal creado exitosamente:', data);
        return data; // Devuelves los datos del cristal creado
    } catch (error) {
        console.error('Error al crear el cristal:', error);
        return null;
    }
}
