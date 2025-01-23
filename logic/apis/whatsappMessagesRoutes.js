const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let qrCodeData = null; // Variable para almacenar el QR temporalmente
let reconnecting = false; // Variable para manejar la reconexión

// Usar userDataPath para obtener la ruta correcta de la aplicación de Electron
const userDataPath = app.getPath('userData');
const whatsappSessionFilePath = path.join(userDataPath, 'whatsapp-session'); // Usamos userDataPath para la sesión

const sessionPath = whatsappSessionFilePath;

// Asegúrate de que el directorio de sesión de WhatsApp exista
if (!fs.existsSync(sessionPath)) {
    console.log("No se encuentra la sesión, generando nuevo QR...");
} else {
    console.log("Sesión encontrada, conectando automáticamente...");
}

// Inicializa el cliente de WhatsApp con persistencia de sesión
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-whatsapp", // Cambia este ID si necesitas varias instancias
        dataPath: sessionPath // Carpeta para guardar la sesión
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
});

// Evento para capturar el QR
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error al generar QR:', err);
            return;
        }
        qrCodeData = url.split(',')[1]; // Solo la parte base64
        console.log('Nuevo QR generado:', qrCodeData);
    });
});

client.on('ready', () => {
    console.log('Cliente listo.');
});

// Evento para manejar errores de autenticación
client.on('auth_failure', (msg) => {
    console.error('Error de autenticación:', msg);
    qrCodeData = null; // Limpia el QR para evitar confusiones
});

// Evento para manejar desconexiones
client.on('disconnected', async (reason) => {
    console.log('Cliente desconectado:', reason);
    if (!reconnecting) {
        reconnecting = true;
        console.log("Intentando reconectar...");
        try {
            await client.initialize();  // Intenta reconectar usando la sesión guardada
            console.log("Reconexión exitosa.");
        } catch (error) {
            console.error("Error al reconectar:", error);
        }
        reconnecting = false;
    }
});

client.initialize().catch((error) => {
    console.error("Error al inicializar el cliente:", error);
});

// Función para limpiar la sesión local
const clearLocalAuth = () => {
    console.log("Limpieza de sesión de WhatsApp iniciada...");
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log('Sesión de WhatsApp eliminada. Se requiere nuevo QR.');
        client.initialize().catch(error => {
            console.error('Error al reiniciar el cliente:', error);
        });
    } else {
        console.log('No se encuentra sesión local.');
    }
};

// Configura las rutas de WhatsApp
const setupWhatsAppRoutes = (app) => {
    app.post('/clear-local-auth', (req, res) => {
        clearLocalAuth();
        res.status(200).json({ message: 'Sesión de WhatsApp eliminada. Se requiere nuevo QR.' });
    });

    app.get('/get-whatsapp-qr', async (req, res) => {
        try {
            if (qrCodeData) {
                res.json({ qr: `data:image/png;base64,${qrCodeData}` }); // Asegúrate de enviar un formato visualizable
            } else {
                console.log("QR no disponible. Esperando que se genere...");
                res.status(404).json({ error: 'No se pudo generar el QR. Intenta nuevamente.' });
            }
        } catch (error) {
            console.error('Error al obtener QR:', error);
            res.status(500).send('Error al generar QR');
        }
    });

    app.post('/send-whatsapp-message', async (req, res) => {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'Faltan parámetros: phoneNumber y message son requeridos.' });
        }

        try {
            const chatId = `${phoneNumber}@c.us`; // Formato del ID de contacto en WhatsApp
            await client.sendMessage(chatId, message);
            res.status(200).json({ success: true, message: 'Mensaje enviado exitosamente.' });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
        }
    });

    app.get('/whatsapp-status', (req, res) => {
        if (client.info) {
            return res.status(200).json({
                connected: true,
                phone: client.info.wid.user,
            });
        }

        res.status(200).json({ connected: false, message: 'Cliente no está conectado.' });
    });

    app.post('/send-whatsapp-image', async (req, res) => {
        const { phoneNumber, image, caption } = req.body;

        if (!phoneNumber || !image) {
            return res.status(400).json({ error: 'Faltan parámetros: phoneNumber e image son requeridos.' });
        }

        try {
            const chatId = `${phoneNumber}@c.us`; // Formato del ID de contacto en WhatsApp
            const media = new MessageMedia('image/png', image.split(',')[1]); // Convierte base64 a MessageMedia
            await client.sendMessage(chatId, media, { caption }); // Envía la imagen con un pie de foto
            res.status(200).json({ success: true, message: 'Imagen enviada exitosamente.' });
        } catch (error) {
            console.error('Error al enviar imagen:', error);
            res.status(500).json({ error: 'No se pudo enviar la imagen.' });
        }
    });
};

module.exports = setupWhatsAppRoutes;
