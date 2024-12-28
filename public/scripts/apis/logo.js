async function subirLogo(logoFile) {
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
        const response = await fetch('/api/subirLogo', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data', // 'Content-Type' no es necesario cuando usamos FormData
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar el logo');
        }

        const data = await response.json();

        if (data.success) {
            console.log('Logo cargado correctamente');
            return data.logoPath;  // Ruta del logo cargado
        } else {
            throw new Error('Error al cargar el logo');
        }
    } catch (error) {
        console.error('Error en la subida del logo:', error);
        alert('Hubo un error al cargar el logo.');
    }
}


async function obtenerLogo() {
    try {
        const response = await fetch('http://localhost:3001/api/logo'); // Asegúrate de usar el endpoint correcto
        if (!response.ok) throw new Error('No se pudo obtener el logo');
        const data = await response.json();
        console.log('Logo obtenido:', data.logo);
        return data.logo;  // La ruta del logo
    } catch (error) {
        console.error('Error al obtener el logo:', error);
        return null;
    }
}

