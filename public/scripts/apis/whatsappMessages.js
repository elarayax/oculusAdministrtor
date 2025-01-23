async function obtenerWhatsappQR() {
    try {
        const qrResponse = await fetch('http://localhost:3001/get-whatsapp-qr');
        const qrData = await qrResponse.json();
        if (qrData.qr) {
            return qrData.qr; // Devuelve la URL del QR como data:image/png;base64
        }
    } catch (error) {
        console.error("Error al obtener el QR:", error);
        return null;
    }
}


async function enviarMensajeWhatsapp(phoneNumber, message) {
    try {
        const response = await fetch('http://localhost:3001/send-whatsapp-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, message }), // Enviamos el número y el mensaje
        });
        if (!response.ok) throw new Error('Error al enviar el mensaje');
        const data = await response.json();
        return data;  // Devuelve el resultado del envío del mensaje
    } catch (error) {
        console.error('Error al enviar el mensaje de WhatsApp:', error);
        return null;
    }
}

async function obtenerEstadoWhatsapp() {
    try {
        const response = await fetch('http://localhost:3001/whatsapp-status');
        if (!response.ok) throw new Error('Error al verificar el estado de WhatsApp');
        const data = await response.json();
        return data;  // Devuelve el estado de conexión del cliente
    } catch (error) {
        console.error('Error al verificar el estado de WhatsApp:', error);
        return null;
    }
}

async function enviarImagenWhatsapp(phoneNumber, image, caption) {
    try {
        const response = await fetch('http://localhost:3001/send-whatsapp-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, image, caption }), // Enviamos el número, la imagen en base64 y la leyenda
        });
        if (!response.ok) throw new Error('Error al enviar la imagen');
        const data = await response.json();
        return data;  // Devuelve el resultado del envío de la imagen
    } catch (error) {
        console.error('Error al enviar la imagen de WhatsApp:', error);
        return null;
    }
}

async function clearWhatsappAuth() {
    try {
        const response = await fetch('http://localhost:3001/clear-local-auth', {
            method: 'POST',
        });

        const data = await response.json();
        console.log(data.message);  // Muestra el mensaje de respuesta

    } catch (error) {
        console.error('Error al limpiar la autenticación de WhatsApp:', error);
    }
}